import { test as base, createBdd } from 'playwright-bdd';
import { ScenarioContext, createScenarioContext } from './world';

export const test = base.extend<{ scenarioContext: ScenarioContext }>({
  /**
   * scenarioContext is a per-scenario state bag — playwright-bdd's equivalent
   * of Cucumber's World object.
   *
   * Playwright calls this factory once per test (scenario), passes the
   * instance to every step/hook that requests it via destructuring, then
   * discards it when the scenario ends. No state leaks between scenarios.
   */
  scenarioContext: async ({}, use) => {
    await use(createScenarioContext());
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
