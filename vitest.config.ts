import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    env: {
      DATABASE_URL: 'file:./test.db',
      AUTH_SECRET: 'test-secret-test-secret-test-secret-32',
    },
    // Git worktrees under .worktrees/ hold full copies of tests/; never run them here.
    exclude: [...configDefaults.exclude, '.worktrees/**'],
    fileParallelism: false,
    globalSetup: ['./tests/global-setup.ts'],
  },
})
