import { Before, After } from '../fixtures/index';
import { getUserByKey } from '../utils/userData';

/**
 * Runs before every scenario tagged with @auth:required.
 * Navigates to the app and logs in as testuser.
 */
Before({ tags: '@auth:required' }, async ({ page }) => {
  const user = getUserByKey('testuser');
  await page.goto('');
  await page.getByTestId('login-username-input').fill(user.key);
  await page.getByTestId('login-password-input').fill(user.password);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL(/#\/dashboard/);
});

/**
 * Runs after every scenario tagged with @auth:required.
 * Clears session storage to ensure a clean state for the next scenario.
 */
After({ tags: '@auth:required' }, async ({ page }) => {
  await page.evaluate(() => sessionStorage.clear());
});
