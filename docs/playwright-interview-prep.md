# Playwright Interview Preparation Guide

---

## Part 1: Core Concepts & Locators

---

### 1. What is Playwright and why do we use it?

Playwright is an open-source, end-to-end testing framework by Microsoft for automating **Chromium**, **Firefox**, and **WebKit** browsers.

**Key capabilities:**
- **Bidirectional WebSocket communication** — faster than HTTP-based protocols
- **Auto-waiting mechanisms** — built-in state checks before every interaction
- **Trace viewer** — visual debugging with screenshots, network logs, and DOM snapshots
- **Native API testing** — HTTP request assertions without a browser
- **Network interception** — mock, abort, or modify requests/responses

---

### 2. What are the different browsers supported?

| Browser Engine | Covers |
|---|---|
| **Chromium** | Chrome, Edge, Opera, Brave |
| **Firefox** | Custom Mozilla binary |
| **WebKit** | Safari |

---

### 3. How do you install Playwright with TypeScript?

**Prerequisites:** Node.js installed.

```bash
# Scaffold a new project
npm init playwright@latest

# Install as dev dependency in an existing project
npm install -D @playwright/test

# Download browser binaries
npx playwright install
```

---

### 4. What is the difference between Playwright and Selenium?

| Aspect | Playwright | Selenium |
|---|---|---|
| **Protocol** | Bidirectional WebSocket (CDP) | HTTP/REST (W3C WebDriver) |
| **Speed** | Faster — persistent connection | Slower — per-command HTTP round trips |
| **Waiting** | Auto-waits before every action | Requires manual implicit/explicit waits |
| **API Testing** | Natively supported | Not supported |
| **Network Interception** | Built-in, straightforward | Requires third-party proxies |

---

### 5. What programming languages does Playwright support?

- TypeScript
- JavaScript
- Python
- Java
- .NET / C#

---

### 6. Why use TypeScript with Playwright?

- Playwright's core engine is **written in TypeScript** — first-class support for all new features
- **Compile-time error checking** catches bugs before runtime
- **Type safety** prevents passing wrong argument types to Playwright APIs
- **Self-documenting code** — return types and parameter types serve as inline documentation
- **Superior IntelliSense** — better autocomplete and API discovery in VS Code

---

### 7. How do you configure TypeScript for Playwright?

Via `tsconfig.json` in the project root:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

---

### 8. How do you define types for Page Object classes?

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

**Key principles:**
- Import `Page` and `Locator` types from `@playwright/test`
- Declare locators as `private readonly` to enforce encapsulation
- Initialize locators in the `constructor`
- Expose interactions through `public` methods only

---

### 9. What are the different locator strategies in Playwright?

---

#### `getByRole`
Targets elements by their ARIA role.
```html
<button>Submit</button>
<a href="/home">Home</a>
<input type="checkbox" />
<h1>Page Title</h1>
```
```typescript
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })
page.getByRole('checkbox')
page.getByRole('heading', { name: 'Page Title' })
```

---

#### `getByLabel`
Targets form inputs associated with a `<label>`.
```html
<label for="email">Email address</label>
<input id="email" type="text" />

<!-- or wrapped label -->
<label>Password <input type="password" /></label>
```
```typescript
page.getByLabel('Email address')
page.getByLabel('Password')
```

---

#### `getByPlaceholder`
Targets inputs by their `placeholder` attribute.
```html
<input type="text" placeholder="Search todos..." />
<input type="email" placeholder="Enter your email" />
```
```typescript
page.getByPlaceholder('Search todos...')
page.getByPlaceholder('Enter your email')
```

---

#### `getByAltText`
Targets images by their `alt` attribute.
```html
<img src="/logo.png" alt="Company logo" />
<img src="/avatar.jpg" alt="User avatar" />
```
```typescript
page.getByAltText('Company logo')
page.getByAltText('User avatar')
```

---

#### `getByTestId`
Targets elements by their `data-testid` attribute (configurable in `playwright.config.ts`).
```html
<button data-testid="submit-btn">Submit</button>
<div data-testid="stat-total">42</div>
```
```typescript
page.getByTestId('submit-btn')
page.getByTestId('stat-total')
```

---

#### `getByText`
Targets elements by their visible text content.
```html
<p>Welcome back, John!</p>
<span>In Progress</span>
<button>Sign In</button>
```
```typescript
page.getByText('Welcome back, John!')
page.getByText('In Progress')
page.getByText('Sign In', { exact: true })  // exact match
```

---

#### CSS Selector
Targets elements using standard CSS syntax.
```html
<div class="card active">...</div>
<input id="username" />
<ul class="todo-list">
  <li class="todo-item">...</li>
</ul>
```
```typescript
page.locator('.card.active')
page.locator('#username')
page.locator('ul.todo-list > li.todo-item')
```

---

