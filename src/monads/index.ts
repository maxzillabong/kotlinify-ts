export abstract class Option<T> {
  abstract readonly isSome: boolean
  abstract readonly isNone: boolean

  abstract get(): T
  abstract getOrNull(): T | null
  abstract getOrElse(defaultValue: T | (() => T)): T
  abstract getOrThrow(error?: Error): T

  map<U>(fn: (value: T) => U): Option<U> {
    return this.isSome ? Some((fn as any)(this.get())) : None()
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return this.isSome ? fn(this.get()) : None()
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return this.isSome && predicate(this.get()) ? this : None()
  }

  filterNot(predicate: (value: T) => boolean): Option<T> {
    return this.filter((v) => !predicate(v))
  }

  fold<U>(ifNone: () => U, ifSome: (value: T) => U): U {
    return this.isSome ? ifSome(this.get()) : ifNone()
  }

  orElse(alternative: () => Option<T>): Option<T> {
    return this.isSome ? this : alternative()
  }

  contains(value: T): boolean {
    return this.isSome && this.get() === value
  }

  exists(predicate: (value: T) => boolean): boolean {
    return this.isSome && predicate(this.get())
  }

  forEach(fn: (value: T) => void): void {
    if (this.isSome) fn(this.get())
  }

  toArray(): T[] {
    return this.isSome ? [this.get()] : []
  }

  toEither<L>(left: L): Either<L, T> {
    return this.isSome ? Right(this.get()) : Left(left)
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return this.isSome && other.isSome
      ? Some([this.get(), other.get()] as [T, U])
      : None()
  }

  let<U>(fn: (value: T) => U): Option<U> {
    return this.map(fn)
  }

  also(fn: (value: T) => void): Option<T> {
    if (this.isSome) fn(this.get())
    return this
  }

  apply(fn: (value: T) => void): Option<T> {
    if (this.isSome) fn(this.get())
    return this
  }

  takeIf(predicate: (value: T) => boolean): Option<T> {
    return this.filter(predicate)
  }

  takeUnless(predicate: (value: T) => boolean): Option<T> {
    return this.filterNot(predicate)
  }
}

class SomeImpl<T> extends Option<T> {
  readonly isSome = true
  readonly isNone = false

  constructor(private readonly value: T) {
    super()
  }

  get(): T {
    return this.value
  }

  getOrNull(): T {
    return this.value
  }

  getOrElse(_defaultValue: T | (() => T)): T {
    return this.value
  }

  getOrThrow(_error?: Error): T {
    return this.value
  }
}

class NoneImpl extends Option<never> {
  readonly isSome = false
  readonly isNone = true

  get(): never {
    throw new Error('Cannot get value from None')
  }

  getOrNull(): null {
    return null
  }

  getOrElse<T>(defaultValue: T | (() => T)): T {
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
  }

  getOrThrow(error?: Error): never {
    throw error ?? new Error('No value present')
  }
}

const NONE = new NoneImpl()

export function Some<T>(value: T): Option<T> {
  return new SomeImpl(value)
}

export function None<T = never>(): Option<T> {
  return NONE as Option<T>
}

export function fromNullable<T>(value: T | null | undefined): Option<T> {
  return value != null ? Some(value) : None()
}

export abstract class Either<L, R> {
  abstract readonly isLeft: boolean
  abstract readonly isRight: boolean

  abstract getLeft(): L
  abstract getRight(): R
  abstract getOrNull(): R | null
  abstract getOrElse(defaultValue: R | (() => R)): R

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isRight ? Right(fn(this.getRight())) : (this as any)
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    return this.isLeft ? Left(fn(this.getLeft())) : (this as any)
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight ? fn(this.getRight()) : (this as any)
  }

  fold<U>(ifLeft: (left: L) => U, ifRight: (right: R) => U): U {
    return this.isLeft ? ifLeft(this.getLeft()) : ifRight(this.getRight())
  }

  swap(): Either<R, L> {
    return this.isLeft ? Right(this.getLeft()) : Left(this.getRight())
  }

  filterOrElse(predicate: (value: R) => boolean, leftValue: () => L): Either<L, R> {
    return this.isRight && !predicate(this.getRight())
      ? Left(leftValue())
      : this
  }

  orElse(alternative: () => Either<L, R>): Either<L, R> {
    return this.isRight ? this : alternative()
  }

  contains(value: R): boolean {
    return this.isRight && this.getRight() === value
  }

  exists(predicate: (value: R) => boolean): boolean {
    return this.isRight && predicate(this.getRight())
  }

  toOption(): Option<R> {
    return this.isRight ? Some(this.getRight()) : None()
  }

  let<U>(fn: (value: R) => U): Either<L, U> {
    return this.map(fn)
  }

  also(fn: (value: R) => void): Either<L, R> {
    if (this.isRight) fn(this.getRight())
    return this
  }

  apply(fn: (value: R) => void): Either<L, R> {
    if (this.isRight) fn(this.getRight())
    return this
  }

  takeIf(predicate: (value: R) => boolean, leftValue: () => L): Either<L, R> {
    return this.filterOrElse(predicate, leftValue)
  }
}

