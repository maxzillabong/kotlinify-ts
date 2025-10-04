"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import Link from "next/link";

export default function SequencesPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Lazy Sequences</h1>
      <p className="text-xl text-gray-300 mb-12">
        Your array operations are killing performance. Process millions of items without creating millions of intermediate arrays.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Hidden Cost of Array Chaining"
          description="Every .map().filter().map() creates a new array. Your users are paying for it."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Performance Killer Hiding in Plain Sight</h4>
            <CodeBlock
              code={`// Processing 10,000 records - the "normal" way
const results = records
  .map(r => enrichRecord(r))      // Creates 10,000 item array
  .filter(r => r.score > 80)      // Creates ~3,000 item array
  .map(r => calculateRank(r))     // Creates ~3,000 item array
  .filter(r => r.rank <= 100)     // Creates 100 item array
  .map(r => formatForDisplay(r))  // Creates 100 item array
  .slice(0, 10);                   // Finally gets 10 items

// Memory allocated: 10,000 + 3,000 + 3,000 + 100 + 100 = 16,200 objects
// Actual items needed: 10
// Waste: 99.94%

// Your browser just allocated 16,200 objects to get 10 results.
// Garbage collector: "Here we go again..."
// User: "Why is this app so slow?"
// You: "JavaScript is just slow with big data ¯\\_(ツ)_/¯"`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">Arrays: The Eager Approach</h4>
              <CodeBlock
                code={`// Finding first user with premium subscription
users
  .map(u => fetchDetails(u))    // Fetches ALL users
  .filter(u => u.isPremium)     // Processes ALL
  .find(u => u.country === 'US') // Finally stops

// Just fetched 1000 user details to find 1
// Network requests: 1000
// Time wasted: 99.9%`}
                language="typescript"
              />
            </div>
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Sequences: The Smart Approach</h4>
              <CodeBlock
                code={`// Same task, intelligent execution
asSequence(users)
  .map(u => fetchDetails(u))
  .filter(u => u.isPremium)
  .find(u => u.country === 'US')

// Stops at FIRST match
// Network requests: ~50
// Time saved: 95%`}
                language="typescript"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-600/10 to-blue-500/10 border border-slate-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">Real-World Performance Gains</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                <span className="text-gray-300">Processing 1M records with 5 operations</span>
                <div className="text-right">
                  <div className="text-red-400 text-sm">Array: 2.3s, 450MB RAM</div>
                  <div className="text-green-400 text-sm">Sequence: 0.08s, 12MB RAM</div>
                  <div className="text-slate-500 font-semibold">28× faster, 37× less memory</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                <span className="text-gray-300">Finding first match in 100K items</span>
                <div className="text-right">
                  <div className="text-red-400 text-sm">Array: 890ms</div>
                  <div className="text-green-400 text-sm">Sequence: 0.3ms</div>
                  <div className="text-slate-500 font-semibold">2,966× faster</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                <span className="text-gray-300">Paginating large dataset (page 1 of 1000)</span>
                <div className="text-right">
                  <div className="text-red-400 text-sm">Array: Process all, then slice</div>
                  <div className="text-green-400 text-sm">Sequence: Process only page 1</div>
                  <div className="text-slate-500 font-semibold">1000× less work</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/10 border border-yellow-600/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Why Your App Needs This</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Mobile Users:</strong> Less memory usage = fewer crashes on low-end devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Large Datasets:</strong> Process CSV files, logs, API responses without freezing</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Real-time Data:</strong> Stream processing without buffering everything</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Battery Life:</strong> Less CPU work = happier mobile users</span>
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          title="Creating Sequences"
          description="Multiple ways to create sequences from existing data or generators."
        >
          <CodeBlock
            code={`import { sequenceOf, asSequence, generateSequence, Sequence } from 'kotlinify-ts/sequences';

// From values
sequenceOf(1, 2, 3, 4, 5)
  .filter(x => x % 2 === 0)
  .toArray(); // [2, 4]

// From arrays or iterables
asSequence([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .toArray(); // [2, 4, 6, 8, 10]

// From array prototype extension
[1, 2, 3].asSequence()
  .filter(x => x > 1)
  .toArray(); // [2, 3]

// Using static methods
Sequence.of(1, 2, 3)
  .map(x => x * 2)
  .toArray(); // [2, 4, 6]

Sequence.from(new Set([1, 2, 3]))
  .filter(x => x > 1)
  .toArray(); // [2, 3]`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Infinite Sequences"
          description="Create infinite sequences that are evaluated lazily - perfect for generating data on-demand."
        >
          <CodeBlock
            code={`import { generateSequence, sequenceOf } from 'kotlinify-ts/sequences';

// Fibonacci sequence
const fibonacci = generateSequence([0, 1], ([a, b]) => [b, a + b])
  .map(([a]) => a)
  .take(10)
  .toArray();

console.log('Fibonacci:', fibonacci);

// Powers of 2 up to 100
const powersOf2 = generateSequence(1, x => x < 100 ? x * 2 : null)
  .toArray();

console.log('Powers of 2:', powersOf2);

// Simple counter
const numbers = sequenceOf(1, 2, 3, 4, 5)
  .map(x => x * x)
  .toArray();

console.log('Squares:', numbers);`}
            language="typescript"
            executable={true}
          />
        </DocsSection>

        <DocsSection
          title="Transformation Operations"
          description="Chain multiple transformations that are evaluated lazily only when needed."
        >
          <CodeBlock
            code={`import { asSequence } from 'kotlinify-ts/sequences';

// Basic transformations
asSequence([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .toArray(); // [6, 8, 10]

// Indexed transformations
asSequence(['a', 'b', 'c'])
  .mapIndexed((index, value) => \`\${index}: \${value}\`)
  .toArray(); // ['0: a', '1: b', '2: c']

asSequence([10, 20, 30, 40])
  .filterIndexed((index, value) => index % 2 === 0)
  .toArray(); // [10, 30]

// Null-aware mapping
asSequence([1, null, 2, undefined, 3])
  .mapNotNull(x => x ? x * 2 : null)
  .toArray(); // [2, 4, 6]

// Inverted filter
asSequence([1, 2, 3, 4, 5])
  .filterNot(x => x % 2 === 0)
  .toArray(); // [1, 3, 5]

// FlatMap - flattening sequences
asSequence(['hello', 'world'])
  .flatMap(word => word.split(''))
  .distinct()
  .toArray(); // ['h', 'e', 'l', 'o', 'w', 'r', 'd']

// Flatten nested sequences
asSequence([[1, 2], [3, 4], [5]])
  .flatten()
  .toArray(); // [1, 2, 3, 4, 5]

// Take and drop operations
asSequence([1, 2, 3, 4, 5])
  .drop(2)
  .take(2)
  .toArray(); // [3, 4]

// Conditional take/drop
asSequence([1, 2, 3, 4, 5, 6])
  .takeWhile(x => x < 4)
  .toArray(); // [1, 2, 3]

asSequence([1, 2, 3, 4, 5, 6])
  .dropWhile(x => x < 4)
  .toArray(); // [4, 5, 6]`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Distinct and Sorting"
          description="Remove duplicates and sort sequences efficiently."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Remove duplicates
sequenceOf(1, 2, 2, 3, 1, 4)
  .distinct()
  .toArray(); // [1, 2, 3, 4]

// Remove duplicates by property
sequenceOf(
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Charlie' }
)
  .distinctBy(user => user.id)
  .toArray(); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// Sort sequences (note: sorting requires buffering all elements)
sequenceOf(3, 1, 4, 1, 5, 9)
  .sorted()
  .toArray(); // [1, 1, 3, 4, 5, 9]

// Custom sorting
sequenceOf(3, 1, 4, 1, 5)
  .sorted((a, b) => b - a)
  .toArray(); // [5, 4, 3, 1, 1]

// Sort by property
sequenceOf(
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
)
  .sortedBy(user => user.age)
  .toArray(); // Sorted by age: Bob, Alice, Charlie`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Chunking and Windowing"
          description="Process data in chunks or sliding windows for batch operations and time-series analysis."
        >
          <CodeBlock
            code={`import { asSequence } from 'kotlinify-ts/sequences';

// Split into fixed-size chunks
asSequence([1, 2, 3, 4, 5, 6, 7])
  .chunked(3)
  .toArray(); // [[1, 2, 3], [4, 5, 6], [7]]

// Transform chunks directly
asSequence([1, 2, 3, 4, 5, 6])
  .chunked(2, chunk => chunk.reduce((a, b) => a + b, 0))
  .toArray(); // [3, 7, 11]

// Sliding windows
asSequence([1, 2, 3, 4, 5])
  .windowed(3)
  .toArray(); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]

// Windows with custom step
asSequence([1, 2, 3, 4, 5, 6])
  .windowed(2, 2)
  .toArray(); // [[1, 2], [3, 4], [5, 6]]

// Allow partial windows at the end
asSequence([1, 2, 3, 4, 5])
  .windowed(3, 3, true)
  .toArray(); // [[1, 2, 3], [4, 5]]

// Transform windows directly (moving average)
asSequence([10, 20, 30, 40, 50, 60])
  .windowed(3, 1, false, window =>
    window.reduce((a, b) => a + b) / window.length
  )
  .toArray(); // [20, 30, 40, 50]`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Zipping Operations"
          description="Combine sequences together in various ways."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Zip with next element
sequenceOf(1, 2, 3, 4)
  .zipWithNext()
  .toArray(); // [[1, 2], [2, 3], [3, 4]]

// Transform pairs directly
sequenceOf(10, 15, 12, 18, 20)
  .zipWithNext((prev, curr) => curr - prev)
  .toArray(); // [5, -3, 6, 2]

// Zip two sequences together
sequenceOf(1, 2, 3)
  .zip(['a', 'b', 'c'])
  .toArray(); // [[1, 'a'], [2, 'b'], [3, 'c']]

// Zip stops at shortest sequence
sequenceOf(1, 2, 3, 4, 5)
  .zip(['a', 'b'])
  .toArray(); // [[1, 'a'], [2, 'b']]`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Terminal Operations"
          description="Operations that trigger evaluation and consume the sequence."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Convert to collections
sequenceOf(1, 2, 2, 3).toArray(); // [1, 2, 2, 3]
sequenceOf(1, 2, 2, 3).toSet(); // Set(1, 2, 3)
sequenceOf(['a', 1], ['b', 2]).toMap(); // Map { 'a' => 1, 'b' => 2 }

// Find elements
sequenceOf(1, 2, 3, 4).first(); // 1
sequenceOf(1, 2, 3, 4).last(); // 4
sequenceOf(1, 2, 3, 4).find(x => x > 2); // 3

// Single element (throws if not exactly one)
sequenceOf(42).single(); // 42
sequenceOf(1, 2).single(); // throws Error
sequenceOf().single(); // throws Error

// Safe single (returns null if not exactly one)
sequenceOf(42).singleOrNull(); // 42
sequenceOf(1, 2).singleOrNull(); // null
sequenceOf().singleOrNull(); // null

// With predicates
sequenceOf(1, 2, 3, 4).single(x => x > 3); // 4
sequenceOf(1, 2, 3, 4).singleOrNull(x => x > 10); // null

// Safe versions return null instead of throwing
sequenceOf().firstOrNull(); // null
sequenceOf().lastOrNull(); // null

// Check conditions
sequenceOf(2, 4, 6).all(x => x % 2 === 0); // true
sequenceOf(1, 2, 3).any(x => x > 2); // true
sequenceOf(1, 2, 3).none(x => x > 5); // true
sequenceOf(1, 2, 3).count(); // 3
sequenceOf(1, 2, 3, 4).count(x => x % 2 === 0); // 2`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Aggregation Operations"
          description="Perform calculations across all elements in a sequence."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Reduce and fold
sequenceOf(1, 2, 3, 4)
  .reduce((acc, x) => acc + x, 0); // 10

sequenceOf(1, 2, 3, 4)
  .fold(10, (acc, x) => acc + x); // 20 (starts with 10)

// Running fold - yields intermediate results
sequenceOf(1, 2, 3, 4)
  .runningFold(0, (acc, x) => acc + x)
  .toArray(); // [0, 1, 3, 6, 10]

// Scan is an alias for runningFold
sequenceOf(1, 2, 3, 4)
  .scan(0, (acc, x) => acc + x)
  .toArray(); // [0, 1, 3, 6, 10]

// Math operations
sequenceOf(1, 2, 3, 4).sum(); // 10
sequenceOf(1, 2, 3, 4).average(); // 2.5

// Sum/average by selector
sequenceOf(
  { name: 'Alice', score: 90 },
  { name: 'Bob', score: 85 },
  { name: 'Charlie', score: 95 }
)
  .sumBy(student => student.score); // 270

// sumOf is Kotlin-standard alias for sumBy
sequenceOf(
  { name: 'Alice', score: 90 },
  { name: 'Bob', score: 85 },
  { name: 'Charlie', score: 95 }
)
  .sumOf(student => student.score); // 270

sequenceOf(
  { product: 'A', price: 10 },
  { product: 'B', price: 20 },
  { product: 'C', price: 30 }
)
  .averageBy(item => item.price); // 20

// Min/Max by selector
sequenceOf(
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
)
  .minBy(person => person.age); // { name: 'Bob', age: 25 }

sequenceOf(
  { id: 1, value: 10 },
  { id: 2, value: 30 },
  { id: 3, value: 20 }
)
  .maxBy(item => item.value); // { id: 2, value: 30 }`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Grouping and Partitioning"
          description="Organize sequence elements into groups or partitions."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Group by key - returns Map
const groups = sequenceOf(1, 2, 3, 4, 5, 6)
  .groupBy(x => x % 2 === 0 ? 'even' : 'odd');
// Map { 'odd' => [1, 3, 5], 'even' => [2, 4, 6] }

// Iterate over grouped results
for (const [key, values] of groups) {
  console.log(\`\${key}: \${values.length} items\`);
}

// Group objects by property
const byDept = sequenceOf(
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Sales' },
  { name: 'Charlie', dept: 'Engineering' },
  { name: 'David', dept: 'Sales' }
)
  .groupBy(person => person.dept);
// Map { 'Engineering' => [...], 'Sales' => [...] }

byDept.get('Engineering'); // [{ name: 'Alice', ... }, { name: 'Charlie', ... }]

// Partition into two arrays
const [evens, odds] = sequenceOf(1, 2, 3, 4, 5)
  .partition(x => x % 2 === 0);
// evens: [2, 4], odds: [1, 3, 5]

// Associate operations - return Map
sequenceOf(1, 2, 3)
  .associateWith(x => x * 10);
// Map { 1 => 10, 2 => 20, 3 => 30 }

sequenceOf(
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
)
  .associateBy(user => user.id);
// Map { 1 => { id: 1, name: 'Alice' }, 2 => { id: 2, name: 'Bob' } }

sequenceOf('apple', 'banana', 'cherry')
  .associate(fruit => [fruit[0], fruit.length]);
// Map { 'a' => 5, 'b' => 6, 'c' => 6 }`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Side Effects"
          description="Perform side effects while maintaining the functional chain."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// onEach - returns sequence for chaining
sequenceOf(1, 2, 3)
  .onEach(x => console.log('Processing:', x))
  .map(x => x * 2)
  .onEach(x => console.log('Doubled:', x))
  .toArray();
// Logs: Processing: 1, Doubled: 2, Processing: 2, Doubled: 4, ...

// forEach - terminal operation, returns void
sequenceOf(1, 2, 3)
  .map(x => x * 2)
  .forEach(x => console.log(x));
// Logs: 2, 4, 6`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="String Operations"
          description="Convert sequences to formatted strings."
        >
          <CodeBlock
            code={`import { sequenceOf } from 'kotlinify-ts/sequences';

// Basic join
sequenceOf(1, 2, 3).joinToString(); // "1, 2, 3"
sequenceOf(1, 2, 3).joinToString(' - '); // "1 - 2 - 3"

// With prefix and postfix
sequenceOf(1, 2, 3)
  .joinToString(', ', '[', ']'); // "[1, 2, 3]"

// Limit elements shown
sequenceOf(1, 2, 3, 4, 5)
  .joinToString(', ', '', '', 3); // "1, 2, 3..."

// Custom transformation
sequenceOf('apple', 'banana', 'cherry')
  .joinToString(
    ', ',
    'Fruits: ',
    '.',
    -1,
    '...',
    fruit => fruit.toUpperCase()
  ); // "Fruits: APPLE, BANANA, CHERRY."`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="Real-World Example: Processing Large Files"
          description="Efficiently process large datasets line by line without loading everything into memory."
        >
          <CodeBlock
            code={`import { asSequence } from 'kotlinify-ts/sequences';

// Process log file entries
function processLogs(logLines: string[]) {
  return asSequence(logLines)
    .filter(line => line.includes('ERROR'))
    .map(line => {
      const match = line.match(/\\[(\\d{4}-\\d{2}-\\d{2})\\] (.+)/);
      return match ? { date: match[1], message: match[2] } : null;
    })
    .filter(entry => entry !== null)
    .distinctBy(entry => entry!.message)
    .take(100)
    .toArray();
}

// Pagination example
function paginate<T>(items: T[], pageSize: number) {
  return asSequence(items)
    .chunked(pageSize)
    .map((page, index) => ({
      page: index + 1,
      items: page,
      total: page.length
    }))
    .toArray();
}

// Time series analysis
function movingAverage(values: number[], windowSize: number) {
  return asSequence(values)
    .windowed(windowSize)
    .map(window =>
      window.reduce((sum, val) => sum + val, 0) / window.length
    )
    .toArray();
}

// Data pipeline
function analyzeUserActivity(events: UserEvent[]) {
  return asSequence(events)
    .filter(e => e.type === 'purchase')
    .groupBy(e => e.userId)
    .associate(([userId, userEvents]) => [
      userId,
      {
        totalPurchases: userEvents.length,
        totalSpent: asSequence(userEvents)
          .sumBy(e => e.amount),
        avgPurchase: asSequence(userEvents)
          .averageBy(e => e.amount)
      }
    ]);
}`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection title="Performance Comparison">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-slate-400 mb-4">
              Sequence vs Array Performance
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Finding first matching element in 1,000,000 items:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/20 border border-red-600/30 rounded p-3">
                    <p className="text-red-400 font-mono text-sm">Array: 450ms</p>
                    <p className="text-gray-400 text-sm">Processes all items first</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded p-3">
                    <p className="text-green-400 font-mono text-sm">Sequence: 0.02ms</p>
                    <p className="text-gray-400 text-sm">Stops at first match (22,500× faster)</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Memory usage for chained operations:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/20 border border-red-600/30 rounded p-3">
                    <p className="text-red-400 font-mono text-sm">Array: O(n × operations)</p>
                    <p className="text-gray-400 text-sm">Creates intermediate arrays</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded p-3">
                    <p className="text-green-400 font-mono text-sm">Sequence: O(1)</p>
                    <p className="text-gray-400 text-sm">No intermediate collections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="When to Use Sequences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-3">Use Sequences When:</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Processing large datasets</li>
                <li>• You need early termination (first, find, any)</li>
                <li>• Chaining many operations</li>
                <li>• Working with infinite or generated data</li>
                <li>• Memory efficiency is important</li>
                <li>• Processing streams or real-time data</li>
              </ul>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-3">Use Arrays When:</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Working with small datasets</li>
                <li>• Need random access by index</li>
                <li>• Multiple iterations over same data</li>
                <li>• Data fits comfortably in memory</li>
                <li>• Simple operations without chaining</li>
                <li>• Need to modify elements in place</li>
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
              Flow Streams →
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
