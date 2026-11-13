import { defineConfig } from '@playwright/test'

const port = process.env.DOCS_TEST_PORT || '3107'
const baseURL = process.env.DOCS_BASE_URL || `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: 'list',
  outputDir: './test-results/site',
  use: {
    baseURL,
    browserName: 'chromium',
    channel: process.env.DOCS_BROWSER_CHANNEL,
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: process.env.DOCS_BASE_URL ? undefined : {
    command: `pnpm exec nuxt dev --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
