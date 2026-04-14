# Team Project Setup Guide

This guide explains exactly what your team members should copy into a new Playwright conversion project, where to place source inputs, and which commands to run first.

Use this when you want another team member to follow the same conversion mechanism used in this project.

## Purpose

The goal is to standardize AIQ-to-Playwright conversion work so every team member uses the same:

- folder structure
- helper pattern
- selector pattern
- fallback locator mechanism
- report generation flow
- client-shareable Allure output

## What You Receive From Upstream

For each new conversion project, the expected intake is:

1. Test Script folder
Contains module folders and each module contains AIQ source scripts.

2. Utility folder/files
Contains reusable AIQ utilities used by the test scripts.

3. DPL file
Contains runtime data used by test scripts or utility functions.

## What Team Members Should Copy Into Their New Project

Copy these framework files/folders from this project into the new project.

## Required Core Files

1. [playwright.config.js](playwright.config.js)
2. [package.json](package.json)

These provide:

- Playwright config
- scripts
- Allure dependencies
- scaffold command
- client report command

## Required Shared Helper Files

Copy the full `helpers` pattern, at minimum:

1. [helpers/actions.js](helpers/actions.js)
2. [helpers/auth.js](helpers/auth.js)
3. [helpers/dataLoader.js](helpers/dataLoader.js)
4. [helpers/fallback.js](helpers/fallback.js)
5. [helpers/allureHierarchy.js](helpers/allureHierarchy.js)

These are the reusable base pieces that future modules depend on.

`helpers/allureHierarchy.js` stamps Allure `parentSuite` and `suite` from the top-level module folder name so whole-project runs group results by module in the Allure Suites card. Register it in every `_shared.js` via `test.beforeEach`.

## If The Target Project Already Has Its Own Helpers

Do not blindly overwrite an existing project's helper layer.

Use this merge rule:

1. Keep the target project's domain-specific helpers if they already work.
2. Bring in only the framework-level reusable pieces that are cross-project safe.
3. Merge shared capabilities instead of replacing project behavior.

Cross-project safe helpers are usually:

1. [helpers/actions.js](helpers/actions.js)
2. [helpers/fallback.js](helpers/fallback.js)
3. parts of [helpers/auth.js](helpers/auth.js) if the login flow is similar
4. patterns from [helpers/dataLoader.js](helpers/dataLoader.js)

Project-specific helpers are usually:

1. business-module navigation
2. module-specific create/update/delete flows
3. project-specific authentication behavior
4. environment-specific page actions

Recommended rule for teams:

1. Treat this starter kit as the framework core.
2. Treat the target repo's existing helpers as project-specific extensions.
3. Reuse the framework style, not necessarily every helper file verbatim.

If there is a conflict, keep the target project's helper function names and merge in:

1. fallback locator handling
2. safe action wrappers
3. reporting workflow
4. module scaffold pattern

## Optional Module Helper Examples To Reuse As Patterns

Use these as working references for how to structure module helpers:

1. [helpers/digiteyescampsManagecampscluster.js](helpers/digiteyescampsManagecampscluster.js)
2. [helpers/digiteyesdataloaderCommon.js](helpers/digiteyesdataloaderCommon.js)
3. [helpers/digiteyesreportingCommon.js](helpers/digiteyesreportingCommon.js)
4. [helpers/digiteyessettingsCommon.js](helpers/digiteyessettingsCommon.js)

## Required Selector Pattern Files

At minimum, copy the shared selector style and create new module selector files as needed.

Useful references:

1. [selectors/common.selectors.js](selectors/common.selectors.js)
2. [selectors/digiteyescampsManagecampscluster.selectors.js](selectors/digiteyescampsManagecampscluster.selectors.js)
3. [selectors/digiteyesdataloaderSfdataloaderqueue.selectors.js](selectors/digiteyesdataloaderSfdataloaderqueue.selectors.js)
4. [selectors/digiteyesreportingCamptrends.selectors.js](selectors/digiteyesreportingCamptrends.selectors.js)
5. [selectors/digiteyessettingsCountrysettings.selectors.js](selectors/digiteyessettingsCountrysettings.selectors.js)

## Required Scripts Folder

Copy the entire `scripts` folder, especially:

1. [scripts/customize-allure-report.js](scripts/customize-allure-report.js)
2. [scripts/scaffold-module.js](scripts/scaffold-module.js)
3. [scripts/run-combined-client-report.js](scripts/run-combined-client-report.js)
4. [scripts/bootstrap-aiq-structure.js](scripts/bootstrap-aiq-structure.js)
5. [scripts/normalize-allure-suites.js](scripts/normalize-allure-suites.js)

These cover:

- portable Allure Mammoth branding
- module scaffolding
- client-shareable report generation and zip packaging
- bulk scaffold generation from source AIQ folder structure
- retroactive Allure suite-label normalization for full-project combined reports

## Required Branding Assets

