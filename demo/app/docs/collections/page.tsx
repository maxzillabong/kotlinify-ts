"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function CollectionsPage() {
  const elementAccessExample = `import { first, firstOrNull, last, lastOrNull, single, singleOrNull } from 'kotlinify-ts/collections';

// Get first element - throws if empty
const firstUser = first(users);
const firstActive = first(users, user => user.active);

// Safe first element - returns undefined if not found
const maybeFirst = firstOrNull(users);
const maybeActive = firstOrNull(users, user => user.active);

// Get last element
const lastOrder = last(orders);
const lastPending = last(orders, order => order.status === 'pending');

// Single element - throws if not exactly one
const onlyAdmin = single(users, user => user.role === 'admin');
const maybeSingle = singleOrNull(users, user => user.id === userId);

// With prototype extensions
import 'kotlinify-ts/collections';

users.first()
  .also(user => console.log('First user:', user.name));

orders
  .last(order => order.total > 1000)
  .let(order => processHighValueOrder(order));`;

  const takingDroppingExample = `import { take, takeLast, takeWhile, drop, dropLast, dropWhile } from 'kotlinify-ts/collections';

// Take elements from start
const firstThree = take(items, 3);
const topFive = take(sortedScores, 5);

// Take from end
const recentOrders = takeLast(allOrders, 10);
const lastMessages = takeLast(chatHistory, 20);

// Take while condition is true
const leadingZeros = takeWhile(numbers, n => n === 0);
const beforeError = takeWhile(logs, log => log.level !== 'error');

// Take from end while condition is true
const trailingSpaces = takeLastWhile(chars, c => c === ' ');
const afterSuccess = takeLastWhile(results, r => r.success);

// Drop elements from start
const skipHeader = drop(lines, 1);
const afterWarmup = drop(measurements, 5);

// Drop from end
const withoutFooter = dropLast(lines, 2);
const excludeOutliers = dropLast(sortedValues, 3);

// Drop while condition is true
const afterZeros = dropWhile(data, d => d === 0);
const skipComments = dropWhile(lines, line => line.startsWith('#'));

// Drop from end while condition
const trimTrailing = dropLastWhile(values, v => v == null);

// With prototype extensions
const processed = data
  .dropWhile(item => !item.valid)
  .take(100)
  .map(transform);

const paginated = allItems
  .drop((page - 1) * pageSize)
  .take(pageSize);`;

  const transformationsExample = `import { flatten, flatMap, zip, unzip, associate, fold, associateBy, associateWith, groupBy, partition } from 'kotlinify-ts/collections';

// Flatten nested arrays
const nested = [[1, 2], [3, 4], [5]];
const flat = flatten(nested); // [1, 2, 3, 4, 5]

// FlatMap - map and flatten in one step
const words = ['hello world', 'foo bar'];
const chars = flatMap(words, word => word.split(''));
// ['h','e','l','l','o',' ','w','o','r','l','d','f','o','o',' ','b','a','r']

// Zip arrays together
const names = ['Alice', 'Bob', 'Charlie'];
const ages = [25, 30, 35];
const people = zip(names, ages); // [['Alice', 25], ['Bob', 30], ['Charlie', 35]]

// Unzip array of pairs
const [firstNames, lastNames] = unzip(fullNames);

// Create Map with custom transform
const userMap = associate(users, user => [user.id, user]);

// Fold (reduce with initial value)
const total = fold(items, 0, (sum, item) => sum + item.price);
const htmlList = fold(tags, '<ul>', (html, tag) => html + \`<li>\${tag}</li>\`) + '</ul>';

// Associate by key - returns Map for type safety
const userLookup = associateBy(users, user => user.id);
const user = userLookup.get(123); // Type-safe Map access

// Associate by key with value transform
const emailToName = associateBy(contacts, c => c.email, c => c.name);
const name = emailToName.get('user@example.com');

// Associate with value - transform values into Map
const permissions = associateWith(roles, role => getPermissionsForRole(role));
const adminPerms = permissions.get('admin');

// Group by key - returns Map<K, T[]>
const usersByRole = groupBy(users, user => user.role);
for (const [role, users] of usersByRole) {
  console.log(\`\${role}: \${users.length} users\`);
}

// Group with value transform
const amountsByCategory = groupBy(transactions, t => t.category, t => t.amount);
const foodTotal = amountsByCategory.get('food')?.reduce((a, b) => a + b, 0);

// Partition - split into two arrays
const [active, inactive] = partition(users, user => user.lastLogin > thirtyDaysAgo);
const [valid, invalid] = partition(data, item => validateItem(item));`;

  const reduceOperationsExample = `import { reduce, reduceRight, foldRight, runningFold, runningReduce } from 'kotlinify-ts/collections';

// Reduce without initial value (throws if empty)
const product = reduce([1, 2, 3, 4], (acc, n) => acc * n); // 24
const concatenated = reduce(strings, (acc, str) => acc + ', ' + str);

// Reduce from right
const reversed = reduceRight(chars, (char, acc) => acc + char);
const tree = reduceRight(nodes, (node, acc) => ({ ...node, children: acc }));

// Fold from right with initial value
const folded = foldRight([1, 2, 3], 10, (n, acc) => n + acc); // 16

// Running accumulations - get intermediate results
const runningSum = runningFold([1, 2, 3, 4], 0, (acc, n) => acc + n);
// [0, 1, 3, 6, 10]

const runningMax = runningReduce([3, 1, 4, 1, 5], (acc, n) => Math.max(acc, n));
// [3, 3, 4, 4, 5]

// With prototype extensions
const balance = transactions
  .runningFold(initialBalance, (bal, tx) => bal + tx.amount);

const growth = dailyRevenue
  .runningReduce((acc, revenue) => acc + revenue)
  .map((total, day) => ({ day, total }));`;

  const sliceDistinctExample = `import { slice, distinct, distinctBy } from 'kotlinify-ts/collections';

// Slice - get elements at specific indices
const selected = slice(items, [0, 2, 4, 6]); // Every other element
const samples = slice(data, randomIndices);

// Slice with Range support
const range = slice(data, { start: 10, endInclusive: 20 }); // indices 10 through 20
const stepped = slice(data, { start: 0, endInclusive: 100, step: 10 }); // every 10th

// Remove duplicates - works with iterables
const unique = distinct([1, 2, 2, 3, 1, 4]); // [1, 2, 3, 4]
const uniqueNames = distinct(users.map(u => u.name));

// Remove duplicates by property - works with iterables
const uniqueUsers = distinctBy(users, user => user.email);
const latestVersions = distinctBy(releases, r => r.major + '.' + r.minor);`;

  const sequenceOperationsExample = `import { chunked, windowed, zipWithNext } from 'kotlinify-ts/collections';

// Split into chunks
const batches = chunked(records, 100);
const pages = chunked(items, pageSize);

// Chunked with transform
const sums = chunked(numbers, 10, chunk => chunk.reduce((a, b) => a + b, 0));
const processed = chunked(records, 100, batch => processBatch(batch));

// Sliding windows
const windows = windowed(prices, 5);
const samples = windowed(dataPoints, 10, 5); // window of 10, step by 5

// Windowed with transform
const movingAvg = windowed(
  prices,
  5,           // window size
  1,           // step
  false,       // no partial windows
  window => window.reduce((a, b) => a + b, 0) / window.length
);

// Partial windows
const allWindows = windowed(data, 3, 1, true); // includes partial at end

// Zip with next - create pairs of consecutive elements
const transitions = zipWithNext(states); // [[s1, s2], [s2, s3], ...]

// Zip with next and transform
const deltas = zipWithNext(values, (prev, curr) => curr - prev);
const changes = zipWithNext(states, (from, to) => ({ from, to }));`;

  const setOperationsExample = `import { union, intersect, subtract } from 'kotlinify-ts/collections';

// All set operations work with iterables (arrays, generators, etc.)

// Union - combine unique elements
const allUsers = union(activeUsers, newUsers);
const allTags = union(userTags, systemTags);

// Works with generators
function* gen1() { yield 1; yield 2; }
function* gen2() { yield 2; yield 3; }
const combined = union(gen1(), gen2()); // [1, 2, 3]

// Intersect - common elements only (preserves first iterable's order)
const commonSkills = intersect(requiredSkills, userSkills);
const sharedPermissions = intersect(rolePerms, userPerms);

// Subtract - remove elements from first iterable
const missingFeatures = subtract(requiredFeatures, implementedFeatures);
const nonAdmins = subtract(allUsers, adminUsers);`;

  const aggregationsExample = `import { count, sum, average, min, max, minOrNull, maxOrNull, sumOf, maxBy, minBy, all, any, none } from 'kotlinify-ts/collections';

// Count elements
const total = count(items);
const activeCount = count(users, user => user.active);

// Numeric aggregations for number arrays
const numbers = [10, 20, 30, 40, 50];
const total = sum(numbers); // 150
const avg = average(numbers); // 30
const lowest = min(numbers); // 10
const highest = max(numbers); // 50

// Safe versions that return null for empty arrays
const safeMin = minOrNull(maybeEmpty); // null if empty
const safeMax = maxOrNull(maybeEmpty); // null if empty

// Sum with selector for object arrays
const totalRevenue = sumOf(orders, order => order.total);
const totalQuantity = sumOf(items, item => item.quantity);

// Find max/min by property
const topScorer = maxBy(players, player => player.score);
const cheapestProduct = minBy(products, product => product.price);

// Boolean predicates
const allValid = all(items, item => item.isValid);
const hasErrors = any(results, result => result.error != null);
const isEmpty = !any(collection); // Check if empty
const noFailures = none(tests, test => test.failed);

// With prototype extensions
const stats = scores
  .filter(s => s > 0)
  .let(valid => ({
    count: valid.count(),
    sum: valid.sum(),
    average: valid.average(),
    min: valid.min(),
    max: valid.max()
  }));

const isComplete = tasks
  .all(task => task.status === 'done');

const needsReview = pullRequests
  .any(pr => pr.reviewers.length === 0);`;

  const practicalExample = `import { groupBy, distinctBy, chunked, windowed, partition, associateBy, maxBy, sumOf, first, last, flatMap } from 'kotlinify-ts/collections';

// Data processing pipeline
interface Sale {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  date: Date;
  region: string;
}

// Analyze sales data
function analyzeSales(sales: Sale[]) {
  // Group by region and calculate totals - returns Map
  const regionMap = groupBy(sales, sale => sale.region);
  const regionTotals = Array.from(regionMap).map(([region, sales]) => ({
    region,
    total: sumOf(sales, s => s.amount),
    count: sales.length,
    average: sumOf(sales, s => s.amount) / sales.length
  }));

  // Find top performers
  const topSale = maxBy(sales, sale => sale.amount);

  // Identify unique customers
  const uniqueCustomers = distinctBy(sales, sale => sale.userId)
    .map(sale => sale.userId);

  // Process in batches with transform
  const batches = chunked(sales, 50, batch => processBatch(batch));

  // Analyze trends with sliding windows
  const dailySalesMap = groupBy(sales, sale => sale.date.toDateString());
  const dailySales = Array.from(dailySalesMap.values());

  const weeklyTrends = windowed(dailySales, 7, 1, false, week => ({
    start: first(first(week)).date,
    end: first(last(week)).date,
    total: sumOf(flatMap(week, day => day), s => s.amount)
  }));

  return {
    regionTotals,
    topSale,
    uniqueCustomerCount: uniqueCustomers.length,
    batches: Promise.all(batches),
    weeklyTrends
  };
}

// Inventory management
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
}

function manageInventory(products: Product[]) {
  // Partition into stock levels
  const [inStock, lowStock] = partition(products, p => p.stock > p.reorderPoint);

  // Group by category for reporting - returns Map
  const categoryMap = groupBy(products, p => p.category);
  const byCategory = Array.from(categoryMap).map(([category, items]) => ({
    category,
    totalStock: sumOf(items, p => p.stock),
    needsReorder: items.filter(p => p.stock <= p.reorderPoint)
  }));

  // Create quick lookup map - type-safe access
  const productLookup = associateBy(products, p => p.id);

  // Find critical items
  const critical = products
    .filter(p => p.stock === 0)
    .map(p => productLookup.get(p.id))
    .filter(p => p !== undefined);

  return { inStock, lowStock, byCategory, critical };
}`;

  const comparisonExample = `// JavaScript standard methods vs kotlinify-ts

// Finding elements
// JavaScript
const first = users.find(u => u.active); // might be undefined
const last = users.filter(u => u.active).pop(); // awkward for last matching

// kotlinify-ts
const first = first(users, u => u.active); // throws if not found
const last = lastOrNull(users, u => u.active); // safe version

// Grouping
// JavaScript - manual grouping with plain object
const grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {} as Record<string, User[]>); // loses type safety

// kotlinify-ts - returns Map for type safety
const grouped = groupBy(users, user => user.role); // Map<string, User[]>
for (const [role, users] of grouped) { /* fully typed */ }

// Partitioning
// JavaScript - manual partitioning (2 passes!)
const active = users.filter(u => u.active);
const inactive = users.filter(u => !u.active);

// kotlinify-ts - single pass
const [active, inactive] = partition(users, u => u.active);

// Chunking with transform
// JavaScript - manual chunking and mapping
const chunks = [];
for (let i = 0; i < items.length; i += size) {
  chunks.push(processBatch(items.slice(i, i + size)));
}

// kotlinify-ts - declarative with transform
const chunks = chunked(items, size, batch => processBatch(batch));

// Set operations
// JavaScript - using Set
const union = [...new Set([...arr1, ...arr2])];
const intersect = arr1.filter(x => new Set(arr2).has(x));

// kotlinify-ts - works with any iterable
const union = union(arr1, arr2);
const intersect = intersect(arr1, arr2);`;

  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Collections</h1>
      <p className="text-xl text-gray-300 mb-12">
        Stop writing the same reduce() boilerplate for the 100th time. Get the collection operations JavaScript should have had from day one.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="JavaScript Arrays: The Missing Operations"
          description="You know the frustration. JavaScript gives you map, filter, reduce... and then leaves you to figure out everything else."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Daily Struggle</h4>
            <CodeBlock
              code={`// Need to group users by role? Time to write this... again
const usersByRole = users.reduce((acc, user) => {
  if (!acc[user.role]) {
    acc[user.role] = [];
  }
  acc[user.role].push(user);
  return acc;
}, {});

// Need to split data into chunks? More boilerplate!
const chunks = [];
for (let i = 0; i < data.length; i += chunkSize) {
  chunks.push(data.slice(i, i + chunkSize));
}

// Partition into two groups? Here we go again...
const active = users.filter(u => u.isActive);
const inactive = users.filter(u => !u.isActive);
// Great, we just iterated twice for no reason

// Find the user with the highest score?
const topUser = users.reduce((max, user) =>
  user.score > max.score ? user : max, users[0]);
// Hope users[0] exists!

// Every. Single. Time. You write this boilerplate.
// Your team writes it. Everyone writes it.
// Bugs creep in. Time is wasted. Frustration builds.`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">The kotlinify-ts Way: Just Call the Method</h4>
            <CodeBlock
              code={`import { groupBy, chunked, partition, maxBy } from 'kotlinify-ts/collections';

// Group users? One line. Returns type-safe Map.
const usersByRole = groupBy(users, user => user.role); // Map<string, User[]>

// Chunk data? Done.
const chunks = chunked(data, chunkSize);

// Partition? Single pass, destructured result.
const [active, inactive] = partition(users, u => u.isActive);

// Find max? Type-safe and null-safe.
const topUser = maxBy(users, user => user.score);

// Analyze by role with Map iteration
const analysis = Array.from(groupBy(users, u => u.role))
  .map(([role, users]) => ({
    role,
    count: users.length,
    avgScore: users.reduce((sum, u) => sum + u.score, 0) / users.length,
    topPerformer: maxBy(users, u => u.performance)
  }));

// What took 20 lines now takes 5.
// Readable. Testable. Maintainable.`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-900/10 border border-slate-700/20 rounded-lg p-4">
              <h4 className="text-slate-500 font-semibold mb-2">Save Time</h4>
              <p className="text-gray-300 text-sm">
                Stop reimplementing common patterns. Ship features, not utility functions.
              </p>
            </div>
            <div className="bg-blue-900/10 border border-blue-600/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Prevent Bugs</h4>
              <p className="text-gray-300 text-sm">
                Battle-tested operations that handle edge cases you'd miss in custom code.
              </p>
            </div>
            <div className="bg-green-900/10 border border-green-600/20 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Write Less</h4>
              <p className="text-gray-300 text-sm">
                Express complex data transformations in a few readable lines.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Element Access"
          description="Safe and unsafe methods for accessing specific elements with optional predicates."
        >
          <CodeBlock code={elementAccessExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Taking & Dropping"
          description="Select or skip elements from the start or end of arrays with flexible conditions."
        >
          <CodeBlock code={takingDroppingExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Transformations"
          description="Transform arrays into maps, grouped collections, and partitioned arrays."
        >
          <CodeBlock code={transformationsExample} language="typescript" />

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Try it yourself:</h4>
          <CodeBlock
            code={`// Group by and transform
const transactions = [
  { id: 1, category: 'food', amount: 50 },
  { id: 2, category: 'transport', amount: 30 },
  { id: 3, category: 'food', amount: 75 },
  { id: 4, category: 'transport', amount: 20 }
];

const byCategory = groupBy(transactions, t => t.category);

console.log('Groups:', Array.from(byCategory.keys()));

for (const [category, items] of byCategory) {
  const total = items.reduce((sum, t) => sum + t.amount, 0);
  console.log(\`\${category}: $\${total}\`);
}

// Zip arrays together
const names = ['Alice', 'Bob', 'Charlie'];
const scores = [95, 87, 92];
const results = zip(names, scores);

console.log('Results:', results);`}
            language="typescript"
            executable={true}
          />
        </DocsSection>

        <DocsSection
          title="Reduce & Fold Operations"
          description="Accumulate values with flexible reduction strategies including running accumulations."
        >
          <CodeBlock code={reduceOperationsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Slice & Distinct"
          description="Select specific indices and remove duplicates from arrays."
        >
          <CodeBlock code={sliceDistinctExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Sequence Operations"
          description="Process arrays in chunks, windows, and consecutive pairs."
        >
          <CodeBlock code={sequenceOperationsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Set Operations"
          description="Perform mathematical set operations on arrays with automatic deduplication."
        >
          <CodeBlock code={setOperationsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Aggregations"
          description="Calculate sums, find extremes, and verify conditions across collections."
        >
          <CodeBlock code={aggregationsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Real-World Example"
          description="Complete examples showing how collection utilities simplify complex data processing."
        >
          <CodeBlock code={practicalExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Comparison with JavaScript"
          description="See how kotlinify-ts collections compare to standard JavaScript array methods."
        >
          <CodeBlock code={comparisonExample} language="typescript" />
        </DocsSection>

        <DocsSection title="API Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-white font-semibold mb-3">Element Access</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">first(predicate?)</code> - Get first element</li>
                <li><code className="text-slate-500">firstOrNull(predicate?)</code> - Safe first</li>
                <li><code className="text-slate-500">last(predicate?)</code> - Get last element</li>
                <li><code className="text-slate-500">lastOrNull(predicate?)</code> - Safe last</li>
                <li><code className="text-slate-500">single(predicate?)</code> - Get single element</li>
                <li><code className="text-slate-500">singleOrNull(predicate?)</code> - Safe single</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Taking & Dropping</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">take(count)</code> - Take first n elements</li>
                <li><code className="text-slate-500">takeLast(count)</code> - Take last n elements</li>
                <li><code className="text-slate-500">takeWhile(predicate)</code> - Take while true</li>
                <li><code className="text-slate-500">takeLastWhile(predicate)</code> - Take from end while true</li>
                <li><code className="text-slate-500">drop(count)</code> - Skip first n elements</li>
                <li><code className="text-slate-500">dropLast(count)</code> - Skip last n elements</li>
                <li><code className="text-slate-500">dropWhile(predicate)</code> - Skip while true</li>
                <li><code className="text-slate-500">dropLastWhile(predicate)</code> - Skip from end while true</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Transformations</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">flatten()</code> - Flatten nested arrays</li>
                <li><code className="text-slate-500">flatMap(transform)</code> - Map and flatten</li>
                <li><code className="text-slate-500">zip(array1, array2)</code> - Combine into pairs</li>
                <li><code className="text-slate-500">unzip(pairs)</code> - Split pairs into arrays</li>
                <li><code className="text-slate-500">associate(transform)</code> - Create Map</li>
                <li><code className="text-slate-500">associateBy(key, value?)</code> - Map by key (returns Map)</li>
                <li><code className="text-slate-500">associateWith(valueSelector)</code> - Map values (returns Map)</li>
                <li><code className="text-slate-500">groupBy(key, value?)</code> - Group by key (returns Map)</li>
                <li><code className="text-slate-500">partition(predicate)</code> - Split in two</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Reduce & Fold</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">reduce(operation)</code> - Reduce without initial</li>
                <li><code className="text-slate-500">fold(initial, operation)</code> - Reduce with initial</li>
                <li><code className="text-slate-500">reduceRight(operation)</code> - Reduce from right</li>
                <li><code className="text-slate-500">foldRight(initial, operation)</code> - Fold from right</li>
                <li><code className="text-slate-500">runningReduce(operation)</code> - Running accumulation</li>
                <li><code className="text-slate-500">runningFold(initial, operation)</code> - Running fold</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Filtering & Distinct</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">slice(indices | Range)</code> - Get at indices or range</li>
                <li><code className="text-slate-500">distinct()</code> - Remove duplicates (accepts iterables)</li>
                <li><code className="text-slate-500">distinctBy(selector)</code> - Unique by property (accepts iterables)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Sequence Operations</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">chunked(size, transform?)</code> - Fixed-size chunks with optional transform</li>
                <li><code className="text-slate-500">windowed(size, step?, partial?, transform?)</code> - Sliding windows</li>
                <li><code className="text-slate-500">zipWithNext(transform?)</code> - Consecutive pairs with optional transform</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Set Operations</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">union(other)</code> - Combine unique (accepts iterables)</li>
                <li><code className="text-slate-500">intersect(other)</code> - Common only (accepts iterables)</li>
                <li><code className="text-slate-500">subtract(other)</code> - Remove elements (accepts iterables)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Aggregations</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">count(predicate?)</code> - Count elements</li>
                <li><code className="text-slate-500">sum()</code> - Sum numbers</li>
                <li><code className="text-slate-500">average()</code> - Average of numbers</li>
                <li><code className="text-slate-500">min()</code>, <code className="text-slate-500">max()</code> - Min/max values</li>
                <li><code className="text-slate-500">minOrNull()</code>, <code className="text-slate-500">maxOrNull()</code> - Safe min/max</li>
                <li><code className="text-slate-500">sumOf(selector)</code> - Sum with selector (accepts iterables)</li>
                <li><code className="text-slate-500">maxBy(selector)</code>, <code className="text-slate-500">minBy(selector)</code> - Find by property</li>
                <li><code className="text-slate-500">all(predicate)</code> - Check all match</li>
                <li><code className="text-slate-500">any(predicate?)</code> - Check any match</li>
                <li><code className="text-slate-500">none(predicate)</code> - Check none match</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/sequences"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Lazy Sequences →
            </Link>
            <Link
              href="/docs/flow"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Async Flow
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}