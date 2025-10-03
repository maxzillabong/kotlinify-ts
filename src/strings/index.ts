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
  return str.padStart(length, padChar)
}

export function padEnd(str: string, length: number, padChar: string = ' '): string {
  return str.padEnd(length, padChar)
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
  return str.repeat(count)
}

export function lines(str: string): string[] {
  return str.split(/\r\n|\r|\n/)
}

export function reversed(str: string): string {
  return str.split('').reverse().join('')
}

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