class LeftImpl<L, R> extends Either<L, R> {
  readonly isLeft = true
  readonly isRight = false

  constructor(private readonly value: L) {
    super()
  }

  getLeft(): L {
    return this.value
  }

  getRight(): never {
    throw new Error('Cannot get right value from Left')
  }

  getOrNull(): null {
    return null
  }

  getOrElse(defaultValue: R | (() => R)): R {
    return typeof defaultValue === 'function' ? (defaultValue as () => R)() : defaultValue
  }
}

class RightImpl<L, R> extends Either<L, R> {
  readonly isLeft = false
  readonly isRight = true

  constructor(private readonly value: R) {
    super()
  }

  getLeft(): never {
    throw new Error('Cannot get left value from Right')
  }

  getRight(): R {
    return this.value
  }

  getOrNull(): R {
    return this.value
  }

  getOrElse(_defaultValue: R | (() => R)): R {
    return this.value
  }
}

export function Left<L, R = never>(value: L): Either<L, R> {
  return new LeftImpl(value)
}

export function Right<L = never, R = never>(value: R): Either<L, R> {
  return new RightImpl(value)
}

export abstract class Result<T, E = Error> {
  abstract readonly isSuccess: boolean
  abstract readonly isFailure: boolean

  abstract get(): T
  abstract getOrNull(): T | null
  abstract getOrElse(defaultValue: T | (() => T)): T
  abstract getOrThrow(): T

  abstract getError(): E
  abstract getErrorOrNull(): E | null

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isSuccess ? Success(fn(this.get())) : (this as any)
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return this.isFailure ? Failure(fn(this.getError())) : (this as any)
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.isSuccess ? fn(this.get()) : (this as any)
  }

  fold<U>(onFailure: (error: E) => U, onSuccess: (value: T) => U): U {
    return this.isSuccess ? onSuccess(this.get()) : onFailure(this.getError())
  }

  recover(fn: (error: E) => T): Result<T, E> {
    return this.isFailure ? Success(fn(this.getError())) : this
  }

  recoverWith(fn: (error: E) => Result<T, E>): Result<T, E> {
    return this.isFailure ? fn(this.getError()) : this
  }

  onSuccess(fn: (value: T) => void): Result<T, E> {
    if (this.isSuccess) fn(this.get())
    return this
  }

  onFailure(fn: (error: E) => void): Result<T, E> {
    if (this.isFailure) fn(this.getError())
    return this
  }

  toEither(): Either<E, T> {
    return this.isSuccess ? Right(this.get()) : Left(this.getError())
  }

  toOption(): Option<T> {
    return this.isSuccess ? Some(this.get()) : None()
  }

  let<U>(fn: (value: T) => U): Result<U, E> {
    return this.map(fn)
  }

  also(fn: (value: T) => void): Result<T, E> {
    return this.onSuccess(fn)
  }

  apply(fn: (value: T) => void): Result<T, E> {
    return this.onSuccess(fn)
  }
}

class SuccessImpl<T, E> extends Result<T, E> {
  readonly isSuccess = true
  readonly isFailure = false

  constructor(private readonly value: T) {
    super()
  }

  get(): T {
    return this.value
  }

  getOrNull(): T {
    return this.value
  }

  getOrElse(_defaultValue: T | (() => T)): T {
    return this.value
  }

  getOrThrow(): T {
    return this.value
  }

  getError(): never {
    throw new Error('Cannot get error from Success')
  }

  getErrorOrNull(): null {
    return null
  }
}

class FailureImpl<T, E> extends Result<T, E> {
  readonly isFailure = true
  readonly isSuccess = false

  constructor(private readonly error: E) {
    super()
  }

  get(): never {
    throw this.error instanceof Error ? this.error : new Error(String(this.error))
  }

  getOrNull(): null {
    return null
  }

  getOrElse(defaultValue: T | (() => T)): T {
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue
  }

  getOrThrow(): never {
    throw this.error instanceof Error ? this.error : new Error(String(this.error))
  }

  getError(): E {
    return this.error
  }

  getErrorOrNull(): E {
    return this.error
  }
}

export function Success<T, E = Error>(value: T): Result<T, E> {
  return new SuccessImpl(value)
}

export function Failure<T = never, E = Error>(error: E): Result<T, E> {
  return new FailureImpl(error)
}

export function tryCatch<T, E = Error>(
  fn: () => T,
  onError?: (error: unknown) => E
): Result<T, E> {
  try {
    return Success(fn())
  } catch (error) {
    return Failure(onError ? onError(error) : (error as E))
  }
}

export async function tryCatchAsync<T, E = Error>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    return Success(await fn())
  } catch (error) {
    return Failure(onError ? onError(error) : (error as E))
  }
}

