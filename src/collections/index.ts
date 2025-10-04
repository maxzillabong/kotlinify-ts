export function flatten<T>(array: readonly (T | readonly T[])[]): T[] {
  return array.flat() as T[]
}

export function flatMap<T, U>(array: readonly T[], transform: (value: T) => U[]): U[] {
  return array.flatMap(transform)
}

export function zip<T, U>(array1: readonly T[], array2: readonly U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length)
  return Array.from({ length }, (_, i) => [array1[i], array2[i]])
}

export function unzip<T, U>(array: readonly [T, U][]): [T[], U[]] {
  return array.reduce(
    ([first, second], [a, b]) => {
      first.push(a)
      second.push(b)
      return [first, second]
    },
    [[], []] as [T[], U[]]
  )
}

export function associate<T, K, V>(
  array: readonly T[],
  transform: (value: T) => [K, V]
): Map<K, V> {
  return new Map(array.map(transform))
}

export function fold<T, R>(array: readonly T[], initial: R, operation: (acc: R, value: T) => R): R {
  return array.reduce(operation, initial)
}

export function reduce<T>(array: readonly T[], operation: (acc: T, value: T) => T): T {
  if (array.length === 0) throw new Error('Array is empty')
  return array.reduce(operation)
}

export function foldRight<T, R>(array: readonly T[], initial: R, operation: (value: T, acc: R) => R): R {
  return array.reduceRight((acc, value) => operation(value, acc), initial)
}

export function reduceRight<T>(array: readonly T[], operation: (value: T, acc: T) => T): T {
  if (array.length === 0) throw new Error('Array is empty')
  return array.reduceRight((acc, value) => operation(value, acc))
}

export function runningFold<T, R>(array: readonly T[], initial: R, operation: (acc: R, value: T) => R): R[] {
  const result: R[] = [initial]
  array.reduce((acc, value) => {
    const next = operation(acc, value)
    result.push(next)
    return next
  }, initial)
  return result
}

export function runningReduce<T>(array: readonly T[], operation: (acc: T, value: T) => T): T[] {
  if (array.length === 0) return []
  const result: T[] = [array[0]]
  array.slice(1).reduce((acc, value) => {
    const next = operation(acc, value)
    result.push(next)
    return next
  }, array[0])
  return result
}

export function first<T>(array: readonly T[]): T
export function first<T>(array: readonly T[], predicate: (value: T) => boolean): T
export function first<T>(array: readonly T[], predicate?: (value: T) => boolean): T {
  if (predicate) {
    const result = array.find(predicate)
    if (result === undefined) throw new Error('No element matching predicate')
    return result
  }
  if (array.length === 0) throw new Error('Array is empty')
  return array[0]
}

export function firstOrNull<T>(array: T[]): T | undefined
export function firstOrNull<T>(array: T[], predicate: (value: T) => boolean): T | undefined
export function firstOrNull<T>(array: T[], predicate?: (value: T) => boolean): T | undefined {
  if (predicate) return array.find(predicate)
  return array[0]
}

export function last<T>(array: T[]): T
export function last<T>(array: T[], predicate: (value: T) => boolean): T
export function last<T>(array: T[], predicate?: (value: T) => boolean): T {
  if (predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return array[i]
    }
    throw new Error('No element matching predicate')
  }
  if (array.length === 0) throw new Error('Array is empty')
  return array[array.length - 1]
}

export function lastOrNull<T>(array: T[]): T | undefined
export function lastOrNull<T>(array: T[], predicate: (value: T) => boolean): T | undefined
export function lastOrNull<T>(array: T[], predicate?: (value: T) => boolean): T | undefined {
  if (predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return array[i]
    }
    return undefined
  }
  return array[array.length - 1]
}

export function single<T>(array: T[]): T
export function single<T>(array: T[], predicate: (value: T) => boolean): T
export function single<T>(array: T[], predicate?: (value: T) => boolean): T {
  if (predicate) {
    const filtered = array.filter(predicate)
    if (filtered.length === 0) throw new Error('No element matching predicate')
    if (filtered.length > 1) throw new Error('More than one element matching predicate')
    return filtered[0]
  }
  if (array.length === 0) throw new Error('Array is empty')
  if (array.length > 1) throw new Error('Array has more than one element')
  return array[0]
}

export function singleOrNull<T>(array: T[]): T | undefined
export function singleOrNull<T>(array: T[], predicate: (value: T) => boolean): T | undefined
export function singleOrNull<T>(array: T[], predicate?: (value: T) => boolean): T | undefined {
  if (predicate) {
    const filtered = array.filter(predicate)
    return filtered.length === 1 ? filtered[0] : undefined
  }
  return array.length === 1 ? array[0] : undefined
}

