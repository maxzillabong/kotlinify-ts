import { describe, it, expect } from 'vitest'
import {
  ifBlank,
  ifEmpty,
  isBlank,
  isNotBlank,
  isEmpty,
  isNotEmpty,
  toIntOrNull,
  toDoubleOrNull,
  toBooleanOrNull,
  toIntOrDefault,
  toDoubleOrDefault,
  lines,
  lineSequence,
  commonPrefix,
  commonSuffix,
} from './index'

describe('String Helpers', () => {
  describe('ifBlank', () => {
    it('should return original string if not blank', () => {
      expect(ifBlank('hello', 'default')).toBe('hello')
      expect(ifBlank('  hello  ', 'default')).toBe('  hello  ')
    })

    it('should return default for blank string', () => {
      expect(ifBlank('', 'default')).toBe('default')
      expect(ifBlank('   ', 'default')).toBe('default')
      expect(ifBlank('\t\n', 'default')).toBe('default')
    })

    it('should support lazy default value', () => {
      let called = false
      const result = ifBlank('hello', () => {
        called = true
        return 'default'
      })
      expect(result).toBe('hello')
      expect(called).toBe(false)
    })

    it('should call lazy default only when needed', () => {
      let called = false
      const result = ifBlank('  ', () => {
        called = true
        return 'default'
      })
      expect(result).toBe('default')
      expect(called).toBe(true)
    })
  })

  describe('ifEmpty', () => {
    it('should return original string if not empty', () => {
      expect(ifEmpty('hello', 'default')).toBe('hello')
      expect(ifEmpty('   ', 'default')).toBe('   ')
    })

    it('should return default for empty string', () => {
      expect(ifEmpty('', 'default')).toBe('default')
    })

    it('should support lazy default value', () => {
      expect(ifEmpty('hello', () => 'default')).toBe('hello')
      expect(ifEmpty('', () => 'default')).toBe('default')
    })
  })

  describe('isBlank', () => {
    it('should return true for blank strings', () => {
      expect(isBlank('')).toBe(true)
      expect(isBlank('   ')).toBe(true)
      expect(isBlank('\t\n')).toBe(true)
      expect(isBlank('  \r\n  ')).toBe(true)
    })

    it('should return false for non-blank strings', () => {
      expect(isBlank('hello')).toBe(false)
      expect(isBlank('  hello  ')).toBe(false)
      expect(isBlank('a')).toBe(false)
    })
  })

  describe('isNotBlank', () => {
    it('should return false for blank strings', () => {
      expect(isNotBlank('')).toBe(false)
      expect(isNotBlank('   ')).toBe(false)
    })

    it('should return true for non-blank strings', () => {
      expect(isNotBlank('hello')).toBe(true)
      expect(isNotBlank('  hello  ')).toBe(true)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty('   ')).toBe(false)
    })
  })

  describe('isNotEmpty', () => {
    it('should return false for empty string', () => {
      expect(isNotEmpty('')).toBe(false)
    })

    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true)
      expect(isNotEmpty('   ')).toBe(true)
    })
  })

  describe('toIntOrNull', () => {
    it('should parse valid integers', () => {
      expect(toIntOrNull('42')).toBe(42)
      expect(toIntOrNull('0')).toBe(0)
      expect(toIntOrNull('-100')).toBe(-100)
      expect(toIntOrNull('  123  ')).toBe(123)
    })

    it('should return null for invalid integers', () => {
      expect(toIntOrNull('abc')).toBeNull()
      expect(toIntOrNull('12.34')).toBeNull()
      expect(toIntOrNull('')).toBeNull()
      expect(toIntOrNull('12a')).toBeNull()
      expect(toIntOrNull('a12')).toBeNull()
    })
  })

  describe('toDoubleOrNull', () => {
    it('should parse valid floats', () => {
      expect(toDoubleOrNull('42.5')).toBe(42.5)
      expect(toDoubleOrNull('0.0')).toBe(0)
      expect(toDoubleOrNull('-100.25')).toBe(-100.25)
      expect(toDoubleOrNull('42')).toBe(42)
      expect(toDoubleOrNull('.5')).toBe(0.5)
    })

    it('should return null for invalid floats', () => {
      expect(toDoubleOrNull('abc')).toBeNull()
      expect(toDoubleOrNull('')).toBeNull()
    })
  })

  describe('toBooleanOrNull', () => {
    it('should parse true', () => {
      expect(toBooleanOrNull('true')).toBe(true)
      expect(toBooleanOrNull('TRUE')).toBe(true)
      expect(toBooleanOrNull('  True  ')).toBe(true)
    })

    it('should parse false', () => {
      expect(toBooleanOrNull('false')).toBe(false)
      expect(toBooleanOrNull('FALSE')).toBe(false)
      expect(toBooleanOrNull('  False  ')).toBe(false)
    })

    it('should return null for invalid booleans', () => {
      expect(toBooleanOrNull('yes')).toBeNull()
      expect(toBooleanOrNull('no')).toBeNull()
      expect(toBooleanOrNull('1')).toBeNull()
      expect(toBooleanOrNull('0')).toBeNull()
      expect(toBooleanOrNull('')).toBeNull()
    })
  })

  describe('toIntOrDefault', () => {
    it('should return parsed int or default', () => {
      expect(toIntOrDefault('42', 0)).toBe(42)
      expect(toIntOrDefault('abc', 0)).toBe(0)
      expect(toIntOrDefault('', -1)).toBe(-1)
    })
  })

  describe('toDoubleOrDefault', () => {
    it('should return parsed double or default', () => {
      expect(toDoubleOrDefault('42.5', 0)).toBe(42.5)
      expect(toDoubleOrDefault('abc', 0)).toBe(0)
      expect(toDoubleOrDefault('', -1)).toBe(-1)
    })
  })

  describe('lines', () => {
    it('should split string by newlines', () => {
      expect(lines('hello\nworld')).toEqual(['hello', 'world'])
      expect(lines('a\nb\nc')).toEqual(['a', 'b', 'c'])
    })

    it('should handle different line endings', () => {
      expect(lines('hello\r\nworld')).toEqual(['hello', 'world'])
      expect(lines('a\rb')).toEqual(['a', 'b'])
    })

    it('should handle empty lines', () => {
      expect(lines('a\n\nb')).toEqual(['a', '', 'b'])
      expect(lines('')).toEqual([''])
    })
  })

  describe('lineSequence', () => {
    it('should return iterator over lines', () => {
      const iterator = lineSequence('a\nb\nc')
      expect(iterator.next().value).toBe('a')
      expect(iterator.next().value).toBe('b')
      expect(iterator.next().value).toBe('c')
      expect(iterator.next().done).toBe(true)
    })

    it('should be iterable', () => {
      const result = [...lineSequence('x\ny\nz')]
      expect(result).toEqual(['x', 'y', 'z'])
    })
  })

  describe('commonPrefix', () => {
    it('should find common prefix', () => {
      expect(commonPrefix('hello', 'help', 'helicopter')).toBe('hel')
      expect(commonPrefix('test', 'testing', 'tester')).toBe('test')
    })

    it('should return empty string when no common prefix', () => {
      expect(commonPrefix('abc', 'xyz')).toBe('')
      expect(commonPrefix('hello', 'world')).toBe('')
    })

    it('should handle single string', () => {
      expect(commonPrefix('hello')).toBe('hello')
    })

    it('should handle empty array', () => {
      expect(commonPrefix()).toBe('')
    })

    it('should handle exact matches', () => {
      expect(commonPrefix('test', 'test', 'test')).toBe('test')
    })
  })

  describe('commonSuffix', () => {
    it('should find common suffix', () => {
      expect(commonSuffix('testing', 'running', 'jumping')).toBe('ing')
      expect(commonSuffix('photo.jpg', 'image.jpg', 'pic.jpg')).toBe('.jpg')
    })

    it('should return empty string when no common suffix', () => {
      expect(commonSuffix('abc', 'xyz')).toBe('')
      expect(commonSuffix('hello', 'world')).toBe('')
    })

    it('should handle single string', () => {
      expect(commonSuffix('hello')).toBe('hello')
    })

    it('should handle empty array', () => {
      expect(commonSuffix()).toBe('')
    })

    it('should handle exact matches', () => {
      expect(commonSuffix('test', 'test', 'test')).toBe('test')
    })
  })

  describe('Real-world scenarios', () => {
    it('should validate user input with ifBlank', () => {
      const getUsername = (input: string) => {
        return ifBlank(input, 'anonymous')
      }

      expect(getUsername('Alice')).toBe('Alice')
      expect(getUsername('   ')).toBe('anonymous')
      expect(getUsername('')).toBe('anonymous')
    })

    it('should parse config values safely', () => {
      const config: Record<string, string> = {
        port: '8080',
        timeout: '30.5',
        debug: 'true',
        invalid: 'not-a-number',
      }

      expect(toIntOrDefault(config.port, 3000)).toBe(8080)
      expect(toDoubleOrDefault(config.timeout, 10)).toBe(30.5)
      expect(toBooleanOrNull(config.debug)).toBe(true)
      expect(toIntOrDefault(config.invalid, 0)).toBe(0)
    })

    it('should process file extensions', () => {
      const files = ['photo.jpg', 'image.jpg', 'document.pdf', 'picture.jpg']
      const jpgFiles = files.filter((f) => f.endsWith('.jpg'))
      const extension = commonSuffix(...jpgFiles)

      expect(extension).toBe('.jpg')
    })

    it('should handle multiline text', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const lineArray = lines(text)

      expect(lineArray).toHaveLength(3)
      expect(lineArray[0]).toBe('Line 1')
      expect(lineArray[2]).toBe('Line 3')
    })

    it('should validate and parse form data', () => {
      type FormData = {
        age: string
        score: string
        agreed: string
      }

      const validateForm = (data: FormData) => {
        const age = toIntOrNull(data.age)
        const score = toDoubleOrNull(data.score)
        const agreed = toBooleanOrNull(data.agreed)

        return {
          valid:
            age !== null &&
            age >= 18 &&
            score !== null &&
            score >= 0 &&
            agreed === true,
          age,
          score,
          agreed,
        }
      }

      const validData = { age: '25', score: '95.5', agreed: 'true' }
      const validResult = validateForm(validData)
      expect(validResult.valid).toBe(true)
      expect(validResult.age).toBe(25)
      expect(validResult.score).toBe(95.5)

      const invalidData = { age: '15', score: 'abc', agreed: 'false' }
      const invalidResult = validateForm(invalidData)
      expect(invalidResult.valid).toBe(false)
    })
  })
})
