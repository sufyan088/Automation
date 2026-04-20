# AIQ To Playwright Conversion Framework

This repository now contains a repeatable conversion framework that can be reused by multiple team members across modules and projects.

## Goal

Convert AIQ module scripts into Playwright tests with:

- module-based test folders
- readable English business steps
- shared helpers and selectors
- fallback locator support
- reusable reporting workflow
- portable client-shareable Allure output

## Standard Structure

For each converted module, use this structure:

```text
tests/
  <ModuleName>/
    _shared.js
    TC_XX_<business_name>.spec.js

helpers/
  <module>.js

selectors/
  <module>.selectors.js
```

## Conversion Rules

### 0. Respect existing project architecture

Many target projects already have their own helper functions.

Do not assume the framework should replace them wholesale.

Use this rule:

1. preserve working project-specific helpers
2. merge in framework-level reusable mechanisms
3. standardize structure and patterns even when file names differ

Framework-level reusable mechanisms usually include:

1. fallback locator strategy
2. safe action wrappers
3. runtime data-loader pattern
4. module `_shared.js` pattern
5. reporting and portable Allure flow
6. `helpers/allureHierarchy.js` for Allure suite grouping by module folder

Project-specific helpers usually stay local to the target repo.

### 1. Keep one folder per module

Each module gets its own folder under `tests/`.

Examples:

- `tests/DigitEYESCamps_ManageCampsCluster`
- `tests/DigitEYESDataLoader_SFDataLoaderQueue`

### 2. Add one `_shared.js` per module

Use `_shared.js` to expose:

- runtime data loader
- login helper
- module navigation helpers
- reusable module actions
- safe cleanup helper

This keeps individual specs short and consistent.

### 3. Preserve business readability

Every converted test should follow business-readable `test.step()` blocks.

Recommended step pattern:

```js
await test.step('Login into Application', async () => {
  // flow
});
```

### 4. Centralize selectors

Put selectors in `selectors/<module>.selectors.js`.

Do not scatter raw selectors inside test files unless they are truly one-off.

### 5. Move repeated UI actions into helpers

Put repeated page actions into `helpers/<module>.js`.

Examples:

- module navigation
- create/edit flows
- search helpers
- update/confirmation helpers

### 6. Use fallback locator strategy

Prefer candidate locator arrays and `helpers/fallback.js` rather than relying on a single fragile selector.

This is the Playwright equivalent of AIQ fallback accessors.

### 7. Fix shared problems at the root

When runtime failures appear:

- fix `helpers/` or `selectors/` first
- do not patch multiple individual specs with the same workaround

### 8. Use runtime data and unique entities

Keep environment data in `helpers/dataLoader.js`.

For tests that create data, generate unique entity names to reduce collisions across reruns and future parallel execution.

### 9. Use no-op teardown for shared accounts

When multiple workers share a single application account:

- `closeSession(page)` must be a no-op in every `_shared.js`.
- Real UI logout during teardown invalidates sibling workers' active sessions.
- Fix auth-state issues in `helpers/auth.js`; do not compensate by reducing workers.

### 10. Use AIQ-semantic assertions

When an AIQ script verifies that a column *contains* a matching value (not that every row equals it), use a minimum-occurrence assertion instead of a full-column equality check.

- `expectColumnValueOccurrenceAtLeast` is the reference implementation in `helpers/digiteyesdataloaderCommon.js`.
- Over-constraining with equality on filtered columns causes false failures when live data contains mixed rows.

### 11. Register allureHierarchy in every _shared.js

Add this to every module `_shared.js` `beforeEach`:

```js
import { stampAllureHierarchy } from '../../helpers/allureHierarchy.js';
test.beforeEach(async ({ page }, testInfo) => {
  stampAllureHierarchy(testInfo);
  // ...
});
```

This ensures module-folder grouping appears correctly in the Allure Suites card during whole-project runs.

## Module Conversion Workflow

### Step 1. Read the AIQ module

Identify:

