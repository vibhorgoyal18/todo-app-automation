import { expect } from '@playwright/test';
import { Given, When, Then, Before } from '../fixtures/index';

Before(async ({ page }) => {
  // Optional: reset state before each scenario
});

Given('I am on the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/login/);
});

Given('I am logged in as {string} with password {string}', async ({ page }, username: string, password: string) => {
  await page.goto('/');
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).not.toHaveURL(/login/);
});

When('I enter username {string} and password {string}', async ({ page }, username: string, password: string) => {
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
});

When('I click the login button', async ({ page }) => {
  await page.getByRole('button', { name: /login/i }).click();
});

When('I click the logout button', async ({ page }) => {
  await page.getByRole('button', { name: /logout/i }).click();
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/dashboard/);
});

Then('I should be redirected to the login page', async ({ page }) => {
  await expect(page).toHaveURL(/login/);
});

Then('I should see an error message', async ({ page }) => {
  await expect(page.getByRole('alert')).toBeVisible();
});
