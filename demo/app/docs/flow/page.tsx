"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function FlowPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Flow Streams</h1>
      <p className="text-xl text-gray-300 mb-12">
        RxJS is overkill for most apps. Get reactive programming that doesn't require a PhD to understand.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Reactive Programming Dilemma"
          description="You need reactive streams, but RxJS feels like bringing a spaceship to drive to work."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The RxJS Learning Cliff</h4>
            <CodeBlock
              code={`// "Simple" WebSocket handling with RxJS
import { webSocket } from 'rxjs/webSocket';
import {
  retry, retryWhen, delay, scan, catchError,
  switchMap, exhaustMap, mergeMap, concatMap,
  debounceTime, distinctUntilChanged, takeUntil,
  shareReplay, startWith, tap, filter
} from 'rxjs/operators';

const socket$ = webSocket('ws://localhost:8080').pipe(
  retryWhen(errors$ =>
    errors$.pipe(
      scan((acc, error) => ({ ...acc, count: acc.count + 1 }), { count: 0 }),
      tap(({ count }) => console.log(\`Retry #\${count}\`)),
      delay(1000),
      filter(({ count }) => count < 5)
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

// Your team: "What does switchMap do again?"
// You: "It's like flatMap but cancels previous... wait no that's exhaustMap"
// New dev: "I'll just use promises"

// 200+ operators. Marble diagrams. Hot vs Cold confusion.
// Subscription management. Memory leak paranoia.
// Is this really better than callbacks?`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">Flow: Reactive Programming for Humans</h4>
            <CodeBlock
              code={`import { callbackFlow, retryWhen, delay } from 'kotlinify-ts/flow';

// WebSocket with auto-reconnect - actually readable
const socketFlow = callbackFlow<Message>(scope => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (e) => scope.emit(JSON.parse(e.data));
  ws.onerror = (e) => scope.error(e);
  ws.onclose = () => scope.close();

  scope.onClose(() => ws.close());
})
.retryWhen((attempt, error) => {
  console.log(\`Retry #\${attempt}: \${error.message}\`);
  return attempt < 5; // Simple: retry up to 5 times
})
.delay(1000); // Wait 1s between retries

// Use it - no PhD required
await socketFlow
  .filter(msg => msg.type === 'update')
  .map(msg => msg.data)
  .collect(data => updateUI(data));

// That's it. No marble diagrams. No subscription management.
// Just data flowing through transformations.`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">RxJS Complexity</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 200+ operators to learn</li>
                <li>• Subscription management</li>
                <li>• Scheduler confusion</li>
                <li>• Memory leak footguns</li>
              </ul>
            </div>
            <div className="bg-yellow-900/10 border border-yellow-600/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Manual Event Handling</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Callback hell returns</li>
                <li>• No composition</li>
                <li>• Manual cleanup everywhere</li>
                <li>• State synchronization bugs</li>
              </ul>
            </div>
            <div className="bg-green-900/10 border border-green-600/20 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Flow Balance</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 30 intuitive operators</li>
                <li>• Auto cleanup with scopes</li>
                <li>• Built-in backpressure</li>
                <li>• StateFlow for UI state</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-900/10 border border-slate-700/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-500 mb-3">Real-World Flow Use Cases</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-white font-medium mb-2">UI State Management</h5>
                <p className="text-gray-300 text-sm">
                  StateFlow replaces Redux/MobX with 10× less boilerplate. One source of truth, automatic updates.
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-2">WebSocket Streams</h5>
                <p className="text-gray-300 text-sm">
                  Handle real-time data with automatic reconnection, buffering, and error recovery.
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-2">Event Processing</h5>
                <p className="text-gray-300 text-sm">
                  Debounce searches, throttle scrolls, combine user inputs - without the complexity.
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-2">Data Pipelines</h5>
                <p className="text-gray-300 text-sm">
                  Transform API responses through multiple stages with backpressure handling.
                </p>
              </div>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Creating Flows"
          description="Multiple ways to create flows from values, generators, arrays, or callbacks."
        >
          <CodeBlock
            code={`import { flow, flowOf, asFlow, callbackFlow } from 'kotlinify-ts/flow';

// From values
await flowOf(1, 2, 3, 4, 5)
  .map(x => x * 2)
  .filter(x => x > 5)
  .collect(console.log); // 6, 8, 10

// From async generator
const timerFlow = flow(async function* () {
  for (let i = 0; i < 5; i++) {
    yield i;
    await new Promise(r => setTimeout(r, 1000));
  }
});

await timerFlow
  .map(x => \`Tick \${x}\`)
  .collect(console.log); // Tick 0, Tick 1, ...

// From arrays or iterables
await asFlow([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .collect(console.log); // 2, 4

// From callbacks (for event streams)
const clickFlow = callbackFlow<MouseEvent>(scope => {
  const handler = (e: MouseEvent) => scope.emit(e);
  document.addEventListener('click', handler);

  scope.onClose(() => {
    document.removeEventListener('click', handler);
  });
});

await clickFlow
  .map(e => ({ x: e.clientX, y: e.clientY }))
  .collect(pos => console.log(\`Clicked at \${pos.x}, \${pos.y}\`));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Transformation Operators"
          description="Rich set of operators for transforming, filtering, and controlling flow emissions."
        >
          <CodeBlock
            code={`import { flowOf } from 'kotlinify-ts/flow';

// Basic transformations
await flowOf(1, 2, 3, 4, 5)
  .map(x => x * x)                    // Square each value
  .filter(x => x > 10)                // Keep only > 10
  .take(2)                             // Take first 2
  .collect(console.log);               // 16, 25

// Distinct and debouncing
await userInputFlow()
  .debounce(300)                      // Wait 300ms of inactivity
  .distinctUntilChanged()              // Skip consecutive duplicates
  .map(query => searchAPI(query))
  .collect(results => displayResults(results));

// Throttling for rate limiting
await scrollEventFlow()
  .throttle(100)                      // Max 1 emission per 100ms
  .map(e => window.scrollY)
  .distinctUntilChanged()
  .collect(position => updateScrollIndicator(position));

// Sampling periodic snapshots
await sensorDataFlow()
  .sample(1000)                       // Emit latest value every second
  .map(reading => reading.temperature)
  .collect(temp => updateDisplay(temp));

// Buffering for batch processing
await dataStream()
  .buffer(100)                        // Process in batches of 100
  .map(batch => processBatch(batch))
  .collect(results => saveResults(results));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Advanced Transformations"
          description="Powerful operators for complex flow transformations and flattening strategies."
        >
          <CodeBlock
            code={`import { flowOf, flow } from 'kotlinify-ts/flow';

// Custom transformation with multiple emissions
await flowOf(1, 2, 3)
  .transform(async (value, emit) => {
    await emit(value);
    await emit(value * 10);
    await emit(value * 100);
  })
  .collect(console.log); // 1, 10, 100, 2, 20, 200, 3, 30, 300

// Scan for running calculations
await flowOf(1, 2, 3, 4, 5)
  .scan(0, (sum, value) => sum + value)
  .collect(console.log); // 0, 1, 3, 6, 10, 15

// Add index to values
await flowOf('a', 'b', 'c')
  .withIndex()
  .collect(([index, value]) =>
    console.log(\`\${index}: \${value}\`)
  ); // 0: a, 1: b, 2: c

// FlatMap strategies
const searchFlow = (query: string) => flow(async function* () {
  const results = await searchAPI(query);
  for (const result of results) yield result;
});

// flatMapConcat: Process sequentially
await flowOf('kotlin', 'typescript', 'rust')
  .flatMapConcat(query => searchFlow(query))
  .collect(console.log); // All kotlin results, then typescript, then rust

// flatMapMerge: Process in parallel (with concurrency limit)
await flowOf('kotlin', 'typescript', 'rust')
  .flatMapMerge(2, query => searchFlow(query))
  .collect(console.log); // Results arrive as they complete, max 2 concurrent

// flatMapLatest: Cancel previous on new emission
await userInputFlow()
  .debounce(300)
  .flatMapLatest(query => searchFlow(query))
  .collect(displayResults); // Cancels previous search on new input`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="StateFlow - Reactive State Management"
          description="StateFlow holds a single value and emits updates to all collectors. Perfect for UI state management."
        >
          <CodeBlock
            code={`import { MutableStateFlow } from 'kotlinify-ts/flow';

// Create reactive state
const counter = new MutableStateFlow(0);
const user = new MutableStateFlow<User | null>(null);
const theme = new MutableStateFlow<'light' | 'dark'>('light');

// Read current value synchronously
console.log(counter.value); // 0

// Update state
counter.value = 5;
counter.update(current => current + 1); // Functional update
user.value = { id: 1, name: 'Alice' };

// Compare and set atomically
const wasUpdated = counter.compareAndSet(6, 10);
console.log(wasUpdated); // true if was 6, false otherwise

// Subscribe to changes (always emits current value first)
await counter.collect(count => {
  console.log(\`Count: \${count}\`);
}); // Immediately emits 10, then future updates

// Combine multiple states
const appState = new MutableStateFlow({
  user: null as User | null,
  theme: 'light' as Theme,
  notifications: [] as Notification[]
});

// React component example
function useFlowState<T>(flow: StateFlow<T>) {
  const [value, setValue] = useState(flow.value);

  useEffect(() => {
    const job = launch(() =>
      flow.collect(setValue)
    );
    return () => job.cancel();
  }, [flow]);

  return value;
}

// WebSocket connection state
const connectionState = new MutableStateFlow<
  'disconnected' | 'connecting' | 'connected' | 'error'
>('disconnected');

websocket.onopen = () => connectionState.value = 'connected';
websocket.onerror = () => connectionState.value = 'error';
websocket.onclose = () => connectionState.value = 'disconnected';

await connectionState
  .distinctUntilChanged()
  .collect(state => updateConnectionUI(state));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="SharedFlow - Event Broadcasting"
          description="SharedFlow broadcasts values to multiple collectors without state. Configurable replay and buffering."
        >
          <CodeBlock
            code={`import { MutableSharedFlow, SharedFlow } from 'kotlinify-ts/flow';

// Basic event bus
const events = new MutableSharedFlow<AppEvent>();

// With replay cache (new subscribers get last N values)
const messages = new MutableSharedFlow<Message>({
  replay: 5  // New collectors get last 5 messages
});

// With buffer for handling slow collectors
const dataStream = new MutableSharedFlow<Data>({
  replay: 0,
  extraBufferCapacity: 64,
  onBufferOverflow: 'DROP_OLDEST' // or 'DROP_LATEST', 'SUSPEND'
});

// Emit events
await events.emit({ type: 'user-login', userId: 123 });
events.tryEmit({ type: 'page-view', path: '/home' }); // Non-suspending

// Multiple collectors
await Promise.all([
  events.collect(e => logEvent(e)),
  events.collect(e => sendAnalytics(e)),
  events.collect(e => updateUI(e))
]);

// Check active subscriptions
console.log(events.subscriptionCount); // 3

// Access replay cache
console.log(messages.replayCache); // Array of last N messages

// Clean up
events.resetReplayCache();
events.cancelAll(); // Cancel all collectors

// Real-world: WebSocket message distribution
const wsMessages = new MutableSharedFlow<WSMessage>({ replay: 1 });

websocket.onmessage = (e) => {
  const message = JSON.parse(e.data);
  wsMessages.tryEmit(message);
};

// Different components subscribe to different message types
await wsMessages
  .filter(msg => msg.type === 'chat')
  .collect(msg => displayChatMessage(msg));

await wsMessages
  .filter(msg => msg.type === 'notification')
  .collect(msg => showNotification(msg));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Combining Flows"
          description="Combine multiple flows to create complex reactive data pipelines."
        >
          <CodeBlock
            code={`import { combine, zip, merge, flowOf } from 'kotlinify-ts/flow';

// Combine: Emits when any flow emits (after all have emitted once)
const userFlow = new MutableStateFlow(currentUser);
const settingsFlow = new MutableStateFlow(currentSettings);
const themeFlow = new MutableStateFlow(currentTheme);

await combine(
  userFlow,
  settingsFlow,
  (user, settings) => ({ user, settings })
)
  .collect(state => renderApp(state));
// Emits whenever user OR settings change

// Zip: Pairs values from flows
const questionsFlow = flowOf('Name?', 'Age?', 'City?');
const answersFlow = flowOf('Alice', '25', 'NYC');

await zip(
  questionsFlow,
  answersFlow,
  (q, a) => \`\${q} \${a}\`
)
  .collect(console.log);
// "Name? Alice", "Age? 25", "City? NYC"

// Merge: Combine emissions from multiple flows
const mouseFlow = callbackFlow(/* mouse events */);
const keyboardFlow = callbackFlow(/* keyboard events */);
const touchFlow = callbackFlow(/* touch events */);

await merge(mouseFlow, keyboardFlow, touchFlow)
  .throttle(50)
  .collect(event => handleUserInput(event));

// Real-world: Form validation
const emailFlow = new MutableStateFlow('');
const passwordFlow = new MutableStateFlow('');

await combine(
  emailFlow,
  passwordFlow,
  (email, password) => ({
    email,
    password,
    isValid: email.includes('@') && password.length >= 8
  })
)
  .distinctUntilChangedBy(state => state.isValid)
  .collect(state => {
    submitButton.disabled = !state.isValid;
  });`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Terminal Operations"
          description="Collect flow values into different forms or compute aggregations."
        >
          <CodeBlock
            code={`import { flowOf } from 'kotlinify-ts/flow';

// Collect to collections
const array = await flowOf(1, 2, 3).toArray();        // [1, 2, 3]
const list = await flowOf(1, 2, 3).toList();         // [1, 2, 3]
const set = await flowOf(1, 1, 2, 3).toSet();        // Set{1, 2, 3}

// First and last
const first = await flowOf(1, 2, 3).first();         // 1
const last = await flowOf(1, 2, 3).last();           // 3
const firstOrNull = await flowOf<number>().firstOrNull(); // null

// Single value (throws if not exactly one)
const single = await flowOf(42).single();            // 42
const singleOrNull = await flowOf(1, 2).singleOrNull(); // null

// Aggregations
const sum = await flowOf(1, 2, 3, 4)
  .reduce((a, b) => a + b);                          // 10

const product = await flowOf(1, 2, 3, 4)
  .fold(1, (acc, value) => acc * value);             // 24

const count = await flowOf(1, 2, 3).count();         // 3

// Predicates
const hasEven = await flowOf(1, 3, 5, 6)
  .any(x => x % 2 === 0);                            // true

const allPositive = await flowOf(1, 2, 3)
  .all(x => x > 0);                                  // true

const noneNegative = await flowOf(1, 2, 3)
  .none(x => x < 0);                                 // true

// Real-world: API response validation
const isValid = await apiResponseFlow()
  .map(response => response.data)
  .all(data => data.status === 'success');

const errorCount = await logFlow()
  .filter(log => log.level === 'ERROR')
  .count();`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Error Handling & Resilience"
          description="Handle errors gracefully with retry strategies and fallback mechanisms."
        >
          <CodeBlock
            code={`import { flow, flowOf } from 'kotlinify-ts/flow';

// Catch and handle errors
await flow(async function* () {
  yield 1;
  yield 2;
  throw new Error('Something went wrong');
  yield 3; // Never reached
})
  .catch(error => console.error('Caught:', error.message))
  .collect(console.log); // 1, 2, then error logged

// Retry with fixed attempts
await fetchDataFlow()
  .retry(3) // Retry up to 3 times on error
  .collect(data => processData(data));

// Retry with custom logic
await apiFlow()
  .retryWhen((error, attempt) => {
    if (error.code === 'RATE_LIMIT') {
      return attempt < 5; // Retry rate limits up to 5 times
    }
    return false; // Don't retry other errors
  })
  .collect(response => handleResponse(response));

// Default values for empty flows
await possiblyEmptyFlow()
  .defaultIfEmpty({ id: 0, name: 'Default' })
  .collect(console.log); // Emits default if flow is empty

// Handle empty flows
await searchFlow(query)
  .onEmpty(() => console.log('No results found'))
  .collect(result => displayResult(result));

// Lifecycle hooks for cleanup
await resourceFlow()
  .onStart(() => console.log('Starting flow'))
  .onEach(value => console.log('Processing:', value))
  .onCompletion(() => console.log('Flow completed'))
  .catch(error => console.error('Flow error:', error))
  .collect(value => processValue(value));

// Real-world: Resilient API polling
const pollAPI = () => flow(async function* () {
  while (true) {
    try {
      const data = await fetchAPI();
      yield data;
    } catch (error) {
      console.error('Poll failed:', error);
      yield null; // Emit null on error
    }
    await new Promise(r => setTimeout(r, 5000));
  }
});

await pollAPI()
  .filter(data => data !== null)
  .retryWhen((error, attempt) => {
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    return new Promise(resolve =>
      setTimeout(() => resolve(attempt < 10), delay)
    );
  })
  .collect(data => updateDashboard(data));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Real-World Examples"
          description="Practical patterns for common reactive programming scenarios."
        >
          <CodeBlock
            code={`import { MutableStateFlow, MutableSharedFlow, callbackFlow, flow, combine } from 'kotlinify-ts/flow';

// 1. Search with debounce and cancellation
const searchInput = new MutableStateFlow('');

searchInput
  .debounce(300)
  .filter(query => query.length > 2)
  .distinctUntilChanged()
  .flatMapLatest(query =>
    flow(async function* () {
      const results = await searchAPI(query);
      yield* results;
    })
  )
  .catch(error => {
    console.error('Search failed:', error);
    return [];
  })
  .collect(results => renderSearchResults(results));

// 2. WebSocket reconnection with exponential backoff
const createWebSocketFlow = () => callbackFlow<MessageEvent>(scope => {
  let ws: WebSocket;
  let reconnectDelay = 1000;

  const connect = () => {
    ws = new WebSocket('wss://api.example.com');

    ws.onmessage = (e) => scope.emit(e);
    ws.onopen = () => {
      console.log('Connected');
      reconnectDelay = 1000; // Reset delay
    };
    ws.onerror = (e) => console.error('WebSocket error:', e);
    ws.onclose = () => {
      if (scope.isActive) {
        setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      }
    };
  };

  connect();
  scope.onClose(() => ws?.close());
});

await createWebSocketFlow()
  .map(e => JSON.parse(e.data))
  .filter(msg => msg.type === 'data')
  .collect(data => processRealtimeData(data));

// 3. Infinite scroll with pagination
const scrollFlow = callbackFlow<number>(scope => {
  const handler = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      scope.emit(Math.floor(scrollTop / 1000)); // Page number
    }
  };

  window.addEventListener('scroll', handler);
  scope.onClose(() => window.removeEventListener('scroll', handler));
});

const currentPage = new MutableStateFlow(0);

await scrollFlow
  .distinctUntilChanged()
  .collect(page => {
    currentPage.value = page;
    loadMoreContent(page);
  });

// 4. Real-time collaborative editing
interface Edit { userId: string; changes: any; timestamp: number; }

const localEdits = new MutableSharedFlow<Edit>();
const remoteEdits = new MutableSharedFlow<Edit>();
const documentState = new MutableStateFlow(initialDocument);

await merge(localEdits, remoteEdits)
  .scan(initialDocument, (doc, edit) => applyEdit(doc, edit))
  .distinctUntilChanged()
  .collect(doc => {
    documentState.value = doc;
    renderDocument(doc);
  });

// 5. System monitoring dashboard
const cpuFlow = flow(async function* () {
  while (true) {
    yield await getCPUUsage();
    await new Promise(r => setTimeout(r, 1000));
  }
});

const memoryFlow = flow(async function* () {
  while (true) {
    yield await getMemoryUsage();
    await new Promise(r => setTimeout(r, 1000));
  }
});

await combine(
  cpuFlow.throttle(5000),
  memoryFlow.throttle(5000),
  (cpu, memory) => ({ cpu, memory, timestamp: Date.now() })
)
  .scan([], (history, stats) =>
    [...history.slice(-59), stats].slice(-60) // Keep last minute
  )
  .collect(history => renderChart(history));`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Best Practices"
          description="Guidelines for effective Flow usage in production applications."
        >
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">✓ Do</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Use StateFlow for UI state that needs current value access</li>
                <li>• Use SharedFlow for events without state</li>
                <li>• Apply backpressure strategies (buffer, conflate, sample) for high-frequency streams</li>
                <li>• Clean up with onClose() in callbackFlow</li>
                <li>• Use distinctUntilChanged() to avoid unnecessary updates</li>
                <li>• Prefer cold flows for one-time operations</li>
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">✗ Don't</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Don't forget to handle errors with catch()</li>
                <li>• Don't create flows in tight loops</li>
                <li>• Don't ignore backpressure in high-frequency streams</li>
                <li>• Don't forget to cancel collectors when done</li>
                <li>• Don't use SharedFlow when you need the current value</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/coroutines"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              <h3 className="text-white font-semibold mb-2">Coroutines</h3>
              <p className="text-gray-400 text-sm">
                Structured concurrency for managing Flow lifecycles
              </p>
            </Link>
            <Link
              href="/docs/sequences"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              <h3 className="text-white font-semibold mb-2">Sequences</h3>
              <p className="text-gray-400 text-sm">
                Lazy synchronous sequences for data transformation
              </p>
            </Link>
            <Link
              href="/docs/channels"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              <h3 className="text-white font-semibold mb-2">Channels</h3>
              <p className="text-gray-400 text-sm">
                Communication primitives for coroutines
              </p>
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
