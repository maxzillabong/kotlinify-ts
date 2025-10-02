import { Job, CancellationError } from '../coroutines'

export interface FlowCollector<T> {
  emit(value: T): Promise<void>
}

export type FlowBlock<T> = (collector: FlowCollector<T>) => Promise<void>

export class Flow<T> {
  constructor(protected block: FlowBlock<T>) {}

  async collect(collector: ((value: T) => void | Promise<void>) | FlowCollector<T>): Promise<void> {
    const flowCollector: FlowCollector<T> =
      typeof collector === 'function'
        ? { emit: async (value) => { await collector(value) } }
        : collector

    await this.block(flowCollector)
  }

  collectWithJob(job: Job, collector: (value: T) => void | Promise<void>): Promise<void> {
    return this.collect(async (value) => {
      job.ensureActive()
      await collector(value)
    })
  }

  map<R>(transform: (value: T) => R | Promise<R>): Flow<R> {
    return new Flow(async (collector) => {
      await this.collect(async (value) => {
        await collector.emit(await transform(value))
      })
    })
  }

  filter(predicate: (value: T) => boolean | Promise<boolean>): Flow<T> {
    return new Flow(async (collector) => {
      await this.collect(async (value) => {
        if (await predicate(value)) {
          await collector.emit(value)
        }
      })
    })
  }

  take(count: number): Flow<T> {
    return new Flow(async (collector) => {
      let taken = 0
      await this.collect(async (value) => {
        if (taken < count) {
          await collector.emit(value)
          taken++
        }
      })
    })
  }

  drop(count: number): Flow<T> {
    return new Flow(async (collector) => {
      let dropped = 0
      await this.collect(async (value) => {
        if (dropped >= count) {
          await collector.emit(value)
        } else {
          dropped++
        }
      })
    })
  }

  onEach(action: (value: T) => void | Promise<void>): Flow<T> {
    return new Flow(async (collector) => {
      await this.collect(async (value) => {
        await action(value)
        await collector.emit(value)
      })
    })
  }

  onStart(action: () => void | Promise<void>): Flow<T> {
    return new Flow(async (collector) => {
      await action()
      await this.block(collector)
    })
  }

  onCompletion(action: () => void | Promise<void>): Flow<T> {
    return new Flow(async (collector) => {
      try {
        await this.block(collector)
      } finally {
        await action()
      }
    })
  }

  catch(handler: (error: Error) => void | Promise<void>): Flow<T> {
    return new Flow(async (collector) => {
      try {
        await this.block(collector)
      } catch (error) {
        await handler(error as Error)
      }
    })
  }

