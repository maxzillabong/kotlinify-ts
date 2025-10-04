// src/scope/index.ts
function letValue(value, block) {
  return block(value);
}
function apply(value, block) {
  block(value);
  return value;
}
function also(value, block) {
  block(value);
  return value;
}
function run(value, block) {
  return block.call(value);
}
function withValue(receiver, block) {
  return block.call(receiver);
}
function letOrNull(value, block) {
  return value != null ? block(value) : null;
}
function applyOrNull(value, block) {
  if (value != null) {
    block(value);
    return value;
  }
  return null;
}
function alsoOrNull(value, block) {
  if (value != null) {
    block(value);
    return value;
  }
  return null;
}
function runOrNull(value, block) {
  return value != null ? block.call(value) : null;
}
var ScopeChainImpl = class _ScopeChainImpl {
  constructor(_value) {
    this._value = _value;
  }
  let(block) {
    return new _ScopeChainImpl(letValue(this._value, block));
  }
  apply(block) {
    return new _ScopeChainImpl(apply(this._value, block));
  }
  also(block) {
    return new _ScopeChainImpl(also(this._value, block));
  }
  run(block) {
    return new _ScopeChainImpl(run(this._value, block));
  }
  value() {
    return this._value;
  }
};
function asScope(value) {
  if (value instanceof Promise) {
    return new ScopeChainImpl(value);
  }
  return new ScopeChainImpl(value);
}

// src/nullsafety/index.ts
function takeIf(value, predicate) {
  return predicate(value) ? value : void 0;
}
function takeUnless(value, predicate) {
  return predicate(value) ? void 0 : value;
}
function orEmpty(value) {
  if (value === null || value === void 0) {
    return Array.isArray(value) ? [] : "";
  }
  return value;
}
function isNullOrEmpty(value) {
  return value === null || value === void 0 || value.length === 0;
}
function isNullOrBlank(value) {
  return value === null || value === void 0 || value.trim().length === 0;
}

// src/strings/index.ts
function repeat(str, count2) {
  return str.repeat(count2);
}

// src/ranges/index.ts
var IntRange = class _IntRange {
  constructor(start, endInclusive, step2 = 1) {
    this.start = start;
    this.endInclusive = endInclusive;
    this.step = step2;
    if (step2 === 0) throw new Error("Step must be non-zero");
  }
  get isEmpty() {
    if (this.step > 0) {
      return this.start > this.endInclusive;
    } else {
      return this.start < this.endInclusive;
    }
  }
  contains(value) {
    if (this.isEmpty) return false;
    if (this.step > 0) {
      if (value < this.start || value > this.endInclusive) return false;
      return (value - this.start) % this.step === 0;
    } else {
      if (value > this.start || value < this.endInclusive) return false;
      return (this.start - value) % Math.abs(this.step) === 0;
    }
  }
  [Symbol.iterator]() {
    let current = this.start;
    const { endInclusive, step: step2 } = this;
    return {
      next() {
        if (step2 > 0 ? current <= endInclusive : current >= endInclusive) {
          const value = current;
          current += step2;
          return { value, done: false };
        }
        return { value: void 0, done: true };
      }
    };
  }
  forEach(action) {
    for (const value of this) {
      action(value);
    }
  }
  toArray() {
    return Array.from(this);
  }
  count() {
    if (this.isEmpty) return 0;
    return Math.floor(Math.abs(this.endInclusive - this.start) / Math.abs(this.step)) + 1;
  }
  first() {
    if (this.isEmpty) throw new Error("Range is empty");
    return this.start;
  }
  last() {
    if (this.isEmpty) throw new Error("Range is empty");
    const count2 = this.count();
    return this.start + this.step * (count2 - 1);
  }
  reversed() {
    return new _IntRange(this.last(), this.first(), -this.step);
  }
  withStep(newStep) {
    if (newStep <= 0) throw new Error("Step must be positive");
    if (this.step > 0) {
      return new _IntRange(this.start, this.endInclusive, newStep);
    } else {
      return new _IntRange(this.start, this.endInclusive, -newStep);
    }
  }
};
function rangeTo(start, endInclusive) {
  return new IntRange(start, endInclusive, 1);
}
function until(start, endExclusive) {
  return new IntRange(start, endExclusive - 1, 1);
}
function downTo(start, endInclusive) {
  return new IntRange(start, endInclusive, -1);
}
function step(range, stepValue) {
  return range.withStep(stepValue);
}

