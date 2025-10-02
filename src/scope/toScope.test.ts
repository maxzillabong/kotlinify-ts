import { describe, it, expect } from 'vitest'
import { chain } from './index'

describe('chain', () => {
  it('chains let operations', () => {
    const result = chain(5)
      .let(x => x * 2)
      .let(x => x + 3)
      .value()

    expect(result).toBe(13)
  })

  it('chains apply operations', () => {
    const obj = { count: 0 }
    const result = chain(obj)
      .apply(o => {
        o.count = 10
      })
      .value()

    expect(result.count).toBe(10)
  })

  it('chains also operations', () => {
    let sideEffect = 0
    const result = chain(5)
      .also(x => {
        sideEffect = x * 2
      })
      .value()

    expect(result).toBe(5)
    expect(sideEffect).toBe(10)
  })

  it('chains run operations', () => {
    const result = chain({ x: 5, y: 10 })
      .run(function (this: { x: number; y: number }) {
        return this.x + this.y
      })
      .value()

    expect(result).toBe(15)
  })

  it('chains mixed operations', () => {
    const result = chain({ name: 'john', age: 25 })
      .apply(u => {
        u.name = u.name.toUpperCase()
      })
      .let(u => ({ ...u, verified: true }))
      .also(u => console.log('User:', u))
      .let(u => u.name)
      .value()

    expect(result).toBe('JOHN')
  })

  it('maintains type safety through chain', () => {
    const result: string = chain(5)
      .let(x => x * 2)
      .let(x => `Result: ${x}`)
      .value()

    expect(result).toBe('Result: 10')
  })
})
