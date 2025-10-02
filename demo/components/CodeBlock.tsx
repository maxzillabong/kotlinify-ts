"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

const customLightTheme = {
  'code[class*="language-"]': {
    color: '#1e293b',
    background: 'transparent',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#1e293b',
    background: 'transparent',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1.5rem',
    margin: '0',
    overflow: 'auto',
  },
  comment: { color: '#94a3b8', fontStyle: 'italic' },
  prolog: { color: '#94a3b8' },
  doctype: { color: '#94a3b8' },
  cdata: { color: '#94a3b8' },
  punctuation: { color: '#64748b' },
  property: { color: '#0369a1' },
  tag: { color: '#0369a1' },
  boolean: { color: '#7c3aed' },
  number: { color: '#7c3aed' },
  constant: { color: '#7c3aed' },
  symbol: { color: '#7c3aed' },
  deleted: { color: '#dc2626' },
  selector: { color: '#059669' },
  'attr-name': { color: '#059669' },
  string: { color: '#059669' },
  char: { color: '#059669' },
  builtin: { color: '#0369a1' },
  inserted: { color: '#059669' },
  operator: { color: '#0891b2' },
  entity: { color: '#0891b2', cursor: 'help' },
  url: { color: '#0891b2' },
  '.language-css .token.string': { color: '#0891b2' },
  '.style .token.string': { color: '#0891b2' },
  variable: { color: '#c026d3' },
  atrule: { color: '#c026d3' },
  'attr-value': { color: '#059669' },
  function: { color: '#9333ea' },
  'class-name': { color: '#ea580c' },
  keyword: { color: '#2563eb', fontWeight: '600' },
  regex: { color: '#c026d3' },
  important: { color: '#dc2626', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "typescript", showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isDark = true;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all opacity-0 group-hover:opacity-100 hover:-translate-y-0.5 hover:text-foreground hover:shadow-md"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-inner">
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : customLightTheme}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-geist-mono)",
            },
          }}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
