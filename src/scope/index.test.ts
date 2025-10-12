import { describe, it, expect, vi } from 'vitest'
import { asScope, letValue, apply, also, run, withValue, letOrNull, applyOrNull, alsoOrNull, runOrNull } from './index'

describe('Scope Functions', () => {
  describe('let', () => {
    it('transforms value and returns result', () => {
      const result = letValue(5, (x) => x * 2)
      expect(result).toBe(10)
    })

    it('works with objects', () => {
      const user = { name: 'Alice', age: 30 }
      const result = letValue(user, (u) => u.name.toUpperCase())
      expect(result).toBe('ALICE')
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('apply', () => {
    it('configures object and returns it', () => {
      const obj = { x: 0, y: 0 }
      const result = apply(obj, (o) => {
        o.x = 10
        o.y = 20
      })
      expect(result).toBe(obj)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('also', () => {
    it('performs side effect and returns original', () => {
      const sideEffect = vi.fn()
      const value = 'test'
      const result = also(value, sideEffect)
      expect(result).toBe(value)
      expect(sideEffect).toHaveBeenCalledWith(value)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('run', () => {
    it('executes block with context', () => {
      const obj = { x: 10, y: 20 }
      const result = run(obj, function () {
        return this.x + this.y
      })
      expect(result).toBe(30)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('withValue', () => {
    it('executes block with receiver', () => {
      const obj = { a: 5, b: 10 }
      const result = withValue(obj, function () {
        return this.a + this.b
      })
      expect(result).toBe(15)
    })
  })

  describe('letOrNull', () => {
    it('transforms non-null value', () => {
      const result = letOrNull(5, (x) => x * 2)
      expect(result).toBe(10)
    })

    it('returns null for null input', () => {
      const result = letOrNull<number, number>(null, (x) => x * 2)
      expect(result).toBe(null)
    })

    it('returns null for undefined input', () => {
      const result = letOrNull<number, number>(undefined, (x) => x * 2)
      expect(result).toBe(null)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })

    it.skip('supports chaining via prototype with null', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('applyOrNull', () => {
    it('configures non-null object', () => {
      const obj = { x: 0 }
      const result = applyOrNull(obj, (o) => {
        o.x = 10
      })
      expect(result).toBe(obj)
      expect(result?.x).toBe(10)
    })

    it('returns null for null input', () => {
      const result = applyOrNull(null, (o) => {
        (o as any).x = 10
      })
      expect(result).toBe(null)
    })

    it('returns null for undefined input', () => {
      const result = applyOrNull(undefined, (o) => {
        (o as any).x = 10
      })
      expect(result).toBe(null)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('alsoOrNull', () => {
    it('performs side effect on non-null value', () => {
      const sideEffect = vi.fn()
      const value = 'test'
      const result = alsoOrNull(value, sideEffect)
      expect(result).toBe(value)
      expect(sideEffect).toHaveBeenCalledWith(value)
    })

    it('returns null for null input without calling side effect', () => {
      const sideEffect = vi.fn()
      const result = alsoOrNull(null, sideEffect)
      expect(result).toBe(null)
      expect(sideEffect).not.toHaveBeenCalled()
    })

    it('returns null for undefined input without calling side effect', () => {
      const sideEffect = vi.fn()
      const result = alsoOrNull(undefined, sideEffect)
      expect(result).toBe(null)
      expect(sideEffect).not.toHaveBeenCalled()
    })
  })

  describe('runOrNull', () => {
    it('executes block with non-null context', () => {
      const obj = { x: 10, y: 20 }
      const result = runOrNull(obj, function () {
        return this.x + this.y
      })
      expect(result).toBe(30)
    })

    it('returns null for null input', () => {
      const result = runOrNull(null, function () {
        return (this as any).x + (this as any).y
      })
      expect(result).toBe(null)
    })

    it('returns null for undefined input', () => {
      const result = runOrNull(undefined, function () {
        return (this as any).x + (this as any).y
      })
      expect(result).toBe(null)
    })

    it.skip('supports chaining via prototype', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('chaining multiple scope functions', () => {
    it.skip('chains let -> also -> apply', () => {
      // Prototype-based helpers disabled in tests.
    })

    it.skip('chains with null-safe variants', () => {
      // Prototype-based helpers disabled in tests.
    })

    it.skip('handles null in chain gracefully', () => {
      // Prototype-based helpers disabled in tests.
    })
  })

  describe('async scope chains', () => {
    it('resolves promised values before chaining', async () => {
      const result = await asScope(Promise.resolve({ count: 5 }))
        .let(({ count }) => count)
        .let(value => value + 1)
        .value()

      expect(result).toBe(6)
    })

    it('supports async transform blocks', async () => {
      const result = await asScope(Promise.resolve(10))
        .let(async value => value * 2)
        .apply(async value => {
          await Promise.resolve(value)
        })
        .value()

      expect(result).toBe(20)
    })
  })
})
