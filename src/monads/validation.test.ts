import { describe, it, expect } from 'vitest'
import {
  Either,
  Left,
  Right,
  NonEmptyList,
  zipOrAccumulate,
  zipOrAccumulate3,
  zipOrAccumulate4,
  mapOrAccumulate,
} from './index'

describe('NonEmptyList', () => {
  it('should create non-empty list with head and tail', () => {
    const nel = NonEmptyList.of(1, 2, 3)
    expect(nel.head).toBe(1)
    expect(nel.tail).toEqual([2, 3])
    expect(nel.length).toBe(3)
  })

  it('should create from array', () => {
    const nel = NonEmptyList.fromArray([1, 2, 3])
    expect(nel).not.toBeNull()
    expect(nel!.head).toBe(1)
    expect(nel!.tail).toEqual([2, 3])
  })

  it('should return null for empty array', () => {
    const nel = NonEmptyList.fromArray([])
    expect(nel).toBeNull()
  })

  it('should work with array methods', () => {
    const nel = NonEmptyList.of(1, 2, 3)
    const doubled = nel.map((x) => x * 2)
    expect(doubled).toEqual([2, 4, 6])
  })
})

describe('Validation', () => {
  describe('zipOrAccumulate', () => {
    it('should combine two successful Eithers', () => {
      const a = Right<string, number>(1)
      const b = Right<string, number>(2)

      const result = zipOrAccumulate(a, b)

      expect(result.isRight).toBe(true)
      expect(result.getRight()).toEqual([1, 2])
    })

    it('should accumulate errors from both Eithers', () => {
      const a = Left<string, number>('error1')
      const b = Left<string, number>('error2')

      const result = zipOrAccumulate(a, b)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(2)
      expect(errors).toEqual(['error1', 'error2'])
    })

    it('should accumulate error from first Either', () => {
      const a = Left<string, number>('error1')
      const b = Right<string, number>(2)

      const result = zipOrAccumulate(a, b)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(1)
      expect(errors).toEqual(['error1'])
    })

    it('should accumulate error from second Either', () => {
      const a = Right<string, number>(1)
      const b = Left<string, number>('error2')

      const result = zipOrAccumulate(a, b)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(1)
      expect(errors).toEqual(['error2'])
    })
  })

  describe('zipOrAccumulate3', () => {
    it('should combine three successful Eithers', () => {
      const a = Right<string, number>(1)
      const b = Right<string, number>(2)
      const c = Right<string, number>(3)

      const result = zipOrAccumulate3(a, b, c)

      expect(result.isRight).toBe(true)
      expect(result.getRight()).toEqual([1, 2, 3])
    })

    it('should accumulate all errors', () => {
      const a = Left<string, number>('error1')
      const b = Left<string, number>('error2')
      const c = Left<string, number>('error3')

      const result = zipOrAccumulate3(a, b, c)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(3)
      expect(errors).toEqual(['error1', 'error2', 'error3'])
    })

    it('should accumulate mixed results', () => {
      const a = Right<string, number>(1)
      const b = Left<string, number>('error2')
      const c = Left<string, number>('error3')

      const result = zipOrAccumulate3(a, b, c)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(2)
      expect(errors).toEqual(['error2', 'error3'])
    })
  })

  describe('zipOrAccumulate4', () => {
    it('should combine four successful Eithers', () => {
      const a = Right<string, number>(1)
      const b = Right<string, number>(2)
      const c = Right<string, number>(3)
      const d = Right<string, number>(4)

      const result = zipOrAccumulate4(a, b, c, d)

      expect(result.isRight).toBe(true)
      expect(result.getRight()).toEqual([1, 2, 3, 4])
    })

    it('should accumulate all errors', () => {
      const a = Left<string, number>('error1')
      const b = Left<string, number>('error2')
      const c = Left<string, number>('error3')
      const d = Left<string, number>('error4')

      const result = zipOrAccumulate4(a, b, c, d)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(4)
      expect(errors).toEqual(['error1', 'error2', 'error3', 'error4'])
    })
  })

  describe('mapOrAccumulate', () => {
    it('should validate all items successfully', () => {
      const items = [1, 2, 3, 4]
      const validate = (n: number): Either<string, number> =>
        n > 0 ? Right(n * 2) : Left(`${n} is not positive`)

      const result = mapOrAccumulate(items, validate)

      expect(result.isRight).toBe(true)
      expect(result.getRight()).toEqual([2, 4, 6, 8])
    })

    it('should accumulate all validation errors', () => {
      const items = [-1, 2, -3, 4, -5]
      const validate = (n: number): Either<string, number> =>
        n > 0 ? Right(n * 2) : Left(`${n} is not positive`)

      const result = mapOrAccumulate(items, validate)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(3)
      expect(errors).toEqual([
        '-1 is not positive',
        '-3 is not positive',
        '-5 is not positive',
      ])
    })

    it('should work with complex validation', () => {
      type ValidationError = { field: string; message: string }
      type User = { name: string; age: number; email: string }

      const validateUser = (
        user: Partial<User>
      ): Either<ValidationError, User> => {
        if (!user.name || user.name.length < 2) {
          return Left({ field: 'name', message: 'Name too short' })
        }
        if (!user.age || user.age < 18) {
          return Left({ field: 'age', message: 'Must be 18+' })
        }
        if (!user.email || !user.email.includes('@')) {
          return Left({ field: 'email', message: 'Invalid email' })
        }
        return Right(user as User)
      }

      const users = [
        { name: 'Alice', age: 25, email: 'alice@example.com' },
        { name: 'B', age: 30, email: 'bob@example.com' },
        { name: 'Charlie', age: 15, email: 'charlie@example.com' },
        { name: 'David', age: 20, email: 'invalid' },
      ]

      const result = mapOrAccumulate(users, validateUser)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(3)
      expect(errors[0].field).toBe('name')
      expect(errors[1].field).toBe('age')
      expect(errors[2].field).toBe('email')
    })

    it('should return empty array for empty input', () => {
      const result = mapOrAccumulate([], (x: number) => Right(x))
      expect(result.isRight).toBe(true)
      expect(result.getRight()).toEqual([])
    })
  })

  describe('Real-world validation scenarios', () => {
    it('should validate form fields with accumulation', () => {
      type FormData = {
        username?: string
        email?: string
        password?: string
      }

      const validateUsername = (username?: string): Either<string, string> =>
        username && username.length >= 3
          ? Right(username)
          : Left('Username must be at least 3 characters')

      const validateEmail = (email?: string): Either<string, string> =>
        email && email.includes('@')
          ? Right(email)
          : Left('Email must contain @')

      const validatePassword = (password?: string): Either<string, string> =>
        password && password.length >= 8
          ? Right(password)
          : Left('Password must be at least 8 characters')

      const validateForm = (
        form: FormData
      ): Either<NonEmptyList<string>, [string, string, string]> =>
        zipOrAccumulate3(
          validateUsername(form.username),
          validateEmail(form.email),
          validatePassword(form.password)
        )

      const invalidForm: FormData = {
        username: 'ab',
        email: 'invalid',
        password: '123',
      }

      const result = validateForm(invalidForm)

      expect(result.isLeft).toBe(true)
      const errors = result.getLeft()
      expect(errors.length).toBe(3)
      expect(errors).toContain('Username must be at least 3 characters')
      expect(errors).toContain('Email must contain @')
      expect(errors).toContain('Password must be at least 8 characters')
    })

    it('should validate API request with multiple fields', () => {
      type ApiRequest = {
        endpoint?: string
        method?: string
        body?: unknown
      }

      const validateEndpoint = (endpoint?: string): Either<string, string> =>
        endpoint && endpoint.startsWith('/')
          ? Right(endpoint)
          : Left('Endpoint must start with /')

      const validateMethod = (method?: string): Either<string, string> =>
        method && ['GET', 'POST', 'PUT', 'DELETE'].includes(method)
          ? Right(method)
          : Left('Invalid HTTP method')

      const validateBody = (body?: unknown): Either<string, unknown> =>
        body !== undefined ? Right(body) : Left('Body is required')

      const validateRequest = (
        request: ApiRequest
      ): Either<NonEmptyList<string>, [string, string, unknown]> =>
        zipOrAccumulate3(
          validateEndpoint(request.endpoint),
          validateMethod(request.method),
          validateBody(request.body)
        )

      const validRequest: ApiRequest = {
        endpoint: '/api/users',
        method: 'POST',
        body: { name: 'Alice' },
      }

      const validResult = validateRequest(validRequest)
      expect(validResult.isRight).toBe(true)

      const invalidRequest: ApiRequest = {
        endpoint: 'api/users',
        method: 'PATCH',
      }

      const invalidResult = validateRequest(invalidRequest)
      expect(invalidResult.isLeft).toBe(true)
      const errors = invalidResult.getLeft()
      expect(errors.length).toBe(3)
    })
  })
})
