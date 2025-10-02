import { describe, it, expect, vi } from 'vitest'
import {
  Job,
  Deferred,
  CoroutineScope,
  CancellationError,
  TimeoutError,
  launch,
  async,
  delay,
  coroutineScope,
  supervisorScope,
  withTimeout,
  withTimeoutOrNull,
  wrapAsync,
} from './index'

describe('Job', () => {
  it('starts active', () => {
    const job = new Job()
    expect(job.isActive).toBe(true)
    expect(job.isCancelled).toBe(false)
    expect(job.isCompleted).toBe(false)
  })

  it('can be completed', () => {
    const job = new Job()
    job.complete()
    expect(job.isActive).toBe(false)
    expect(job.isCompleted).toBe(true)
  })

  it('can be cancelled', () => {
    const job = new Job()
    job.cancel()
    expect(job.isActive).toBe(false)
    expect(job.isCancelled).toBe(true)
  })

  it('cancels children when cancelled', () => {
    const parent = new Job()
    const child = new Job()
    parent.addChild(child)

    parent.cancel()

    expect(child.isCancelled).toBe(true)
  })

  it('throws when ensureActive on cancelled job', () => {
    const job = new Job()
    job.cancel()
    expect(() => job.ensureActive()).toThrow(CancellationError)
  })

  it('does not throw when ensureActive on active job', () => {
    const job = new Job()
    expect(() => job.ensureActive()).not.toThrow()
  })

  it('calls onCancel callbacks', () => {
    const job = new Job()
    const callback = vi.fn()
    job.onCancel(callback)
    job.cancel()
    expect(callback).toHaveBeenCalled()
  })

  it('join waits for completion', async () => {
    const job = new Job()
    const completed = vi.fn()

    const joinPromise = job.join().then(completed)

    expect(completed).not.toHaveBeenCalled()
    job.complete()

    await joinPromise
    expect(completed).toHaveBeenCalled()
  })

  it('join swallows CancellationError', async () => {
    const job = new Job()
    const joinPromise = job.join()
    job.cancel()
    await expect(joinPromise).resolves.not.toThrow()
  })

  it('join throws on failure', async () => {
    const job = new Job()
    const joinPromise = job.join()
    const error = new Error('test error')
    job.fail(error)
    await expect(joinPromise).rejects.toThrow(error)
  })
})

describe('Deferred', () => {
  it('extends Job', () => {
    const deferred = new Deferred<number>()
    expect(deferred).toBeInstanceOf(Job)
  })

  it('can be completed with value', async () => {
    const deferred = new Deferred<number>()
    deferred.completeWith(42)
    const value = await deferred.await()
    expect(value).toBe(42)
  })

  it('can be completed exceptionally', async () => {
    const deferred = new Deferred<number>()
    const error = new Error('test error')
    deferred.completeExceptionally(error)
    await expect(deferred.await()).rejects.toThrow(error)
  })

  it('getCompleted returns undefined when not completed', () => {
    const deferred = new Deferred<number>()
    expect(deferred.getCompleted()).toBeUndefined()
  })
})

describe('launch', () => {
  it('launches coroutine', async () => {
    const executed = vi.fn()
    const job = launch(function () {
      executed()
    })

    await job.join()
    expect(executed).toHaveBeenCalled()
  })

  it('provides job context via this', async () => {
    let jobContext: Job | undefined

    const job = launch(function () {
      jobContext = this
    })

    await job.join()
    expect(jobContext).toBe(job)
  })

  it('supports async functions', async () => {
    const executed = vi.fn()

    const job = launch(async function () {
      await delay(10)
      executed()
    })

    await job.join()
    expect(executed).toHaveBeenCalled()
  })

  it('completes job on success', async () => {
    const job = launch(function () {})
    await job.join()
    expect(job.isCompleted).toBe(true)
  })

  it('fails job on error', async () => {
    const job = launch(function () {
      throw new Error('test')
    })

    await expect(job.join()).rejects.toThrow('test')
    expect(job.isCancelled).toBe(true)
  })

  it('can be cancelled', async () => {
    const job = launch(async function () {
      await delay(100)
    })

    job.cancel()
    expect(job.isCancelled).toBe(true)
  })
})

describe('async', () => {
  it('launches deferred computation', async () => {
    const deferred = async(() => Promise.resolve(42))
    const value = await deferred.await()
    expect(value).toBe(42)
  })

  it('returns Deferred', () => {
    const deferred = async(() => Promise.resolve(42))
    expect(deferred).toBeInstanceOf(Deferred)
  })

  it('handles async functions', async () => {
    const deferred = async(async () => {
      await delay(10)
      return 'result'
    })

    const value = await deferred.await()
    expect(value).toBe('result')
  })

  it('completes exceptionally on error', async () => {
    const deferred = async(() => Promise.reject(new Error('test')))
    await expect(deferred.await()).rejects.toThrow('test')
  })
})

