/**
 * Duration module - Kotlin-inspired time duration utilities
 *
 * Represents amounts of time in different units with support for:
 * - Construction from various time units
 * - Arithmetic operations (plus, minus, times, div)
 * - Comparison operations
 * - Conversion between units
 * - String formatting and parsing
 */

export enum DurationUnit {
  NANOSECONDS = 'ns',
  MICROSECONDS = 'us',
  MILLISECONDS = 'ms',
  SECONDS = 's',
  MINUTES = 'm',
  HOURS = 'h',
  DAYS = 'd',
}

const NANOS_PER_MICRO = 1_000
const NANOS_PER_MILLI = 1_000_000
const NANOS_PER_SECOND = 1_000_000_000
const NANOS_PER_MINUTE = 60_000_000_000
const NANOS_PER_HOUR = 3_600_000_000_000
const NANOS_PER_DAY = 86_400_000_000_000

export class Duration {
  private constructor(private readonly nanos: number) {}

  static nanoseconds(value: number): Duration {
    return new Duration(value)
  }

  static microseconds(value: number): Duration {
    return new Duration(value * NANOS_PER_MICRO)
  }

  static milliseconds(value: number): Duration {
    return new Duration(value * NANOS_PER_MILLI)
  }

  static seconds(value: number): Duration {
    return new Duration(value * NANOS_PER_SECOND)
  }

  static minutes(value: number): Duration {
    return new Duration(value * NANOS_PER_MINUTE)
  }

  static hours(value: number): Duration {
    return new Duration(value * NANOS_PER_HOUR)
  }

  static days(value: number): Duration {
    return new Duration(value * NANOS_PER_DAY)
  }

  static zero(): Duration {
    return new Duration(0)
  }

  static infinite(): Duration {
    return new Duration(Number.POSITIVE_INFINITY)
  }

  get inWholeNanoseconds(): number {
    return Math.floor(this.nanos)
  }

  get inWholeMicroseconds(): number {
    return Math.floor(this.nanos / NANOS_PER_MICRO)
  }

  get inWholeMilliseconds(): number {
    return Math.floor(this.nanos / NANOS_PER_MILLI)
  }

  get inWholeSeconds(): number {
    return Math.floor(this.nanos / NANOS_PER_SECOND)
  }

  get inWholeMinutes(): number {
    return Math.floor(this.nanos / NANOS_PER_MINUTE)
  }

  get inWholeHours(): number {
    return Math.floor(this.nanos / NANOS_PER_HOUR)
  }

  get inWholeDays(): number {
    return Math.floor(this.nanos / NANOS_PER_DAY)
  }

  toDouble(unit: DurationUnit): number {
    switch (unit) {
      case DurationUnit.NANOSECONDS:
        return this.nanos
      case DurationUnit.MICROSECONDS:
        return this.nanos / NANOS_PER_MICRO
      case DurationUnit.MILLISECONDS:
        return this.nanos / NANOS_PER_MILLI
      case DurationUnit.SECONDS:
        return this.nanos / NANOS_PER_SECOND
      case DurationUnit.MINUTES:
        return this.nanos / NANOS_PER_MINUTE
      case DurationUnit.HOURS:
        return this.nanos / NANOS_PER_HOUR
      case DurationUnit.DAYS:
        return this.nanos / NANOS_PER_DAY
    }
  }

  plus(other: Duration): Duration {
    return new Duration(this.nanos + other.nanos)
  }

  minus(other: Duration): Duration {
    return new Duration(this.nanos - other.nanos)
  }

  times(scale: number): Duration {
    return new Duration(this.nanos * scale)
  }

  div(scale: number): Duration {
    return new Duration(this.nanos / scale)
  }

  dividedBy(other: Duration): number {
    return this.nanos / other.nanos
  }

  unaryMinus(): Duration {
    return new Duration(-this.nanos)
  }

  absoluteValue(): Duration {
    return new Duration(Math.abs(this.nanos))
  }

  isNegative(): boolean {
    return this.nanos < 0
  }

  isPositive(): boolean {
    return this.nanos > 0
  }

  isInfinite(): boolean {
    return !isFinite(this.nanos)
  }

  isFinite(): boolean {
    return isFinite(this.nanos)
  }

