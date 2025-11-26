import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/server.ts'],
  outDir: './dist',
  format: 'esm',
  sourcemap: true,
  clean: true,
  shims: true, // Adds __dirname/__filename shims for ESM
  // Keep native/binary deps external
  external: [
    '@sentry/profiling-node',
    'bcrypt',
    'pg-native',
    '@prisma/client',
    '.prisma/client',
  ],
  // Bundle workspace packages
  noExternal: [/@shared\/.*/],
  plugins: [
    {
      name: 'typescript-transform-paths',
    },
  ],
})
