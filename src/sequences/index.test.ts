import { describe, it, expect, vi } from 'vitest'
import { Sequence, sequenceOf, asSequence, generateSequence } from './index'

describe('Sequence', () => {
  describe('creation', () => {
    it('creates from values', () => {
      const seq = Sequence.of(1, 2, 3)
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('creates from iterable', () => {
      const seq = Sequence.from([1, 2, 3])
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('creates with sequenceOf', () => {
      const seq = sequenceOf(1, 2, 3)
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('creates with asSequence', () => {
      const seq = asSequence([1, 2, 3])
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('creates from array using asSequence', () => {
      const seq = asSequence([1, 2, 3])
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('creates with generateSequence', () => {
      const seq = generateSequence(1, (x) => (x < 5 ? x + 1 : null))
      expect(seq.toArray()).toEqual([1, 2, 3, 4, 5])
    })

    it('creates infinite sequence with generate', () => {
      let counter = 0
      const seq = Sequence.generate(() => counter++)
      expect(seq.take(5).toArray()).toEqual([0, 1, 2, 3, 4])
    })
  })

  describe('map', () => {
    it('transforms values lazily', () => {
      const transform = vi.fn((x: number) => x * 2)
      const seq = sequenceOf(1, 2, 3).map(transform)

      expect(transform).not.toHaveBeenCalled()

      const result = seq.toArray()
      expect(result).toEqual([2, 4, 6])
      expect(transform).toHaveBeenCalledTimes(3)
    })
  })

  describe('filter', () => {
    it('filters values lazily', () => {
      const predicate = vi.fn((x: number) => x % 2 === 0)
      const seq = sequenceOf(1, 2, 3, 4, 5).filter(predicate)

      expect(predicate).not.toHaveBeenCalled()

      const result = seq.toArray()
      expect(result).toEqual([2, 4])
      expect(predicate).toHaveBeenCalledTimes(5)
    })
  })

  describe('flatMap', () => {
    it('flattens sequences', () => {
      const seq = sequenceOf(1, 2, 3).flatMap((x) => [x, x * 10])
      expect(seq.toArray()).toEqual([1, 10, 2, 20, 3, 30])
    })
  })

  describe('take', () => {
    it('takes first n elements', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).take(3)
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('takes all if count exceeds length', () => {
      const seq = sequenceOf(1, 2).take(10)
      expect(seq.toArray()).toEqual([1, 2])
    })

    it('works lazily', () => {
      const transform = vi.fn((x: number) => x * 2)
      const seq = sequenceOf(1, 2, 3, 4, 5).map(transform).take(2)

      seq.toArray()
      expect(transform).toHaveBeenCalledTimes(2)
    })
  })

  describe('takeWhile', () => {
    it('takes while predicate is true', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).takeWhile((x) => x < 4)
      expect(seq.toArray()).toEqual([1, 2, 3])
    })

    it('stops on first false', () => {
      const predicate = vi.fn((x: number) => x < 3)
      const seq = sequenceOf(1, 2, 3, 4, 5).takeWhile(predicate)

      seq.toArray()
      expect(predicate).toHaveBeenCalledTimes(3)
    })
  })

  describe('drop', () => {
    it('drops first n elements', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).drop(2)
      expect(seq.toArray()).toEqual([3, 4, 5])
    })

    it('returns empty if count exceeds length', () => {
      const seq = sequenceOf(1, 2).drop(10)
      expect(seq.toArray()).toEqual([])
    })
  })

  describe('dropWhile', () => {
    it('drops while predicate is true', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).dropWhile((x) => x < 3)
      expect(seq.toArray()).toEqual([3, 4, 5])
    })
  })

  describe('distinct', () => {
    it('removes duplicates', () => {
      const seq = sequenceOf(1, 2, 2, 3, 1, 4).distinct()
      expect(seq.toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('distinctBy', () => {
    it('removes duplicates by key', () => {
      const seq = sequenceOf(
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' }
      ).distinctBy((x) => x.id)

      expect(seq.toArray()).toEqual([
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ])
    })
  })

  describe('sorted', () => {
    it('sorts numbers', () => {
      const seq = sequenceOf(3, 1, 4, 1, 5, 9).sorted()
      expect(seq.toArray()).toEqual([1, 1, 3, 4, 5, 9])
    })

    it('accepts custom comparator', () => {
      const seq = sequenceOf(3, 1, 4, 1, 5).sorted((a, b) => b - a)
      expect(seq.toArray()).toEqual([5, 4, 3, 1, 1])
    })
  })

  describe('sortedBy', () => {
    it('sorts by selector', () => {
      const seq = sequenceOf(
        { id: 3 },
        { id: 1 },
        { id: 2 }
      ).sortedBy((x) => x.id)

      expect(seq.toArray()).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
  })

  describe('chunked', () => {
    it('chunks sequence', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).chunked(2)
      expect(seq.toArray()).toEqual([[1, 2], [3, 4], [5]])
    })
  })

  describe('windowed', () => {
    it('creates sliding windows', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).windowed(3)
      expect(seq.toArray()).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]])
    })

    it('supports step parameter', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5, 6).windowed(2, 2)
      expect(seq.toArray()).toEqual([[1, 2], [3, 4], [5, 6]])
    })

    it('supports partial windows', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).windowed(3, 3, true)
      expect(seq.toArray()).toEqual([[1, 2, 3], [4, 5]])
    })
  })

  describe('zipWithNext', () => {
    it('zips with next element', () => {
      const seq = sequenceOf(1, 2, 3, 4).zipWithNext()
      expect(seq.toArray()).toEqual([[1, 2], [2, 3], [3, 4]])
    })
  })

  describe('zip', () => {
    it('zips two sequences', () => {
      const seq = sequenceOf(1, 2, 3).zip(['a', 'b', 'c'])
      expect(seq.toArray()).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
    })

    it('stops at shortest sequence', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5).zip(['a', 'b'])
      expect(seq.toArray()).toEqual([[1, 'a'], [2, 'b']])
    })
  })

  describe('onEach', () => {
    it('performs side effect', () => {
      const sideEffect = vi.fn()
      const seq = sequenceOf(1, 2, 3).onEach(sideEffect)

      expect(sideEffect).not.toHaveBeenCalled()

      seq.toArray()
      expect(sideEffect).toHaveBeenCalledTimes(3)
    })
  })

  describe('forEach', () => {
    it('iterates over sequence', () => {
      const action = vi.fn()
      sequenceOf(1, 2, 3).forEach(action)
      expect(action).toHaveBeenCalledTimes(3)
    })
  })

  describe('toArray', () => {
    it('converts to array', () => {
      const array = sequenceOf(1, 2, 3).toArray()
      expect(array).toEqual([1, 2, 3])
    })
  })

  describe('toSet', () => {
    it('converts to set', () => {
      const set = sequenceOf(1, 2, 2, 3).toSet()
      expect(set).toEqual(new Set([1, 2, 3]))
    })
  })

  describe('toMap', () => {
    it('converts to map', () => {
      const map = sequenceOf<[string, number]>(['a', 1], ['b', 2]).toMap()
      expect(map).toEqual(new Map([['a', 1], ['b', 2]]))
    })
  })

  describe('first', () => {
    it('returns first element', () => {
      expect(sequenceOf(1, 2, 3).first()).toBe(1)
    })

    it('throws on empty sequence', () => {
      expect(() => sequenceOf().first()).toThrow()
    })
  })

  describe('firstOrNull', () => {
    it('returns first element', () => {
      expect(sequenceOf(1, 2, 3).firstOrNull()).toBe(1)
    })

    it('returns null on empty sequence', () => {
      expect(sequenceOf().firstOrNull()).toBe(null)
    })
  })

  describe('last', () => {
    it('returns last element', () => {
      expect(sequenceOf(1, 2, 3).last()).toBe(3)
    })

    it('throws on empty sequence', () => {
      expect(() => sequenceOf().last()).toThrow()
    })
  })

  describe('lastOrNull', () => {
    it('returns last element', () => {
      expect(sequenceOf(1, 2, 3).lastOrNull()).toBe(3)
    })

    it('returns null on empty sequence', () => {
      expect(sequenceOf().lastOrNull()).toBe(null)
    })
  })

  describe('find', () => {
    it('finds matching element', () => {
      expect(sequenceOf(1, 2, 3, 4).find((x) => x > 2)).toBe(3)
    })

    it('returns undefined when not found', () => {
      expect(sequenceOf(1, 2, 3).find((x) => x > 10)).toBeUndefined()
    })
  })

  describe('any', () => {
    it('returns true if any match', () => {
      expect(sequenceOf(1, 2, 3).any((x) => x > 2)).toBe(true)
    })

    it('returns false if none match', () => {
      expect(sequenceOf(1, 2, 3).any((x) => x > 10)).toBe(false)
    })

    it('returns true for non-empty without predicate', () => {
      expect(sequenceOf(1).any()).toBe(true)
    })

    it('returns false for empty without predicate', () => {
      expect(sequenceOf().any()).toBe(false)
    })
  })

  describe('all', () => {
    it('returns true if all match', () => {
      expect(sequenceOf(2, 4, 6).all((x) => x % 2 === 0)).toBe(true)
    })

    it('returns false if any does not match', () => {
      expect(sequenceOf(2, 3, 4).all((x) => x % 2 === 0)).toBe(false)
    })
  })

  describe('none', () => {
    it('returns true if none match', () => {
      expect(sequenceOf(1, 3, 5).none((x) => x % 2 === 0)).toBe(true)
    })

    it('returns false if any matches', () => {
      expect(sequenceOf(1, 2, 3).none((x) => x % 2 === 0)).toBe(false)
    })
  })

  describe('count', () => {
    it('counts all elements', () => {
      expect(sequenceOf(1, 2, 3, 4).count()).toBe(4)
    })

    it('counts matching elements', () => {
      expect(sequenceOf(1, 2, 3, 4, 5).count((x) => x % 2 === 0)).toBe(2)
    })
  })

  describe('reduce', () => {
    it('reduces sequence', () => {
      const sum = sequenceOf(1, 2, 3, 4).reduce((acc, x) => acc + x, 0)
      expect(sum).toBe(10)
    })
  })

  describe('fold', () => {
    it('folds sequence', () => {
      const sum = sequenceOf(1, 2, 3, 4).fold(0, (acc, x) => acc + x)
      expect(sum).toBe(10)
    })
  })

  describe('sum', () => {
    it('sums numbers', () => {
      expect(sequenceOf(1, 2, 3, 4).sum()).toBe(10)
    })
  })

  describe('sumBy', () => {
    it('sums by selector', () => {
      const seq = sequenceOf({ value: 1 }, { value: 2 }, { value: 3 })
      expect(seq.sumBy((x) => x.value)).toBe(6)
    })
  })

  describe('average', () => {
    it('calculates average', () => {
      expect(sequenceOf(1, 2, 3, 4).average()).toBe(2.5)
    })

    it('throws on empty sequence', () => {
      expect(() => sequenceOf().average()).toThrow()
    })
  })

  describe('averageBy', () => {
    it('calculates average by selector', () => {
      const seq = sequenceOf({ value: 2 }, { value: 4 }, { value: 6 })
      expect(seq.averageBy((x) => x.value)).toBe(4)
    })
  })

  describe('maxBy', () => {
    it('finds max by selector', () => {
      const seq = sequenceOf({ id: 3 }, { id: 1 }, { id: 5 })
      expect(seq.maxBy((x) => x.id)).toEqual({ id: 5 })
    })

    it('throws on empty sequence', () => {
      expect(() => sequenceOf().maxBy((x) => x)).toThrow()
    })
  })

  describe('minBy', () => {
    it('finds min by selector', () => {
      const seq = sequenceOf({ id: 3 }, { id: 1 }, { id: 5 })
      expect(seq.minBy((x) => x.id)).toEqual({ id: 1 })
    })

    it('throws on empty sequence', () => {
      expect(() => sequenceOf().minBy((x) => x)).toThrow()
    })
  })

  describe('groupBy', () => {
    it('groups elements by key', () => {
      const seq = sequenceOf(1, 2, 3, 4, 5, 6)
      const groups = seq.groupBy((x) => x % 2)

      expect(groups.get(0)).toEqual([2, 4, 6])
      expect(groups.get(1)).toEqual([1, 3, 5])
    })
  })

  describe('partition', () => {
    it('partitions into two arrays', () => {
      const [evens, odds] = sequenceOf(1, 2, 3, 4, 5).partition((x) => x % 2 === 0)
      expect(evens).toEqual([2, 4])
      expect(odds).toEqual([1, 3, 5])
    })
  })

  describe('joinToString', () => {
    it('joins to string with default separator', () => {
      expect(sequenceOf(1, 2, 3).joinToString()).toBe('1, 2, 3')
    })

    it('joins with custom separator', () => {
      expect(sequenceOf(1, 2, 3).joinToString(' - ')).toBe('1 - 2 - 3')
    })

    it('supports prefix and postfix', () => {
      expect(sequenceOf(1, 2, 3).joinToString(', ', '[', ']')).toBe('[1, 2, 3]')
    })

    it('supports limit', () => {
      expect(sequenceOf(1, 2, 3, 4, 5).joinToString(', ', '', '', 3)).toBe('1, 2, 3...')
    })

    it('supports transform', () => {
      expect(sequenceOf(1, 2, 3).joinToString(', ', '', '', -1, '...', (x) => `n${x}`)).toBe('n1, n2, n3')
    })
  })

  describe('associateBy', () => {
    it('creates map by key selector', () => {
      const seq = sequenceOf({ id: 1, name: 'a' }, { id: 2, name: 'b' })
      const map = seq.associateBy((x) => x.id)

      expect(map.get(1)).toEqual({ id: 1, name: 'a' })
      expect(map.get(2)).toEqual({ id: 2, name: 'b' })
    })
  })

  describe('associateWith', () => {
    it('creates map with transformed values', () => {
      const map = sequenceOf(1, 2, 3).associateWith((x) => x * 10)

      expect(map.get(1)).toBe(10)
      expect(map.get(2)).toBe(20)
      expect(map.get(3)).toBe(30)
    })
  })

  describe('associate', () => {
    it('creates map from pairs', () => {
      const map = sequenceOf(1, 2, 3).associate((x) => [`key${x}`, x * 10] as [string, number])

      expect(map.get('key1')).toBe(10)
      expect(map.get('key2')).toBe(20)
      expect(map.get('key3')).toBe(30)
    })
  })

  describe('laziness', () => {
    it('does not evaluate until terminal operation', () => {
      const sideEffect = vi.fn()

      sequenceOf(1, 2, 3, 4, 5)
        .map((x) => {
          sideEffect()
          return x * 2
        })
        .filter((x) => x > 5)

      expect(sideEffect).not.toHaveBeenCalled()
    })

    it('evaluates only necessary elements', () => {
      const mapFn = vi.fn((x: number) => x * 2)
      const filterFn = vi.fn((x: number) => x > 5)

      sequenceOf(1, 2, 3, 4, 5)
        .map(mapFn)
        .filter(filterFn)
        .take(2)
        .toArray()

      expect(mapFn).toHaveBeenCalledTimes(4)
      expect(filterFn).toHaveBeenCalledTimes(4)
    })
  })

  describe('chaining', () => {
    it('chains multiple operations', () => {
      const result = sequenceOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .take(3)
        .toArray()

      expect(result).toEqual([4, 8, 12])
    })
  })
})
