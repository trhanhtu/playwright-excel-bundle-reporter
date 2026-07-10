import { test, expect } from '@playwright/test';

test('network request example', async ({ page }) => {
  await page.goto('https://example.com');
  const response = await page.request.get('https://example.com');
  expect(response.ok()).toBeTruthy();
});
