export function extend<T extends new (...args: any[]) => any>(
  constructor: T,
  extensions: Record<string, (this: InstanceType<T>, ...args: any[]) => any>
): void {
  Object.entries(extensions).forEach(([name, fn]) => {
    Object.defineProperty(constructor.prototype, name, {
      value: fn,
      writable: true,
      configurable: true,
      enumerable: false,
    })
  })
}

export function extendType<T>(
  prototype: any,
  extensions: Record<string, (this: T, ...args: any[]) => any>
): void {
  Object.entries(extensions).forEach(([name, fn]) => {
    Object.defineProperty(prototype, name, {
      value: fn,
      writable: true,
      configurable: true,
      enumerable: false,
    })
  })
}
