import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    env: {
      DATABASE_URL: 'file:./test.db',
      AUTH_SECRET: 'test-secret-test-secret-test-secret-32',
    },
    fileParallelism: false,
    globalSetup: ['./tests/global-setup.ts'],
  },
})
