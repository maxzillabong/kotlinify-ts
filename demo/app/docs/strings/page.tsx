"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPageLayout } from "@/components/DocsPageLayout";
import { DocsSection } from "@/components/DocsSection";

export default function StringsPage() {
  const multilineStringsExample = `import { trimIndent, trimMargin } from 'kotlinify-ts/strings';

// Remove common leading indentation
const sql = trimIndent(\`
    SELECT u.id, u.name, u.email
    FROM users u
    WHERE u.active = true
      AND u.created_at > '2024-01-01'
    ORDER BY u.name
\`);
// Result: Clean SQL with no leading spaces

// Remove margin prefix for better formatting
const markdown = trimMargin(\`
    |# User Profile
    |
    |## Basic Information
    |- Name: John Doe
    |- Email: john@example.com
    |
    |## Permissions
    |- Read: Yes
    |- Write: Yes
    |- Admin: No
\`);
// Result: Markdown with '|' margin removed

// Custom margin prefix
const config = trimMargin(\`
    >>server.host=localhost
    >>server.port=8080
    >>server.ssl=true
    >>
    >>database.url=postgresql://localhost/myapp
    >>database.pool.size=10
\`, '>>')
// Result: Config with '>>' margin removed

// With prototype extensions
import 'kotlinify-ts/strings';

const template = \`
    <div class="card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
\`.trimIndent();

const documentation = \`
    |/**
    | * Processes user data and returns formatted result.
    | * @param user - The user object to process
    | * @returns Formatted user information
    | */
\`.trimMargin();`;

  const paddingExample = `import { padStart, padEnd } from 'kotlinify-ts/strings';

// Align numbers in columns
const invoice = [
  padEnd('Item', 20) + padStart('Price', 10),
  padEnd('Widget', 20) + padStart('$12.99', 10),
  padEnd('Gadget Pro', 20) + padStart('$149.99', 10),
  padEnd('Service Fee', 20) + padStart('$5.00', 10),
].join('\\n');

// Format time components
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const time = \`\${hours}:\${minutes}\`;

// Create visual separators
const title = 'Section Title';
const decorated = padStart(padEnd(title, title.length + 3, '-'), 40, '-');
// Result: "----------Section Title---"

// Binary/hex formatting
const binary = (42).toString(2).padStart(8, '0'); // "00101010"
const hex = (255).toString(16).padStart(4, '0').toUpperCase(); // "00FF"

// With prototype extensions
const formatted = 'STATUS'
  .padEnd(10)
  .concat(count.toString().padStart(5, '0'));

const id = userId
  .toString()
  .padStart(8, '0')
  .let(id => \`USER-\${id}\`);`;

  const affixRemovalExample = `import { removePrefix, removeSuffix, removeSurrounding } from 'kotlinify-ts/strings';

// Clean up file paths
const filename = removePrefix('/tmp/uploads/image.jpg', '/tmp/');
// Result: "uploads/image.jpg"

const basename = removeSuffix('document.pdf', '.pdf');
// Result: "document"

// Parse URLs and parameters
const path = removePrefix('https://api.example.com/v1/users', 'https://');
const param = removeSurrounding('key="value"', '"');

// Clean formatted strings
const trimmed = removeSurrounding('[INFO] Log message', '[', ']');
// Result: "INFO] Log message" (only removes if both present)

// Process command output
const output = shellOutput
  .split('\\n')
  .map(line => removePrefix(line, '> '))
  .filter(line => line.length > 0);

// Parse configuration values
const value = configLine
  .removePrefix('config.')
  .removeSuffix(';')
  .trim();

// With prototype extensions
const cleaned = rawInput
  .removePrefix('data:')
  .removeSuffix('\\n')
  .removeSurrounding('"')
  .trim();

// Clean multiple affixes
const processUrl = (url: string) =>
  url
    .removePrefix('http://')
    .removePrefix('https://')
    .removePrefix('www.')
    .removeSuffix('/')
    .removeSuffix('/index.html');`;

  const caseManipulationExample = `import { capitalize, decapitalize } from 'kotlinify-ts/strings';

// Format display names
const displayName = capitalize('john'); // "John"
const title = words.map(capitalize).join(' '); // Title Case

// Convert between naming conventions
const varName = decapitalize('UserName'); // "userName"
const propertyName = decapitalize(className); // "myClass" from "MyClass"

// Format messages
const sentence = capitalize(message.toLowerCase());
const label = fieldName
  .split('_')
  .map((part, i) => i === 0 ? part : capitalize(part))
  .join(''); // snake_case to camelCase

// API response formatting
const formatResponse = (data: any) => ({
  ...data,
  type: capitalize(data.type),
  status: data.status.toUpperCase(),
  message: capitalize(data.error_message || 'Success')
});

// With prototype extensions
const formatted = identifier
  .split('-')
  .map(part => part.capitalize())
  .join(' ');

const camelCased = snake_case_string
  .split('_')
  .map((part, i) => i === 0 ? part : part.capitalize())
  .join('');`;

  const utilityFunctionsExample = `import { repeat, lines, reversed } from 'kotlinify-ts/strings';

// Visual separators and formatting
const separator = repeat('=', 50);
const dots = repeat('.', count);
const indent = repeat('  ', level); // Indentation levels

// Process multi-line text
const logLines = logOutput.lines();
const nonEmpty = text.lines().filter(line => line.trim().length > 0);
const numbered = content
  .lines()
  .map((line, i) => \`\${i + 1}. \${line}\`)
  .join('\\n');

// Parse structured text
const csvRows = csvData.lines().map(line => line.split(','));
const configPairs = configFile
  .lines()
  .filter(line => !line.startsWith('#'))
  .map(line => {
    const [key, value] = line.split('=');
    return { key: key.trim(), value: value.trim() };
  });

// String reversal
const palindrome = text === reversed(text);
const mirrorEffect = text + reversed(text);

// With prototype extensions
const formatted = text
  .lines()
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => '  ' + line)
  .join('\\n');

const isPalindrome = input
  .toLowerCase()
  .replace(/\\s/g, '')
  .let(s => s === s.reversed());`;

  const practicalExample = `import 'kotlinify-ts/strings';

// Configuration file parser
function parseConfig(content: string): Record<string, any> {
  const config: Record<string, any> = {};

  content
    .trimIndent()
    .lines()
    .filter(line => !line.startsWith('#') && line.includes('='))
    .forEach(line => {
      const [key, value] = line.split('=').map(s => s.trim());
      const cleanKey = key.removePrefix('app.');
      const cleanValue = value
        .removeSurrounding('"')
        .removeSurrounding("'");

      // Convert dotted keys to nested objects
      const parts = cleanKey.split('.');
      let current = config;

      parts.forEach((part, i) => {
        if (i === parts.length - 1) {
          current[part] = cleanValue;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });

  return config;
}

// Log formatter
function formatLogEntry(
  level: string,
  message: string,
  metadata?: Record<string, any>
): string {
  const timestamp = new Date().toISOString();
  const levelFormatted = \`[\${level.toUpperCase().padEnd(5)}]\`;

  let entry = \`\${timestamp} \${levelFormatted} \${message}\`;

  if (metadata && Object.keys(metadata).length > 0) {
    const metaString = Object.entries(metadata)
      .map(([key, value]) => \`\${key}=\${JSON.stringify(value)}\`)
      .join(' ');
    entry += \` | \${metaString}\`;
  }

  return entry;
}

// Template processor
function processTemplate(template: string, data: Record<string, any>): string {
  return template
    .trimIndent()
    .split('\\n')
    .map(line => {
      let processed = line;
      Object.entries(data).forEach(([key, value]) => {
        processed = processed.replace(
          new RegExp(\`{{\\\\\s*\${key}\\\\\s*}}\`, 'g'),
          String(value)
        );
      });
      return processed;
    })
    .join('\\n');
}

// SQL query builder
class QueryBuilder {
  private parts: string[] = [];

  select(...columns: string[]): this {
    const formatted = columns.length === 0 ? '*' : columns.join(', ');
    this.parts.push(\`SELECT \${formatted}\`);
    return this;
  }

  from(table: string): this {
    this.parts.push(\`FROM \${table}\`);
    return this;
  }

  where(condition: string): this {
    this.parts.push(\`WHERE \${condition}\`);
    return this;
  }

  build(): string {
    return this.parts
      .join('\\n')
      .trimIndent()
      .lines()
      .map((line, i) => i === 0 ? line : '  ' + line)
      .join('\\n');
  }
}

// Markdown table formatter
function createMarkdownTable(
  headers: string[],
  rows: string[][]
): string {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => r[i]?.length || 0))
  );

  const formatRow = (cells: string[]) =>
    '| ' + cells.map((cell, i) =>
      cell.padEnd(colWidths[i])
    ).join(' | ') + ' |';

  const separator = '|' + colWidths.map(w =>
    '-'.repeat(w + 2)
  ).join('|') + '|';

  return [
    formatRow(headers),
    separator,
    ...rows.map(formatRow)
  ].join('\\n');
}`;

  const comparisonExample = `// JavaScript standard methods vs kotlinify-ts

// Multi-line string formatting
// JavaScript - manual indentation handling
const sql = \`
    SELECT * FROM users
    WHERE active = true
\`.split('\\n').map(line => line.trim()).filter(Boolean).join('\\n');

// kotlinify-ts - clean and simple
const sql = \`
    SELECT * FROM users
    WHERE active = true
\`.trimIndent();

// Padding
// JavaScript - native padStart/padEnd (limited)
const padded = str.padStart(10); // only supports single char padding

// kotlinify-ts - extended padding
const padded = str.padStart(10, '->'); // multi-char padding

// Prefix/suffix removal
// JavaScript - manual checking and slicing
const cleaned = str.startsWith('prefix')
  ? str.slice('prefix'.length)
  : str;

// kotlinify-ts - direct method
const cleaned = str.removePrefix('prefix');

// Case manipulation
// JavaScript - no built-in capitalize
const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

// kotlinify-ts - simple method
const capitalized = str.capitalize();

// Line processing
// JavaScript - split and manual handling
const lines = str.split(/\\r?\\n/);

// kotlinify-ts - built-in line handling
const lines = str.lines();

// String reversal
// JavaScript - array manipulation
const reversed = str.split('').reverse().join('');

// kotlinify-ts - direct method
const reversed = str.reversed();`;

  return (
    <DocsPageLayout>
      <h1 className="text-4xl font-bold text-white mb-6">Strings</h1>
      <p className="text-xl text-gray-300 mb-12">
        Transform the string manipulation chaos into clean, expressive operations. Because life's too short for manual padding calculations and regex line splitting.
      </p>

      <div className="prose prose-invert max-w-none space-y-12">
        <DocsSection
          title="The String Manipulation Struggle"
          description="Every developer has written these same string utilities a hundred times. Time to stop."
        >
          <div className="bg-red-900/10 border border-red-600/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-red-400 mb-4">The Tedious Reality</h4>
            <CodeBlock
              code={`// Removing indentation? Welcome to regex hell
const cleanSql = sql
  .split('\\n')
  .map(line => line.replace(/^\\s{4}/, '')) // Hope it's always 4 spaces!
  .join('\\n');

// Need to pad strings? Time for arithmetic
const padded = ' '.repeat(Math.max(0, 10 - str.length)) + str;

// Capitalize a word? Character juggling time
const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

// Remove a prefix? Verbose conditional logic
let path = fullPath;
if (path.startsWith('/tmp/')) {
  path = path.substring(5);
}

// Process lines? Split, filter, map, join... every time
const processed = text
  .split(/\\r?\\n/)  // Don't forget Windows line endings!
  .filter(line => line.trim().length > 0)
  .map(line => processLine(line))
  .join('\\n');

// You've written this code. Your team has written it.
// It's in every project, slightly different each time.
// Bugs hide in the edge cases. Time is wasted.`}
              language="typescript"
            />
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold text-white mb-4">The kotlinify-ts Way: String Operations That Just Work</h4>
            <CodeBlock
              code={`import { trimIndent, padStart, capitalize, removePrefix, lines } from 'kotlinify-ts/strings';

// Clean indentation? One method.
const cleanSql = trimIndent(sql);

// Padding? Simple and clear.
const padded = padStart(str, 10);

// Capitalize? Direct and obvious.
const capitalized = capitalize(word);

// Remove prefix? Says what it does.
const path = removePrefix(fullPath, '/tmp/');

// Process lines? Readable chain.
const processed = lines(text)
  .filter(line => line.trim().length > 0)
  .map(processLine)
  .join('\\n');

// Or with prototype extensions - even cleaner:
import 'kotlinify-ts/strings';

const result = sql
  .trimIndent()
  .lines()
  .map(line => line.removePrefix('--'))
  .filter(line => !line.startsWith('#'))
  .join('\\n');

// What took 20 lines of boilerplate now takes 5.
// Readable. Predictable. Maintainable.`}
              language="typescript"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-900/10 border border-slate-700/20 rounded-lg p-4">
              <h4 className="text-slate-500 font-semibold mb-2">Stop Reinventing</h4>
              <p className="text-gray-300 text-sm">
                Use battle-tested string operations instead of writing them again.
              </p>
            </div>
            <div className="bg-blue-900/10 border border-blue-600/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Express Intent</h4>
              <p className="text-gray-300 text-sm">
                Methods that say what they do, not how they do it.
              </p>
            </div>
            <div className="bg-green-900/10 border border-green-600/20 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Chain Naturally</h4>
              <p className="text-gray-300 text-sm">
                Compose operations fluently without intermediate variables.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          title="Multi-line String Formatting"
          description="Clean up indentation and margins in multi-line strings with ease."
        >
          <CodeBlock code={multilineStringsExample} language="typescript" />

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Try it yourself:</h4>
          <CodeBlock
            code={`// Clean up indented strings
const code = trimIndent(\`
    function hello() {
      console.log('Hello!');
    }
\`);

console.log('Trimmed:');
console.log(code);

// Remove margin prefix
const doc = trimMargin(\`
    |## Title
    |This is content
    |More content
\`);

console.log('\\nWith margin removed:');
console.log(doc);`}
            language="typescript"
          />
        </DocsSection>

        <DocsSection
          title="String Padding"
          description="Align text, format numbers, and create visual layouts with precise padding control."
        >
          <CodeBlock code={paddingExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Prefix & Suffix Removal"
          description="Clean strings by removing unwanted prefixes, suffixes, and surrounding delimiters."
        >
          <CodeBlock code={affixRemovalExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Case Manipulation"
          description="Convert between naming conventions and format strings for display."
        >
          <CodeBlock code={caseManipulationExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Utility Functions"
          description="Essential string operations for repetition, line processing, and reversal."
        >
          <CodeBlock code={utilityFunctionsExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Real-World Examples"
          description="Complete examples showing how string utilities solve common tasks."
        >
          <CodeBlock code={practicalExample} language="typescript" />
        </DocsSection>

        <DocsSection
          title="Comparison with JavaScript"
          description="See how kotlinify-ts strings improve upon standard JavaScript string methods."
        >
          <CodeBlock code={comparisonExample} language="typescript" />
        </DocsSection>

        <DocsSection title="API Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-white font-semibold mb-3">Formatting</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">trimIndent()</code> - Remove common leading whitespace</li>
                <li><code className="text-slate-500">trimMargin(prefix)</code> - Remove margin prefix from lines</li>
                <li><code className="text-slate-500">padStart(length, char)</code> - Pad string to length from start</li>
                <li><code className="text-slate-500">padEnd(length, char)</code> - Pad string to length from end</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Affixes</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">removePrefix(prefix)</code> - Remove prefix if present</li>
                <li><code className="text-slate-500">removeSuffix(suffix)</code> - Remove suffix if present</li>
                <li><code className="text-slate-500">removeSurrounding(delimiter)</code> - Remove surrounding delimiters</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Case</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">capitalize()</code> - Uppercase first character</li>
                <li><code className="text-slate-500">decapitalize()</code> - Lowercase first character</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Utilities</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="text-slate-500">repeat(count)</code> - Repeat string n times</li>
                <li><code className="text-slate-500">lines()</code> - Split into array of lines</li>
                <li><code className="text-slate-500">reversed()</code> - Reverse character order</li>
              </ul>
            </div>
          </div>
        </DocsSection>

        <DocsSection title="Next Steps">
          <div className="flex gap-4">
            <Link
              href="/docs/ranges"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Ranges →
            </Link>
            <Link
              href="/docs/collections"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Collections
            </Link>
          </div>
        </DocsSection>
      </div>
    </DocsPageLayout>
  );
}