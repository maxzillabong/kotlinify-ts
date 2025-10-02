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
  })
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

declare global {
  interface Array<T> {
    zip<U>(this: T[], other: readonly U[]): [T, U][]
    unzip<U>(this: [T, U][]): [T[], U[]]
    associate<K, V>(this: T[], transform: (value: T) => [K, V]): Map<K, V>
    fold<R>(this: T[], initial: R, operation: (acc: R, value: T) => R): R
    foldRight<R>(this: T[], initial: R, operation: (value: T, acc: R) => R): R
    runningFold<R>(this: T[], initial: R, operation: (acc: R, value: T) => R): R[]
    runningReduce(this: T[], operation: (acc: T, value: T) => T): T[]
    first(this: T[]): T
    first(this: T[], predicate: (value: T) => boolean): T
    firstOrNull(this: T[]): T | undefined
    firstOrNull(this: T[], predicate: (value: T) => boolean): T | undefined
    last(this: T[]): T
    last(this: T[], predicate: (value: T) => boolean): T
    lastOrNull(this: T[]): T | undefined
    lastOrNull(this: T[], predicate: (value: T) => boolean): T | undefined
    single(this: T[]): T
    single(this: T[], predicate: (value: T) => boolean): T
    singleOrNull(this: T[]): T | undefined
    singleOrNull(this: T[], predicate: (value: T) => boolean): T | undefined
    take(this: T[], count: number): T[]
    takeLast(this: T[], count: number): T[]
    takeWhile(this: T[], predicate: (value: T) => boolean): T[]
    takeLastWhile(this: T[], predicate: (value: T) => boolean): T[]
    drop(this: T[], count: number): T[]
    dropLast(this: T[], count: number): T[]
    dropWhile(this: T[], predicate: (value: T) => boolean): T[]
    dropLastWhile(this: T[], predicate: (value: T) => boolean): T[]
    slice(this: T[], indices: number[] | Iterable<number>): T[]
    distinct(this: T[]): T[]
    distinctBy<K>(this: T[], selector: (value: T) => K): T[]
    associateBy<K extends string | number | symbol>(
      this: T[],
      keySelector: (value: T) => K
    ): Record<K, T>
    associateWith<V>(
      this: T[],
      valueSelector: (value: T) => V
    ): Record<string, V>
    groupBy<K extends string | number | symbol>(
      this: T[],
      keySelector: (value: T) => K
    ): Record<K, T[]>
    partition(this: T[], predicate: (value: T) => boolean): [T[], T[]]
    chunked(this: T[], size: number): T[][]
    windowed(this: T[], size: number, step?: number): T[][]
    zipWithNext(this: T[]): [T, T][]
    union(this: T[], other: T[]): T[]
    intersect(this: T[], other: T[]): T[]
    subtract(this: T[], other: T[]): T[]
    count(this: T[], predicate?: (value: T) => boolean): number
    sum(this: number[]): number
    average(this: number[]): number
    min(this: number[]): number
    max(this: number[]): number
    minOrNull(this: number[]): number | null
    maxOrNull(this: number[]): number | null
    sumOf(this: T[], selector: (value: T) => number): number
    maxBy(this: T[], selector: (value: T) => number): T | undefined
    minBy(this: T[], selector: (value: T) => number): T | undefined
    all(this: T[], predicate: (value: T) => boolean): boolean
    any(this: T[], predicate?: (value: T) => boolean): boolean
    none(this: T[], predicate: (value: T) => boolean): boolean
  }
}

