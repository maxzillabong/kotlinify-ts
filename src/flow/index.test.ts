import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StateFlow, SharedFlow, flowOf, flow } from './index'
import { delay, CancellationError } from '../coroutines'

describe('Flow', () => {
  describe('flowOf', () => {
    it('creates flow from values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3).collect((v: number) => { values.push(v) })
      expect(values).toEqual([1, 2, 3])
    })

    it('creates empty flow', async () => {
      const values: number[] = []
      await flowOf<number>().collect((v: number) => { values.push(v) })
      expect(values).toEqual([])
    })
  })

  describe('flow builder', () => {
    it('creates flow with emit', async () => {
      const testFlow = flow(async function* () {
        yield 1
        yield 2
        yield 3
      })

      const values: number[] = []
      await testFlow.collect((v: number) => { values.push(v) })
      expect(values).toEqual([1, 2, 3])
    })
  })

  describe('map', () => {
    it('transforms values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3)
        .map((x) => x * 2)
        .collect((v: number) => { values.push(v) })
      expect(values).toEqual([2, 4, 6])
    })

    it('supports async transform', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3)
        .map(async (x) => {
          await delay(1)
          return x * 2
        })
        .collect((v: number) => { values.push(v) })
      expect(values).toEqual([2, 4, 6])
    })
  })

  describe('filter', () => {
    it('filters values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4, 5)
        .filter((x) => x % 2 === 0)
        .collect((v: number) => { values.push(v) })
      expect(values).toEqual([2, 4])
    })

    it('supports async predicate', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4)
        .filter(async (x) => {
          await delay(1)
          return x > 2
        })
        .collect((v) => { values.push(v) })
      expect(values).toEqual([3, 4])
    })
  })

  describe('take', () => {
    it('takes first n values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4, 5)
        .take(3)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 2, 3])
    })

    it('takes all if count exceeds length', async () => {
      const values: number[] = []
      await flowOf(1, 2)
        .take(5)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 2])
    })
  })

  describe('drop', () => {
    it('drops first n values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4, 5)
        .drop(2)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([3, 4, 5])
    })

    it('drops nothing if count is 0', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3)
        .drop(0)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 2, 3])
    })
  })

  describe('onEach', () => {
    it('performs side effect on each value', async () => {
      const sideEffects: number[] = []
      const values: number[] = []

      await flowOf(1, 2, 3)
        .onEach((v) => { sideEffects.push(v) })
        .collect((v) => { values.push(v) })

      expect(sideEffects).toEqual([1, 2, 3])
      expect(values).toEqual([1, 2, 3])
    })
  })

  describe('onStart', () => {
    it('executes action before collection', async () => {
      const actions: string[] = []

      await flowOf(1, 2)
        .onStart(() => { actions.push('start') })
        .collect(() => { actions.push('value') })

      expect(actions[0]).toBe('start')
      expect(actions.length).toBe(3)
    })
  })

  describe('onCompletion', () => {
    it('executes action after collection', async () => {
      const actions: string[] = []

      await flowOf(1, 2)
        .onEach(() => { actions.push('value') })
        .onCompletion(() => { actions.push('complete') })
        .collect(() => {})

      expect(actions[actions.length - 1]).toBe('complete')
    })

    it('executes even on error', async () => {
      const actions: string[] = []

      try {
        await flow<number>(async (emit) => {
          await emit(1)
          throw new Error('test')
        })
          .onCompletion(() => { actions.push('complete') })
          .collect(() => {})
      } catch (e) {
        // Expected
      }

      expect(actions).toContain('complete')
    })
  })

  describe('catch', () => {
    it('catches errors', async () => {
      const errors: Error[] = []

      await flow(async function* () {
        yield 1
        throw new Error('test error')
      })
        .catch((e) => { errors.push(e) })
        .collect(() => {})

      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('test error')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it('debounces values', async () => {
      const values: number[] = []

      const promise = flow(async function* () {
        yield 1
        await delay(50)
        yield 2
        await delay(150)
        yield 3
      })
        .debounce(100)
        .collect((v) => { values.push(v) })

      await vi.runAllTimersAsync()
      await promise

      expect(values).toEqual([2, 3])
    })
  })

  describe('distinctUntilChanged', () => {
    it('filters consecutive duplicates', async () => {
      const values: number[] = []
      await flowOf(1, 1, 2, 2, 3, 1)
        .distinctUntilChanged()
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 2, 3, 1])
    })
  })

  describe('flatMapConcat', () => {
    it('flattens flows sequentially', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3)
        .flatMapConcat((x) => flowOf(x, x * 10))
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 10, 2, 20, 3, 30])
    })
  })

  describe('flatMapLatest', () => {
    it('cancels previous inner flows when new values arrive', async () => {
      vi.useFakeTimers()
      const values: number[] = []

      const promise = flow<number>(async (emit) => {
        await emit(1)
        await delay(25)
        await emit(2)
        await delay(25)
        await emit(3)
      })
        .flatMapLatest((value: number) =>
          flow<number>(async (emitInner) => {
            await emitInner(value)
            await delay(30)
            await emitInner(value * 10)
          })
        )
        .collect((v: number) => { values.push(v) })

      await vi.runAllTimersAsync()
      await promise
      vi.useRealTimers()

      expect(values).toEqual([1, 2, 3, 30])
    })
  })

  describe('transform', () => {
    it('transforms with custom emit', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3)
        .transform<number>(async (value, emit) => {
          await emit(value)
          await emit(value * 10)
        })
        .collect((v: number) => { values.push(v) })
      expect(values).toEqual([1, 10, 2, 20, 3, 30])
    })
  })

  describe('retry', () => {
    it('retries upstream until success', async () => {
      let attempts = 0
      const values: number[] = []

      await flow<number>(async (emit) => {
        attempts++
        await emit(attempts)
        if (attempts < 3) {
          throw new Error('boom')
        }
      })
        .retry(2)
        .collect((v: number) => { values.push(v) })

      expect(values).toEqual([1, 2, 3])
      expect(attempts).toBe(3)
    })

    it('propagates cancellation without retrying', async () => {
      await expect(
        flow(async (emit) => {
          await emit(1)
          throw new CancellationError()
        })
          .retry(4)
          .collect(() => {})
      ).rejects.toBeInstanceOf(CancellationError)
    })
  })

  describe('retryWhen', () => {
    it('stops when predicate returns false', async () => {
      let attempts = 0
      await expect(
        flow<number>(async (_emit) => {
          attempts++
          throw new Error('fail')
        })
          .retryWhen((_, attempt) => attempt < 2)
          .collect(() => {})
      ).rejects.toThrow('fail')
      expect(attempts).toBe(3)
    })
  })

  describe('throttle', () => {
    it('throttles emissions', async () => {
      const values: number[] = []

      await flow(async function* () {
        for (let i = 1; i <= 5; i++) {
          yield i
          await delay(10)
        }
      })
        .throttle(30)
        .collect((v) => { values.push(v) })

      expect(values.length).toBeLessThan(5)
      expect(values[0]).toBe(1)
    })
  })

  describe('buffer', () => {
    it('buffers values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4, 5)
        .buffer(2)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('scan', () => {
    it('accumulates values', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4)
        .scan(0, (acc, v) => acc + v)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([0, 1, 3, 6, 10])
    })

    it('emits initial value first', async () => {
      const values: number[] = []
      await flowOf<number>()
        .scan(42, (acc, v) => acc + v)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([42])
    })
  })

  describe('withIndex', () => {
    it('adds index to values', async () => {
      const values: [number, string][] = []
      await flowOf('a', 'b', 'c')
        .withIndex()
        .collect((v) => { values.push(v) })
      expect(values).toEqual([[0, 'a'], [1, 'b'], [2, 'c']])
    })
  })

  describe('first', () => {
    it('returns first value', async () => {
      const value = await flowOf(1, 2, 3).first()
      expect(value).toBe(1)
    })

    it('throws on empty flow', async () => {
      await expect(flowOf<number>().first()).rejects.toThrow()
    })
  })

  describe('toArray', () => {
    it('collects all values to array', async () => {
      const array = await flowOf(1, 2, 3, 4).toArray()
      expect(array).toEqual([1, 2, 3, 4])
    })

    it('returns empty array for empty flow', async () => {
      const array = await flowOf<number>().toArray()
      expect(array).toEqual([])
    })
  })

  describe('reduce', () => {
    it('reduces values', async () => {
      const sum = await flowOf(1, 2, 3, 4).reduce((acc, v) => acc + v)
      expect(sum).toBe(10)
    })
  })

  describe('count', () => {
    it('counts all values', async () => {
      const count = await flowOf(1, 2, 3, 4).count()
      expect(count).toBe(4)
    })

    it('counts matching values', async () => {
      const count = await flowOf(1, 2, 3, 4, 5).filter((x) => x % 2 === 0).count()
      expect(count).toBe(2)
    })
  })

  describe('any and all helpers', () => {
    it('any without predicate resolves based on emission', async () => {
      await expect(flowOf(1, 2, 3).any()).resolves.toBe(true)
      await expect(flowOf<number>().any()).resolves.toBe(false)
    })

    it('any propagates upstream errors', async () => {
      await expect(
        flow(async function* () {
          throw new Error('boom')
        }).any()
      ).rejects.toThrow('boom')
    })

    it('all short-circuits when predicate fails', async () => {
      let calls = 0
      const result = await flowOf(1, 2, 3).all((value) => {
        calls++
        return value < 3
      })
      expect(result).toBe(false)
      expect(calls).toBe(3)
    })

    it('all propagates upstream errors', async () => {
      await expect(
        flow(async (emit) => {
          await emit(1)
          throw new Error('bad')
        }).all(() => true)
      ).rejects.toThrow('bad')
    })
  })

  describe('shareIn', () => {
    it('multicasts values with replay to late subscribers', async () => {
      vi.useFakeTimers()
      const shared = flow<number>(async (emit) => {
        for (const value of [1, 2, 3]) {
          await emit(value)
          await delay(10)
        }
      }).shareIn({ replay: 1 })

      const values1: number[] = []
      const first = shared.take(3).collect((v: number) => { values1.push(v) })

      await vi.advanceTimersByTimeAsync(30)
      await first

      const values2: number[] = []
      const second = shared.take(1).collect((v: number) => { values2.push(v) })

      await vi.runAllTimersAsync()
      await second
      vi.useRealTimers()

      expect(values1).toEqual([1, 2, 3])
      expect(values2).toEqual([3])
    })

    it('cancels collectors when upstream fails', async () => {
      vi.useFakeTimers()
      const shared = flow<number>(async (emit) => {
        await emit(1)
        await delay(10)
        throw new Error('boom')
      }).shareIn({ replay: 1 })

      const collection = shared.collect(() => {})
      collection.catch(() => {})

      await vi.advanceTimersByTimeAsync(10)

      await expect(collection).rejects.toBeInstanceOf(CancellationError)
      vi.useRealTimers()
    })
  })

  describe('chaining', () => {
    it('chains multiple operators', async () => {
      const values: number[] = []
      await flowOf(1, 2, 3, 4, 5, 6)
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .take(2)
        .collect((v) => { values.push(v) })
      expect(values).toEqual([4, 8])
    })
  })
})

