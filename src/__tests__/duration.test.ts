import { describe, it, expect } from 'vitest'
import { Duration, DurationUnit, seconds, minutes, hours, days, milliseconds, microseconds, nanoseconds } from '../duration'

describe('Duration', () => {
  describe('construction', () => {
    it('creates duration from nanoseconds', () => {
      const d = Duration.nanoseconds(1000)
      expect(d.inWholeNanoseconds).toBe(1000)
    })

    it('creates duration from microseconds', () => {
      const d = Duration.microseconds(1000)
      expect(d.inWholeMicroseconds).toBe(1000)
      expect(d.inWholeNanoseconds).toBe(1_000_000)
    })

    it('creates duration from milliseconds', () => {
      const d = Duration.milliseconds(1000)
      expect(d.inWholeMilliseconds).toBe(1000)
      expect(d.inWholeSeconds).toBe(1)
    })

    it('creates duration from seconds', () => {
      const d = Duration.seconds(60)
      expect(d.inWholeSeconds).toBe(60)
      expect(d.inWholeMinutes).toBe(1)
    })

    it('creates duration from minutes', () => {
      const d = Duration.minutes(60)
      expect(d.inWholeMinutes).toBe(60)
      expect(d.inWholeHours).toBe(1)
    })

    it('creates duration from hours', () => {
      const d = Duration.hours(24)
      expect(d.inWholeHours).toBe(24)
      expect(d.inWholeDays).toBe(1)
    })

    it('creates duration from days', () => {
      const d = Duration.days(7)
      expect(d.inWholeDays).toBe(7)
    })

    it('creates zero duration', () => {
      const d = Duration.zero()
      expect(d.inWholeNanoseconds).toBe(0)
    })

    it('creates infinite duration', () => {
      const d = Duration.infinite()
      expect(d.isInfinite()).toBe(true)
      expect(d.isPositive()).toBe(true)
    })
  })

  describe('conversion getters', () => {
    const duration = Duration.milliseconds(120000)

    it('converts to whole nanoseconds', () => {
      expect(duration.inWholeNanoseconds).toBe(120_000_000_000)
    })

    it('converts to whole microseconds', () => {
      expect(duration.inWholeMicroseconds).toBe(120_000_000)
    })

    it('converts to whole milliseconds', () => {
      expect(duration.inWholeMilliseconds).toBe(120_000)
    })

    it('converts to whole seconds', () => {
      expect(duration.inWholeSeconds).toBe(120)
    })

    it('converts to whole minutes', () => {
      expect(duration.inWholeMinutes).toBe(2)
    })

    it('converts to whole hours', () => {
      expect(duration.inWholeHours).toBe(0)
    })

    it('converts to whole days', () => {
      expect(duration.inWholeDays).toBe(0)
    })
  })

  describe('toDouble', () => {
    const duration = Duration.seconds(90)

    it('converts to seconds', () => {
      expect(duration.toDouble(DurationUnit.SECONDS)).toBe(90)
    })

    it('converts to minutes', () => {
      expect(duration.toDouble(DurationUnit.MINUTES)).toBe(1.5)
    })

    it('converts to milliseconds', () => {
      expect(duration.toDouble(DurationUnit.MILLISECONDS)).toBe(90_000)
    })
  })

  describe('arithmetic operations', () => {
    it('adds durations', () => {
      const d1 = Duration.seconds(30)
      const d2 = Duration.seconds(20)
      const result = d1.plus(d2)
      expect(result.inWholeSeconds).toBe(50)
    })

    it('subtracts durations', () => {
      const d1 = Duration.seconds(50)
      const d2 = Duration.seconds(20)
      const result = d1.minus(d2)
      expect(result.inWholeSeconds).toBe(30)
    })

    it('multiplies by scalar', () => {
      const d = Duration.seconds(10)
      const result = d.times(3)
      expect(result.inWholeSeconds).toBe(30)
    })

    it('divides by scalar', () => {
      const d = Duration.seconds(30)
      const result = d.div(3)
      expect(result.inWholeSeconds).toBe(10)
    })

    it('divides by another duration', () => {
      const d1 = Duration.seconds(60)
      const d2 = Duration.seconds(20)
      expect(d1.dividedBy(d2)).toBe(3)
    })

    it('negates duration', () => {
      const d = Duration.seconds(10)
      const result = d.unaryMinus()
      expect(result.inWholeSeconds).toBe(-10)
      expect(result.isNegative()).toBe(true)
    })

    it('gets absolute value', () => {
      const d = Duration.seconds(-10)
      const result = d.absoluteValue()
      expect(result.inWholeSeconds).toBe(10)
      expect(result.isPositive()).toBe(true)
    })
  })

  describe('comparison', () => {
    it('compares equal durations', () => {
      const d1 = Duration.seconds(60)
      const d2 = Duration.minutes(1)
      expect(d1.compareTo(d2)).toBe(0)
      expect(d1.equals(d2)).toBe(true)
    })

    it('compares smaller duration', () => {
      const d1 = Duration.seconds(30)
      const d2 = Duration.minutes(1)
      expect(d1.compareTo(d2)).toBe(-1)
    })

    it('compares larger duration', () => {
      const d1 = Duration.minutes(2)
      const d2 = Duration.seconds(60)
      expect(d1.compareTo(d2)).toBe(1)
    })
  })

  describe('predicates', () => {
    it('checks if negative', () => {
      expect(Duration.seconds(-10).isNegative()).toBe(true)
      expect(Duration.seconds(10).isNegative()).toBe(false)
      expect(Duration.zero().isNegative()).toBe(false)
    })

    it('checks if positive', () => {
      expect(Duration.seconds(10).isPositive()).toBe(true)
      expect(Duration.seconds(-10).isPositive()).toBe(false)
      expect(Duration.zero().isPositive()).toBe(false)
    })

    it('checks if infinite', () => {
      expect(Duration.infinite().isInfinite()).toBe(true)
      expect(Duration.seconds(100).isInfinite()).toBe(false)
    })

    it('checks if finite', () => {
      expect(Duration.seconds(100).isFinite()).toBe(true)
      expect(Duration.infinite().isFinite()).toBe(false)
    })
  })

  describe('toString', () => {
    it('formats zero duration', () => {
      expect(Duration.zero().toString()).toBe('0ns')
    })

    it('formats simple seconds', () => {
      expect(Duration.seconds(45).toString()).toBe('45s')
    })

    it('formats simple minutes', () => {
      expect(Duration.minutes(30).toString()).toBe('30m')
    })

    it('formats simple hours', () => {
      expect(Duration.hours(2).toString()).toBe('2h')
    })

    it('formats simple days', () => {
      expect(Duration.days(45).toString()).toBe('45d')
    })

    it('formats days with hours', () => {
      expect(Duration.days(1.5).toString()).toContain('1d')
      expect(Duration.days(1.5).toString()).toContain('12h')
    })

    it('formats hours with minutes', () => {
      const d = Duration.minutes(1230)
      const str = d.toString()
      expect(str).toContain('20h')
      expect(str).toContain('30m')
    })

    it('formats complex duration', () => {
      const d = Duration.minutes(2415)
      const str = d.toString()
      expect(str).toContain('1d')
      expect(str).toContain('16h')
      expect(str).toContain('15m')
    })

    it('formats subsecond duration in milliseconds', () => {
      expect(Duration.milliseconds(25.12).toString()).toContain('ms')
    })

    it('formats subsecond duration in microseconds', () => {
      expect(Duration.microseconds(500).toString()).toBe('500us')
    })

    it('formats subsecond duration in nanoseconds', () => {
      expect(Duration.nanoseconds(24).toString()).toBe('24ns')
    })

    it('formats negative simple duration', () => {
      expect(Duration.seconds(-12).toString()).toBe('-12s')
    })

    it('formats negative complex duration with parentheses', () => {
      const d = Duration.hours(-1.5)
      const str = d.toString()
      expect(str).toContain('-(')
      expect(str).toContain('1h')
      expect(str).toContain('30m')
      expect(str).toContain(')')
    })

    it('formats with specific unit', () => {
      const d = Duration.seconds(90)
      expect(d.toString(DurationUnit.MINUTES, 1)).toBe('1.5m')
    })

    it('formats infinite duration', () => {
      expect(Duration.infinite().toString()).toBe('Infinity')
      expect(Duration.infinite().unaryMinus().toString()).toBe('-Infinity')
    })
  })

  describe('toIsoString', () => {
    it('formats simple seconds', () => {
      expect(Duration.seconds(30).toIsoString()).toBe('PT30S')
    })

    it('formats simple minutes', () => {
      expect(Duration.minutes(5).toIsoString()).toBe('PT5M')
    })

    it('formats simple hours', () => {
      expect(Duration.hours(2).toIsoString()).toBe('PT2H')
    })

    it('formats complex duration', () => {
      const d = Duration.hours(1).plus(Duration.minutes(30))
      expect(d.toIsoString()).toBe('PT1H30M')
    })

    it('formats negative duration', () => {
      const d = Duration.seconds(-30)
      expect(d.toIsoString()).toBe('-PT30S')
    })

    it('throws for infinite duration', () => {
      expect(() => Duration.infinite().toIsoString()).toThrow()
    })
  })

  describe('parse', () => {
    it('parses simple duration strings', () => {
      expect(Duration.parse('45d').inWholeDays).toBe(45)
      expect(Duration.parse('30m').inWholeMinutes).toBe(30)
      expect(Duration.parse('45s').inWholeSeconds).toBe(45)
    })

    it('parses fractional duration strings', () => {
      expect(Duration.parse('1.5h').inWholeMinutes).toBe(90)
      expect(Duration.parse('2.5m').inWholeSeconds).toBe(150)
    })

    it('parses complex duration strings', () => {
      const d = Duration.parse('1h 30m')
      expect(d.inWholeMinutes).toBe(90)
    })

    it('parses duration with multiple components', () => {
      const d = Duration.parse('1d 2h 30m 45s')
      expect(d.inWholeSeconds).toBe(95445)
    })

    it('parses negative duration', () => {
      const d = Duration.parse('-30s')
      expect(d.inWholeSeconds).toBe(-30)
      expect(d.isNegative()).toBe(true)
    })

    it('parses negative complex duration with parentheses', () => {
      const d = Duration.parse('-(1h 30m)')
      expect(d.inWholeMinutes).toBe(-90)
    })

    it('parses infinity', () => {
      expect(Duration.parse('Infinity').isInfinite()).toBe(true)
      expect(Duration.parse('-Infinity').isInfinite()).toBe(true)
      expect(Duration.parse('-Infinity').isNegative()).toBe(true)
    })

    it('throws on invalid format', () => {
      expect(() => Duration.parse('invalid')).toThrow()
      expect(() => Duration.parse('1 hour 30 minutes')).toThrow()
    })
  })

  describe('parseOrNull', () => {
    it('returns null for invalid format', () => {
      expect(Duration.parseOrNull('invalid')).toBeNull()
      expect(Duration.parseOrNull('1 hour 30 minutes')).toBeNull()
    })

    it('parses valid format', () => {
      expect(Duration.parseOrNull('1h 30m')?.inWholeMinutes).toBe(90)
    })
  })

  describe('parseIsoString', () => {
    it('parses ISO format with hours and minutes', () => {
      const d = Duration.parseIsoString('PT1H30M')
      expect(d.inWholeMinutes).toBe(90)
    })

    it('parses ISO format with seconds', () => {
      const d = Duration.parseIsoString('PT45S')
      expect(d.inWholeSeconds).toBe(45)
    })

    it('parses ISO format with all components', () => {
      const d = Duration.parseIsoString('PT2H30M15S')
      expect(d.inWholeSeconds).toBe(9015)
    })

    it('parses negative ISO duration', () => {
      const d = Duration.parseIsoString('-PT30M')
      expect(d.inWholeMinutes).toBe(-30)
    })

    it('parses fractional seconds', () => {
      const d = Duration.parseIsoString('PT1.5S')
      expect(d.inWholeMilliseconds).toBe(1500)
    })

    it('throws on invalid ISO format', () => {
      expect(() => Duration.parseIsoString('1h 30m')).toThrow()
    })
  })

  describe('parseIsoStringOrNull', () => {
    it('returns null for invalid ISO format', () => {
      expect(Duration.parseIsoStringOrNull('1h 30m')).toBeNull()
    })

    it('parses valid ISO format', () => {
      expect(Duration.parseIsoStringOrNull('PT1H30M')?.inWholeMinutes).toBe(90)
    })
  })

  describe('toComponents', () => {
    it('decomposes simple duration', () => {
      Duration.seconds(90).toComponents((days, hours, minutes, seconds, nanos) => {
        expect(days).toBe(0)
        expect(hours).toBe(0)
        expect(minutes).toBe(1)
        expect(seconds).toBe(30)
        expect(nanos).toBe(0)
      })
    })

    it('decomposes complex duration', () => {
      const d = Duration.days(1).plus(Duration.hours(2)).plus(Duration.minutes(30)).plus(Duration.seconds(45))
      d.toComponents((days, hours, minutes, seconds, nanos) => {
        expect(days).toBe(1)
        expect(hours).toBe(2)
        expect(minutes).toBe(30)
        expect(seconds).toBe(45)
        expect(nanos).toBe(0)
      })
    })

    it('decomposes negative duration', () => {
      Duration.seconds(-90).toComponents((days, hours, minutes, seconds, nanos) => {
        expect(days).toBe(0)
        expect(hours).toBe(0)
        expect(minutes).toBe(1)
        expect(seconds).toBe(30)
        expect(nanos).toBe(0)
      })
    })

    it('returns result from action', () => {
      const result = Duration.hours(25).toComponents((days, hours, _minutes, _seconds, _nanos) => {
        return `${days}d ${hours}h`
      })
      expect(result).toBe('1d 1h')
    })
  })

  describe('standalone functions', () => {
    it('creates duration from nanoseconds function', () => {
      expect(nanoseconds(1000).inWholeNanoseconds).toBe(1000)
    })

    it('creates duration from microseconds function', () => {
      expect(microseconds(1000).inWholeMicroseconds).toBe(1000)
    })

    it('creates duration from milliseconds function', () => {
      expect(milliseconds(1000).inWholeMilliseconds).toBe(1000)
    })

    it('creates duration from seconds function', () => {
      expect(seconds(60).inWholeMinutes).toBe(1)
    })

    it('creates duration from minutes function', () => {
      expect(minutes(60).inWholeHours).toBe(1)
    })

    it('creates duration from hours function', () => {
      expect(hours(24).inWholeDays).toBe(1)
    })

    it('creates duration from days function', () => {
      expect(days(7).inWholeDays).toBe(7)
    })
  })

  describe('standalone duration functions', () => {
    it('creates duration from nanoseconds', () => {
      expect(nanoseconds(1000).inWholeNanoseconds).toBe(1000)
    })

    it('creates duration from microseconds', () => {
      expect(microseconds(1000).inWholeMicroseconds).toBe(1000)
    })

    it('creates duration from milliseconds', () => {
      expect(milliseconds(1000).inWholeMilliseconds).toBe(1000)
    })

    it('creates duration from seconds', () => {
      expect(seconds(60).inWholeMinutes).toBe(1)
    })

    it('creates duration from minutes', () => {
      expect(minutes(60).inWholeHours).toBe(1)
    })

    it('creates duration from hours', () => {
      expect(hours(24).inWholeDays).toBe(1)
    })

    it('creates duration from days', () => {
      expect(days(7).inWholeDays).toBe(7)
    })

    it('allows chaining with arithmetic', () => {
      const d = minutes(30).plus(seconds(15))
      expect(d.inWholeSeconds).toBe(1815)
    })
  })

  describe('real-world scenarios', () => {
    it('calculates time difference', () => {
      const start = Duration.seconds(100)
      const end = Duration.seconds(250)
      const diff = end.minus(start)
      expect(diff.inWholeSeconds).toBe(150)
      expect(diff.inWholeMinutes).toBe(2)
    })

    it('formats API timeout', () => {
      const timeout = seconds(30)
      expect(timeout.toString()).toBe('30s')
      expect(timeout.inWholeMilliseconds).toBe(30000)
    })

    it('calculates video duration', () => {
      const duration = hours(2).plus(minutes(35)).plus(seconds(12))
      expect(duration.inWholeSeconds).toBe(9312)
      expect(duration.toString()).toContain('2h')
      expect(duration.toString()).toContain('35m')
      expect(duration.toString()).toContain('12s')
    })

    it('parses user input duration', () => {
      const userInput = '1h 30m'
      const duration = Duration.parse(userInput)
      expect(duration.inWholeMinutes).toBe(90)
    })

    it('compares durations for sorting', () => {
      const durations = [
        Duration.hours(2),
        Duration.minutes(30),
        Duration.seconds(45),
        Duration.hours(1),
      ]

      durations.sort((a, b) => a.compareTo(b))

      expect(durations[0].inWholeSeconds).toBe(45)
      expect(durations[1].inWholeMinutes).toBe(30)
      expect(durations[2].inWholeHours).toBe(1)
      expect(durations[3].inWholeHours).toBe(2)
    })
  })
})