#### XPath
Targets elements using XPath expressions.
```html
<div class="stats">
  <p>Total Todos</p>
  <p>42</p>
</div>
```
```typescript
page.locator('//div[@class="stats"]/p[1]')
page.locator('//button[@type="submit"]')
page.locator('//p[text()="Total Todos"]')
```

---

### 10. What is the recommended locator strategy?

**`getByRole` is the primary recommendation.**

- Aligns with **semantic accessibility standards** (ARIA roles)
- Most resilient against brittle DOM structural changes
- Tests what users actually perceive, not implementation details

**Order of preference:**
1. `getByRole` — semantic, accessibility-aligned
2. `getByLabel` — form fields with associated labels
3. `getByTestId` — when `data-testid` attributes exist
4. `getByText` / `getByPlaceholder` — for visible text
5. CSS / XPath — last resort only

---

### 11. How do you interact with elements?

```typescript
await page.getByRole('button').click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Name').type('John');
await page.getByRole('combobox').selectOption('option-value');
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();
await page.getByRole('button').dblclick();
await page.getByRole('menuitem').hover();
```

---

### 12. What is the difference between `fill` and `type`?

| Method | Behaviour | Use Case |
|---|---|---|
| `.fill()` | Clears the field first, then sets the entire value **instantly** | Standard form inputs |
| `.type()` | Inputs text **character-by-character** to simulate real keyboard input | Fields with key event listeners (e.g., autocomplete, OTP inputs) |

```typescript
await page.getByLabel('Search').fill('playwright');   // instant, clears first
await page.getByLabel('OTP').type('123456');           // fires keydown/keyup per char
```

---

### 13. How does Playwright auto-waiting work?

Before executing any action, Playwright checks **4 sequential element states**:

```
1. Attached    → Element exists in the DOM
2. Visible     → Element is not hidden (no display:none / visibility:hidden)
3. Enabled     → Element is not disabled
4. Stable      → Element is not animating or moving
```

This eliminates the need for manual `waitForSelector` calls in most scenarios. If any state check fails within the timeout, the action throws a `TimeoutError`.

---

## Part 2: Advanced Timeouts & Waits

---

### 14. How do you set default timeouts and what labels are available?

Configured globally in `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,           // Global test timeout
  expect: {
    timeout: 5_000,          // Assertion (expect) timeout
  },
  use: {
    navigationTimeout: 30_000,  // page.goto() and navigation
    actionTimeout: 0,           // Individual actions (0 = uses global)
  },
});
```

| Label | Default | Applies To |
|---|---|---|
| `timeout` | 30,000ms | Entire test execution |
| `expect.timeout` | 5,000ms | Each `expect()` assertion |
| `navigationTimeout` | 0ms | `page.goto()`, `page.reload()` |
| `actionTimeout` | 0ms | `.click()`, `.fill()`, etc. |

---

### 15. How do you handle explicit/custom waits?

**Discouraged:**
```typescript
await page.waitForSelector('.my-element'); // ❌ avoid
```

**Recommended approaches:**
```typescript
// Wait for a specific element state
await page.locator('.my-element').waitFor({ state: 'visible', timeout: 5000 });

// Override timeout on the action itself
await page.getByRole('button').click({ timeout: 5000 });

// Wait for navigation
await page.waitForURL(/dashboard/);

// Wait for a response
await page.waitForResponse(resp => resp.url().includes('/api/data'));
```

---

### 16. What does "Wait for network to be idle" mean?

```typescript
await page.waitForLoadState('networkidle');
```

Pauses execution until **zero active network connections** are detected for a minimum of **500ms**.

> ⚠️ **Widely discouraged** for standard tests — modern SPAs with background polling, analytics, or WebSocket connections may never truly reach `networkidle`, causing intermittent failures. Prefer `waitForURL`, `waitForResponse`, or locator-based waits instead.

---

### 17. What is the default value of the action timeout?

**`0` milliseconds** — meaning no dedicated action timeout is enforced. Actions fall back to the global `timeout` (30,000ms) as the upper boundary.

---

### 18. What is the default navigation timeout?

**`0` milliseconds** — navigation also defers to the global `timeout`.

---

### 19. What is the default global test timeout?

**`30,000 milliseconds` (30 seconds)**. This is the absolute ceiling — no individual step, wait, or custom timeout can exceed it without the entire test failing.

---

### 20. What is the default expect (assertion) timeout?

**`5,000 milliseconds` (5 seconds)**. Playwright retries the assertion repeatedly during this window before failing.

---

### 21. Which timeout wins when a custom assertion timeout overlaps with the global expect timeout?

The **custom override** at the action/assertion level **always takes precedence** over the global configuration for that single step:

```typescript
// Uses global expect timeout (5,000ms)
await expect(page.getByText('Success')).toBeVisible();

// Custom override — uses 10,000ms for this assertion only
await expect(page.getByText('Success')).toBeVisible({ timeout: 10_000 });
```

The global `expect.timeout` in `playwright.config.ts` sets the default; individual overrides replace it for that specific call only.

---
