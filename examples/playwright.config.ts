import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = fileURLToPath(new URL('.', import.meta.url));
const reporterPath = path.resolve(configDir, '../dist/index.js');

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    [reporterPath, { outputFile: 'report.xlsx' }],
  ],
});
