import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

Given('I navigate to the todos page', async ({ page }) => {
  await page.getByRole('link', { name: /todos/i }).click();
  await expect(page).toHaveURL(/todos/);
});

Given('there is a todo {string}', async ({ page }, title: string) => {
  await page.getByPlaceholder(/add.*todo|new.*todo/i).fill(title);
  await page.getByRole('button', { name: /add/i }).click();
  await expect(page.getByText(title)).toBeVisible();
});

Given('there is a todo {string} that is completed', async ({ page }, title: string) => {
  await page.getByPlaceholder(/add.*todo|new.*todo/i).fill(title);
  await page.getByRole('button', { name: /add/i }).click();
  const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: title });
  await todoItem.getByRole('checkbox').check();
});

Given('there is a todo {string} that is pending', async ({ page }, title: string) => {
  await page.getByPlaceholder(/add.*todo|new.*todo/i).fill(title);
  await page.getByRole('button', { name: /add/i }).click();
});

When('I add a todo with title {string}', async ({ page }, title: string) => {
  await page.getByPlaceholder(/add.*todo|new.*todo/i).fill(title);
  await page.getByRole('button', { name: /add/i }).click();
});

When('I check the todo {string}', async ({ page }, title: string) => {
  const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: title });
  await todoItem.getByRole('checkbox').check();
});

When('I delete the todo {string}', async ({ page }, title: string) => {
  const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: title });
  await todoItem.getByRole('button', { name: /delete/i }).click();
});

When('I filter todos by {string}', async ({ page }, filter: string) => {
  await page.getByRole('button', { name: new RegExp(filter, 'i') }).click();
});

Then('I should see {string} in the todo list', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

Then('I should not see {string} in the todo list', async ({ page }, title: string) => {
  await expect(page.getByText(title)).not.toBeVisible();
});

Then('the todo {string} should be marked as completed', async ({ page }, title: string) => {
  const todoItem = page.locator('[data-testid="todo-item"]').filter({ hasText: title });
  await expect(todoItem.getByRole('checkbox')).toBeChecked();
});