  debounce(timeoutMs: number): Flow<T> {
    return new Flow(async (collector) => {
      let lastValue: T | undefined
      let hasValue = false

      await this.collect(async (value) => {
        lastValue = value
        hasValue = true
      })

      if (hasValue && lastValue !== undefined) {
        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            await collector.emit(lastValue!)
            resolve()
          }, timeoutMs)
        })
      }
    })
  }

  distinctUntilChanged(): Flow<T> {
    return new Flow(async (collector) => {
      let lastValue: T | undefined
      let hasLast = false

      await this.collect(async (value) => {
        if (!hasLast || value !== lastValue) {
          await collector.emit(value)
          lastValue = value
          hasLast = true
        }
      })
    })
  }

  flatMapConcat<R>(transform: (value: T) => Flow<R>): Flow<R> {
    return new Flow(async (collector) => {
      await this.collect(async (value) => {
        const innerFlow = transform(value)
        await innerFlow.collect(collector)
      })
    })
  }

  flatMapMerge<R>(concurrency: number, transform: (value: T) => Flow<R>): Flow<R> {
    return new Flow(async (collector) => {
      const active = new Set<Promise<void>>()

      await this.collect(async (value) => {
        const promise = transform(value).collect(collector)
        active.add(promise)
        promise.finally(() => active.delete(promise))

        if (active.size >= concurrency) {
          await Promise.race(active)
        }
      })

      await Promise.all(active)
    })
  }

  flatMapLatest<R>(transform: (value: T) => Flow<R>): Flow<R> {
    return new Flow(async (collector) => {
      let currentJob: Job | null = null
      await this.collect(async (value) => {
        currentJob?.cancel()
        currentJob = new Job()
        await transform(value).collectWithJob(currentJob, async (v) => {
          await collector.emit(v)
        })
      })
    })
  }

  transform<R>(transformer: (value: T, emit: (value: R) => Promise<void>) => Promise<void>): Flow<R> {
    return new Flow(async (collector) => {
      await this.collect(async (value) => {
        await transformer(value, (v) => collector.emit(v))
      })
    })
  }

  transformLatest<R>(transformer: (value: T, emit: (value: R) => Promise<void>) => Promise<void>): Flow<R> {
    return new Flow(async (collector) => {
      let currentJob: Job | null = null
      await this.collect(async (value) => {
        currentJob?.cancel()
        currentJob = new Job()
        try {
          await transformer(value, async (v) => {
            currentJob!.ensureActive()
            await collector.emit(v)
          })
        } catch (error) {
          if (!(error instanceof CancellationError)) throw error
        }
      })
    })
  }

  throttle(durationMs: number): Flow<T> {
    return new Flow(async (collector) => {
      let lastEmitTime = 0
      await this.collect(async (value) => {
        const now = Date.now()
        if (now - lastEmitTime >= durationMs) {
          await collector.emit(value)
          lastEmitTime = now
        }
      })
    })
  }

  sample(periodMs: number): Flow<T> {
    return new Flow(async (collector) => {
      let lastValue: T | undefined
      let hasValue = false
      let interval: NodeJS.Timeout | undefined

      const emitLatest = async () => {
        if (hasValue && lastValue !== undefined) {
          await collector.emit(lastValue)
          hasValue = false
        }
      }

      interval = setInterval(emitLatest, periodMs)

      try {
        await this.collect(async (value) => {
          lastValue = value
          hasValue = true
        })
        await emitLatest()
      } finally {
        if (interval) clearInterval(interval)
      }
    })
  }

  buffer(capacity: number = 64): Flow<T> {
    return new Flow(async (collector) => {
      const buffer: T[] = []
      let head = 0

      const processBuffer = async () => {
        while (head < buffer.length) {
          const value = buffer[head]
          head++
          await collector.emit(value)
        }
        buffer.length = 0
        head = 0
      }

      await this.collect(async (value) => {
        buffer.push(value)
        if (buffer.length - head >= capacity) {
          await processBuffer()
        }
      })

      await processBuffer()
    })
  }

  scan<R>(initial: R, operation: (accumulator: R, value: T) => R | Promise<R>): Flow<R> {
    return new Flow(async (collector) => {
      let accumulator = initial
      await collector.emit(accumulator)

      await this.collect(async (value) => {
        accumulator = await operation(accumulator, value)
        await collector.emit(accumulator)
      })
    })
  }

  withIndex(): Flow<[number, T]> {
    return new Flow(async (collector) => {
      let index = 0
      await this.collect(async (value) => {
        await collector.emit([index, value])
        index++
      })
    })
  }

  conflate(): Flow<T> {
    return new Flow(async (collector) => {
      let latestValue: T | undefined
      let hasValue = false
      let isCollecting = false

      await this.collect(async (value) => {
        latestValue = value
        hasValue = true

        if (!isCollecting) {
          isCollecting = true
          while (hasValue) {
            const valueToEmit = latestValue!
            hasValue = false
            await collector.emit(valueToEmit)
          }
          isCollecting = false
        }
      })
    })
  }

  distinctUntilChangedBy<K>(keySelector: (value: T) => K): Flow<T> {
    return new Flow(async (collector) => {
      let lastKey: K | undefined
      let hasLast = false

      await this.collect(async (value) => {
        const key = keySelector(value)
        if (!hasLast || key !== lastKey) {
          await collector.emit(value)
          lastKey = key
          hasLast = true
        }
      })
    })
  }

  retry(retries: number = 3): Flow<T> {
    return new Flow(async (collector) => {
      let attempts = 0
      while (attempts <= retries) {
        try {
          await this.block(collector)
          return
        } catch (error) {
          attempts++
          if (attempts > retries) throw error
        }
      }
    })
  }

  retryWhen(predicate: (error: Error, attempt: number) => boolean | Promise<boolean>): Flow<T> {
    return new Flow(async (collector) => {
      let attempt = 0
      while (true) {
        try {
          await this.block(collector)
          return
        } catch (error) {
          const shouldRetry = await predicate(error as Error, attempt++)
          if (!shouldRetry) throw error
        }
      }
    })
  }

  onEmpty(action: () => void | Promise<void>): Flow<T> {
    return new Flow(async (collector) => {
      let emitted = false
      await this.collect(async (value) => {
        emitted = true
        await collector.emit(value)
      })
      if (!emitted) {
        await action()
      }
    })
  }

  defaultIfEmpty(defaultValue: T): Flow<T> {
    return new Flow(async (collector) => {
      let emitted = false
      await this.collect(async (value) => {
        emitted = true
        await collector.emit(value)
      })
      if (!emitted) {
        await collector.emit(defaultValue)
      }
    })
  }

  async toList(): Promise<T[]> {
    const result: T[] = []
    await this.collect((value) => {
      result.push(value)
    })
    return result
  }

  async toArray(): Promise<T[]> {
    return this.toList()
  }

  async toSet(): Promise<Set<T>> {
    const result = new Set<T>()
    await this.collect((value) => {
      result.add(value)
    })
    return result
  }

  async first(): Promise<T> {
    let result: T | undefined
    let found = false
    await this.take(1).collect((value) => {
      result = value
      found = true
    })
    if (!found) throw new Error('Flow is empty')
    return result!
  }

  async firstOrNull(): Promise<T | null> {
    try {
      return await this.first()
    } catch {
      return null
    }
  }

  async last(): Promise<T> {
    let result: T | undefined
    let found = false
    await this.collect((value) => {
      result = value
      found = true
    })
    if (!found) throw new Error('Flow is empty')
    return result!
  }

  async lastOrNull(): Promise<T | null> {
    try {
      return await this.last()
    } catch {
      return null
    }
  }

  async single(): Promise<T> {
    let result: T | undefined
    let count = 0
    await this.collect((value) => {
      result = value
      count++
    })
    if (count === 0) throw new Error('Flow is empty')
    if (count > 1) throw new Error('Flow has more than one element')
    return result!
  }

  async singleOrNull(): Promise<T | null> {
    try {
      return await this.single()
    } catch {
      return null
    }
  }

  async reduce(operation: (accumulator: T, value: T) => T | Promise<T>): Promise<T> {
    let accumulator: T | undefined
    let first = true
    await this.collect(async (value) => {
      if (first) {
        accumulator = value
        first = false
      } else {
        accumulator = await operation(accumulator!, value)
      }
    })
    if (first) throw new Error('Flow is empty')
    return accumulator!
  }

  async fold<R>(initial: R, operation: (accumulator: R, value: T) => R | Promise<R>): Promise<R> {
    let accumulator = initial
    await this.collect(async (value) => {
      accumulator = await operation(accumulator, value)
    })
    return accumulator
  }

  async count(): Promise<number> {
    let count = 0
    await this.collect(() => {
      count++
    })
    return count
  }

  async any(predicate?: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
    if (!predicate) {
      try {
        await this.first()
        return true
      } catch {
        return false
      }
    }
    let result = false
    await this.collect(async (value) => {
      if (await predicate(value)) {
        result = true
        throw new Error('STOP')
      }
    }).catch(() => {})
    return result
  }

  async all(predicate: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
    let result = true
    await this.collect(async (value) => {
      if (!(await predicate(value))) {
        result = false
        throw new Error('STOP')
      }
    }).catch(() => {})
    return result
  }

  async none(predicate: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
    return !(await this.any(predicate))
  }

  shareIn(config?: SharedFlowConfig): MutableSharedFlow<T> {
    const sharedFlow = new MutableSharedFlow<T>(config)
    this.collect((value) => sharedFlow.emit(value)).catch(() => {})
    return sharedFlow
  }

  stateIn(initialValue: T): MutableStateFlow<T> {
    const stateFlow = new MutableStateFlow<T>(initialValue)
    this.collect((value) => stateFlow.emit(value)).catch(() => {})
    return stateFlow
  }
}

