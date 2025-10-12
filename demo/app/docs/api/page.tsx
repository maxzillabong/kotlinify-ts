"use client";

import Link from "next/link";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function APIReferencePage() {
  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">API Reference</h1>
      <p className="text-xl text-gray-300 mb-12">
        Complete reference for all functions, types, and modules
      </p>

      <div className="prose prose-invert max-w-none space-y-8">
        <DocsSection title="Modules">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/docs/scope-functions"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/scope</h3>
              <p className="text-gray-400 text-sm">Scope functions: let, apply, also, run, with, takeIf, takeUnless</p>
            </Link>

            <Link
              href="/docs/collections"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/collections</h3>
              <p className="text-gray-400 text-sm">40+ array operations: groupBy, partition, chunked, windowed, and more</p>
            </Link>

            <Link
              href="/docs/strings"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/strings</h3>
              <p className="text-gray-400 text-sm">String utilities: trimIndent, trimMargin, padding, affixes</p>
            </Link>

            <Link
              href="/docs/ranges"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/ranges</h3>
              <p className="text-gray-400 text-sm">Numeric ranges: rangeTo, until, downTo with lazy iteration</p>
            </Link>

            <Link
              href="/docs/sequences"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/sequences</h3>
              <p className="text-gray-400 text-sm">Lazy sequences with efficient evaluation</p>
            </Link>

            <Link
              href="/docs/flow"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/flow</h3>
              <p className="text-gray-400 text-sm">Reactive streams with backpressure</p>
            </Link>

            <Link
              href="/docs/coroutines"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/coroutines</h3>
              <p className="text-gray-400 text-sm">Structured concurrency with cancellation</p>
            </Link>

            <Link
              href="/docs/monads"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/monads</h3>
              <p className="text-gray-400 text-sm">Typed error handling with Option, Either, Result</p>
            </Link>

            <Link
              href="/docs/collections"
              className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">kotlinify-ts/collections</h3>
              <p className="text-gray-400 text-sm">Utilities for arrays and iterables</p>
            </Link>
          </div>
        </DocsSection>

        <DocsSection title="Installation">
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-4">
            <code className="text-slate-400">npm install kotlinify-ts</code>
          </div>
          <p className="text-gray-300 mb-4">Or with yarn:</p>
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <code className="text-slate-400">yarn add kotlinify-ts</code>
          </div>
        </DocsSection>

        <DocsSection title="Import Styles">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Named Imports</h3>
              <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                <code className="text-gray-300">
                  import {"{"} let, apply {"}"} from 'kotlinify-ts';
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Namespace Imports</h3>
              <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                <code className="text-gray-300">
                  import * as Scope from 'kotlinify-ts';
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Tree-Shaking</h3>
              <p className="text-gray-300 mb-2">
                All modules are tree-shakeable. Import only what you need to minimize bundle size.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="TypeScript Support"
          description="Full TypeScript support with complete type inference. No separate @types package needed."
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <ul className="space-y-2 text-gray-300">
              <li>✓ Complete type definitions included</li>
              <li>✓ Full generic type inference</li>
              <li>✓ Strict null safety</li>
              <li>✓ No implicit any</li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          title="Browser Compatibility"
          description="Works in all modern browsers. ES2015+ features are used, transpile if you need older browser support."
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <ul className="space-y-2 text-gray-300">
              <li>✓ Chrome/Edge 51+</li>
              <li>✓ Firefox 54+</li>
              <li>✓ Safari 10+</li>
              <li>✓ Node.js 14+</li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection title="Bundle Sizes">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
            <p className="text-gray-300">
              <strong className="text-slate-400">Scope functions:</strong> 120 bytes gzipped
            </p>
            <p className="text-gray-300">
              <strong className="text-slate-400">Sequences:</strong> 2KB gzipped
            </p>
            <p className="text-gray-300">
              <strong className="text-slate-400">Flow:</strong> 4KB gzipped
            </p>
            <p className="text-gray-300">
              <strong className="text-slate-400">Coroutines:</strong> 3KB gzipped
            </p>
            <p className="text-gray-300">
              <strong className="text-slate-400">Monads:</strong> 1.5KB gzipped
            </p>
            <p className="text-gray-300">
              <strong className="text-slate-400">Collections:</strong> 8KB gzipped
            </p>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/quickstart"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Quickstart →
            </Link>
            <Link
              href="/docs/client-side"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Client-Side Guide
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}
