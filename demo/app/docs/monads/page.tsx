"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function MonadsPage() {
  const introductionExample = `// The billion-dollar mistake in action
const user = getUser(id);
const profile = user.profile;        // 💥 Cannot read property 'profile' of null
const avatar = profile.avatar;       // 💥 Cannot read property 'avatar' of undefined
const url = avatar.url;              // 💥 Your app just crashed in production

// The defensive programming nightmare
const user = getUser(id);
if (user) {
  const profile = user.profile;
  if (profile) {
    const avatar = profile.avatar;
    if (avatar) {
      const url = avatar.url;
      if (url) {
        displayAvatar(url);
      }
    }
  }
}
// Welcome to the pyramid of doom. Again.

// The kotlinify-ts way - compose, don't nest
import { fromNullable } from 'kotlinify-ts/monads';

fromNullable(getUser(id))
  .map(user => user.profile)
  .map(profile => profile.avatar)
  .map(avatar => avatar.url)
  .fold(
    () => displayDefaultAvatar(),
    url => displayAvatar(url)
  );
// Linear. Composable. Never crashes.`;

  const optionBasicExample = `import { Some, None, fromNullable } from 'kotlinify-ts/monads';

// Creating Options
const someValue = Some(42);
const noValue = None();
const fromNull = fromNullable(localStorage.getItem("token"));

// Transform and extract values
fromNullable(findUser(id))
  .map(user => user.email)
  .filter(email => email.includes("@"))
  .getOrElse("no-email@default.com");

// Chain operations safely
fromNullable(getUserInput())
  .flatMap(input => fromNullable(validateInput(input)))
  .map(valid => processInput(valid))
  .fold(
    () => showDefaultView(),
    result => showResultView(result)
  );`;

  const optionAdvancedExample = `import { Some, None, fromNullable, sequence, traverse } from 'kotlinify-ts/monads';

// Working with multiple Options
const options = [Some(1), Some(2), Some(3)];
const allValues = sequence(options); // Some([1, 2, 3])

const maybeOptions = [Some(1), None(), Some(3)];
const partial = sequence(maybeOptions); // None()

// Transform arrays to Options
const userIds = ["u1", "u2", "u3"];
const users = traverse(userIds, id => fromNullable(findUser(id)));
// Some([user1, user2, user3]) or None() if any user not found

// Combine Options with zip
const name = fromNullable(getName());
const email = fromNullable(getEmail());
const combined = name.zip(email); // Option<[string, string]>

// Use scope functions for cleaner code
fromNullable(getConfig())
  .let(config => parseConfig(config))
  .also(parsed => console.log("Config loaded:", parsed))
  .apply(config => applyConfig(config))
  .takeIf(config => config.isValid)
  .getOrElse(defaultConfig);`;

  const eitherBasicExample = `import { Left, Right } from 'kotlinify-ts/monads';

// Creating Either values
const success = Right<string, number>(42);
const failure = Left<string, number>("Error occurred");

// Validate and transform
function validateAge(input: string): Either<string, number> {
  const age = parseInt(input);
  return isNaN(age) ? Left("Invalid age") : Right(age);
}

validateAge("25")
  .map(age => age + 1)
  .flatMap(age => age >= 18 ? Right(age) : Left("Too young"))
  .fold(
    error => console.error(error),
    age => console.log("Valid age:", age)
  );

// Chain multiple operations
function parseEmail(input: string): Either<string, string> {
  return input.includes("@")
    ? Right(input.toLowerCase())
    : Left("Invalid email format");
}

function checkDomain(email: string): Either<string, string> {
  return email.endsWith("@company.com")
    ? Right(email)
    : Left("Must be company email");
}

parseEmail(userInput)
  .flatMap(checkDomain)
  .map(email => createUser(email))
  .fold(
    error => showError(error),
    user => redirectToDashboard(user)
  );`;

  const eitherAdvancedExample = `import { Left, Right } from 'kotlinify-ts/monads';

// Transform left values (errors)
validateInput(data)
  .mapLeft(error => ({
    message: error,
    timestamp: Date.now(),
    context: "validation"
  }))
  .fold(
    enrichedError => logError(enrichedError),
    result => processResult(result)
  );

// Filter with fallback
Right<string, number>(10)
  .filterOrElse(
    value => value > 5,
    () => "Value too small"
  )
  .getOrElse(0);

// Swap sides for different perspectives
const either = validatePermission(user);
const swapped = either.swap(); // Right becomes Left, Left becomes Right

// Use with scope functions
Right<string, UserData>(userData)
  .let(data => enrichUserData(data))
  .also(enriched => logUserActivity(enriched))
  .apply(data => cacheUserData(data))
  .takeIf(
    data => data.isActive,
    () => "User not active"
  );

// Convert to Option
validateUser(input)
  .toOption() // Some if Right, None if Left
  .map(user => user.id)
  .getOrNull();`;

  const resultBasicExample = `import { Success, Failure, tryCatch, tryCatchAsync } from 'kotlinify-ts/monads';

// Creating Results
const success = Success<number, Error>(42);
const failure = Failure<number, Error>(new Error("Operation failed"));

// Safe execution with tryCatch
const result = tryCatch(
  () => JSON.parse(jsonString),
  error => new Error(\`Parse error: \${error}\`)
);

result
  .map(data => data.users)
  .filter(users => users.length > 0)
  .fold(
    error => console.error("Failed:", error),
    users => console.log("Users:", users)
  );

// Async operations with tryCatchAsync
const apiResult = await tryCatchAsync(
  async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return response.json();
  },
  error => ({
    message: error instanceof Error ? error.message : "Unknown error",
    timestamp: Date.now()
  })
);

apiResult
  .map(data => data.users)
  .onSuccess(users => updateUI(users))
  .onFailure(error => showError(error))
  .getOrElse([]);`;

  const resultAdvancedExample = `import { Success, Failure, tryCatch, tryCatchAsync } from 'kotlinify-ts/monads';

// Error recovery strategies
tryCatch(() => loadFromCache())
  .recover(error => {
    console.warn("Cache miss:", error);
    return loadDefault();
  })
  .map(data => processData(data));

// Chain with recoverWith for complex recovery
tryCatchAsync(() => fetchPrimary())
  .recoverWith(async error => {
    console.warn("Primary failed:", error);
    return tryCatchAsync(() => fetchBackup());
  })
  .map(data => normalize(data))
  .getOrElse(cachedData);

// Transform errors
tryCatch(() => riskyOperation())
  .mapError(error => ({
    type: "OPERATION_ERROR",
    message: error.message,
    stack: error.stack,
    retry: true
  }))
  .fold(
    enrichedError => handleError(enrichedError),
    result => handleSuccess(result)
  );

// Combine with scope functions
await tryCatchAsync(() => fetchUserData(userId))
  .let(data => enrichUserData(data))
  .also(enriched => logAnalytics(enriched))
  .apply(data => cacheData(data))
  .onSuccess(data => notifySubscribers(data))
  .onFailure(error => alertOps(error));`;

  const conversionExample = `import { Some, None, Right, Left, Success, Failure } from 'kotlinify-ts/monads';

// Option to Either
const option = fromNullable(getValue());
const either = option.toEither("No value found");
// Some(5) -> Right(5)
// None() -> Left("No value found")

// Option to Result (through fold)
const result = option.fold(
  () => Failure(new Error("Missing value")),
  value => Success(value)
);

// Either to Option
const validated = validateInput(data);
const maybeValid = validated.toOption();
// Right(value) -> Some(value)
// Left(error) -> None()

// Result to Either
const operation = tryCatch(() => performOperation());
const eitherResult = operation.toEither();
// Success(value) -> Right(value)
// Failure(error) -> Left(error)

// Result to Option
const maybeResult = operation.toOption();
// Success(value) -> Some(value)
// Failure(error) -> None()

// Chain across different monads
fromNullable(getUserInput())
  .fold(
    () => Failure(new Error("No input")),
    input => tryCatch(() => processInput(input))
  )
  .toEither()
  .map(processed => formatOutput(processed))
  .fold(
    error => displayError(error),
    output => displaySuccess(output)
  );`;

  const flowIntegrationExample = `import { flowOf } from 'kotlinify-ts/flow';
import { Some, None, Success, Failure, Right, Left } from 'kotlinify-ts/monads';

// Filter flow items using Option
flowOf([1, 2, null, 3, undefined, 4])
  .mapNotNull(x => x)  // Removes null/undefined
  .collect(values => console.log(values)); // [1, 2, 3, 4]

// Transform with Option, keeping only Some values
flowOf(["user1", "user2", "user3"])
  .mapToOption(id => fromNullable(findUser(id)))
  .collect(users => console.log("Found users:", users));
  // Only emits users that were found

// Process with Result, keeping only successes
flowOf(["/api/user/1", "/api/user/2", "/api/user/3"])
  .mapToResult(url => tryCatch(() => fetchData(url)))
  .map(data => data.profile)
  .collect(profiles => updateUI(profiles));
  // Only successful fetches are processed

// Validate with Either, keeping only Right values
flowOf(["email1", "email2", "invalid", "email3"])
  .mapToEither(email =>
    email.includes("@")
      ? Right(email)
      : Left("Invalid email")
  )
  .map(email => email.toLowerCase())
  .collect(validEmails => sendNewsletter(validEmails));
  // Only valid emails are collected

// Complex flow pipeline with monads
flowOf(rawDataStream)
  .mapToResult(data => tryCatch(() => parseData(data)))
  .mapToOption(parsed => fromNullable(validate(parsed)))
  .map(valid => transform(valid))
  .filterNotNull()
  .collect(results => saveResults(results));`;

  const validationProblemExample = `// Traditional validation - users see one error at a time
function validateForm(data: FormData) {
  if (!data.email || !data.email.includes('@')) {
    return { error: 'Invalid email' };  // User fixes this...
  }
  if (!data.password || data.password.length < 8) {
    return { error: 'Password too short' };  // ...then sees this...
  }
  if (!data.age || data.age < 18) {
    return { error: 'Must be 18+' };  // ...then sees this. Frustrating!
  }
  return { success: true };
}`;

  const nonEmptyListExample = `import { NonEmptyList } from 'kotlinify-ts/monads';

// Create a list that's guaranteed to have at least one element
const errors = NonEmptyList.of(
  "Email is required",
  "Password too short",
  "Age must be 18+"
);

// Access head and tail
console.log(errors.head);  // "Email is required"
console.log(errors.tail);  // ["Password too short", "Age must be 18+"]

// Works with all array methods
const formatted = errors.map(err => \`• \${err}\`);

// Create from array (returns null if empty)
const maybeList = NonEmptyList.fromArray(someArray);
if (maybeList) {
  console.log("At least one item:", maybeList.head);
}`;

  const zipOrAccumulateExample = `import { Left, Right, zipOrAccumulate, zipOrAccumulate3, zipOrAccumulate4 } from 'kotlinify-ts/monads';

// Validate multiple independent fields
const emailValidation = validateEmail(formData.email);
const passwordValidation = validatePassword(formData.password);

// Accumulate errors from both validations
const result = zipOrAccumulate(emailValidation, passwordValidation);

result.fold(
  errors => {
    // NonEmptyList<string> with ALL errors
    console.log("Validation failed with errors:", errors);
    errors.forEach(error => displayError(error));
  },
  ([email, password]) => {
    // Both validations passed!
    createAccount(email, password);
  }
);

// Validate 3 fields at once
const validated = zipOrAccumulate3(
  validateUsername(data.username),
  validateEmail(data.email),
  validateAge(data.age)
);

// Validate 4 fields at once
const apiValidation = zipOrAccumulate4(
  validateEndpoint(request.endpoint),
  validateMethod(request.method),
  validateHeaders(request.headers),
  validateBody(request.body)
);`;

  const mapOrAccumulateExample = `import { Left, Right, mapOrAccumulate } from 'kotlinify-ts/monads';

// Validate an array of items, collecting ALL errors
const userInputs = [
  { name: "Alice", age: 25, email: "alice@example.com" },
  { name: "B", age: 30, email: "bob@example.com" },      // Name too short
  { name: "Charlie", age: 15, email: "charlie@example" }, // Age too young, invalid email
  { name: "David", age: 20, email: "david@example.com" }
];

const validation = mapOrAccumulate(userInputs, user => {
  const errors = [];

  if (user.name.length < 2) {
    return Left(\`User \${user.name}: Name too short\`);
  }
  if (user.age < 18) {
    return Left(\`User \${user.name}: Must be 18+\`);
  }
  if (!user.email.includes('@')) {
    return Left(\`User \${user.name}: Invalid email\`);
  }

  return Right({
    ...user,
    validated: true
  });
});

validation.fold(
  errors => {
    // NonEmptyList with all validation errors
    console.log(\`Found \${errors.length} validation errors:\`);
    errors.forEach(error => console.error(error));
  },
  validUsers => {
    // All users passed validation!
    console.log(\`Successfully validated \${validUsers.length} users\`);
    saveUsers(validUsers);
  }
);`;

  const formValidationExample = `import { Left, Right, zipOrAccumulate3, NonEmptyList, EitherNel } from 'kotlinify-ts/monads';

// Type alias for cleaner signatures
type ValidationError = string;
type Validated<T> = EitherNel<ValidationError, T>;

// Individual field validators
function validateUsername(input?: string): Validated<string> {
  if (!input || input.length < 3) {
    return Left(NonEmptyList.of("Username must be at least 3 characters"));
  }
  if (!/^[a-zA-Z0-9_]+$/.test(input)) {
    return Left(NonEmptyList.of("Username can only contain letters, numbers, and underscores"));
  }
  return Right(input);
}

function validateEmail(input?: string): Validated<string> {
  if (!input) {
    return Left(NonEmptyList.of("Email is required"));
  }
  if (!input.includes('@')) {
    return Left(NonEmptyList.of("Email must contain @"));
  }
  if (!input.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)) {
    return Left(NonEmptyList.of("Invalid email format"));
  }
  return Right(input.toLowerCase());
}

function validatePassword(input?: string): Validated<string> {
  const errors: string[] = [];

  if (!input) {
    errors.push("Password is required");
  } else {
    if (input.length < 8) errors.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(input)) errors.push("Password must contain uppercase letter");
    if (!/[a-z]/.test(input)) errors.push("Password must contain lowercase letter");
    if (!/[0-9]/.test(input)) errors.push("Password must contain number");
  }

  return errors.length > 0
    ? Left(NonEmptyList.of(errors[0], ...errors.slice(1)))
    : Right(input);
}

// Compose validators to validate entire form
function validateSignupForm(formData: FormData) {
  const username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  return zipOrAccumulate3(
    validateUsername(username),
    validateEmail(email),
    validatePassword(password)
  ).map(([username, email, password]) => ({
    username,
    email,
    password,
    createdAt: new Date()
  }));
}

// Usage in a form handler
async function handleSignup(formData: FormData) {
  validateSignupForm(formData).fold(
    errors => {
      // Display ALL validation errors at once
      const errorList = errors.map(e => \`<li>\${e}</li>\`).join('');
      showErrorMessage(\`
        <p>Please fix the following errors:</p>
        <ul>\${errorList}</ul>
      \`);
    },
    async validData => {
      // All validations passed!
      const user = await createUser(validData);
      redirectToDashboard(user);
    }
  );
}`;

  const realWorldExample = `import { tryCatchAsync, fromNullable, Right, Left } from 'kotlinify-ts/monads';

// Replace traditional try-catch with Result
async function fetchUserProfile(userId: string) {
  return tryCatchAsync(async () => {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    return response.json();
  })
  .flatMap(data =>
    fromNullable(data.profile)
      .fold(
        () => Failure(new Error("Profile not found")),
        profile => Success(profile)
      )
  )
  .map(profile => ({
    ...profile,
    lastAccessed: Date.now()
  }))
  .also(profile => updateCache(userId, profile))
  .onFailure(error => {
    console.error(\`Failed to fetch user \${userId}:\`, error);
    trackError(error);
  });
}

// Form validation with Either
function validateForm(formData: FormData) {
  const validateField = (name: string, validator: (value: string) => boolean, error: string) =>
    fromNullable(formData.get(name)?.toString())
      .filter(validator)
      .fold(
        () => Left(error),
        value => Right(value)
      );

  const email = validateField(
    "email",
    email => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email),
    "Invalid email format"
  );

  const password = validateField(
    "password",
    pwd => pwd.length >= 8,
    "Password must be at least 8 characters"
  );

  return email
    .flatMap(() => password)
    .map(() => ({
      email: formData.get("email") as string,
      password: formData.get("password") as string
    }));
}

// Database operation with error handling
async function saveUserPreferences(userId: string, preferences: Preferences) {
  return tryCatchAsync(
    async () => {
      const user = await db.users.findById(userId);
      if (!user) throw new Error("User not found");

      await db.preferences.upsert({
        userId,
        ...preferences,
        updatedAt: new Date()
      });

      return { success: true, userId };
    },
    error => ({
      type: "DB_ERROR",
      message: error instanceof Error ? error.message : "Database operation failed",
      userId,
      timestamp: Date.now()
    })
  )
  .recover(error => {
    // Fallback to cache if DB fails
    localStorage.setItem(\`prefs_\${userId}\`, JSON.stringify(preferences));
    return { success: true, userId, cached: true };
  })
  .also(result => {
    if (result.cached) {
      scheduleRetry(userId, preferences);
    }
  });
}`;

  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Monads</h1>
      <p className="text-xl text-gray-300 mb-12">
        Stop playing whack-a-mole with null checks and try-catch blocks. Handle errors like a functional programming pro.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Billion Dollar Mistake Still Haunts Us"
          description="Tony Hoare called null references his 'billion-dollar mistake.' 60 years later, we're still paying for it."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">Every JavaScript Developer's Daily Nightmare</h4>
            <CodeBlock code={introductionExample} language="typescript" />
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">The Monad Revolution</h4>
            <p className="text-gray-300 mb-4">
              What if null checks weren't needed? What if errors handled themselves? What if your code never crashed from undefined?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded p-4">
                <h5 className="text-yellow-400 font-semibold mb-2">Without Monads</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Null checks everywhere</li>
                  <li>• Try-catch pyramids</li>
                  <li>• Runtime crashes</li>
                  <li>• Defensive coding</li>
                  <li>• "Cannot read property of undefined"</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded p-4">
                <h5 className="text-green-400 font-semibold mb-2">With Monads</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Null safety guaranteed</li>
                  <li>• Linear error flow</li>
                  <li>• Compile-time safety</li>
                  <li>• Confident coding</li>
                  <li>• "It just works"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-purple-900/20 border border-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-500 mb-2">Option</h3>
              <p className="text-gray-300 text-sm mb-3">
                The null killer. Never check for null/undefined again.
              </p>
              <CodeBlock
                code={`fromNullable(user?.profile?.avatar)
  .map(avatar => avatar.url)
  .getOrElse(defaultAvatar)`}
                language="typescript"
              />
            </div>
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Either</h3>
              <p className="text-gray-300 text-sm mb-3">
                Type-safe errors. Know exactly what can go wrong.
              </p>
              <CodeBlock
                code={`validateEmail(input)
  .flatMap(email => checkDomain(email))
  .fold(showError, sendWelcome)`}
                language="typescript"
              />
            </div>
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Result</h3>
              <p className="text-gray-300 text-sm mb-3">
                Try-catch evolved. Recover gracefully from failures.
              </p>
              <CodeBlock
                code={`tryCatchAsync(() => fetch(url))
  .recover(err => fetchFromCache())
  .map(data => transform(data))`}
                language="typescript"
              />
            </div>
          </div>

          <div className="bg-yellow-900/10 border border-yellow-600/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Why Your Team Needs This Now</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>50% Fewer Bugs:</strong> Most production errors are null/undefined related. Eliminate them entirely.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Self-Documenting:</strong> Return types tell you exactly what errors can occur. No more guessing.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Composable:</strong> Chain operations without nested if statements or try-catch blocks.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Refactor Fearlessly:</strong> TypeScript ensures you handle all cases. Can't forget an error path.</span>
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          title="Option - Handling Nullable Values"
          description="Option eliminates null/undefined checks by wrapping values that may not exist."
        >
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Basic Usage</h3>
          <CodeBlock code={optionBasicExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Advanced Patterns</h3>
          <CodeBlock code={optionAdvancedExample} language="typescript" />

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Try it yourself:</h4>
          <CodeBlock
            code={`// Working with Option monad
const maybeToken = fromNullable(null);
console.log('Empty option:', maybeToken.getOrElse('default-token'));

const user = Some({ name: 'Alice', age: 30 });
const greeting = user
  .map(u => \`Hello, \${u.name}!\`)
  .getOrElse('Hello, stranger!');

console.log(greeting);

// Chain transformations
const result = Some(10)
  .map(x => x * 2)
  .filter(x => x > 15)
  .map(x => \`Value: \${x}\`)
  .getOrElse('Too small');

console.log(result);`}
            language="typescript"
            executable={true}
          />
        </DocsSection>

        <DocsSection
          title="Either - Success or Failure"
          description="Either represents a value with two possible types: Left (typically error) or Right (typically success)."
        >
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Basic Usage</h3>
          <CodeBlock code={eitherBasicExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Advanced Patterns</h3>
          <CodeBlock code={eitherAdvancedExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Result - Error Handling with Recovery"
          description="Result wraps operation outcomes with built-in error handling and recovery strategies."
        >
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Basic Usage</h3>
          <CodeBlock code={resultBasicExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Advanced Recovery Patterns</h3>
          <CodeBlock code={resultAdvancedExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Validation - Accumulating Multiple Errors"
          description="Stop failing fast. Collect ALL validation errors at once and show them to your users."
        >
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">The Problem with Early Returns</h3>
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-4">
              Traditional validation fails on the first error, forcing users to fix problems one at a time:
            </p>
            <CodeBlock code={validationProblemExample} language="typescript" />
            <p className="text-gray-300 mt-4">
              This creates a frustrating user experience. Users submit a form, fix one error, submit again, find another error... repeat until insane.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">NonEmptyList - A List That's Never Empty</h3>
          <CodeBlock code={nonEmptyListExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Accumulating Errors with zipOrAccumulate</h3>
          <CodeBlock code={zipOrAccumulateExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Bulk Validation with mapOrAccumulate</h3>
          <CodeBlock code={mapOrAccumulateExample} language="typescript" />

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Real-World Form Validation</h3>
          <CodeBlock code={formValidationExample} language="typescript" />

          <div className="bg-gradient-to-r from-slate-600/10 to-pink-500/10 border border-slate-600/20 rounded-lg p-6 mt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Short-Circuit vs Accumulation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-yellow-400 font-semibold mb-2">Short-Circuit (Regular Either)</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Stops on first error</li>
                  <li>• Good for sequential operations</li>
                  <li>• Use when errors make further validation pointless</li>
                  <li>• Example: Authentication before authorization</li>
                </ul>
                <CodeBlock
                  code={`validateAuth(token)
  .flatMap(validatePermission)
  .flatMap(validateResource)
// Stops at first failure`}
                  language="typescript"
                />
              </div>
              <div>
                <h5 className="text-green-400 font-semibold mb-2">Accumulation (zipOrAccumulate)</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Collects all errors</li>
                  <li>• Perfect for forms and bulk operations</li>
                  <li>• Shows users everything wrong at once</li>
                  <li>• Example: Form field validation</li>
                </ul>
                <CodeBlock
                  code={`zipOrAccumulate3(
  validateEmail(email),
  validatePassword(password),
  validateAge(age)
) // Returns all errors`}
                  language="typescript"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-600/20 rounded-lg p-6 mt-6">
            <p className="text-gray-300">
              <strong>Want more validation patterns?</strong> Check out the dedicated{" "}
              <Link href="/docs/validation" className="text-blue-400 hover:text-blue-300">
                Validation Guide
              </Link>{" "}
              for advanced techniques, custom validators, and integration patterns.
            </p>
          </div>
        </DocsSection>

        <DocsSection
          title="Converting Between Monads"
          description="Seamlessly convert between different monad types based on your needs."
        >
          <CodeBlock code={conversionExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Flow Integration"
          description="Use monads with Flow for powerful stream processing with error handling."
        >
          <CodeBlock code={flowIntegrationExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Real-World Examples"
          description="Replace try-catch blocks and complex null checks with elegant monad chains."
        >
          <CodeBlock code={realWorldExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="API Reference"
          description="Complete list of available methods for each monad type."
        >
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-500 mb-4">Option Methods</h3>
              <div className="space-y-2 text-sm font-mono">
                <div><span className="text-gray-400">Creation:</span> Some(value), None(), fromNullable(value)</div>
                <div><span className="text-gray-400">Transform:</span> map(), flatMap(), filter(), filterNot()</div>
                <div><span className="text-gray-400">Extract:</span> get(), getOrNull(), getOrElse(), getOrThrow()</div>
                <div><span className="text-gray-400">Compose:</span> orElse(), zip(), fold()</div>
                <div><span className="text-gray-400">Check:</span> isSome, isNone, contains(), exists()</div>
                <div><span className="text-gray-400">Scope:</span> let(), also(), apply(), takeIf(), takeUnless()</div>
                <div><span className="text-gray-400">Convert:</span> toArray(), toEither()</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Either Methods</h3>
              <div className="space-y-2 text-sm font-mono">
                <div><span className="text-gray-400">Creation:</span> Left(value), Right(value)</div>
                <div><span className="text-gray-400">Transform:</span> map(), mapLeft(), flatMap()</div>
                <div><span className="text-gray-400">Extract:</span> getLeft(), getRight(), getOrNull(), getOrElse()</div>
                <div><span className="text-gray-400">Compose:</span> fold(), swap(), filterOrElse(), orElse()</div>
                <div><span className="text-gray-400">Check:</span> isLeft, isRight, contains(), exists()</div>
                <div><span className="text-gray-400">Scope:</span> let(), also(), apply(), takeIf()</div>
                <div><span className="text-gray-400">Convert:</span> toOption()</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Result Methods</h3>
              <div className="space-y-2 text-sm font-mono">
                <div><span className="text-gray-400">Creation:</span> Success(value), Failure(error), tryCatch(), tryCatchAsync()</div>
                <div><span className="text-gray-400">Transform:</span> map(), mapError(), flatMap()</div>
                <div><span className="text-gray-400">Extract:</span> get(), getOrNull(), getOrElse(), getOrThrow(), getError(), getErrorOrNull()</div>
                <div><span className="text-gray-400">Recover:</span> recover(), recoverWith()</div>
                <div><span className="text-gray-400">Side Effects:</span> onSuccess(), onFailure()</div>
                <div><span className="text-gray-400">Check:</span> isSuccess, isFailure</div>
                <div><span className="text-gray-400">Scope:</span> let(), also(), apply()</div>
                <div><span className="text-gray-400">Convert:</span> toOption(), toEither()</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-pink-400 mb-4">Validation Methods</h3>
              <div className="space-y-2 text-sm font-mono">
                <div><span className="text-gray-400">NonEmptyList:</span> NonEmptyList.of(head, ...tail), NonEmptyList.fromArray(array)</div>
                <div><span className="text-gray-400">Properties:</span> head, tail, length, plus all Array methods</div>
                <div><span className="text-gray-400">Type Alias:</span> EitherNel&lt;E, A&gt; = Either&lt;NonEmptyList&lt;E&gt;, A&gt;</div>
                <div><span className="text-gray-400">Accumulate 2:</span> zipOrAccumulate(a, b) → Either&lt;NonEmptyList&lt;E&gt;, [A, B]&gt;</div>
                <div><span className="text-gray-400">Accumulate 3:</span> zipOrAccumulate3(a, b, c) → Either&lt;NonEmptyList&lt;E&gt;, [A, B, C]&gt;</div>
                <div><span className="text-gray-400">Accumulate 4:</span> zipOrAccumulate4(a, b, c, d) → Either&lt;NonEmptyList&lt;E&gt;, [A, B, C, D]&gt;</div>
                <div><span className="text-gray-400">Map & Accumulate:</span> mapOrAccumulate(items, fn) → Either&lt;NonEmptyList&lt;E&gt;, B[]&gt;</div>
              </div>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="When to Use Each Monad"
        >
          <div className="space-y-4">
            <div className="border-l-4 border-slate-600 pl-4">
              <h4 className="font-semibold text-white">Use Option when:</h4>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• Dealing with nullable values from APIs or databases</li>
                <li>• Working with optional configuration or settings</li>
                <li>• Finding elements in collections that may not exist</li>
                <li>• You don't need error information, just presence/absence</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-white">Use Either when:</h4>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• You need typed error information</li>
                <li>• Building validation chains with specific error messages</li>
                <li>• Implementing railway-oriented programming patterns</li>
                <li>• Working with operations that have two distinct outcomes</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-white">Use Result when:</h4>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• Replacing try-catch blocks with functional error handling</li>
                <li>• Need error recovery and retry strategies</li>
                <li>• Working with async operations that may fail</li>
                <li>• Want to chain operations with side effects for success/failure</li>
              </ul>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="font-semibold text-white">Use Validation (zipOrAccumulate) when:</h4>
              <ul className="text-gray-300 text-sm mt-2 space-y-1">
                <li>• Validating forms where users need to see all errors at once</li>
                <li>• Processing bulk data where partial success is acceptable</li>
                <li>• Independent validations that don't depend on each other</li>
                <li>• Need to accumulate multiple errors instead of failing fast</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/flow"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Flow →
            </Link>
            <Link
              href="/docs/collections"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Collections
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}