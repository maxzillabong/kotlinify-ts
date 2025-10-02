import { describe, it, expect } from 'vitest'
import {
  trimIndent,
  trimMargin,
  padStart,
  padEnd,
  removePrefix,
  removeSuffix,
  removeSurrounding,
  capitalize,
  decapitalize,
  repeat,
  lines,
  reversed,
} from '../strings'

describe('String Functions', () => {
  describe('trimIndent', () => {
    it('removes common leading whitespace', () => {
      const input = `
        Hello
        World
      `
      const expected = '\nHello\nWorld\n'
      expect(trimIndent(input)).toBe(expected)
    })

    it('handles varying indentation', () => {
      const input = '    line1\n      line2\n    line3'
      expect(trimIndent(input)).toBe('line1\n  line2\nline3')
    })

    it('handles empty string', () => {
      expect(trimIndent('')).toBe('')
    })

    it('handles string with no whitespace', () => {
      expect(trimIndent('Hello\nWorld')).toBe('Hello\nWorld')
    })
  })

  describe('trimMargin', () => {
    it('removes margin prefix', () => {
      const input = '|Hello\n|World'
      expect(trimMargin(input)).toBe('Hello\nWorld')
    })

    it('uses custom margin prefix', () => {
      const input = '>Hello\n>World'
      expect(trimMargin(input, '>')).toBe('Hello\nWorld')
    })

    it('only removes from lines with prefix', () => {
      const input = '|Hello\nWorld\n|Test'
      expect(trimMargin(input)).toBe('Hello\nWorld\nTest')
    })
  })

  describe('padStart', () => {
    it('pads string to length', () => {
      expect(padStart('5', 3, '0')).toBe('005')
    })

    it('does not pad if already long enough', () => {
      expect(padStart('hello', 3)).toBe('hello')
    })

    it('uses space as default', () => {
      expect(padStart('hi', 5)).toBe('   hi')
    })
  })

  describe('padEnd', () => {
    it('pads string to length', () => {
      expect(padEnd('5', 3, '0')).toBe('500')
    })

    it('does not pad if already long enough', () => {
      expect(padEnd('hello', 3)).toBe('hello')
    })

    it('uses space as default', () => {
      expect(padEnd('hi', 5)).toBe('hi   ')
    })
  })

  describe('removePrefix', () => {
    it('removes prefix if present', () => {
      expect(removePrefix('Hello World', 'Hello ')).toBe('World')
    })

    it('returns original if prefix not present', () => {
      expect(removePrefix('Hello World', 'Goodbye ')).toBe('Hello World')
    })

    it('handles empty prefix', () => {
      expect(removePrefix('Hello', '')).toBe('Hello')
    })
  })

  describe('removeSuffix', () => {
    it('removes suffix if present', () => {
      expect(removeSuffix('Hello World', ' World')).toBe('Hello')
    })

    it('returns original if suffix not present', () => {
      expect(removeSuffix('Hello World', ' Universe')).toBe('Hello World')
    })

    it('handles empty suffix', () => {
      expect(removeSuffix('Hello', '')).toBe('Hello')
    })
  })

  describe('removeSurrounding', () => {
    it('removes delimiter from both sides', () => {
      expect(removeSurrounding('"Hello"', '"')).toBe('Hello')
    })

    it('removes different prefix and suffix', () => {
      expect(removeSurrounding('<Hello>', '<', '>')).toBe('Hello')
    })

    it('returns original if delimiters not present', () => {
      expect(removeSurrounding('Hello', '"')).toBe('Hello')
    })

    it('returns original if only one delimiter present', () => {
      expect(removeSurrounding('"Hello', '"')).toBe('"Hello')
      expect(removeSurrounding('Hello"', '"')).toBe('Hello"')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('does not affect rest of string', () => {
      expect(capitalize('hELLO')).toBe('HELLO')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('decapitalize', () => {
    it('decapitalizes first letter', () => {
      expect(decapitalize('Hello')).toBe('hello')
    })

    it('does not affect rest of string', () => {
      expect(decapitalize('HELLO')).toBe('hELLO')
    })

    it('handles empty string', () => {
      expect(decapitalize('')).toBe('')
    })
  })

  describe('repeat', () => {
    it('repeats string n times', () => {
      expect(repeat('ab', 3)).toBe('ababab')
    })

    it('returns empty string for 0 count', () => {
      expect(repeat('hello', 0)).toBe('')
    })
  })

  describe('lines', () => {
    it('splits by newlines', () => {
      expect(lines('line1\nline2\nline3')).toEqual(['line1', 'line2', 'line3'])
    })

    it('handles CRLF', () => {
      expect(lines('line1\r\nline2\r\nline3')).toEqual(['line1', 'line2', 'line3'])
    })

    it('handles single line', () => {
      expect(lines('single')).toEqual(['single'])
    })
  })

  describe('reversed', () => {
    it('reverses string', () => {
      expect(reversed('hello')).toBe('olleh')
    })

    it('handles empty string', () => {
      expect(reversed('')).toBe('')
    })

    it('handles single character', () => {
      expect(reversed('a')).toBe('a')
    })
  })
})