export function flow<T>(block: () => AsyncGenerator<T>): Flow<T> {
  return new Flow(async (collector) => {
    for await (const value of block()) {
      await collector.emit(value)
    }
  })
}

export function flowOf<T>(...values: T[]): Flow<T> {
  return new Flow(async (collector) => {
    for (const value of values) {
      await collector.emit(value)
    }
  })
}

export function asFlow<T>(iterable: Iterable<T> | AsyncIterable<T>): Flow<T> {
  return new Flow(async (collector) => {
    for await (const value of iterable as AsyncIterable<T>) {
      await collector.emit(value)
    }
  })
}

export class StateFlow<T> extends Flow<T> {
  private _value: T
  private collectors: Map<FlowCollector<T>, AbortController> = new Map()

  constructor(initialValue: T) {
    super(async (collector) => {
      const abortController = new AbortController()
      try {
        await collector.emit(this._value)
        this.collectors.set(collector, abortController)

        return new Promise<void>((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            this.collectors.delete(collector)
            reject(new CancellationError())
          })
        })
      } catch (error) {
        this.collectors.delete(collector)
        throw error
      }
    })
    this._value = initialValue
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue
      this.collectors.forEach((abortController, collector) => {
        collector.emit(newValue).catch(() => {
          abortController.abort()
        })
      })
    }
  }

  async emit(value: T): Promise<void> {
    this.value = value
  }

  get subscriptionCount(): number {
    return this.collectors.size
  }

  cancelAll(): void {
    this.collectors.forEach((abortController) => abortController.abort())
    this.collectors.clear()
  }
}