Copy the `assets` folder so the Mammoth report branding works.

Required assets:

1. [assets/Mammoth-AI Logo.png](assets/Mammoth-AI Logo.png)
2. [assets/mammoh-ai-mark.svg](assets/mammoh-ai-mark.svg)

## Recommended Documentation Files To Copy

1. [docs/conversion-framework.md](docs/conversion-framework.md)
2. [docs/team-project-setup-guide.md](docs/team-project-setup-guide.md)

These make the framework reusable for the rest of the team.

## Recommended Initial Project Structure

After copying the framework, the new project should look like this:

```text
project-root/
  package.json
  playwright.config.js
  helpers/
  selectors/
  scripts/
  assets/
  docs/
  tests/
  source-aiq/
  data/
```

## Where Team Members Should Paste Incoming Project Inputs

### Test Script folder

Paste under:

```text
source-aiq/
```

Recommended example:

```text
source-aiq/
  Test Scripts/
    <ModuleA>/
    <ModuleB>/
```

### Utility folder/files

Paste under:

```text
source-aiq/
```

Recommended example:

```text
source-aiq/
  Utility Functions/
```

### DPL file

Paste under:

```text
data/
```

Example:

```text
data/IM_DPL1.csv
```

## First Commands Team Members Must Run

After copying the framework files into the new repo, run these commands first:

```bash
npm install
npx playwright install
```

This ensures:

- Node dependencies are installed
- Playwright browsers are installed

If the target project already has its own package setup, first compare:

1. `package.json`
2. `playwright.config.js`
3. helper folder layout

Then merge only the missing framework pieces instead of replacing the project's working setup.

## First Conversion Command To Run

To start a new module conversion, run:

```bash
npm run scaffold:module -- <ModuleName>
```

Example:

```bash
npm run scaffold:module -- PaymentTracking
```

This creates:

- `tests/<ModuleName>/_shared.js`
- `tests/<ModuleName>/TS_01_<ModuleName>_smoke.spec.js`

## What Team Members Do After Scaffolding

### Step 1. Review AIQ module scripts

Read the module inside `source-aiq` and identify:

- entry/navigation flow
- utility includes
- repeated locators
- data usage
- stateful create/update/delete actions

### Step 2. Extend helpers and selectors

Create module-specific files such as:

- `helpers/<module>.js`
- `selectors/<module>.selectors.js`

### Step 3. Update runtime data loader

Add project/module-specific runtime fields into:

1. [helpers/dataLoader.js](helpers/dataLoader.js)

### Step 4. Convert one smoke test first

Do not convert the entire module blindly.

First convert:

- one smoke test
- one read-only path if available
- one state-changing path if required

### Step 5. Validate incrementally

Run the smoke subset first, then expand.

### Step 6. Fix shared failures at the root

When the current UI differs from AIQ assumptions:

- fix shared helper logic
- fix selector definitions
- avoid patching one-off failures inside many specs

## Standard Spec Pattern

Each spec should keep English business readability.

Example shape:

```js
await test.step('Login into Application', async () => {
  await loginAsAdmin(page, data);
});
```

## Module Validation Commands

Run a module:

```bash
npx playwright test tests/<ModuleName>
```

Run one spec:

```bash
npx playwright test tests/<ModuleName>/<SpecFile>.spec.js
```

## Reporting Commands

### Generate latest portable report from current results

```bash
npx allure generate allure-results --clean --single-file -o allure-report-combined-shareable
node scripts/customize-allure-report.js allure-report-combined-shareable
```

### Team standard client-share command

```bash
npm run report:combined:client
```

This:

1. runs the combined suite
2. generates a portable single-file Allure report
3. applies Mammoth branding
4. creates a zip for client sharing

## What To Share With Clients

Share only the portable report or zip:

1. `allure-report-combined-shareable/index.html`
2. `allure-report-combined-shareable.zip`

Do not share the standard multi-file Allure folder for direct file opening.

## Summary For Team Members

### Copy these first

1. `package.json`
2. `playwright.config.js`
3. `helpers/`
4. `selectors/`
5. `scripts/`
6. `assets/`
7. `docs/`

### Paste incoming project data here

1. AIQ test scripts into `source-aiq/`
2. AIQ utilities into `source-aiq/`
3. DPL into `data/`

### Run these first

```bash
npm install
npx playwright install
npm run scaffold:module -- <ModuleName>
```

## Parallel Execution Stability Rules

- Always make `closeSession(page)` a **no-op** in every module `_shared.js`.
  Do not perform real UI logout during teardown when tests share a Mammoth/Azure account across workers.
  Real logout during teardown invalidates the shared session for sibling workers and causes cascading auth failures.
- Validate stability at `--workers=3` before widening to higher concurrency.
- Fix auth/session issues in `helpers/auth.js` rather than reducing workers as a permanent workaround.
- For final client report generation, `--workers=1` is always safe if any doubt remains.