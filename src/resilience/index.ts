export type ScheduleDecision<State> = {
  cont: boolean
  delay: number
  state: State
}

export class Schedule<Input, Output> {
  constructor(
    private readonly initial: Output,
    private readonly update: (
      input: Input,
      state: Output
    ) => ScheduleDecision<Output>
  ) {}

  static recurs<A = unknown>(n: number): Schedule<A, number> {
    return new Schedule(0, (_, count) => ({
      cont: count < n,
      delay: 0,
      state: count + 1,
    }))
  }

  static exponential<A = unknown>(
    baseDelay: number,
    factor: number = 2.0
  ): Schedule<A, number> {
    return new Schedule(baseDelay, (_, currentDelay) => ({
      cont: true,
      delay: currentDelay,
      state: currentDelay * factor,
    }))
  }

  static fibonacci<A = unknown>(baseDelay: number): Schedule<A, number> {
    return new Schedule({ prev: 0, curr: baseDelay }, (_, { prev, curr }) => ({
      cont: true,
      delay: curr,
      state: { prev: curr, curr: prev + curr },
    })) as any
  }

  static spaced<A = unknown>(delay: number): Schedule<A, number> {
    return new Schedule(0, (_, count) => ({
      cont: true,
      delay,
      state: count + 1,
    }))
  }

  static linear<A = unknown>(baseDelay: number): Schedule<A, number> {
    return new Schedule(baseDelay, (_, currentDelay) => ({
      cont: true,
      delay: currentDelay,
      state: currentDelay + baseDelay,
    }))
  }

  static identity<A>(): Schedule<A, A> {
    return new Schedule(null as any, (input) => ({
      cont: true,
      delay: 0,
      state: input,
    }))
  }

  static collect<A>(): Schedule<A, A[]> {
    return new Schedule([], (input, collected) => ({
      cont: true,
      delay: 0,
      state: [...collected, input],
    }))
  }

  static forever<A = unknown>(): Schedule<A, number> {
    return new Schedule(0, (_, count) => ({
      cont: true,
      delay: 0,
      state: count + 1,
    }))
  }

  static doWhile<A>(
    predicate: (input: A, state: number) => boolean
  ): Schedule<A, number> {
    return new Schedule(0, (input, count) => ({
      cont: predicate(input, count),
      delay: 0,
      state: count + 1,
    }))
  }

  static doUntil<A>(
    predicate: (input: A, state: number) => boolean
  ): Schedule<A, number> {
    return new Schedule(0, (input, count) => ({
      cont: !predicate(input, count),
      delay: 0,
      state: count + 1,
    }))
  }

  and<B>(other: Schedule<Input, B>): Schedule<Input, [Output, B]> {
    return new Schedule(
      [this.initial, other.initial] as [Output, B],
      (input, [stateA, stateB]) => {
        const decisionA = this.update(input, stateA)
        const decisionB = other.update(input, stateB)
        return {
          cont: decisionA.cont && decisionB.cont,
          delay: Math.max(decisionA.delay, decisionB.delay),
          state: [decisionA.state, decisionB.state] as [Output, B],
        }
      }
    )
  }

  or<B>(other: Schedule<Input, B>): Schedule<Input, [Output, B]> {
    return new Schedule(
      [this.initial, other.initial] as [Output, B],
      (input, [stateA, stateB]) => {
        const decisionA = this.update(input, stateA)
        const decisionB = other.update(input, stateB)
        return {
          cont: decisionA.cont || decisionB.cont,
          delay: Math.min(decisionA.delay, decisionB.delay),
          state: [decisionA.state, decisionB.state] as [Output, B],
        }
      }
    )
  }

  andThen<B>(next: Schedule<Input, B>): Schedule<Input, Output | B> {
    return new Schedule(
      { tag: 'first' as const, state: this.initial },
      (input, current) => {
        if (current.tag === 'first') {
          const decision = this.update(input, current.state)
          if (decision.cont) {
            return {
              cont: true,
              delay: decision.delay,
              state: { tag: 'first' as const, state: decision.state },
            }
          }
          return {
            cont: true,
            delay: decision.delay,
            state: { tag: 'second' as const, state: next.initial },
          }
        }
        const decision = next.update(input, current.state)
        return {
          cont: decision.cont,
          delay: decision.delay,
          state: { tag: 'second' as const, state: decision.state },
        }
      }
    ) as any
  }

  zipLeft<B>(other: Schedule<Input, B>): Schedule<Input, Output> {
    return this.and(other).map(([a]) => a)
  }

  zipRight<B>(other: Schedule<Input, B>): Schedule<Input, B> {
    return this.and(other).map(([, b]) => b)
  }

  map<B>(fn: (output: Output) => B): Schedule<Input, B> {
    return new Schedule(fn(this.initial), (input, prevMapped) => {
      const origState = this.initial
      const decision = this.update(input, origState as any)
      return {
        cont: decision.cont,
        delay: decision.delay,
        state: fn(decision.state),
      }
    })
  }

  jittered(maxFactor: number = 0.1): Schedule<Input, Output> {
    return new Schedule(this.initial, (input, state) => {
      const decision = this.update(input, state)
      const jitter = Math.random() * maxFactor * decision.delay
      return {
        cont: decision.cont,
        delay: decision.delay + jitter,
        state: decision.state,
      }
    })
  }

  async retry<A>(action: () => Promise<A>): Promise<A> {
    let state = this.initial
    let attempts = 0

    while (true) {
      try {
        return await action()
      } catch (error) {
        const decision = this.update(error as Input, state)

        if (!decision.cont) {
          throw error
        }

        state = decision.state
        attempts++

        if (decision.delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, decision.delay))
        }
      }
    }
  }

  async repeat<A>(action: () => Promise<A>): Promise<Output> {
    let state = this.initial
    let result: A = await action()

    while (true) {
      const decision = this.update(result as Input, state)

      if (!decision.cont) {
        return decision.state
      }

      state = decision.state

      if (decision.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, decision.delay))
      }

      result = await action()
    }
  }

  async repeatOrElse<A, B>(
    action: () => Promise<A>,
    orElse: (error: unknown, state: Output) => B
  ): Promise<Output | B> {
    let state = this.initial

    try {
      let result: A = await action()

      while (true) {
        const decision = this.update(result as Input, state)

        if (!decision.cont) {
          return decision.state
        }

        state = decision.state

        if (decision.delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, decision.delay))
        }

        result = await action()
      }
    } catch (error) {
      return orElse(error, state)
    }
  }
}

export async function retry<A>(
  schedule: Schedule<unknown, unknown>,
  action: () => Promise<A>
): Promise<A> {
  return schedule.retry(action)
}

export async function repeat<A, Output>(
  schedule: Schedule<A, Output>,
  action: () => Promise<A>
): Promise<Output> {
  return schedule.repeat(action)
}

export function repeatSync<A, Output>(
  schedule: Schedule<A, Output>,
  action: () => A
): Output {
  let state = schedule['initial']
  let result: A = action()

  while (true) {
    const decision = schedule['update'](result, state)

    if (!decision.cont) {
      return decision.state
    }

    state = decision.state
    result = action()
  }
}

export function retrySync<A>(
  schedule: Schedule<unknown, unknown>,
  action: () => A
): A {
  let state = schedule['initial']

  while (true) {
    try {
      return action()
    } catch (error) {
      const decision = schedule['update'](error, state)

      if (!decision.cont) {
        throw error
      }

      state = decision.state
    }
  }
}
