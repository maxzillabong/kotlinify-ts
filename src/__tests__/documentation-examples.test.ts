import { describe, it, expect, vi } from 'vitest'
import { tryCatchAsync } from '../monads'
import { MutableStateFlow } from '../flow'

describe('Documentation Examples - Client Side', () => {
  describe('React Integration Example', () => {
    it('tryCatchAsync with async operations', async () => {
      const mockFetchUser = async (userId: string) => ({
        json: async () => ({ profile: { name: 'Alice', id: userId } })
      })

      const result = await tryCatchAsync(async () => {
        const response = await mockFetchUser('123')
        const data = await response.json()
        return data.profile
      })

      expect(result.isSuccess).toBe(true)
      expect(result.get()).toEqual({ name: 'Alice', id: '123' })
    })

    it('tryCatchAsync with Result methods chaining', async () => {
      const mockCache = { set: vi.fn() }
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = await tryCatchAsync(async () => {
        return { name: 'Bob', id: '456' }
      })

      result
        .onSuccess(profile => {
          console.log('Loaded:', profile.name)
          mockCache.set('456', profile)
        })
        .fold(
          _err => expect.fail('Should not error'),
          profile => {
            expect(profile.name).toBe('Bob')
            expect(mockCache.set).toHaveBeenCalledWith('456', profile)
            expect(consoleSpy).toHaveBeenCalledWith('Loaded:', 'Bob')
          }
        )

      consoleSpy.mockRestore()
    })

    it('tryCatchAsync handles errors correctly', async () => {
      const result = await tryCatchAsync(async () => {
        throw new Error('Network error')
      })

      expect(result.isFailure).toBe(true)
      expect(result.getErrorOrNull()?.message).toBe('Network error')

      result.fold(
        error => expect(error.message).toBe('Network error'),
        () => expect.fail('Should not succeed')
      )
    })
  })

  describe('State Management Example', () => {
    it('MutableStateFlow collects state changes', async () => {
      const store = new MutableStateFlow({ users: [], loading: false })
      const collected: any[] = []

      store.collect(state => {
        collected.push(state)
      })

      await new Promise(resolve => setTimeout(resolve, 10))

      store.update(s => ({ ...s, loading: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      store.update(s => ({ ...s, users: [{ id: 1, name: 'Alice' }], loading: false }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(collected.length).toBeGreaterThan(0)
      expect(collected[collected.length - 1]).toEqual({
        users: [{ id: 1, name: 'Alice' }],
        loading: false
      })
    })
  })
})