  compareTo(other: Duration): number {
    if (this.nanos < other.nanos) return -1
    if (this.nanos > other.nanos) return 1
    return 0
  }

  equals(other: Duration): boolean {
    return this.nanos === other.nanos
  }

  toString(unit?: DurationUnit, decimals: number = 3): string {
    if (this.isInfinite()) {
      return this.nanos > 0 ? 'Infinity' : '-Infinity'
    }

    if (unit) {
      const value = this.toDouble(unit)
      return `${value.toFixed(decimals)}${unit}`
    }

    const abs = Math.abs(this.nanos)
    const sign = this.nanos < 0 ? '-' : ''

    const components: string[] = []

    const days = Math.floor(abs / NANOS_PER_DAY)
    const hours = Math.floor((abs % NANOS_PER_DAY) / NANOS_PER_HOUR)
    const minutes = Math.floor((abs % NANOS_PER_HOUR) / NANOS_PER_MINUTE)
    const seconds = Math.floor((abs % NANOS_PER_MINUTE) / NANOS_PER_SECOND)
    const millis = Math.floor((abs % NANOS_PER_SECOND) / NANOS_PER_MILLI)
    const micros = Math.floor((abs % NANOS_PER_MILLI) / NANOS_PER_MICRO)
    const nanos = Math.floor(abs % NANOS_PER_MICRO)

    if (days > 0) components.push(`${days}d`)
    if (hours > 0) components.push(`${hours}h`)
    if (minutes > 0) components.push(`${minutes}m`)

    if (seconds > 0 || (components.length === 0 && abs >= NANOS_PER_SECOND)) {
      if (millis > 0 || micros > 0 || nanos > 0) {
        const fractional = (millis * NANOS_PER_MILLI + micros * NANOS_PER_MICRO + nanos) / NANOS_PER_SECOND
        components.push(`${(seconds + fractional).toFixed(3).replace(/\.?0+$/, '')}s`)
      } else {
        components.push(`${seconds}s`)
      }
    } else if (millis > 0 || (components.length === 0 && abs >= NANOS_PER_MILLI)) {
      if (micros > 0 || nanos > 0) {
        const fractional = (micros * NANOS_PER_MICRO + nanos) / NANOS_PER_MILLI
        components.push(`${(millis + fractional).toFixed(3).replace(/\.?0+$/, '')}ms`)
      } else {
        components.push(`${millis}ms`)
      }
    } else if (micros > 0 || (components.length === 0 && abs >= NANOS_PER_MICRO)) {
      if (nanos > 0) {
        const fractional = nanos / NANOS_PER_MICRO
        components.push(`${(micros + fractional).toFixed(3).replace(/\.?0+$/, '')}us`)
      } else {
        components.push(`${micros}us`)
      }
    } else if (components.length === 0 || nanos > 0) {
      components.push(`${nanos}ns`)
    }

    const result = components.join(' ')
    if (sign && components.length > 1) {
      return `${sign}(${result})`
    }
    return sign + result
  }

  toIsoString(): string {
    if (this.isInfinite()) {
      throw new Error('Cannot convert infinite duration to ISO string')
    }

    const abs = Math.abs(this.nanos)
    const sign = this.nanos < 0 ? '-' : ''

    const hours = Math.floor(abs / NANOS_PER_HOUR)
    const minutes = Math.floor((abs % NANOS_PER_HOUR) / NANOS_PER_MINUTE)
    const seconds = abs % NANOS_PER_MINUTE / NANOS_PER_SECOND

    let result = 'PT'
    if (hours > 0) result += `${hours}H`
    if (minutes > 0) result += `${minutes}M`
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      result += `${seconds}S`
    }

