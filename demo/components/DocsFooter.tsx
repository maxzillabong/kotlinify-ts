"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function DocsFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/docs/api" className="hover:text-foreground transition-colors">
              API Reference
            </Link>
            <a href="https://github.com/maxzillabong/kotlinify-kt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for TypeScript developers
          </p>
        </div>
      </div>
    </footer>
  );
}