// src/duration/index.ts
var DurationUnit = /* @__PURE__ */ ((DurationUnit2) => {
  DurationUnit2["NANOSECONDS"] = "ns";
  DurationUnit2["MICROSECONDS"] = "us";
  DurationUnit2["MILLISECONDS"] = "ms";
  DurationUnit2["SECONDS"] = "s";
  DurationUnit2["MINUTES"] = "m";
  DurationUnit2["HOURS"] = "h";
  DurationUnit2["DAYS"] = "d";
  return DurationUnit2;
})(DurationUnit || {});
var NANOS_PER_MICRO = 1e3;
var NANOS_PER_MILLI = 1e6;
var NANOS_PER_SECOND = 1e9;
var NANOS_PER_MINUTE = 6e10;
var NANOS_PER_HOUR = 36e11;
var NANOS_PER_DAY = 864e11;
var Duration = class _Duration {
  constructor(nanos) {
    this.nanos = nanos;
  }
  static nanoseconds(value) {
    return new _Duration(value);
  }
  static microseconds(value) {
    return new _Duration(value * NANOS_PER_MICRO);
  }
  static milliseconds(value) {
    return new _Duration(value * NANOS_PER_MILLI);
  }
  static seconds(value) {
    return new _Duration(value * NANOS_PER_SECOND);
  }
  static minutes(value) {
    return new _Duration(value * NANOS_PER_MINUTE);
  }
  static hours(value) {
    return new _Duration(value * NANOS_PER_HOUR);
  }
  static days(value) {
    return new _Duration(value * NANOS_PER_DAY);
  }
  static zero() {
    return new _Duration(0);
  }
  static infinite() {
    return new _Duration(Number.POSITIVE_INFINITY);
  }
  get inWholeNanoseconds() {
    return Math.floor(this.nanos);
  }
  get inWholeMicroseconds() {
    return Math.floor(this.nanos / NANOS_PER_MICRO);
  }
  get inWholeMilliseconds() {
    return Math.floor(this.nanos / NANOS_PER_MILLI);
  }
  get inWholeSeconds() {
    return Math.floor(this.nanos / NANOS_PER_SECOND);
  }
  get inWholeMinutes() {
    return Math.floor(this.nanos / NANOS_PER_MINUTE);
  }
  get inWholeHours() {
    return Math.floor(this.nanos / NANOS_PER_HOUR);
  }
  get inWholeDays() {
    return Math.floor(this.nanos / NANOS_PER_DAY);
  }
  toDouble(unit) {
    switch (unit) {
      case "ns" /* NANOSECONDS */:
        return this.nanos;
      case "us" /* MICROSECONDS */:
        return this.nanos / NANOS_PER_MICRO;
      case "ms" /* MILLISECONDS */:
        return this.nanos / NANOS_PER_MILLI;
      case "s" /* SECONDS */:
        return this.nanos / NANOS_PER_SECOND;
      case "m" /* MINUTES */:
        return this.nanos / NANOS_PER_MINUTE;
      case "h" /* HOURS */:
        return this.nanos / NANOS_PER_HOUR;
      case "d" /* DAYS */:
        return this.nanos / NANOS_PER_DAY;
    }
  }
  plus(other) {
    return new _Duration(this.nanos + other.nanos);
  }
  minus(other) {
    return new _Duration(this.nanos - other.nanos);
  }
  times(scale) {
    return new _Duration(this.nanos * scale);
  }
  div(scale) {
    return new _Duration(this.nanos / scale);
  }
  dividedBy(other) {
    return this.nanos / other.nanos;
  }
  unaryMinus() {
    return new _Duration(-this.nanos);
  }
  absoluteValue() {
    return new _Duration(Math.abs(this.nanos));
  }
  isNegative() {
    return this.nanos < 0;
  }
  isPositive() {
    return this.nanos > 0;
  }
  isInfinite() {
    return !isFinite(this.nanos);
  }
  isFinite() {
    return isFinite(this.nanos);
  }
  compareTo(other) {
    if (this.nanos < other.nanos) return -1;
    if (this.nanos > other.nanos) return 1;
    return 0;
  }
  equals(other) {
    return this.nanos === other.nanos;
  }
  toString(unit, decimals = 3) {
    if (this.isInfinite()) {
      return this.nanos > 0 ? "Infinity" : "-Infinity";
    }
    if (unit) {
      const value = this.toDouble(unit);
      return `${value.toFixed(decimals)}${unit}`;
    }
    const abs = Math.abs(this.nanos);
    const sign = this.nanos < 0 ? "-" : "";
    const components = [];
    const days2 = Math.floor(abs / NANOS_PER_DAY);
    const hours2 = Math.floor(abs % NANOS_PER_DAY / NANOS_PER_HOUR);
    const minutes2 = Math.floor(abs % NANOS_PER_HOUR / NANOS_PER_MINUTE);
    const seconds2 = Math.floor(abs % NANOS_PER_MINUTE / NANOS_PER_SECOND);
    const millis = Math.floor(abs % NANOS_PER_SECOND / NANOS_PER_MILLI);
    const micros = Math.floor(abs % NANOS_PER_MILLI / NANOS_PER_MICRO);
    const nanos = Math.floor(abs % NANOS_PER_MICRO);
    if (days2 > 0) components.push(`${days2}d`);
    if (hours2 > 0) components.push(`${hours2}h`);
    if (minutes2 > 0) components.push(`${minutes2}m`);
    if (seconds2 > 0 || components.length === 0 && abs >= NANOS_PER_SECOND) {
      if (millis > 0 || micros > 0 || nanos > 0) {
        const fractional = (millis * NANOS_PER_MILLI + micros * NANOS_PER_MICRO + nanos) / NANOS_PER_SECOND;
        components.push(`${(seconds2 + fractional).toFixed(3).replace(/\.?0+$/, "")}s`);
      } else {
        components.push(`${seconds2}s`);
      }
    } else if (millis > 0 || components.length === 0 && abs >= NANOS_PER_MILLI) {
      if (micros > 0 || nanos > 0) {
        const fractional = (micros * NANOS_PER_MICRO + nanos) / NANOS_PER_MILLI;
        components.push(`${(millis + fractional).toFixed(3).replace(/\.?0+$/, "")}ms`);
      } else {
        components.push(`${millis}ms`);
      }
    } else if (micros > 0 || components.length === 0 && abs >= NANOS_PER_MICRO) {
      if (nanos > 0) {
        const fractional = nanos / NANOS_PER_MICRO;
        components.push(`${(micros + fractional).toFixed(3).replace(/\.?0+$/, "")}us`);
      } else {
        components.push(`${micros}us`);
      }
    } else if (components.length === 0 || nanos > 0) {
      components.push(`${nanos}ns`);
    }
    const result = components.join(" ");
    if (sign && components.length > 1) {
      return `${sign}(${result})`;
    }
    return sign + result;
  }
  toIsoString() {
    if (this.isInfinite()) {
      throw new Error("Cannot convert infinite duration to ISO string");
    }
    const abs = Math.abs(this.nanos);
    const sign = this.nanos < 0 ? "-" : "";
    const hours2 = Math.floor(abs / NANOS_PER_HOUR);
    const minutes2 = Math.floor(abs % NANOS_PER_HOUR / NANOS_PER_MINUTE);
    const seconds2 = abs % NANOS_PER_MINUTE / NANOS_PER_SECOND;
    let result = "PT";
    if (hours2 > 0) result += `${hours2}H`;
    if (minutes2 > 0) result += `${minutes2}M`;
    if (seconds2 > 0 || hours2 === 0 && minutes2 === 0) {
      result += `${seconds2}S`;
    }
    return sign + result;
  }
  static parse(value) {
    const result = _Duration.parseOrNull(value);
    if (!result) {
      throw new Error(`Invalid duration format: ${value}`);
    }
    return result;
  }
  static parseOrNull(value) {
    const trimmed = value.trim();
    if (trimmed === "Infinity") return _Duration.infinite();
    if (trimmed === "-Infinity") return _Duration.infinite().unaryMinus();
    const isoResult = _Duration.parseIsoStringOrNull(trimmed);
    if (isoResult) return isoResult;
    return _Duration.parseDefaultFormatOrNull(trimmed);
  }
  static parseIsoString(value) {
    const result = _Duration.parseIsoStringOrNull(value);
    if (!result) {
      throw new Error(`Invalid ISO duration format: ${value}`);
    }
    return result;
  }
  static parseIsoStringOrNull(value) {
    const match = value.match(/^(-)?PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/);
    if (!match) return null;
    const [, sign, hours2, minutes2, seconds2] = match;
    const negative = sign === "-";
    let totalNanos = 0;
    if (hours2) totalNanos += parseFloat(hours2) * NANOS_PER_HOUR;
    if (minutes2) totalNanos += parseFloat(minutes2) * NANOS_PER_MINUTE;
    if (seconds2) totalNanos += parseFloat(seconds2) * NANOS_PER_SECOND;
    return new _Duration(negative ? -totalNanos : totalNanos);
  }
  static parseDefaultFormatOrNull(value) {
    const trimmed = value.trim();
    const isNegative = trimmed.startsWith("-");
    const withoutSign = isNegative ? trimmed.slice(1).trim() : trimmed;
    const withoutParens = withoutSign.startsWith("(") && withoutSign.endsWith(")") ? withoutSign.slice(1, -1).trim() : withoutSign;
    const singleUnitMatch = withoutParens.match(/^(\d+(?:\.\d+)?)(ns|us|ms|s|m|h|d)$/);
    if (singleUnitMatch) {
      const [, valueStr, unit] = singleUnitMatch;
      const numValue = parseFloat(valueStr);
      let duration;
      switch (unit) {
        case "ns":
          duration = _Duration.nanoseconds(numValue);
          break;
        case "us":
          duration = _Duration.microseconds(numValue);
          break;
        case "ms":
          duration = _Duration.milliseconds(numValue);
          break;
        case "s":
          duration = _Duration.seconds(numValue);
          break;
        case "m":
          duration = _Duration.minutes(numValue);
          break;
        case "h":
          duration = _Duration.hours(numValue);
          break;
        case "d":
          duration = _Duration.days(numValue);
          break;
        default:
          return null;
      }
      return isNegative ? duration.unaryMinus() : duration;
    }
    const componentRegex = /(\d+(?:\.\d+)?)(ns|us|ms|s|m|h|d)/g;
    const matches = [...withoutParens.matchAll(componentRegex)];
    if (matches.length === 0) return null;
    let totalNanos = 0;
    for (const match of matches) {
      const value2 = parseFloat(match[1]);
      const unit = match[2];
      switch (unit) {
        case "d":
          totalNanos += value2 * NANOS_PER_DAY;
          break;
        case "h":
          totalNanos += value2 * NANOS_PER_HOUR;
          break;
        case "m":
          totalNanos += value2 * NANOS_PER_MINUTE;
          break;
        case "s":
          totalNanos += value2 * NANOS_PER_SECOND;
          break;
        case "ms":
          totalNanos += value2 * NANOS_PER_MILLI;
          break;
        case "us":
          totalNanos += value2 * NANOS_PER_MICRO;
          break;
        case "ns":
          totalNanos += value2;
          break;
      }
    }
    return new _Duration(isNegative ? -totalNanos : totalNanos);
  }
  toComponents(action) {
    const abs = Math.abs(this.nanos);
    const sign = this.nanos < 0 ? -1 : 1;
    let days2 = Math.floor(abs / NANOS_PER_DAY) * sign;
    const hours2 = Math.floor(abs % NANOS_PER_DAY / NANOS_PER_HOUR);
    const minutes2 = Math.floor(abs % NANOS_PER_HOUR / NANOS_PER_MINUTE);
    const seconds2 = Math.floor(abs % NANOS_PER_MINUTE / NANOS_PER_SECOND);
    const nanoseconds2 = Math.floor(abs % NANOS_PER_SECOND);
    if (days2 === 0) days2 = 0;
    return action(days2, hours2, minutes2, seconds2, nanoseconds2);
  }
};
function nanoseconds(value) {
  return Duration.nanoseconds(value);
}
function microseconds(value) {
  return Duration.microseconds(value);
}
function milliseconds(value) {
  return Duration.milliseconds(value);
}
function seconds(value) {
  return Duration.seconds(value);
}
function minutes(value) {
  return Duration.minutes(value);
}
function hours(value) {
  return Duration.hours(value);
}
function days(value) {
  return Duration.days(value);
}

