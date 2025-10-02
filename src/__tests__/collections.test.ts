import { describe, it, expect } from 'vitest'
import {
  flatten,
  flatMap,
  zip,
  unzip,
  associate,
  fold,
  reduce,
  foldRight,
  reduceRight,
  runningFold,
  runningReduce,
  take,
  takeLast,
  takeWhile,
  takeLastWhile,
  drop,
  dropLast,
  dropWhile,
  dropLastWhile,
  slice,
  distinct,
  count,
  sum,
  average,
  min,
  max,
  minOrNull,
  maxOrNull,
  all,
  any,
  none,
  first,
  last,
  partition,
  groupBy,
  chunked,
  windowed,
} from '../collections'

describe('Collection Functions', () => {
  describe('flatten', () => {
    it('flattens nested arrays', () => {
      expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5])
    })

    it('handles empty arrays', () => {
      expect(flatten([])).toEqual([])
      expect(flatten([[]])).toEqual([])
    })

    it('handles mixed flat and nested elements', () => {
      expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
    })
  })

  describe('flatMap', () => {
    it('maps and flattens', () => {
      expect(flatMap([1, 2, 3], x => [x, x * 2])).toEqual([1, 2, 2, 4, 3, 6])
    })

    it('handles empty arrays', () => {
      expect(flatMap([], x => [x])).toEqual([])
    })
  })

  describe('zip', () => {
    it('zips two arrays', () => {
      expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
    })

    it('stops at shorter array', () => {
      expect(zip([1, 2, 3], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']])
      expect(zip([1, 2], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b']])
    })

    it('handles empty arrays', () => {
      expect(zip([], [])).toEqual([])
      expect(zip([1], [])).toEqual([])
    })
  })

  describe('unzip', () => {
    it('unzips array of tuples', () => {
      expect(unzip([[1, 'a'], [2, 'b'], [3, 'c']])).toEqual([[1, 2, 3], ['a', 'b', 'c']])
    })

    it('handles empty array', () => {
      expect(unzip([])).toEqual([[], []])
    })
  })

  describe('associate', () => {
    it('creates map from array', () => {
      const result = associate([1, 2, 3], x => [`key${x}`, x * 2])
      expect(result.get('key1')).toBe(2)
      expect(result.get('key2')).toBe(4)
      expect(result.get('key3')).toBe(6)
    })
  })

  describe('fold and reduce', () => {
    it('fold accumulates with initial value', () => {
      expect(fold([1, 2, 3, 4], 0, (acc, x) => acc + x)).toBe(10)
    })

    it('reduce accumulates without initial value', () => {
      expect(reduce([1, 2, 3, 4], (acc, x) => acc + x)).toBe(10)
    })

    it('reduce throws on empty array', () => {
      expect(() => reduce([], (acc, x) => acc + x)).toThrow('Array is empty')
    })

    it('foldRight processes from right to left', () => {
      expect(foldRight([1, 2, 3], '', (val, acc) => acc + val)).toBe('321')
    })

    it('reduceRight processes from right to left', () => {
      expect(reduceRight([1, 2, 3], (val, acc) => `${acc}${val}`)).toBe('321')
    })
  })

  describe('running operations', () => {
    it('runningFold returns intermediate results', () => {
      expect(runningFold([1, 2, 3], 0, (acc, x) => acc + x)).toEqual([0, 1, 3, 6])
    })

    it('runningReduce returns intermediate results', () => {
      expect(runningReduce([1, 2, 3, 4], (acc, x) => acc + x)).toEqual([1, 3, 6, 10])
    })

    it('runningReduce handles empty array', () => {
      expect(runningReduce([], (acc, x) => acc + x)).toEqual([])
    })
  })

  describe('take operations', () => {
    it('take returns first n elements', () => {
      expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3])
    })

    it('take handles count larger than array', () => {
      expect(take([1, 2], 5)).toEqual([1, 2])
    })

    it('take handles negative count', () => {
      expect(take([1, 2, 3], -1)).toEqual([])
    })

    it('takeLast returns last n elements', () => {
      expect(takeLast([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5])
    })

    it('takeWhile takes while predicate is true', () => {
      expect(takeWhile([1, 2, 3, 4, 1], x => x < 3)).toEqual([1, 2])
    })

    it('takeLastWhile takes from end while predicate is true', () => {
      expect(takeLastWhile([1, 2, 3, 4, 5], x => x > 3)).toEqual([4, 5])
    })
  })

  describe('drop operations', () => {
    it('drop skips first n elements', () => {
      expect(drop([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5])
    })

    it('drop handles count larger than array', () => {
      expect(drop([1, 2], 5)).toEqual([])
    })

    it('dropLast skips last n elements', () => {
      expect(dropLast([1, 2, 3, 4, 5], 2)).toEqual([1, 2, 3])
    })

    it('dropWhile drops while predicate is true', () => {
      expect(dropWhile([1, 2, 3, 4, 1], x => x < 3)).toEqual([3, 4, 1])
    })

    it('dropLastWhile drops from end while predicate is true', () => {
      expect(dropLastWhile([1, 2, 3, 4, 5], x => x > 3)).toEqual([1, 2, 3])
    })
  })

  describe('slice', () => {
    it('gets elements at specific indices', () => {
      expect(slice([1, 2, 3, 4, 5], [0, 2, 4])).toEqual([1, 3, 5])
    })

    it('handles out of bounds indices', () => {
      expect(slice([1, 2, 3], [1, 10])).toEqual([2])
    })
  })

  describe('distinct', () => {
    it('removes duplicates', () => {
      expect(distinct([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4])
    })

    it('handles empty array', () => {
      expect(distinct([])).toEqual([])
    })
  })

  describe('count', () => {
    it('counts all elements without predicate', () => {
      expect(count([1, 2, 3, 4])).toBe(4)
    })

    it('counts elements matching predicate', () => {
      expect(count([1, 2, 3, 4, 5], x => x % 2 === 0)).toBe(2)
    })
  })

  describe('numeric aggregations', () => {
    it('sum adds all numbers', () => {
      expect(sum([1, 2, 3, 4])).toBe(10)
    })

    it('average calculates mean', () => {
      expect(average([1, 2, 3, 4])).toBe(2.5)
    })

    it('average throws on empty array', () => {
      expect(() => average([])).toThrow('Array is empty')
    })

    it('min finds minimum', () => {
      expect(min([3, 1, 4, 1, 5])).toBe(1)
    })

    it('max finds maximum', () => {
      expect(max([3, 1, 4, 1, 5])).toBe(5)
    })

    it('minOrNull returns null for empty array', () => {
      expect(minOrNull([])).toBeNull()
    })

    it('maxOrNull returns null for empty array', () => {
      expect(maxOrNull([])).toBeNull()
    })
  })

  describe('predicates', () => {
    it('all returns true if all match', () => {
      expect(all([2, 4, 6], x => x % 2 === 0)).toBe(true)
      expect(all([2, 3, 6], x => x % 2 === 0)).toBe(false)
    })

    it('any returns true if at least one matches', () => {
      expect(any([1, 2, 3], x => x % 2 === 0)).toBe(true)
      expect(any([1, 3, 5], x => x % 2 === 0)).toBe(false)
    })

    it('any without predicate checks if array is not empty', () => {
      expect(any([1, 2, 3])).toBe(true)
      expect(any([])).toBe(false)
    })

    it('none returns true if none match', () => {
      expect(none([1, 3, 5], x => x % 2 === 0)).toBe(true)
      expect(none([1, 2, 5], x => x % 2 === 0)).toBe(false)
    })
  })

  describe('first and last', () => {
    it('first returns first element', () => {
      expect(first([1, 2, 3])).toBe(1)
    })

    it('first throws on empty array', () => {
      expect(() => first([])).toThrow('Array is empty')
    })

    it('last returns last element', () => {
      expect(last([1, 2, 3])).toBe(3)
    })

    it('last throws on empty array', () => {
      expect(() => last([])).toThrow('Array is empty')
    })
  })

  describe('partition', () => {
    it('splits array by predicate', () => {
      const [even, odd] = partition([1, 2, 3, 4, 5], x => x % 2 === 0)
      expect(even).toEqual([2, 4])
      expect(odd).toEqual([1, 3, 5])
    })
  })

  describe('groupBy', () => {
    it('groups elements by key', () => {
      const result = groupBy([1, 2, 3, 4, 5], x => x % 2 === 0 ? 'even' : 'odd')
      expect(result.even).toEqual([2, 4])
      expect(result.odd).toEqual([1, 3, 5])
    })
  })

  describe('chunked', () => {
    it('splits into fixed-size chunks', () => {
      expect(chunked([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })
  })

  describe('windowed', () => {
    it('creates sliding windows', () => {
      expect(windowed([1, 2, 3, 4], 2, 1)).toEqual([[1, 2], [2, 3], [3, 4]])
    })

    it('respects step parameter', () => {
      expect(windowed([1, 2, 3, 4, 5], 2, 2)).toEqual([[1, 2], [3, 4]])
    })
  })
})
