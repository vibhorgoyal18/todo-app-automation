import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/index';

Given('I navigate to the Todos page', async ({ page }) => {
  await page.getByRole('link', { name: 'Todos' }).click();
  await expect(page).toHaveURL(/#\/todos/);
});

When('I click the Add Todo button', async ({ page }) => {
  await page.getByTestId('add-todo-btn').click();
  await expect(page.getByTestId('add-todo-dialog')).toBeVisible();
});

When('I fill in the todo title {string}', async ({ page }, title: string) => {
  await page.getByTestId('todo-title-input').fill(title);
});

When('I fill in the description {string}', async ({ page }, description: string) => {
  await page.getByTestId('todo-description-input').fill(description);
});

When('I select status {string}', async ({ page }, status: string) => {
  await page.getByTestId('todo-status-select').selectOption(status);
});

When('I select priority {string}', async ({ page }, priority: string) => {
  await page.getByTestId('todo-priority-select').selectOption(priority);
});

When('I fill in the tags {string}', async ({ page }, tags: string) => {
  await page.getByTestId('todo-tags-input').fill(tags);
});

When('I submit the todo form', async ({ page }) => {
  await page.getByTestId('todo-save-btn').click();
});

When('I cancel the todo form', async ({ page }) => {
  await page.getByTestId('todo-cancel-btn').click();
});

When('I click edit on the todo {string}', async ({ page }, title: string) => {
  const todoItem = page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title });
  const todoId = await todoItem.getAttribute('data-testid').then(id => id?.replace('todo-item-', ''));
  await page.getByTestId(`todo-edit-${todoId}`).click();
});

When('I update the todo title to {string}', async ({ page }, title: string) => {
  await page.getByTestId('todo-title-input').clear();
  await page.getByTestId('todo-title-input').fill(title);
});

When('I save the todo changes', async ({ page }) => {
  await page.getByTestId('todo-save-btn').click();
});

When('I click delete on the todo {string}', async ({ page }, title: string) => {
  const todoItem = page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title });
  const todoId = await todoItem.getAttribute('data-testid').then(id => id?.replace('todo-item-', ''));
  await page.getByTestId(`todo-delete-${todoId}`).click();
});

When('I confirm the delete dialog', async ({ page }) => {
  page.once('dialog', dialog => dialog.accept());
});

When('I check the checkbox for todo {string}', async ({ page }, title: string) => {
  const todoItem = page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title });
  const todoId = await todoItem.getAttribute('data-testid').then(id => id?.replace('todo-item-', ''));
  await page.getByTestId(`todo-checkbox-${todoId}`).click();
});

When('I filter todos by status {string}', async ({ page }, status: string) => {
  await page.getByTestId('status-filter').selectOption(status);
});

When('I filter todos by priority {string}', async ({ page }, priority: string) => {
  await page.getByTestId('priority-filter').selectOption(priority);
});

When('I search for {string}', async ({ page }, query: string) => {
  await page.getByTestId('search-input').fill(query);
});

Then('I should see a todo item {string} in the list', async ({ page }, title: string) => {
  await expect(page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title })).toBeVisible();
});

Then('I should not see {string} in the todo list', async ({ page }, title: string) => {
  await expect(page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title })).not.toBeVisible();
});

Then('the todo {string} should be marked as done', async ({ page }, title: string) => {
  const todoItem = page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title });
  const todoId = await todoItem.getAttribute('data-testid').then(id => id?.replace('todo-item-', ''));
  await expect(page.getByTestId(`todo-checkbox-${todoId}`)).toBeChecked();
});