describe('wrapAsync', () => {
  it('wraps promise into Deferred', async () => {
    const promise = Promise.resolve(42)
    const deferred = wrapAsync(promise)
    expect(deferred).toBeInstanceOf(Deferred)
    const value = await deferred.await()
    expect(value).toBe(42)
  })

  it('handles rejection', async () => {
    const promise = Promise.reject(new Error('test'))
    const deferred = wrapAsync(promise)
    await expect(deferred.await()).rejects.toThrow('test')
  })
})

describe('CoroutineScope', () => {
  it('launches child jobs', async () => {
    const scope = new CoroutineScope()
    const executed = vi.fn()

    const job = scope.launch(function () {
      executed()
    })

    await job.join()
    expect(executed).toHaveBeenCalled()
  })

  it('launches async computations', async () => {
    const scope = new CoroutineScope()
    const deferred = scope.async(() => Promise.resolve(42))
    const value = await deferred.await()
    expect(value).toBe(42)
  })

  it('cancels all children when scope is cancelled', async () => {
    const scope = new CoroutineScope()

    const job1 = scope.launch(async function () {
      await delay(100)
    })
    const job2 = scope.launch(async function () {
      await delay(100)
    })

    scope.cancel()

    expect(job1.isCancelled).toBe(true)
    expect(job2.isCancelled).toBe(true)
  })

  it('isActive reflects scope state', () => {
    const scope = new CoroutineScope()
    expect(scope.isActive).toBe(true)
    scope.cancel()
    expect(scope.isActive).toBe(false)
  })

  it('joinAll waits for all children', async () => {
    const scope = new CoroutineScope()
    const order: number[] = []

    scope.launch(async function () {
      await delay(20)
      order.push(1)
    })

    scope.launch(async function () {
      await delay(10)
      order.push(2)
    })

    await scope.joinAll()
    expect(order).toEqual([2, 1])
  })
})

describe('coroutineScope', () => {
  it('creates scope and waits for children', async () => {
    const order: number[] = []

    await coroutineScope(async (scope) => {
      scope.launch(async function () {
        await delay(20)
        order.push(2)
      })

      scope.launch(async function () {
        await delay(10)
        order.push(1)
      })

      order.push(0)
    })

    expect(order).toEqual([0, 1, 2])
  })

  it('cancels children on error', async () => {
    const scope = new CoroutineScope()
    let childCancelled = false

    try {
      await coroutineScope(async (s) => {
        s.launch(async function () {
          this.onCancel(() => {
            childCancelled = true
          })
          await delay(100)
        })

        throw new Error('parent error')
      })
    } catch (e) {
      // Expected
    }

    await delay(10)
    expect(childCancelled).toBe(true)
  })

  it('returns result', async () => {
    const result = await coroutineScope(async () => {
      return 42
    })
    expect(result).toBe(42)
  })
})

describe('supervisorScope', () => {
  it('creates supervisor scope', async () => {
    const result = await supervisorScope(async () => {
      return 'test'
    })
    expect(result).toBe('test')
  })
})

describe('delay', () => {
  it('delays execution', async () => {
    const start = Date.now()
    await delay(50)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(40)
  })
})

describe('withTimeout', () => {
  it('completes within timeout', async () => {
    const result = await withTimeout(100, async () => {
      await delay(10)
      return 'success'
    })
    expect(result).toBe('success')
  })

  it('throws TimeoutError when exceeds timeout', async () => {
    await expect(
      withTimeout(10, async () => {
        await delay(100)
        return 'should not reach'
      })
    ).rejects.toThrow(TimeoutError)
  })

  it('includes timeout in error message', async () => {
    try {
      await withTimeout(50, async () => {
        await delay(100)
      })
    } catch (e) {
      expect((e as Error).message).toContain('50')
    }
  })
})

describe('withTimeoutOrNull', () => {
  it('completes within timeout', async () => {
    const result = await withTimeoutOrNull(100, async () => {
      await delay(10)
      return 'success'
    })
    expect(result).toBe('success')
  })

  it('returns null when exceeds timeout', async () => {
    const result = await withTimeoutOrNull(10, async () => {
      await delay(100)
      return 'should not reach'
    })
    expect(result).toBe(null)
  })

  it('throws on non-timeout errors', async () => {
    await expect(
      withTimeoutOrNull(100, async () => {
        throw new Error('other error')
      })
    ).rejects.toThrow('other error')
  })
})

describe('integration', () => {
  it('combines launch, delay, and cancellation', async () => {
    const executed = vi.fn()
    const cancelled = vi.fn()

    const job = launch(async function () {
      this.onCancel(cancelled)
      await delay(100)
      executed()
    })

    await delay(10)
    job.cancel()
    await job.join().catch(() => {})

    expect(executed).not.toHaveBeenCalled()
    expect(cancelled).toHaveBeenCalled()
  })

  it('structured concurrency with nested scopes', async () => {
    const order: string[] = []

    await coroutineScope(async (outer) => {
      outer.launch(async function () {
        order.push('outer-start')
        await coroutineScope(async (inner) => {
          inner.launch(async function () {
            await delay(10)
            order.push('inner')
          })
        })
        order.push('outer-end')
      })
    })

    expect(order).toEqual(['outer-start', 'inner', 'outer-end'])
  })
})
