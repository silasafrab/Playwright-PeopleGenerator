import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright Test Configuration.
 */
export default defineConfig({
  testDir: "./tests",

  /* Run tests in parallel across files */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry tests only on CI */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Configure the reporter */
  reporter: "html",

  /* Global settings for all projects */
  use: {
    headless: false, // Launch the browser in non-headless mode for visibility
    video: "on", // Record video for all tests
    screenshot: "only-on-failure", // Capture screenshot only on failure
    trace: "on-first-retry", // Collect trace on the first retry
  },

  /* Projects configuration for different browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"], // Use the desktop version of Chrome
        launchOptions: {
          slowMo: 600, // Slow down interactions by 600ms for better visual debugging
          args: ["--enable-clipboard-read"], // Enable clipboard read access
        },
      },
    },

    // Uncomment and configure additional projects as needed:
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Configure local development server before tests start */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
