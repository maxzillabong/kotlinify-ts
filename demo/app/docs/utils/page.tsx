import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";

export default function UtilsPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Utils</h1>
      <p className="text-xl text-gray-300 mb-12">
        Essential Kotlin-style utility functions for everyday TypeScript development
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection title="Overview">
          <p className="text-gray-300 leading-relaxed">
            The utils module provides common Kotlin standard library functions adapted for TypeScript.
            These utilities help with control flow, validation, error handling, lazy initialization,
            and functional programming patterns.
          </p>
        </DocsSection>

        <DocsSection title="Control Flow" description="Repeat operations and loop control">
          <CodeBlock
            code={`import { repeat, repeatAsync } from 'kotlinify-ts'

// Execute action n times (sync)
repeat(5, (index) => {
  console.log(\`Iteration \${index}\`)
})
// Prints: Iteration 0, 1, 2, 3, 4

// Execute async action n times
await repeatAsync(3, async (index) => {
  await someAsyncOperation(index)
})`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Runtime Validation" description="Require and check with type narrowing">
          <CodeBlock
            code={`import { require, check, requireNotNull, checkNotNull } from 'kotlinify-ts'

function processAge(age: number) {
  // Throws if condition is false
  require(age >= 0, 'Age must be non-negative')
  require(age < 150, () => \`Age \${age} is unrealistic\`)

  // TypeScript knows age is valid here
  return age * 365
}

function processUser(user: User | null) {
  // Returns non-null or throws
  const validUser = requireNotNull(user, 'User is required')

  // TypeScript knows validUser is User (not null)
  return validUser.name
}

// check is similar to require
function validateConfig(config: Config) {
  check(config.port > 0, 'Port must be positive')
  check(config.timeout > 0, 'Timeout must be positive')
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Error Handling" description="Catch exceptions safely">
          <CodeBlock
            code={`import { runCatching, runCatchingAsync, TODO } from 'kotlinify-ts'

// Catch exceptions and return result object
const result = runCatching(() => {
  return riskyOperation()
})

if (result.success) {
  console.log('Value:', result.value)
} else {
  console.error('Error:', result.error)
}

// Async version
const asyncResult = await runCatchingAsync(async () => {
  return await fetchData()
})

// Mark unimplemented code
function futureFeature() {
  TODO('Implement this feature')
  // Throws: Error: Not implemented: Implement this feature
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Lazy Initialization" description="Compute values only when needed">
          <CodeBlock
            code={`import { lazy } from 'kotlinify-ts'

// Create lazy value (computed on first access)
const expensiveConfig = lazy(() => {
  console.log('Computing config...')
  return loadConfigFromFile()
})

// Not computed yet
console.log('Before access')

// Computed now (prints "Computing config...")
const config1 = expensiveConfig()

// Uses cached value (doesn't print again)
const config2 = expensiveConfig()

console.log(config1 === config2) // true`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Performance Measurement" description="Measure execution time">
          <CodeBlock
            code={`import { measure, measureSync } from 'kotlinify-ts'

// Measure async function
const { value, duration } = await measure(async () => {
  await heavyComputation()
  return 'result'
})

console.log(\`Completed in \${duration}ms\`)
console.log(\`Result: \${value}\`)

// Measure sync function
const result = measureSync(() => {
  let sum = 0
  for (let i = 0; i < 1000000; i++) {
    sum += i
  }
  return sum
})

console.log(\`Sum: \${result.value}, Time: \${result.duration}ms\`)`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Functional Utilities" description="Common functional programming helpers">
          <CodeBlock
            code={`import { identity, constant, noop } from 'kotlinify-ts'

// Identity function (returns input)
const numbers = [1, 2, 3].map(identity) // [1, 2, 3]

// Constant function (always returns same value)
const getDefault = constant(42)
getDefault() // 42
getDefault() // 42

// No-op function (does nothing)
const cleanup = shouldCleanup ? doCleanup : noop
cleanup() // Safe to call`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Assertions" description="Development-time checks">
          <CodeBlock
            code={`import { assert, assertNotNull, error } from 'kotlinify-ts'

function processData(data: unknown[]) {
  // Development assertion
  assert(data.length > 0, 'Data should not be empty')

  const first = data[0]
  const value = assertNotNull(first, 'First element should exist')

  // TypeScript knows value is non-null here
  return value
}

function handleInvalidState(state: string): never {
  switch (state) {
    case 'valid':
      return processValid()
    case 'pending':
      return processPending()
    default:
      // Throw error with message
      error(\`Invalid state: \${state}\`)
  }
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Real-World Examples">
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Configuration Loading</h4>
              <CodeBlock
                code={`import { lazy, requireNotNull } from 'kotlinify-ts'

const getConfig = lazy(() => {
  const env = process.env.NODE_ENV
  requireNotNull(env, 'NODE_ENV must be set')

  return {
    apiUrl: requireNotNull(
      process.env.API_URL,
      'API_URL must be configured'
    ),
    timeout: parseInt(process.env.TIMEOUT || '5000'),
    env
  }
})

// Config loaded only when first accessed
const config = getConfig()`}
                language="typescript"
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Input Validation</h4>
              <CodeBlock
                code={`import { require, requireNotNull } from 'kotlinify-ts'

function createUser(data: {
  name?: string
  email?: string
  age?: number
}) {
  const name = requireNotNull(data.name, 'Name is required')
  const email = requireNotNull(data.email, 'Email is required')
  const age = requireNotNull(data.age, 'Age is required')

  require(name.length >= 2, 'Name must be at least 2 characters')
  require(email.includes('@'), 'Email must be valid')
  require(age >= 18, 'Must be 18 or older')

  return { name, email, age }
}`}
                language="typescript"
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Safe Computation</h4>
              <CodeBlock
                code={`import { runCatching, measure } from 'kotlinify-ts'

async function processWithMetrics(data: unknown[]) {
  const result = await measure(async () => {
    return await runCatchingAsync(async () => {
      return await heavyProcessing(data)
    })
  })

  if (!result.value.success) {
    console.error(\`Processing failed in \${result.duration}ms\`)
    console.error('Error:', result.value.error)
    return null
  }

  console.log(\`Processed in \${result.duration}ms\`)
  return result.value.value
}`}
                language="typescript"
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Retry Logic with Utils</h4>
              <CodeBlock
                code={`import { repeat, runCatchingAsync } from 'kotlinify-ts'

async function retryOperation(maxAttempts: number) {
  let lastError: Error | undefined

  await repeat(maxAttempts, async (attempt) => {
    const result = await runCatchingAsync(async () => {
      return await unstableOperation()
    })

    if (result.success) {
      console.log('Success on attempt', attempt + 1)
      return result.value
    }

    lastError = result.error
    console.log(\`Attempt \${attempt + 1} failed\`)
  })

  if (lastError) {
    throw lastError
  }
}`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="API Reference">
          <div className="space-y-4 text-gray-300">
            <div>
              <code className="text-slate-500">repeat(times, action)</code>
              <p className="ml-4">Execute action n times synchronously</p>
            </div>
            <div>
              <code className="text-slate-500">repeatAsync(times, action)</code>
              <p className="ml-4">Execute async action n times</p>
            </div>
            <div>
              <code className="text-slate-500">require(condition, message?)</code>
              <p className="ml-4">Throw if condition is false (type narrowing)</p>
            </div>
            <div>
              <code className="text-slate-500">check(condition, message?)</code>
              <p className="ml-4">Runtime check assertion</p>
            </div>
            <div>
              <code className="text-slate-500">requireNotNull(value, message?)</code>
              <p className="ml-4">Return non-null value or throw (type narrowing)</p>
            </div>
            <div>
              <code className="text-slate-500">checkNotNull(value, message?)</code>
              <p className="ml-4">Check non-null or throw</p>
            </div>
            <div>
              <code className="text-slate-500">TODO(message?)</code>
              <p className="ml-4">Throw not-implemented error</p>
            </div>
            <div>
              <code className="text-slate-500">todo(message?)</code>
              <p className="ml-4">Alias for TODO - marks unimplemented code</p>
            </div>
            <div>
              <code className="text-slate-500">error(message)</code>
              <p className="ml-4">Throw error with message - useful for exhaustive checks</p>
            </div>
            <div>
              <code className="text-slate-500">assert(condition, message?)</code>
              <p className="ml-4">Development assertion that throws if false</p>
            </div>
            <div>
              <code className="text-slate-500">assertNotNull(value, message?)</code>
              <p className="ml-4">Assert value is non-null, return it with type narrowing</p>
            </div>
            <div>
              <code className="text-slate-500">runCatching(block)</code>
              <p className="ml-4">Catch exceptions, return {"{ success, value?, error? }"}</p>
            </div>
            <div>
              <code className="text-slate-500">runCatchingAsync(block)</code>
              <p className="ml-4">Async version of runCatching</p>
            </div>
            <div>
              <code className="text-slate-500">lazy(initializer)</code>
              <p className="ml-4">Lazy initialization with caching</p>
            </div>
            <div>
              <code className="text-slate-500">measure(block)</code>
              <p className="ml-4">Measure execution time, return {"{ value, duration }"}</p>
            </div>
            <div>
              <code className="text-slate-500">measureSync(block)</code>
              <p className="ml-4">Sync version of measure</p>
            </div>
            <div>
              <code className="text-slate-500">identity(value)</code>
              <p className="ml-4">Return input value unchanged</p>
            </div>
            <div>
              <code className="text-slate-500">constant(value)</code>
              <p className="ml-4">Return function that always returns value</p>
            </div>
            <div>
              <code className="text-slate-500">noop()</code>
              <p className="ml-4">No-operation function</p>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/strings"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              ← Strings
            </Link>
            <Link
              href="/docs/resilience"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Resilience →
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
