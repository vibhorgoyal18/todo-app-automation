import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';
import { getUserByKey } from '../utils/userData';

Given('I am on the login page', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveURL(/#\/login/);
});

Given('I am logged in as {string}', async ({ page }, userKey: string) => {
  const user = getUserByKey(userKey);
  await page.goto('');
  await page.getByTestId('login-username-input').fill(user.key);
  await page.getByTestId('login-password-input').fill(user.password);
  await page.getByTestId('login-submit-btn').click();
  await expect(page).toHaveURL(/#\/dashboard/);
});

When('I enter credentials for user {string}', async ({ page }, userKey: string) => {
  const user = getUserByKey(userKey);
  await page.getByTestId('login-username-input').fill(user.key);
  await page.getByTestId('login-password-input').fill(user.password);
});

When('I enter credentials for user {string} with wrong password {string}', async ({ page }, userKey: string, wrongPassword: string) => {
  const user = getUserByKey(userKey);
  await page.getByTestId('login-username-input').fill(user.key);
  await page.getByTestId('login-password-input').fill(wrongPassword);
});

When('I click the Sign In button', async ({ page }) => {
  await page.getByTestId('login-submit-btn').click();
});

When('I toggle the password visibility', async ({ page }) => {
  await page.getByTestId('toggle-password').click();
});

When('I click the Logout button', async ({ page }) => {
  await page.getByTestId('logout-btn').click();
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/#\/dashboard/);
});

Then('I should see the username {string} in the header', async ({ page }, name: string) => {
  await expect(page.getByTestId('header-username')).toHaveText(name);
});

Then('I should see an error {string}', async ({ page }, message: string) => {
  await expect(page.getByTestId('login-error-message')).toHaveText(message);
});

Then('I should be redirected to the login page', async ({ page }) => {
  await expect(page).toHaveURL(/#\/login/);
});

Then('the password field should show the password as plain text', async ({ page }) => {
  await expect(page.getByTestId('login-password-input')).toHaveAttribute('type', 'text');
});
