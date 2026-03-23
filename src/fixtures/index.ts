import { test as base, createBdd } from 'playwright-bdd';

// Extend base test with custom fixtures here
export const test = base.extend<{
  // Add custom fixture types here
  // e.g. todoPage: TodoPage;
}>({
  // Define custom fixtures here
  // e.g. todoPage: async ({ page }, use) => {
  //   await use(new TodoPage(page));
  // },
});

export const { Given, When, Then, Before, After, BeforeAll, AfterAll } = createBdd(test);
