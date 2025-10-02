const nativePadStart = String.prototype.padStart
const nativePadEnd = String.prototype.padEnd
const nativeRepeat = String.prototype.repeat

export function trimIndent(str: string): string {
  const lines = str.split('\n')

  const nonEmptyLines = lines.filter(line => line.trim().length > 0)

  if (nonEmptyLines.length === 0) return ''

  const minIndent = Math.min(
    ...nonEmptyLines.map(line => {
      const match = line.match(/^(\s*)/)
      return match ? match[1].length : 0
    })
  )

  return lines
    .map(line => {
      if (line.trim().length === 0) return ''
      return line.length >= minIndent ? line.slice(minIndent) : line
    })
    .join('\n')
}

export function trimMargin(str: string, marginPrefix: string = '|'): string {
  return str
    .split('\n')
    .map(line => {
      const trimmed = line.trimStart()
      return trimmed.startsWith(marginPrefix)
        ? trimmed.slice(marginPrefix.length)
        : line
    })
    .join('\n')
}

export function padStart(str: string, length: number, padChar: string = ' '): string {
  return nativePadStart.call(str, length, padChar)
}

export function padEnd(str: string, length: number, padChar: string = ' '): string {
  return nativePadEnd.call(str, length, padChar)
}

export function removePrefix(str: string, prefix: string): string {
  if (prefix.length === 0) return str
  return str.startsWith(prefix) ? str.slice(prefix.length) : str
}

export function removeSuffix(str: string, suffix: string): string {
  if (suffix.length === 0) return str
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
}

export function removeSurrounding(str: string, delimiter: string): string
export function removeSurrounding(str: string, prefix: string, suffix: string): string
export function removeSurrounding(str: string, prefixOrDelimiter: string, suffix?: string): string {
  const prefix = suffix === undefined ? prefixOrDelimiter : prefixOrDelimiter
  const suffixToUse = suffix === undefined ? prefixOrDelimiter : suffix

  if (str.startsWith(prefix) && str.endsWith(suffixToUse)) {
    return str.slice(prefix.length, -suffixToUse.length)
  }
  return str
}

export function capitalize(str: string): string {
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1)
}

export function decapitalize(str: string): string {
  return str.length === 0 ? str : str[0].toLowerCase() + str.slice(1)
}

export function repeat(str: string, count: number): string {
  return nativeRepeat.call(str, count)
}

export function lines(str: string): string[] {
  return str.split(/\r\n|\r|\n/)
}

export function reversed(str: string): string {
  return str.split('').reverse().join('')
}

declare global {
  interface String {
    trimIndent(): string
    trimMargin(marginPrefix?: string): string
    padStart(length: number, padChar?: string): string
    padEnd(length: number, padChar?: string): string
    removePrefix(prefix: string): string
    removeSuffix(suffix: string): string
    removeSurrounding(delimiter: string): string
    removeSurrounding(prefix: string, suffix: string): string
    capitalize(): string
    decapitalize(): string
    repeat(count: number): string
    lines(): string[]
    reversed(): string
  }
}

