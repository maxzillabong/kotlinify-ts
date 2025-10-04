"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function DurationPage() {
  const introductionExample = `import { Duration, seconds, minutes, hours } from 'kotlinify-ts/duration';

// Two ways to create durations
const timeout = Duration.seconds(30);
const delay = seconds(5);
const meetingLength = minutes(45);

// Chaining operations
const videoLength = hours(2).plus(minutes(35));
const apiTimeout = seconds(30);
const frameTime = milliseconds(16.67);`;

  const constructionExample = `import { Duration, seconds, minutes, hours, days, milliseconds, microseconds, nanoseconds } from 'kotlinify-ts/duration';

// Static factory methods
const boot = Duration.milliseconds(250);
const cache = Duration.minutes(5);
const session = Duration.hours(24);
const trial = Duration.days(30);

// Standalone functions
const animation = milliseconds(300);
const poll = seconds(10);
const lunch = minutes(60);
const workday = hours(8);

// Special values
const instant = Duration.zero();
const forever = Duration.infinite();

// Fractional durations
const quick = milliseconds(100);
const standard = seconds(30);
const meeting = hours(1.5);
const sprint = days(14);`;

  const arithmeticExample = `import { Duration, seconds, minutes, hours } from 'kotlinify-ts/duration';

const start = minutes(10);
const extra = seconds(45);

// Addition and subtraction
const total = start.plus(extra);              // 10m 45s
const remaining = start.minus(seconds(120));   // 8m

// Scaling
const doubled = start.times(2);                // 20m
const half = start.div(2);                     // 5m

// Division between durations (ratio)
const ratio = hours(3).dividedBy(minutes(30)); // 6

// Negation and absolute value
const negative = start.unaryMinus();           // -10m
const positive = negative.absoluteValue();     // 10m

// Chaining operations
const complex = minutes(5)
  .plus(seconds(30))
  .times(2)
  .minus(minutes(3));                          // 8m`;

  const conversionExample = `import { Duration, DurationUnit } from 'kotlinify-ts/duration';

const duration = Duration.minutes(2.5);

// Whole units (truncated)
duration.inWholeSeconds;      // 150
duration.inWholeMilliseconds; // 150000
duration.inWholeMinutes;      // 2
duration.inWholeHours;        // 0

// Precise conversion with toDouble
duration.toDouble(DurationUnit.SECONDS);  // 150
duration.toDouble(DurationUnit.MINUTES);  // 2.5
duration.toDouble(DurationUnit.HOURS);    // 0.041666...

// Converting between different granularities
const precise = Duration.milliseconds(1234567);
precise.inWholeSeconds;       // 1234
precise.inWholeMinutes;       // 20
precise.toDouble(DurationUnit.SECONDS); // 1234.567
precise.toDouble(DurationUnit.MINUTES); // 20.576116...`;

  const comparisonExample = `import { Duration, seconds, minutes } from 'kotlinify-ts/duration';

const short = seconds(30);
const medium = minutes(1);
const long = minutes(5);

// Comparison
short.compareTo(medium);  // -1 (less than)
medium.compareTo(short);  // 1 (greater than)
medium.compareTo(minutes(1)); // 0 (equal)

// Equality
medium.equals(seconds(60)); // true
short.equals(medium); // false

// Predicates
const negative = seconds(-10);
negative.isNegative(); // true
negative.isPositive(); // false

const infinite = Duration.infinite();
infinite.isInfinite(); // true
infinite.isFinite();   // false

// Sorting durations
const durations = [minutes(5), seconds(30), hours(1), minutes(2)];
durations.sort((a, b) => a.compareTo(b));
// [30s, 2m, 5m, 1h]`;

  const formattingExample = `import { Duration, DurationUnit } from 'kotlinify-ts/duration';

// Default multi-component format
Duration.hours(2).plus(Duration.minutes(35)).toString();
// "2h 35m"

Duration.seconds(90.5).toString();
// "1m 30.5s"

Duration.milliseconds(1234).toString();
// "1.234s"

// Format with specific unit and decimals
const duration = Duration.seconds(125.456);
duration.toString(DurationUnit.SECONDS, 2);  // "125.46s"
duration.toString(DurationUnit.MINUTES, 1);  // "2.1m"
duration.toString(DurationUnit.HOURS, 3);    // "0.035h"

// Negative durations
Duration.minutes(-5).toString();             // "-5m"
Duration.hours(-2).plus(Duration.minutes(-30)).toString();
// "-(2h 30m)"

// ISO 8601 format
Duration.hours(2).plus(Duration.minutes(30)).toIsoString();
// "PT2H30M"

Duration.seconds(45.5).toIsoString();
// "PT45.5S"`;

  const parsingExample = `import { Duration } from 'kotlinify-ts/duration';

// Parse various formats
const d1 = Duration.parse("30s");           // 30 seconds
const d2 = Duration.parse("5m 30s");        // 5 minutes 30 seconds
const d3 = Duration.parse("2h 15m 45s");    // 2 hours 15 minutes 45 seconds
const d4 = Duration.parse("1.5h");          // 1.5 hours
const d5 = Duration.parse("-(1h 30m)");     // negative 1 hour 30 minutes

// Parse ISO 8601 format
const iso1 = Duration.parseIsoString("PT2H30M");     // 2 hours 30 minutes
const iso2 = Duration.parseIsoString("PT45.5S");     // 45.5 seconds
const iso3 = Duration.parseIsoString("-PT1H15M30S"); // negative duration

// Safe parsing with null fallback
const maybe = Duration.parseOrNull("invalid");       // null
const valid = Duration.parseOrNull("30s");          // Duration of 30s

const maybeIso = Duration.parseIsoStringOrNull("PT1X"); // null
const validIso = Duration.parseIsoStringOrNull("PT1H"); // Duration of 1h

// Special values
const inf = Duration.parse("Infinity");              // infinite duration
const negInf = Duration.parse("-Infinity");          // negative infinite`;

  const componentDecompositionExample = `import { Duration, hours, minutes, seconds } from 'kotlinify-ts/duration';

const duration = hours(2).plus(minutes(35)).plus(seconds(45));

// Decompose into components
duration.toComponents((days, hours, minutes, seconds, nanoseconds) => {
  console.log(\`\${days}d \${hours}h \${minutes}m \${seconds}s\`);
  // "0d 2h 35m 45s"
  return { days, hours, minutes, seconds };
});

// Format for display
const formatted = duration.toComponents((d, h, m, s) => {
  const parts = [];
  if (d > 0) parts.push(\`\${d} day\${d !== 1 ? 's' : ''}\`);
  if (h > 0) parts.push(\`\${h} hour\${h !== 1 ? 's' : ''}\`);
  if (m > 0) parts.push(\`\${m} minute\${m !== 1 ? 's' : ''}\`);
  if (s > 0) parts.push(\`\${s} second\${s !== 1 ? 's' : ''}\`);
  return parts.join(', ');
});
// "2 hours, 35 minutes, 45 seconds"

// Calculate total seconds from components
const totalSeconds = duration.toComponents((d, h, m, s) =>
  d * 86400 + h * 3600 + m * 60 + s
);
// 9345`;

  const realWorldExample = `import { Duration, seconds, minutes, milliseconds } from 'kotlinify-ts/duration';

// API retry with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let delay = milliseconds(100);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      console.log(\`Retry in \${delay.toString()}\`);
      await new Promise(resolve =>
        setTimeout(resolve, delay.inWholeMilliseconds)
      );

      delay = delay.times(2); // Exponential backoff
    }
  }
  throw new Error('Should not reach here');
}

// Video playback utilities
class VideoPlayer {
  private position = Duration.zero();
  private duration: Duration;

  constructor(durationSeconds: number) {
    this.duration = seconds(durationSeconds);
  }

  seek(to: Duration) {
    if (to.isNegative()) {
      this.position = Duration.zero();
    } else if (to.compareTo(this.duration) > 0) {
      this.position = this.duration;
    } else {
      this.position = to;
    }
  }

  skip(amount: Duration) {
    this.seek(this.position.plus(amount));
  }

  get remaining(): Duration {
    return this.duration.minus(this.position);
  }

  get progress(): number {
    return this.position.dividedBy(this.duration);
  }

  formatPosition(): string {
    return \`\${this.position.toString()} / \${this.duration.toString()}\`;
  }
}

// Cache with TTL
class TimedCache<T> {
  private entries = new Map<string, { value: T; expires: number }>();

  set(key: string, value: T, ttl: Duration) {
    const expires = Date.now() + ttl.inWholeMilliseconds;
    this.entries.set(key, { value, expires });
  }

  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expires) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value;
  }
}

// Rate limiting
class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests: number,
    private window: Duration
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - this.window.inWholeMilliseconds;

    this.requests = this.requests.filter(time => time > windowStart);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  timeUntilNextRequest(): Duration {
    if (this.requests.length < this.maxRequests) {
      return Duration.zero();
    }

    const oldestRequest = Math.min(...this.requests);
    const availableAt = oldestRequest + this.window.inWholeMilliseconds;
    const waitMs = Math.max(0, availableAt - Date.now());

    return milliseconds(waitMs);
  }
}

// Usage
const limiter = new RateLimiter(10, minutes(1));
if (!limiter.canMakeRequest()) {
  const wait = limiter.timeUntilNextRequest();
  console.log(\`Rate limited. Try again in \${wait.toString()}\`);
}`;

  const performanceTimingExample = `import { Duration, milliseconds } from 'kotlinify-ts/duration';

// Performance timing utility
class Timer {
  private startTime = performance.now();

  elapsed(): Duration {
    return milliseconds(performance.now() - this.startTime);
  }

  reset() {
    this.startTime = performance.now();
  }

  measure<T>(operation: () => T): [T, Duration] {
    const start = performance.now();
    const result = operation();
    const elapsed = milliseconds(performance.now() - start);
    return [result, elapsed];
  }
}

// Benchmark function performance
function benchmark(
  name: string,
  fn: () => void,
  iterations = 1000
): Duration {
  const timer = new Timer();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const total = timer.elapsed();
  const average = total.div(iterations);

  console.log(\`\${name}:\`);
  console.log(\`  Total: \${total.toString()}\`);
  console.log(\`  Average: \${average.toString(DurationUnit.MICROSECONDS, 2)}\`);

  return average;
}

// Animation timing
class Animation {
  private elapsed = Duration.zero();

  constructor(
    private duration: Duration,
    private easing: (t: number) => number = t => t
  ) {}

  update(deltaTime: Duration): boolean {
    this.elapsed = this.elapsed.plus(deltaTime);
    return !this.isComplete();
  }

  get progress(): number {
    const raw = Math.min(1, this.elapsed.dividedBy(this.duration));
    return this.easing(raw);
  }

  isComplete(): boolean {
    return this.elapsed.compareTo(this.duration) >= 0;
  }

  reset() {
    this.elapsed = Duration.zero();
  }
}

// Timeout manager
class TimeoutManager {
  private timeouts = new Map<string, {
    duration: Duration;
    callback: () => void;
    handle?: NodeJS.Timeout;
  }>();

  set(id: string, duration: Duration, callback: () => void) {
    this.clear(id);

    const handle = setTimeout(() => {
      callback();
      this.timeouts.delete(id);
    }, duration.inWholeMilliseconds);

    this.timeouts.set(id, { duration, callback, handle });
  }

  clear(id: string) {
    const timeout = this.timeouts.get(id);
    if (timeout?.handle) {
      clearTimeout(timeout.handle);
      this.timeouts.delete(id);
    }
  }

  clearAll() {
    for (const [id] of this.timeouts) {
      this.clear(id);
    }
  }
}`;

  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Duration</h1>
      <p className="text-xl text-gray-300 mb-12">
        Kotlin-inspired time duration utilities for elegant time handling in TypeScript
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="Why Duration?"
          description="JavaScript's time handling is fragmented - milliseconds for setTimeout, seconds for performance metrics, various formats for display. Duration unifies time handling with a type-safe, expressive API that eliminates unit conversion bugs and makes time calculations readable."
        >
          <CodeBlock code={introductionExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Creating Durations"
          description="Multiple ways to construct durations - choose the syntax that best fits your code style"
        >
          <CodeBlock code={constructionExample} language="typescript" />

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Try it yourself:</h4>
          <CodeBlock
            code={`// Create durations from numbers
const fiveSeconds = Duration.seconds(5);
const twoMinutes = Duration.minutes(2);
const oneHour = Duration.hours(1);

console.log('5 seconds:', fiveSeconds.toString());
console.log('2 minutes:', twoMinutes.toString());
console.log('1 hour:', oneHour.toString());

// Arithmetic operations
const total = fiveSeconds.plus(twoMinutes).plus(oneHour);
console.log('Total:', total.toString());
console.log('In seconds:', total.inWholeSeconds);
console.log('In minutes:', total.inWholeMinutes);`}
            language="typescript"
            executable={true}
          />
        </DocsSection>

        <DocsSection
          title="Arithmetic Operations"
          description="Perform calculations on durations with intuitive operators"
        >
          <CodeBlock code={arithmeticExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Unit Conversions"
          description="Convert between time units with precision control"
        >
          <CodeBlock code={conversionExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Comparison and Sorting"
          description="Compare durations and check their properties"
        >
          <CodeBlock code={comparisonExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Formatting"
          description="Display durations in human-readable or standard formats"
        >
          <CodeBlock code={formattingExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Parsing"
          description="Parse duration strings from various formats"
        >
          <CodeBlock code={parsingExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Component Decomposition"
          description="Break down durations into their constituent parts"
        >
          <CodeBlock code={componentDecompositionExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Real-World Examples"
          description="Practical applications of Duration in production code"
        >
          <CodeBlock code={realWorldExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Performance and Timing"
          description="Advanced patterns for benchmarking, animation, and timeout management"
        >
          <CodeBlock code={performanceTimingExample} language="typescript" />
        </DocsSection>

        <DocsSection title="API Summary">
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="text-white font-semibold mb-2">Construction</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>Duration.seconds(n)</code>, <code>Duration.minutes(n)</code>, <code>Duration.hours(n)</code>, <code>Duration.days(n)</code> - static methods</li>
                <li><code>Duration.milliseconds(n)</code>, <code>Duration.microseconds(n)</code>, <code>Duration.nanoseconds(n)</code> - static methods</li>
                <li><code>seconds(n)</code>, <code>minutes(n)</code>, <code>hours(n)</code>, <code>days(n)</code> - standalone functions</li>
                <li><code>Duration.zero()</code>, <code>Duration.infinite()</code> - special values</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Conversion</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>inWholeSeconds</code>, <code>inWholeMinutes</code>, <code>inWholeHours</code>, <code>inWholeDays</code> - truncated values</li>
                <li><code>toDouble(unit)</code> - precise conversion to any unit</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Arithmetic</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>plus(other)</code>, <code>minus(other)</code> - add/subtract durations</li>
                <li><code>times(scale)</code>, <code>div(scale)</code> - scale durations</li>
                <li><code>dividedBy(other)</code> - ratio between durations</li>
                <li><code>unaryMinus()</code>, <code>absoluteValue()</code> - sign operations</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Comparison</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>compareTo(other)</code> - compare durations (-1, 0, 1)</li>
                <li><code>equals(other)</code> - check equality</li>
                <li><code>isNegative()</code>, <code>isPositive()</code>, <code>isInfinite()</code>, <code>isFinite()</code> - predicates</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Formatting & Parsing</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>toString()</code> - multi-component format</li>
                <li><code>toString(unit, decimals)</code> - single unit format</li>
                <li><code>toIsoString()</code> - ISO 8601 format</li>
                <li><code>Duration.parse(string)</code> - parse duration string</li>
                <li><code>Duration.parseIsoString(string)</code> - parse ISO format</li>
                <li><code>parseOrNull()</code>, <code>parseIsoStringOrNull()</code> - safe parsing</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Components</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>toComponents(action)</code> - decompose into days, hours, minutes, seconds, nanoseconds</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/coroutines"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Explore Coroutines →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Docs
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}