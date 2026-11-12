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
    // Fake Firebase config: tests must not depend on a local .env or talk to the real project.
    env: {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
      VITE_FIREBASE_APP_ID: '1:000000000000:web:0000000000000000',
      VITE_FIREBASE_MEASUREMENT_ID: 'G-TEST',
    },
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
