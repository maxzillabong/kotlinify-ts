# Client-Side Use Cases Guide

Comprehensive guide for using kotlinify-ts in browser/frontend applications.

## Table of Contents

- [React Integration](#react-integration)
- [Form Handling](#form-handling)
- [API Requests](#api-requests)
- [Real-Time Data](#real-time-data)
- [User Input Handling](#user-input-handling)
- [State Management](#state-management)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)

---

## React Integration

### Basic Setup

```typescript
// App.tsx
import 'kotlinify-ts';
import { MutableStateFlow, flowOf } from 'kotlinify-ts';
import { useState, useEffect } from 'react';
```

### State Management with StateFlow

```typescript
import { MutableStateFlow } from 'kotlinify-ts';
import { useEffect, useState } from 'react';

// Create reactive state outside component
const userState = new MutableStateFlow<User | null>(null);

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to state changes
    const subscription = userState.collect(setUser);

    return () => {
      // Cleanup
      subscription.cancel?.();
    };
  }, []);

  return (
    <div>
      {user ? `Hello, ${user.name}!` : 'Loading...'}
    </div>
  );
}

// Update from anywhere in the app
userState.value = { name: "Alice", age: 30 };
```

---

### Custom Hook for Flow

```typescript
import { Flow } from 'kotlinify-ts';
import { useEffect, useState } from 'react';

function useFlow<T>(flow: Flow<T>, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const collect = async () => {
      try {
        await flow.collect(val => {
          setValue(val);
          setLoading(false);
        });
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    collect();
  }, [flow]);

  return { value, loading, error };
}

// Usage
function SearchResults() {
  const searchFlow = userInput
    .debounce(300)
    .map(query => api.search(query));

  const { value: results, loading } = useFlow(searchFlow, []);

  return (
    <div>
      {loading ? 'Searching...' : results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

---

## Form Handling

### Validated Form Input

```typescript
import { apply, takeIf, fromNullable } from 'kotlinify-ts';

interface FormData {
  email: string;
  password: string;
  age: number;
}

function validateForm(data: Partial<FormData>): FormData | null {
  return apply(data, form => {
    // Email validation
    form.email = takeIf(form.email, email =>
      email?.includes('@') && email.length > 3
    );

    // Password validation
    form.password = takeIf(form.password, pwd =>
      pwd && pwd.length >= 8
    );

    // Age validation
    form.age = takeIf(form.age, age =>
      age && age >= 18 && age <= 120
    );
  })
  .let(form =>
    form.email && form.password && form.age
      ? form as FormData
      : null
  );
}

function SignupForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fromNullable(validateForm(formData))
      .map(data => {
        // Valid form
        api.signup(data);
        return data;
      })
      .also(data => console.log('Submitting:', data))
      .getOrElse(() => {
        setErrors(['Please fill all fields correctly']);
      });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### Multi-Step Form with Flow

```typescript
import { MutableStateFlow, flowOf } from 'kotlinify-ts';

enum Step { Personal, Address, Payment, Review }

const formFlow = new MutableStateFlow<{
  step: Step;
  data: Partial<FormData>;
}>({
  step: Step.Personal,
  data: {}
});

function MultiStepForm() {
  const [state, setState] = useState(formFlow.value);

  useEffect(() => {
    formFlow.collect(setState);
  }, []);

  const nextStep = (stepData: any) => {
    formFlow.update(current => ({
      step: current.step + 1,
      data: { ...current.data, ...stepData }
    }));
  };

  const prevStep = () => {
    formFlow.update(current => ({
      ...current,
      step: Math.max(0, current.step - 1)
    }));
  };

  return (
    <div>
      {state.step === Step.Personal && <PersonalInfo onNext={nextStep} />}
      {state.step === Step.Address && <AddressInfo onNext={nextStep} onPrev={prevStep} />}
      {state.step === Step.Payment && <PaymentInfo onNext={nextStep} onPrev={prevStep} />}
      {state.step === Step.Review && <Review data={state.data} onPrev={prevStep} />}
    </div>
  );
}
```

---

## API Requests

### Fetch with Result Monad

```typescript
import { tryCatch, Result } from 'kotlinify-ts';

async function fetchUser(id: number): Promise<Result<User>> {
  return tryCatch(() => {
    const response = fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  });
}

// Usage
const result = await fetchUser(123);

result
  .map(user => user.name)
  .fold(
    error => console.error('Failed:', error),
    name => console.log('User:', name)
  );
```

---

### Paginated Data Loading

```typescript
import { flow, delay } from 'kotlinify-ts';

function usePaginatedData<T>(fetcher: (page: number) => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFlow = flow(function*() {
    let page = 1;

    while (true) {
      yield fetcher(page);
      page++;
      delay(100);  // Rate limiting
    }
  })
  .take(10)  // Load max 10 pages
  .map(pageData => {
    setData(prev => [...prev, ...pageData]);
    return pageData;
  });

  const loadMore = async () => {
    setLoading(true);
    await loadFlow.collect(() => {});
    setLoading(false);
  };

  return { data, loading, loadMore };
}

// Usage
function InfiniteScroll() {
  const { data, loading, loadMore } = usePaginatedData(
    page => fetch(`/api/items?page=${page}`).then(r => r.json())
  );

  return (
    <div>
      {data.map(item => <Item key={item.id} {...item} />)}
      {loading && <Spinner />}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
```

---

### Parallel API Requests

```typescript
import { async as kAsync } from 'kotlinify-ts';

async function loadDashboard() {
  const [users, posts, stats] = await Promise.all([
    kAsync(() => fetch('/api/users').then(r => r.json())).await(),
    kAsync(() => fetch('/api/posts').then(r => r.json())).await(),
    kAsync(() => fetch('/api/stats').then(r => r.json())).await()
  ]);

  return { users, posts, stats };
}

// With error handling
async function loadDashboardSafe() {
  const results = await Promise.all([
    tryCatch(() => fetch('/api/users').then(r => r.json())),
    tryCatch(() => fetch('/api/posts').then(r => r.json())),
    tryCatch(() => fetch('/api/stats').then(r => r.json()))
  ]);

  return {
    users: results[0].getOrElse([]),
    posts: results[1].getOrElse([]),
    stats: results[2].getOrElse({})
  };
}
```

---

## Real-Time Data

### WebSocket with Flow

```typescript
import { callbackFlow } from 'kotlinify-ts';

function createWebSocketFlow(url: string): Flow<MessageEvent> {
  return callbackFlow(scope => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      scope.emit(event);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    scope.onClose(() => {
      ws.close();
    });
  });
}

// Usage in React
function LiveFeed() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = createWebSocketFlow('wss://example.com/feed')
      .map(event => JSON.parse(event.data))
      .filter(msg => msg.type === 'update')
      .debounce(100)  // Throttle updates
      .collect(msg => {
        setMessages(prev => [...prev, msg.content]);
      });

    return () => {
      // Flow cleanup
    };
  }, []);

  return (
    <div>
      {messages.map((msg, i) => <div key={i}>{msg}</div>)}
    </div>
  );
}
```

---

### Server-Sent Events (SSE)

```typescript
import { callbackFlow } from 'kotlinify-ts';

function createSSEFlow(url: string): Flow<MessageEvent> {
  return callbackFlow(scope => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      scope.emit(event);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      scope.close();
    };

    scope.onClose(() => {
      eventSource.close();
    });
  });
}

// Live stock prices
function StockTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    createSSEFlow(`/api/stocks/${symbol}/stream`)
      .map(event => JSON.parse(event.data))
      .distinctUntilChanged()
      .collect(data => setPrice(data.price));
  }, [symbol]);

  return <div>Current price: ${price}</div>;
}
```

---

## User Input Handling

### Search with Debounce

```typescript
import { MutableStateFlow } from 'kotlinify-ts';

const searchInput = new MutableStateFlow('');

const searchResults = searchInput
  .debounce(300)                    // Wait for user to stop typing
  .filter(query => query.length >= 3)  // Min 3 characters
  .distinctUntilChanged()           // Don't search same query twice
  .map(query =>
    fetch(`/api/search?q=${query}`).then(r => r.json())
  );

function SearchBox() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    searchResults.collect(setResults);
  }, []);

  return (
    <div>
      <input
        type="text"
        onChange={e => searchInput.value = e.target.value}
        placeholder="Search..."
      />
      <Results items={results} />
    </div>
  );
}
```

---

### Form Input Validation (Live)

```typescript
import { MutableStateFlow } from 'kotlinify-ts';

const emailInput = new MutableStateFlow('');

const emailValidation = emailInput
  .debounce(500)
  .map(email => ({
    value: email,
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? 'Valid email'
      : 'Invalid email format'
  }));

function EmailInput() {
  const [validation, setValidation] = useState({
    value: '',
    isValid: false,
    message: ''
  });

  useEffect(() => {
    emailValidation.collect(setValidation);
  }, []);

  return (
    <div>
      <input
        type="email"
        value={validation.value}
        onChange={e => emailInput.value = e.target.value}
        className={validation.isValid ? 'valid' : 'invalid'}
      />
      <span>{validation.message}</span>
    </div>
  );
}
```

---

### Mouse/Touch Tracking

```typescript
import { callbackFlow } from 'kotlinify-ts';

const mousePosition = callbackFlow<{ x: number; y: number }>(scope => {
  const handleMove = (e: MouseEvent) => {
    scope.emit({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener('mousemove', handleMove);

  scope.onClose(() => {
    window.removeEventListener('mousemove', handleMove);
  });
});

const throttledPosition = mousePosition
  .throttle(16)  // ~60fps
  .map(pos => ({
    x: Math.round(pos.x),
    y: Math.round(pos.y)
  }));

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    throttledPosition.collect(setPos);
  }, []);

  return <div>Mouse: ({pos.x}, {pos.y})</div>;
}
```

---

## State Management

### Global App State

```typescript
import { MutableStateFlow } from 'kotlinify-ts';

// Global state
const appState = new MutableStateFlow({
  user: null as User | null,
  theme: 'light' as 'light' | 'dark',
  notifications: [] as Notification[]
});

// Selectors
const userState = appState
  .map(state => state.user)
  .distinctUntilChanged();

const themeState = appState
  .map(state => state.theme)
  .distinctUntilChanged();

// Actions
function login(user: User) {
  appState.update(state => ({
    ...state,
    user
  }));
}

function logout() {
  appState.update(state => ({
    ...state,
    user: null
  }));
}

function toggleTheme() {
  appState.update(state => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light'
  }));
}

// React hook
function useAppState<T>(selector: (state: typeof appState.value) => T) {
  const [value, setValue] = useState(() => selector(appState.value));

  useEffect(() => {
    const flow = appState
      .map(selector)
      .distinctUntilChanged();

    flow.collect(setValue);
  }, [selector]);

  return value;
}

// Usage
function Header() {
  const user = useAppState(state => state.user);
  const theme = useAppState(state => state.theme);

  return (
    <header className={theme}>
      {user ? `Hello, ${user.name}` : 'Guest'}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

---

## Performance Optimization

### Lazy Loading Large Lists

```typescript
import { sequenceOf } from 'kotlinify-ts';

function VirtualList({ items }: { items: any[] }) {
  const [visibleItems, setVisibleItems] = useState<any[]>([]);

  const loadVisible = (startIndex: number, count: number) => {
    // Only process visible items
    const visible = sequenceOf(...items)
      .drop(startIndex)
      .take(count)
      .toArray();

    setVisibleItems(visible);
  };

  return (
    <div onScroll={e => {
      const startIndex = Math.floor(e.currentTarget.scrollTop / ITEM_HEIGHT);
      loadVisible(startIndex, VISIBLE_COUNT);
    }}>
      {visibleItems.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

---

### Memoized Expensive Computations

```typescript
import { let as kLet } from 'kotlinify-ts';

const cache = new Map<string, any>();

function useMemoizedComputation<T>(
  key: string,
  compute: () => T
): T {
  return kLet(cache.get(key), cached =>
    cached ?? kLet(compute(), result => {
      cache.set(key, result);
      return result;
    })
  );
}
```

---

## Error Handling

### Error Boundary with Result

```typescript
import { tryCatch, Result } from 'kotlinify-ts';

function SafeComponent({ data }: { data: any }) {
  const [result, setResult] = useState<Result<JSX.Element>>(
    Success(<div>Loading...</div>)
  );

  useEffect(() => {
    const rendered = tryCatch(() => {
      // Potentially failing render logic
      return <DataView data={processData(data)} />;
    });

    setResult(rendered);
  }, [data]);

  return result.fold(
    error => <ErrorDisplay error={error} />,
    element => element
  );
}
```

---

### Retry Logic

```typescript
import { launch, delay } from 'kotlinify-ts';

async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error as Error;
      await delay(Math.pow(2, i) * 1000);  // Exponential backoff
    }
  }

  throw lastError!;
}

// Usage
const user = await fetchWithRetry(
  () => fetch('/api/user').then(r => r.json()),
  3
);
```

---

## Best Practices

### 1. Always Clean Up Flows

```typescript
useEffect(() => {
  const subscription = flow.collect(setValue);

  return () => {
    // Cleanup
    subscription.cancel?.();
  };
}, [flow]);
```

### 2. Use Debounce for User Input

```typescript
userInput
  .debounce(300)  // Wait for user to finish typing
  .collect(handleSearch);
```

### 3. Use StateFlow for Shared State

```typescript
// ✅ Good
const globalState = new MutableStateFlow(initialValue);

// ❌ Bad
let globalState = initialValue;  // No reactivity
```

### 4. Prefer Result/Option Over Null Checks

```typescript
// ✅ Good
tryCatch(() => JSON.parse(data))
  .map(obj => obj.value)
  .getOrElse(defaultValue);

// ❌ Bad
try {
  const obj = JSON.parse(data);
  return obj.value;
} catch {
  return defaultValue;
}
```
