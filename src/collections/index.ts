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

export function associateBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (value: T) => K
): Record<K, T> {
  return array.reduce((acc, item) => {
    acc[keySelector(item)] = item
    return acc
  }, {} as Record<K, T>)
}

export function associateWith<T, V>(
  array: T[],
  valueSelector: (value: T) => V
): Record<string, V> {
  return array.reduce((acc, item) => {
    acc[String(item)] = valueSelector(item)
    return acc
  }, {} as Record<string, V>)
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (value: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = keySelector(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
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

export function chunked<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function windowed<T>(array: T[], size: number, step: number = 1): T[][] {
  const windows: T[][] = []
  for (let i = 0; i <= array.length - size; i += step) {
    windows.push(array.slice(i, i + size))
  }
  return windows
}

export function zipWithNext<T>(array: T[]): [T, T][] {
  const pairs: [T, T][] = []
  for (let i = 0; i < array.length - 1; i++) {
    pairs.push([array[i], array[i + 1]])
  }
  return pairs
}

export function distinctBy<T, K>(array: T[], selector: (value: T) => K): T[] {
  const seen = new Set<K>()
  return array.filter((item) => {
    const key = selector(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function union<T>(array1: T[], array2: T[]): T[] {
  return Array.from(new Set([...array1, ...array2]))
}

export function intersect<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return Array.from(new Set(array1.filter((item) => set2.has(item))))
}

export function subtract<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter((item) => !set2.has(item))
}

export function sumOf<T>(array: T[], selector: (value: T) => number): number {
  return array.reduce((sum, item) => sum + selector(item), 0)
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

export function slice<T>(array: readonly T[], indices: number[] | Iterable<number>): T[] {
  return Array.from(indices, i => array[i]).filter(item => item !== undefined)
}

export function distinct<T>(array: readonly T[]): T[] {
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