    return sign + result
  }

  static parse(value: string): Duration {
    const result = Duration.parseOrNull(value)
    if (!result) {
      throw new Error(`Invalid duration format: ${value}`)
    }
    return result
  }

  static parseOrNull(value: string): Duration | null {
    const trimmed = value.trim()

    if (trimmed === 'Infinity') return Duration.infinite()
    if (trimmed === '-Infinity') return Duration.infinite().unaryMinus()

    const isoResult = Duration.parseIsoStringOrNull(trimmed)
    if (isoResult) return isoResult

    return Duration.parseDefaultFormatOrNull(trimmed)
  }

  static parseIsoString(value: string): Duration {
    const result = Duration.parseIsoStringOrNull(value)
    if (!result) {
      throw new Error(`Invalid ISO duration format: ${value}`)
    }
    return result
  }

  static parseIsoStringOrNull(value: string): Duration | null {
    const match = value.match(/^(-)?PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/)
    if (!match) return null

    const [, sign, hours, minutes, seconds] = match
    const negative = sign === '-'

    let totalNanos = 0
    if (hours) totalNanos += parseFloat(hours) * NANOS_PER_HOUR
    if (minutes) totalNanos += parseFloat(minutes) * NANOS_PER_MINUTE
    if (seconds) totalNanos += parseFloat(seconds) * NANOS_PER_SECOND

    return new Duration(negative ? -totalNanos : totalNanos)
  }

  private static parseDefaultFormatOrNull(value: string): Duration | null {
    const trimmed = value.trim()
    const isNegative = trimmed.startsWith('-')
    const withoutSign = isNegative ? trimmed.slice(1).trim() : trimmed
    const withoutParens = withoutSign.startsWith('(') && withoutSign.endsWith(')')
      ? withoutSign.slice(1, -1).trim()
      : withoutSign

    const singleUnitMatch = withoutParens.match(/^(\d+(?:\.\d+)?)(ns|us|ms|s|m|h|d)$/)
    if (singleUnitMatch) {
      const [, valueStr, unit] = singleUnitMatch
      const numValue = parseFloat(valueStr)
      let duration: Duration

      switch (unit) {
        case 'ns': duration = Duration.nanoseconds(numValue); break
        case 'us': duration = Duration.microseconds(numValue); break
        case 'ms': duration = Duration.milliseconds(numValue); break
        case 's': duration = Duration.seconds(numValue); break
        case 'm': duration = Duration.minutes(numValue); break
        case 'h': duration = Duration.hours(numValue); break
        case 'd': duration = Duration.days(numValue); break
        default: return null
      }

      return isNegative ? duration.unaryMinus() : duration
    }

    const componentRegex = /(\d+(?:\.\d+)?)(ns|us|ms|s|m|h|d)/g
    const matches = [...withoutParens.matchAll(componentRegex)]

    if (matches.length === 0) return null

    let totalNanos = 0
    for (const match of matches) {
      const value = parseFloat(match[1])
      const unit = match[2]

      switch (unit) {
        case 'd': totalNanos += value * NANOS_PER_DAY; break
        case 'h': totalNanos += value * NANOS_PER_HOUR; break
        case 'm': totalNanos += value * NANOS_PER_MINUTE; break
        case 's': totalNanos += value * NANOS_PER_SECOND; break
        case 'ms': totalNanos += value * NANOS_PER_MILLI; break
        case 'us': totalNanos += value * NANOS_PER_MICRO; break
        case 'ns': totalNanos += value; break
      }
    }

    return new Duration(isNegative ? -totalNanos : totalNanos)
  }

  toComponents<T>(
    action: (days: number, hours: number, minutes: number, seconds: number, nanoseconds: number) => T
  ): T {
    const abs = Math.abs(this.nanos)
    const sign = this.nanos < 0 ? -1 : 1

    let days = Math.floor(abs / NANOS_PER_DAY) * sign
    const hours = Math.floor((abs % NANOS_PER_DAY) / NANOS_PER_HOUR)
    const minutes = Math.floor((abs % NANOS_PER_HOUR) / NANOS_PER_MINUTE)
    const seconds = Math.floor((abs % NANOS_PER_MINUTE) / NANOS_PER_SECOND)
    const nanoseconds = Math.floor(abs % NANOS_PER_SECOND)

    if (days === 0) days = 0

    return action(days, hours, minutes, seconds, nanoseconds)
  }
}

export function nanoseconds(value: number): Duration {
  return Duration.nanoseconds(value)
}

export function microseconds(value: number): Duration {
  return Duration.microseconds(value)
}

export function milliseconds(value: number): Duration {
  return Duration.milliseconds(value)
}

export function seconds(value: number): Duration {
  return Duration.seconds(value)
}

export function minutes(value: number): Duration {
  return Duration.minutes(value)
}

export function hours(value: number): Duration {
  return Duration.hours(value)
}

export function days(value: number): Duration {
  return Duration.days(value)
}
