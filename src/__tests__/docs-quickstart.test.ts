import { describe, it, expect, vi } from 'vitest'
import { asScope } from '../scope'

describe('Documentation Examples - Quickstart', () => {
  it('Configure an object and log it', () => {
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

  it('Transform values through a chain', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = asScope(5)
      .let(x => x * 2)
      .also(x => console.log('Doubled:', x))
      .let(x => x + 10)
      .value()

    expect(result).toBe(20)
    expect(consoleSpy).toHaveBeenCalledWith('Doubled:', 10)

    consoleSpy.mockRestore()
  })
})
