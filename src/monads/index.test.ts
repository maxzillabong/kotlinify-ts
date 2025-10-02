import { describe, it, expect, vi } from 'vitest'
import {
  Option,
  Some,
  None,
  Either,
  Left,
  Right,
  Result,
  Success,
  Failure,
  NonEmptyList,
  zipOrAccumulate,
  zipOrAccumulate3,
  zipOrAccumulate4,
  mapOrAccumulate,
} from './index'

describe('Option', () => {
  describe('Some', () => {
    it('wraps value', () => {
      const some = Some(42)
      expect(some.isSome).toBe(true)
      expect(some.isNone).toBe(false)
      expect(some.get()).toBe(42)
    })

    it('map transforms value', () => {
      const result = Some(5).map((x) => x * 2)
      expect(result.get()).toBe(10)
    })

    it('flatMap chains options', () => {
      const result = Some(5).flatMap((x) => Some(x * 2))
      expect(result.get()).toBe(10)
    })

    it('flatMap with None returns None', () => {
      const result = Some(5).flatMap(() => None())
      expect(result.isNone).toBe(true)
    })

    it('filter keeps matching values', () => {
      const result = Some(5).filter((x) => x > 3)
      expect(result.isSome).toBe(true)
      expect(result.get()).toBe(5)
    })

    it('filter removes non-matching values', () => {
      const result = Some(5).filter((x) => x > 10)
      expect(result.isNone).toBe(true)
    })

    it('getOrElse returns value', () => {
      expect(Some(42).getOrElse(0)).toBe(42)
    })

    it('getOrNull returns value', () => {
      expect(Some(42).getOrNull()).toBe(42)
    })

    it('getOrThrow returns value', () => {
      expect(Some(42).getOrThrow()).toBe(42)
    })

    it('orElse returns self', () => {
      const some = Some(42)
      const result = some.orElse(() => Some(0))
      expect(result).toBe(some)
    })

    it('fold uses ifSome branch', () => {
      const result = Some(5).fold(
        () => 'none',
        (x) => `some ${x}`
      )
      expect(result).toBe('some 5')
    })
  })

  describe('None', () => {
    it('represents absence', () => {
      const none = None()
      expect(none.isSome).toBe(false)
      expect(none.isNone).toBe(true)
    })

    it('get throws', () => {
      expect(() => None().get()).toThrow()
    })

    it('map returns None', () => {
      const result = None<number>().map((x) => x * 2)
      expect(result.isNone).toBe(true)
    })

    it('flatMap returns None', () => {
      const result = None<number>().flatMap((x) => Some(x * 2))
      expect(result.isNone).toBe(true)
    })

    it('filter returns None', () => {
      const result = None<number>().filter((x) => x > 0)
      expect(result.isNone).toBe(true)
    })

    it('getOrElse returns default', () => {
      expect(None<number>().getOrElse(42)).toBe(42)
    })

    it('getOrNull returns null', () => {
      expect(None().getOrNull()).toBe(null)
    })

    it('getOrThrow throws', () => {
      expect(() => None().getOrThrow()).toThrow()
    })

    it('orElse returns alternative', () => {
      const alternative = Some(42)
      const result = None().orElse(() => alternative)
      expect(result).toBe(alternative)
    })

    it('fold uses ifNone branch', () => {
      const result = None<number>().fold(
        () => 'none',
        (x) => `some ${x}`
      )
      expect(result).toBe('none')
    })
  })

  describe('scope functions', () => {
    it('let transforms Some', () => {
      const result = Some(5).let((x) => x * 2)
      expect(result.get()).toBe(10)
    })

    it('also performs side effect', () => {
      const sideEffect = vi.fn()
      const some = Some(42)
      const result = some.also(sideEffect)
      expect(result).toBe(some)
      expect(sideEffect).toHaveBeenCalledWith(42)
    })

    it('apply performs side effect', () => {
      const sideEffect = vi.fn()
      const some = Some(42)
      const result = some.apply(sideEffect)
      expect(result).toBe(some)
      expect(sideEffect).toHaveBeenCalledWith(42)
    })

    it('takeIf keeps matching Some', () => {
      const result = Some(5).takeIf((x) => x > 3)
      expect(result.isSome).toBe(true)
    })

    it('takeIf rejects non-matching Some', () => {
      const result = Some(5).takeIf((x) => x > 10)
      expect(result.isNone).toBe(true)
    })

    it('takeUnless rejects matching Some', () => {
      const result = Some(5).takeUnless((x) => x > 10)
      expect(result.isSome).toBe(true)
    })
  })
})

