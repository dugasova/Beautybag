import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Separate from vite.config.ts on purpose: the Cloudflare plugin is not needed (and not wanted) in tests.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['**/node_modules/**', '**/tests/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/mockedData.ts', 'src/**/*.d.ts', 'src/main.tsx'],
      reporter: ['text-summary', 'html'],
      // Floor just below the current baseline (~47% lines). Raise as coverage grows.
      thresholds: { lines: 45, statements: 45, functions: 42, branches: 43 },
    },
  },
});
