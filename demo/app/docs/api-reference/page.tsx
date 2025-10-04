"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import Link from "next/link";

export default function ApiReferencePage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">API Reference</h1>
      <p className="text-xl text-gray-300 mb-12">
        Complete reference for all kotlinify-ts functions and types
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-amber-400 font-bold text-lg mt-0.5">⚠️</div>
            <div>
              <h4 className="text-amber-300 font-semibold mb-2">Enable Prototype Extensions for Method Chaining</h4>
              <p className="text-amber-200/90 text-sm mb-2">
                Examples showing method chaining syntax (like <code className="text-amber-100 bg-black/30 px-1 rounded">.let()</code>, <code className="text-amber-100 bg-black/30 px-1 rounded">.apply()</code>) require importing from the main package:
              </p>
              <CodeBlock
                code={`import 'kotlinify-ts'
import { let, apply } from 'kotlinify-ts'`}
                language="typescript"
              />
              <p className="text-amber-200/90 text-sm mt-2">
                <strong>Alternative:</strong> Use function form syntax without the main import (both forms shown in examples below).
              </p>
            </div>
          </div>
        </div>

        <DocsSection title="Scope Functions">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                let&lt;T, R&gt;(value: T, block: (value: T) =&gt; R): R
              </h3>
              <p className="text-gray-300 mb-4">
                Calls the specified function block with the given value as its argument and returns its result.
              </p>
              <CodeBlock
                code={`import 'kotlinify-ts'
import { let } from 'kotlinify-ts';

// Method chaining syntax
const processedData = fetchData()
  .let(data => JSON.parse(data))
  .let(obj => obj.items)
  .let(items => items.filter(x => x.active))
  .let(active => active.map(x => x.name));

// Function form (no main import needed)
const upperName = let({ name: "Alice" }, u => u.name.toUpperCase());

// Null-safe navigation
const email = fetchUser(id)
  ?.let(user => user.profile)
  ?.let(profile => profile.email)
  ?? "no-email@example.com";`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                apply&lt;T&gt;(value: T, block: (value: T) =&gt; void): T
              </h3>
              <p className="text-gray-300 mb-4">
                Calls the specified function block with the given value as its receiver and returns the value.
              </p>
              <CodeBlock
                code={`import { apply } from 'kotlinify-ts';

// Builder pattern - configure and return the same object
const canvas = document.createElement('canvas')
  .apply(el => {
    el.width = 800;
    el.height = 600;
    el.className = "game-canvas";
  })
  .apply(el => document.body.appendChild(el));

// Configure complex objects inline
const request = new XMLHttpRequest()
  .apply(xhr => {
    xhr.open('POST', '/api/data');
    xhr.setRequestHeader('Content-Type', 'application/json');
  })
  .also(xhr => xhr.send(JSON.stringify(data)));`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                also&lt;T&gt;(value: T, block: (value: T) =&gt; void): T
              </h3>
              <p className="text-gray-300 mb-4">
                Calls the specified function block with the given value as its argument and returns the value.
              </p>
              <CodeBlock
                code={`import { also } from 'kotlinify-ts';

// Debug values in a chain without breaking the flow
const processed = fetchUser(id)
  .let(user => user.orders)
  .also(orders => console.log("Found orders:", orders.length))
  .let(orders => orders.filter(o => o.status === "pending"))
  .also(pending => console.log("Pending:", pending.length))
  .let(pending => pending.map(o => o.total));

// Validation and logging
const savedUser = createUser(data)
  .also(user => validateUser(user))
  .also(user => logger.info("Created user:", user.id))
  .also(user => cache.set(user.id, user));`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                run&lt;T, R&gt;(value: T, block: function(): R): R
              </h3>
              <p className="text-gray-300 mb-4">
                Calls the specified function block with the given value as this context and returns its result.
              </p>
              <CodeBlock
                code={`import { run } from 'kotlinify-ts';

const sum = run({ x: 3, y: 4 }, function() {
  return this.x + this.y;
});
// 7

// Chaining with prototype method
const area = { width: 10, height: 5 }
  .run(function() { return this.width * this.height; })
  .let(x => x * 2);
// 100`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                withValue&lt;T, R&gt;(receiver: T, block: function(): R): R
              </h3>
              <p className="text-gray-300 mb-4">
                Calls the specified function block with the given value as this context and returns its result. Similar to run but with different parameter order.
              </p>
              <CodeBlock
                code={`import { withValue, also } from 'kotlinify-ts';

const area = withValue({ width: 10, height: 5 }, function() {
  return this.width * this.height;
});
// 50

// Chaining multiple operations
also(
  withValue({ x: 5, y: 10 }, function() { return this.x * this.y; }),
  result => console.log("Product:", result)
);`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Null Safety">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                takeIf&lt;T&gt;(value: T, predicate: (value: T) =&gt; boolean): T | undefined
              </h3>
              <p className="text-gray-300 mb-4">
                Returns the value if it satisfies the given predicate, otherwise undefined.
              </p>
              <CodeBlock
                code={`import { takeIf } from 'kotlinify-ts/nullsafety';

const positive = takeIf(42, x => x > 0);
// 42

const negative = takeIf(-5, x => x > 0);
// undefined`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                takeUnless&lt;T&gt;(value: T, predicate: (value: T) =&gt; boolean): T | undefined
              </h3>
              <p className="text-gray-300 mb-4">
                Returns the value if it does not satisfy the given predicate, otherwise undefined.
              </p>
              <CodeBlock
                code={`import { takeUnless } from 'kotlinify-ts/nullsafety';

const valid = takeUnless("hello", str => str.length === 0);
// "hello"`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                isNullOrEmpty(value: string | T[] | null | undefined): boolean
              </h3>
              <p className="text-gray-300 mb-4">
                Returns true if the value is null, undefined, or has length 0.
              </p>
              <CodeBlock
                code={`import { isNullOrEmpty } from 'kotlinify-ts/nullsafety';

isNullOrEmpty("");
// true

isNullOrEmpty([]);
// true

isNullOrEmpty("hello");
// false`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                isNullOrBlank(value: string | null | undefined): boolean
              </h3>
              <p className="text-gray-300 mb-4">
                Returns true if the value is null, undefined, or contains only whitespace.
              </p>
              <CodeBlock
                code={`import { isNullOrBlank } from 'kotlinify-ts/nullsafety';

isNullOrBlank("   ");
// true

isNullOrBlank("hello");
// false`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Collections">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                first&lt;T&gt;(array: T[], predicate?: (value: T) =&gt; boolean): T
              </h3>
              <p className="text-gray-300 mb-4">
                Returns the first element, or the first element matching the predicate. Throws if not found.
              </p>
              <CodeBlock
                code={`import { first } from 'kotlinify-ts/collections';

first([1, 2, 3]);
// 1

first([1, 2, 3], x => x > 1);
// 2`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                groupBy&lt;T, K&gt;(array: T[], keySelector: (value: T) =&gt; K): Map&lt;K, T[]&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Groups elements by the key returned by the given keySelector function. Returns a Map for type safety.
              </p>
              <CodeBlock
                code={`import { groupBy } from 'kotlinify-ts/collections';

const groups = groupBy(
  [{ age: 20 }, { age: 30 }, { age: 20 }],
  x => x.age
);
// Map { 20 => [{ age: 20 }, { age: 20 }], 30 => [{ age: 30 }] }

// Access groups using Map methods
groups.get(20); // [{ age: 20 }, { age: 20 }]

// Iterate over groups
for (const [age, items] of groups) {
  console.log(\`Age \${age}: \${items.length} items\`);
}`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                partition&lt;T&gt;(array: T[], predicate: (value: T) =&gt; boolean): [T[], T[]]
              </h3>
              <p className="text-gray-300 mb-4">
                Splits the array into a pair of lists, where the first list contains elements matching the predicate and the second contains elements not matching.
              </p>
              <CodeBlock
                code={`import { partition } from 'kotlinify-ts/collections';

partition([1, 2, 3, 4, 5], x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                chunked&lt;T&gt;(array: T[], size: number): T[][]
              </h3>
              <p className="text-gray-300 mb-4">
                Splits the array into arrays of the given size.
              </p>
              <CodeBlock
                code={`import { chunked } from 'kotlinify-ts/collections';

chunked([1, 2, 3, 4, 5, 6, 7], 3);
// [[1, 2, 3], [4, 5, 6], [7]]`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                windowed&lt;T&gt;(array: T[], size: number, step?: number): T[][]
              </h3>
              <p className="text-gray-300 mb-4">
                Returns a list of sliding windows of the given size with the given step.
              </p>
              <CodeBlock
                code={`import { windowed } from 'kotlinify-ts/collections';

windowed([1, 2, 3, 4, 5], 3, 1);
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                distinctBy&lt;T, K&gt;(array: T[], selector: (value: T) =&gt; K): T[]
              </h3>
              <p className="text-gray-300 mb-4">
                Returns a list containing only elements with distinct keys returned by the selector.
              </p>
              <CodeBlock
                code={`import { distinctBy } from 'kotlinify-ts/collections';

distinctBy(
  [{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 1, name: "C" }],
  x => x.id
);
// [{ id: 1, name: "A" }, { id: 2, name: "B" }]`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Sequences">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Sequence&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                A lazy evaluated collection that performs operations only when terminal operations are called.
              </p>
              <CodeBlock
                code={`import { asSequence } from 'kotlinify-ts/sequences';

asSequence([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .toArray();
// [4, 16]`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                sequenceOf&lt;T&gt;(...elements: T[]): Sequence&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Creates a sequence from the given elements.
              </p>
              <CodeBlock
                code={`import { sequenceOf } from 'kotlinify-ts/sequences';

sequenceOf(1, 2, 3, 4, 5)
  .take(3)
  .toArray();
// [1, 2, 3]`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                generateSequence&lt;T&gt;(seed: T, nextFunction: (current: T) =&gt; T | null): Sequence&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Creates an infinite sequence starting with seed and continuing with values generated by nextFunction.
              </p>
              <CodeBlock
                code={`import { generateSequence } from 'kotlinify-ts/sequences';

generateSequence(1, x => x + 1)
  .take(5)
  .toArray();
// [1, 2, 3, 4, 5]`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Monads">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Option&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Represents a value that may or may not exist. Use Some for values and None for absence.
              </p>
              <CodeBlock
                code={`import { Option, Some, None, fromNullable } from 'kotlinify-ts/monads';

fromNullable(findUser(id))
  .map(user => user.email)
  .getOrElse("No email");`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Either&lt;L, R&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Represents a value that is either Left (failure) or Right (success).
              </p>
              <CodeBlock
                code={`import { Either, Left, Right } from 'kotlinify-ts/monads';

function divide(a: number, b: number): Either<string, number> {
  return b === 0 ? Left("Division by zero") : Right(a / b);
}

divide(10, 2)
  .map(x => x * 2)
  .fold(
    error => console.error(error),
    result => console.log(result)
  );`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Result&lt;T, E&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Wraps operation outcomes with detailed success or failure information.
              </p>
              <CodeBlock
                code={`import { Result, tryCatch } from 'kotlinify-ts/monads';

tryCatch(() => JSON.parse(data))
  .map(obj => obj.value)
  .onSuccess(value => console.log(value))
  .onFailure(error => console.error(error))
  .getOrElse(defaultValue);`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Flow">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Flow&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                A cold asynchronous stream that emits values sequentially.
              </p>
              <CodeBlock
                code={`import { flow } from 'kotlinify-ts/flow';

const numbersFlow = flow(async function*() {
  for (let i = 0; i < 10; i++) {
    yield i;
  }
});

numbersFlow
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .collect(x => console.log(x));`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class StateFlow&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                A hot flow that represents a state with a current value.
              </p>
              <CodeBlock
                code={`import { MutableStateFlow } from 'kotlinify-ts/flow';

const counter = new MutableStateFlow(0);

counter.collect(value => console.log("Count:", value));

counter.emit(1);
counter.emit(2);`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class SharedFlow&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                A hot flow that shares emitted values among multiple collectors.
              </p>
              <CodeBlock
                code={`import { MutableSharedFlow } from 'kotlinify-ts/flow';

const events = new MutableSharedFlow({ replay: 1 });

events.collect(event => console.log("Subscriber 1:", event));
events.collect(event => console.log("Subscriber 2:", event));

events.emit("Event A");`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Coroutines">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                launch(block: (this: Job) =&gt; void | Promise&lt;void&gt;): Job
              </h3>
              <p className="text-gray-300 mb-4">
                Launches a new coroutine without blocking the current thread and returns a Job.
              </p>
              <CodeBlock
                code={`import { launch, delay } from 'kotlinify-ts/coroutines';

const job = launch(async function() {
  await delay(1000);
  console.log("Done!");
});

job.cancel();`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                async&lt;T&gt;(block: () =&gt; Promise&lt;T&gt;): Deferred&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Creates a coroutine and returns a Deferred that represents its future result.
              </p>
              <CodeBlock
                code={`import { async } from 'kotlinify-ts/coroutines';

const deferred = async(async () => {
  return fetchData();
});

const result = await deferred.await();`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                withTimeout&lt;T&gt;(timeoutMs: number, block: () =&gt; Promise&lt;T&gt;): Promise&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Runs the given block with a timeout. Throws TimeoutError if the timeout is exceeded.
              </p>
              <CodeBlock
                code={`import { withTimeout } from 'kotlinify-ts/coroutines';

const result = await withTimeout(5000, async () => {
  return await fetchData();
});`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Channels">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                class Channel&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                A concurrent communication primitive for sending and receiving values between coroutines.
              </p>
              <CodeBlock
                code={`import { Channel } from 'kotlinify-ts/channels';

const channel = new Channel<number>();

await channel.send(1);
await channel.send(2);
channel.close();

for await (const value of channel) {
  console.log(value);
}`}
                language="typescript"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                produce&lt;T&gt;(block: (channel: SendChannel&lt;T&gt;) =&gt; Promise&lt;void&gt;): ReceiveChannel&lt;T&gt;
              </h3>
              <p className="text-gray-300 mb-4">
                Creates a coroutine that produces values and sends them to a channel.
              </p>
              <CodeBlock
                code={`import { produce } from 'kotlinify-ts/channels';

const numbers = produce(async (channel) => {
  for (let i = 0; i < 10; i++) {
    await channel.send(i);
  }
});

for await (const num of numbers) {
  console.log(num);
}`}
                language="typescript"
              />
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/quickstart"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Quickstart Guide
            </Link>
            <Link
              href="https://github.com/maxzillabong/kotlinify-ts"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
