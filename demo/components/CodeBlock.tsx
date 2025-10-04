"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Play } from "lucide-react";

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
  executable?: boolean;
}

export function CodeBlock({ code, language = "typescript", showLineNumbers = false, executable = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const isDark = true;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput([]);
    const logs: string[] = [];

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalLog(...args);
    };
    console.error = (...args: unknown[]) => {
      logs.push(`ERROR: ${args.map(arg => String(arg)).join(' ')}`);
      originalError(...args);
    };
    console.warn = (...args: unknown[]) => {
      logs.push(`WARN: ${args.map(arg => String(arg)).join(' ')}`);
      originalWarn(...args);
    };

    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const executableCode = `
        const sequences = await import('kotlinify/sequences');
        const scope = await import('kotlinify/scope');
        const flow = await import('kotlinify/flow');
        const monads = await import('kotlinify/monads');
        const coroutines = await import('kotlinify/coroutines');
        const collections = await import('kotlinify/collections');
        const strings = await import('kotlinify/strings');
        const ranges = await import('kotlinify/ranges');
        const duration = await import('kotlinify/duration');

        const { asSequence, sequenceOf, generateSequence, Sequence } = sequences;
        const { asScope } = scope;
        const { flowOf, flow: createFlow } = flow;
        const { Result, Option, fromNullable, Success, Failure, tryCatch, Some, None } = monads;
        const { coroutineScope, launch, async: asyncValue, delay, withTimeout } = coroutines;
        const { groupBy, associateBy, chunked, windowed, zip, slice } = collections;
        const { trimIndent, trimMargin, lines } = strings;
        const { rangeTo, until, downTo, IntRange } = ranges;
        const { Duration } = duration;

        ${code}
      `;
      await new AsyncFunction(executableCode)();

      if (logs.length === 0) {
        logs.push('// Code executed successfully (no output)');
      }
    } catch (error) {
      logs.push(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      setOutput(logs);
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="group relative">
        <div className="absolute right-3 top-3 flex gap-2 z-10">
          {executable && (
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex h-9 px-3 items-center justify-center gap-2 rounded-lg border border-border bg-card text-muted-foreground transition-all opacity-0 group-hover:opacity-100 hover:-translate-y-0.5 hover:text-foreground hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Run code"
            >
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all opacity-0 group-hover:opacity-100 hover:-translate-y-0.5 hover:text-foreground hover:shadow-md"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
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
      {output.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-inner">
          <div className="border-b border-border px-4 py-2 bg-muted/50">
            <span className="text-sm font-medium text-foreground">Output</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-1">
            {output.map((line, idx) => (
              <div key={idx} className={line.startsWith('ERROR:') ? 'text-red-500' : line.startsWith('WARN:') ? 'text-yellow-500' : 'text-foreground'}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
