export function letValue<T, R>(value: T, block: (value: T) => R): R {
  return block(value)
}

export { letValue as let }

export function apply<T>(value: T, block: (value: T) => void): T {
  block(value)
  return value
}

export function also<T>(value: T, block: (value: T) => void): T {
  block(value)
  return value
}

export function run<T, R>(value: T, block: (this: T) => R): R {
  return block.call(value)
}

export function withValue<T, R>(receiver: T, block: (this: T) => R): R {
  return block.call(receiver)
}

export { withValue as with }

export function letOrNull<T, R>(value: T | null | undefined, block: (value: T) => R): R | null {
  return value != null ? block(value) : null
}

export function applyOrNull<T>(value: T | null | undefined, block: (value: T) => void): T | null {
  if (value != null) {
    block(value)
    return value
  }
  return null
}

export function alsoOrNull<T>(value: T | null | undefined, block: (value: T) => void): T | null {
  if (value != null) {
    block(value)
    return value
  }
  return null
}

export function runOrNull<T, R>(value: T | null | undefined, block: (this: T) => R): R | null {
  return value != null ? block.call(value) : null
}

export interface ScopeChain<T> {
  let<R>(block: (value: T) => R): ScopeChain<R>
  apply(block: (value: T) => void): ScopeChain<T>
  also(block: (value: T) => void): ScopeChain<T>
  run<R>(block: (this: T) => R): ScopeChain<R>
  value(): T
}

export interface AsyncScopeChain<T> {
  let<R>(block: (value: T) => R | Promise<R>): AsyncScopeChain<Awaited<R>>
  apply(block: (value: T) => void | Promise<void>): AsyncScopeChain<T>
  also(block: (value: T) => void | Promise<void>): AsyncScopeChain<T>
  run<R>(block: (this: T) => R | Promise<R>): AsyncScopeChain<Awaited<R>>
  value(): Promise<T>
}

class ScopeChainImpl<T> implements ScopeChain<T> {
  constructor(private _value: T) {}

  let<R>(block: (value: T) => R): ScopeChain<R> {
    return new ScopeChainImpl(letValue(this._value, block))
  }

  apply(block: (value: T) => void): ScopeChain<T> {
    return new ScopeChainImpl(apply(this._value, block))
  }

  also(block: (value: T) => void): ScopeChain<T> {
    return new ScopeChainImpl(also(this._value, block))
  }

  run<R>(block: (this: T) => R): ScopeChain<R> {
    return new ScopeChainImpl(run(this._value, block))
  }

  value(): T {
    return this._value
  }
}

class AsyncScopeChainImpl<T> implements AsyncScopeChain<T> {
  constructor(private readonly promise: Promise<T>) {}

  let<R>(block: (value: T) => R | Promise<R>): AsyncScopeChain<Awaited<R>> {
    const next = this.promise.then((value) => Promise.resolve(block(value)))
    return new AsyncScopeChainImpl<Awaited<R>>(Promise.resolve(next))
  }

  apply(block: (value: T) => void | Promise<void>): AsyncScopeChain<T> {
    const next = this.promise.then(async (value) => {
      await block(value)
      return value
    })
    return new AsyncScopeChainImpl<T>(next)
  }

  also(block: (value: T) => void | Promise<void>): AsyncScopeChain<T> {
    const next = this.promise.then(async (value) => {
      await block(value)
      return value
    })
    return new AsyncScopeChainImpl<T>(next)
  }

  run<R>(block: (this: T) => R | Promise<R>): AsyncScopeChain<Awaited<R>> {
    const next = this.promise.then((value) => Promise.resolve(block.call(value)))
    return new AsyncScopeChainImpl<Awaited<R>>(Promise.resolve(next))
  }

  value(): Promise<T> {
    return this.promise
  }
}

export function asScope<T>(value: Promise<T>): AsyncScopeChain<T>
export function asScope<T>(value: T): ScopeChain<T>
export function asScope<T>(value: T | Promise<T>): ScopeChain<T> | AsyncScopeChain<T> {
  if (value instanceof Promise) {
    return new AsyncScopeChainImpl(Promise.resolve(value))
  }
  return new ScopeChainImpl(value)
}
