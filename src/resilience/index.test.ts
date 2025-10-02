import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  Schedule,
  retry,
  repeat,
  retrySync,
  repeatSync,
} from './index'

describe('Schedule', () => {
  describe('recurs', () => {
    it('should repeat specified number of times', async () => {
      let count = 0
      const schedule = Schedule.recurs(3)

      await schedule.repeat(async () => {
        count++
        return count
      })

      expect(count).toBe(4)
    })

    it('should retry specified number of times before giving up', async () => {
      let attempts = 0
      const schedule = Schedule.recurs(3)

      await expect(async () => {
        await schedule.retry(async () => {
          attempts++
          throw new Error('Failed')
        })
      }).rejects.toThrow('Failed')

      expect(attempts).toBe(4)
    })

    it('should succeed if action succeeds before max retries', async () => {
      let attempts = 0
      const schedule = Schedule.recurs(5)

      const result = await schedule.retry(async () => {
        attempts++
        if (attempts < 3) throw new Error('Not yet')
        return 'success'
      })

      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })
  })

  describe('exponential', () => {
    it('should use exponential backoff delays', async () => {
      const delays: number[] = []
      let attempts = 0

      const schedule = Schedule.exponential(100, 2)

      const result = await schedule.retry(async () => {
        attempts++
        if (attempts > 1) {
          delays.push(Date.now())
        }
        if (attempts <= 3) throw new Error('Retry')
        return 'done'
      })

      expect(result).toBe('done')

      expect(attempts).toBe(4)
    })

    it('should double delay each time with factor 2', () => {
      const schedule = Schedule.exponential<Error>(100, 2)
      let state = schedule['initial']

      const d1 = schedule['update'](new Error(), state)
      expect(d1.delay).toBe(100)
      expect(d1.state).toBe(200)

      const d2 = schedule['update'](new Error(), d1.state)
      expect(d2.delay).toBe(200)
      expect(d2.state).toBe(400)

      const d3 = schedule['update'](new Error(), d2.state)
      expect(d3.delay).toBe(400)
      expect(d3.state).toBe(800)
    })
  })

  describe('fibonacci', () => {
    it('should use fibonacci sequence for delays', () => {
      const schedule = Schedule.fibonacci<Error>(100)
      let state = schedule['initial']

      const decisions = []
      for (let i = 0; i < 7; i++) {
        const decision = schedule['update'](new Error(), state)
        decisions.push(decision.delay)
        state = decision.state
      }

      expect(decisions).toEqual([100, 100, 200, 300, 500, 800, 1300])
    })
  })

  describe('spaced', () => {
    it('should use constant delay', () => {
      const schedule = Schedule.spaced<Error>(500)
      let state = schedule['initial']

      for (let i = 0; i < 5; i++) {
        const decision = schedule['update'](new Error(), state)
        expect(decision.delay).toBe(500)
        state = decision.state
      }
    })
  })

  describe('linear', () => {
    it('should increase delay linearly', () => {
      const schedule = Schedule.linear<Error>(100)
      let state = schedule['initial']

      const d1 = schedule['update'](new Error(), state)
      expect(d1.delay).toBe(100)
      expect(d1.state).toBe(200)

      const d2 = schedule['update'](new Error(), d1.state)
      expect(d2.delay).toBe(200)
      expect(d2.state).toBe(300)

      const d3 = schedule['update'](new Error(), d2.state)
      expect(d3.delay).toBe(300)
      expect(d3.state).toBe(400)
    })
  })

  describe('identity', () => {
    it('should return the input as state', () => {
      const schedule = Schedule.identity<string>()
      const decision = schedule['update']('hello', '')
      expect(decision.state).toBe('hello')
      expect(decision.delay).toBe(0)
      expect(decision.cont).toBe(true)
    })
  })

  describe('collect', () => {
    it('should collect all inputs', async () => {
      let count = 0
      const schedule = Schedule.collect<number>().zipLeft(Schedule.recurs(3))

      const result = await schedule.repeat(async () => {
        count++
        return count
      })

      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('doWhile', () => {
    it('should continue while predicate is true', async () => {
      let result = ''

      await Schedule.doWhile<string>((input) => input.length <= 5).repeat(
        async () => {
          result += 'a'
          return result
        }
      )

      expect(result).toBe('aaaaaa')
    })
  })

  describe('doUntil', () => {
    it('should continue until predicate is true', async () => {
      let result = ''

      await Schedule.doUntil<string>((input) => input.length >= 5).repeat(
        async () => {
          result += 'a'
          return result
        }
      )

      expect(result).toBe('aaaaa')
    })
  })

  describe('and', () => {
    it('should combine schedules with AND logic', () => {
      const s1 = Schedule.recurs<Error>(5)
      const s2 = Schedule.recurs<Error>(3)
      const combined = s1.and(s2)

      let state = combined['initial']
      let decisions = 0

      while (true) {
        const decision = combined['update'](new Error(), state)
        if (!decision.cont) break
        decisions++
        state = decision.state
      }

      expect(decisions).toBe(3)
    })
  })

  describe('or', () => {
    it('should combine schedules with OR logic', () => {
      const s1 = Schedule.recurs<Error>(5)
      const s2 = Schedule.recurs<Error>(3)
      const combined = s1.or(s2)

      let state = combined['initial']
      let decisions = 0

      while (true) {
        const decision = combined['update'](new Error(), state)
        if (!decision.cont) break
        decisions++
        state = decision.state
      }

      expect(decisions).toBe(5)
    })
  })

  describe('andThen', () => {
    it('should switch to next schedule after first completes', async () => {
      let attempts = 0

      const schedule = Schedule.recurs<Error>(2).andThen(Schedule.recurs(3))

      await expect(async () => {
        await schedule.retry(async () => {
          attempts++
          throw new Error('Fail')
        })
      }).rejects.toThrow('Fail')

      expect(attempts).toBe(7)
    })
  })

  describe('zipLeft', () => {
    it('should keep left output', async () => {
      let counter = 0

      const result = await Schedule.identity<string>()
        .zipLeft(Schedule.recurs(3))
        .repeat(async () => {
          counter++
          return `${counter}`
        })

      expect(result).toBe('4')
    })
  })

  describe('zipRight', () => {
    it('should keep right output', async () => {
      let counter = 0

      const result = await Schedule.recurs<string>(3)
        .zipRight(Schedule.identity<string>())
        .repeat(async () => {
          counter++
          return `${counter}`
        })

      expect(result).toBe('4')
    })
  })

  describe('map', () => {
    it('should transform the output', async () => {
      const schedule = Schedule.recurs(3).map((n) => `Count: ${n}`)

      let counter = 0
      const result = await schedule.repeat(async () => {
        counter++
        return counter
      })

      expect(result).toBe('Count: 4')
    })
  })

  describe('jittered', () => {
    it('should add random jitter to delays', () => {
      const schedule = Schedule.exponential<Error>(1000).jittered(0.2)
      let state = schedule['initial']

      const decision = schedule['update'](new Error(), state)

      expect(decision.delay).toBeGreaterThanOrEqual(1000)
      expect(decision.delay).toBeLessThanOrEqual(1200)
    })
  })

  describe('retry function', () => {
    it('should retry with given schedule', async () => {
      let attempts = 0

      const result = await retry(Schedule.recurs(5), async () => {
        attempts++
        if (attempts < 3) throw new Error('Not yet')
        return 'success'
      })

      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })
  })

  describe('repeat function', () => {
    it('should repeat with given schedule', async () => {
      let count = 0

      const result = await repeat(Schedule.recurs(4), async () => {
        count++
        return count
      })

      expect(count).toBe(5)
      expect(result).toBe(5)
    })
  })

  describe('retrySync', () => {
    it('should retry synchronous operations', () => {
      let attempts = 0

      const result = retrySync(Schedule.recurs(5), () => {
        attempts++
        if (attempts < 3) throw new Error('Not yet')
        return 'success'
      })

      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })

    it('should throw after max retries', () => {
      let attempts = 0

      expect(() => {
        retrySync(Schedule.recurs(2), () => {
          attempts++
          throw new Error('Always fails')
        })
      }).toThrow('Always fails')

      expect(attempts).toBe(3)
    })
  })

  describe('repeatSync', () => {
    it('should repeat synchronous operations', () => {
      let count = 0

      const result = repeatSync(Schedule.recurs(3), () => {
        count++
        return count
      })

      expect(count).toBe(4)
      expect(result).toBe(4)
    })
  })

  describe('repeatOrElse', () => {
    it('should handle errors with orElse callback', async () => {
      let count = 0

      const result = await Schedule.recurs(3).repeatOrElse(
        async () => {
          count++
          if (count === 2) throw new Error('Failed at 2')
          return count
        },
        (error, state) => `Error: ${(error as Error).message}, State: ${state}`
      )

      expect(result).toBe('Error: Failed at 2, State: 1')
    })
  })

  describe('complex policies', () => {
    it('should support exponential backoff with max retries', async () => {
      const schedule = Schedule.exponential<Error>(100)
        .and(Schedule.recurs(3))
        .map(([delay, count]) => ({ delay, count }))

      let attempts = 0

      await expect(async () => {
        await schedule.retry(async () => {
          attempts++
          throw new Error('Fail')
        })
      }).rejects.toThrow('Fail')

      expect(attempts).toBe(4)
    })

    it('should combine spaced delay with duration limit', () => {
      const s1 = Schedule.spaced<Error>(1000)
      const s2 = Schedule.recurs<Error>(5)
      const combined = s1.and(s2)

      let state = combined['initial']
      let maxDelay = 0

      for (let i = 0; i < 5; i++) {
        const decision = combined['update'](new Error(), state)
        maxDelay = Math.max(maxDelay, decision.delay)
        state = decision.state
      }

      expect(maxDelay).toBe(1000)
    })
  })

  describe('real-world scenarios', () => {
    it('should handle network request retry with exponential backoff', async () => {
      let attempts = 0
      const maxAttempts = 3

      const schedule = Schedule.exponential<Error>(100, 2).and(
        Schedule.recurs(maxAttempts - 1)
      )

      await expect(async () => {
        await schedule.retry(async () => {
          attempts++
          throw new Error('Network error')
        })
      }).rejects.toThrow('Network error')

      expect(attempts).toBe(maxAttempts)
    })

    it('should poll API until success with spaced delay', async () => {
      let checks = 0
      const schedule = Schedule.doWhile<boolean>(
        (result) => result === false
      )

      const result = await schedule.repeat(async () => {
        checks++
        return checks >= 3
      })

      expect(checks).toBe(3)
    })

    it('should collect all retry errors', async () => {
      let attempts = 0

      const schedule = Schedule.collect<Error>()
        .zipLeft(Schedule.recurs(3))

      await expect(async () => {
        await schedule.retry(async () => {
          attempts++
          throw new Error(`Attempt ${attempts}`)
        })
      }).rejects.toThrow('Attempt 4')
    })
  })
})
