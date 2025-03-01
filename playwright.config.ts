import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['allure-playwright', 
      { 
        detail: true, 
        suiteTitle: false,
        disableWebdriverScreenshotsReporting: false 
      }
  ],
    ['html'],
    ['./helpers/testCaseCreator/TestCaseCreator.ts'],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
