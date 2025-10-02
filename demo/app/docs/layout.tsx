"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Target, Zap, Waves, RefreshCw, Shield, Package, BookOpen, Smartphone, Server, Type, Hash, Clock, Repeat, CheckCircle2, Wrench, Puzzle } from "lucide-react";

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
      { name: "Extensions", href: "/docs/extensions", icon: Puzzle },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Top Nav */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="kotlinify-ts" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">kotlinify-ts</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-white">
              Docs
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

      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 py-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="space-y-8">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 lg:hidden overflow-y-auto border-r border-white/10 animate-slideInLeft">
              <div className="p-6">
                <nav className="space-y-8">
                  {navigation.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
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
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                              >
                                <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
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
    </div>
  );
}
