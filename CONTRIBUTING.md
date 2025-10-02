# Contributing to kotlinify-ts

Thank you for your interest in contributing to kotlinify-ts! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, constructive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/maxzillabong/kotlinify-ts/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Code examples
   - Environment details (TypeScript version, Node version, etc.)

### Suggesting Features

1. Check if the feature has been suggested in [Issues](https://github.com/maxzillabong/kotlinify-ts/issues)
2. Create a new issue with:
   - Clear use case and motivation
   - How it aligns with Kotlin's standard library
   - Example API design
   - Alternative approaches considered

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Update documentation as needed
7. Submit a pull request

## Development Setup

```bash
git clone https://github.com/maxzillabong/kotlinify-ts.git
cd kotlinify-ts
npm install
npm test
```

## Coding Standards

### Mandatory Rules

1. **No Comments** - Code must be self-documenting through clear naming
2. **Functional Patterns** - Eliminate intermediate variables, chain operations
3. **Never Mutate Parameters** - Always return new collections
4. **Single Source of Truth** - Extract common checks into reusable functions
5. **Follow Kotlin API** - Match Kotlin's naming and behavior where possible

### TypeScript Guidelines

- Use strict TypeScript with full type safety
- Prefer generic types over `any`
- Export types alongside implementations
- Use JSDoc for public API only (not inline comments)

### Testing

- Write tests for all new functionality
- Maintain 100% code coverage for core features
- Use descriptive test names
- Include edge cases and error scenarios

### Example

```typescript
// ❌ BAD - intermediate variables, mutations
function processItems(items: Item[]) {
  const filtered = [];
  for (const item of items) {
    if (item.active) {
      filtered.push(item);
    }
  }
  return filtered.map(item => item.value);
}

// ✅ GOOD - functional chaining
function processItems(items: Item[]): number[] {
  return items
    .filter(item => item.active)
    .map(item => item.value);
}
```

## Project Structure

```
src/
├── scope/          # Scope functions (let, apply, also, run, with)
├── collections/    # Collection utilities
├── sequences/      # Lazy sequences
├── flow/          # Reactive flows
├── monads/        # Option, Result, Either
├── coroutines/    # Structured concurrency
├── strings/       # String utilities
├── ranges/        # Range utilities
├── duration/      # Duration utilities
├── extensions/    # Extension function helpers
└── index.ts       # Main exports
```

## Commit Messages

Follow conventional commits:

- `feat: add takeWhile to sequences`
- `fix: correct type inference in Result.flatMap`
- `docs: update README with Flow examples`
- `test: add coverage for Option.filter`
- `refactor: simplify asSequence implementation`

## Documentation

- Update README.md for new features
- Add JSDoc for public APIs
- Include usage examples
- Update demo site if applicable

## Questions?

Open a [Discussion](https://github.com/maxzillabong/kotlinify-ts/discussions) or ask in your pull request.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
