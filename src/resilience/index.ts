const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export type ScheduleDecision<State, Output> = {
  cont: boolean
  delay: number
  state: State
  output: Output
}

type ScheduleStep<Input, State, Output> = (input: Input, state: State) => ScheduleDecision<State, Output>

export class Schedule<Input, State, Output> {
  constructor(
    private readonly initialFactory: () => State,
    private readonly step: ScheduleStep<Input, State, Output>
  ) {}

  get initialState(): State {
    return this.initialFactory()
  }

  advance(input: Input, state: State): ScheduleDecision<State, Output> {
    return this.step(input, state)
  }

  map<R>(transform: (output: Output) => R): Schedule<Input, State, R> {
    return new Schedule<Input, State, R>(
      () => this.initialFactory(),
      (input, state) => {
        const decision = this.step(input, state)
        return {
          cont: decision.cont,
          delay: decision.delay,
          state: decision.state,
          output: transform(decision.output),
        }
      }
    )
  }

  and<OtherState, OtherOutput>(
    other: Schedule<Input, OtherState, OtherOutput>
  ): Schedule<Input, [State, OtherState], [Output, OtherOutput]> {
    return new Schedule<Input, [State, OtherState], [Output, OtherOutput]>(
      () => [this.initialFactory(), other.initialState],
      (input, [stateA, stateB]) => {
        const decisionA = this.step(input, stateA)
        const decisionB = other.advance(input, stateB)
        return {
          cont: decisionA.cont && decisionB.cont,
          delay: Math.max(decisionA.delay, decisionB.delay),
          state: [decisionA.state, decisionB.state],
          output: [decisionA.output, decisionB.output],
        }
      }
    )
  }

  or<OtherState, OtherOutput>(
    other: Schedule<Input, OtherState, OtherOutput>
  ): Schedule<Input, [State, OtherState], [Output, OtherOutput]> {
    return new Schedule<Input, [State, OtherState], [Output, OtherOutput]>(
      () => [this.initialFactory(), other.initialState],
      (input, [stateA, stateB]) => {
        const decisionA = this.step(input, stateA)
        const decisionB = other.advance(input, stateB)
        return {
          cont: decisionA.cont || decisionB.cont,
          delay: Math.min(decisionA.delay, decisionB.delay),
          state: [decisionA.state, decisionB.state],
          output: [decisionA.output, decisionB.output],
        }
      }
    )
  }

  andThen<OtherState, OtherOutput>(
    other: Schedule<Input, OtherState, OtherOutput>
  ): Schedule<Input, { phase: 'first'; state: State } | { phase: 'second'; state: OtherState }, Output | OtherOutput> {
    type PhaseState = { phase: 'first'; state: State } | { phase: 'second'; state: OtherState }
    return new Schedule<Input, PhaseState, Output | OtherOutput>(
      () => ({ phase: 'first', state: this.initialFactory() }),
      (input, current) => {
        if (current.phase === 'first') {
          const decision = this.step(input, current.state)
          if (decision.cont) {
            return {
              cont: true,
              delay: decision.delay,
              state: { phase: 'first', state: decision.state },
              output: decision.output,
            }
          }
          return {
            cont: true,
            delay: decision.delay,
            state: { phase: 'second', state: other.initialState },
            output: decision.output,
          }
        }

        const decision = other.advance(input, current.state)
        return {
          cont: decision.cont,
          delay: decision.delay,
          state: { phase: 'second', state: decision.state },
          output: decision.output,
        }
      }
    )
  }

  zipLeft<OtherState, OtherOutput>(
    other: Schedule<Input, OtherState, OtherOutput>
  ): Schedule<Input, [State, OtherState], Output> {
    return this.and(other).map(([left]) => left)
  }

  zipRight<OtherState, OtherOutput>(
    other: Schedule<Input, OtherState, OtherOutput>
  ): Schedule<Input, [State, OtherState], OtherOutput> {
    return this.and(other).map(([, right]) => right)
  }

  jittered(maxFactor: number = 0.1, rng: () => number = Math.random): Schedule<Input, State, Output> {
    return new Schedule<Input, State, Output>(
      () => this.initialFactory(),
      (input, state) => {
        const decision = this.step(input, state)
        const fraction = Math.max(0, Math.min(1, rng()))
        const jitter = decision.delay * maxFactor * fraction
        return {
          cont: decision.cont,
          delay: Math.max(0, decision.delay + jitter),
          state: decision.state,
          output: decision.output,
        }
      }
    )
  }

  async retry<A>(action: () => A | Promise<A>): Promise<A> {
    let state = this.initialFactory()

    while (true) {
      try {
        return await Promise.resolve(action())
      } catch (error) {
        const decision = this.step(error as Input, state)

        if (!decision.cont) {
          throw error
        }

        state = decision.state

        if (decision.delay > 0) {
          await sleep(decision.delay)
        }
      }
    }
  }

  async repeat(action: () => Input | Promise<Input>): Promise<Output> {
    let state = this.initialFactory()

    while (true) {
      const input = await Promise.resolve(action())
      const decision = this.step(input, state)

      if (!decision.cont) {
        return decision.output
      }

      state = decision.state

      if (decision.delay > 0) {
        await sleep(decision.delay)
      }
    }
  }

