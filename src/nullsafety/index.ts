export function takeIf<T>(value: T, predicate: (value: T) => boolean): T | undefined {
  return predicate(value) ? value : undefined
}

export function takeUnless<T>(value: T, predicate: (value: T) => boolean): T | undefined {
  return predicate(value) ? undefined : value
}

export function orEmpty(value: string | null | undefined): string
export function orEmpty<T>(value: T[] | null | undefined): T[]
export function orEmpty(value: any): any {
  if (value === null || value === undefined) {
    return Array.isArray(value) ? [] : ''
  }
  return value
}

export function isNullOrEmpty(value: string | null | undefined): boolean
export function isNullOrEmpty<T>(value: T[] | null | undefined): boolean
export function isNullOrEmpty(value: any): boolean {
  return value === null || value === undefined || value.length === 0
}

export function isNullOrBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim().length === 0
}

declare global {
  interface Object {
    takeIf<T>(this: T, predicate: (value: T) => boolean): T | undefined
    takeUnless<T>(this: T, predicate: (value: T) => boolean): T | undefined
  }

  interface String {
    orEmpty(this: string | null | undefined): string
    isNullOrEmpty(this: string | null | undefined): boolean
    isNullOrBlank(this: string | null | undefined): boolean
  }

  interface Array<T> {
    orEmpty(this: T[] | null | undefined): T[]
    isNullOrEmpty(this: T[] | null | undefined): boolean
  }
}

Object.defineProperty(Object.prototype, 'takeIf', {
  value: function <T>(this: T, predicate: (value: T) => boolean): T | undefined {
    return predicate(this) ? this : undefined
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Object.prototype, 'takeUnless', {
  value: function <T>(this: T, predicate: (value: T) => boolean): T | undefined {
    return predicate(this) ? undefined : this
  },
  writable: true,
  configurable: true,
  enumerable: false,
})
