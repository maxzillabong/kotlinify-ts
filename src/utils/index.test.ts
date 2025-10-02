import { describe, it, expect, vi } from 'vitest'
import {
  repeat,
  repeatAsync,
  require,
  check,
  requireNotNull,
  checkNotNull,
  TODO,
  error,
  assert,
  assertNotNull,
  runCatching,
  runCatchingAsync,
  lazy,
  measure,
  measureSync,
  identity,
  constant,
  noop,
  todo,
} from './index'

describe('Utils', () => {
  describe('repeat', () => {
    it('should execute action n times', () => {
      let count = 0
      repeat(5, () => count++)
      expect(count).toBe(5)
    })

    it('should pass index to action', () => {
      const indices: number[] = []
      repeat(3, (i) => indices.push(i))
      expect(indices).toEqual([0, 1, 2])
    })

    it('should not execute for 0 times', () => {
      let count = 0
      repeat(0, () => count++)
      expect(count).toBe(0)
    })
  })

  describe('repeatAsync', () => {
    it('should execute async action n times', async () => {
      let count = 0
      await repeatAsync(5, async () => {
        count++
      })
      expect(count).toBe(5)
    })

    it('should pass index to action', async () => {
      const indices: number[] = []
      await repeatAsync(3, async (i) => indices.push(i))
      expect(indices).toEqual([0, 1, 2])
    })

    it('should execute sequentially', async () => {
      const order: number[] = []
      await repeatAsync(3, async (i) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        order.push(i)
      })
      expect(order).toEqual([0, 1, 2])
    })
  })

  describe('require', () => {
    it('should not throw for true condition', () => {
      expect(() => require(true)).not.toThrow()
    })

    it('should throw for false condition', () => {
      expect(() => require(false)).toThrow('Requirement failed')
    })

    it('should throw with custom message', () => {
      expect(() => require(false, 'Custom error')).toThrow('Custom error')
    })

    it('should throw with lazy message', () => {
      expect(() => require(false, () => 'Lazy error')).toThrow('Lazy error')
    })

    it('should work as type guard', () => {
      const value: number | undefined = 42
      require(value !== undefined)
      const x: number = value
      expect(x).toBe(42)
    })
  })

  describe('check', () => {
    it('should not throw for true condition', () => {
      expect(() => check(true)).not.toThrow()
    })

    it('should throw for false condition', () => {
      expect(() => check(false)).toThrow('Check failed')
    })

    it('should throw with custom message', () => {
      expect(() => check(false, 'Check error')).toThrow('Check error')
    })
  })

  describe('requireNotNull', () => {
    it('should return value for non-null', () => {
      expect(requireNotNull(42)).toBe(42)
    })

    it('should throw for null', () => {
      expect(() => requireNotNull(null)).toThrow('Required value was null')
    })

    it('should throw for undefined', () => {
      expect(() => requireNotNull(undefined)).toThrow('Required value was null')
    })

    it('should throw with custom message', () => {
      expect(() => requireNotNull(null, 'Value missing')).toThrow('Value missing')
    })

    it('should narrow type', () => {
      const value: string | null = 'hello'
      const result: string = requireNotNull(value)
      expect(result).toBe('hello')
    })
  })

  describe('checkNotNull', () => {
    it('should return value for non-null', () => {
      expect(checkNotNull(42)).toBe(42)
    })

    it('should throw for null', () => {
      expect(() => checkNotNull(null)).toThrow('Value must not be null')
    })
  })

  describe('TODO', () => {
    it('should throw not implemented error', () => {
      expect(() => TODO()).toThrow('Not implemented')
    })

    it('should throw with message', () => {
      expect(() => TODO('Feature X')).toThrow('Not implemented: Feature X')
    })
  })

  describe('error', () => {
    it('should throw error with message', () => {
      expect(() => error('Something went wrong')).toThrow('Something went wrong')
    })
  })

  describe('assert', () => {
    it('should not throw for true condition', () => {
      expect(() => assert(true)).not.toThrow()
    })

    it('should throw for false condition', () => {
      expect(() => assert(false)).toThrow('Assertion failed')
    })

    it('should throw with custom message', () => {
      expect(() => assert(false, 'Assertion error')).toThrow('Assertion error')
    })
  })

  describe('assertNotNull', () => {
    it('should return value for non-null', () => {
      expect(assertNotNull(42)).toBe(42)
    })

    it('should throw for null', () => {
      expect(() => assertNotNull(null)).toThrow('Assertion failed: value was null')
    })

    it('should throw with custom message', () => {
      expect(() => assertNotNull(null, 'Custom assertion')).toThrow('Custom assertion')
    })
  })

  describe('runCatching', () => {
    it('should return success for successful block', () => {
      const result = runCatching(() => 42)
      expect(result.success).toBe(true)
      expect(result.value).toBe(42)
      expect(result.error).toBeUndefined()
    })

    it('should return failure for throwing block', () => {
      const result = runCatching(() => {
        throw new Error('Failed')
      })
      expect(result.success).toBe(false)
      expect(result.value).toBeUndefined()
      expect(result.error?.message).toBe('Failed')
    })

    it('should work with complex computations', () => {
      const result = runCatching(() => {
        const x = 10
        const y = 20
        return x + y
      })
      expect(result.success).toBe(true)
      expect(result.value).toBe(30)
    })
  })

  describe('runCatchingAsync', () => {
    it('should return success for successful async block', async () => {
      const result = await runCatchingAsync(async () => 42)
      expect(result.success).toBe(true)
      expect(result.value).toBe(42)
    })

    it('should return failure for throwing async block', async () => {
      const result = await runCatchingAsync(async () => {
        throw new Error('Async failed')
      })
      expect(result.success).toBe(false)
      expect(result.error?.message).toBe('Async failed')
    })
  })

  describe('lazy', () => {
    it('should compute value on first access', () => {
      let count = 0
      const getValue = lazy(() => {
        count++
        return 42
      })

      expect(count).toBe(0)
      expect(getValue()).toBe(42)
      expect(count).toBe(1)
    })

    it('should cache value after first access', () => {
      let count = 0
      const getValue = lazy(() => {
        count++
        return 42
      })

      getValue()
      getValue()
      getValue()

      expect(count).toBe(1)
    })

    it('should work with expensive computations', () => {
      const expensiveComputation = vi.fn(() => {
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }
        return sum
      })

      const getValue = lazy(expensiveComputation)

      getValue()
      getValue()
      getValue()

      expect(expensiveComputation).toHaveBeenCalledTimes(1)
    })
  })

  describe('measure', () => {
    it('should measure execution time of sync function', async () => {
      const { value, duration } = await measure(() => 42)
      expect(value).toBe(42)
      expect(duration).toBeGreaterThanOrEqual(0)
    })

    it('should measure execution time of async function', async () => {
      const { value, duration } = await measure(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return 'done'
      })
      expect(value).toBe('done')
      expect(duration).toBeGreaterThanOrEqual(50)
    })
  })

  describe('measureSync', () => {
    it('should measure execution time of sync function', () => {
      const { value, duration } = measureSync(() => 42)
      expect(value).toBe(42)
      expect(duration).toBeGreaterThanOrEqual(0)
    })

    it('should measure time accurately', () => {
      const { duration } = measureSync(() => {
        let sum = 0
        for (let i = 0; i < 100000; i++) {
          sum += i
        }
        return sum
      })
      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('identity', () => {
    it('should return the same value', () => {
      expect(identity(42)).toBe(42)
      expect(identity('hello')).toBe('hello')
      expect(identity(null)).toBe(null)
    })

    it('should work with objects', () => {
      const obj = { a: 1 }
      expect(identity(obj)).toBe(obj)
    })
  })

  describe('constant', () => {
    it('should return function that always returns same value', () => {
      const getFortyTwo = constant(42)
      expect(getFortyTwo()).toBe(42)
      expect(getFortyTwo()).toBe(42)
    })

    it('should work with any type', () => {
      const getString = constant('hello')
      expect(getString()).toBe('hello')
    })
  })

  describe('noop', () => {
    it('should do nothing', () => {
      expect(() => noop()).not.toThrow()
      expect(noop()).toBeUndefined()
    })
  })

  describe('todo', () => {
    it('should be alias for TODO', () => {
      expect(() => todo()).toThrow('Not implemented')
      expect(() => todo('Feature')).toThrow('Not implemented: Feature')
    })
  })

  describe('Real-world scenarios', () => {
    it('should validate user input with require', () => {
      function processAge(age: number) {
        require(age >= 0, 'Age must be non-negative')
        require(age < 150, () => `Age ${age} is unrealistic`)
        return `Age: ${age}`
      }

      expect(processAge(25)).toBe('Age: 25')
      expect(() => processAge(-5)).toThrow('Age must be non-negative')
      expect(() => processAge(200)).toThrow('Age 200 is unrealistic')
    })

    it('should use lazy for expensive initialization', () => {
      const getConfig = lazy(() => {
        return {
          apiKey: 'expensive-to-compute',
          timestamp: Date.now(),
        }
      })

      const config1 = getConfig()
      const config2 = getConfig()

      expect(config1).toBe(config2)
      expect(config1.timestamp).toBe(config2.timestamp)
    })

    it('should combine multiple utilities', async () => {
      const processItems = async (items: (number | null)[]) => {
        const validItems = items.filter((item): item is number => item !== null)

        require(validItems.length > 0, 'Must have at least one valid item')

        let sum = 0
        await repeatAsync(validItems.length, async (i) => {
          const item = requireNotNull(validItems[i])
          sum += item
        })

        return sum
      }

      expect(await processItems([1, 2, null, 3])).toBe(6)
      await expect(processItems([null, null])).rejects.toThrow('Must have at least one valid item')
    })

    it('should benchmark function performance', async () => {
      const fibonacci = (n: number): number => {
        if (n <= 1) return n
        return fibonacci(n - 1) + fibonacci(n - 2)
      }

      const { value, duration } = await measure(() => fibonacci(20))

      expect(value).toBe(6765)
      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })
})
