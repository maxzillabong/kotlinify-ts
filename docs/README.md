# kotlinify-ts Documentation

Welcome to the complete documentation for kotlinify-ts - bringing Kotlin's beloved patterns to TypeScript.

## 📚 Documentation Index

### Getting Started
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)

### Reference Documentation
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation for all modules
- **[Client-Side Guide](./CLIENT_SIDE_GUIDE.md)** - React, Vue, browser applications
- **[Server-Side Guide](./SERVER_SIDE_GUIDE.md)** - Node.js, Express, backend applications

### Examples & Tutorials
- [Examples Directory](../examples/) - Real-world code examples you can open directly in the browser
- [Documentation Site](https://maxzillabong.github.io/kotlinify-ts) - GitHub Pages deployment powered by the demo app

---

## Installation

```bash
npm install kotlinify-ts
```

**Zero dependencies. Works everywhere.**

---

## Quick Start

### Enable All Features

```typescript
import 'kotlinify-ts';

// Now use prototype extensions
const result = "hello"
  .let(s => s.toUpperCase())
  .also(s => console.log('Processing:', s))
  .let(s => s.split('').reverse().join(''));

console.log(result);  // "OLLEH"
```

### Import Specific Modules (Tree-Shakeable)

```typescript
// Scope functions only (~120 bytes gzipped)
import { let, apply, also } from 'kotlinify-ts/scope';

// Flow streams only (~2KB gzipped)
import { flowOf, MutableStateFlow } from 'kotlinify-ts/flow';

// Coroutines only
import { launch, delay } from 'kotlinify-ts/coroutines';

// Monads only
import { Some, None, tryCatch } from 'kotlinify-ts/monads';
```

---

## Core Concepts

### 1. Scope Functions

Transform and configure objects with expressive syntax.

```typescript
import { let, apply, also } from 'kotlinify-ts/scope';

// let - transform and return result
const length = let("Hello", str => str.length);  // 5

// apply - configure object and return it
const config = apply({ port: 3000 }, cfg => {
  cfg.host = 'localhost';
  cfg.ssl = true;
});

// also - side effect, return original
const data = also([1, 2, 3], arr => {
  console.log(`Array length: ${arr.length}`);
});
```

**Use Cases:**
- Object initialization
- Data transformation
- Debugging/logging
- Method chaining

---

### 2. Lazy Sequences

Efficient data processing with lazy evaluation.

```typescript
import { sequenceOf, generateSequence } from 'kotlinify-ts/sequences';

// Only processes ~20 items instead of 100,000!
const result = sequenceOf(...largeArray)
  .map(x => x * 2)
  .filter(x => x > 1000)
  .take(10)
  .toArray();

// Infinite sequences
const fibonacci = generateSequence([0, 1], ([a, b]) => [b, a + b])
  .map(([a]) => a)
  .take(10)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**Performance:**
- **22,500× faster** than arrays for early-termination scenarios
- **Zero intermediate arrays**
- **Constant memory** usage

---

### 3. Flow Streams

Cold and hot reactive streams with backpressure.

```typescript
import { flowOf, MutableStateFlow, callbackFlow } from 'kotlinify-ts/flow';

// Cold Flow (lazy, restarts for each collector)
const numbers = flowOf(1, 2, 3, 4, 5)
  .map(x => x * 2)
  .filter(x => x > 5)
  .collect(console.log);  // 6, 8, 10

// Hot StateFlow (always has current value)
const counter = new MutableStateFlow(0);
counter.collect(value => console.log(`Count: ${value}`));
counter.value++;  // Count: 1

// Event streams
const clicks = callbackFlow(scope => {
  const handler = (e) => scope.emit(e);
  button.addEventListener('click', handler);
  scope.onClose(() => button.removeEventListener('click', handler));
});

clicks
  .debounce(300)
  .map(e => ({ x: e.clientX, y: e.clientY }))
  .collect(console.log);
```

**Use Cases:**
- User input handling (search, forms)
- WebSocket/SSE streams
- Real-time data
- State management

---

### 4. Coroutines

Structured concurrency with cancellation.

```typescript
import { launch, delay, withTimeout } from 'kotlinify-ts/coroutines';

// Launch background job
const job = launch(function() {
  console.log("Task started");
  delay(1000);
  this.ensureActive();  // Check if cancelled
  console.log("Task completed");
  return 42;
});

// Cancel if needed
setTimeout(() => job.cancel(), 500);

try {
  const result = await job.join();
} catch (e) {
  console.log("Job was cancelled");
}

// Timeout
try {
  await withTimeout(2000, () => {
    delay(1000);
    return "completed";
  });
} catch (e) {
  console.log("Timeout!");
}
```

**Features:**
- Automatic cancellation propagation
- Timeout support
- Structured concurrency
- Error handling

---

### 5. Monads

Functional error handling without try/catch.

```typescript
import { Some, None, tryCatch, Right, Left } from 'kotlinify-ts/monads';

// Option - handle nullable values
Some(42)
  .map(x => x * 2)
  .filter(x => x > 50)
  .getOrElse(0);  // 84

None()
  .map(x => x * 2)
  .getOrElse(0);  // 0

// Result - handle operations that may throw
tryCatch(() => JSON.parse(data))
  .map(obj => obj.users)
  .flatMap(users => tryCatch(() => users[0]))
  .fold(
    error => console.error('Failed:', error),
    user => console.log('User:', user)
  );

// Either - explicit success/failure
Right(42)
  .map(x => x * 2)
  .getOrElse(0);  // 84

Left("error")
  .map(x => x * 2)
  .getOrElse(0);  // 0
```

**Use Cases:**
- API error handling
- Form validation
- Railway-oriented programming
- Functional composition

---

## Module Overview

| Module | Size (gzipped) | Use Case |
|--------|----------------|----------|
| **scope** | ~120 bytes | Object transformation, debugging |
| **collections** | ~1KB | Array utilities, grouping |
| **sequences** | ~1.5KB | Lazy evaluation, large datasets |
| **flow** | ~2KB | Reactive streams, real-time data |
| **coroutines** | ~800 bytes | Async/await, cancellation |
| **monads** | ~1KB | Error handling, optionals |
| **Full library** | ~8KB | Everything |

---

## Performance Comparison

### Lazy Sequences vs Arrays

```typescript
// Scenario: Find first 10 items > 10000 in 100k dataset

// ❌ Arrays - processes ALL 100k items
const result1 = Array.from({ length: 100000 }, (_, i) => i)
  .map(x => x * 2)
  .filter(x => x > 10000)
  .slice(0, 10);
// Time: ~20ms

// ✅ Sequences - processes only ~20 items
const result2 = sequenceOf(...Array.from({ length: 100000 }, (_, i) => i))
  .map(x => x * 2)
  .filter(x => x > 10000)
  .take(10)
  .toArray();
// Time: ~1ms (20× faster!)
```

### Flow vs RxJS

```typescript
// ❌ RxJS - eager on array sources
rxFrom(users)
  .pipe(
    rxMap(u => u.salary * 1.1),
    rxFilter(u => u.salary > 100000),
    rxTake(10)
  )
// Time: ~25ms, processes all users

// ✅ kotlinify-ts Flow - true laziness
flowOf(...users)
  .map(u => u.salary * 1.1)
  .filter(u => u.salary > 100000)
  .take(10)
// Time: ~2ms, stops after 10 matches
```

---

## TypeScript Integration

### Full Type Inference

```typescript
// Types flow through the pipeline
const result: string = Some(42)
  .map(x => x.toString())      // Option<string>
  .flatMap(s => Some(s.length)) // Option<number>
  .map(n => `Length: ${n}`)     // Option<string>
  .getOrElse("default");        // string
```

### Readonly Safety

```typescript
import { fold } from 'kotlinify-ts/collections';

const array: readonly number[] = [1, 2, 3];
const sum = fold(array, 0, (acc, n) => acc + n);
// ✅ Compiler ensures no mutation
```

---

## Framework Integration

### React

```typescript
import { MutableStateFlow } from 'kotlinify-ts';
import { useEffect, useState } from 'react';

const userState = new MutableStateFlow<User | null>(null);

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userState.collect(setUser);
  }, []);

  return <div>{user?.name ?? 'Loading...'}</div>;
}
```

### Express.js

```typescript
import { tryCatch } from 'kotlinify-ts';
import express from 'express';