// src/collections/index.ts
function zip(array1, array2) {
  const length = Math.min(array1.length, array2.length);
  return Array.from({ length }, (_, i) => [array1[i], array2[i]]);
}
function unzip(array) {
  return array.reduce(
    ([first2, second], [a, b]) => {
      first2.push(a);
      second.push(b);
      return [first2, second];
    },
    [[], []]
  );
}
function associate(array, transform) {
  return new Map(array.map(transform));
}
function fold(array, initial, operation) {
  return array.reduce(operation, initial);
}
function reduce(array, operation) {
  if (array.length === 0) throw new Error("Array is empty");
  return array.reduce(operation);
}
function foldRight(array, initial, operation) {
  return array.reduceRight((acc, value) => operation(value, acc), initial);
}
function reduceRight(array, operation) {
  if (array.length === 0) throw new Error("Array is empty");
  return array.reduceRight((acc, value) => operation(value, acc));
}
function runningFold(array, initial, operation) {
  const result = [initial];
  array.reduce((acc, value) => {
    const next = operation(acc, value);
    result.push(next);
    return next;
  }, initial);
  return result;
}
function runningReduce(array, operation) {
  if (array.length === 0) return [];
  const result = [array[0]];
  array.slice(1).reduce((acc, value) => {
    const next = operation(acc, value);
    result.push(next);
    return next;
  }, array[0]);
  return result;
}
function first(array, predicate) {
  if (predicate) {
    const result = array.find(predicate);
    if (result === void 0) throw new Error("No element matching predicate");
    return result;
  }
  if (array.length === 0) throw new Error("Array is empty");
  return array[0];
}
function firstOrNull(array, predicate) {
  if (predicate) return array.find(predicate);
  return array[0];
}
function last(array, predicate) {
  if (predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return array[i];
    }
    throw new Error("No element matching predicate");
  }
  if (array.length === 0) throw new Error("Array is empty");
  return array[array.length - 1];
}
function lastOrNull(array, predicate) {
  if (predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return array[i];
    }
    return void 0;
  }
  return array[array.length - 1];
}
function single(array, predicate) {
  if (predicate) {
    const filtered = array.filter(predicate);
    if (filtered.length === 0) throw new Error("No element matching predicate");
    if (filtered.length > 1) throw new Error("More than one element matching predicate");
    return filtered[0];
  }
  if (array.length === 0) throw new Error("Array is empty");
  if (array.length > 1) throw new Error("Array has more than one element");
  return array[0];
}
function singleOrNull(array, predicate) {
  if (predicate) {
    const filtered = array.filter(predicate);
    return filtered.length === 1 ? filtered[0] : void 0;
  }
  return array.length === 1 ? array[0] : void 0;
}
function associateBy(array, keySelector, valueTransform) {
  const map = /* @__PURE__ */ new Map();
  for (const item of array) {
    const key = keySelector(item);
    const value = valueTransform ? valueTransform(item) : item;
    map.set(key, value);
  }
  return map;
}
function associateWith(array, valueSelector) {
  const map = /* @__PURE__ */ new Map();
  for (const item of array) {
    map.set(item, valueSelector(item));
  }
  return map;
}
function groupBy(array, keySelector, valueTransform) {
  const map = /* @__PURE__ */ new Map();
  for (const item of array) {
    const key = keySelector(item);
    const value = valueTransform ? valueTransform(item) : item;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(value);
  }
  return map;
}
function partition(array, predicate) {
  const matched = [];
  const notMatched = [];
  array.forEach((item) => {
    if (predicate(item)) {
      matched.push(item);
    } else {
      notMatched.push(item);
    }
  });
  return [matched, notMatched];
}
function chunked(array, size, stepOrTransform, partialWindows, transform) {
  if (typeof stepOrTransform === "function") {
    const chunks2 = [];
    for (let i = 0; i < array.length; i += size) {
      chunks2.push(array.slice(i, i + size));
    }
    return chunks2.map(stepOrTransform);
  }
  const step2 = stepOrTransform ?? size;
  const partial = partialWindows ?? (stepOrTransform === void 0 ? true : false);
  const chunks = [];
  for (let i = 0; i < array.length; i += step2) {
    const chunk = array.slice(i, i + size);
    if (partial || chunk.length === size) {
      chunks.push(chunk);
    }
  }
  return transform ? chunks.map(transform) : chunks;
}
function windowed(array, size, step2 = size, partialWindows = false, transform) {
  const windows = [];
  const limit = partialWindows ? array.length : array.length - size + 1;
  for (let i = 0; i < limit; i += step2) {
    const window = array.slice(i, i + size);
    if (partialWindows || window.length === size) {
      windows.push(window);
    }
  }
  return transform ? windows.map(transform) : windows;
}
function zipWithNext(array, transform) {
  const result = [];
  for (let i = 0; i < array.length - 1; i++) {
    const pair = [array[i], array[i + 1]];
    result.push(transform ? transform(pair[0], pair[1]) : pair);
  }
  return result;
}
function distinctBy(array, selector) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const item of array) {
    const key = selector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}
function union(array1, array2) {
  const result = /* @__PURE__ */ new Set();
  for (const item of array1) result.add(item);
  for (const item of array2) result.add(item);
  return Array.from(result);
}
function intersect(array1, array2) {
  const set1 = /* @__PURE__ */ new Set();
  const set2 = new Set(array2);
  const result = [];
  for (const item of array1) {
    if (set2.has(item) && !set1.has(item)) {
      set1.add(item);
      result.push(item);
    }
  }
  return result;
}
function subtract(array1, array2) {
  const set2 = new Set(array2);
  const result = [];
  for (const item of array1) {
    if (!set2.has(item)) {
      result.push(item);
    }
  }
  return result;
}
function sumOf(array, selector) {
  let sum2 = 0;
  for (const item of array) {
    sum2 += selector(item);
  }
  return sum2;
}
function maxBy(array, selector) {
  if (array.length === 0) return void 0;
  return array.reduce(
    (max2, item) => selector(item) > selector(max2) ? item : max2
  );
}
function minBy(array, selector) {
  if (array.length === 0) return void 0;
  return array.reduce(
    (min2, item) => selector(item) < selector(min2) ? item : min2
  );
}
function none(array, predicate) {
  return !array.some(predicate);
}
function take(array, count2) {
  return array.slice(0, Math.max(0, count2));
}
function takeLast(array, count2) {
  return count2 <= 0 ? [] : array.slice(-count2);
}
function takeWhile(array, predicate) {
  const index = array.findIndex((item) => !predicate(item));
  return index === -1 ? [...array] : array.slice(0, index);
}
function takeLastWhile(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i])) {
      return array.slice(i + 1);
    }
  }
  return [...array];
}
function drop(array, count2) {
  return array.slice(Math.max(0, count2));
}
function dropLast(array, count2) {
  return count2 <= 0 ? [...array] : array.slice(0, -count2);
}
function dropWhile(array, predicate) {
  const index = array.findIndex((item) => !predicate(item));
  return index === -1 ? [] : array.slice(index);
}
function dropLastWhile(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i])) {
      return array.slice(0, i + 1);
    }
  }
  return [];
}
function slice(array, indices) {
  if ("start" in indices && "endInclusive" in indices) {
    const { start, endInclusive, step: step2 = 1 } = indices;
    if (start < 0 || start >= array.length) {
      throw new RangeError(`Start index ${start} is out of bounds for array of length ${array.length}`);
    }
    if (endInclusive < 0 || endInclusive >= array.length) {
      throw new RangeError(`End index ${endInclusive} is out of bounds for array of length ${array.length}`);
    }
    const result2 = [];
    if (step2 > 0) {
      for (let i = start; i <= endInclusive; i += step2) {
        result2.push(array[i]);
      }
    } else if (step2 < 0) {
      for (let i = start; i >= endInclusive; i += step2) {
        result2.push(array[i]);
      }
    }
    return result2;
  }
  const result = [];
  for (const i of indices) {
    if (i < 0 || i >= array.length) {
      throw new RangeError(`Index ${i} is out of bounds for array of length ${array.length}`);
    }
    result.push(array[i]);
  }
  return result;
}
function distinct(array) {
  return Array.from(new Set(array));
}
function count(array, predicate) {
  return predicate ? array.filter(predicate).length : array.length;
}
function sum(array) {
  return array.reduce((acc, val) => acc + val, 0);
}
function average(array) {
  if (array.length === 0) throw new Error("Array is empty");
  return sum(array) / array.length;
}
function min(array) {
  if (array.length === 0) throw new Error("Array is empty");
  return Math.min(...array);
}
function max(array) {
  if (array.length === 0) throw new Error("Array is empty");
  return Math.max(...array);
}
function minOrNull(array) {
  return array.length === 0 ? null : Math.min(...array);
}
function maxOrNull(array) {
  return array.length === 0 ? null : Math.max(...array);
}
function all(array, predicate) {
  return array.every(predicate);
}
function any(array, predicate) {
  return predicate ? array.some(predicate) : array.length > 0;
}

