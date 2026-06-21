import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 45_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 }
      }
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 }
      }
    },
    {
      name: 'chrome-desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1280, height: 900 }
      }
    },
    {
      name: 'chrome-mobile',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome',
        viewport: { width: 412, height: 915 }
      }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 30_000
  }
});
