# GitHub Copilot Instructions — Todo App Automation

This file provides Copilot with context about the project architecture, conventions, and the required workflow for debugging and writing test scenarios.

---

## Project Overview

This is a **Playwright + TypeScript + playwright-bdd** end-to-end test automation suite for the [Playwright Practice Todo App](https://github.com/vibhorgoyal18/test-todo-app) (a React/Vite SPA).

Tests are written in **Gherkin** (`.feature` files). The `bddgen` CLI transpiles them into Playwright spec files before execution. Reports are generated with **Allure** and published to **GitHub Pages** via the CI/CD pipeline.

---

## Project Architecture

The project follows a **BDD layer pattern** with clear separation between test intent and implementation:

- **Feature files** (`tests/`) define test scenarios in plain Gherkin. These are the source of truth — one feature file per functional area of the app.
- **Step definitions** (`src/steps/`) implement each Gherkin step in TypeScript. Grouped by feature area. All imports come from the fixtures entry point, never directly from `playwright-bdd` or `@playwright/test`.
- **Fixtures** (`src/fixtures/`) is the single entry point that exports `Given`, `When`, `Then`, `Before`, `After`, and the extended `test` object. Any custom fixtures (e.g. page objects) are added here.
- **Utilities** (`src/utils/`) provide shared, reusable helpers — e.g. reading user credentials by key from a CSV, or loading environment config from a properties file.
- **Test data** (`testData/`) is split by environment (`local`, `prod`). Each environment folder contains a users file (credentials keyed by a logical name) and a config file (non-sensitive settings like `base_url`). The active environment is selected via the `ENV` variable.
- **Generated specs** (`.features-gen/`) are auto-produced by `bddgen` at runtime from the feature files. Never edit these directly.
- **`playwright.config.ts`** wires everything together — it reads `baseURL` from the environment config and registers all reporters.

### Core conventions

1. **BDD execution flow**: `.feature` → `bddgen` → `.features-gen/*.spec.js` → `playwright test`. Always run `bddgen` before `playwright test`.
2. **No hardcoded credentials**: Feature files reference users by a logical key (e.g. `"testuser"`). Step definitions resolve the actual username and password from the environment's users file at runtime.
3. **Environment switching**: `ENV=prod` switches all data and config to the prod folder. Defaults to `local`.
4. **Selectors**: Prefer `data-testid` attributes via `page.getByTestId(...)` when available. Fall back to semantic locators (`getByRole`, `getByLabel`, `getByText`) when `data-testid` is absent. Avoid CSS classes, XPath, and positional selectors unless there is no other option.
5. **Reporters**: Three reporters run in parallel — console list, Playwright HTML report, and Allure.

---

## Test Data Conventions

### Adding a new user
Add a row to `testData/local/users.csv` and `testData/prod/users.csv`:
```csv
key,email,name,role,password
newuser,newuser@test.com,New User,admin,NewPass@1234
```

Then reference by key in feature files:
```gherkin
Given I am logged in as "newuser"
```

### Adding a new config property
Add the key to both `testData/local/config.properties` and `testData/prod/config.properties`, then read it in code:
```ts
import { getConfig } from '../utils/configReader';
const config = getConfig();
const myValue = config.my_key;
```

---

## Writing Scenarios

### Feature file rules
- Place new `.feature` files in `tests/`
- Tag each feature with `@tagname` (e.g. `@auth`, `@todos`) for targeted execution
- Use `Background:` for steps shared across all scenarios in a feature
- Reference users by key, never by raw credentials:
  ```gherkin
  # CORRECT
  Given I am logged in as "testuser"

  # WRONG — never do this
  Given I am logged in as "testuser" with password "Test@1234"
  ```

### Step definition rules
- Create one `src/steps/<feature>.steps.ts` file per feature area
- Always import `Given`, `When`, `Then` from `../fixtures/index`
- Always import `getUserByKey` from `../utils/userData` when a step needs user credentials
- Prefer `page.getByTestId(...)` when a `data-testid` exists (see the full list below). Otherwise use semantic locators: `getByRole`, `getByLabel`, `getByText`. Avoid CSS classes, XPath, and positional selectors.
- New step definitions for a new feature must also have a matching `.feature` file

### Available `data-testid` selectors (from the app source)

| Element | `data-testid` |
|---|---|
| Username input (login) | `login-username-input` |
| Password input (login) | `login-password-input` |
| Show/hide password toggle | `toggle-password` |
| Sign In button | `login-submit-btn` |
| Login error message | `login-error-message` |
| Remember me checkbox | `remember-me-checkbox` |
| Logout button | `logout-btn` |
| Header username display | `header-username` |
| Add Todo button | `add-todo-btn` |
| Add Todo dialog | `add-todo-dialog` |
| Todo title input | `todo-title-input` |
| Todo description input | `todo-description-input` |
| Todo status select | `todo-status-select` |
| Todo priority select | `todo-priority-select` |
| Todo due date input | `todo-due-date-input` |
| Todo tags input | `todo-tags-input` |
| Todo save/submit button | `todo-save-btn` |
| Todo cancel button | `todo-cancel-btn` |
| Todo item (dynamic) | `todo-item-{id}` (e.g. `todo-item-t1`) |
| Todo checkbox (dynamic) | `todo-checkbox-{id}` |
| Todo edit button (dynamic) | `todo-edit-{id}` |
| Todo delete button (dynamic) | `todo-delete-{id}` |
| Todo drag handle (dynamic) | `todo-drag-handle-{id}` |
| Search input | `search-input` |
| Status filter | `status-filter` |
| Priority filter | `priority-filter` |
| Sort select | `sort-select` |
| Clear filters button | `clear-filters-btn` |
| Empty state | `empty-state` |
| Quick Add button (dashboard) | `quick-add-btn` |
| Command palette | `command-palette` |
| Command palette input | `command-palette-input` |
| Profile name input | `profile-name-input` |
| Profile email input | `profile-email-input` |
| Save Profile button | `profile-save-btn` |
| Current password input | `old-password-input` |
| New password input | `new-password-input` |
| Confirm password input | `confirm-password-input` |
| Change Password button | `change-password-btn` |
| Password error message | `password-error-msg` |
| Password success message | `password-success-msg` |
| Filters bar | `filters-bar` |

---

## Running Tests

```bash
# All tests (runs bddgen first automatically)
npm test

# Headed mode
npm run test:headed

# Playwright UI mode (interactive, great for debugging)
npm run test:ui

# Debug mode (pause on failure)
npm run test:debug

# Specific tag
npx bddgen && npx playwright test --grep @auth

# Specific browser
npx bddgen && npx playwright test --project=chromium

# Specific environment
ENV=prod npm test
```

> `bddgen` **must always run before** `playwright test` — the `npm test` script handles this automatically. When running `npx playwright test` directly, always prepend `npx bddgen &&`.

---

## Writing New Test Scenarios (Required Workflow)

When asked to write a test for a specific scenario, follow this exact sequence every time:

### Step 1 — Navigate the app first with playwright-mcp

Before writing a single line of Gherkin, use playwright-mcp to explore the relevant part of the app:

1. Navigate to the page or feature under test
2. Take a snapshot (`mcp_playwright_browser_snapshot`) to inspect the accessibility tree, visible labels, and `data-testid` values
3. Interact with the relevant UI elements to observe the actual flow and expected outcomes
4. Confirm which `data-testid` selectors exist on the elements involved

This ensures the scenario accurately reflects what the app actually does, not what is assumed.

### Step 2 — Write the feature file only

After exploring the app:

- Write the `.feature` file in `tests/` with the Gherkin scenario
- **Do NOT touch any `.ts` step definition files at this stage**
- Use Gherkin steps that map to **existing step definitions** wherever possible. Check `src/steps/` before inventing new steps.

### Step 3 — Reuse existing steps; never create new ones without permission

- Scan all existing step files under `src/steps/` for matching patterns before writing anything new
- If an existing step covers the intent (even partially), use it — do not duplicate
- If a **new** step definition is truly unavoidable, **stop and ask for explicit permission** before creating it. Describe what new step is needed and why no existing step can be reused.

### Step 4 — Implement step definitions only when explicitly instructed

- After delivering the feature file, wait for the user to say "implement the steps" (or equivalent)
- Only then add new step definitions to the appropriate `src/steps/<area>.steps.ts` file
- Do not pre-emptively create or modify any TypeScript implementation

### Summary

| Stage | Action | Who decides |
|---|---|---|
| Explore app | playwright-mcp navigation + snapshot | Copilot (mandatory) |
| Write scenario | `.feature` file only | Copilot |
| Reuse steps | Scan existing steps first | Copilot (mandatory) |
| New step needed | Ask permission, describe what and why | User approves |
| Implement steps | Write TypeScript step definitions | Only when user says so |

---

## Debugging & Investigating Failures

### REQUIRED: Use playwright-mcp to investigate failures

**Whenever a test scenario fails or a step needs to be written or validated, you MUST use the playwright-mcp browser tools to navigate the live application and verify the actual behaviour before modifying any code.**

This is the mandatory workflow when debugging:

1. **Navigate to the app** using `mcp_playwright_browser_navigate`
   ```
   URL: http://localhost:5175/test-todo-app (local dev)
   ```

2. **Log in** if needed — use credentials from `testData/local/users.csv`:
   - `testuser` / `Test@1234` (admin)
   - `viewer` / `View@5678` (viewer)

3. **Take a snapshot** with `mcp_playwright_browser_snapshot` to inspect the accessibility tree and find exact element refs, roles, labels, and `data-testid` values

4. **Interact with the element** using the appropriate tool:
   - `mcp_playwright_browser_click` — click a button or link
   - `mcp_playwright_browser_type` — fill an input (uses the `ref` from snapshot)
   - `mcp_playwright_browser_select_option` — change a dropdown
   - `mcp_playwright_browser_handle_dialog` — accept/dismiss browser confirm dialogs
   - `mcp_playwright_browser_take_screenshot` — capture the visual state

5. **Confirm the selector** — check the `Ran Playwright code` block in tool output to see what selector Playwright resolved (e.g. `page.getByTestId('login-submit-btn')`). Use that exact pattern in the step definition.

6. **Only after confirming the correct behaviour and selector via playwright-mcp**, write or update the step definition.

### Example debugging workflow

If the scenario `Then the todo "Set up CI pipeline" should be marked as done` fails:

```
1. mcp_playwright_browser_navigate → http://localhost:5175/test-todo-app
2. Log in as testuser via mcp_playwright_browser_type + mcp_playwright_browser_click
3. mcp_playwright_browser_click → Todos nav link
4. mcp_playwright_browser_snapshot → inspect the todo item structure and checkbox testid
5. mcp_playwright_browser_click → the checkbox ref
6. mcp_playwright_browser_snapshot → confirm the checked state
7. Update the step definition with the confirmed selector
```

### Other debugging tools

```bash
# Playwright UI mode — time-travel debugger, inspect each step visually
npm run test:ui

# Debug mode — pauses on first failure, opens DevTools
npm run test:debug

# Trace viewer — open a recorded trace from test-results/
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Traces, screenshots, and videos are captured automatically on failure (configured in `playwright.config.ts`).

---

## Allure Reports

```bash
# Generate
npx allure generate allure-results --clean -o allure-report

# Open
npx allure open allure-report

# Generate + open in one step
npx allure serve allure-results
```

The CI pipeline auto-generates and publishes the report with full history to:
`https://vibhorgoyal18.github.io/todo-app-automation/allure-report/`

---

## CI/CD Pipeline Summary

The workflow (`.github/workflows/playwright.yml`) triggers on push/PR to `main` and `workflow_dispatch`:

1. Checks out this repo + builds `vibhorgoyal18/test-todo-app` and serves it on port 5175
2. Pulls Allure history from the `gh-pages` branch to preserve trend charts
3. Runs `bddgen` → runs Playwright tests on Chromium
4. Generates the Allure report (history included) → deploys to `gh-pages`
5. Uploads `allure-report` and `playwright-report` as GitHub Actions artifacts (30-day retention)

> Enable GitHub Pages in **Settings → Pages → Source: `gh-pages` branch** to activate the report URL.