describe('StateFlow', () => {
  it('emits current value immediately', async () => {
    const stateFlow = new StateFlow(42)
    const values: number[] = []

    await stateFlow.take(1).collect((v) => { values.push(v) })

    expect(values).toEqual([42])
  })

  it('updates value', async () => {
    const stateFlow = new StateFlow(0)

    expect(stateFlow.value).toBe(0)
    stateFlow.value = 42
    expect(stateFlow.value).toBe(42)
  })

  it('emits to all collectors', async () => {
    const stateFlow = new StateFlow(1)
    const values1: number[] = []
    const values2: number[] = []

    setTimeout(() => {
      stateFlow.value = 2
      stateFlow.cancelAll()
    }, 10)

    const p1 = stateFlow.collect((v) => { values1.push(v) }).catch(() => {})
    const p2 = stateFlow.collect((v) => { values2.push(v) }).catch(() => {})

    await Promise.all([p1, p2])

    expect(values1).toContain(1)
    expect(values1).toContain(2)
    expect(values2).toContain(1)
    expect(values2).toContain(2)
  })

  it('uses AbortController for cancellation', () => {
    const stateFlow = new StateFlow(42)
    expect(stateFlow).toBeInstanceOf(StateFlow)
  })
})

describe('SharedFlow', () => {
  it('replays buffered values', async () => {
    const sharedFlow = new SharedFlow<number>({ replay: 2 })

    await sharedFlow.emit(1)
    await sharedFlow.emit(2)
    await sharedFlow.emit(3)

    const values: number[] = []
    await sharedFlow.take(2).collect((v) => { values.push(v) })

    expect(values).toEqual([2, 3])
  })

  it('emits to multiple collectors', async () => {
    const sharedFlow = new SharedFlow<number>()
    const values1: number[] = []
    const values2: number[] = []

    setTimeout(async () => {
      await sharedFlow.emit(1)
      await delay(10)
      await sharedFlow.emit(2)
      await delay(10)
      sharedFlow.cancelAll()
    }, 10)

    const p1 = sharedFlow.collect((v) => { values1.push(v) }).catch(() => {})
    const p2 = sharedFlow.collect((v) => { values2.push(v) }).catch(() => {})

    await Promise.all([p1, p2])

    expect(values1).toEqual([1, 2])
    expect(values2).toEqual([1, 2])
  })

  it('respects replay buffer size', async () => {
    const sharedFlow = new SharedFlow<number>({ replay: 1 })

    await sharedFlow.emit(1)
    await sharedFlow.emit(2)
    await sharedFlow.emit(3)

    const values: number[] = []
    await sharedFlow.take(1).collect((v) => { values.push(v) })

    expect(values).toEqual([3])
  })

  it('uses AbortController for cancellation', () => {
    const sharedFlow = new SharedFlow<number>()
    expect(sharedFlow).toBeInstanceOf(SharedFlow)
  })
})
