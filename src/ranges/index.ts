export class IntRange implements Iterable<number> {
  constructor(
    public readonly start: number,
    public readonly endInclusive: number,
    public readonly step: number = 1
  ) {
    if (step === 0) throw new Error('Step must be non-zero')
  }

  get isEmpty(): boolean {
    if (this.step > 0) {
      return this.start > this.endInclusive
    } else {
      return this.start < this.endInclusive
    }
  }

  contains(value: number): boolean {
    if (this.isEmpty) return false

    if (this.step > 0) {
      if (value < this.start || value > this.endInclusive) return false
      return (value - this.start) % this.step === 0
    } else {
      if (value > this.start || value < this.endInclusive) return false
      return (this.start - value) % Math.abs(this.step) === 0
    }
  }

  [Symbol.iterator](): Iterator<number> {
    let current = this.start
    const { endInclusive, step } = this

    return {
      next(): IteratorResult<number> {
        if (step > 0 ? current <= endInclusive : current >= endInclusive) {
          const value = current
          current += step
          return { value, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }

  forEach(action: (value: number) => void): void {
    for (const value of this) {
      action(value)
    }
  }

  toArray(): number[] {
    return Array.from(this)
  }

  count(): number {
    if (this.isEmpty) return 0
    return Math.floor(Math.abs(this.endInclusive - this.start) / Math.abs(this.step)) + 1
  }

  first(): number {
    if (this.isEmpty) throw new Error('Range is empty')
    return this.start
  }

  last(): number {
    if (this.isEmpty) throw new Error('Range is empty')

    const count = this.count()
    return this.start + this.step * (count - 1)
  }

  reversed(): IntRange {
    return new IntRange(this.last(), this.first(), -this.step)
  }

  withStep(newStep: number): IntRange {
    if (newStep <= 0) throw new Error('Step must be positive')

    if (this.step > 0) {
      return new IntRange(this.start, this.endInclusive, newStep)
    } else {
      return new IntRange(this.start, this.endInclusive, -newStep)
    }
  }
}

export function rangeTo(start: number, endInclusive: number): IntRange {
  return new IntRange(start, endInclusive, 1)
}

export function until(start: number, endExclusive: number): IntRange {
  return new IntRange(start, endExclusive - 1, 1)
}

export function downTo(start: number, endInclusive: number): IntRange {
  return new IntRange(start, endInclusive, -1)
}

export function step(range: IntRange, stepValue: number): IntRange {
  return range.withStep(stepValue)
}

declare global {
  interface Number {
    rangeTo(endInclusive: number): IntRange
    until(endExclusive: number): IntRange
    downTo(endInclusive: number): IntRange
  }
}

Object.defineProperty(Number.prototype, 'rangeTo', {
  value: function (this: number, endInclusive: number): IntRange {
    return rangeTo(this, endInclusive)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Number.prototype, 'until', {
  value: function (this: number, endExclusive: number): IntRange {
    return until(this, endExclusive)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(Number.prototype, 'downTo', {
  value: function (this: number, endInclusive: number): IntRange {
    return downTo(this, endInclusive)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})
