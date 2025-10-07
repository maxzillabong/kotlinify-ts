"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Target, Zap, Waves, RefreshCw, Shield, Package, BookOpen, Smartphone, Server, Type, Hash, Clock, Repeat, CheckCircle2, Wrench } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";

const navigation = [
  {
    title: "Getting Started",
    items: [
      { name: "Quickstart", href: "/docs/quickstart", icon: BookOpen },
      { name: "API Reference", href: "/docs/api", icon: BookOpen },
    ],
  },
  {
    title: "Core Features",
    items: [
      { name: "Scope Functions", href: "/docs/scope-functions", icon: Target },
      { name: "Collections", href: "/docs/collections", icon: Package },
      { name: "Coroutines", href: "/docs/coroutines", icon: RefreshCw },
      { name: "Duration", href: "/docs/duration", icon: Clock },
      { name: "Flow Streams", href: "/docs/flow", icon: Waves },
      { name: "Lazy Sequences", href: "/docs/sequences", icon: Zap },
      { name: "Ranges", href: "/docs/ranges", icon: Hash },
      { name: "Resilience", href: "/docs/resilience", icon: Repeat },
      { name: "Strings", href: "/docs/strings", icon: Type },
      { name: "Typed Errors", href: "/docs/monads", icon: Shield },
      { name: "Utils", href: "/docs/utils", icon: Wrench },
      { name: "Validation", href: "/docs/validation", icon: CheckCircle2 },
    ],
  },
  {
    title: "Guides",
    items: [
      { name: "Client-Side", href: "/docs/client-side", icon: Smartphone },
      { name: "Server-Side", href: "/docs/server-side", icon: Server },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Background effects matching landing page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 dark:hidden"
          style={{ background: "radial-gradient(circle at top, rgba(179, 197, 255, 0.24) 0%, transparent 65%)" }}
        />
        <div className="hidden dark:block absolute left-1/2 top-[-20%] h-[120%] w-[120%] -translate-x-1/2 opacity-60 blur-3xl bg-gradient-to-br from-accent/20 via-transparent to-primary/20" />
        <div className="hidden dark:block absolute left-[65%] top-[30%] h-[90%] w-[90%] opacity-40 blur-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Top Nav */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>
              <Link href="/" className="flex items-center gap-3">
                <LogoMark size={40} />
                <div className="flex flex-col">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">kotlinify</span>
                  <span className="text-lg font-semibold text-foreground">Kotlin patterns for TypeScript</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Docs
              </Link>
              <Link href="/docs/api" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                API
              </Link>
              <a
                href="https://github.com/maxzillabong/kotlinify-ts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

      <div className="mx-auto w-full max-w-7xl px-6 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 py-8 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
          <nav className="space-y-8">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all group"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile Drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-card z-50 lg:hidden overflow-y-auto border-r border-border animate-slideInLeft">
              <div className="p-6">
                <nav className="space-y-8">
                  {navigation.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all group"
                              >
                                <Icon className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground" />
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 py-8 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} kotlinify-ts. Open source under MIT License.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <a
                href="https://github.com/maxzillabong/kotlinify-ts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/maxzillabong/kotlinify-ts/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Issues
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
