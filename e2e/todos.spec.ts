import { test, expect } from '@playwright/test';
test('BFF flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByPlaceholder('New todo...').fill('E2E todo via BFF');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('E2E todo via BFF')).toBeVisible();
  await page.getByRole('checkbox').first().check();
  await expect(page.getByText('Event Flow Logger')).toContainText('BFF: publish');
});
