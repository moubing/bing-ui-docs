import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:' + (process.env.AI_DOCS_TEST_PORT || '3108')
export default defineConfig({
  testDir: './tests/ai-browser',
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: 'list',
  outputDir: './test-results/ai-docs',
  use: {
    baseURL, browserName: 'chromium', channel: process.env.DOCS_BROWSER_CHANNEL,
    headless: true, trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm exec vite --config tests/fixtures/ai-docs/vite.config.ts',
    url: baseURL, reuseExistingServer: false, timeout: 60_000,
  },
})