Object.defineProperty(Array.prototype, 'fold', {
  value: function <T, R>(this: T[], initial: R, operation: (acc: R, value: T) => R): R {
    return fold(this, initial, operation)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'first', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T {
    return predicate ? first(this, predicate) : first(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'firstOrNull', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T | undefined {
    return predicate ? firstOrNull(this, predicate) : firstOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'last', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T {
    return predicate ? last(this, predicate) : last(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'lastOrNull', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T | undefined {
    return predicate ? lastOrNull(this, predicate) : lastOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'single', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T {
    return predicate ? single(this, predicate) : single(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'singleOrNull', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): T | undefined {
    return predicate ? singleOrNull(this, predicate) : singleOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'associateBy', {
  value: function <T, K extends string | number | symbol>(
    this: T[],
    keySelector: (value: T) => K
  ): Record<K, T> {
    return associateBy(this, keySelector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'associateWith', {
  value: function <T, V>(
    this: T[],
    valueSelector: (value: T) => V
  ): Record<string, V> {
    return associateWith(this, valueSelector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'groupBy', {
  value: function <T, K extends string | number | symbol>(
    this: T[],
    keySelector: (value: T) => K
  ): Record<K, T[]> {
    return groupBy(this, keySelector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'partition', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): [T[], T[]] {
    return partition(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'chunked', {
  value: function <T>(this: T[], size: number): T[][] {
    return chunked(this, size)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'windowed', {
  value: function <T>(this: T[], size: number, step: number = 1): T[][] {
    return windowed(this, size, step)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'zipWithNext', {
  value: function <T>(this: T[]): [T, T][] {
    return zipWithNext(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'distinctBy', {
  value: function <T, K>(this: T[], selector: (value: T) => K): T[] {
    return distinctBy(this, selector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'union', {
  value: function <T>(this: T[], other: T[]): T[] {
    return union(this, other)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'intersect', {
  value: function <T>(this: T[], other: T[]): T[] {
    return intersect(this, other)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'subtract', {
  value: function <T>(this: T[], other: T[]): T[] {
    return subtract(this, other)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'sumOf', {
  value: function <T>(this: T[], selector: (value: T) => number): number {
    return sumOf(this, selector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'maxBy', {
  value: function <T>(this: T[], selector: (value: T) => number): T | undefined {
    return maxBy(this, selector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'minBy', {
  value: function <T>(this: T[], selector: (value: T) => number): T | undefined {
    return minBy(this, selector)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'none', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): boolean {
    return none(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})


Object.defineProperty(Array.prototype, 'zip', {
  value: function <T, U>(this: T[], other: readonly U[]): [T, U][] {
    return zip(this, other)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'unzip', {
  value: function <T, U>(this: [T, U][]): [T[], U[]] {
    return unzip(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'associate', {
  value: function <T, K, V>(this: T[], transform: (value: T) => [K, V]): Map<K, V> {
    return associate(this, transform)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})


Object.defineProperty(Array.prototype, 'foldRight', {
  value: function <T, R>(this: T[], initial: R, operation: (value: T, acc: R) => R): R {
    return foldRight(this, initial, operation)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'reduceRight', {
  value: function <T>(this: T[], operation: (value: T, acc: T) => T): T {
    return reduceRight(this, operation)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'runningFold', {
  value: function <T, R>(this: T[], initial: R, operation: (acc: R, value: T) => R): R[] {
    return runningFold(this, initial, operation)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'runningReduce', {
  value: function <T>(this: T[], operation: (acc: T, value: T) => T): T[] {
    return runningReduce(this, operation)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'take', {
  value: function <T>(this: T[], count: number): T[] {
    return take(this, count)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'takeLast', {
  value: function <T>(this: T[], count: number): T[] {
    return takeLast(this, count)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'takeWhile', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return takeWhile(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'takeLastWhile', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return takeLastWhile(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'drop', {
  value: function <T>(this: T[], count: number): T[] {
    return drop(this, count)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'dropLast', {
  value: function <T>(this: T[], count: number): T[] {
    return dropLast(this, count)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'dropWhile', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return dropWhile(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'dropLastWhile', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return dropLastWhile(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'sliceBy', {
  value: function <T>(this: T[], indices: number[] | Iterable<number>): T[] {
    return slice(this, indices)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'distinct', {
  value: function <T>(this: T[]): T[] {
    return distinct(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'count', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): number {
    return count(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'sum', {
  value: function (this: number[]): number {
    return sum(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'average', {
  value: function (this: number[]): number {
    return average(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'min', {
  value: function (this: number[]): number {
    return min(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'max', {
  value: function (this: number[]): number {
    return max(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'minOrNull', {
  value: function (this: number[]): number | null {
    return minOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'maxOrNull', {
  value: function (this: number[]): number | null {
    return maxOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'all', {
  value: function <T>(this: T[], predicate: (value: T) => boolean): boolean {
    return all(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Array.prototype, 'any', {
  value: function <T>(this: T[], predicate?: (value: T) => boolean): boolean {
    return any(this, predicate)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})