- module entry/navigation
- repeated includes
- common utility scripts
- repeated locators
- stateful flows
- create/update/delete operations

### Step 2. Create module scaffolding

Create:

- `tests/<ModuleName>/`
- `tests/<ModuleName>/_shared.js`
- module helper file if needed
- module selector file if needed

### Step 3. Convert one representative test first

Start with:

- one smoke test
- one read-only test if available
- one state-changing flow if the module is stateful

Validate the pattern before converting the rest.

### Step 4. Convert the full module

Map one AIQ script to one Playwright spec where practical.

Keep naming aligned with the source script/test ID.

### Step 5. Validate incrementally

Do not wait for a full-module run before stabilizing.

Suggested order:

- smoke subset
- next grouped batch
- full module

### Step 6. Generate report artifacts

Use Allure for:

- module-specific report
- combined report when needed
- portable single-file report for client sharing

## Reporting Rules

### Standard multi-file Allure report

Use this for local browsing through a server.

It is not suitable for direct `file:///` sharing.

### Portable single-file Allure report

Use this for client sharing.

This project already supports Mammoth-branded portable output through:

- `scripts/customize-allure-report.js`

### Suite normalization before full-project report generation

If existing `allure-results` carry Playwright's default `chromium` parentSuite label, the Suites card in the combined report collapses to a single entry.

Fix before generating the portable report:

```bash
node scripts/normalize-allure-suites.js
```

This rewrites all `*-result.json` files in `allure-results/` to stamp `parentSuite`, `suite`, and the Allure `titlePath` label from the spec title path, restoring module-folder grouping and preventing a stray `chromium` Suites grouping.

### Flatten generic wrapper steps for legacy Camp Server specs

Some legacy Camp Server specs still emit a generic top-level wrapper step such as `Run converted flow` even when the real behavior is helper-backed underneath.

Fix before generating the client report when those results are present:

```bash
node scripts/flatten-generic-allure-steps.js
```

This unwraps the generic parent step in `allure-results/*-result.json` so the Allure Execution panel shows the nested business-readable steps directly.

### Client-facing report content rules

- Use packaged client-report scripts when possible.
- Keep client-facing Allure descriptions to `Scenario:` and `Spec File:` only.
- Strip any stale `Source AIQ:` lines from result descriptions before report generation.
- For Cluster, prioritize helper-layer readable nested steps.
- For Camp Server, use result flattening as a report-time compatibility layer until all legacy wrapper steps are removed from specs.

### Client share workflow

Preferred command:

```bash
npm run report:combined:client
```

This produces:

- `allure-report-combined-shareable/index.html`
- `allure-report-combined-shareable.zip`

## Parallel Execution Guidance

Parallel execution can improve runtime, but only after stability is proven.

Current rule:

- validate with smaller worker counts first
- fix shared auth/session issues before increasing workers broadly
- treat create/update stateful modules as higher-risk for parallel runs

## Team Usage

For team members starting a new module:

1. Run the scaffold command.
2. Add module helper and selector files.
3. Convert one smoke test first.
4. Reuse the same `_shared.js` and `test.step()` pattern.
5. Stabilize through helpers/selectors, not spec-by-spec patches.

## Repository-Specific Handoff

For the current Vision Spring repository, use the dedicated handoff docs by track:

- `docs/vision-spring-camp-cluster-handoff.md` for the main `DigitEYESCamp_Cluster` track and its module-by-module mapping, inventory, and reusable rules.
- `docs/vision-spring-camp-server-handoff.md` for the main `DigitEYESCamp_Server` track and its module-by-module mapping, inventory, and reusable rules.
- `docs/vision-spring-conversion-handoff.md` for older general cross-family lessons, validated shared fixes, and durable conversion guidance that still applies beyond one track.

## Scaffold Command

Use:

```bash
npm run scaffold:module -- <ModuleName>
```

Example:

```bash
npm run scaffold:module -- PaymentTracking
```

This creates starter files under `tests/<ModuleName>/`.