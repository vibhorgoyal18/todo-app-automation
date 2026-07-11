import { chromium } from '@playwright/test';
import { getConfig } from './utils/configReader';
import { getUserByKey } from './utils/userData';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Global setup — runs once before the entire test suite.
 * Logs in as testuser, saves the authenticated sessionStorage to
 * .auth/testuser.json so every test context starts pre-authenticated.
 */
async function globalSetup() {
  const baseURL = process.env.BASE_URL || getConfig().base_url;
  const user = getUserByKey('testuser');

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  await page.goto('');
  await page.getByTestId('login-username-input').fill(user.key);
  await page.getByTestId('login-password-input').fill(user.password);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL(/#\/dashboard/);

  const authDir = path.resolve('.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  await context.storageState({ path: path.join(authDir, 'testuser.json') });

  await browser.close();
}

export default globalSetup;