  async repeatOrElse<R>(
    action: () => Input | Promise<Input>,
    orElse: (error: unknown, lastOutput: Output | undefined) => R
  ): Promise<Output | R> {
    let state = this.initialFactory()
    let lastOutput: Output | undefined

    try {
      while (true) {
        const input = await Promise.resolve(action())
        const decision = this.step(input, state)
        lastOutput = decision.output

        if (!decision.cont) {
          return decision.output
        }

        state = decision.state

        if (decision.delay > 0) {
          await sleep(decision.delay)
        }
      }
    } catch (error) {
      return orElse(error, lastOutput)
    }
  }

  repeatSync(action: () => Input): Output {
    let state = this.initialFactory()

    while (true) {
      const input = action()
      const decision = this.step(input, state)

      if (!decision.cont) {
        return decision.output
      }

      state = decision.state

      if (decision.delay > 0) {
        const end = Date.now() + decision.delay
        while (Date.now() < end) {
          /* busy wait */
        }
      }
    }
  }

  retrySync<A>(action: () => A): A {
    let state = this.initialFactory()

    while (true) {
      try {
        return action()
      } catch (error) {
        const decision = this.step(error as Input, state)

        if (!decision.cont) {
          throw error
        }

        state = decision.state

        if (decision.delay > 0) {
          const end = Date.now() + decision.delay
          while (Date.now() < end) {
            /* busy wait */
          }
        }
      }
    }
  }

  static recurs<A = unknown>(n: number): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => 0,
      (_, count) => {
        const shouldContinue = count < n
        return {
          cont: shouldContinue,
          delay: 0,
          state: count + 1,
          output: shouldContinue ? count : count + 1,
        }
      }
    )
  }

  static exponential<A = unknown>(
    baseDelay: number,
    factor: number = 2
  ): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => baseDelay,
      (_, currentDelay) => ({
        cont: true,
        delay: currentDelay,
        state: currentDelay * factor,
        output: currentDelay,
      })
    )
  }

  static fibonacci<A = unknown>(baseDelay: number): Schedule<A, { prev: number; curr: number }, number> {
    type FibState = { prev: number; curr: number }
    return new Schedule<A, FibState, number>(
      () => ({ prev: 0, curr: baseDelay }),
      (_, state) => {
        const output = state.curr
        const next: FibState = {
          prev: state.curr,
          curr: state.prev + state.curr,
        }
        return {
          cont: true,
          delay: output,
          state: next,
          output,
        }
      }
    )
  }

  static spaced<A = unknown>(delay: number): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => 0,
      (_, count) => ({
        cont: true,
        delay,
        state: count + 1,
        output: count + 1,
      })
    )
  }

  static linear<A = unknown>(baseDelay: number): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => baseDelay,
      (_, currentDelay) => ({
        cont: true,
        delay: currentDelay,
        state: currentDelay + baseDelay,
        output: currentDelay,
      })
    )
  }

  static identity<A>(): Schedule<A, void, A> {
    return new Schedule<A, void, A>(
      () => undefined,
      (input) => ({
        cont: true,
        delay: 0,
        state: undefined,
        output: input,
      })
    )
  }

  static collect<A>(): Schedule<A, A[], readonly A[]> {
    return new Schedule<A, A[], readonly A[]>(
      () => [],
      (input, state) => {
        state.push(input)
        return {
          cont: true,
          delay: 0,
          state,
          output: state.slice(),
        }
      }
    )
  }

  static forever<A = unknown>(): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => 0,
      (_, count) => ({
        cont: true,
        delay: 0,
        state: count + 1,
        output: count + 1,
      })
    )
  }

  static doWhile<A>(predicate: (input: A, state: number) => boolean): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => 0,
      (input, count) => ({
        cont: predicate(input, count),
        delay: 0,
        state: count + 1,
        output: count + 1,
      })
    )
  }

  static doUntil<A>(predicate: (input: A, state: number) => boolean): Schedule<A, number, number> {
    return new Schedule<A, number, number>(
      () => 0,
      (input, count) => ({
        cont: !predicate(input, count),
        delay: 0,
        state: count + 1,
        output: count + 1,
      })
    )
  }
}

export async function retry<A, Input, State, Output>(
  schedule: Schedule<Input, State, Output>,
  action: () => A | Promise<A>
): Promise<A> {
  return schedule.retry(action)
}

export async function repeat<Input, State, Output>(
  schedule: Schedule<Input, State, Output>,
  action: () => Input | Promise<Input>
): Promise<Output> {
  return schedule.repeat(action)
}

export function repeatSync<Input, State, Output>(
  schedule: Schedule<Input, State, Output>,
  action: () => Input
): Output {
  return schedule.repeatSync(action)
}

export function retrySync<A, Input, State, Output>(
  schedule: Schedule<Input, State, Output>,
  action: () => A
): A {
  return schedule.retrySync(action)
}
