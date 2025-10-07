export function takeIf<T>(value: T, predicate: (value: T) => boolean): T | undefined {
  return predicate(value) ? value : undefined
}

export function takeUnless<T>(value: T, predicate: (value: T) => boolean): T | undefined {
  return predicate(value) ? undefined : value
}

export function orEmpty(value: string | null | undefined): string {
  return value ?? ''
}

export function orEmptyArray<T>(value: T[] | null | undefined): T[] {
  return value ?? []
}

export function isNullOrEmpty(value: string | null | undefined): boolean
export function isNullOrEmpty<T>(value: T[] | null | undefined): boolean
export function isNullOrEmpty(value: any): boolean {
  return value === null || value === undefined || value.length === 0
}

export function isNullOrBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim().length === 0
}