describe('Either', () => {
  describe('Left', () => {
    it('wraps left value', () => {
      const left = Left('error')
      expect(left.isLeft).toBe(true)
      expect(left.isRight).toBe(false)
      expect(left.getLeft()).toBe('error')
    })

    it('map does not transform', () => {
      const result = Left<string, number>('error').map((x) => x * 2)
      expect(result.isLeft).toBe(true)
      expect(result.getLeft()).toBe('error')
    })

    it('mapLeft transforms left value', () => {
      const result = Left<string, number>('error').mapLeft((s) => s.toUpperCase())
      expect(result.isLeft).toBe(true)
      expect(result.getLeft()).toBe('ERROR')
    })

    it('flatMap does not transform', () => {
      const result = Left<string, number>('error').flatMap((x) => Right(x * 2))
      expect(result.isLeft).toBe(true)
    })

    it('getOrElse returns default', () => {
      expect(Left<string, number>('error').getOrElse(42)).toBe(42)
    })

    it('fold uses ifLeft branch', () => {
      const result = Left<string, number>('error').fold(
        (l) => `left: ${l}`,
        (r) => `right: ${r}`
      )
      expect(result).toBe('left: error')
    })

    it('swap returns Right', () => {
      const result = Left<string, number>('error').swap()
      expect(result.isRight).toBe(true)
      expect(result.getRight()).toBe('error')
    })
  })

  describe('Right', () => {
    it('wraps right value', () => {
      const right = Right(42)
      expect(right.isLeft).toBe(false)
      expect(right.isRight).toBe(true)
      expect(right.getRight()).toBe(42)
    })

    it('map transforms value', () => {
      const result = Right<string, number>(5).map((x) => x * 2)
      expect(result.isRight).toBe(true)
      expect(result.getRight()).toBe(10)
    })

    it('mapLeft does not transform', () => {
      const result = Right<string, number>(42).mapLeft((s) => s.toUpperCase())
      expect(result.isRight).toBe(true)
      expect(result.getRight()).toBe(42)
    })

    it('flatMap chains eithers', () => {
      const result = Right<string, number>(5).flatMap((x) => Right(x * 2))
      expect(result.isRight).toBe(true)
      expect(result.getRight()).toBe(10)
    })

    it('flatMap with Left returns Left', () => {
      const result = Right<string, number>(5).flatMap(() => Left('error'))
      expect(result.isLeft).toBe(true)
    })

    it('getOrElse returns value', () => {
      expect(Right<string, number>(42).getOrElse(0)).toBe(42)
    })

    it('fold uses ifRight branch', () => {
      const result = Right<string, number>(42).fold(
        (l) => `left: ${l}`,
        (r) => `right: ${r}`
      )
      expect(result).toBe('right: 42')
    })

    it('swap returns Left', () => {
      const result = Right<string, number>(42).swap()
      expect(result.isLeft).toBe(true)
      expect(result.getLeft()).toBe(42)
    })
  })

  describe('scope functions', () => {
    it('let transforms Right', () => {
      const result = Right<string, number>(5).let((x) => x * 2)
      expect(result.getRight()).toBe(10)
    })

    it('also performs side effect on Right', () => {
      const sideEffect = vi.fn()
      const right = Right<string, number>(42)
      const result = right.also(sideEffect)
      expect(result).toBe(right)
      expect(sideEffect).toHaveBeenCalledWith(42)
    })
  })
})

