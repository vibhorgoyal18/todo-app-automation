import { expect, Page } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

const labelToTestId: Record<string, string> = {
  'Total Todos': 'stat-total',
  'Completed': 'stat-completed',
  'In Progress': 'stat-in-progress',
  'Overdue': 'stat-overdue',
};

// NOTE: newTabPage was previously a module-level `let` variable — a global
// that is shared across every scenario in the same worker process. It has been
// moved into scenarioContext so each scenario gets its own isolated reference.

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
  await expect.soft(card.locator('p').first()).toHaveText(value);
});

When('I click the {string} stat card', async ({ page, context, scenarioContext }, label: string) => {
  const testId = labelToTestId[label];
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId(testId).click(),
  ]);
  await newTab.waitForLoadState();
  scenarioContext.newTabPage = newTab;
});

Then('a new tab should open with URL containing {string}', async ({ scenarioContext }, urlFragment: string) => {
  expect(scenarioContext.newTabPage).not.toBeNull();
  expect.soft(scenarioContext.newTabPage!.url()).toContain(urlFragment);
});

When('I close the new tab', async ({ scenarioContext }) => {
  await scenarioContext.newTabPage?.close();
  scenarioContext.newTabPage = null;
});
