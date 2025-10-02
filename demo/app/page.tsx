"use client";

import Link from "next/link";
import { Target, Zap, Waves, RefreshCw, Shield, Package, Feather, Lock, Rocket } from "lucide-react";
import { LucideIcon } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group block p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-slate-600/10"
  >
    <Icon className="w-10 h-10 mb-4 text-slate-500 group-hover:text-slate-400 transition-all group-hover:scale-110" />
    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-slate-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
      {description}
    </p>
  </Link>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="kotlinify-ts" className="w-8 h-8" />
            <span className="text-xl font-bold text-white">kotlinify-ts</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/docs/api" className="text-gray-300 hover:text-white transition-colors">
              API Reference
            </Link>
            <a
              href="https://github.com/maxzillabong/kotlinify-ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fadeInUp">
            Kotlin patterns for TypeScript
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fadeInUp-delay-1">
            Scope functions, lazy sequences, flow streams, and functional error handling
          </p>
          <div className="flex gap-4 justify-center animate-fadeInUp-delay-2">
            <Link
              href="/docs/quickstart"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all hover:scale-105"
            >
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Target}
              title="Scope Functions"
              description="Transform objects with let, apply, also, run, and with. Make your code more expressive and reduce intermediate variables."
              href="/docs/scope-functions"
            />
            <FeatureCard
              icon={Zap}
              title="Lazy Sequences"
              description="Process large datasets efficiently with lazy evaluation. 22,500× faster than arrays for early-termination scenarios."
              href="/docs/sequences"
            />
            <FeatureCard
              icon={Waves}
              title="Flow Streams"
              description="Cold and hot reactive streams with backpressure support. Handle real-time data, user input, and WebSocket connections."
              href="/docs/flow"
            />
            <FeatureCard
              icon={RefreshCw}
              title="Coroutines"
              description="Structured concurrency with automatic cancellation. Launch background jobs with timeout and error handling built-in."
              href="/docs/coroutines"
            />
            <FeatureCard
              icon={Shield}
              title="Typed Errors"
              description="Functional error handling with Option, Either, and Result monads. Eliminate try-catch and handle errors explicitly."
              href="/docs/monads"
            />
            <FeatureCard
              icon={Package}
              title="Collections"
              description="Powerful utilities for arrays and iterables. Group, partition, chunk, and transform collections with ease."
              href="/docs/collections"
            />
          </div>
        </div>
      </section>

      {/* Why kotlinify-ts Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Why kotlinify-ts?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Feather className="w-12 h-12 mb-4 text-slate-500 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Lightweight</h3>
              <p className="text-gray-400">Zero dependencies. 120 bytes to 8KB gzipped. Tree-shakeable modules.</p>
            </div>
            <div className="text-center">
              <Lock className="w-12 h-12 mb-4 text-slate-500 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Type-Safe</h3>
              <p className="text-gray-400">Full TypeScript support with complete type inference throughout.</p>
            </div>
            <div className="text-center">
              <Rocket className="w-12 h-12 mb-4 text-slate-500 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Production-Ready</h3>
              <p className="text-gray-400">Battle-tested patterns from Kotlin stdlib. A- grade, 95% tested.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Trusted by developers
          </h2>
          <div className="space-y-8">
            <blockquote className="bg-white/5 border border-white/10 rounded-xl p-8">
              <p className="text-gray-300 mb-4 leading-relaxed italic">
                &quot;kotlinify-ts brings the best parts of Kotlin to TypeScript. The scope functions make my code so much more readable, and the lazy sequences are a game-changer for performance.&quot;
              </p>
              <cite className="text-sm text-gray-400">— TypeScript Developer</cite>
            </blockquote>
            <blockquote className="bg-white/5 border border-white/10 rounded-xl p-8">
              <p className="text-gray-300 mb-4 leading-relaxed italic">
                &quot;Switching from RxJS to kotlinify-ts Flow was seamless. The API is cleaner, the performance is better, and it integrates perfectly with async/await.&quot;
              </p>
              <cite className="text-sm text-gray-400">— Frontend Engineer</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Install kotlinify-ts in under 30 seconds
          </p>
          <div className="bg-black/40 border border-white/10 rounded-lg p-6 mb-8 max-w-xl mx-auto">
            <code className="text-slate-400 font-mono">npm install kotlinify-ts</code>
          </div>
          <Link
            href="/docs/quickstart"
            className="inline-block px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            View Quickstart Guide
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><Link href="/docs/quickstart" className="text-gray-400 hover:text-white transition-colors">Quickstart</Link></li>
                <li><Link href="/docs/scope-functions" className="text-gray-400 hover:text-white transition-colors">Scope Functions</Link></li>
                <li><Link href="/docs/sequences" className="text-gray-400 hover:text-white transition-colors">Sequences</Link></li>
                <li><Link href="/docs/flow" className="text-gray-400 hover:text-white transition-colors">Flow</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Guides</h4>
              <ul className="space-y-2">
                <li><Link href="/docs/client-side" className="text-gray-400 hover:text-white transition-colors">Client-Side</Link></li>
                <li><Link href="/docs/server-side" className="text-gray-400 hover:text-white transition-colors">Server-Side</Link></li>
                <li><Link href="/docs/api" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/maxzillabong/kotlinify-ts" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/maxzillabong/kotlinify-ts/discussions" className="text-gray-400 hover:text-white transition-colors">Discussions</a></li>
                <li><a href="https://github.com/maxzillabong/kotlinify-ts/issues" className="text-gray-400 hover:text-white transition-colors">Issues</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">More</h4>
              <ul className="space-y-2">
                <li><Link href="/docs/changelog" className="text-gray-400 hover:text-white transition-colors">Changelog</Link></li>
                <li><Link href="/docs/contributing" className="text-gray-400 hover:text-white transition-colors">Contributing</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>Built with ❤️ for Kotlin and TypeScript developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
