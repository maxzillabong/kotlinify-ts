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

export function asScope<T>(value: T): ScopeChain<T> {
  return new ScopeChainImpl(value)
}

export { asScope as toScope, asScope as chain }

declare global {
  interface Object {
    let<T, R>(this: T, block: (value: T) => R): R
    apply<T>(this: T, block: (value: T) => void): T
    also<T>(this: T, block: (value: T) => void): T
    run<T, R>(this: T, block: (this: T) => R): R
    letOrNull<T, R>(this: T | null | undefined, block: (value: T) => R): R | null
    applyOrNull<T>(this: T | null | undefined, block: (value: T) => void): T | null
    alsoOrNull<T>(this: T | null | undefined, block: (value: T) => void): T | null
    runOrNull<T, R>(this: T | null | undefined, block: (this: T) => R): R | null
  }
}

let extensionsEnabled = false

export function enableKotlinifyExtensions(): void {
  if (extensionsEnabled) return
  extensionsEnabled = true

  Object.defineProperty(Object.prototype, 'let', {
    value: function <T, R>(this: T, block: (value: T) => R): R {
      return letValue(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'apply', {
    value: function <T>(this: T, block: (value: T) => void): T {
      return apply(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'also', {
    value: function <T>(this: T, block: (value: T) => void): T {
      return also(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'run', {
    value: function <T, R>(this: T, block: (this: T) => R): R {
      return run(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'letOrNull', {
    value: function <T, R>(this: T | null | undefined, block: (value: T) => R): R | null {
      return letOrNull(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'applyOrNull', {
    value: function <T>(this: T | null | undefined, block: (value: T) => void): T | null {
      return applyOrNull(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'alsoOrNull', {
    value: function <T>(this: T | null | undefined, block: (value: T) => void): T | null {
      return alsoOrNull(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, 'runOrNull', {
    value: function <T, R>(this: T | null | undefined, block: (this: T) => R): R | null {
      return runOrNull(this, block)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })
}

// Extensions are opt-in via enableKotlinifyExtensions()
// Use chain() for safe, non-global chaining
