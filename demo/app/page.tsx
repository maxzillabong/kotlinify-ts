"use client";

import Link from "next/link";
import {
  Feather,
  Lock,
  LucideIcon,
  Package,
  RefreshCw,
  Rocket,
  Shield,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import { Spotlight } from "@/components/aceternity/spotlight";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { LogoMark } from "@/components/LogoMark";
import { Footer } from "@/components/Footer";

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}> = [
  {
    icon: Target,
    title: "Scope Functions",
    description:
      "Transform objects with let, apply, also, run, and with for expressive pipelines without temporary variables.",
    href: "/docs/scope-functions",
  },
  {
    icon: Zap,
    title: "Lazy Sequences",
    description:
      "Process large datasets with streaming transforms and short-circuiting performance that beats arrays when it matters.",
    href: "/docs/sequences",
  },
  {
    icon: Waves,
    title: "Flow Streams",
    description:
      "Coordinate async jobs with cold and hot streams, cancellable backpressure, and ergonomic async iteration.",
    href: "/docs/flow",
  },
  {
    icon: RefreshCw,
    title: "Coroutines",
    description:
      "Launch background work with timeouts, cancellation, and error propagation inspired by Kotlin structured concurrency.",
    href: "/docs/coroutines",
  },
  {
    icon: Shield,
    title: "Typed Errors",
    description:
      "Adopt Result, Option, and Either monads for explicit error handling that keeps control flow predictable.",
    href: "/docs/monads",
  },
  {
    icon: Package,
    title: "Collections",
    description:
      "Group, partition, and transform iterables with zero-dependency utilities tuned for TypeScript type inference.",
    href: "/docs/collections",
  },
];

const highlights: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Feather,
    title: "Lightweight",
    description: "Zero dependencies with tree-shakeable modules from 120 bytes up to 8 KB gzipped.",
  },
  {
    icon: Lock,
    title: "Type-Safe",
    description: "Inferred generics and exhaustive unions keep Kotlin-style ergonomics inside TypeScript projects.",
  },
  {
    icon: Rocket,
    title: "Production-Ready",
    description: "Battle-tested core covered by 95%+ automated tests across scope, flow, and collection modules.",
  },
];

const testimonials = [
  {
    quote:
      "kotlinify brings the best parts of Kotlin to TypeScript. Scope helpers and monads keep our codebases consistent across platforms.",
    author: "Product Engineering Lead",
  },
  {
    quote:
      "Moving reactive pipelines to Flow cut cognitive load. The coroutine-style cancellation is a perfect fit for React apps.",
    author: "Frontend Staff Engineer",
  },
];

const FeatureCard = ({ icon: Icon, title, description, href }: (typeof features)[number]) => (
  <Link
    href={href}
    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 dark:block dark:group-hover:opacity-100">
      <div className="absolute inset-[-40%] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />
    </div>
    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="relative mt-6 text-xl font-semibold text-foreground">
      {title}
    </h3>
    <p className="relative mt-3 text-base text-muted-foreground leading-relaxed">
      {description}
    </p>
  </Link>
);

const Highlight = ({ icon: Icon, title, description }: (typeof highlights)[number]) => (
  <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground dark:bg-secondary/60">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 dark:hidden"
          style={{ background: "radial-gradient(circle at top, rgba(179, 197, 255, 0.24) 0%, transparent 65%)" }}
        />
        <Spotlight
          className="hidden dark:block left-1/2 top-[-20%] h-[120%] w-[120%] -translate-x-1/2 opacity-60 blur-3xl"
          fill="var(--accent)"
        />
        <Spotlight
          className="hidden dark:block left-[65%] top-[30%] h-[90%] w-[90%] opacity-40 blur-2xl"
          fill="var(--primary)"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <LogoMark size={40} />
              <div className="flex flex-col">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">kotlinify</span>
                <span className="text-lg font-semibold text-foreground">Kotlin patterns for TypeScript</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Docs
              </Link>
              <Link
                href="/docs/api"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                API
              </Link>
              <a
                href="https://github.com/maxzillabong/kotlinify-kt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <section className="relative overflow-hidden px-6 pb-24 pt-32">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <TextGenerateEffect
                words="Bring expressive Kotlin utilities to your TypeScript codebase"
                className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-6xl"
              />
              <p className="mt-6 max-w-3xl text-balance text-lg text-muted-foreground md:text-xl">
                Scope helpers, lazy sequences, resilient flow streams, and exhaustive monads crafted for modern full-stack teams.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Explore Quickstart
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
                >
                  Browse Documentation
                </Link>
              </div>
              <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Installation</p>
                  <p className="mt-2 truncate font-mono text-sm text-foreground">npm install kotlinify-ts</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bundle Size</p>
                  <p className="mt-2 text-sm text-foreground">0 deps · tree-shakeable</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Compatibility</p>
                  <p className="mt-2 text-sm text-foreground">Node 18 · React 18+</p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
              <div className="flex flex-col gap-3 text-center">
                <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Everything you love from Kotlin</h2>
                <p className="text-lg text-muted-foreground">
                  Familiar APIs with rigorous TypeScript typings so every helper feels instantly at home.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {features.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Product-minded ergonomics</h2>
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
                Designed for teams shipping across web, mobile, and server runtimes with consistent patterns.
              </p>
              <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
                {highlights.map((highlight) => (
                  <Highlight key={highlight.title} {...highlight} />
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 text-center">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Trusted by teams shipping fast</h2>
              <div className="grid gap-6">
                {testimonials.map(({ quote, author }) => (
                  <blockquote
                    key={author}
                    className="rounded-2xl border border-border bg-card p-8 text-left shadow-sm"
                  >
                    <p className="text-lg italic text-foreground">“{quote}”</p>
                    <cite className="mt-4 block text-sm font-medium text-muted-foreground">{author}</cite>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 pb-32">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center rounded-3xl border border-border bg-card p-12 text-center shadow-xl">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Ready to ship Kotlin vibes?</h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Install kotlinify-ts and unlock expressive, type-safe utilities that scale from side projects to enterprise platforms.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <code className="rounded-full border border-border bg-card px-6 py-3 font-mono text-sm text-foreground shadow-inner">
                  npm install kotlinify-ts
                </code>
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  View Quickstart Guide
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