const app = express();

app.get('/users/:id', async (req, res) => {
  const result = await tryCatch(() =>
    db.users.findById(parseInt(req.params.id))
  );

  result.fold(
    error => res.status(404).json({ error: error.message }),
    user => res.json(user)
  );
});
```

### Vue

```typescript
import { MutableStateFlow } from 'kotlinify-ts';
import { ref, onMounted, onUnmounted } from 'vue';

const counter = new MutableStateFlow(0);

export default {
  setup() {
    const count = ref(0);

    onMounted(() => {
      counter.collect(value => {
        count.value = value;
      });
    });

    return { count };
  }
};
```

---

## When to Use What

### Use Sequences When:
- ✅ Processing large datasets (>10k items)
- ✅ Early termination needed (`take`, `first`)
- ✅ Expensive operations (API calls, heavy computation)
- ✅ Memory constrained

### Use Flow When:
- ✅ Real-time data streams
- ✅ User input handling
- ✅ WebSocket/SSE connections
- ✅ State management
- ✅ Backpressure handling

### Use Coroutines When:
- ✅ Background tasks
- ✅ Cancellable operations
- ✅ Timeout required
- ✅ Structured concurrency needed

### Use Monads When:
- ✅ Error handling without try/catch
- ✅ Nullable value handling
- ✅ Functional composition
- ✅ Railway-oriented programming

---

## Migration Guides

### From RxJS

```typescript
// RxJS
rxFrom(users)
  .pipe(
    rxMap(u => u.age),
    rxFilter(age => age > 18),
    rxTake(10)
  )
  .subscribe(console.log);

