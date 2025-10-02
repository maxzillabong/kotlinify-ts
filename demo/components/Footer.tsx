"use client";

import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <LogoMark size={48} />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">kotlinify</span>
                <span className="text-lg font-bold text-foreground">Kotlin for TypeScript</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Bring Kotlin's beloved utility functions and patterns to TypeScript.
              Zero dependencies, full type safety, and pure functional elegance.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/maxzillabong/kotlinify-kt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:shadow-lg"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Getting Started</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/quickstart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Quickstart
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Core Features</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/scope-functions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Scope Functions
                  </Link>
                </li>
                <li>
                  <Link href="/docs/flow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Flow Streams
                  </Link>
                </li>
                <li>
                  <Link href="/docs/sequences" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Lazy Sequences
                  </Link>
                </li>
                <li>
                  <Link href="/docs/monads" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Typed Errors
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/client-side" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Client-Side Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/server-side" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Server-Side Guide
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/maxzillabong/kotlinify-kt/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    GitHub Issues
                  </a>
                </li>
                <li>
                  <a href="https://github.com/maxzillabong/kotlinify-kt/discussions" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Discussions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} kotlinify-ts. Open source under MIT License.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by developers, for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