export function associateBy<T, K>(
  array: readonly T[],
  keySelector: (value: T) => K
): Map<K, T>
export function associateBy<T, K, V>(
  array: readonly T[],
  keySelector: (value: T) => K,
  valueTransform: (value: T) => V
): Map<K, V>
export function associateBy<T, K, V>(
  array: readonly T[],
  keySelector: (value: T) => K,
  valueTransform?: (value: T) => V
): Map<K, T | V> {
  const map = new Map<K, T | V>()
  for (const item of array) {
    const key = keySelector(item)
    const value = valueTransform ? valueTransform(item) : item
    map.set(key, value)
  }
  return map
}

export function associateWith<T, V>(
  array: readonly T[],
  valueSelector: (value: T) => V
): Map<T, V> {
  const map = new Map<T, V>()
  for (const item of array) {
    map.set(item, valueSelector(item))
  }
  return map
}

export function groupBy<T, K>(
  array: readonly T[],
  keySelector: (value: T) => K
): Map<K, T[]>
export function groupBy<T, K, V>(
  array: readonly T[],
  keySelector: (value: T) => K,
  valueTransform: (value: T) => V
): Map<K, V[]>
export function groupBy<T, K, V>(
  array: readonly T[],
  keySelector: (value: T) => K,
  valueTransform?: (value: T) => V
): Map<K, (T | V)[]> {
  const map = new Map<K, (T | V)[]>()
  for (const item of array) {
    const key = keySelector(item)
    const value = valueTransform ? valueTransform(item) : item
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(value)
  }
  return map
}

export function partition<T>(
  array: T[],
  predicate: (value: T) => boolean
): [T[], T[]] {
  const matched: T[] = []
  const notMatched: T[] = []
  array.forEach((item) => {
    if (predicate(item)) {
      matched.push(item)
    } else {
      notMatched.push(item)
    }
  })
  return [matched, notMatched]
}

export function chunked<T>(array: readonly T[], size: number): T[][]
export function chunked<T, R>(
  array: readonly T[],
  size: number,
  transform: (chunk: readonly T[]) => R
): R[]
export function chunked<T, R>(
  array: readonly T[],
  size: number,
  transform?: (chunk: readonly T[]) => R
): T[][] | R[] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return transform ? chunks.map(transform) : chunks
}

export function windowed<T>(
  array: readonly T[],
  size: number,
  step?: number,
  partialWindows?: boolean
): T[][]
export function windowed<T, R>(
  array: readonly T[],
  size: number,
  step: number,
  partialWindows: boolean,
  transform: (window: readonly T[]) => R
): R[]
export function windowed<T, R>(
  array: readonly T[],
  size: number,
  step: number = size,
  partialWindows: boolean = false,
  transform?: (window: readonly T[]) => R
): T[][] | R[] {
  const windows: T[][] = []
  const limit = partialWindows ? array.length : array.length - size + 1
  for (let i = 0; i < limit; i += step) {
    const window = array.slice(i, i + size)
    if (partialWindows || window.length === size) {
      windows.push(window)
    }
  }
  return transform ? windows.map(transform) : windows
}

export function zipWithNext<T>(array: readonly T[]): [T, T][]
export function zipWithNext<T, R>(
  array: readonly T[],
  transform: (a: T, b: T) => R
): R[]
export function zipWithNext<T, R>(
  array: readonly T[],
  transform?: (a: T, b: T) => R
): [T, T][] | R[] {
  const result: ([T, T] | R)[] = []
  for (let i = 0; i < array.length - 1; i++) {
    const pair: [T, T] = [array[i], array[i + 1]]
    result.push(transform ? transform(pair[0], pair[1]) : pair)
  }
  return result as [T, T][] | R[]
}

