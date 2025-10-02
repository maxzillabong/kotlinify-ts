import { describe, it, expect } from 'vitest'
import { IntRange, rangeTo, until, downTo, step } from '../ranges'

describe('Range Functions', () => {
  describe('IntRange', () => {
    it('creates ascending range', () => {
      const range = new IntRange(1, 5)
      expect(range.toArray()).toEqual([1, 2, 3, 4, 5])
    })

    it('creates descending range', () => {
      const range = new IntRange(5, 1, -1)
      expect(range.toArray()).toEqual([5, 4, 3, 2, 1])
    })

    it('handles step', () => {
      const range = new IntRange(1, 10, 2)
      expect(range.toArray()).toEqual([1, 3, 5, 7, 9])
    })

    it('checks contains', () => {
      const range = new IntRange(1, 10, 2)
      expect(range.contains(5)).toBe(true)
      expect(range.contains(6)).toBe(false)
      expect(range.contains(0)).toBe(false)
      expect(range.contains(11)).toBe(false)
    })

    it('isEmpty returns false for valid range', () => {
      expect(new IntRange(1, 5).isEmpty).toBe(false)
    })

    it('isEmpty returns true for invalid range', () => {
      expect(new IntRange(5, 1, 1).isEmpty).toBe(true)
    })

    it('counts elements', () => {
      expect(new IntRange(1, 5).count()).toBe(5)
      expect(new IntRange(1, 10, 2).count()).toBe(5)
    })

    it('gets first element', () => {
      expect(new IntRange(3, 7).first()).toBe(3)
    })

    it('gets last element', () => {
      expect(new IntRange(1, 10, 2).last()).toBe(9)
      expect(new IntRange(1, 5).last()).toBe(5)
    })

    it('throws on empty range operations', () => {
      const empty = new IntRange(5, 1, 1)
      expect(() => empty.first()).toThrow('Range is empty')
      expect(() => empty.last()).toThrow('Range is empty')
    })

    it('reverses range', () => {
      const range = new IntRange(1, 5)
      const reversed = range.reversed()
      expect(reversed.toArray()).toEqual([5, 4, 3, 2, 1])
    })

    it('changes step', () => {
      const range = new IntRange(1, 10)
      const stepped = range.withStep(3)
      expect(stepped.toArray()).toEqual([1, 4, 7, 10])
    })

    it('throws on zero step', () => {
      expect(() => new IntRange(1, 5, 0)).toThrow('Step must be non-zero')
    })

    it.skip('throws on invalid step direction', () => {
      expect(() => new IntRange(1, 5, -1)).toThrow()
      expect(() => new IntRange(5, 1, -1)).toThrow()
    })
  })

  describe('rangeTo', () => {
    it('creates inclusive range', () => {
      const range = rangeTo(1, 5)
      expect(range.toArray()).toEqual([1, 2, 3, 4, 5])
    })

    it('works with single element', () => {
      expect(rangeTo(5, 5).toArray()).toEqual([5])
    })
  })

  describe('until', () => {
    it('creates exclusive range', () => {
      const range = until(1, 5)
      expect(range.toArray()).toEqual([1, 2, 3, 4])
    })

    it('excludes end value', () => {
      const range = until(0, 3)
      expect(range.contains(3)).toBe(false)
      expect(range.last()).toBe(2)
    })
  })

  describe('downTo', () => {
    it('creates descending range', () => {
      const range = downTo(5, 1)
      expect(range.toArray()).toEqual([5, 4, 3, 2, 1])
    })

    it('works with single element', () => {
      expect(downTo(5, 5).toArray()).toEqual([5])
    })
  })

  describe('step', () => {
    it('changes step of range', () => {
      const range = step(rangeTo(1, 10), 2)
      expect(range.toArray()).toEqual([1, 3, 5, 7, 9])
    })

    it('works with descending range', () => {
      const range = step(downTo(10, 1), 2)
      expect(range.toArray()).toEqual([10, 8, 6, 4, 2])
    })
  })

  describe('iteration', () => {
    it('works with for...of', () => {
      const range = rangeTo(1, 5)
      const values: number[] = []
      for (const value of range) {
        values.push(value)
      }
      expect(values).toEqual([1, 2, 3, 4, 5])
    })

    it('forEach executes action', () => {
      const range = rangeTo(1, 3)
      const values: number[] = []
      range.forEach(v => values.push(v * 2))
      expect(values).toEqual([2, 4, 6])
    })
  })

  describe('edge cases', () => {
    it('handles large ranges efficiently', () => {
      const range = rangeTo(1, 1000)
      expect(range.count()).toBe(1000)
      expect(range.first()).toBe(1)
      expect(range.last()).toBe(1000)
    })

    it('handles negative numbers', () => {
      const range = rangeTo(-5, 5)
      expect(range.toArray()).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5])
    })

    it('handles negative step', () => {
      const range = new IntRange(10, 1, -2)
      expect(range.toArray()).toEqual([10, 8, 6, 4, 2])
    })
  })
})
