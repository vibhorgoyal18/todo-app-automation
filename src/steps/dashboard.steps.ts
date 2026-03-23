import { expect, Page } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

const labelToTestId: Record<string, string> = {
  'Total Todos': 'stat-total',
  'Completed': 'stat-completed',
  'In Progress': 'stat-in-progress',
  'Overdue': 'stat-overdue',
};

let newTabPage: Page | null = null;

Given('I navigate to the Dashboard page', async ({ page }) => {
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page).toHaveURL(/#\/dashboard/);
});

When('I click the Quick Add button', async ({ page }) => {
  await page.getByTestId('quick-add-btn').click();
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/#\/dashboard/);
});

Then('I should see the stat card {string} with value {string}', async ({ page }, label: string, value: string) => {
  const card = page.locator('p', { hasText: label }).locator('..');
  await expect(card.locator('p').first()).toHaveText(value);
});

When('I click the {string} stat card', async ({ page, context }, label: string) => {
  const testId = labelToTestId[label];
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId(testId).click(),
  ]);
  await newTab.waitForLoadState();
  newTabPage = newTab;
});

Then('a new tab should open with URL containing {string}', async ({}, urlFragment: string) => {
  expect(newTabPage).not.toBeNull();
  expect(newTabPage!.url()).toContain(urlFragment);
});

When('I close the new tab', async () => {
  await newTabPage?.close();
  newTabPage = null;
});
