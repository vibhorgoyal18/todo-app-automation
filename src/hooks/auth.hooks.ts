import { Before, After } from '../fixtures/index';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Runs before every scenario tagged with @auth:required.
 * Reads the saved storageState file and injects the localStorage entries
 * into this context via addInitScript — so only @auth:required tests
 * start pre-authenticated. All other tests get a clean, unauthenticated context.
 */
Before({ tags: '@auth:required' }, async ({ page, context }) => {
  const authFile = path.resolve('.auth/testuser.json');
  const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
  for (const { origin, localStorage: items } of state.origins) {
    await context.addInitScript(
      ({ targetOrigin, localStorageItems }) => {
        if (location.origin === targetOrigin) {
          localStorageItems.forEach(({ name, value }: { name: string; value: string }) => localStorage.setItem(name, value));
        }
      },
      { targetOrigin: origin, localStorageItems: items },
    );
  }
  await page.goto('');
  await page.waitForURL(/#\/dashboard/);
});

/**
 * Runs after every scenario tagged with @auth:required.
 * Clears session storage to ensure a clean state for the next scenario.
 */
After({ tags: '@auth:required' }, async ({ page }) => {
  await page.evaluate(() => localStorage.removeItem('todo_app_user'));
});
