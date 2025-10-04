export interface SequenceOperation<T, U> {
  (iterator: Iterator<T>): Iterator<U>
}

export class Sequence<T> {
  constructor(private readonly iterator: () => Iterator<T>) {}

  static of<T>(...elements: T[]): Sequence<T> {
    return new Sequence(() => elements[Symbol.iterator]())
  }

  static from<T>(iterable: Iterable<T>): Sequence<T> {
    return new Sequence(() => iterable[Symbol.iterator]())
  }

  static generate<T>(seedFunction: () => T): Sequence<T> {
    return new Sequence(function* () {
      while (true) {
        yield seedFunction()
      }
    })
  }

  static generateSequence<T>(seed: T, nextFunction: (current: T) => T | null | undefined): Sequence<T> {
    return new Sequence(function* () {
      let current: T | null | undefined = seed
      while (current != null) {
        yield current
        current = nextFunction(current)
      }
    })
  }

  [Symbol.iterator](): Iterator<T> {
    return this.iterator()
  }

  map<U>(transform: (value: T) => U): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield transform(item)
      }
    })
  }

  mapIndexed<U>(transform: (index: number, value: T) => U): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      let index = 0
      for (const item of { [Symbol.iterator]: source }) {
        yield transform(index++, item)
      }
    })
  }

  mapNotNull<U>(transform: (value: T) => U | null | undefined): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        const result = transform(item)
        if (result != null) {
          yield result
        }
      }
    })
  }

  filter(predicate: (value: T) => boolean): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (predicate(item)) {
          yield item
        }
      }
    })
  }

  filterIndexed(predicate: (index: number, value: T) => boolean): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      let index = 0
      for (const item of { [Symbol.iterator]: source }) {
        if (predicate(index++, item)) {
          yield item
        }
      }
    })
  }

  filterNot(predicate: (value: T) => boolean): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (!predicate(item)) {
          yield item
        }
      }
    })
  }

  flatMap<U>(transform: (value: T) => Iterable<U>): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield* transform(item)
      }
    })
  }

  flatten<U>(this: Sequence<Iterable<U>>): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield* item
      }
    })
  }

  take(count: number): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      let taken = 0
      const iterator = source()
      while (taken < count) {
        const next = iterator.next()
        if (next.done) break
        yield next.value
        taken++
      }
    })
  }

  takeWhile(predicate: (value: T) => boolean): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (!predicate(item)) break
        yield item
      }
    })
  }

  drop(count: number): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      let dropped = 0
      for (const item of { [Symbol.iterator]: source }) {
        if (dropped < count) {
          dropped++
          continue
        }
        yield item
      }
    })
  }

  dropWhile(predicate: (value: T) => boolean): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      let dropping = true
      for (const item of { [Symbol.iterator]: source }) {
        if (dropping && predicate(item)) continue
        dropping = false
        yield item
      }
    })
  }

  distinct(): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      const seen = new Set<T>()
      for (const item of { [Symbol.iterator]: source }) {
        if (!seen.has(item)) {
          seen.add(item)
          yield item
        }
      }
    })
  }

  distinctBy<K>(selector: (value: T) => K): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      const seen = new Set<K>()
      for (const item of { [Symbol.iterator]: source }) {
        const key = selector(item)
        if (!seen.has(key)) {
          seen.add(key)
          yield item
        }
      }
    })
  }

  sortedBy<K>(selector: (value: T) => K): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      const items = Array.from({ [Symbol.iterator]: source })
      items.sort((a, b) => {
        const aKey = selector(a)
        const bKey = selector(b)
        return aKey < bKey ? -1 : aKey > bKey ? 1 : 0
      })
      yield* items
    })
  }

  sorted(compareFn?: (a: T, b: T) => number): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      const items = Array.from({ [Symbol.iterator]: source })
      items.sort(compareFn)
      yield* items
    })
  }

  chunked(size: number): Sequence<T[]>
  chunked<R>(size: number, transform: (chunk: readonly T[]) => R): Sequence<R>
  chunked<R>(size: number, transform?: (chunk: readonly T[]) => R): Sequence<T[] | R> {
    const source = this.iterator
    return new Sequence(function* () {
      let chunk: T[] = []
      for (const item of { [Symbol.iterator]: source }) {
        chunk.push(item)
        if (chunk.length === size) {
          yield transform ? transform(chunk) : chunk
          chunk = []
        }
      }
      if (chunk.length > 0) {
        yield transform ? transform(chunk) : chunk
      }
    }) as any
  }

  windowed(size: number, step?: number, partialWindows?: boolean): Sequence<T[]>
  windowed<R>(
    size: number,
    step: number,
    partialWindows: boolean,
    transform: (window: readonly T[]) => R
  ): Sequence<R>
  windowed<R>(
    size: number,
    step: number = 1,
    partialWindows: boolean = false,
    transform?: (window: readonly T[]) => R
  ): Sequence<T[] | R> {
    const source = this.iterator
    return new Sequence(function* () {
      const buffer: T[] = []
      const iter = source()

      for (const item of { [Symbol.iterator]: () => iter }) {
        buffer.push(item)

        if (buffer.length === size) {
          yield transform ? transform([...buffer]) : [...buffer]
          buffer.splice(0, step)
        }
      }

      if (partialWindows && buffer.length > 0) {
        yield transform ? transform(buffer) : buffer
      }
    }) as any
  }

  zipWithNext(): Sequence<[T, T]>
  zipWithNext<R>(transform: (a: T, b: T) => R): Sequence<R>
  zipWithNext<R>(transform?: (a: T, b: T) => R): Sequence<[T, T] | R> {
    const source = this.iterator
    return new Sequence(function* () {
      const iter = source()
      let result = iter.next()
      if (result.done) return

      let prev = result.value
      result = iter.next()

      while (!result.done) {
        yield transform ? transform(prev, result.value) : [prev, result.value]
        prev = result.value
        result = iter.next()
      }
    }) as any
  }

  zip<U>(other: Iterable<U>): Sequence<[T, U]> {
    const source = this.iterator
    return new Sequence(function* () {
      const iter1 = source()
      const iter2 = other[Symbol.iterator]()

      while (true) {
        const result1 = iter1.next()
        const result2 = iter2.next()

        if (result1.done || result2.done) break

        yield [result1.value, result2.value]
      }
    })
  }

  onEach(action: (value: T) => void): Sequence<T> {
    const source = this.iterator
    return new Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        action(item)
        yield item
      }
    })
  }

  forEach(action: (value: T) => void): void {
    for (const item of this) {
      action(item)
    }
  }

  toArray(): T[] {
    return Array.from(this)
  }

  toSet(): Set<T> {
    return new Set(this)
  }

  toMap<K, V>(this: Sequence<[K, V]>): Map<K, V> {
    return new Map(this as any)
  }

  first(): T {
    const result = this.iterator().next()
    if (result.done) {
      throw new Error('Sequence is empty')
    }
    return result.value
  }

  firstOrNull(): T | null {
    const result = this.iterator().next()
    return result.done ? null : result.value
  }

  last(): T {
    let lastValue: T | undefined
    let hasValue = false

    for (const item of this) {
      lastValue = item
      hasValue = true
    }

    if (!hasValue) {
      throw new Error('Sequence is empty')
    }

    return lastValue!
  }

  lastOrNull(): T | null {
    let lastValue: T | null = null

    for (const item of this) {
      lastValue = item
    }

    return lastValue
  }

  single(predicate?: (value: T) => boolean): T {
    let result: T | undefined
    let count = 0

    for (const item of this) {
      if (!predicate || predicate(item)) {
        if (count > 0) {
          throw new Error('Sequence contains more than one matching element')
        }
        result = item
        count++
      }
    }

    if (count === 0) {
      throw new Error('Sequence contains no matching element')
    }

    return result!
  }

  singleOrNull(predicate?: (value: T) => boolean): T | null {
    let result: T | null = null
    let count = 0

    for (const item of this) {
      if (!predicate || predicate(item)) {
        if (count > 0) {
          return null
        }
        result = item
        count++
      }
    }

    return count === 1 ? result : null
  }

  find(predicate: (value: T) => boolean): T | undefined {
    for (const item of this) {
      if (predicate(item)) {
        return item
      }
    }
    return undefined
  }

  any(predicate?: (value: T) => boolean): boolean {
    if (!predicate) {
      return !this.iterator().next().done
    }

    for (const item of this) {
      if (predicate(item)) {
        return true
      }
    }
    return false
  }

  all(predicate: (value: T) => boolean): boolean {
    for (const item of this) {
      if (!predicate(item)) {
        return false
      }
    }
    return true
  }

  none(predicate?: (value: T) => boolean): boolean {
    return !this.any(predicate)
  }

  count(predicate?: (value: T) => boolean): number {
    if (!predicate) {
      let count = 0
      for (const _ of this) {
        count++
      }
      return count
    }

    let count = 0
    for (const item of this) {
      if (predicate(item)) {
        count++
      }
    }
    return count
  }

  reduce<U>(operation: (acc: U, value: T) => U, initial: U): U {
    let accumulator = initial
    for (const item of this) {
      accumulator = operation(accumulator, item)
    }
    return accumulator
  }

  fold<U>(initial: U, operation: (acc: U, value: T) => U): U {
    return this.reduce(operation, initial)
  }

  runningFold<U>(initial: U, operation: (acc: U, value: T) => U): Sequence<U> {
    const source = this.iterator
    return new Sequence(function* () {
      let accumulator = initial
      yield accumulator
      for (const item of { [Symbol.iterator]: source }) {
        accumulator = operation(accumulator, item)
        yield accumulator
      }
    })
  }

  scan<U>(initial: U, operation: (acc: U, value: T) => U): Sequence<U> {
    return this.runningFold(initial, operation)
  }

  sum(this: Sequence<number>): number {
    return this.reduce((acc, value) => acc + value, 0)
  }

  sumBy(selector: (value: T) => number): number {
    return this.reduce((acc, value) => acc + selector(value), 0)
  }

  sumOf(selector: (value: T) => number): number {
    return this.sumBy(selector)
  }

  average(this: Sequence<number>): number {
    let sum = 0
    let count = 0

    for (const item of this) {
      sum += item
      count++
    }

    if (count === 0) {
      throw new Error('Cannot calculate average of empty sequence')
    }

    return sum / count
  }

  averageBy(selector: (value: T) => number): number {
    return this.map(selector).average()
  }

  maxBy<K>(selector: (value: T) => K): T {
    const iter = this.iterator()
    const first = iter.next()

    if (first.done) {
      throw new Error('Sequence is empty')
    }

    let maxItem = first.value
    let maxKey = selector(maxItem)

    for (const item of { [Symbol.iterator]: () => iter }) {
      const key = selector(item)
      if (key > maxKey) {
        maxKey = key
        maxItem = item
      }
    }

    return maxItem
  }

  minBy<K>(selector: (value: T) => K): T {
    const iter = this.iterator()
    const first = iter.next()

    if (first.done) {
      throw new Error('Sequence is empty')
    }

    let minItem = first.value
    let minKey = selector(minItem)

    for (const item of { [Symbol.iterator]: () => iter }) {
      const key = selector(item)
      if (key < minKey) {
        minKey = key
        minItem = item
      }
    }

    return minItem
  }

  groupBy<K>(keySelector: (value: T) => K): Map<K, T[]> {
    const groups = new Map<K, T[]>()

    for (const item of this) {
      const key = keySelector(item)
      const group = groups.get(key)
      if (group) {
        group.push(item)
      } else {
        groups.set(key, [item])
      }
    }

    return groups
  }

  partition(predicate: (value: T) => boolean): [T[], T[]] {
    const matches: T[] = []
    const nonMatches: T[] = []

    for (const item of this) {
      if (predicate(item)) {
        matches.push(item)
      } else {
        nonMatches.push(item)
      }
    }

    return [matches, nonMatches]
  }

  joinToString(
    separator: string = ', ',
    prefix: string = '',
    postfix: string = '',
    limit: number = -1,
    truncated: string = '...',
    transform?: (value: T) => string
  ): string {
    let result = prefix
    let count = 0

    for (const item of this) {
      if (limit >= 0 && count >= limit) {
        result += truncated
        break
      }

      if (count > 0) {
        result += separator
      }

      result += transform ? transform(item) : String(item)
      count++
    }

    result += postfix
    return result
  }

  associateBy<K>(keySelector: (value: T) => K): Map<K, T> {
    const map = new Map<K, T>()

    for (const item of this) {
      map.set(keySelector(item), item)
    }

    return map
  }

  associateWith<V>(valueSelector: (value: T) => V): Map<T, V> {
    const map = new Map<T, V>()

    for (const item of this) {
      map.set(item, valueSelector(item))
    }

    return map
  }

  associate<K, V>(transform: (value: T) => [K, V]): Map<K, V> {
    const map = new Map<K, V>()

    for (const item of this) {
      const [key, value] = transform(item)
      map.set(key, value)
    }

    return map
  }
}

export function sequenceOf<T>(...elements: T[]): Sequence<T> {
  return Sequence.of(...elements)
}

export function asSequence<T>(iterable: Iterable<T>): Sequence<T> {
  return Sequence.from(iterable)
}

export function generateSequence<T>(seed: T, nextFunction: (current: T) => T | null | undefined): Sequence<T> {
  return Sequence.generateSequence(seed, nextFunction)
}
