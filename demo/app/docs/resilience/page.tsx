import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";

export default function ResiliencePage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Resilience</h1>
      <p className="text-xl text-gray-300 mb-12">
        Retry and repeat operations with sophisticated scheduling policies
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection title="Overview">
          <p className="text-gray-300 leading-relaxed mb-4">
            The resilience module provides powerful tools for retrying failed operations and repeating
            successful ones with configurable scheduling policies. Inspired by Arrow-kt's resilience
            patterns, it enables you to build robust applications that gracefully handle transient failures.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Key features include exponential backoff, fibonacci delays, and composable scheduling policies.
          </p>
        </DocsSection>

        <DocsSection title="Basic Retry" description="Retry failed operations with exponential backoff">
          <CodeBlock
            code={`import { Schedule, retry } from 'kotlinify-ts'

// Retry up to 5 times with exponential backoff
const schedule = Schedule.exponential(100, 2).and(Schedule.recurs(5))

const data = await retry(schedule, async () => {
  const response = await fetch('/api/data')
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
})`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Schedule Policies" description="Different scheduling strategies">
          <CodeBlock
            code={`import { Schedule } from 'kotlinify-ts'

// Exponential backoff: 100ms, 200ms, 400ms, 800ms...
const exponential = Schedule.exponential(100, 2)

// Fibonacci delays: 100ms, 100ms, 200ms, 300ms, 500ms...
const fibonacci = Schedule.fibonacci(100)

// Fixed spacing: 1000ms between each attempt
const spaced = Schedule.spaced(1000)

// Linear increase: 100ms, 200ms, 300ms, 400ms...
const linear = Schedule.linear(100)

// Limit attempts: maximum 10 retries
const limited = Schedule.recurs(10)`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Combining Schedules" description="Compose policies with combinators">
          <CodeBlock
            code={`import { Schedule } from 'kotlinify-ts'

// Exponential backoff AND max 5 retries (stops when either condition met)
const policy1 = Schedule.exponential(100).and(Schedule.recurs(5))

// Exponential backoff OR max duration (stops when either condition met)
const policy2 = Schedule.exponential(100).or(Schedule.spaced(10000))

// Try exponential first, THEN switch to fixed spacing
const policy3 = Schedule.exponential(100, 2)
  .and(Schedule.recurs(3))
  .andThen(Schedule.spaced(5000))

// Add random jitter to prevent thundering herd
const withJitter = Schedule.exponential(100).jittered(0.2)

// Keep left schedule's output, ignore right's output
const keepLeft = Schedule.exponential(100)
  .zipLeft(Schedule.recurs(5))

// Keep right schedule's output, ignore left's output
const keepRight = Schedule.recurs(5)
  .zipRight(Schedule.spaced(1000))`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Repeat Operations" description="Repeat successful operations">
          <CodeBlock
            code={`import { Schedule, repeat } from 'kotlinify-ts'

// Poll an API every 5 seconds until a condition is met
await Schedule.doUntil<Status>(
  (status) => status === 'completed'
).repeat(async () => {
  const response = await fetch('/api/status')
  return response.json()
})

// Repeat 10 times with delays
let count = 0
await Schedule.spaced(1000)
  .and(Schedule.recurs(10))
  .repeat(async () => {
    console.log(\`Iteration \${++count}\`)
  })`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Conditional Policies" description="Continue while or until conditions are met">
          <CodeBlock
            code={`import { Schedule } from 'kotlinify-ts'

// Continue while result meets condition
Schedule.doWhile<string>(
  (result) => result.length <= 100
)

// Continue until result meets condition
Schedule.doUntil<number>(
  (result) => result >= 1000
)`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Real-World Example" description="Network request with retry logic">
          <CodeBlock
            code={`import { Schedule, retry } from 'kotlinify-ts'

async function fetchWithRetry<T>(url: string): Promise<T> {
  const schedule = Schedule.exponential(1000, 2)
    .and(Schedule.recurs(3))
    .jittered(0.1)

  return retry(schedule, async () => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`)
    }

    return response.json()
  })
}

// Usage
try {
  const data = await fetchWithRetry('/api/users')
  console.log('Success:', data)
} catch (error) {
  console.error('Failed after retries:', error)
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Advanced Schedule Types" description="Special-purpose schedules for complex scenarios">
          <CodeBlock
            code={`import { Schedule } from 'kotlinify-ts'

// identity - passes input through as state
const passThrough = Schedule.identity<string>()
  .and(Schedule.recurs(3))
  .retry(() => fetchData())

// collect - accumulates all inputs into an array
const collector = Schedule.collect<Error>()
  .zipLeft(Schedule.recurs(5))
  .retry(() => riskyOperation())
// Collects all errors encountered during retries

// forever - runs indefinitely
const poll = Schedule.forever()
  .and(Schedule.spaced(5000))
  .repeat(() => checkStatus())
// Polls every 5 seconds forever

// map - transform the schedule's output
const mapped = Schedule.recurs(5)
  .map(count => count * 100)
  .repeat(() => processItem())`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Synchronous Operations" description="Retry sync functions without async overhead">
          <CodeBlock
            code={`import { Schedule, retrySync, repeatSync } from 'kotlinify-ts'

// Retry synchronous operations
const result = retrySync(
  Schedule.recurs(3),
  () => {
    if (Math.random() < 0.5) throw new Error('Random failure')
    return 'success'
  }
)

// Repeat synchronous operations
let counter = 0
repeatSync(Schedule.recurs(5), () => {
  counter++
  return counter
})`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/validation"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Validation →
            </Link>
            <Link
              href="/docs/utils"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Utils →
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
