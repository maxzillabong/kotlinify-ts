export function repeat(times: number, action: (index: number) => void): void {
  for (let i = 0; i < times; i++) {
    action(i)
  }
}

export async function repeatAsync(
  times: number,
  action: (index: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i < times; i++) {
    await action(i)
  }
}

export function require(condition: boolean, message?: string | (() => string)): asserts condition {
  if (!condition) {
    const msg = typeof message === 'function' ? message() : message
    throw new Error(msg || 'Requirement failed')
  }
}

export function check(condition: boolean, message?: string | (() => string)): asserts condition {
  if (!condition) {
    const msg = typeof message === 'function' ? message() : message
    throw new Error(msg || 'Check failed')
  }
}

export function requireNotNull<T>(value: T | null | undefined, message?: string | (() => string)): T {
  if (value == null) {
    const msg = typeof message === 'function' ? message() : message
    throw new Error(msg || 'Required value was null')
  }
  return value
}

export function checkNotNull<T>(value: T | null | undefined, message?: string | (() => string)): T {
  if (value == null) {
    const msg = typeof message === 'function' ? message() : message
    throw new Error(msg || 'Value must not be null')
  }
  return value
}

export function TODO(message?: string): never {
  throw new Error(message ? `Not implemented: ${message}` : 'Not implemented')
}

export function error(message: string): never {
  throw new Error(message)
}

export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

export function assertNotNull<T>(value: T | null | undefined, message?: string): T {
  if (value == null) {
    throw new Error(message || 'Assertion failed: value was null')
  }
  return value
}

export function runCatching<T>(block: () => T): { success: boolean; value?: T; error?: Error } {
  try {
    return { success: true, value: block() }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export async function runCatchingAsync<T>(
  block: () => Promise<T>
): Promise<{ success: boolean; value?: T; error?: Error }> {
  try {
    return { success: true, value: await block() }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export function lazy<T>(initializer: () => T): () => T {
  let cached: T | undefined
  let initialized = false

  return () => {
    if (!initialized) {
      cached = initializer()
      initialized = true
    }
    return cached as T
  }
}

export async function measure<T>(
  block: () => T | Promise<T>
): Promise<{ value: T; duration: number }> {
  const start = Date.now()
  const value = await block()
  const duration = Date.now() - start
  return { value, duration }
}

export function measureSync<T>(block: () => T): { value: T; duration: number } {
  const start = Date.now()
  const value = block()
  const duration = Date.now() - start
  return { value, duration }
}

export function identity<T>(value: T): T {
  return value
}

export function constant<T>(value: T): () => T {
  return () => value
}

export function noop(): void {}

export function todo(message?: string): never {
  return TODO(message)
}
