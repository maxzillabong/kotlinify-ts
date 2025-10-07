import { describe, it, expect } from 'vitest'
import {
  takeIf,
  takeUnless,
  orEmpty,
  orEmptyArray,
  isNullOrEmpty,
  isNullOrBlank,
} from './index'

describe('nullsafety', () => {
  describe('takeIf', () => {
    it('returns value when predicate is true', () => {
      expect(takeIf(5, x => x > 3)).toBe(5)
    })

    it('returns undefined when predicate is false', () => {
      expect(takeIf(5, x => x > 10)).toBeUndefined()
    })
  })

  describe('takeUnless', () => {
    it('returns undefined when predicate is true', () => {
      expect(takeUnless(5, x => x > 3)).toBeUndefined()
    })

    it('returns value when predicate is false', () => {
      expect(takeUnless(5, x => x > 10)).toBe(5)
    })
  })

  describe('orEmpty', () => {
    it('returns value when string is provided', () => {
      expect(orEmpty('hello')).toBe('hello')
    })

    it('returns empty string when null', () => {
      expect(orEmpty(null)).toBe('')
    })

    it('returns empty string when undefined', () => {
      expect(orEmpty(undefined)).toBe('')
    })
  })

  describe('orEmptyArray', () => {
    it('returns value when array is provided', () => {
      expect(orEmptyArray([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('returns empty array when null', () => {
      expect(orEmptyArray<number>(null)).toEqual([])
    })

    it('returns empty array when undefined', () => {
      expect(orEmptyArray<number>(undefined)).toEqual([])
    })

    it('preserves array type', () => {
      const result = orEmptyArray<string>(['a', 'b'])
      expect(result).toEqual(['a', 'b'])
    })
  })

  describe('isNullOrEmpty', () => {
    it('returns true for null string', () => {
      expect(isNullOrEmpty(null)).toBe(true)
    })

    it('returns true for undefined string', () => {
      expect(isNullOrEmpty(undefined)).toBe(true)
    })

    it('returns true for empty string', () => {
      expect(isNullOrEmpty('')).toBe(true)
    })

    it('returns false for non-empty string', () => {
      expect(isNullOrEmpty('hello')).toBe(false)
    })

    it('returns true for null array', () => {
      expect(isNullOrEmpty<number>(null)).toBe(true)
    })

    it('returns true for undefined array', () => {
      expect(isNullOrEmpty<number>(undefined)).toBe(true)
    })

    it('returns true for empty array', () => {
      expect(isNullOrEmpty([])).toBe(true)
    })

    it('returns false for non-empty array', () => {
      expect(isNullOrEmpty([1, 2, 3])).toBe(false)
    })
  })

  describe('isNullOrBlank', () => {
    it('returns true for null', () => {
      expect(isNullOrBlank(null)).toBe(true)
    })

    it('returns true for undefined', () => {
      expect(isNullOrBlank(undefined)).toBe(true)
    })

    it('returns true for empty string', () => {
      expect(isNullOrBlank('')).toBe(true)
    })

    it('returns true for whitespace-only string', () => {
      expect(isNullOrBlank('   ')).toBe(true)
      expect(isNullOrBlank('\t\n')).toBe(true)
    })

    it('returns false for non-blank string', () => {
      expect(isNullOrBlank('hello')).toBe(false)
      expect(isNullOrBlank('  hello  ')).toBe(false)
    })
  })
})
