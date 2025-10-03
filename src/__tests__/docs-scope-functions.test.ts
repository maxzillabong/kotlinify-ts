import { describe, it, expect, vi } from 'vitest'
import { asScope } from '../scope'
import { let as letValue, apply, also, run, withValue } from '../scope'

describe('Documentation Examples - Scope Functions', () => {
  describe('let examples', () => {
    it('function form', () => {
      const upperName = letValue({ name: 'Alice' }, u => u.name.toUpperCase())
      expect(upperName).toBe('ALICE')
    })

    it('prototype chaining', () => {
      const transformed = asScope(5)
        .let(x => x * 2)
        .let(x => x.toString())
        .value()

      expect(transformed).toBe('10')
    })

    it('chain with other scope functions', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const processed = asScope(letValue({ x: 5 }, obj => obj.x))
        .let(x => x * 2)
        .also(x => console.log('Value:', x))
        .let(x => x + 10)
        .value()

      expect(processed).toBe(20)
      expect(consoleSpy).toHaveBeenCalledWith('Value:', 10)

      consoleSpy.mockRestore()
    })
  })

  describe('apply examples', () => {
    it('function form', () => {
      const obj = apply({ x: 0, y: 0 }, o => {
        o.x = 10
        o.y = 20
      })

      expect(obj).toEqual({ x: 10, y: 20 })
    })

    it('prototype chaining', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const user = asScope<{ name: string; age?: number; email?: string }>({ name: 'John' })
        .apply((u) => {
          u.age = 30
          u.email = 'john@example.com'
        })
        .also((u) => console.log('Created:', u.name))
        .value()

      expect(user).toEqual({
        name: 'John',
        age: 30,
        email: 'john@example.com'
      })
      expect(consoleSpy).toHaveBeenCalledWith('Created:', 'John')

      consoleSpy.mockRestore()
    })
  })

  describe('also examples', () => {
    it('function form with side effects', () => {
      const sideEffect = vi.fn()
      const value = 'test'
      const result = also(value, sideEffect)

      expect(result).toBe(value)
      expect(sideEffect).toHaveBeenCalledWith(value)
    })
  })

  describe('run examples', () => {
    it('function form', () => {
      const sum = run({ x: 3, y: 4 }, function() {
        return this.x + this.y
      })

      expect(sum).toBe(7)
    })
  })

  describe('withValue examples', () => {
    it('function form', () => {
      const area = withValue({ width: 10, height: 5 }, function() {
        return this.width * this.height
      })

      expect(area).toBe(50)
    })

    it('chaining with also', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      also(
        withValue({ x: 5, y: 10 }, function() { return this.x * this.y }),
        result => console.log('Product:', result)
      )

      expect(consoleSpy).toHaveBeenCalledWith('Product:', 50)

      consoleSpy.mockRestore()
    })
  })
})