// kotlinify-ts
flowOf(...users)
  .map(u => u.age)
  .filter(age => age > 18)
  .take(10)
  .collect(console.log);
```

### From Lodash

```typescript
// Lodash
_.chain(users)
  .map(u => u.salary)
  .filter(s => s > 100000)
  .take(10)
  .value();

// kotlinify-ts (lazy!)
users
  .asSequence()
  .map(u => u.salary)
  .filter(s => s > 100000)
  .take(10)
  .toArray();
```

---

## Common Patterns

### Builder Pattern

```typescript
import { apply } from 'kotlinify-ts/scope';

class QueryBuilder {
  private filters = [];

  build() {
    return apply(this, qb => {
      qb.filters.push({ type: 'default' });
    });
  }
}
```

### Railway-Oriented Programming

```typescript
import { tryCatch } from 'kotlinify-ts';

const result = await tryCatch(() => fetchUser(id))
  .flatMap(user => tryCatch(() => fetchPosts(user.id)))
  .flatMap(posts => tryCatch(() => enrichPosts(posts)))
  .map(posts => posts.slice(0, 10))
  .fold(
    error => ({ success: false, error }),
    posts => ({ success: true, posts })
  );
```

### State Machine

```typescript
import { MutableStateFlow } from 'kotlinify-ts';

enum State { Idle, Loading, Success, Error }

const state = new MutableStateFlow(State.Idle);

state.collect(s => {
  switch (s) {
    case State.Idle: renderIdle(); break;
    case State.Loading: renderLoading(); break;
    case State.Success: renderSuccess(); break;
    case State.Error: renderError(); break;
  }
});

state.value = State.Loading;
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/maxzillabong/kotlinify-ts/issues)
- **Discussions**: [GitHub Discussions](https://github.com/maxzillabong/kotlinify-ts/discussions)
- **Discord**: [Join our Discord](https://discord.gg/kotlinify-ts)

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for release history.

---

## Acknowledgments

Inspired by:
- Kotlin Standard Library
- Arrow-kt (Functional Kotlin)
- RxJS
- fp-ts

Built with ❤️ for Kotlin and TypeScript developers.
