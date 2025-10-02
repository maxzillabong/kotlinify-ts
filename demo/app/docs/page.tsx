import Link from "next/link";
import { Target, Zap, Waves, RefreshCw, Shield, Package, BookOpen, Smartphone, Server, Type, Hash, Clock, Repeat, CheckCircle2, Wrench } from "lucide-react";
import { LucideIcon } from "lucide-react";

const DocCard = ({
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
    className="block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-600/30 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-600/10 group"
  >
    <Icon className="w-8 h-8 mb-3 text-slate-500 group-hover:text-slate-400 transition-all group-hover:scale-110" />
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-slate-400 transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
  </Link>
);

export default function DocsPage() {
  return (
    <div className="animate-fadeInUp">
        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
        <p className="text-xl text-gray-300 mb-12">
          Learn how to use kotlinify-ts in your TypeScript projects
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <DocCard
              icon={BookOpen}
              title="Quickstart"
              description="Install kotlinify-ts and start using Kotlin patterns in minutes"
              href="/docs/quickstart"
            />
            <DocCard
              icon={BookOpen}
              title="API Reference"
              description="Complete reference for all functions, types, and modules"
              href="/docs/api"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <DocCard
              icon={Target}
              title="Scope Functions"
              description="Transform objects with let, apply, also, run, and with"
              href="/docs/scope-functions"
            />
            <DocCard
              icon={Zap}
              title="Lazy Sequences"
              description="Process large datasets efficiently with lazy evaluation"
              href="/docs/sequences"
            />
            <DocCard
              icon={Waves}
              title="Flow Streams"
              description="Reactive streams with backpressure for real-time data"
              href="/docs/flow"
            />
            <DocCard
              icon={RefreshCw}
              title="Coroutines"
              description="Structured concurrency with automatic cancellation"
              href="/docs/coroutines"
            />
            <DocCard
              icon={Shield}
              title="Typed Errors"
              description="Functional error handling with Option, Either, and Result"
              href="/docs/monads"
            />
            <DocCard
              icon={Package}
              title="Collections"
              description="40+ powerful operations for arrays and iterables"
              href="/docs/collections"
            />
            <DocCard
              icon={Type}
              title="Strings"
              description="String formatting, padding, and text manipulation utilities"
              href="/docs/strings"
            />
            <DocCard
              icon={Hash}
              title="Ranges"
              description="Numeric progressions with lazy evaluation and iteration"
              href="/docs/ranges"
            />
            <DocCard
              icon={Clock}
              title="Duration"
              description="Type-safe time durations with arithmetic and formatting"
              href="/docs/duration"
            />
            <DocCard
              icon={Repeat}
              title="Resilience"
              description="Retry and repeat operations with sophisticated scheduling policies"
              href="/docs/resilience"
            />
            <DocCard
              icon={CheckCircle2}
              title="Validation"
              description="Accumulate validation errors with zipOrAccumulate and mapOrAccumulate"
              href="/docs/validation"
            />
            <DocCard
              icon={Wrench}
              title="Utils"
              description="Essential utilities: repeat, require, check, lazy, and more"
              href="/docs/utils"
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Guides</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <DocCard
              icon={Smartphone}
              title="Client-Side Guide"
              description="React, Vue, browser applications, and frontend patterns"
              href="/docs/client-side"
            />
            <DocCard
              icon={Server}
              title="Server-Side Guide"
              description="Node.js, Express, backend applications, and API development"
              href="/docs/server-side"
            />
          </div>
        </section>
      </div>
  );
}
