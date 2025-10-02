"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import Link from "next/link";

export default function ScopeFunctionsPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Scope Functions</h1>
      <p className="text-xl text-gray-300 mb-12">
        Stop drowning in temporary variables and nested callbacks. Transform verbose spaghetti code into elegant, readable pipelines.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Problem: TypeScript's Variable Hell"
          description="Every TypeScript developer knows this pain. You've been there."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Familiar Nightmare</h4>
            <CodeBlock
              code={`// We've all written this mess...
const data = await fetchData();
const validated = validateData(data);
console.log("Validation complete:", validated);
const transformed = transformData(validated);
const enriched = enrichWithMetadata(transformed);
console.log("Processing:", enriched.id);
const compressed = compressData(enriched);
const cached = await cacheData(compressed);
const result = formatForDisplay(cached);
return result;

// Variables everywhere. No clear flow. Cognitive overload.
// Each line depends on remembering what came before.
// Refactoring? Good luck moving these lines around.`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-slate-600/10 to-blue-500/10 border border-slate-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">The Elegant Solution</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">❌ Before: Variable Soup</p>
                <CodeBlock
                  code={`const user = await fetchUser(id);
const profile = user.profile;
const settings = profile.settings;
const theme = settings.theme;
const isDark = theme === 'dark';
if (isDark) {
  applyDarkMode();
}
const formatted = formatUser(user);
return formatted;`}
                  language="typescript"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">✅ After: Crystal Clear Intent</p>
                <CodeBlock
                  code={`import { letValue, also, apply } from 'kotlinify-ts/scope';

return letValue(
  await fetchUser(id),
  user => apply(user, u => {
    if (u.profile.settings.theme === 'dark') {
      applyDarkMode();
    }
  })
).let(user => formatUser(user));

// One expression. Clear data flow. Easy to refactor.`}
                  language="typescript"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/10 border border-yellow-600/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">Why This Matters</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Reduced Cognitive Load:</strong> No more tracking 10 temporary variables in your head</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Refactoring Safety:</strong> Move entire transformation chains without breaking dependencies</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Clear Intent:</strong> Code reads like a story, not a puzzle</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Fewer Bugs:</strong> Can't accidentally use the wrong variable when there aren't any</span>
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          title="Installation & Setup"
          description="One import unlocks the full power of chainable scope functions"
        >
          <div className="bg-gradient-to-r from-slate-600/20 to-pink-500/20 border border-slate-600/30 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-white mb-3">🚀 Enable the Magic</h4>
            <p className="text-gray-200 mb-4">
              The true power of kotlinify-ts comes from its chainable API. With one simple import,
              every value in your codebase gains the ability to flow through elegant transformation pipelines.
            </p>
            <CodeBlock
              code={`import 'kotlinify-ts';

// Now EVERY value can use scope functions
const result = value
  .let(v => v.transform())
  .also(v => console.log('Debug:', v))
  .let(v => v.toString());

// Chain through complex transformations
const processed = getUserData()
  .let(data => normalize(data))
  .apply(data => {
    data.timestamp = Date.now();
    data.version = '2.0';
  })
  .also(data => cache.store(data))
  .let(data => formatForDisplay(data));`}
              language="typescript"
            />

            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <p className="text-sm text-purple-200">
                <strong>Why chaining matters:</strong> No intermediate variables, clear data flow,
                easy refactoring, and code that reads like a story.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="let & letValue"
          description="Transform a value and return the result of the transformation"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Converting nullable values to non-nullable results</li>
                <li>Executing a block of code only if a value is not null</li>
                <li>Introducing an expression as a variable in local scope</li>
              </ul>
            </div>

            <CodeBlock
              code={`import 'kotlinify-ts';

// Beautiful method chaining - the way it's meant to be used
const formatted = getUserData()
  .let(data => data.normalize())
  .let(data => data.validate())
  .let(data => JSON.stringify(data));

// Chain through mathematical operations
const result = (5)
  .let(x => x * 2)    // 10
  .let(x => x + 3)    // 13
  .let(x => x ** 2)   // 169
  .let(x => "Result: " + x);

// Real-world: API response processing with chaining
const displayName = fetchUserProfile(id)
  .let(profile => profile.firstName + " " + profile.lastName)
  .let(fullName => fullName.trim() || "Anonymous");

// Extract nested properties elegantly
const upperName = { name: "Alice", age: 30 }
  .let(user => user.name)
  .let(name => name.toUpperCase());

// Chain through async operations
const processed = await fetchData()
  .let(response => response.json())
  .let(data => data.items)
  .let(items => items.filter(i => i.active));`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="apply"
          description="Configure an object and return the same object - perfect for initialization"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Object configuration and initialization</li>
                <li>Builder pattern implementation</li>
                <li>Setting multiple properties at once</li>
              </ul>
            </div>

            <CodeBlock
              code={`import 'kotlinify-ts';

// Method chaining - Build complex objects fluently
const user = {}
  .apply(u => {
    u.id = generateId();
    u.createdAt = new Date();
  })
  .apply(u => {
    u.name = 'John Doe';
    u.email = 'john@example.com';
    u.role = 'user';
  })
  .apply(u => {
    u.preferences = { theme: 'dark', language: 'en' };
  });

// Configure DOM elements with chaining
const canvas = document.createElement('canvas')
  .apply(c => {
    c.width = 800;
    c.height = 600;
    c.style.border = '1px solid black';
    c.getContext('2d')?.fillRect(0, 0, 100, 100);
  });

// Real-world: Building complex configurations
const server = { host: '', port: 0, ssl: false }
  .apply(config => {
    config.host = process.env.HOST || 'localhost';
    config.port = parseInt(process.env.PORT || '3000');
    config.ssl = process.env.NODE_ENV === 'production';
  });

// Combine apply with let for configuration then transformation
const jsonConfig = { database: {} }
  .apply(cfg => {
    cfg.database.host = 'localhost';
    cfg.database.port = 5432;
    cfg.database.name = 'myapp';
  })
  .let(cfg => JSON.stringify(cfg, null, 2));

// Chain multiple apply calls for organized configuration
const component = createComponent()
  .apply(c => { // Set dimensions
    c.width = 300;
    c.height = 200;
  })
  .apply(c => { // Set styling
    c.style = { background: 'blue', border: '1px solid' };
  })
  .apply(c => { // Set behavior
    c.onClick = handleClick;
    c.onHover = handleHover;
  });`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="also"
          description="Perform side effects like logging or validation and return the original value"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Logging intermediate values in a chain</li>
                <li>Validation that doesn't transform the value</li>
                <li>Side effects like caching or analytics</li>
              </ul>
            </div>

            <CodeBlock
              code={`import 'kotlinify-ts';

// Method chaining - Debug complex transformations elegantly
const result = computeExpensiveValue()
  .also(v => console.time('processing'))
  .let(v => heavyTransformation(v))
  .also(v => console.timeEnd('processing'))
  .also(v => cache.set(cacheKey, v))
  .also(v => metrics.recordComputation(v))
  .let(v => formatForDisplay(v));

// Validation chain with also - clean and readable
const securePassword = generatePassword()
  .also(pwd => {
    if (pwd.length < 12) throw new Error('Password too short');
  })
  .also(pwd => {
    if (!/[A-Z]/.test(pwd)) throw new Error('Must contain uppercase');
  })
  .also(pwd => {
    if (!/[0-9]/.test(pwd)) throw new Error('Must contain number');
  })
  .also(pwd => auditLog.record('password_generated'));

// Real-world: Track data through processing pipeline
const processedData = fetchData(url)
  .also(data => console.log('[DEBUG] Fetched:', data.length, 'items'))
  .also(data => analytics.track('data_fetched', { count: data.length }))
  .let(data => data.filter(item => item.active))
  .also(filtered => console.log('[DEBUG] After filter:', filtered.length))
  .let(data => data.map(transform))
  .also(final => metrics.record('pipeline_complete', final));

// Combine also with let for logging transformations
const validatedUser = parseUserInput(formData)
  .also(input => console.log('[AUDIT] User registration:', input.email))
  .let(input => validateUser(input))
  .also(valid => {
    if (!valid.isValid) throw new Error(valid.error);
  })
  .let(valid => createUser(valid.data))
  .also(user => sendWelcomeEmail(user));`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="run"
          description="Execute a block with 'this' context and return the result - great for computed properties"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Computing values based on object properties</li>
                <li>When you need 'this' context instead of parameter</li>
                <li>Complex calculations with multiple object properties</li>
              </ul>
            </div>

            <CodeBlock
              code={`import 'kotlinify-ts';

// Method chaining - Compute derived values using 'this'
const report = getUserMetrics()
  .run(function() {
    return {
      total: this.views + this.clicks,
      ctr: (this.clicks / this.views * 100).toFixed(2) + '%',
      quality: this.conversions / this.clicks
    };
  })
  .let(metrics => formatReport(metrics));

// Building and configuring DOM elements
const element = document.createElement('div')
  .run(function() {
    this.innerHTML = '<h1>Title</h1><p>Content</p>';
    this.className = 'card';
    this.style.padding = '20px';
    return this;
  })
  .also(el => document.body.appendChild(el));

// Calculate area using object properties
const area = { width: 10, height: 20 }
  .run(function() { return this.width * this.height; });

// Real-world: Complex calculations with context
const summary = fetchUserStats(userId)
  .run(function() {
    const total = this.posts + this.comments + this.likes;
    const average = total / 3;
    return {
      engagement: average > 100 ? 'high' : 'normal',
      score: this.posts * 10 + this.comments * 5 + this.likes,
      level: Math.floor(Math.log2(total))
    };
  })
  .also(s => console.log('User summary:', s));

// Chain run with other scope functions
const processedStats = getPlayerStats()
  .run(function() {
    return {
      kda: (this.kills + this.assists) / Math.max(this.deaths, 1),
      winRate: (this.wins / this.games * 100).toFixed(1) + '%',
      avgScore: this.totalScore / this.games
    };
  })
  .apply(stats => {
    stats.rank = calculateRank(stats.kda);
  })
  .also(stats => saveToLeaderboard(stats));`}
              language="typescript"
            />

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300 text-sm">
                <strong>Note:</strong> Use regular function syntax, not arrow functions, to access 'this' context
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="withValue"
          description="Like run, but with clearer syntax when the receiver is a parameter"
        >
          <div className="space-y-6">
            <CodeBlock
              code={`import { withValue } from 'kotlinify-ts/scope';

// Execute multiple operations on an object
const htmlContent = withValue(
  { title: 'Hello', body: 'World', footer: '2024' },
  function() {
    return \`
      <article>
        <h1>\${this.title}</h1>
        <main>\${this.body}</main>
        <footer>© \${this.footer}</footer>
      </article>
    \`;
  }
);

// Complex DOM manipulation
document.body.appendChild(
  withValue(document.createElement('button'), function() {
    this.textContent = 'Click me';
    this.className = 'btn btn-primary';
    this.onclick = () => alert('Clicked!');
    return this;
  })
);

// Building SQL queries dynamically
const query = withValue(
  { table: 'users', conditions: [], joins: [] },
  function() {
    this.conditions.push('active = true');
    this.conditions.push('created_at > NOW() - INTERVAL 30 DAY');
    this.joins.push('LEFT JOIN profiles ON users.id = profiles.user_id');

    return \`
      SELECT * FROM \${this.table}
      \${this.joins.join(' ')}
      WHERE \${this.conditions.join(' AND ')}
    \`;
  }
);`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="Null-Safe Variants"
          description="Handle nullable values gracefully without explicit null checks"
        >
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-2">
                <strong>Available for all scope functions:</strong> letOrNull, applyOrNull, alsoOrNull, runOrNull
              </p>
              <p className="text-green-200/90 text-sm">
                These variants automatically handle null/undefined, returning null instead of throwing errors
              </p>
            </div>

            <CodeBlock
              code={`import 'kotlinify-ts';

// Safe chaining with nullable values - elegant and safe!
const result: string | null = maybeGetUser()
  ?.letOrNull(u => u.profile)
  ?.letOrNull(p => p.settings)
  ?.letOrNull(s => s.theme)
  ?.alsoOrNull(t => console.log('Theme:', t));

// Real-world: Safe API data processing
const displayData = fetchApiResponse()
  ?.letOrNull(res => res.data)
  ?.applyOrNull(data => {
    data.timestamp = Date.now();
    data.processed = true;
  })
  ?.letOrNull(data => formatForDisplay(data))
  ?? 'No data available'; // Fallback value

// letOrNull - Transform only if not null
const userAge = getUserOrNull(id)
  ?.letOrNull(user => user.age);

// applyOrNull - Configure only if not null
const configuredWidget = findWidget(id)
  ?.applyOrNull(widget => {
    widget.color = 'blue';
    widget.size = 'large';
  });

// alsoOrNull - Side effects only if not null
const cachedValue = computeExpensiveValue()
  ?.alsoOrNull(value => cache.set(key, value));

// runOrNull - Compute only if not null
const fullName = findUserProfile(id)
  ?.runOrNull(function() {
    return this.firstName + ' ' + this.lastName;
  });

// Chain null-safe operations with regular ones
const processed = getUserInput()
  ?.letOrNull(input => input.trim())
  ?.takeIf(s => s.length > 0)
  ?.let(s => s.toLowerCase())
  ?.also(s => log('Processing:', s))
  ?? 'default';`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="Advanced Patterns"
          description="Combine scope functions for powerful, expressive code"
        >
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Pipeline Pattern</h4>
            <CodeBlock
              code={`import 'kotlinify-ts';

// Clean, readable data processing pipeline
const apiResult = fetchRawData()
  .let(raw => parseJSON(raw))
  .also(data => console.log('Parsed:', data))
  .let(data => validateSchema(data))
  .also(valid => metrics.recordValidation(valid))
  .apply(data => {
    data.processed = true;
    data.timestamp = Date.now();
  })
  .let(data => compress(data))
  .also(compressed => cache.store(compressed));

// Complex transformation pipeline
const processedData = rawData
  .let(data => normalizeData(data))
  .also(d => validateData(d))
  .let(normalized => enrichData(normalized))
  .also(d => logProcessing(d))
  .let(enriched => transformData(enriched))
  .apply(result => {
    result.processedAt = Date.now();
    result.version = '2.0';
  });

// Async pipeline with error handling
const result = await fetchUser(id)
  .let(async user => await enrichUserData(user))
  .also(user => console.log('Enriched:', user.id))
  .let(user => validateUserPermissions(user))
  .also(validated => auditLog.record(validated))
  .let(user => prepareUserResponse(user));`}
              language="typescript"
            />

            <h4 className="text-lg font-semibold text-white mt-6">Builder Pattern</h4>
            <CodeBlock
              code={`// Building complex objects fluently
const request = {}
  .apply(r => {
    r.method = 'POST';
    r.url = '/api/users';
  })
  .apply(r => {
    r.headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };
  })
  .apply(r => {
    r.body = JSON.stringify({ name, email });
  })
  .also(r => console.log('Sending request:', r))
  .let(r => fetch(r.url, r));`}
              language="typescript"
            />

            <h4 className="text-lg font-semibold text-white mt-6">Conditional Execution</h4>
            <CodeBlock
              code={`// Execute different branches based on conditions
const result = getValue()
  .let(v => v > 10 ? v * 2 : v)
  .also(v => {
    if (v > 100) console.warn('Large value:', v);
  })
  .let(v => shouldCache ? also(v, val => cache.set(key, val)) : v)
  .apply(v => {
    if (needsFormatting) {
      v.formatted = true;
      v.display = formatValue(v);
    }
  });`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection title="Quick Reference">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-slate-400 font-semibold mb-3">Returns Transformation Result</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="text-blue-300">let(value, fn)</code>
                  <span className="text-gray-400">→ fn(value)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-blue-300">run(value, fn)</code>
                  <span className="text-gray-400">→ fn.call(value)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-blue-300">withValue(value, fn)</code>
                  <span className="text-gray-400">→ fn.call(value)</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-slate-400 font-semibold mb-3">Returns Original Value</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="text-green-300">apply(value, fn)</code>
                  <span className="text-gray-400">→ value</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-300">also(value, fn)</code>
                  <span className="text-gray-400">→ value</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-600/10 to-pink-500/10 border border-slate-600/20 rounded-lg p-6 mt-6">
            <h4 className="text-xl font-semibold text-white mb-3">Decision Tree</h4>
            <div className="space-y-2 text-gray-300">
              <p>• <strong className="text-slate-400">Need the transformed result?</strong> → Use <code className="text-blue-300">let</code></p>
              <p>• <strong className="text-slate-400">Configuring an object?</strong> → Use <code className="text-green-300">apply</code></p>
              <p>• <strong className="text-slate-400">Logging or side effects?</strong> → Use <code className="text-green-300">also</code></p>
              <p>• <strong className="text-slate-400">Need 'this' context?</strong> → Use <code className="text-blue-300">run</code> or <code className="text-blue-300">withValue</code></p>
              <p>• <strong className="text-slate-400">Handling nullable values?</strong> → Use <code className="text-yellow-300">*OrNull</code> variants</p>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/docs/sequences"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Lazy Sequences →
            </Link>
            <Link
              href="/docs/flow"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Async Flow →
            </Link>
            <Link
              href="/docs/api-reference"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              API Reference
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}