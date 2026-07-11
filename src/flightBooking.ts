import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { getUserByKey } from './utils/userData';

Given('I input the value {string} in {string}', async ({ page }, value: string, label: String) => {
  const input = page.getByRole('combobox', { name: 'Where from?' });
  await input.click();
  await input.clear();
  await input.fill(value);
});

Given('I set the {string} date to {string}', async ({ page }, fieldLabel: string, date: string) => {
  // Convert DD/MM/YYYY → YYYY-MM-DD
  const [day, month, year] = date.split('/');
  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  // Open the calendar by clicking the date input
  await page.getByRole('textbox', { name: fieldLabel }).click();

  // Click the cell matching the iso date and scroll it into view
  const cell = page.locator(`[data-iso="${isoDate}"]`);
  await cell.scrollIntoViewIfNeeded();
  await cell.click();

  // Confirm the selection
  await page.getByRole('button', { name: /done/i }).click();
});

