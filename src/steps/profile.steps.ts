import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

Given('I navigate to the Profile page', async ({ page }) => {
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/#\/profile/);
});

When('I update the name field to {string}', async ({ page }, name: string) => {
  await page.getByTestId('profile-name-input').clear();
  await page.getByTestId('profile-name-input').fill(name);
});

When('I click Save Profile', async ({ page }) => {
  await page.getByTestId('profile-save-btn').click();
});

When('I fill in the current password {string}', async ({ page }, password: string) => {
  await page.getByTestId('old-password-input').fill(password);
});

When('I fill in the new password {string}', async ({ page }, password: string) => {
  await page.getByTestId('new-password-input').fill(password);
});

When('I fill in the confirm password {string}', async ({ page }, password: string) => {
  await page.getByTestId('confirm-password-input').fill(password);
});

When('I click Change Password', async ({ page }) => {
  await page.getByTestId('change-password-btn').click();
});

Then('I should see a success notification', async ({ page }) => {
  await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 });
});

Then('I should see a password success message', async ({ page }) => {
  await expect(page.getByTestId('password-success-msg')).toBeVisible();
});

Then('I should see a password error message', async ({ page }) => {
  await expect(page.getByTestId('password-error-msg')).toBeVisible();
});
