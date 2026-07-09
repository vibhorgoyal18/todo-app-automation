import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { getConfig } from './src/utils/configReader';

const envConfig = getConfig();

const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: ['src/steps/**/*.ts', 'src/hooks/**/*.ts', 'src/fixtures/index.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || envConfig.base_url,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
