import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

// ─── Navigation ──────────────────────────────────────────────────────────────

Given('I am on the Google Flights page', async ({ page }) => {
  await page.goto('https://www.google.com/travel/flights');
  await page.waitForLoadState('domcontentloaded');
});

// ─── Origin ───────────────────────────────────────────────────────────────────

When('I set the flight origin to {string}', async ({ page }, origin: string) => {
  await page.getByRole('combobox', { name: 'Where from?' }).click();

  const originDialog = page.getByRole('dialog', { name: 'Enter your origin' });
  await originDialog.waitFor({ state: 'visible' });
  await originDialog.getByRole('combobox').fill(origin);

  const firstSuggestion = page.getByRole('listbox').getByRole('option').first();
  await firstSuggestion.waitFor({ state: 'visible' });
  await firstSuggestion.click();
});

// ─── Destination ──────────────────────────────────────────────────────────────

When('I set the flight destination to {string}', async ({ page }, destination: string) => {
  await page.getByRole('combobox', { name: 'Where to?' }).click();

  const destDialog = page.getByRole('dialog', { name: 'Enter your destination' });
  await destDialog.waitFor({ state: 'visible' });
  await destDialog.getByRole('combobox').fill(destination);

  const firstSuggestion = page.getByRole('listbox').getByRole('option').first();
  await firstSuggestion.waitFor({ state: 'visible' });
  await firstSuggestion.click();
});

// ─── Departure date ───────────────────────────────────────────────────────────

When('I set the departure date to {string}', async ({ page }, date: string) => {
  await page.getByRole('textbox', { name: 'Departure' }).click();

  const departureBtn = page.getByRole('button', { name: new RegExp(date) }).first();
  await departureBtn.waitFor({ state: 'visible' });
  await departureBtn.click();
});

// ─── Return date ──────────────────────────────────────────────────────────────

When('I set the return date to {string}', async ({ page }, date: string) => {
  const returnBtn = page.getByRole('button', { name: new RegExp(date) }).first();
  await returnBtn.waitFor({ state: 'visible' });
  await returnBtn.click();

  await page.getByRole('button', { name: 'Done' }).first().click();
});

// ─── Search ───────────────────────────────────────────────────────────────────

When('I click the Search button', async ({ page }) => {
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForURL(/\/search\?/);
});

// ─── Assertions: results page ─────────────────────────────────────────────────

Then('I should see the flight results', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: /top departing flights/i }),
  ).toBeVisible({ timeout: 15_000 });
});

// ─── Select first flight ──────────────────────────────────────────────────────

When('I select the first flight result', async ({ page }) => {
  const firstFlight = page
    .locator('[role="tabpanel"] [role="listitem"]')
    .first();
  await firstFlight.waitFor({ state: 'visible' });
  await firstFlight.click();
});

// ─── Assertions: return selection page ───────────────────────────────────────

Then('the return flight selection page should be shown', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: /top returning flights/i }),
  ).toBeVisible({ timeout: 15_000 });
});
