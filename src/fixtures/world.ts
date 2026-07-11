import { Page } from '@playwright/test';

/**
 * ScenarioContext — per-scenario state container.
 *
 * In Cucumber, a "World" is a fresh object created for every scenario that
 * steps can read/write freely. playwright-bdd achieves the same thing through
 * Playwright's fixture system: because fixtures are scoped to the test worker
 * and torn down between tests, ScenarioContext is always isolated.
 *
 * HOW STATE FLOWS BETWEEN STEPS
 * ──────────────────────────────
 * Each step receives the same fixture instance via destructuring:
 *
 *   When('I capture the todo ID for {string}', async ({ scenarioContext, page }, title) => {
 *     const item = page.locator(`[data-testid^="todo-item-"]`).filter({ hasText: title });
 *     scenarioContext.lastCreatedTodoId = await item
 *       .getAttribute('data-testid')
 *       .then(id => id?.replace('todo-item-', '') ?? null);
 *   });
 *
 *   Then('the captured todo checkbox should be checked', async ({ scenarioContext, page }) => {
 *     await expect(
 *       page.getByTestId(`todo-checkbox-${scenarioContext.lastCreatedTodoId}`)
 *     ).toBeChecked();
 *   });
 *
 * WHY NOT MODULE-LEVEL VARIABLES?
 * ────────────────────────────────
 * A `let x = null` at the top of a step file is a module singleton. When
 * Playwright runs tests in parallel (multiple workers), each worker loads the
 * same module, meaning every concurrent scenario inside that worker overwrites
 * the same variable. This causes race conditions and flaky tests.
 * ScenarioContext is instantiated fresh for every scenario by the fixture
 * factory, so it is never shared across scenarios.
 */
export interface ScenarioContext {
  /** Holds the Page object for a new browser tab opened during a scenario. */
  newTabPage: Page | null;

  /**
   * Holds the data-testid suffix (UUID) of the most recently created/targeted
   * todo item so that subsequent steps can reference it without re-querying.
   */
  lastCreatedTodoId: string | null;
}

/** Returns a clean ScenarioContext for each new scenario. */
export function createScenarioContext(): ScenarioContext {
  return {
    newTabPage: null,
    lastCreatedTodoId: null,
  };
}