export class MutableStateFlow<T> extends StateFlow<T> {
  constructor(initialValue: T) {
    super(initialValue)
  }

  update(transform: (current: T) => T): void {
    this.value = transform(this.value)
  }

  compareAndSet(expect: T, update: T): boolean {
    if (this.value === expect) {
      this.value = update
      return true
    }
    return false
  }
}

export interface SharedFlowConfig {
  replay?: number
  extraBufferCapacity?: number
  onBufferOverflow?: 'SUSPEND' | 'DROP_OLDEST' | 'DROP_LATEST'
}

export class SharedFlow<T> extends Flow<T> {
  private collectors: Map<FlowCollector<T>, AbortController> = new Map()
  private _replayCache: T[] = []
  private readonly replay: number
  private readonly onBufferOverflow: 'SUSPEND' | 'DROP_OLDEST' | 'DROP_LATEST'

  constructor(config: SharedFlowConfig = {}) {
    super(async (collector) => {
      const abortController = new AbortController()
      try {
        for (const value of this._replayCache) {
          await collector.emit(value)
        }
        this.collectors.set(collector, abortController)

        return new Promise<void>((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            this.collectors.delete(collector)
            reject(new CancellationError())
          })
        })
      } catch (error) {
        this.collectors.delete(collector)
        throw error
      }
    })
    this.replay = config.replay ?? 0
    this.onBufferOverflow = config.onBufferOverflow ?? 'SUSPEND'
  }

  async emit(value: T): Promise<void> {
    if (this.replay > 0) {
      this._replayCache.push(value)
      if (this._replayCache.length > this.replay) {
        if (this.onBufferOverflow === 'DROP_OLDEST') {
          this._replayCache.shift()
        } else if (this.onBufferOverflow === 'DROP_LATEST') {
          this._replayCache.pop()
        }
      }
    }

    await Promise.all(
      Array.from(this.collectors.entries()).map(([collector, abortController]) =>
        collector.emit(value).catch(() => abortController.abort())
      )
    )
  }

  get subscriptionCount(): number {
    return this.collectors.size
  }

  get replayCache(): ReadonlyArray<T> {
    return this._replayCache
  }

  resetReplayCache(): void {
    this._replayCache = []
  }

  cancelAll(): void {
    this.collectors.forEach((abortController) => abortController.abort())
    this.collectors.clear()
  }
}

