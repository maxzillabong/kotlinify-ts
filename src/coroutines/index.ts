export class CancellationError extends Error {
  constructor(message = 'Coroutine was cancelled') {
    super(message)
    this.name = 'CancellationError'
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Coroutine timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export class Job {
  private _cancelled = false
  private _completed = false
  private completionPromise: Promise<void>
  private completionResolve!: () => void
  private completionReject!: (error: Error) => void
  private children: Job[] = []
  private cancelCallbacks: Array<() => void> = []

  constructor() {
    this.completionPromise = new Promise((resolve, reject) => {
      this.completionResolve = resolve
      this.completionReject = reject
    })
  }

  cancel(reason?: string): void {
    if (this._cancelled || this._completed) return
    this._cancelled = true
    this.children.forEach((child) => child.cancel(reason))
    this.cancelCallbacks.forEach((callback) => callback())
    this.completionReject(new CancellationError(reason))
    this.completionPromise.catch(() => {})
  }

  get isActive(): boolean {
    return !this._cancelled && !this._completed
  }

  get isCancelled(): boolean {
    return this._cancelled
  }

  get isCompleted(): boolean {
    return this._completed
  }

  complete(): void {
    if (this._completed || this._cancelled) return
    this._completed = true
    this.completionResolve()
  }

  fail(error: Error): void {
    if (this._completed || this._cancelled) return
    this._cancelled = true
    this.children.forEach((child) => child.cancel())
    this.completionReject(error)
    this.completionPromise.catch(() => {})
  }

  async join(): Promise<void> {
    try {
      await this.completionPromise
    } catch (error) {
      if (!(error instanceof CancellationError)) throw error
    }
  }

  addChild(child: Job): void {
    this.children.push(child)
  }

  onCancel(callback: () => void): void {
    this.cancelCallbacks.push(callback)
  }

  ensureActive(): void {
    if (this._cancelled) {
      throw new CancellationError()
    }
  }
}

export class Deferred<T> extends Job {
  private valuePromise: Promise<T>
  private valueResolve!: (value: T) => void
  private valueReject!: (error: Error) => void
  private _valueCompleted = false
  private resolvedValue: T | undefined
  private resolvedError: Error | undefined

  constructor() {
    super()
    this.valuePromise = new Promise((resolve, reject) => {
      this.valueResolve = resolve
      this.valueReject = reject
    })

    this.onCancel(() => {
      if (!this._valueCompleted) {
        this._valueCompleted = true
        const error = new CancellationError()
        this.resolvedError = error
        this.valueReject(error)
      }
    })
  }

  completeWith(value: T): void {
    if (this._valueCompleted || this.isCancelled) return
    this._valueCompleted = true
    this.resolvedValue = value
    this.resolvedError = undefined
    this.valueResolve(value)
    this.complete()
  }

  completeExceptionally(error: Error): void {
    if (this._valueCompleted || this.isCancelled) return
    this._valueCompleted = true
    this.resolvedError = error
    this.resolvedValue = undefined
    this.valueReject(error)
    this.fail(error)
  }

  async await(): Promise<T> {
    return this.valuePromise
  }

  getCompleted(): T | undefined {
    if (!this._valueCompleted) return undefined

    if (this.resolvedError) {
      throw this.resolvedError
    }

    return this.resolvedValue
  }
}

export class CoroutineScope {
  private job = new Job()
  private childJobs: Job[] = []

  get isActive(): boolean {
    return this.job.isActive
  }

  cancel(reason?: string): void {
    this.job.cancel(reason)
  }

  launch(block: (this: Job) => void | Promise<void>): Job {
    const childJob = new Job()
    this.job.addChild(childJob)
    this.childJobs.push(childJob)

    try {
      Promise.resolve(block.call(childJob))
        .then(() => childJob.complete())
        .catch((error) => childJob.fail(error instanceof Error ? error : new Error(String(error))))
    } catch (error) {
      childJob.fail(error as Error)
    }

    return childJob
  }

  async<T>(block: () => T | Promise<T>): Deferred<T> {
    const deferred = new Deferred<T>()
    this.job.addChild(deferred)
    this.childJobs.push(deferred)

    Promise.resolve()
      .then(() => Promise.resolve(block()))
      .then((value) => deferred.completeWith(value))
      .catch((error) => deferred.completeExceptionally(error))

    return deferred
  }

  async joinAll(): Promise<void> {
    await Promise.all(this.childJobs.map((job) => job.join()))
  }
}

export function launch(block: (this: Job) => void | Promise<void>): Job {
  const job = new Job()

  Promise.resolve()
    .then(() => Promise.resolve(block.call(job)))
    .then(() => job.complete())
    .catch((error) => job.fail(error))

  return job
}

export function asyncValue<T>(block: () => T | Promise<T>): Deferred<T> {
  const deferred = new Deferred<T>()

  Promise.resolve()
    .then(() => Promise.resolve(block()))
    .then((value) => deferred.completeWith(value))
    .catch((error) => deferred.completeExceptionally(error))

  return deferred
}

export { asyncValue as async }

export function wrapAsync<T>(promise: Promise<T>): Deferred<T> {
  const deferred = new Deferred<T>()

  promise
    .then((value) => deferred.completeWith(value))
    .catch((error) => deferred.completeExceptionally(error))

  return deferred
}

export async function asyncFn<T>(fn: (...args: any[]) => Promise<T>): Promise<(...args: any[]) => Deferred<T>> {
  return (...args: any[]) => wrapAsync(fn(...args))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function coroutineScope<T>(
  block: (scope: CoroutineScope) => T | Promise<T>
): Promise<T> {
  const scope = new CoroutineScope()
  try {
    const result = await Promise.resolve(block(scope))
    await scope.joinAll()
    return result
  } catch (error) {
    scope.cancel()
    await scope.joinAll()
    throw error
  }
}

export async function supervisorScope<T>(
  block: (scope: CoroutineScope) => T | Promise<T>
): Promise<T> {
  const scope = new CoroutineScope()
  return Promise.resolve(block(scope))
}

export async function withTimeout<T>(
  timeoutMs: number,
  block: () => T | Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    Promise.resolve(block())
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

export async function withTimeoutOrNull<T>(
  timeoutMs: number,
  block: () => T | Promise<T>
): Promise<T | null> {
  try {
    return await withTimeout(timeoutMs, block)
  } catch (error) {
    if (error instanceof TimeoutError) return null
    throw error
  }
}

export async function runBlocking<T>(block: () => T | Promise<T>): Promise<T> {
  return Promise.resolve(block())
}
