"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";
import Link from "next/link";

export default function ExtensionsPage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Extension Functions</h1>
      <p className="text-xl text-gray-300 mb-12">
        Stop polluting global prototypes. Add custom methods to any class or type with surgical precision, Kotlin-style.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The Problem: JavaScript's Extension Hell"
          description="We've all been there. You need to add a method to a class you don't own."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Prototype Pollution Nightmare</h4>
            <CodeBlock
              code={`// The old, dangerous way - polluting prototypes globally
Array.prototype.shuffle = function() {
  // Every array in your entire application now has this
  // Including arrays from third-party libraries
  // Recipe for conflicts and bugs
};

// Or the verbose wrapper approach
class ArrayUtils {
  static shuffle(array) {
    // Now you need ArrayUtils.shuffle(myArray) everywhere
    // Lost the natural method chaining
    // Extra cognitive overhead
  }
}

// Or the even worse: monkey-patching third-party classes
SomeLibraryClass.prototype.myMethod = function() {
  // Will break when the library updates
  // Other developers won't know this exists
  // Testing nightmare
};`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-slate-600/10 to-blue-500/10 border border-slate-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">The Elegant Solution: Controlled Extensions</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">❌ Before: Global Chaos</p>
                <CodeBlock
                  code={`// Pollutes EVERY Date object
Date.prototype.toRelative = function() {
  // Global side effects
};

// Verbose utility class
DateUtils.toRelative(date);
DateUtils.format(date);
DateUtils.addDays(date, 5);`}
                  language="typescript"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">✅ After: Surgical Precision</p>
                <CodeBlock
                  code={`import { extend } from 'kotlinify-ts/extensions';

// Extend only YOUR Date instances
class CustomDate extends Date {}

extend(CustomDate, {
  toRelative() {
    return timeAgo(this);
  },
  addDays(days: number) {
    return new CustomDate(
      this.getTime() + days * 86400000
    );
  }
});

// Natural, chainable, safe
const relative = new CustomDate()
  .addDays(5)
  .toRelative();`}
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
                <span><strong>No Global Pollution:</strong> Extensions are scoped to specific classes only</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Natural Syntax:</strong> Methods feel native, support chaining</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>TypeScript Support:</strong> Full type inference and autocomplete</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                <span><strong>Collision-Free:</strong> Your extensions won't conflict with library updates</span>
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          title="extend() - Extending Classes"
          description="Add methods to any class constructor with full type safety"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Adding utility methods to your own classes</li>
                <li>Extending third-party classes safely</li>
                <li>Building fluent APIs and method chains</li>
                <li>Creating domain-specific language (DSL) methods</li>
              </ul>
            </div>

            <CodeBlock
              code={`import { extend } from 'kotlinify-ts/extensions';

// Extend your own classes
class User {
  constructor(
    public id: string,
    public email: string,
    public createdAt: Date
  ) {}
}

extend(User, {
  isNew() {
    const daysSinceCreation =
      (Date.now() - this.createdAt.getTime()) / 86400000;
    return daysSinceCreation < 7;
  },

  getDomain() {
    return this.email.split('@')[1];
  },

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      created: this.createdAt.toISOString()
    };
  }
});

// Now all User instances have these methods
const user = new User('123', 'john@example.com', new Date());
console.log(user.isNew());        // true
console.log(user.getDomain());    // 'example.com'
console.log(user.toJSON());       // Clean JSON representation

// Extend built-in classes (through subclassing for safety)
class SmartArray<T> extends Array<T> {}

extend(SmartArray, {
  shuffle() {
    const array = [...this];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return new SmartArray(...array);
  },

  unique() {
    return new SmartArray(...new Set(this));
  },

  compact() {
    return new SmartArray(...this.filter(Boolean));
  },

  groupBy<K>(keyFn: (item: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    this.forEach(item => {
      const key = keyFn(item);
      const group = map.get(key) || [];
      group.push(item);
      map.set(key, group);
    });
    return map;
  }
});

// Beautiful, chainable array operations
const result = new SmartArray(1, 2, 2, 3, null, 4, 4, 5)
  .compact()      // Remove falsy values
  .unique()       // Remove duplicates
  .shuffle();     // Randomize order

// Extend third-party library classes
class EnhancedRequest extends Request {}

extend(EnhancedRequest, {
  withAuth(token: string) {
    return new EnhancedRequest(this.url, {
      ...this,
      headers: {
        ...this.headers,
        'Authorization': \`Bearer \${token}\`
      }
    });
  },

  withJSON(data: any) {
    return new EnhancedRequest(this.url, {
      ...this,
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
});

// Clean, fluent API requests
const request = new EnhancedRequest('/api/users')
  .withAuth(token)
  .withJSON({ name: 'John', age: 30 });`}
              language="typescript"
            />

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Pro Tip:</strong> Always extend through subclassing when dealing with built-in types.
                This prevents global pollution and keeps your extensions isolated.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="extendType() - Extending Type Prototypes"
          description="Add methods directly to type prototypes when you need broader reach"
        >
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">When to use:</p>
              <ul className="text-gray-300 space-y-1 list-disc list-inside">
                <li>Extending primitive types (String, Number, etc.)</li>
                <li>Adding methods that should be available on all instances</li>
                <li>Creating polyfills or shims</li>
                <li>Building framework-level utilities</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
              <p className="text-amber-300 text-sm">
                <strong>⚠️ Warning:</strong> extendType() modifies prototypes directly. Use with caution and
                only when you fully control the environment. Prefer extend() with subclasses when possible.
              </p>
            </div>

            <CodeBlock
              code={`import { extendType } from 'kotlinify-ts/extensions';

// Extend String prototype with utility methods
extendType<string>(String.prototype, {
  capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },

  truncate(maxLength: number, suffix = '...') {
    if (this.length <= maxLength) return this.toString();
    return this.slice(0, maxLength - suffix.length) + suffix;
  },

  toSlug() {
    return this.toLowerCase()
      .replace(/[^\\w\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  reverse() {
    return this.split('').reverse().join('');
  },

  isEmail() {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(this.toString());
  }
});

// Natural string operations
const title = "Hello World! This is kotlinify-ts";
console.log(title.capitalize());                    // "Hello World! This is kotlinify-ts"
console.log(title.truncate(20));                    // "Hello World! Thi..."
console.log(title.toSlug());                        // "hello-world-this-is-kotlinify-ts"

const email = "user@example.com";
console.log(email.isEmail());                       // true

// Extend Number prototype with math utilities
extendType<number>(Number.prototype, {
  clamp(min: number, max: number) {
    return Math.min(Math.max(this.valueOf(), min), max);
  },

  round(decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(this.valueOf() * factor) / factor;
  },

  toPercent(decimals = 0) {
    return (this.valueOf() * 100).toFixed(decimals) + '%';
  },

  toCurrency(symbol = '$', decimals = 2) {
    return symbol + this.toFixed(decimals);
  },

  between(min: number, max: number) {
    const value = this.valueOf();
    return value >= min && value <= max;
  }
});

// Elegant number operations
const price = 19.956;
console.log(price.round(2));                        // 19.96
console.log(price.toCurrency());                    // "$19.96"

const score = 0.8567;
console.log(score.toPercent(1));                    // "85.7%"

const value = 150;
console.log(value.clamp(0, 100));                   // 100
console.log(value.between(100, 200));               // true

// Extend Array prototype with functional utilities
extendType<any[]>(Array.prototype, {
  first() {
    return this[0];
  },

  last() {
    return this[this.length - 1];
  },

  isEmpty() {
    return this.length === 0;
  },

  chunk(size: number) {
    const chunks = [];
    for (let i = 0; i < this.length; i += size) {
      chunks.push(this.slice(i, i + size));
    }
    return chunks;
  },

  sortBy<T>(keyFn: (item: T) => any) {
    return [...this].sort((a, b) => {
      const aKey = keyFn(a);
      const bKey = keyFn(b);
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    });
  }
});

// Clean array operations on any array
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(numbers.chunk(3));                      // [[1,2,3], [4,5,6], [7,8,9]]
console.log(numbers.first());                       // 1
console.log(numbers.last());                        // 9

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];
const sorted = users.sortBy(u => u.age);           // Sorted by age`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="TypeScript Support"
          description="Full type safety and IntelliSense for your extensions"
        >
          <div className="space-y-6">
            <CodeBlock
              code={`import { extend, extendType } from 'kotlinify-ts/extensions';

// TypeScript declaration merging for class extensions
class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number
  ) {}
}

// Declare the extensions for TypeScript
declare global {
  interface Product {
    applyDiscount(percent: number): Product;
    formatPrice(): string;
    isExpensive(): boolean;
  }
}

// Implement the extensions
extend(Product, {
  applyDiscount(percent: number) {
    return new Product(
      this.id,
      this.name,
      this.price * (1 - percent / 100)
    );
  },

  formatPrice() {
    return \`$\${this.price.toFixed(2)}\`;
  },

  isExpensive() {
    return this.price > 100;
  }
});

// Full IntelliSense and type checking
const product = new Product('123', 'Laptop', 999);
const discounted = product.applyDiscount(10);      // Type: Product
const formatted = product.formatPrice();            // Type: string
const expensive = product.isExpensive();            // Type: boolean

// For prototype extensions, declare on the interface
declare global {
  interface String {
    capitalize(): string;
    truncate(maxLength: number, suffix?: string): string;
    toSlug(): string;
  }

  interface Number {
    clamp(min: number, max: number): number;
    round(decimals?: number): number;
    toPercent(decimals?: number): string;
  }

  interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
    chunk(size: number): T[][];
    sortBy<K>(keyFn: (item: T) => K): T[];
  }
}

// Now you get full autocomplete and type safety
const text = "hello world";
text.capitalize();  // IntelliSense shows all custom methods

const num = 42.7;
num.round(1);      // TypeScript knows this returns number

const items = [1, 2, 3];
items.first();     // TypeScript knows this returns number | undefined`}
              language="typescript"
            />

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm">
                <strong>Best Practice:</strong> Always use TypeScript's declaration merging to get full IDE support
                for your extensions. This ensures type safety and excellent developer experience.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Real-World Patterns"
          description="Common extension patterns for production applications"
        >
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Domain Model Extensions</h4>
            <CodeBlock
              code={`// Extend your domain models with business logic
class Order {
  constructor(
    public id: string,
    public items: OrderItem[],
    public status: OrderStatus,
    public createdAt: Date
  ) {}
}

extend(Order, {
  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  canCancel() {
    return this.status === 'pending' || this.status === 'processing';
  },

  getDaysOld() {
    return Math.floor(
      (Date.now() - this.createdAt.getTime()) / 86400000
    );
  },

  addItem(item: OrderItem) {
    return new Order(
      this.id,
      [...this.items, item],
      this.status,
      this.createdAt
    );
  }
});

// Clean domain logic
const order = getOrder(orderId);
if (order.canCancel() && order.getDaysOld() < 7) {
  const updated = order.addItem(newItem);
  console.log('New total:', updated.getTotal());
}`}
              language="typescript"
            />

            <h4 className="text-lg font-semibold text-white mt-6">API Client Extensions</h4>
            <CodeBlock
              code={`// Extend fetch Response for better API handling
class ApiResponse extends Response {}

extend(ApiResponse, {
  async toJSON<T>(): Promise<T> {
    if (!this.ok) {
      throw new Error(\`HTTP \${this.status}: \${this.statusText}\`);
    }
    return this.json();
  },

  async toText(): Promise<string> {
    if (!this.ok) {
      throw new Error(\`HTTP \${this.status}: \${this.statusText}\`);
    }
    return this.text();
  },

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  },

  isClientError() {
    return this.status >= 400 && this.status < 500;
  },

  isServerError() {
    return this.status >= 500;
  }
});

// Clean API interactions
const response = await fetch(url).then(r => new ApiResponse(r.body, r));
if (response.isSuccess()) {
  const data = await response.toJSON<User[]>();
  processUsers(data);
} else if (response.isClientError()) {
  handleClientError(response.status);
}`}
              language="typescript"
            />

            <h4 className="text-lg font-semibold text-white mt-6">Form Validation Extensions</h4>
            <CodeBlock
              code={`// Extend form elements with validation
class ValidatedInput extends HTMLInputElement {}

extend(ValidatedInput, {
  validate() {
    const rules = this.dataset.validate?.split(',') || [];
    const errors: string[] = [];

    rules.forEach(rule => {
      if (rule === 'required' && !this.value) {
        errors.push('This field is required');
      }
      if (rule === 'email' && !this.value.includes('@')) {
        errors.push('Invalid email format');
      }
      if (rule.startsWith('min:')) {
        const min = parseInt(rule.split(':')[1]);
        if (this.value.length < min) {
          errors.push(\`Minimum \${min} characters required\`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  },

  markInvalid(message: string) {
    this.classList.add('error');
    this.setAttribute('aria-invalid', 'true');

    let errorEl = this.nextElementSibling;
    if (!errorEl?.classList.contains('error-message')) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      this.after(errorEl);
    }
    errorEl.textContent = message;
  },

  clearError() {
    this.classList.remove('error');
    this.removeAttribute('aria-invalid');
    this.nextElementSibling?.remove();
  }
});

// Clean form validation
const input = document.querySelector('#email') as ValidatedInput;
const result = input.validate();
if (!result.valid) {
  input.markInvalid(result.errors[0]);
} else {
  input.clearError();
}`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection
          title="Best Practices & Warnings"
          description="Guidelines for safe and effective extension usage"
        >
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">✅ Do's</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Use extend() with subclasses for built-in types</li>
                <li>• Declare TypeScript interfaces for full type support</li>
                <li>• Keep extensions focused and single-purpose</li>
                <li>• Document your extensions for team members</li>
                <li>• Test extensions thoroughly, especially with inheritance</li>
                <li>• Use descriptive method names that won't conflict</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">❌ Don'ts</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Don't use extendType() on Object.prototype (affects everything)</li>
                <li>• Don't override existing methods without careful consideration</li>
                <li>• Don't add too many extensions (cognitive overload)</li>
                <li>• Don't use generic names that might conflict</li>
                <li>• Don't extend third-party classes directly in libraries</li>
                <li>• Don't forget to handle edge cases (null, undefined)</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-semibold mb-2">⚠️ Important Considerations</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>
                  <strong>Prototype Pollution:</strong> extendType() modifies prototypes globally.
                  This affects ALL instances, including those from third-party code. Use sparingly
                  and only in application code, never in libraries.
                </p>
                <p>
                  <strong>Performance:</strong> Extensions add a property lookup to the prototype chain.
                  For hot code paths, consider using static utility functions instead.
                </p>
                <p>
                  <strong>Testing:</strong> Extensions persist for the entire runtime. In test environments,
                  consider resetting or mocking extensions between test suites.
                </p>
                <p>
                  <strong>Tree Shaking:</strong> Extensions that modify prototypes cannot be tree-shaken.
                  Only include them when truly needed.
                </p>
              </div>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Migration Guide"
          description="Moving from global prototype modifications to kotlinify extensions"
        >
          <div className="space-y-6">
            <CodeBlock
              code={`// Before: Global prototype pollution
Array.prototype.customMethod = function() { /* ... */ };
String.prototype.customFormat = function() { /* ... */ };

// After: Controlled extensions
import { extend, extendType } from 'kotlinify-ts/extensions';

// Option 1: Subclass for safety
class MyArray<T> extends Array<T> {}
extend(MyArray, {
  customMethod() { /* ... */ }
});

// Option 2: Direct prototype (use carefully)
extendType<string>(String.prototype, {
  customFormat() { /* ... */ }
});

// Before: Utility class pattern
class StringUtils {
  static capitalize(str: string): string { /* ... */ }
  static truncate(str: string, max: number): string { /* ... */ }
}

// Usage was verbose
const result = StringUtils.capitalize(
  StringUtils.truncate(text, 50)
);

// After: Natural method chaining
extendType<string>(String.prototype, {
  capitalize() { /* ... */ },
  truncate(max: number) { /* ... */ }
});

// Clean and readable
const result = text.truncate(50).capitalize();`}
              language="typescript"
            />
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/docs/scope-functions"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Scope Functions →
            </Link>
            <Link
              href="/docs/collections"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Collections →
            </Link>
            <Link
              href="/docs/api"
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