// src/coroutines/index.ts
var CancellationError = class extends Error {
  constructor(message = "Coroutine was cancelled") {
    super(message);
    this.name = "CancellationError";
  }
};
var TimeoutError = class extends Error {
  constructor(message = "Coroutine timed out") {
    super(message);
    this.name = "TimeoutError";
  }
};
var Job = class {
  constructor() {
    this._cancelled = false;
    this._completed = false;
    this.children = [];
    this.cancelCallbacks = [];
    this.completionPromise = new Promise((resolve, reject) => {
      this.completionResolve = resolve;
      this.completionReject = reject;
    });
  }
  cancel(reason) {
    if (this._cancelled || this._completed) return;
    this._cancelled = true;
    this.children.forEach((child) => child.cancel(reason));
    this.cancelCallbacks.forEach((callback) => callback());
    this.completionReject(new CancellationError(reason));
    this.completionPromise.catch(() => {
    });
  }
  get isActive() {
    return !this._cancelled && !this._completed;
  }
  get isCancelled() {
    return this._cancelled;
  }
  get isCompleted() {
    return this._completed;
  }
  complete() {
    if (this._completed || this._cancelled) return;
    this._completed = true;
    this.completionResolve();
  }
  fail(error) {
    if (this._completed || this._cancelled) return;
    this._cancelled = true;
    this.children.forEach((child) => child.cancel());
    this.completionReject(error);
    this.completionPromise.catch(() => {
    });
  }
  async join() {
    try {
      await this.completionPromise;
    } catch (error) {
      if (!(error instanceof CancellationError)) throw error;
    }
  }
  addChild(child) {
    this.children.push(child);
  }
  onCancel(callback) {
    this.cancelCallbacks.push(callback);
  }
  ensureActive() {
    if (this._cancelled) {
      throw new CancellationError();
    }
  }
};
var Deferred = class extends Job {
  constructor() {
    super();
    this.valuePromise = new Promise((resolve, reject) => {
      this.valueResolve = resolve;
      this.valueReject = reject;
    });
  }
  completeWith(value) {
    this.valueResolve(value);
    this.complete();
  }
  completeExceptionally(error) {
    this.valueReject(error);
    this.fail(error);
  }
  async await() {
    return this.valuePromise;
  }
  getCompleted() {
    if (!this.isCompleted) return void 0;
    try {
      let result;
      this.valuePromise.then((value) => {
        result = value;
      });
      return result;
    } catch {
      return void 0;
    }
  }
};
var CoroutineScope = class {
  constructor() {
    this.job = new Job();
    this.childJobs = [];
  }
  get isActive() {
    return this.job.isActive;
  }
  cancel(reason) {
    this.job.cancel(reason);
  }
  launch(block) {
    const childJob = new Job();
    this.job.addChild(childJob);
    this.childJobs.push(childJob);
    try {
      Promise.resolve(block.call(childJob)).then(() => childJob.complete()).catch((error) => childJob.fail(error instanceof Error ? error : new Error(String(error))));
    } catch (error) {
      childJob.fail(error);
    }
    return childJob;
  }
  async(block) {
    const deferred = new Deferred();
    this.job.addChild(deferred);
    this.childJobs.push(deferred);
    Promise.resolve().then(() => Promise.resolve(block())).then((value) => deferred.completeWith(value)).catch((error) => deferred.completeExceptionally(error));
    return deferred;
  }
  async joinAll() {
    await Promise.all(this.childJobs.map((job) => job.join()));
  }
};
function launch(block) {
  const job = new Job();
  Promise.resolve().then(() => Promise.resolve(block.call(job))).then(() => job.complete()).catch((error) => job.fail(error));
  return job;
}
function asyncValue(block) {
  const deferred = new Deferred();
  Promise.resolve().then(() => Promise.resolve(block())).then((value) => deferred.completeWith(value)).catch((error) => deferred.completeExceptionally(error));
  return deferred;
}
function wrapAsync(promise) {
  const deferred = new Deferred();
  promise.then((value) => deferred.completeWith(value)).catch((error) => deferred.completeExceptionally(error));
  return deferred;
}
async function asyncFn(fn) {
  return (...args) => wrapAsync(fn(...args));
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function coroutineScope(block) {
  const scope = new CoroutineScope();
  try {
    const result = await Promise.resolve(block(scope));
    await scope.joinAll();
    return result;
  } catch (error) {
    scope.cancel();
    await scope.joinAll();
    throw error;
  }
}
async function supervisorScope(block) {
  const scope = new CoroutineScope();
  return Promise.resolve(block(scope));
}
async function withTimeout(timeoutMs, block) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    Promise.resolve(block()).then((result) => {
      clearTimeout(timer);
      resolve(result);
    }).catch((error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}
async function withTimeoutOrNull(timeoutMs, block) {
  try {
    return await withTimeout(timeoutMs, block);
  } catch (error) {
    if (error instanceof TimeoutError) return null;
    throw error;
  }
}
async function runBlocking(block) {
  return Promise.resolve(block());
}

// src/channels/index.ts
var UNLIMITED = -1;
var CONFLATED = -2;
var RENDEZVOUS = 0;
var Channel = class {
  constructor(capacity = RENDEZVOUS) {
    this.queue = [];
    this.receivers = [];
    this.senders = [];
    this._closed = false;
    this._cancelled = false;
    this.capacity = capacity;
  }
  async send(value) {
    if (this._closed || this._cancelled) {
      throw new Error("Channel is closed for send");
    }
    if (this.receivers.length > 0) {
      const receiver = this.receivers.shift();
      receiver(value);
      return;
    }
    if (this.capacity === UNLIMITED || this.queue.length < this.capacity) {
      this.queue.push(value);
      return;
    }
    if (this.capacity === CONFLATED) {
      this.queue = [value];
      return;
    }
    return new Promise((resolve) => {
      this.senders.push({ value, resolve });
    });
  }
  async receive() {
    if (this.queue.length > 0) {
      const value = this.queue.shift();
      if (this.senders.length > 0) {
        const { value: senderValue, resolve } = this.senders.shift();
        if (this.capacity === CONFLATED) {
          this.queue = [senderValue];
        } else {
          this.queue.push(senderValue);
        }
        resolve();
      }
      return value;
    }
    if (this._closed) {
      throw new Error("Channel is closed for receive");
    }
    if (this._cancelled) {
      throw new CancellationError("Channel was cancelled");
    }
    return new Promise((resolve, reject) => {
      this.receivers.push((value) => {
        if (value === CLOSED) {
          reject(new Error("Channel is closed for receive"));
        } else {
          resolve(value);
        }
      });
    });
  }
  async receiveCatching() {
    try {
      const value = await this.receive();
      return { value, isClosed: false };
    } catch (error) {
      return { isClosed: true };
    }
  }
  close() {
    if (this._closed) return;
    this._closed = true;
    this.receivers.forEach((r) => r(CLOSED));
    this.receivers = [];
  }
  cancel(_) {
    if (this._cancelled) return;
    this._cancelled = true;
    this._closed = true;
    this.receivers.forEach((r) => r(CLOSED));
    this.receivers = [];
    this.senders.forEach(({ resolve }) => resolve());
    this.senders = [];
  }
  get isClosedForSend() {
    return this._closed || this._cancelled;
  }
  get isClosedForReceive() {
    return (this._closed || this._cancelled) && this.queue.length === 0;
  }
  [Symbol.asyncIterator]() {
    return {
      next: async () => {
        if (this.isClosedForReceive) {
          return { done: true, value: void 0 };
        }
        try {
          const value = await this.receive();
          return { done: false, value };
        } catch {
          return { done: true, value: void 0 };
        }
      }
    };
  }
};
var CLOSED = Symbol("CLOSED");
var BroadcastChannel = class {
  constructor() {
    this.subscribers = [];
    this._closed = false;
  }
  async send(value) {
    if (this._closed) {
      throw new Error("BroadcastChannel is closed");
    }
    await Promise.all(this.subscribers.map((sub) => sub.send(value)));
  }
  openSubscription() {
    const channel = new Channel(UNLIMITED);
    this.subscribers.push(channel);
    return channel;
  }
  close() {
    if (this._closed) return;
    this._closed = true;
    this.subscribers.forEach((sub) => sub.close());
    this.subscribers = [];
  }
  cancel() {
    this.subscribers.forEach((sub) => sub.cancel());
    this.subscribers = [];
  }
};
function produce(block) {
  const channel = new Channel(UNLIMITED);
  Promise.resolve().then(() => block(channel)).then(() => channel.close()).catch((error) => {
    channel.cancel(error.message);
  });
  return channel;
}
async function consumeEach(channel, action) {
  for await (const value of channel) {
    await action(value);
  }
}
function ticker(delayMs, initialDelayMs = delayMs) {
  return produce(async (channel) => {
    let tick = 0;
    await new Promise((resolve) => setTimeout(resolve, initialDelayMs));
    await channel.send(tick++);
    const interval = setInterval(async () => {
      try {
        await channel.send(tick++);
      } catch (error) {
        clearInterval(interval);
      }
    }, delayMs);
  });
}

// src/flow/index.ts
var Flow = class _Flow {
  constructor(block) {
    this.block = block;
  }
  async collect(collector) {
    const flowCollector = typeof collector === "function" ? { emit: async (value) => {
      await collector(value);
    } } : collector;
    await this.block(flowCollector);
  }
  collectWithJob(job, collector) {
    return this.collect(async (value) => {
      job.ensureActive();
      await collector(value);
    });
  }
  map(transform) {
    return new _Flow(async (collector) => {
      await this.collect(async (value) => {
        await collector.emit(await transform(value));
      });
    });
  }
  filter(predicate) {
    return new _Flow(async (collector) => {
      await this.collect(async (value) => {
        if (await predicate(value)) {
          await collector.emit(value);
        }
      });
    });
  }
  take(count2) {
    return new _Flow(async (collector) => {
      let taken = 0;
      try {
        await this.collect(async (value) => {
          if (taken < count2) {
            await collector.emit(value);
            taken++;
            if (taken >= count2) {
              throw new CancellationError("FLOW_TAKE_COMPLETED");
            }
          }
        });
      } catch (error) {
        if (error instanceof CancellationError && error.message === "FLOW_TAKE_COMPLETED") {
          return;
        }
        throw error;
      }
    });
  }
  drop(count2) {
    return new _Flow(async (collector) => {
      let dropped = 0;
      await this.collect(async (value) => {
        if (dropped >= count2) {
          await collector.emit(value);
        } else {
          dropped++;
        }
      });
    });
  }
  onEach(action) {
    return new _Flow(async (collector) => {
      await this.collect(async (value) => {
        await action(value);
        await collector.emit(value);
      });
    });
  }
  onStart(action) {
    return new _Flow(async (collector) => {
      await action();
      await this.block(collector);
    });
  }
  onCompletion(action) {
    return new _Flow(async (collector) => {
      try {
        await this.block(collector);
      } finally {
        await action();
      }
    });
  }
  catch(handler) {
    return new _Flow(async (collector) => {
      try {
        await this.block(collector);
      } catch (error) {
        await handler(error);
      }
    });
  }
  debounce(timeoutMs) {
    return new _Flow(async (collector) => {
      let timer = null;
      let pending = null;
      let resolvePending = null;
      let rejectPending = null;
      let latestValue;
      const clearTimer = (error) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (pending) {
          const resolve = resolvePending;
          const reject = rejectPending;
          resolvePending = null;
          rejectPending = null;
          pending = null;
          if (error === void 0) {
            resolve?.();
          } else {
            reject?.(error);
          }
        }
      };
      const scheduleEmit = () => {
        clearTimer();
        pending = new Promise((resolve, reject) => {
          resolvePending = resolve;
          rejectPending = reject;
        });
        timer = setTimeout(async () => {
          const value = latestValue;
          const resolve = resolvePending;
          const reject = rejectPending;
          timer = null;
          pending = null;
          resolvePending = null;
          rejectPending = null;
          try {
            await collector.emit(value);
            resolve?.();
          } catch (error) {
            reject?.(error);
          }
        }, timeoutMs);
      };
      try {
        await this.collect(async (value) => {
          latestValue = value;
          scheduleEmit();
        });
      } catch (error) {
        clearTimer(error);
        throw error;
      }
      if (pending) {
        await pending;
      }
    });
  }
  distinctUntilChanged() {
    return new _Flow(async (collector) => {
      let lastValue;
      let hasLast = false;
      await this.collect(async (value) => {
        if (!hasLast || value !== lastValue) {
          await collector.emit(value);
          lastValue = value;
          hasLast = true;
        }
      });
    });
  }
  flatMapConcat(transform) {
    return new _Flow(async (collector) => {
      await this.collect(async (value) => {
        const innerFlow = transform(value);
        await innerFlow.collect(collector);
      });
    });
  }
  flatMapMerge(concurrency, transform) {
    return new _Flow(async (collector) => {
      const active = /* @__PURE__ */ new Set();
      await this.collect(async (value) => {
        const promise = transform(value).collect(collector);
        active.add(promise);
        promise.finally(() => active.delete(promise));
        if (active.size >= concurrency) {
          await Promise.race(active);
        }
      });
      await Promise.all(active);
    });
  }
  flatMapLatest(transform) {
    return new _Flow(async (collector) => {
      let currentJob;
      let currentTask = null;
      const launchLatest = (value) => {
        currentJob?.cancel();
        const job = new Job();
        currentJob = job;
        const task = transform(value).collectWithJob(job, async (v) => {
          job.ensureActive();
          await collector.emit(v);
        });
        currentTask = task.catch((error) => {
          if (error instanceof CancellationError) {
            return;
          }
          throw error;
        });
      };
      try {
        await this.collect(async (value) => {
          launchLatest(value);
        });
        if (currentTask) {
          await currentTask;
        }
      } catch (error) {
        const job = currentJob;
        if (job) {
          job.cancel();
          currentJob = void 0;
        }
        if (currentTask) {
          try {
            await currentTask;
          } catch (innerError) {
            if (!(innerError instanceof CancellationError)) {
              throw innerError;
            }
          }
        }
        throw error;
      }
    });
  }
  transform(transformer) {
    return new _Flow(async (collector) => {
      await this.collect(async (value) => {
        await transformer(value, (v) => collector.emit(v));
      });
    });
  }
  transformLatest(transformer) {
    return new _Flow(async (collector) => {
      let currentJob = null;
      await this.collect(async (value) => {
        currentJob?.cancel();
        currentJob = new Job();
        try {
          await transformer(value, async (v) => {
            currentJob.ensureActive();
            await collector.emit(v);
          });
        } catch (error) {
          if (!(error instanceof CancellationError)) throw error;
        }
      });
    });
  }
  throttle(durationMs) {
    return new _Flow(async (collector) => {
      let lastEmitTime = 0;
      await this.collect(async (value) => {
        const now = Date.now();
        if (now - lastEmitTime >= durationMs) {
          await collector.emit(value);
          lastEmitTime = now;
        }
      });
    });
  }
  sample(periodMs) {
    return new _Flow(async (collector) => {
      let lastValue;
      let hasValue = false;
      let interval;
      const emitLatest = async () => {
        if (hasValue && lastValue !== void 0) {
          await collector.emit(lastValue);
          hasValue = false;
        }
      };
      interval = setInterval(emitLatest, periodMs);
      try {
        await this.collect(async (value) => {
          lastValue = value;
          hasValue = true;
        });
        await emitLatest();
      } finally {
        if (interval) clearInterval(interval);
      }
    });
  }
  buffer(capacity = 64) {
    return new _Flow(async (collector) => {
      const buffer = [];
      let head = 0;
      const processBuffer = async () => {
        while (head < buffer.length) {
          const value = buffer[head];
          head++;
          await collector.emit(value);
        }
        buffer.length = 0;
        head = 0;
      };
      await this.collect(async (value) => {
        buffer.push(value);
        if (buffer.length - head >= capacity) {
          await processBuffer();
        }
      });
      await processBuffer();
    });
  }
  scan(initial, operation) {
    return new _Flow(async (collector) => {
      let accumulator = initial;
      await collector.emit(accumulator);
      await this.collect(async (value) => {
        accumulator = await operation(accumulator, value);
        await collector.emit(accumulator);
      });
    });
  }
  withIndex() {
    return new _Flow(async (collector) => {
      let index = 0;
      await this.collect(async (value) => {
        await collector.emit([index, value]);
        index++;
      });
    });
  }
  conflate() {
    return new _Flow(async (collector) => {
      let latestValue;
      let hasValue = false;
      let isCollecting = false;
      await this.collect(async (value) => {
        latestValue = value;
        hasValue = true;
        if (!isCollecting) {
          isCollecting = true;
          while (hasValue) {
            const valueToEmit = latestValue;
            hasValue = false;
            await collector.emit(valueToEmit);
          }
          isCollecting = false;
        }
      });
    });
  }
  distinctUntilChangedBy(keySelector) {
    return new _Flow(async (collector) => {
      let lastKey;
      let hasLast = false;
      await this.collect(async (value) => {
        const key = keySelector(value);
        if (!hasLast || key !== lastKey) {
          await collector.emit(value);
          lastKey = key;
          hasLast = true;
        }
      });
    });
  }
  retry(retries = 3) {
    return new _Flow(async (collector) => {
      let attempts = 0;
      while (true) {
        try {
          await this.collect(async (value) => {
            await collector.emit(value);
          });
          return;
        } catch (error) {
          if (error instanceof CancellationError) {
            throw error;
          }
          if (attempts++ >= retries) {
            throw error;
          }
        }
      }
    });
  }
  retryWhen(predicate) {
    return new _Flow(async (collector) => {
      let attempt = 0;
      while (true) {
        try {
          await this.collect(async (value) => {
            await collector.emit(value);
          });
          return;
        } catch (error) {
          if (error instanceof CancellationError) {
            throw error;
          }
          const shouldRetry = await predicate(error, attempt++);
          if (!shouldRetry) {
            throw error;
          }
        }
      }
    });
  }
  onEmpty(action) {
    return new _Flow(async (collector) => {
      let emitted = false;
      await this.collect(async (value) => {
        emitted = true;
        await collector.emit(value);
      });
      if (!emitted) {
        await action();
      }
    });
  }
  defaultIfEmpty(defaultValue) {
    return new _Flow(async (collector) => {
      let emitted = false;
      await this.collect(async (value) => {
        emitted = true;
        await collector.emit(value);
      });
      if (!emitted) {
        await collector.emit(defaultValue);
      }
    });
  }
  async toList() {
    const result = [];
    await this.collect((value) => {
      result.push(value);
    });
    return result;
  }
  async toArray() {
    return this.toList();
  }
  async toSet() {
    const result = /* @__PURE__ */ new Set();
    await this.collect((value) => {
      result.add(value);
    });
    return result;
  }
  async first() {
    let result;
    let found = false;
    await this.take(1).collect((value) => {
      result = value;
      found = true;
    });
    if (!found) throw new Error("Flow is empty");
    return result;
  }
  async firstOrNull() {
    try {
      return await this.first();
    } catch {
      return null;
    }
  }
  async last() {
    let result;
    let found = false;
    await this.collect((value) => {
      result = value;
      found = true;
    });
    if (!found) throw new Error("Flow is empty");
    return result;
  }
  async lastOrNull() {
    try {
      return await this.last();
    } catch {
      return null;
    }
  }
  async single() {
    let result;
    let count2 = 0;
    await this.collect((value) => {
      result = value;
      count2++;
    });
    if (count2 === 0) throw new Error("Flow is empty");
    if (count2 > 1) throw new Error("Flow has more than one element");
    return result;
  }
  async singleOrNull() {
    try {
      return await this.single();
    } catch {
      return null;
    }
  }
  async reduce(operation) {
    let accumulator;
    let first2 = true;
    await this.collect(async (value) => {
      if (first2) {
        accumulator = value;
        first2 = false;
      } else {
        accumulator = await operation(accumulator, value);
      }
    });
    if (first2) throw new Error("Flow is empty");
    return accumulator;
  }
  async fold(initial, operation) {
    let accumulator = initial;
    await this.collect(async (value) => {
      accumulator = await operation(accumulator, value);
    });
    return accumulator;
  }
  async count() {
    let count2 = 0;
    await this.collect(() => {
      count2++;
    });
    return count2;
  }
  async any(predicate) {
    const stop = Symbol("FLOW_ANY_STOP");
    if (!predicate) {
      try {
        await this.collect(async () => {
          throw stop;
        });
        return false;
      } catch (error) {
        if (error === stop) {
          return true;
        }
        throw error;
      }
    }
    let result = false;
    try {
      await this.collect(async (value) => {
        if (await predicate(value)) {
          result = true;
          throw stop;
        }
      });
    } catch (error) {
      if (error !== stop) {
        throw error;
      }
    }
    return result;
  }
  async all(predicate) {
    const stop = Symbol("FLOW_ALL_STOP");
    let result = true;
    try {
      await this.collect(async (value) => {
        if (!await predicate(value)) {
          result = false;
          throw stop;
        }
      });
    } catch (error) {
      if (error !== stop) {
        throw error;
      }
    }
    return result;
  }
  async none(predicate) {
    return !await this.any(predicate);
  }
  shareIn(config) {
    const sharedFlow = new MutableSharedFlow(config);
    (async () => {
      try {
        await this.collect(async (value) => {
          await sharedFlow.emit(value);
        });
      } catch (error) {
        if (!(error instanceof CancellationError)) {
          sharedFlow.cancelAll();
        }
        throw error;
      }
    })().catch((error) => {
      if (error instanceof CancellationError) {
        return;
      }
      sharedFlow.cancelAll();
    });
    return sharedFlow;
  }
  stateIn(initialValue) {
    const stateFlow = new MutableStateFlow(initialValue);
    (async () => {
      try {
        await this.collect(async (value) => {
          await stateFlow.emit(value);
        });
      } catch (error) {
        if (!(error instanceof CancellationError)) {
          stateFlow.cancelAll();
        }
        throw error;
      }
    })().catch((error) => {
      if (error instanceof CancellationError) {
        return;
      }
      stateFlow.cancelAll();
    });
    return stateFlow;
  }
};
function flow(block) {
  return new Flow(async (collector) => {
    if (block.length > 0) {
      const emitter = block;
      await emitter(async (value) => {
        await collector.emit(value);
      });
      return;
    }
    const generatorFactory = block;
    for await (const value of generatorFactory()) {
      await collector.emit(value);
    }
  });
}
function flowOf(...values) {
  return new Flow(async (collector) => {
    for (const value of values) {
      await collector.emit(value);
    }
  });
}
var StateFlow = class extends Flow {
  constructor(initialValue) {
    super(async (collector) => {
      const abortController = new AbortController();
      try {
        await collector.emit(this._value);
        this.collectors.set(collector, abortController);
        return new Promise((_, reject) => {
          abortController.signal.addEventListener("abort", () => {
            this.collectors.delete(collector);
            reject(new CancellationError());
          });
        });
      } catch (error) {
        this.collectors.delete(collector);
        throw error;
      }
    });
    this.collectors = /* @__PURE__ */ new Map();
    this._value = initialValue;
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.collectors.forEach((abortController, collector) => {
        collector.emit(newValue).catch(() => {
          abortController.abort();
        });
      });
    }
  }
  async emit(value) {
    this.value = value;
  }
  get subscriptionCount() {
    return this.collectors.size;
  }
  cancelAll() {
    this.collectors.forEach((abortController) => abortController.abort());
    this.collectors.clear();
  }
};
var MutableStateFlow = class extends StateFlow {
  constructor(initialValue) {
    super(initialValue);
  }
  update(transform) {
    this.value = transform(this.value);
  }
  compareAndSet(expect, update) {
    if (this.value === expect) {
      this.value = update;
      return true;
    }
    return false;
  }
};
var SharedFlow = class extends Flow {
  constructor(config = {}) {
    super(async (collector) => {
      const abortController = new AbortController();
      try {
        for (const value of this._replayCache) {
          await collector.emit(value);
        }
        this.collectors.set(collector, abortController);
        return new Promise((_, reject) => {
          abortController.signal.addEventListener("abort", () => {
            this.collectors.delete(collector);
            reject(new CancellationError());
          });
        });
      } catch (error) {
        this.collectors.delete(collector);
        throw error;
      }
    });
    this.collectors = /* @__PURE__ */ new Map();
    this._replayCache = [];
    this.replay = config.replay ?? 0;
    this.onBufferOverflow = config.onBufferOverflow ?? "SUSPEND";
  }
  async emit(value) {
    if (this.replay > 0) {
      this._replayCache.push(value);
      if (this._replayCache.length > this.replay) {
        if (this.onBufferOverflow === "DROP_LATEST") {
          this._replayCache.pop();
        } else {
          this._replayCache.shift();
        }
      }
    }
    await Promise.all(
      Array.from(this.collectors.entries()).map(
        ([collector, abortController]) => collector.emit(value).catch(() => abortController.abort())
      )
    );
  }
  get subscriptionCount() {
    return this.collectors.size;
  }
  get replayCache() {
    return this._replayCache;
  }
  resetReplayCache() {
    this._replayCache = [];
  }
  cancelAll() {
    this.collectors.forEach((abortController) => abortController.abort());
    this.collectors.clear();
  }
};
var MutableSharedFlow = class extends SharedFlow {
  constructor(config = {}) {
    super(config);
  }
  tryEmit(value) {
    this.emit(value).catch(() => {
    });
    return true;
  }
};
function zip2(flow1, flow2, transform) {
  return new Flow(async (collector) => {
    const queue1 = [];
    const queue2 = [];
    const tryEmit = async () => {
      while (queue1.length > 0 && queue2.length > 0) {
        await collector.emit(transform(queue1.shift(), queue2.shift()));
      }
    };
    await Promise.all([
      flow1.collect(async (v) => {
        queue1.push(v);
        await tryEmit();
      }),
      flow2.collect(async (v) => {
        queue2.push(v);
        await tryEmit();
      })
    ]);
  });
}