export function distinctBy<T, K>(array: Iterable<T>, selector: (value: T) => K): T[] {
  const seen = new Set<K>()
  const result: T[] = []
  for (const item of array) {
    const key = selector(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

export function union<T>(array1: Iterable<T>, array2: Iterable<T>): T[] {
  const result = new Set<T>()
  for (const item of array1) result.add(item)
  for (const item of array2) result.add(item)
  return Array.from(result)
}

export function intersect<T>(array1: Iterable<T>, array2: Iterable<T>): T[] {
  const set1 = new Set<T>()
  const set2 = new Set(array2)
  const result: T[] = []
  for (const item of array1) {
    if (set2.has(item) && !set1.has(item)) {
      set1.add(item)
      result.push(item)
    }
  }
  return result
}

export function subtract<T>(array1: Iterable<T>, array2: Iterable<T>): T[] {
  const set2 = new Set(array2)
  const result: T[] = []
  for (const item of array1) {
    if (!set2.has(item)) {
      result.push(item)
    }
  }
  return result
}

export function sumOf<T>(array: Iterable<T>, selector: (value: T) => number): number {
  let sum = 0
  for (const item of array) {
    sum += selector(item)
  }
  return sum
}

export function maxBy<T>(array: T[], selector: (value: T) => number): T | undefined {
  if (array.length === 0) return undefined
  return array.reduce((max, item) =>
    selector(item) > selector(max) ? item : max
  )
}

export function minBy<T>(array: T[], selector: (value: T) => number): T | undefined {
  if (array.length === 0) return undefined
  return array.reduce((min, item) =>
    selector(item) < selector(min) ? item : min
  )
}

export function none<T>(array: T[], predicate: (value: T) => boolean): boolean {
  return !array.some(predicate)
}

export function take<T>(array: readonly T[], count: number): T[] {
  return array.slice(0, Math.max(0, count))
}

export function takeLast<T>(array: readonly T[], count: number): T[] {
  return count <= 0 ? [] : array.slice(-count)
}

export function takeWhile<T>(array: readonly T[], predicate: (value: T) => boolean): T[] {
  const index = array.findIndex(item => !predicate(item))
  return index === -1 ? [...array] : array.slice(0, index)
}

export function takeLastWhile<T>(array: readonly T[], predicate: (value: T) => boolean): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i])) {
      return array.slice(i + 1)
    }
  }
  return [...array]
}

export function drop<T>(array: readonly T[], count: number): T[] {
  return array.slice(Math.max(0, count))
}

export function dropLast<T>(array: readonly T[], count: number): T[] {
  return count <= 0 ? [...array] : array.slice(0, -count)
}

export function dropWhile<T>(array: readonly T[], predicate: (value: T) => boolean): T[] {
  const index = array.findIndex(item => !predicate(item))
  return index === -1 ? [] : array.slice(index)
}

export function dropLastWhile<T>(array: readonly T[], predicate: (value: T) => boolean): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i])) {
      return array.slice(0, i + 1)
    }
  }
  return []
}

export interface Range {
  start: number
  endInclusive: number
  step?: number
}

export function slice<T>(array: readonly T[], indices: Iterable<number> | Range): T[] {
  if ('start' in indices && 'endInclusive' in indices) {
    const { start, endInclusive, step = 1 } = indices
    if (start < 0 || start >= array.length) {
      throw new RangeError(`Start index ${start} is out of bounds for array of length ${array.length}`)
    }
    if (endInclusive < 0 || endInclusive >= array.length) {
      throw new RangeError(`End index ${endInclusive} is out of bounds for array of length ${array.length}`)
    }

    const result: T[] = []
    if (step > 0) {
      for (let i = start; i <= endInclusive; i += step) {
        result.push(array[i])
      }
    } else if (step < 0) {
      for (let i = start; i >= endInclusive; i += step) {
        result.push(array[i])
      }
    }
    return result
  }

  const result: T[] = []
  for (const i of indices) {
    if (i < 0 || i >= array.length) {
      throw new RangeError(`Index ${i} is out of bounds for array of length ${array.length}`)
    }
    result.push(array[i])
  }
  return result
}

export function distinct<T>(array: Iterable<T>): T[] {
  return Array.from(new Set(array))
}

export function count<T>(array: readonly T[], predicate?: (value: T) => boolean): number {
  return predicate ? array.filter(predicate).length : array.length
}

export function sum(array: readonly number[]): number {
  return array.reduce((acc, val) => acc + val, 0)
}

export function average(array: readonly number[]): number {
  if (array.length === 0) throw new Error('Array is empty')
  return sum(array) / array.length
}

export function min(array: readonly number[]): number {
  if (array.length === 0) throw new Error('Array is empty')
  return Math.min(...array)
}

export function max(array: readonly number[]): number {
  if (array.length === 0) throw new Error('Array is empty')
  return Math.max(...array)
}

export function minOrNull(array: readonly number[]): number | null {
  return array.length === 0 ? null : Math.min(...array)
}

export function maxOrNull(array: readonly number[]): number | null {
  return array.length === 0 ? null : Math.max(...array)
}

export function all<T>(array: readonly T[], predicate: (value: T) => boolean): boolean {
  return array.every(predicate)
}

export function any<T>(array: readonly T[], predicate?: (value: T) => boolean): boolean {
  return predicate ? array.some(predicate) : array.length > 0
}