Object.defineProperty(String.prototype, 'trimIndent', {
  value: function (this: string): string {
    return trimIndent(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'trimMargin', {
  value: function (this: string, marginPrefix: string = '|'): string {
    return trimMargin(this, marginPrefix)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'padStart', {
  value: function (this: string, length: number, padChar: string = ' '): string {
    return padStart(this, length, padChar)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'padEnd', {
  value: function (this: string, length: number, padChar: string = ' '): string {
    return padEnd(this, length, padChar)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'removePrefix', {
  value: function (this: string, prefix: string): string {
    return removePrefix(this, prefix)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'removeSuffix', {
  value: function (this: string, suffix: string): string {
    return removeSuffix(this, suffix)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'removeSurrounding', {
  value: function (this: string, prefixOrDelimiter: string, suffix?: string): string {
    return suffix === undefined
      ? removeSurrounding(this, prefixOrDelimiter)
      : removeSurrounding(this, prefixOrDelimiter, suffix)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'capitalize', {
  value: function (this: string): string {
    return capitalize(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'decapitalize', {
  value: function (this: string): string {
    return decapitalize(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'lines', {
  value: function (this: string): string[] {
    return lines(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'reversed', {
  value: function (this: string): string {
    return reversed(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

export function ifBlank(str: string, defaultValue: string | (() => string)): string {
  return str.trim().length === 0
    ? typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue
    : str
}

export function ifEmpty(str: string, defaultValue: string | (() => string)): string {
  return str.length === 0
    ? typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue
    : str
}

export function isBlank(str: string): boolean {
  return str.trim().length === 0
}

export function isNotBlank(str: string): boolean {
  return str.trim().length > 0
}

export function isEmpty(str: string): boolean {
  return str.length === 0
}

export function isNotEmpty(str: string): boolean {
  return str.length > 0
}

export function toIntOrNull(str: string): number | null {
  const num = parseInt(str, 10)
  return !isNaN(num) && String(num) === str.trim() ? num : null
}

export function toDoubleOrNull(str: string): number | null {
  const num = parseFloat(str)
  return !isNaN(num) ? num : null
}

export function toBooleanOrNull(str: string): boolean | null {
  const lower = str.trim().toLowerCase()
  if (lower === 'true') return true
  if (lower === 'false') return false
  return null
}

export function toIntOrDefault(str: string, defaultValue: number): number {
  const num = toIntOrNull(str)
  return num !== null ? num : defaultValue
}

export function toDoubleOrDefault(str: string, defaultValue: number): number {
  const num = toDoubleOrNull(str)
  return num !== null ? num : defaultValue
}

export function lineSequence(str: string): IterableIterator<string> {
  return lines(str)[Symbol.iterator]()
}

export function commonPrefix(...strings: string[]): string {
  if (strings.length === 0) return ''
  if (strings.length === 1) return strings[0]

  let prefix = ''
  const minLength = Math.min(...strings.map((s) => s.length))

  for (let i = 0; i < minLength; i++) {
    const char = strings[0][i]
    if (strings.every((s) => s[i] === char)) {
      prefix += char
    } else {
      break
    }
  }

  return prefix
}

export function commonSuffix(...strings: string[]): string {
  if (strings.length === 0) return ''
  if (strings.length === 1) return strings[0]

  let suffix = ''
  const minLength = Math.min(...strings.map((s) => s.length))

  for (let i = 1; i <= minLength; i++) {
    const char = strings[0][strings[0].length - i]
    if (strings.every((s) => s[s.length - i] === char)) {
      suffix = char + suffix
    } else {
      break
    }
  }

  return suffix
}

declare global {
  interface String {
    ifBlank(defaultValue: string | (() => string)): string
    ifEmpty(defaultValue: string | (() => string)): string
    isBlank(): boolean
    isNotBlank(): boolean
    isEmpty(): boolean
    isNotEmpty(): boolean
    toIntOrNull(): number | null
    toDoubleOrNull(): number | null
    toBooleanOrNull(): boolean | null
    lines(): string[]
  }
}

Object.defineProperty(String.prototype, 'ifBlank', {
  value: function (this: string, defaultValue: string | (() => string)): string {
    return ifBlank(this, defaultValue)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'ifEmpty', {
  value: function (this: string, defaultValue: string | (() => string)): string {
    return ifEmpty(this, defaultValue)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'isBlank', {
  value: function (this: string): boolean {
    return isBlank(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'isNotBlank', {
  value: function (this: string): boolean {
    return isNotBlank(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'isEmpty', {
  value: function (this: string): boolean {
    return isEmpty(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'isNotEmpty', {
  value: function (this: string): boolean {
    return isNotEmpty(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'toIntOrNull', {
  value: function (this: string): number | null {
    return toIntOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'toDoubleOrNull', {
  value: function (this: string): number | null {
    return toDoubleOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'toBooleanOrNull', {
  value: function (this: string): boolean | null {
    return toBooleanOrNull(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})

Object.defineProperty(String.prototype, 'lines', {
  value: function (this: string): string[] {
    return lines(this)
  },
  writable: true,
  configurable: true,
  enumerable: false,
})