// src/extensions/index.ts
function extend(constructor, extensions) {
  Object.entries(extensions).forEach(([name, fn]) => {
    Object.defineProperty(constructor.prototype, name, {
      value: fn,
      writable: true,
      configurable: true,
      enumerable: false
    });
  });
}
function extendType(prototype, extensions) {
  Object.entries(extensions).forEach(([name, fn]) => {
    Object.defineProperty(prototype, name, {
      value: fn,
      writable: true,
      configurable: true,
      enumerable: false
    });
  });
}

// src/monads/index.ts
var Option = class {
  map(fn) {
    return this.isSome ? Some(fn(this.get())) : None();
  }
  flatMap(fn) {
    return this.isSome ? fn(this.get()) : None();
  }
  filter(predicate) {
    return this.isSome && predicate(this.get()) ? this : None();
  }
  filterNot(predicate) {
    return this.filter((v) => !predicate(v));
  }
  fold(ifNone, ifSome) {
    return this.isSome ? ifSome(this.get()) : ifNone();
  }
  orElse(alternative) {
    return this.isSome ? this : alternative();
  }
  contains(value) {
    return this.isSome && this.get() === value;
  }
  exists(predicate) {
    return this.isSome && predicate(this.get());
  }
  forEach(fn) {
    if (this.isSome) fn(this.get());
  }
  toArray() {
    return this.isSome ? [this.get()] : [];
  }
  toEither(left) {
    return this.isSome ? Right(this.get()) : Left(left);
  }
  zip(other) {
    return this.isSome && other.isSome ? Some([this.get(), other.get()]) : None();
  }
  let(fn) {
    return this.map(fn);
  }
  also(fn) {
    if (this.isSome) fn(this.get());
    return this;
  }
  apply(fn) {
    if (this.isSome) fn(this.get());
    return this;
  }
  takeIf(predicate) {
    return this.filter(predicate);
  }
  takeUnless(predicate) {
    return this.filterNot(predicate);
  }
};
var SomeImpl = class extends Option {
  constructor(value) {
    super();
    this.value = value;
    this.isSome = true;
    this.isNone = false;
  }
  get() {
    return this.value;
  }
  getOrNull() {
    return this.value;
  }
  getOrElse(_defaultValue) {
    return this.value;
  }
  getOrThrow(_error) {
    return this.value;
  }
};
var NoneImpl = class extends Option {
  constructor() {
    super(...arguments);
    this.isSome = false;
    this.isNone = true;
  }
  get() {
    throw new Error("Cannot get value from None");
  }
  getOrNull() {
    return null;
  }
  getOrElse(defaultValue) {
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  }
  getOrThrow(error) {
    throw error ?? new Error("No value present");
  }
};
var NONE = new NoneImpl();
function Some(value) {
  return new SomeImpl(value);
}
function None() {
  return NONE;
}
function fromNullable(value) {
  return value != null ? Some(value) : None();
}
var Either = class {
  map(fn) {
    return this.isRight ? Right(fn(this.getRight())) : this;
  }
  mapLeft(fn) {
    return this.isLeft ? Left(fn(this.getLeft())) : this;
  }
  flatMap(fn) {
    return this.isRight ? fn(this.getRight()) : this;
  }
  fold(ifLeft, ifRight) {
    return this.isLeft ? ifLeft(this.getLeft()) : ifRight(this.getRight());
  }
  swap() {
    return this.isLeft ? Right(this.getLeft()) : Left(this.getRight());
  }
  filterOrElse(predicate, leftValue) {
    return this.isRight && !predicate(this.getRight()) ? Left(leftValue()) : this;
  }
  orElse(alternative) {
    return this.isRight ? this : alternative();
  }
  contains(value) {
    return this.isRight && this.getRight() === value;
  }
  exists(predicate) {
    return this.isRight && predicate(this.getRight());
  }
  toOption() {
    return this.isRight ? Some(this.getRight()) : None();
  }
  let(fn) {
    return this.map(fn);
  }
  also(fn) {
    if (this.isRight) fn(this.getRight());
    return this;
  }
  apply(fn) {
    if (this.isRight) fn(this.getRight());
    return this;
  }
  takeIf(predicate, leftValue) {
    return this.filterOrElse(predicate, leftValue);
  }
};
var LeftImpl = class extends Either {
  constructor(value) {
    super();
    this.value = value;
    this.isLeft = true;
    this.isRight = false;
  }
  getLeft() {
    return this.value;
  }
  getRight() {
    throw new Error("Cannot get right value from Left");
  }
  getOrNull() {
    return null;
  }
  getOrElse(defaultValue) {
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  }
};
var RightImpl = class extends Either {
  constructor(value) {
    super();
    this.value = value;
    this.isLeft = false;
    this.isRight = true;
  }
  getLeft() {
    throw new Error("Cannot get left value from Right");
  }
  getRight() {
    return this.value;
  }
  getOrNull() {
    return this.value;
  }
  getOrElse(_defaultValue) {
    return this.value;
  }
};
function Left(value) {
  return new LeftImpl(value);
}
function Right(value) {
  return new RightImpl(value);
}
var Result = class {
  map(fn) {
    return this.isSuccess ? Success(fn(this.get())) : this;
  }
  mapError(fn) {
    return this.isFailure ? Failure(fn(this.getError())) : this;
  }
  flatMap(fn) {
    return this.isSuccess ? fn(this.get()) : this;
  }
  fold(onFailure, onSuccess) {
    return this.isSuccess ? onSuccess(this.get()) : onFailure(this.getError());
  }
  recover(fn) {
    return this.isFailure ? Success(fn(this.getError())) : this;
  }
  recoverWith(fn) {
    return this.isFailure ? fn(this.getError()) : this;
  }
  onSuccess(fn) {
    if (this.isSuccess) fn(this.get());
    return this;
  }
  onFailure(fn) {
    if (this.isFailure) fn(this.getError());
    return this;
  }
  toEither() {
    return this.isSuccess ? Right(this.get()) : Left(this.getError());
  }
  toOption() {
    return this.isSuccess ? Some(this.get()) : None();
  }
  let(fn) {
    return this.map(fn);
  }
  also(fn) {
    return this.onSuccess(fn);
  }
  apply(fn) {
    return this.onSuccess(fn);
  }
};
var SuccessImpl = class extends Result {
  constructor(value) {
    super();
    this.value = value;
    this.isSuccess = true;
    this.isFailure = false;
  }
  get() {
    return this.value;
  }
  getOrNull() {
    return this.value;
  }
  getOrElse(_defaultValue) {
    return this.value;
  }
  getOrThrow() {
    return this.value;
  }
  getError() {
    throw new Error("Cannot get error from Success");
  }
  getErrorOrNull() {
    return null;
  }
};
var FailureImpl = class extends Result {
  constructor(error) {
    super();
    this.error = error;
    this.isFailure = true;
    this.isSuccess = false;
  }
  get() {
    throw this.error instanceof Error ? this.error : new Error(String(this.error));
  }
  getOrNull() {
    return null;
  }
  getOrElse(defaultValue) {
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  }
  getOrThrow() {
    throw this.error instanceof Error ? this.error : new Error(String(this.error));
  }
  getError() {
    return this.error;
  }
  getErrorOrNull() {
    return this.error;
  }
};
function Success(value) {
  return new SuccessImpl(value);
}
function Failure(error) {
  return new FailureImpl(error);
}
function tryCatch(fn, onError) {
  try {
    return Success(fn());
  } catch (error) {
    return Failure(onError ? onError(error) : error);
  }
}
async function tryCatchAsync(fn, onError) {
  try {
    return Success(await Promise.resolve(fn()));
  } catch (error) {
    return Failure(onError ? onError(error) : error);
  }
}
function sequence(options) {
  const results = [];
  for (const option of options) {
    if (option.isNone) return None();
    results.push(option.get());
  }
  return Some(results);
}
function traverse(array, fn) {
  return sequence(array.map(fn));
}
var NonEmptyList = class _NonEmptyList extends Array {
  constructor(head, ...tail) {
    super(head, ...tail);
    Object.setPrototypeOf(this, _NonEmptyList.prototype);
  }
  static of(head, ...tail) {
    return new _NonEmptyList(head, ...tail);
  }
  static fromArray(array) {
    return array.length > 0 ? new _NonEmptyList(array[0], ...array.slice(1)) : null;
  }
  get head() {
    return this[0];
  }
  get tail() {
    return this.slice(1);
  }
};
function zipOrAccumulate(...eithers) {
  const errors = [];
  const values = [];
  for (const either of eithers) {
    if (either.isLeft) {
      errors.push(either.getLeft());
    } else {
      values.push(either.getRight());
    }
  }
  if (errors.length > 0) {
    return Left(NonEmptyList.of(errors[0], ...errors.slice(1)));
  }
  return Right(values);
}
function mapOrAccumulate(items, fn) {
  const results = [];
  const errors = [];
  items.forEach((item) => {
    const result = fn(item);
    if (result.isRight) {
      results.push(result.getRight());
    } else {
      errors.push(result.getLeft());
    }
  });
  return errors.length > 0 ? Left(NonEmptyList.of(errors[0], ...errors.slice(1))) : Right(results);
}
Flow.prototype.mapNotNull = function(fn) {
  return this.map(fn).filter((v) => v != null);
};
Flow.prototype.filterNotNull = function() {
  return this.filter((v) => v != null);
};
Flow.prototype.mapToOption = function(fn) {
  return this.transform(async (value, emit) => {
    const option = fn(value);
    if (option.isSome) {
      await emit(option.get());
    }
  });
};
Flow.prototype.mapToResult = function(fn) {
  return this.transform(async (value, emit) => {
    const result = fn(value);
    if (result.isSuccess) {
      await emit(result.get());
    }
  });
};
Flow.prototype.mapToEither = function(fn) {
  return this.transform(async (value, emit) => {
    const either = fn(value);
    if (either.isRight) {
      await emit(either.getRight());
    }
  });
};

