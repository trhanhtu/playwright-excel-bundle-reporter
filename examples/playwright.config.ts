import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    [
      'playwright-excel-reporter',
      {
        outputFile: 'report.xlsx',
      },
    ],
  ],
});
