# kotlinify-ts API Reference

Complete API documentation for all kotlinify-ts modules.

## Table of Contents

- [Scope Functions](#scope-functions)
- [Collections](#collections)
- [Sequences](#sequences)
- [Flow & Reactive Streams](#flow--reactive-streams)
- [Coroutines](#coroutines)
- [Monads](#monads)
- [Null Safety](#null-safety)

---

## Scope Functions

Kotlin-style scope functions for cleaner, more expressive code.

### `let(value, block)`

Transforms a value and returns the result.

**Signature:**
```typescript
function let<T, R>(value: T, block: (value: T) => R): R
```

**Parameters:**
- `value`: The value to transform
- `block`: Transformation function receiving the value

**Returns:** Result of the transformation

**Example:**
```typescript
import { let } from 'kotlinify-ts/scope';

const result = let("John Doe", name => ({
  name,
  initials: name.split(' ').map(n => n[0]).join(''),
  length: name.length
}));
// { name: "John Doe", initials: "JD", length: 8 }
```

**Prototype Extension:**
```typescript
import 'kotlinify-ts';

const result = "John Doe".let(name => name.toUpperCase());
// "JOHN DOE"
```

---

### `apply(value, block)`

Configures an object and returns the modified object.

**Signature:**
```typescript
function apply<T>(value: T, block: (value: T) => void): T
```

**Parameters:**
- `value`: The object to configure
- `block`: Configuration function (can mutate the object)

**Returns:** The same object after configuration

**Example:**
```typescript
import { apply } from 'kotlinify-ts/scope';

const config = apply({
  host: 'localhost',
  port: 3000
}, cfg => {
  cfg.port = 8080;
  cfg.ssl = true;
});
// { host: "localhost", port: 8080, ssl: true }
```

**Use Case:** Builder pattern, object initialization

---

### `also(value, block)`

Performs a side effect and returns the original value unchanged.

**Signature:**
```typescript
function also<T>(value: T, block: (value: T) => void): T
```

**Parameters:**
- `value`: The value to inspect
- `block`: Side effect function (logging, debugging, etc.)

**Returns:** The original value unchanged

**Example:**
```typescript
import { also } from 'kotlinify-ts/scope';

const users = also([
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
], list => {
  console.log(`Processing ${list.length} users`);
  console.log(`Average age: ${list.reduce((s, u) => s + u.age, 0) / list.length}`);
});
// Logs the info, returns original array unchanged
```

**Use Case:** Debugging, logging, analytics

---

### `run(block)`

Executes a block and returns its result.

**Signature:**
```typescript
function run<R>(block: () => R): R
```

**Parameters:**
- `block`: Function to execute

**Returns:** Result of the block

**Example:**
```typescript
import { run } from 'kotlinify-ts/scope';

const result = run(() => {
  const data = fetchData();
  const processed = processData(data);
  return validate(processed);
});
```

**Use Case:** Scoped computations, IIFE replacement

---

### `with(receiver, block)`

Executes a block with a context object.

**Signature:**
```typescript
function with<T, R>(receiver: T, block: (value: T) => R): R
```

**Parameters:**
- `receiver`: Context object
- `block`: Function receiving the context

**Returns:** Result of the block

**Example:**
```typescript
import { with as kWith } from 'kotlinify-ts/scope';

const person = { name: "Alice", age: 30 };
const bio = kWith(person, p => `${p.name} is ${p.age} years old`);
// "Alice is 30 years old"
```

---

## Collections

Kotlin-style collection utilities for arrays.

### `first(array, predicate?)`

Returns the first element matching the predicate, or first element if no predicate.

**Signature:**
```typescript
function first<T>(array: readonly T[]): T
function first<T>(array: readonly T[], predicate: (value: T) => boolean): T
```

**Throws:** Error if array is empty or no match found

**Example:**
```typescript
import { first } from 'kotlinify-ts/collections';

first([1, 2, 3]);                    // 1
first([1, 2, 3], x => x > 1);       // 2
first([], x => x > 0);              // Error: Array is empty
```

---

### `firstOrNull(array, predicate?)`

Returns the first element or `undefined` if not found.

**Signature:**
```typescript
function firstOrNull<T>(array: T[]): T | undefined
function firstOrNull<T>(array: T[], predicate: (value: T) => boolean): T | undefined
```

**Example:**
```typescript
import { firstOrNull } from 'kotlinify-ts/collections';

firstOrNull([1, 2, 3]);              // 1
firstOrNull([1, 2, 3], x => x > 5);  // undefined
firstOrNull([]);                     // undefined
```

---

### `last(array, predicate?)`

Returns the last element matching the predicate.

**Signature:**
```typescript
function last<T>(array: T[]): T
function last<T>(array: T[], predicate: (value: T) => boolean): T
```

**Throws:** Error if array is empty or no match found

---

### `lastOrNull(array, predicate?)`

Returns the last element or `undefined`.

**Signature:**
```typescript
function lastOrNull<T>(array: T[]): T | undefined
function lastOrNull<T>(array: T[], predicate: (value: T) => boolean): T | undefined
```

---

### `single(array, predicate?)`

Returns the single element matching the predicate.

**Signature:**
```typescript
function single<T>(array: T[]): T
function single<T>(array: T[], predicate: (value: T) => boolean): T
```

**Throws:** Error if zero or more than one match

**Example:**
```typescript
import { single } from 'kotlinify-ts/collections';

single([42]);                        // 42
single([1, 2, 3]);                  // Error: More than one element
single([1, 2, 3], x => x === 2);    // 2
```

---

### `fold(array, initial, operation)`

Accumulates values starting with an initial value.

**Signature:**
```typescript
function fold<T, R>(array: readonly T[], initial: R, operation: (acc: R, value: T) => R): R
```

**Example:**
```typescript
import { fold } from 'kotlinify-ts/collections';

fold([1, 2, 3, 4], 0, (sum, n) => sum + n);  // 10
fold(['a', 'b', 'c'], '', (acc, s) => acc + s.toUpperCase());  // "ABC"
```

---

### `associateBy(array, keySelector)`

Creates a record by extracting keys from elements.

**Signature:**
```typescript
function associateBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (value: T) => K
): Record<K, T>
```

**Example:**
```typescript
import { associateBy } from 'kotlinify-ts/collections';

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

associateBy(users, u => u.id);
// { 1: { id: 1, name: "Alice" }, 2: { id: 2, name: "Bob" } }
```

---

### `groupBy(array, keySelector)`

Groups elements by a key.

**Signature:**
```typescript
function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (value: T) => K
): Record<K, T[]>
```

**Example:**
```typescript
import { groupBy } from 'kotlinify-ts/collections';

const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 30 }
];

groupBy(users, u => u.age);
// { 25: [Bob], 30: [Alice, Charlie] }
```

---

### `partition(array, predicate)`

Splits array into two arrays based on predicate.

**Signature:**
```typescript
function partition<T>(
  array: T[],
  predicate: (value: T) => boolean
): [T[], T[]]
```

**Example:**
```typescript
import { partition } from 'kotlinify-ts/collections';

const [evens, odds] = partition([1, 2, 3, 4, 5], x => x % 2 === 0);
// evens: [2, 4], odds: [1, 3, 5]
```

---

### `chunked(array, size)`

Splits array into chunks of specified size.

**Signature:**
```typescript
function chunked<T>(array: T[], size: number): T[][]
```

**Example:**
```typescript
import { chunked } from 'kotlinify-ts/collections';

chunked([1, 2, 3, 4, 5, 6, 7], 3);
// [[1, 2, 3], [4, 5, 6], [7]]
```

---

### `windowed(array, size, step?)`

Creates sliding windows over array.

**Signature:**
```typescript
function windowed<T>(array: T[], size: number, step?: number): T[][]
```

**Example:**
```typescript
import { windowed } from 'kotlinify-ts/collections';

windowed([1, 2, 3, 4, 5], 3, 1);
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]

windowed([1, 2, 3, 4, 5], 2, 2);
// [[1, 2], [3, 4]]
```

---

### `distinctBy(array, selector)`

Returns distinct elements by key.

**Signature:**
```typescript
function distinctBy<T, K>(array: T[], selector: (value: T) => K): T[]
```

**Example:**
```typescript
import { distinctBy } from 'kotlinify-ts/collections';

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice2" }
];

distinctBy(users, u => u.id);
// [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
```

---

## Sequences

Lazy evaluation sequences for efficient data processing.

### `Sequence` Class

**Import:**
```typescript
import { Sequence, sequenceOf, asSequence } from 'kotlinify-ts/sequences';
```

### Creating Sequences

#### `sequenceOf(...items)`

Creates a sequence from items.

```typescript
const seq = sequenceOf(1, 2, 3, 4, 5);
```

#### `asSequence(array)`

Converts array to sequence.

```typescript
const seq = [1, 2, 3].asSequence();
```

#### `generateSequence(seed, nextFunction)`

Creates infinite or conditional sequence.

```typescript
// Infinite sequence
const naturals = generateSequence(1, n => n + 1);

// Conditional sequence (stops when null)
const countdown = generateSequence(10, n => n > 0 ? n - 1 : null);
```

---

### Sequence Operations

#### `map(transform)`

Transforms each element.

```typescript
sequenceOf(1, 2, 3)
  .map(x => x * 2)
  .toArray();  // [2, 4, 6]
```

#### `filter(predicate)`

Filters elements.

```typescript
sequenceOf(1, 2, 3, 4, 5)
  .filter(x => x % 2 === 0)
  .toArray();  // [2, 4]
```

#### `take(count)`

Takes first N elements (lazy).

```typescript
generateSequence(1, n => n + 1)
  .take(5)
  .toArray();  // [1, 2, 3, 4, 5]
```

#### `drop(count)`

Skips first N elements.

```typescript
sequenceOf(1, 2, 3, 4, 5)
  .drop(2)
  .toArray();  // [3, 4, 5]
```

#### `flatMap(transform)`

Maps and flattens.

```typescript
sequenceOf(1, 2, 3)
  .flatMap(x => sequenceOf(x, x * 10))
  .toArray();  // [1, 10, 2, 20, 3, 30]
```

---

### Terminal Operations

#### `toArray()`

Converts sequence to array.

#### `toSet()`

Converts sequence to Set.

#### `first()` / `firstOrNull()`

Gets first element.

#### `count()`

Counts elements.

#### `sum()`

Sums numeric elements.

#### `forEach(action)`

Executes action for each element.

---

## Flow & Reactive Streams

Cold and hot reactive streams with backpressure.

### `Flow<T>` Class

**Import:**
```typescript
import { flow, flowOf, Flow } from 'kotlinify-ts/flow';
```

### Creating Flows

#### `flow(builder)`

Creates a cold flow from async generator.

```typescript
const numbers = flow(function*() {
  for (let i = 0; i < 10; i++) {
    delay(100);
    yield i;
  }
});
```

#### `flowOf(...items)`

Creates flow from items.

```typescript
const numbers = flowOf(1, 2, 3, 4, 5);
```

#### `callbackFlow(builder)`

Creates flow from callbacks/events.

```typescript
const clicks = callbackFlow(scope => {
  const handler = (e) => scope.emit(e);
  button.addEventListener('click', handler);

  scope.onClose(() => {
    button.removeEventListener('click', handler);
  });
});
```

---

### Flow Operators

#### `map(transform)`

Transforms each value.

```typescript
flowOf(1, 2, 3)
  .map(x => x * 2)
  .collect(console.log);  // 2, 4, 6
```

#### `filter(predicate)`

Filters values.

```typescript
flowOf(1, 2, 3, 4, 5)
  .filter(x => x % 2 === 0)
  .collect(console.log);  // 2, 4
```

#### `take(count)`

Takes first N emissions.

```typescript
flowOf(1, 2, 3, 4, 5)
  .take(3)
  .collect(console.log);  // 1, 2, 3
```

#### `debounce(timeMs)`

Emits only after silence period.

```typescript
userInput
  .debounce(300)
  .collect(value => search(value));
```

#### `throttle(timeMs)`

Limits emission rate.

```typescript
scrollEvents
  .throttle(100)
  .collect(handleScroll);
```

#### `distinctUntilChanged()`

Emits only when value changes.

```typescript
flowOf(1, 1, 2, 2, 3, 1)
  .distinctUntilChanged()
  .collect(console.log);  // 1, 2, 3, 1
```

---

### Hot Flows

#### `StateFlow<T>`

Holds and emits current state.

```typescript
import { MutableStateFlow } from 'kotlinify-ts/flow';

const counter = new MutableStateFlow(0);

counter.collect(value => {
  console.log(`Count: ${value}`);
});

counter.value++;  // Count: 1
counter.update(n => n + 5);  // Count: 6
```

#### `SharedFlow<T>`

Event bus with replay support.

```typescript
import { MutableSharedFlow } from 'kotlinify-ts/flow';

const events = new MutableSharedFlow({ replay: 2 });

events.emit("event1");
events.emit("event2");

// New subscriber gets last 2 events
events.collect(console.log);  // event1, event2
```

---

## Coroutines

Structured concurrency primitives.

### `launch(block)`

Starts a coroutine job.

**Signature:**
```typescript
function launch<T>(block: (this: Job) => Promise<T>): Job<T>
```

**Example:**
```typescript
import { launch, delay } from 'kotlinify-ts/coroutines';

const job = launch(function() {
  console.log("Task started");
  delay(1000);
  this.ensureActive();  // Check cancellation
  console.log("Task completed");
  return "result";
});

await job.join();  // Wait for completion
```

---

### `async(block)`

Creates deferred value.

```typescript
import { async } from 'kotlinify-ts/coroutines';

const deferred = async(function() {
  delay(1000);
  return 42;
});

const result = await deferred.await();  // 42
```

---

### `delay(ms)`

Suspends for specified time.

```typescript
await delay(1000);  // Wait 1 second
```

---

### `withTimeout(timeMs, block)`

Runs block with timeout.

```typescript
import { withTimeout } from 'kotlinify-ts/coroutines';

try {
  await withTimeout(2000, () => {
    delay(1000);
    return "completed";
  });
} catch (e) {
  console.log("Timeout!");
}
```

---

### Job Cancellation

```typescript
const job = launch(function() {
  for (let i = 0; i < 10; i++) {
    this.ensureActive();  // Throws if cancelled
    delay(100);
    console.log(`Step ${i}`);
  }
});

setTimeout(() => job.cancel("User stopped"), 500);

try {
  await job.join();
} catch (e) {
  console.log("Job was cancelled");
}
```

---

## Monads

Functional programming with Option, Either, Result.

### `Option<T>`

Represents optional values.

**Import:**
```typescript
import { Option, Some, None, fromNullable } from 'kotlinify-ts/monads';
```

**Creating Options:**
```typescript
const some = Some(42);
const none = None();
const maybe = fromNullable(possiblyNull);
```

**Operations:**
```typescript
Some(42)
  .map(x => x * 2)           // Some(84)
  .filter(x => x > 50)        // Some(84)
  .flatMap(x => Some(x + 1))  // Some(85)
  .getOrElse(0);              // 85

None()
  .map(x => x * 2)            // None
  .getOrElse(0);              // 0
```

---

### `Either<L, R>`

Represents success (Right) or failure (Left).

**Import:**
```typescript
import { Either, Left, Right } from 'kotlinify-ts/monads';
```

**Creating Either:**
```typescript
const success = Right(42);
const failure = Left("error");
```

**Operations:**
```typescript
Right(42)
  .map(x => x * 2)              // Right(84)
  .flatMap(x => Right(x + 1))   // Right(85)
  .fold(
    error => console.error(error),
    value => console.log(value)
  );

Left("error")
  .map(x => x * 2)              // Left("error")
  .getOrElse(0);                // 0
```

---

### `Result<T>`

Represents computation that may throw.

**Import:**
```typescript
import { Result, Success, Failure, tryCatch } from 'kotlinify-ts/monads';
```

**Creating Results:**
```typescript
const success = Success(42);
const failure = Failure(new Error("failed"));

const result = tryCatch(() => JSON.parse(data));
```

**Operations:**
```typescript
tryCatch(() => JSON.parse(data))
  .map(obj => obj.users)
  .flatMap(users => tryCatch(() => users[0]))
  .getOrElse(null);
```

---

## Null Safety

Kotlin-style null safety helpers.

### `takeIf(value, predicate)`

Returns value if predicate is true, otherwise null.

```typescript
import { takeIf } from 'kotlinify-ts/null-safety';

takeIf(42, v => v > 40);  // 42
takeIf(30, v => v > 40);  // null
```

### `takeUnless(value, predicate)`

Returns value if predicate is false, otherwise null.

```typescript
import { takeUnless } from 'kotlinify-ts/null-safety';

takeUnless(42, v => v > 50);  // 42
takeUnless(60, v => v > 50);  // null
```

---

## Type Constraints

All functions preserve TypeScript's type inference:

```typescript
const numbers: number[] = [1, 2, 3];
const strings = numbers.map(n => n.toString());  // string[]

const result = Some(42)
  .map(x => x.toString())   // Option<string>
  .flatMap(s => Some(s.length));  // Option<number>
```

---

## Tree-Shaking

Import only what you need:

```typescript
// Import specific functions
import { let, apply } from 'kotlinify-ts/scope';

// Import from specific module
import { flowOf } from 'kotlinify-ts/flow';

// Import all (enables prototype extensions)
import 'kotlinify-ts';
```

**Bundle sizes:**
- Scope functions only: ~120 bytes gzipped
- Flow module: ~2KB gzipped
- Full library: ~8KB gzipped
