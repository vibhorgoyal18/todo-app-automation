import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

Given('I navigate to the Dashboard page', async ({ page }) => {
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page).toHaveURL(/#\/dashboard/);
});

When('I click the Quick Add button', async ({ page }) => {
  await page.getByTestId('quick-add-btn').click();
});

Then('I should see the stat card {string} with value {string}', async ({ page }, label: string, value: string) => {
  const card = page.locator('p', { hasText: label }).locator('..');
  await expect(card.locator('p').first()).toHaveText(value);
});