describe('Result', () => {
  describe('Success', () => {
    it('wraps success value', () => {
      const success = Success(42)
      expect(success.isSuccess).toBe(true)
      expect(success.isFailure).toBe(false)
      expect(success.get()).toBe(42)
    })

    it('map transforms value', () => {
      const result = Success(5).map((x) => x * 2)
      expect(result.get()).toBe(10)
    })

    it('mapError does not transform', () => {
      const result = Success<number, string>(42).mapError((e) => e.toUpperCase())
      expect(result.isSuccess).toBe(true)
      expect(result.get()).toBe(42)
    })

    it('flatMap chains results', () => {
      const result = Success<number, string>(5).flatMap((x) => Success(x * 2))
      expect(result.get()).toBe(10)
    })

    it('flatMap with Failure returns Failure', () => {
      const result = Success<number, string>(5).flatMap(() => Failure('error'))
      expect(result.isFailure).toBe(true)
    })

    it('getOrElse returns value', () => {
      expect(Success<number, string>(42).getOrElse(0)).toBe(42)
    })

    it('getOrNull returns value', () => {
      expect(Success(42).getOrNull()).toBe(42)
    })

    it('getOrThrow returns value', () => {
      expect(Success(42).getOrThrow()).toBe(42)
    })

    it('fold uses ifSuccess branch', () => {
      const result = Success<number, string>(42).fold(
        (e) => `error: ${e}`,
        (v) => `success: ${v}`
      )
      expect(result).toBe('success: 42')
    })

    it('recover does not transform', () => {
      const result = Success<number, string>(42).recover(() => 0)
      expect(result.get()).toBe(42)
    })

    it('toOption returns Some', () => {
      const option = Success(42).toOption()
      expect(option.isSome).toBe(true)
      expect(option.get()).toBe(42)
    })

    it('toEither returns Right', () => {
      const either = Success<number, string>(42).toEither()
      expect(either.isRight).toBe(true)
      expect(either.getRight()).toBe(42)
    })
  })

  describe('Failure', () => {
    it('wraps error', () => {
      const failure = Failure('error')
      expect(failure.isSuccess).toBe(false)
      expect(failure.isFailure).toBe(true)
      expect(failure.getError()).toBe('error')
    })

    it('get throws', () => {
      expect(() => Failure('error').get()).toThrow()
    })

    it('map does not transform', () => {
      const result = Failure<number, string>('error').map((x) => x * 2)
      expect(result.isFailure).toBe(true)
      expect(result.getError()).toBe('error')
    })

    it('mapError transforms error', () => {
      const result = Failure<number, string>('error').mapError((e) => e.toUpperCase())
      expect(result.isFailure).toBe(true)
      expect(result.getError()).toBe('ERROR')
    })

    it('flatMap does not transform', () => {
      const result = Failure<number, string>('error').flatMap((x) => Success(x * 2))
      expect(result.isFailure).toBe(true)
    })

    it('getOrElse returns default', () => {
      expect(Failure<number, string>('error').getOrElse(42)).toBe(42)
    })

    it('getOrNull returns null', () => {
      expect(Failure('error').getOrNull()).toBe(null)
    })

    it('getOrThrow throws with error', () => {
      expect(() => Failure(new Error('test')).getOrThrow()).toThrow('test')
    })

    it('fold uses ifFailure branch', () => {
      const result = Failure<number, string>('error').fold(
        (e) => `error: ${e}`,
        (v) => `success: ${v}`
      )
      expect(result).toBe('error: error')
    })

    it('recover transforms error to success', () => {
      const result = Failure<number, string>('error').recover(() => 42)
      expect(result.isSuccess).toBe(true)
      expect(result.get()).toBe(42)
    })

    it('toOption returns None', () => {
      const option = Failure('error').toOption()
      expect(option.isNone).toBe(true)
    })

    it('toEither returns Left', () => {
      const either = Failure<number, string>('error').toEither()
      expect(either.isLeft).toBe(true)
      expect(either.getLeft()).toBe('error')
    })
  })

  describe('scope functions', () => {
    it('let transforms Success', () => {
      const result = Success<number, string>(5).let((x) => x * 2)
      expect(result.get()).toBe(10)
    })

    it('also performs side effect on Success', () => {
      const sideEffect = vi.fn()
      const success = Success<number, string>(42)
      const result = success.also(sideEffect)
      expect(result).toBe(success)
      expect(sideEffect).toHaveBeenCalledWith(42)
    })

    it('takeIf keeps matching Success', () => {
      const result = Success<number, string>(5).takeIf((x) => x > 3)
      expect(result.isSuccess).toBe(true)
    })

    it('takeIf rejects non-matching Success', () => {
      const result = Success<number, string>(5).takeIf((x) => x > 10)
      expect(result.isFailure).toBe(true)
    })
  })
})

describe('interoperability', () => {
  it('Option to Result', () => {
    const some = Some(42)
    const result = some.fold(
      () => Failure('none'),
      (v) => Success(v)
    )
    expect(result.isSuccess).toBe(true)
    expect(result.get()).toBe(42)
  })

  it('Result to Option', () => {
    const success = Success(42)
    const option = success.toOption()
    expect(option.isSome).toBe(true)
    expect(option.get()).toBe(42)
  })

  it('Either to Result', () => {
    const right = Right<string, number>(42)
    const result = right.fold(
      (l) => Failure(l),
      (r) => Success(r)
    )
    expect(result.isSuccess).toBe(true)
    expect(result.get()).toBe(42)
  })

  it('Result to Either', () => {
    const success = Success<number, string>(42)
    const either = success.toEither()
    expect(either.isRight).toBe(true)
    expect(either.getRight()).toBe(42)
  })

  it('chaining across monads', () => {
    const result = Some(5)
      .map((x) => x * 2)
      .fold(
        () => Failure<number, string>('none'),
        (v) => Success(v)
      )
      .map((x) => x + 10)
      .toEither()
      .getRight()

    expect(result).toBe(20)
  })
})
