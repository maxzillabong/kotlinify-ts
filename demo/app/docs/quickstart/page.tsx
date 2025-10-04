"use client";

import Link from "next/link";
import { Target, Zap, Waves, Shield, Code, Sparkles, ArrowRight } from "lucide-react";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import { CodeBlock } from "@/components/CodeBlock";

export default function QuickstartPage() {
  const installCode = `npm install kotlinify-ts`;

  const scopeFunctionsExample = `import { asScope, apply } from 'kotlinify-ts';

// Transform data through a fluent pipeline - no intermediate variables!
const apiResponse = { data: { user: { name: "Alice", score: 85 } } };

const message = asScope(apiResponse)
  .let(response => response.data.user)
  .let(user => ({ ...user, grade: user.score >= 90 ? 'A' : 'B' }))
  .let(graded => \`\${graded.name} earned a \${graded.grade}\`)
  .value();

console.log(message); // "Alice earned a B"

// Configure complex objects with beautiful chaining
const config = apply({} as any, cfg => {
  cfg.apiUrl = process.env.API_URL;
  cfg.timeout = 5000;
  cfg.retries = 3;
  cfg.headers = { 'Content-Type': 'application/json' };
});

// Track operations with side effects in a clean chain
const processedData = asScope(fetchData())
  .let(data => data.filter(item => item.active))
  .also(filtered => console.log(\`Processing \${filtered.length} items\`))
  .let(items => items.map(item => item.value))
  .also(values => metrics.record('items.processed', values.length))
  .value();`;

  const nullSafetyExample = `import { asScope, letOrNull, applyOrNull, takeIf, takeUnless } from 'kotlinify-ts';

// Safely transform nullable values with elegant chaining
const userInput: string | null = getUserInput();

const result = asScope(userInput)
  .letOrNull(input => input.trim())
  .letOrNull(trimmed => trimmed.toLowerCase())
  .letOrNull(normalized => normalizeText(normalized))
  .value();

// Conditional value retention with fluent API
const validEmail = takeIf(email, e => e.includes('@') && e.includes('.'));

const nonEmptyList = takeUnless(items, list => list.length === 0);

// Configure objects only when non-null
const user = applyOrNull(findUserById(id), u => {
  u.lastSeen = Date.now();
  u.sessionCount++;
});`;

  const flowExample = `import { flowOf, flow, MutableStateFlow } from 'kotlinify-ts/flow';

// Create reactive data streams
const temperatureFlow = flowOf(20, 22, 25, 23, 21)
  .map(celsius => celsius * 9/5 + 32)
  .filter(fahrenheit => fahrenheit > 70)
  .onEach(f => console.log(\`Temperature: \${f}°F\`));

await temperatureFlow.collect(temp => {
  updateDisplay(temp);
});

// State management with reactive updates
const userState = new MutableStateFlow({ name: "Guest", loggedIn: false });

// Subscribe to state changes
userState
  .map(user => user.name)
  .distinctUntilChanged()
  .collect(name => updateUIName(name));

// Update state triggers all collectors
userState.value = { name: "Alice", loggedIn: true };`;

  const sequenceExample = `import { asSequence, generateSequence } from 'kotlinify-ts/sequences';

// Process large datasets lazily
const bigData = asSequence(hugeArray)
  .filter(item => item.isValid)
  .map(item => item.normalize())
  .take(100)  // Only processes first 100 valid items
  .toArray();

// Generate infinite sequences
const fibonacci = generateSequence([0, 1], ([a, b]) => [b, a + b])
  .map(([a]) => a)
  .take(10)
  .toArray(); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Efficient grouping and aggregation
const groups = asSequence(transactions)
  .groupBy(t => t.category); // Returns Map<string, Transaction[]>

const summary = Array.from(groups).map(([category, items]) => ({
  category,
  total: asSequence(items).sumBy(t => t.amount),
  count: items.length
}));`;

  const monadExample = `import { tryCatch, Success, Failure } from 'kotlinify-ts/monads';
import { Some, None, fromNullable } from 'kotlinify-ts/monads';

// Elegant error handling
const result = tryCatch(() => JSON.parse(jsonString))
  .map(data => data.user)
  .map(user => user.email)
  .fold(
    error => \`Failed: \${error.message}\`,
    email => \`User email: \${email}\`
  );

// Null-safe operations with Option
const userOption = fromNullable(findUser(id))
  .filter(u => u.isActive)
  .map(u => u.profile)
  .getOrElse({ name: "Anonymous", avatar: "default.png" });

// Chain fallible operations
const processed = await tryCatchAsync(() => fetchData())
  .flatMap(data => tryCatch(() => validateData(data)))
  .map(valid => transformData(valid))
  .recover(error => getDefaultData());`;

  const prototypeExample = `import { asScope, apply, takeIf } from 'kotlinify-ts';
import { asSequence } from 'kotlinify-ts/sequences';

// Clean method chaining with asScope
const result = asScope(5)
  .let(x => x * 2)
  .also(x => console.log("Doubled:", x))
  .let(x => x + 10)
  .value();

const configured = apply({ name: "Test" }, obj => {
  obj.id = generateId();
  logger.info("Created:", obj);
});

const safe = asScope(getUserInput())
  .let(input => takeIf(input, i => i.length > 0))
  .letOrNull(input => input?.trim())
  .value();

const evens = asSequence([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .toArray(); // [4, 16]`;

  return (
    <DocsPageLayout>
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Get Started with Kotlinify
        </h1>
        <p className="text-xl text-gray-300">
          Transform your TypeScript code with Kotlin's most powerful patterns in under 5 minutes
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection title="Installation">
          <CodeBlock code={installCode} language="bash" />
          <p className="text-gray-300 mt-4">Or with yarn, pnpm, or bun:</p>
          <CodeBlock code={`yarn add kotlinify-ts
pnpm add kotlinify-ts
bun add kotlinify-ts`} language="bash" />
        </DocsSection>

        <DocsSection
          title="Why Kotlinify?"
          description="See the power of functional programming patterns in action"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">❌</span> Without Kotlinify
              </h3>
              <CodeBlock code={`// Nested, hard-to-follow logic
let data = fetchData();
if (data) {
  data = data.filter(x => x.active);
  console.log(\`Processing \${data.length}\`);
  data = data.map(x => x.value);
  metrics.record('processed', data.length);
  return data;
}
return null;`} language="typescript" />
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> With Kotlinify
              </h3>
              <CodeBlock code={`// Clean, chainable, functional - ONE beautiful expression!
asScope(fetchData())
  .letOrNull(data => data?.filter(x => x.active))
  .also(d => d && console.log(\`Processing \${d.length}\`))
  .letOrNull(d => d?.map(x => x.value))
  .also(d => d && metrics.record('processed', d.length))
  .value();`} language="typescript" />
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Core Patterns"
          description="Five powerful concepts that will transform your code"
        >
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-600/10 to-pink-500/10 border border-slate-600/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-slate-500" />
                <h3 className="text-xl font-semibold text-white">1. Scope Functions - Chain Operations Elegantly</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Transform, configure, and observe values through a clean pipeline
              </p>
              <CodeBlock code={scopeFunctionsExample} language="typescript" />
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">2. Null Safety - Handle Nullables Gracefully</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Chain operations safely without endless null checks
              </p>
              <CodeBlock code={nullSafetyExample} language="typescript" />
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Waves className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">3. Flow - Reactive Streams Made Simple</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Build reactive applications with powerful stream processing
              </p>
              <CodeBlock code={flowExample} language="typescript" />
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">4. Sequences - Lazy Evaluation for Performance</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Process large datasets efficiently with lazy evaluation
              </p>
              <CodeBlock code={sequenceExample} language="typescript" />
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">5. Monads - Type-Safe Error Handling</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Replace try-catch blocks with composable error handling
              </p>
              <CodeBlock code={monadExample} language="typescript" />
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="The Power of Chainable APIs"
          description="Enable fluent, readable code with method chaining"
        >
          <div className="bg-gradient-to-r from-slate-600/20 to-pink-500/20 border border-slate-600/30 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-slate-500" />
              Why Chaining Matters
            </h3>
            <p className="text-gray-200 mb-6">
              The real value of kotlinify-ts isn't just the individual functions - it's the ability to chain them into
              expressive, self-documenting pipelines that eliminate intermediate variables and make your intent crystal clear.
            </p>

            <div className="bg-black/30 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-slate-400 mb-3">Clean, Functional Pipelines</h4>
              <CodeBlock code={`import { asScope } from 'kotlinify-ts';

// Transform any value through a pipeline
const result = asScope(getValue())
  .let(v => process(v))
  .also(v => log(v))
  .let(v => format(v))
  .value();

// No intermediate variables
// No nested callbacks
// Just beautiful, flowing code`} language="typescript" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">✅ Benefits</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Fluent, readable pipelines</li>
                  <li>• No intermediate variables</li>
                  <li>• Clear data flow</li>
                  <li>• Easy refactoring</li>
                  <li>• Self-documenting code</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">🎯 Perfect For</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Data transformations</li>
                  <li>• Object configuration</li>
                  <li>• API response processing</li>
                  <li>• Complex business logic</li>
                  <li>• React component props</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 font-bold text-lg mt-0.5">🎯</div>
              <div>
                <h4 className="text-blue-300 font-semibold mb-2">Zero Prototype Pollution</h4>
                <p className="text-blue-200/90 text-sm">
                  Use <code className="bg-black/30 px-2 py-0.5 rounded">asScope()</code> for chainable scope functions, or import standalone utilities.
                  No global modifications, no side effects - just clean, explicit imports.
                </p>
              </div>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Real-World Example">
          <p className="text-gray-300 mb-6">
            See how kotlinify-ts transforms a typical data processing pipeline:
          </p>
          <CodeBlock code={`import 'kotlinify-ts';

// Process API data with beautiful chaining and error handling
async function processUserData(userId: string) {
  return await fetchUser(userId)
    .tryCatch()
    .map(user => ({
      ...user,
      transactions: user.transactions
        .asSequence()
        .filter(t => t.status === 'completed')
        .map(t => ({ ...t, amount: t.amount * exchangeRate }))
        .sortedBy(t => t.date)
        .take(100)
        .toArray()
    }))
    .also(processed => logger.info('User processed', { userId }))
    .map(user => enrichUserData(user))
    .fold(
      error => {
        logger.error('Failed to process user', { userId, error });
        return getDefaultUser();
      },
      user => {
        cache.set(userId, user);
        return user;
      }
    );
}

// Stream real-time updates
const priceUpdates = flowOf(...initialPrices)
  .flatMapLatest(price =>
    subscribeToUpdates(price.symbol)
      .map(update => ({ ...price, ...update }))
  )
  .distinctUntilChangedBy(p => p.value)
  .throttle(100)
  .onEach(price => updateUI(price))
  .catch(error => handleStreamError(error));

await priceUpdates.collect(price => {
  broadcastToClients(price);
});`} language="typescript" />
        </DocsSection>

        <DocsSection title="What Developers Are Saying">
          <div className="grid gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 italic mb-2">
                "Finally, I can write TypeScript that's as expressive as my Kotlin code.
                The scope functions alone have transformed how I structure my React components."
              </p>
              <p className="text-sm text-gray-500">— Senior Full-Stack Developer</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 italic mb-2">
                "The Flow API is incredible for handling WebSocket streams.
                It's like RxJS but with a much cleaner API."
              </p>
              <p className="text-sm text-gray-500">— Real-time Applications Developer</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 italic mb-2">
                "Result and Option monads have eliminated 90% of our null pointer exceptions.
                Our error handling is now type-safe and composable."
              </p>
              <p className="text-sm text-gray-500">— Tech Lead</p>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Ready to Transform Your Code?">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/docs/scope-functions"
              className="block p-6 bg-gradient-to-br from-slate-600/20 to-pink-500/20 hover:from-slate-600/30 hover:to-pink-500/30 border border-slate-600/30 hover:border-slate-500/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
                <h3 className="text-lg font-semibold text-white">Deep Dive: Scope Functions</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Master let, apply, also, run, and with for elegant data transformations
              </p>
              <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/docs/flow"
              className="block p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Waves className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-lg font-semibold text-white">Build with Flow</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Create reactive applications with powerful stream processing
              </p>
              <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Explore Flow</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/docs/sequences"
              className="block p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-400/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                <h3 className="text-lg font-semibold text-white">Optimize with Sequences</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Process large datasets efficiently with lazy evaluation
              </p>
              <div className="flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm font-medium">Discover Sequences</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/docs/monads"
              className="block p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 hover:border-red-400/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                <h3 className="text-lg font-semibold text-white">Handle Errors Functionally</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Replace try-catch with composable Option, Either, and Result types
              </p>
              <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
                <span className="text-sm font-medium">Master Monads</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </DocsSection>

        <DocsSection title="Join the Community">
          <div className="bg-gradient-to-r from-slate-600/20 to-pink-500/20 border border-slate-600/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Start Writing Better TypeScript Today
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are already using kotlinify-ts to write cleaner,
              more maintainable TypeScript code with the power of Kotlin's best patterns.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="https://github.com/maxzillabong/kotlinify-ts"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium text-white transition-all"
              >
                ⭐ Star on GitHub
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-800 rounded-lg font-medium text-white transition-all"
              >
                Read Full Documentation
              </Link>
            </div>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}