// src/sequences/index.ts
var Sequence = class _Sequence {
  constructor(iterator) {
    this.iterator = iterator;
  }
  static of(...elements) {
    return new _Sequence(() => elements[Symbol.iterator]());
  }
  static from(iterable) {
    return new _Sequence(() => iterable[Symbol.iterator]());
  }
  static generate(seedFunction) {
    return new _Sequence(function* () {
      while (true) {
        yield seedFunction();
      }
    });
  }
  static generateSequence(seed, nextFunction) {
    return new _Sequence(function* () {
      let current = seed;
      while (current != null) {
        yield current;
        current = nextFunction(current);
      }
    });
  }
  [Symbol.iterator]() {
    return this.iterator();
  }
  map(transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield transform(item);
      }
    });
  }
  mapIndexed(transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let index = 0;
      for (const item of { [Symbol.iterator]: source }) {
        yield transform(index++, item);
      }
    });
  }
  mapNotNull(transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        const result = transform(item);
        if (result != null) {
          yield result;
        }
      }
    });
  }
  filter(predicate) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (predicate(item)) {
          yield item;
        }
      }
    });
  }
  filterIndexed(predicate) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let index = 0;
      for (const item of { [Symbol.iterator]: source }) {
        if (predicate(index++, item)) {
          yield item;
        }
      }
    });
  }
  filterNot(predicate) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (!predicate(item)) {
          yield item;
        }
      }
    });
  }
  flatMap(transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield* transform(item);
      }
    });
  }
  flatten() {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        yield* item;
      }
    });
  }
  take(count2) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let taken = 0;
      const iterator = source();
      while (taken < count2) {
        const next = iterator.next();
        if (next.done) break;
        yield next.value;
        taken++;
      }
    });
  }
  takeWhile(predicate) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        if (!predicate(item)) break;
        yield item;
      }
    });
  }
  drop(count2) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let dropped = 0;
      for (const item of { [Symbol.iterator]: source }) {
        if (dropped < count2) {
          dropped++;
          continue;
        }
        yield item;
      }
    });
  }
  dropWhile(predicate) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let dropping = true;
      for (const item of { [Symbol.iterator]: source }) {
        if (dropping && predicate(item)) continue;
        dropping = false;
        yield item;
      }
    });
  }
  distinct() {
    const source = this.iterator;
    return new _Sequence(function* () {
      const seen = /* @__PURE__ */ new Set();
      for (const item of { [Symbol.iterator]: source }) {
        if (!seen.has(item)) {
          seen.add(item);
          yield item;
        }
      }
    });
  }
  distinctBy(selector) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const seen = /* @__PURE__ */ new Set();
      for (const item of { [Symbol.iterator]: source }) {
        const key = selector(item);
        if (!seen.has(key)) {
          seen.add(key);
          yield item;
        }
      }
    });
  }
  sortedBy(selector) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const items = Array.from({ [Symbol.iterator]: source });
      items.sort((a, b) => {
        const aKey = selector(a);
        const bKey = selector(b);
        return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
      });
      yield* items;
    });
  }
  sorted(compareFn) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const items = Array.from({ [Symbol.iterator]: source });
      items.sort(compareFn || ((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }));
      yield* items;
    });
  }
  chunked(size, transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let chunk = [];
      for (const item of { [Symbol.iterator]: source }) {
        chunk.push(item);
        if (chunk.length === size) {
          yield transform ? transform(chunk) : chunk;
          chunk = [];
        }
      }
      if (chunk.length > 0) {
        yield transform ? transform(chunk) : chunk;
      }
    });
  }
  windowed(size, step2 = 1, partialWindows = false, transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const buffer = [];
      const iter = source();
      for (const item of { [Symbol.iterator]: () => iter }) {
        buffer.push(item);
        if (buffer.length === size) {
          yield transform ? transform([...buffer]) : [...buffer];
          buffer.splice(0, step2);
        }
      }
      if (partialWindows && buffer.length > 0) {
        yield transform ? transform(buffer) : buffer;
      }
    });
  }
  zipWithNext(transform) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const iter = source();
      let result = iter.next();
      if (result.done) return;
      let prev = result.value;
      result = iter.next();
      while (!result.done) {
        yield transform ? transform(prev, result.value) : [prev, result.value];
        prev = result.value;
        result = iter.next();
      }
    });
  }
  zip(other) {
    const source = this.iterator;
    return new _Sequence(function* () {
      const iter1 = source();
      const iter2 = other[Symbol.iterator]();
      while (true) {
        const result1 = iter1.next();
        const result2 = iter2.next();
        if (result1.done || result2.done) break;
        yield [result1.value, result2.value];
      }
    });
  }
  onEach(action) {
    const source = this.iterator;
    return new _Sequence(function* () {
      for (const item of { [Symbol.iterator]: source }) {
        action(item);
        yield item;
      }
    });
  }
  forEach(action) {
    for (const item of this) {
      action(item);
    }
  }
  toArray() {
    return Array.from(this);
  }
  toSet() {
    return new Set(this);
  }
  toMap() {
    return new Map(this);
  }
  first() {
    const result = this.iterator().next();
    if (result.done) {
      throw new Error("Sequence is empty");
    }
    return result.value;
  }
  firstOrNull() {
    const result = this.iterator().next();
    return result.done ? null : result.value;
  }
  last() {
    let lastValue;
    let hasValue = false;
    for (const item of this) {
      lastValue = item;
      hasValue = true;
    }
    if (!hasValue) {
      throw new Error("Sequence is empty");
    }
    return lastValue;
  }
  lastOrNull() {
    let lastValue = null;
    for (const item of this) {
      lastValue = item;
    }
    return lastValue;
  }
  single(predicate) {
    let result;
    let count2 = 0;
    for (const item of this) {
      if (!predicate || predicate(item)) {
        if (count2 > 0) {
          throw new Error("Sequence contains more than one matching element");
        }
        result = item;
        count2++;
      }
    }
    if (count2 === 0) {
      throw new Error("Sequence contains no matching element");
    }
    return result;
  }
  singleOrNull(predicate) {
    let result = null;
    let count2 = 0;
    for (const item of this) {
      if (!predicate || predicate(item)) {
        if (count2 > 0) {
          return null;
        }
        result = item;
        count2++;
      }
    }
    return count2 === 1 ? result : null;
  }
  find(predicate) {
    for (const item of this) {
      if (predicate(item)) {
        return item;
      }
    }
    return void 0;
  }
  any(predicate) {
    if (!predicate) {
      return !this.iterator().next().done;
    }
    for (const item of this) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }
  all(predicate) {
    for (const item of this) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }
  none(predicate) {
    return !this.any(predicate);
  }
  count(predicate) {
    if (!predicate) {
      let count3 = 0;
      for (const _ of this) {
        count3++;
      }
      return count3;
    }
    let count2 = 0;
    for (const item of this) {
      if (predicate(item)) {
        count2++;
      }
    }
    return count2;
  }
  reduce(operation, initial) {
    const iterator = this[Symbol.iterator]();
    if (initial === void 0) {
      const first2 = iterator.next();
      if (first2.done) {
        throw new Error("Sequence is empty");
      }
      let accumulator2 = first2.value;
      for (const item of { [Symbol.iterator]: () => iterator }) {
        accumulator2 = operation(accumulator2, item);
      }
      return accumulator2;
    }
    let accumulator = initial;
    for (const item of this) {
      accumulator = operation(accumulator, item);
    }
    return accumulator;
  }
  fold(initial, operation) {
    return this.reduce(operation, initial);
  }
  runningFold(initial, operation) {
    const source = this.iterator;
    return new _Sequence(function* () {
      let accumulator = initial;
      yield accumulator;
      for (const item of { [Symbol.iterator]: source }) {
        accumulator = operation(accumulator, item);
        yield accumulator;
      }
    });
  }
  scan(initial, operation) {
    return this.runningFold(initial, operation);
  }
  sum() {
    return this.reduce((acc, value) => acc + value, 0);
  }
  sumBy(selector) {
    return this.reduce((acc, value) => acc + selector(value), 0);
  }
  sumOf(selector) {
    return this.sumBy(selector);
  }
  average() {
    let sum2 = 0;
    let count2 = 0;
    for (const item of this) {
      sum2 += item;
      count2++;
    }
    if (count2 === 0) {
      throw new Error("Cannot calculate average of empty sequence");
    }
    return sum2 / count2;
  }
  averageBy(selector) {
    return this.map(selector).average();
  }
  maxBy(selector) {
    const iter = this.iterator();
    const first2 = iter.next();
    if (first2.done) {
      throw new Error("Sequence is empty");
    }
    let maxItem = first2.value;
    let maxKey = selector(maxItem);
    for (const item of { [Symbol.iterator]: () => iter }) {
      const key = selector(item);
      if (key > maxKey) {
        maxKey = key;
        maxItem = item;
      }
    }
    return maxItem;
  }
  minBy(selector) {
    const iter = this.iterator();
    const first2 = iter.next();
    if (first2.done) {
      throw new Error("Sequence is empty");
    }
    let minItem = first2.value;
    let minKey = selector(minItem);
    for (const item of { [Symbol.iterator]: () => iter }) {
      const key = selector(item);
      if (key < minKey) {
        minKey = key;
        minItem = item;
      }
    }
    return minItem;
  }
  groupBy(keySelector) {
    const groups = /* @__PURE__ */ new Map();
    for (const item of this) {
      const key = keySelector(item);
      const group = groups.get(key);
      if (group) {
        group.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return groups;
  }
  partition(predicate) {
    const matches = [];
    const nonMatches = [];
    for (const item of this) {
      if (predicate(item)) {
        matches.push(item);
      } else {
        nonMatches.push(item);
      }
    }
    return [matches, nonMatches];
  }
  joinToString(separator = ", ", prefix = "", postfix = "", limit = -1, truncated = "...", transform) {
    let result = prefix;
    let count2 = 0;
    for (const item of this) {
      if (limit >= 0 && count2 >= limit) {
        result += truncated;
        break;
      }
      if (count2 > 0) {
        result += separator;
      }
      result += transform ? transform(item) : String(item);
      count2++;
    }
    result += postfix;
    return result;
  }
  associateBy(keySelector) {
    const map = /* @__PURE__ */ new Map();
    for (const item of this) {
      map.set(keySelector(item), item);
    }
    return map;
  }
  associateWith(valueSelector) {
    const map = /* @__PURE__ */ new Map();
    for (const item of this) {
      map.set(item, valueSelector(item));
    }
    return map;
  }
  associate(transform) {
    const map = /* @__PURE__ */ new Map();
    for (const item of this) {
      const [key, value] = transform(item);
      map.set(key, value);
    }
    return map;
  }
};
function sequenceOf(...elements) {
  return Sequence.of(...elements);
}
function asSequence(iterable) {
  return Sequence.from(iterable);
}
function generateSequence(seed, nextFunction) {
  return Sequence.generateSequence(seed, nextFunction);
}

// src/utils/index.ts
function repeat2(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}
async function repeatAsync(times, action) {
  for (let i = 0; i < times; i++) {
    await action(i);
  }
}
export {
  BroadcastChannel,
  CONFLATED,
  CancellationError,
  Channel,
  CoroutineScope,
  Deferred,
  Duration,
  DurationUnit,
  Either,
  Failure,
  Flow,
  IntRange,
  Job,
  Left,
  NonEmptyList,
  None,
  Option,
  RENDEZVOUS,
  Result,
  Right,
  Sequence,
  Some,
  Success,
  TimeoutError,
  UNLIMITED,
  all,
  also,
  alsoOrNull,
  any,
  apply,
  applyOrNull,
  asScope,
  asSequence,
  associate,
  associateBy,
  associateWith,
  asyncValue as async,
  asyncFn,
  asyncValue,
  average,
  chunked,
  consumeEach,
  coroutineScope,
  count,
  days,
  delay,
  distinct,
  distinctBy,
  downTo,
  drop,
  dropLast,
  dropLastWhile,
  dropWhile,
  extend,
  extendType,
  first,
  firstOrNull,
  flow,
  flowOf,
  fold,
  foldRight,
  fromNullable,
  generateSequence,
  groupBy,
  hours,
  intersect,
  isNullOrBlank,
  isNullOrEmpty,
  last,
  lastOrNull,
  launch,
  letValue as let,
  letOrNull,
  letValue,
  mapOrAccumulate,
  max,
  maxBy,
  maxOrNull,
  microseconds,
  milliseconds,
  min,
  minBy,
  minOrNull,
  minutes,
  nanoseconds,
  none,
  orEmpty,
  partition,
  produce,
  rangeTo,
  reduce,
  reduceRight,
  repeat2 as repeat,
  repeatAsync,
  repeat as repeatString,
  run,
  runBlocking,
  runOrNull,
  runningFold,
  runningReduce,
  seconds,
  sequence,
  sequenceOf,
  single,
  singleOrNull,
  slice,
  step,
  subtract,
  sum,
  sumOf,
  supervisorScope,
  take,
  takeIf,
  takeLast,
  takeLastWhile,
  takeUnless,
  takeWhile,
  ticker,
  traverse,
  tryCatch,
  tryCatchAsync,
  union,
  until,
  unzip,
  windowed,
  withValue as with,
  withTimeout,
  withTimeoutOrNull,
  withValue,
  wrapAsync,
  zip as zipArrays,
  zip2 as zipFlows,
  zipOrAccumulate,
  zipWithNext
};
//# sourceMappingURL=index.mjs.map