"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function RangesPage() {
  const basicRangesExample = `import { rangeTo, until, downTo } from 'kotlinify-ts/ranges';

// Create inclusive range (1 to 10)
const range = rangeTo(1, 10);
for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
}

// Create exclusive range (1 until 10)
const exclusive = until(1, 10);
for (const n of exclusive) {
  console.log(n); // 1, 2, 3, 4, 5, 6, 7, 8, 9
}

// Create descending range (10 down to 1)
const descending = downTo(10, 1);
for (const n of descending) {
  console.log(n); // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
}

// Convert to array
const numbers = rangeTo(1, 5).toArray(); // [1, 2, 3, 4, 5]

// Check containment
const isInRange = rangeTo(1, 10).contains(5); // true
const isOutside = until(1, 10).contains(10);  // false`;

  const customStepsExample = `import { rangeTo, downTo, step } from 'kotlinify-ts/ranges';

// Every second number
const evens = step(rangeTo(0, 10), 2);
for (const n of evens) {
  console.log(n); // 0, 2, 4, 6, 8, 10
}

// Every third number
const thirds = step(rangeTo(1, 20), 3);
console.log(thirds.toArray()); // [1, 4, 7, 10, 13, 16, 19]

// Descending with steps
const countdown = step(downTo(100, 0), 10);
console.log(countdown.toArray());
// [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]

// Using withStep method
const multiplesOf5 = rangeTo(0, 50).withStep(5);
// 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50

const oddNumbers = rangeTo(1, 20).withStep(2);
// 1, 3, 5, 7, 9, 11, 13, 15, 17, 19

// Chain with other operations
const squares = rangeTo(1, 10)
  .withStep(2)
  .toArray()
  .map(n => n * n); // [1, 9, 25, 49, 81]`;

  const rangeOperationsExample = `import { rangeTo } from 'kotlinify-ts/ranges';

// Range properties
const range = rangeTo(1, 10);

console.log(range.first());     // 1
console.log(range.last());      // 10
console.log(range.count());     // 10
console.log(range.isEmpty);     // false

// Empty ranges
const empty = rangeTo(10, 1);  // Invalid ascending range
console.log(empty.isEmpty);     // true
console.log(empty.count());     // 0
console.log(empty.toArray());   // []

// Range reversal
const forward = rangeTo(1, 5);
const backward = forward.reversed();
console.log(backward.toArray()); // [5, 4, 3, 2, 1]

// Check membership
const ageRange = rangeTo(18, 65);
const isEligible = ageRange.contains(25); // true
const isTooYoung = ageRange.contains(16); // false

// Iterate with forEach
rangeTo(1, 5).forEach(n => {
  console.log(\`Processing item \${n}\`);
});

// Use with for...of
for (const page of rangeTo(1, totalPages)) {
  await processPa{ page);
}`;

  const practicalUseCasesExample = `import { rangeTo, until, downTo, step } from 'kotlinify-ts/ranges';

// Pagination
function paginate<T>(items: T[], pageSize: number, page: number): T[] {
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);

  return until(start, end)
    .toArray()
    .map(i => items[i]);
}

// Generate test data
const testUsers = rangeTo(1, 100)
  .toArray()
  .map(id => ({
    id,
    name: \`User\${id}\`,
    email: \`user\${id}@example.com\`,
    active: id % 2 === 0
  }));

// Calendar generation
function getDaysInMonth(year: number, month: number): number[] {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return rangeTo(1, lastDay).toArray();
}

// Progress indicators
function renderProgressBar(current: number, total: number, width: number = 50): string {
  const filled = Math.floor((current / total) * width);
  const empty = width - filled;

  const bar = rangeTo(1, filled)
    .toArray()
    .map(() => '█')
    .concat(
      rangeTo(1, empty)
        .toArray()
        .map(() => '░')
    )
    .join('');

  return \`[\${bar}] \${current}/\${total}\`;
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (const attempt of rangeTo(1, maxRetries)) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = Math.pow(2, attempt) * 1000;
      console.log(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Should not reach here');
}

// Generate time slots
function generateTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];

  for (const hour of until(startHour, endHour)) {
    for (const minute of step(until(0, 60), intervalMinutes)) {
      const h = String(hour).padStart(2, '0');
      const m = String(minute).padStart(2, '0');
      slots.push(\`\${h}:\${m}\`);
    }
  }

  return slots;
}

// Grid coordinates
function generateGrid(width: number, height: number): Array<[number, number]> {
  const coordinates: Array<[number, number]> = [];

  for (const y of until(0, height)) {
    for (const x of until(0, width)) {
      coordinates.push([x, y]);
    }
  }

  return coordinates;
}`;

  const performanceExample = `import { rangeTo } from 'kotlinify-ts/ranges';

// Lazy evaluation - ranges don't create arrays until needed
const hugeRange = rangeTo(1, 1_000_000);

// This is instant - no array created
console.log(hugeRange.count()); // 1000000

// Only iterates what's needed
for (const n of hugeRange) {
  if (n > 100) break; // Only processes 100 items
  console.log(n);
}

// Efficient containment checks
const validIds = rangeTo(1000, 9999);
function isValidId(id: number): boolean {
  return validIds.contains(id); // O(1) check
}

// Memory-efficient iteration
function* fibonacci(limit: number) {
  let [a, b] = [0, 1];
  for (const _ of rangeTo(1, limit)) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Process large datasets in chunks
async function processLargeDataset(totalItems: number, batchSize: number) {
  const batches = Math.ceil(totalItems / batchSize);

  for (const batch of rangeTo(1, batches)) {
    const start = (batch - 1) * batchSize;
    const end = Math.min(batch * batchSize, totalItems);

    console.log(\`Processing batch \${batch}/\${batches}\`);
    await processBatch(start, end);
  }
}

// Sampling from large range
function sampleRange(start: number, end: number, samples: number): number[] {
  const range = end - start;
  const step = Math.floor(range / samples);

  return rangeTo(start, end)
    .withStep(step)
    .toArray()
    .slice(0, samples);
}`;

  const kotlinComparisonExample = `// Kotlin vs TypeScript with kotlinify-ts

// Kotlin
for (i in 1..10) {
  println(i)
}

// TypeScript with kotlinify-ts
for (const i of rangeTo(1, 10)) {
  console.log(i)
}

// Kotlin - exclusive range
for (i in 1 until 10) {
  println(i)
}

// TypeScript with kotlinify-ts
for (const i of until(1, 10)) {
  console.log(i)
}

// Kotlin - downward range
for (i in 10 downTo 1) {
  println(i)
}

// TypeScript with kotlinify-ts
for (const i of downTo(10, 1)) {
  console.log(i)
}

// Kotlin - step
for (i in 1..10 step 2) {
  println(i)
}

// TypeScript with kotlinify-ts
for (const i of rangeTo(1, 10).withStep(2)) {
  console.log(i)
}

// Kotlin - range operations
val range = 1..10
println(range.first)
println(range.last)
println(5 in range)

// TypeScript with kotlinify-ts
const range = rangeTo(1, 10);
console.log(range.first());
console.log(range.last());
console.log(range.contains(5));`;

  const javascriptComparisonExample = `// JavaScript traditional approaches vs kotlinify-ts ranges

// Creating number arrays
// JavaScript - verbose and error-prone
const numbers = [];
for (let i = 1; i <= 10; i++) {
  numbers.push(i);
}
// Or with Array.from
const nums = Array.from({ length: 10 }, (_, i) => i + 1);

// kotlinify-ts - clear and concise
const numbers = rangeTo(1, 10).toArray();

// Iterating with steps
// JavaScript - manual increment
for (let i = 0; i <= 100; i += 5) {
  console.log(i);
}

// kotlinify-ts - declarative
for (const i of rangeTo(0, 100).withStep(5)) {
  console.log(i);
}

// Descending iteration
// JavaScript - easy to mess up
for (let i = 10; i >= 1; i--) {
  console.log(i);
}

// kotlinify-ts - intention is clear
for (const i of downTo(10, 1)) {
  console.log(i);
}

// Range checks
// JavaScript - manual comparison
function isInRange(value, min, max) {
  return value >= min && value <= max;
}

// kotlinify-ts - semantic
const range = rangeTo(min, max);
const isInRange = range.contains(value);

// Generating sequences
// JavaScript - imperative loop
const evens = [];
for (let i = 0; i <= 20; i++) {
  if (i % 2 === 0) evens.push(i);
}

// kotlinify-ts - functional and clear
const evens = rangeTo(0, 20).withStep(2).toArray();`;

  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Ranges</h1>
      <p className="text-xl text-gray-300 mb-12">
        Stop writing for loops with off-by-one errors. Express numeric progressions naturally with ranges that actually make sense.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Loop Counter Nightmare"
          description="We've all been there. Is it <= or <? Should i start at 0 or 1? Why is this so hard?"
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Daily Struggle with Loops</h4>
            <CodeBlock
              code={`// Quick, without thinking: does this include 10?
for (let i = 0; i < 10; i++) {
  console.log(i); // 0-9, not including 10
}

// What about this one?
for (let i = 1; i <= 10; i++) {
  console.log(i); // 1-10, including 10
}

// Counting backwards? Hope you got the condition right
for (let i = 10; i >= 0; i--) { // or is it i > 0?
  console.log(i);
}

// Need every 5th number? More mental math
for (let i = 0; i <= 100; i += 5) {
  if (i === 0) continue; // Wait, did we want 0?
  process(i);
}

// Creating an array of numbers? Here comes the boilerplate
const pages = [];
for (let i = 1; i <= totalPages; i++) {
  pages.push(i);
}
// Or this cryptic Array.from incantation
const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

// Every. Single. Time. You write these loops.
// Every. Single. Time. You second-guess the boundary conditions.
// Off-by-one errors are not a joke, they're a lifestyle.`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">Ranges: How Loops Should Have Worked All Along</h4>
            <CodeBlock
              code={`import { rangeTo, until, downTo } from 'kotlinify-ts/ranges';

// Want 1 through 10? Say it.
for (const i of rangeTo(1, 10)) {
  console.log(i); // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
}

// Want 1 up to but not including 10? Say that too.
for (const i of until(1, 10)) {
  console.log(i); // 1, 2, 3, 4, 5, 6, 7, 8, 9
}

// Counting down? Crystal clear.
for (const i of downTo(10, 1)) {
  console.log(i); // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
}

// Every 5th number? Just add a step.
for (const i of rangeTo(0, 100).withStep(5)) {
  process(i); // 0, 5, 10, 15, ..., 100
}

// Need an array? One method.
const pages = rangeTo(1, totalPages).toArray();

// Check if in range? Semantic and obvious.
if (rangeTo(18, 65).contains(age)) {
  console.log("Eligible");
}

// No more off-by-one errors.
// No more boundary confusion.
// Just ranges that work exactly as you'd expect.`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-900/10 border border-slate-700/20 rounded-lg p-4">
              <h4 className="text-slate-500 font-semibold mb-2">No More Errors</h4>
              <p className="text-gray-300 text-sm">
                Inclusive/exclusive is explicit. Off-by-one errors become impossible.
              </p>
            </div>
            <div className="bg-blue-900/10 border border-blue-600/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Express Intent</h4>
              <p className="text-gray-300 text-sm">
                Code reads like English. "1 range to 10" means exactly that.
              </p>
            </div>
            <div className="bg-green-900/10 border border-green-600/20 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Lazy & Efficient</h4>
              <p className="text-gray-300 text-sm">
                Ranges are lazy iterators. No arrays created unless you need them.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Creating Ranges"
          description="Simple, expressive ways to define numeric progressions."
        >
          <CodeBlock code={basicRangesExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Custom Steps"
          description="Skip values with custom step sizes for any progression pattern."
        >
          <CodeBlock code={customStepsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Range Operations"
          description="Query and manipulate ranges with intuitive methods."
        >
          <CodeBlock code={rangeOperationsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Practical Use Cases"
          description="Real-world examples showing how ranges simplify common patterns."
        >
          <CodeBlock code={practicalUseCasesExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Performance Considerations"
          description="Ranges are lazy and memory-efficient by design."
        >
          <CodeBlock code={performanceExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Kotlin Comparison"
          description="How kotlinify-ts ranges match Kotlin's range syntax."
        >
          <CodeBlock code={kotlinComparisonExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="JavaScript Comparison"
          description="See how ranges improve upon traditional JavaScript iteration patterns."
        >
          <CodeBlock code={javascriptComparisonExample} language="typescript" />
        </DocsSection>

        <DocsSection title="API Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-white font-semibold mb-3">Creating Ranges</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">rangeTo(start, end)</code> - Inclusive range [start..end]</li>
                <li><code className="text-slate-500">until(start, end)</code> - Exclusive range [start..end)</li>
                <li><code className="text-slate-500">downTo(start, end)</code> - Descending inclusive range</li>
                <li><code className="text-slate-500">step(range, n)</code> - Set custom step size</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Range Methods</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">contains(value)</code> - Check if value is in range</li>
                <li><code className="text-slate-500">count()</code> - Number of elements in range</li>
                <li><code className="text-slate-500">first()</code> - First element (throws if empty)</li>
                <li><code className="text-slate-500">last()</code> - Last element (throws if empty)</li>
                <li><code className="text-slate-500">reversed()</code> - Reverse the range direction</li>
                <li><code className="text-slate-500">withStep(n)</code> - Create new range with step</li>
                <li><code className="text-slate-500">toArray()</code> - Convert to array of numbers</li>
                <li><code className="text-slate-500">forEach(fn)</code> - Iterate with callback</li>
                <li><code className="text-slate-500">isEmpty</code> - Check if range is empty</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">IntRange Class</h4>
              <ul className="space-y-2 text-sm">
                <li>Implements <code className="text-slate-500">Iterable&lt;number&gt;</code></li>
                <li>Works with <code className="text-slate-500">for...of</code> loops</li>
                <li>Lazy evaluation - no array allocation</li>
                <li>Memory efficient for large ranges</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/collections"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Collections →
            </Link>
            <Link
              href="/docs/strings"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              String Utilities
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}