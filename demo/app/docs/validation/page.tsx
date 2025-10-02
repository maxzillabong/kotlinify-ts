import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";

export default function ValidationPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Validation</h1>
      <p className="text-xl text-gray-300 mb-12">
        Accumulate validation errors instead of short-circuiting on the first failure
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection title="Overview">
          <p className="text-gray-300 leading-relaxed mb-4">
            Traditional Either-based validation stops at the first error. The validation helpers allow
            you to collect ALL validation errors and present them to the user at once, providing a better
            user experience.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Inspired by Arrow-kt's validation patterns, these utilities use NonEmptyList to guarantee
            that error collections are never empty when validation fails.
          </p>
        </DocsSection>

        <DocsSection title="Form Validation" description="Validate multiple fields and collect all errors">
          <CodeBlock
            code={`import { zipOrAccumulate3, Left, Right } from 'kotlinify-ts'

type FormData = {
  username?: string
  email?: string
  password?: string
}

const validateUsername = (username?: string) =>
  username && username.length >= 3
    ? Right(username)
    : Left('Username must be at least 3 characters')

const validateEmail = (email?: string) =>
  email && email.includes('@')
    ? Right(email)
    : Left('Email must contain @')

const validatePassword = (password?: string) =>
  password && password.length >= 8
    ? Right(password)
    : Left('Password must be at least 8 characters')

const validateForm = (form: FormData) =>
  zipOrAccumulate3(
    validateUsername(form.username),
    validateEmail(form.email),
    validatePassword(form.password)
  )

// Usage
const result = validateForm({
  username: 'ab',
  email: 'invalid',
  password: '123'
})

if (result.isLeft) {
  const errors = result.getLeft()
  console.log('Validation errors:', errors)
  // ['Username must be at least 3 characters',
  //  'Email must contain @',
  //  'Password must be at least 8 characters']
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Bulk Validation" description="Validate arrays and collect all errors">
          <CodeBlock
            code={`import { mapOrAccumulate, Left, Right } from 'kotlinify-ts'

type User = { name: string; age: number }

const validateUser = (user: Partial<User>) => {
  if (!user.name || user.name.length < 2) {
    return Left({ field: 'name', message: 'Name too short' })
  }
  if (!user.age || user.age < 18) {
    return Left({ field: 'age', message: 'Must be 18+' })
  }
  return Right(user as User)
}

const users = [
  { name: 'Alice', age: 25 },
  { name: 'B', age: 30 },
  { name: 'Charlie', age: 15 }
]

const result = mapOrAccumulate(users, validateUser)

if (result.isLeft) {
  const errors = result.getLeft()
  // NonEmptyList of all validation errors
  errors.forEach(err => {
    console.log(\`\${err.field}: \${err.message}\`)
  })
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="NonEmptyList" description="Guaranteed non-empty error collections">
          <CodeBlock
            code={`import { NonEmptyList } from 'kotlinify-ts'

// Create a NonEmptyList (guaranteed to have at least one element)
const errors = NonEmptyList.of('error1', 'error2', 'error3')

console.log(errors.head)  // 'error1'
console.log(errors.tail)  // ['error2', 'error3']
console.log(errors.length) // 3

// Create from array (returns null if empty)
const fromArray = NonEmptyList.fromArray(['a', 'b'])
// NonEmptyList<string>

const empty = NonEmptyList.fromArray([])
// null

// NonEmptyList extends Array, so all array methods work
const doubled = errors.map(e => e + e)
const filtered = errors.filter(e => e.includes('1'))`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="EitherNel Type Alias" description="Either with NonEmptyList of errors">
          <CodeBlock
            code={`import { EitherNel, Left, Right, NonEmptyList } from 'kotlinify-ts'

// EitherNel<E, A> is Either<NonEmptyList<E>, A>
type ValidationResult<T> = EitherNel<string, T>

function validate(input: string): ValidationResult<number> {
  const num = parseInt(input)

  if (isNaN(num)) {
    return Left(NonEmptyList.of('Not a number'))
  }

  const errors: string[] = []

  if (num < 0) errors.push('Must be positive')
  if (num > 100) errors.push('Must be <= 100')

  if (errors.length > 0) {
    return Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
  }

  return Right(num)
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="zipOrAccumulate Variants" description="Combine 2, 3, or 4 validations">
          <CodeBlock
            code={`import { zipOrAccumulate, zipOrAccumulate3, zipOrAccumulate4 } from 'kotlinify-ts'

// Combine 2 validations
const result2 = zipOrAccumulate(
  validateField1(data.field1),
  validateField2(data.field2)
)
// Either<NonEmptyList<Error>, [Field1, Field2]>

// Combine 3 validations
const result3 = zipOrAccumulate3(
  validateField1(data.field1),
  validateField2(data.field2),
  validateField3(data.field3)
)
// Either<NonEmptyList<Error>, [Field1, Field2, Field3]>

// Combine 4 validations
const result4 = zipOrAccumulate4(
  validateField1(data.field1),
  validateField2(data.field2),
  validateField3(data.field3),
  validateField4(data.field4)
)
// Either<NonEmptyList<Error>, [Field1, Field2, Field3, Field4]>`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Real-World Example" description="API request validation">
          <CodeBlock
            code={`import { zipOrAccumulate3, mapOrAccumulate, Left, Right } from 'kotlinify-ts'

type ApiRequest = {
  endpoint: string
  method: string
  body: unknown
}

const validateEndpoint = (endpoint?: string) =>
  endpoint && endpoint.startsWith('/')
    ? Right(endpoint)
    : Left('Endpoint must start with /')

const validateMethod = (method?: string) =>
  method && ['GET', 'POST', 'PUT', 'DELETE'].includes(method)
    ? Right(method)
    : Left('Invalid HTTP method')

const validateBody = (body?: unknown) =>
  body !== undefined
    ? Right(body)
    : Left('Body is required')

const validateRequest = (request: Partial<ApiRequest>) =>
  zipOrAccumulate3(
    validateEndpoint(request.endpoint),
    validateMethod(request.method),
    validateBody(request.body)
  )

// Validate multiple requests
const requests = [
  { endpoint: '/users', method: 'POST', body: { name: 'Alice' } },
  { endpoint: 'users', method: 'PATCH', body: undefined }
]

const results = mapOrAccumulate(requests, validateRequest)

if (results.isLeft) {
  console.error('Validation errors:', results.getLeft())
} else {
  console.log('All requests valid:', results.getRight())
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Comparison: Short-Circuit vs Accumulation">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Traditional Either (Short-Circuit)</h4>
              <CodeBlock
                code={`// Stops at first error
const result = validateUsername(form.username)
  .flatMap(username =>
    validateEmail(form.email)
      .flatMap(email =>
        validatePassword(form.password)
          .map(password => ({
            username,
            email,
            password
          }))
      )
  )

// Only shows FIRST error`}
                language="typescript"
              />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Validation (Accumulation)</h4>
              <CodeBlock
                code={`// Collects all errors
const result = zipOrAccumulate3(
  validateUsername(form.username),
  validateEmail(form.email),
  validatePassword(form.password)
)

// Shows ALL errors at once`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/monads"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              ← Typed Errors
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