export function sequence<T>(options: Option<T>[]): Option<T[]> {
  const results: T[] = []
  for (const option of options) {
    if (option.isNone) return None()
    results.push(option.get())
  }
  return Some(results)
}

export function traverse<T, U>(
  array: T[],
  fn: (value: T) => Option<U>
): Option<U[]> {
  return sequence(array.map(fn))
}

export class NonEmptyList<T> extends Array<T> {
  private constructor(head: T, ...tail: T[]) {
    super(head, ...tail)
    Object.setPrototypeOf(this, NonEmptyList.prototype)
  }

  static of<T>(head: T, ...tail: T[]): NonEmptyList<T> {
    return new NonEmptyList(head, ...tail)
  }

  static fromArray<T>(array: T[]): NonEmptyList<T> | null {
    return array.length > 0 ? new NonEmptyList(array[0], ...array.slice(1)) : null
  }

  get head(): T {
    return this[0]
  }

  get tail(): T[] {
    return this.slice(1)
  }
}

export type EitherNel<E, A> = Either<NonEmptyList<E>, A>

export function zipOrAccumulate<E, A, B>(
  a: Either<E, A>,
  b: Either<E, B>
): Either<NonEmptyList<E>, [A, B]> {
  if (a.isRight && b.isRight) {
    return Right([a.getRight(), b.getRight()])
  }

  const errors: E[] = []
  if (a.isLeft) errors.push(a.getLeft())
  if (b.isLeft) errors.push(b.getLeft())

  return Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
}

export function zipOrAccumulate3<E, A, B, C>(
  a: Either<E, A>,
  b: Either<E, B>,
  c: Either<E, C>
): Either<NonEmptyList<E>, [A, B, C]> {
  if (a.isRight && b.isRight && c.isRight) {
    return Right([a.getRight(), b.getRight(), c.getRight()])
  }

  const errors: E[] = []
  if (a.isLeft) errors.push(a.getLeft())
  if (b.isLeft) errors.push(b.getLeft())
  if (c.isLeft) errors.push(c.getLeft())

  return Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
}

export function zipOrAccumulate4<E, A, B, C, D>(
  a: Either<E, A>,
  b: Either<E, B>,
  c: Either<E, C>,
  d: Either<E, D>
): Either<NonEmptyList<E>, [A, B, C, D]> {
  if (a.isRight && b.isRight && c.isRight && d.isRight) {
    return Right([a.getRight(), b.getRight(), c.getRight(), d.getRight()])
  }

  const errors: E[] = []
  if (a.isLeft) errors.push(a.getLeft())
  if (b.isLeft) errors.push(b.getLeft())
  if (c.isLeft) errors.push(c.getLeft())
  if (d.isLeft) errors.push(d.getLeft())

  return Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
}

export function mapOrAccumulate<E, A, B>(
  items: A[],
  fn: (item: A) => Either<E, B>
): Either<NonEmptyList<E>, B[]> {
  const results: B[] = []
  const errors: E[] = []

  items.forEach((item) => {
    const result = fn(item)
    if (result.isRight) {
      results.push(result.getRight())
    } else {
      errors.push(result.getLeft())
    }
  })

  return errors.length > 0
    ? Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
    : Right(results)
}

declare module '../flow' {
  interface Flow<T> {
    mapNotNull<U>(fn: (value: T) => U | null | undefined): Flow<U>
    filterNotNull(): Flow<NonNullable<T>>
    mapToOption<U>(fn: (value: T) => Option<U>): Flow<U>
    mapToResult<U, E>(fn: (value: T) => Result<U, E>): Flow<U>
    mapToEither<L, R>(fn: (value: T) => Either<L, R>): Flow<R>
  }
}

import { Flow } from '../flow'

Flow.prototype.mapNotNull = function <T, U>(
  this: Flow<T>,
  fn: (value: T) => U | null | undefined
): Flow<U> {
  return this.map(fn).filter((v): v is U => v != null) as Flow<U>
}

Flow.prototype.filterNotNull = function <T>(this: Flow<T>): Flow<NonNullable<T>> {
  return this.filter((v): v is NonNullable<T> => v != null) as Flow<NonNullable<T>>
}

Flow.prototype.mapToOption = function <T, U>(
  this: Flow<T>,
  fn: (value: T) => Option<U>
): Flow<U> {
  return this.transform(async (value, emit) => {
    const option = fn(value)
    if (option.isSome) {
      await emit(option.get())
    }
  })
}

Flow.prototype.mapToResult = function <T, U, E>(
  this: Flow<T>,
  fn: (value: T) => Result<U, E>
): Flow<U> {
  return this.transform(async (value, emit) => {
    const result = fn(value)
    if (result.isSuccess) {
      await emit(result.get())
    }
  })
}

Flow.prototype.mapToEither = function <T, L, R>(
  this: Flow<T>,
  fn: (value: T) => Either<L, R>
): Flow<R> {
  return this.transform(async (value, emit) => {
    const either = fn(value)
    if (either.isRight) {
      await emit(either.getRight())
    }
  })
}