export class MutableSharedFlow<T> extends SharedFlow<T> {
  constructor(config: SharedFlowConfig = {}) {
    super(config)
  }

  tryEmit(value: T): boolean {
    this.emit(value).catch(() => {})
    return true
  }
}

export function combine<T1, T2, R>(
  flow1: Flow<T1>,
  flow2: Flow<T2>,
  transform: (v1: T1, v2: T2) => R
): Flow<R> {
  return new Flow(async (collector) => {
    let value1: T1 | undefined
    let value2: T2 | undefined
    let hasValue1 = false
    let hasValue2 = false

    const emitIfReady = async () => {
      if (hasValue1 && hasValue2) {
        await collector.emit(transform(value1!, value2!))
      }
    }

    await Promise.all([
      flow1.collect(async (v) => {
        value1 = v
        hasValue1 = true
        await emitIfReady()
      }),
      flow2.collect(async (v) => {
        value2 = v
        hasValue2 = true
        await emitIfReady()
      }),
    ])
  })
}

export function zip<T1, T2, R>(
  flow1: Flow<T1>,
  flow2: Flow<T2>,
  transform: (v1: T1, v2: T2) => R
): Flow<R> {
  return new Flow(async (collector) => {
    const queue1: T1[] = []
    const queue2: T2[] = []

    const tryEmit = async () => {
      while (queue1.length > 0 && queue2.length > 0) {
        await collector.emit(transform(queue1.shift()!, queue2.shift()!))
      }
    }

    await Promise.all([
      flow1.collect(async (v) => {
        queue1.push(v)
        await tryEmit()
      }),
      flow2.collect(async (v) => {
        queue2.push(v)
        await tryEmit()
      }),
    ])
  })
}

export function merge<T>(...flows: Flow<T>[]): Flow<T> {
  return new Flow(async (collector) => {
    await Promise.all(flows.map((f) => f.collect(collector)))
  })
}

export interface ProducerScope<T> extends FlowCollector<T> {
  readonly isActive: boolean
  close(): void
  cancel(cause?: Error): void
  onClose(handler: () => void): void
}

export function callbackFlow<T>(block: (scope: ProducerScope<T>) => void | Promise<void>): Flow<T> {
  return new Flow(async (collector) => {
    let closed = false
    let cancelled = false
    const closeHandlers: Array<() => void> = []

    const scope: ProducerScope<T> = {
      emit: async (value: T) => {
        if (closed || cancelled) throw new Error('Flow is closed')
        await collector.emit(value)
      },
      get isActive() {
        return !closed && !cancelled
      },
      close() {
        if (!closed) {
          closed = true
          closeHandlers.forEach((h) => h())
        }
      },
      cancel(cause?: Error) {
        if (!cancelled) {
          cancelled = true
          closed = true
          closeHandlers.forEach((h) => h())
          if (cause) throw cause
        }
      },
      onClose(handler: () => void) {
        closeHandlers.push(handler)
      },
    }

    try {
      await block(scope)
      if (!closed) {
        await new Promise<void>((resolve) => {
          scope.onClose(resolve)
        })
      }
    } finally {
      scope.close()
    }
  })
}

export function channelFlow<T>(block: (scope: ProducerScope<T>) => void | Promise<void>): Flow<T> {
  return callbackFlow(block)
}
