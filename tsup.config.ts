import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    scope: 'src/scope/index.ts',
    flow: 'src/flow/index.ts',
    monads: 'src/monads/index.ts',
    coroutines: 'src/coroutines/index.ts',
    sequences: 'src/sequences/index.ts',
    collections: 'src/collections/index.ts',
    strings: 'src/strings/index.ts',
    ranges: 'src/ranges/index.ts',
    duration: 'src/duration/index.ts',
    resilience: 'src/resilience/index.ts',
    channels: 'src/channels/index.ts',
  },
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  globalName: 'kotlinify',
});
