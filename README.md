# Iteration Matrix Playwright Automation

This repository is the current Iteration Matrix AIQ-to-Playwright conversion project.

The active executable automation in this workspace lives under `tests/Iteration_Matrix/`.

What this project reuses from earlier Mammoth automation work is strategy, not project ownership:

- helper-backed module architecture
- centralized selectors
- fallback locator handling
- no-op shared-session teardown
- client-shareable Allure reporting
- rerun-only-failed report merge workflows

## Project Goal

Convert the Iteration Matrix AIQ intake into maintainable Playwright coverage with:

- one module folder per AIQ module
- thin spec files with business-readable `test.step()` flow
- shared helper and selector layers
- centralized auth, wait, and fallback behavior
- reusable branded Allure reporting
- durable handoff guidance for future conversion and maintenance work

## Active Project Structure

```text
package.json
package-lock.json
playwright.config.js
README.md

allure-results/
playwright-report/
test-results/
Result/

assets/
data/
  iteration-matrix/

docs/
helpers/
  allureHierarchy.js
  clientReadableSteps.js
  fallback.js
  iteration-matrix/

selectors/
  iteration-matrix/

scripts/
  bootstrap-iteration-matrix-structure.js
  module-client-report-runner.js
  normalize-allure-suites.js
  flatten-generic-allure-steps.js
  strip-source-aiq-from-allure-results.js
  customize-allure-report.js
  run-iteration-matrix-client-report.js
  run-iteration-matrix-last-failed-client-report.js
  run-iteration-matrix-card-on-file-client-report.js
  run-iteration-matrix-criteria-settings-client-report.js
  run-iteration-matrix-criteria-settings-last-failed-client-report.js

source-aiq/
  Test Scripts/
  Utility Functions/

tests/
  Iteration_Matrix/
```

## Active Module Inventory

The active project inventory is the Iteration Matrix module set under `tests/Iteration_Matrix/`, together with matching shared logic under `helpers/iteration-matrix/` and `selectors/iteration-matrix/`.

Current module folders include areas such as:

- `Card_On_File`
- `Criteria_Settings`
- `Customer_Management_Admin`
- `Customer_Management_Admin_New`
- `Customer_Management_Admin_NM`
- `Customer_Management_Admin_Two`
- `Customer_Management_Payment_Method`
- `Customer_Module_Management_Admin_Module`
- `Customer_Module_Management_Admin_Module_New`
- `Customer_Onboarding`
- `Customer_Onboarding_imREmit_Lite`
- `Duplicates_Dashboard`
- `FileProcessing`
- `imREmit_Dashboard_New_Select_Multiple_Customers`
 - `imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR`
- `Invoice_Tracker`
- `Login`
- `Payment_Management_imREmit`
- `Remittance_Management`
- `Runner_Configuration`
- `Settings`
- `SR_Search`
- `SR_Upload_New`
- `Statement_Search`
- `Statement_Upload`
- `Supplier_Master_List`
- `User_Management_Admin`

Additional module folders already exist under `tests/Iteration_Matrix/`; treat that directory as the source of truth for current project scope.

## Current Status

- Iteration Matrix is the only active top-level test track in this workspace.
- Runtime data for this track is loaded from `data/iteration-matrix/IM_DPL1.csv` unless overridden by environment variables.
- Criteria Settings is fully helper-backed and validated clean at 66 passing specs.
- Customer Management Admin New is fully converted, validated clean at 17 passing specs, and has dedicated full and last-failed module report flows.
- Customer Management Admin NM is fully converted, validated clean at 40 passing specs, and has dedicated full and last-failed module report flows with shareable artifacts under `Result/`.
- Customer Management Admin Two is fully converted, validated clean at 41 passing specs, and has dedicated full and last-failed module report flows with shareable artifacts under `Result/`.
- Customer Management Payment Method is helper-backed, validated for its current single AIQ case, and has dedicated full and last-failed module report flows.
- Customer Module Management Admin Module is helper-backed for the current TS_01 to TS_28 slice through `helpers/iteration-matrix/customerModuleManagementAdminModule.js`.
- Customer Module Management Admin Module New is helper-backed for the current TS_29 to TS_41 slice through `helpers/iteration-matrix/customerModuleManagementAdminModuleNew.js` and has dedicated full and last-failed module report flows with shareable artifacts under `Result/`.
- Customer Onboarding is helper-backed, validated clean at 21 passing specs, and has dedicated full and last-failed module report flows with shareable artifacts under `Result/`.
- Customer Onboarding imREmit Lite remains a separate sibling module surface from the completed base Customer Onboarding report scope.
- imREmit Dashboard Failed payments on IM IM Error is helper-backed, validated clean at 29 passing specs with `--workers=3`, and has dedicated full and last-failed module report flows with Mammoth-branded shareable artifacts under `Result/`.
- imREmit Dashboard New Select Multiple Customers is helper-backed, validated clean at 5 passing specs, and has dedicated full and last-failed module report flows with Mammoth-branded shareable artifacts under `Result/`.
- imREmit Dashboard Failed payments on Provider Payment Provider Error is helper-backed, validated clean at 29 passing specs, and has dedicated full and last-failed module report flows with Mammoth-branded shareable artifacts under `Result/`.
- imREmit Dashboard Failed payments on Provider Payment Provider Error report wrappers are validated end to end; the last-failed path now regenerates from baseline when there are no failed specs to rerun.
- Card On File has client-readable report output restored through helper-layer readable steps and a validated dedicated module report flow.
- Module-level client reporting now supports rerun-only-failed merge flows through shared runner logic in `scripts/module-client-report-runner.js`.
- Report-step shaping is part of module conversion done-ness: keep specs thin, expose business-readable nested helper steps, and let report flattening remove only the generic wrapper when needed.
- Durable project-specific continuation guidance lives in `docs/iteration-matrix-handoff.md`.

## Install

```bash
npm install
npx playwright install
```

## Preferred Test Commands

Use direct Playwright commands for Iteration Matrix work.

### Run the full track

```bash
npm run test:iteration-matrix
```

### Run one module

```bash
npx playwright test tests/Iteration_Matrix/Criteria_Settings --workers=3
npx playwright test tests/Iteration_Matrix/Card_On_File --workers=3
```

### Run one spec

```bash
npx playwright test tests/Iteration_Matrix/Criteria_Settings/TS_03_To_verify_that_Search_character_field_is_functional.spec.js --headed --debug
```

### Run headed or debug

```bash
npm run test:headed
npm run test:debug
```

## Reporting Commands

Use the packaged Iteration Matrix report flows whenever output is meant to be shared.

### Whole-track reports

- `npm run report:iteration-matrix:client`
- `npm run report:iteration-matrix:last-failed:client`

### Module reports

- `npm run report:iteration-matrix:card-on-file:client`
- `npm run report:iteration-matrix:customer-management-admin-new:client`
- `npm run report:iteration-matrix:customer-management-admin-new:last-failed:client`
- `npm run report:iteration-matrix:customer-management-admin-nm:client`
- `npm run report:iteration-matrix:customer-management-admin-nm:last-failed:client`
- `npm run report:iteration-matrix:customer-management-admin-two:client`
- `npm run report:iteration-matrix:customer-management-admin-two:last-failed:client`
- `npm run report:iteration-matrix:customer-module-management-admin-module:client`
- `npm run report:iteration-matrix:customer-module-management-admin-module:last-failed:client`
- `npm run report:iteration-matrix:customer-module-management-admin-module-new:client`
- `npm run report:iteration-matrix:customer-module-management-admin-module-new:last-failed:client`
- `npm run report:iteration-matrix:customer-management-payment-method:client`
- `npm run report:iteration-matrix:customer-management-payment-method:last-failed:client`
- `npm run report:iteration-matrix:customer-onboarding:client`
- `npm run report:iteration-matrix:customer-onboarding:last-failed:client`
- `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:client`
- `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:last-failed:client`
- `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:client`
- `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:last-failed:client`
- `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:client`
- `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:last-failed:client`
- `npm run report:iteration-matrix:criteria-settings:client`
- `npm run report:iteration-matrix:criteria-settings:last-failed:client`

### Reporting behavior

- shareable artifacts are written under `Result/`
- suite labels are normalized before report generation
- `Source AIQ:` lines are stripped from client-facing descriptions
- client-facing descriptions should stay limited to `Scenario:` and `Spec File:`
- module suites are preserved from their folder names
- dedicated module last-failed flows rerun only failed specs, replace only those result entries, and keep unchanged baseline results intact
- if a module-specific last-failed rerun has no failed specs available, regenerate the branded report from the preserved baseline instead of treating Playwright's `No tests found.` output as a hard failure
- dedicated module report scripts should be thin wrappers over `scripts/module-client-report-runner.js`
- readable module Execution steps should be created at the helper layer with business-named `test.step()` actions
- future module conversions should follow the approved client-report shape by default: keep `Description` limited to `Scenario:` and `Spec File:`, and show the business flow in `Test body` through direct helper-layer steps such as `Create customer with imREmit module` instead of generic wrapper containers
- `scripts/flatten-generic-allure-steps.js` removes generic wrapper layers such as `Run converted flow` and helper-level `Run TS ...` wrappers only when those wrappers already contain nested business-readable child steps
- do not rely on report-time flattening as a substitute for helper-layer business steps; flattening only exposes the steps you already created
- for newly converted modules, avoid introducing spec-level `Run converted flow` wrappers, and do not wrap exported scenario routers like `runScenario` with `wrapHelperMapWithReadableSteps` when they already orchestrate business-named child steps

If you generate a report manually from existing `allure-results`, run the same result processing first:

```bash
node scripts/normalize-allure-suites.js
node scripts/flatten-generic-allure-steps.js
node scripts/strip-source-aiq-from-allure-results.js
```

## Runtime Data And Authentication

- Runtime data is loaded through `helpers/iteration-matrix/dataLoader.js`.
- Default runtime CSV preference is `data/iteration-matrix/IM_DPL1.csv`.
- Supported overrides include:
  - `ITERATION_MATRIX_DATA_FILE`
  - `ITERATION_MATRIX_BASE_URL`
  - `ITERATION_MATRIX_USERNAME_ADMIN`
  - `ITERATION_MATRIX_PASSWORD_ADMIN`
- Auth is handled by `helpers/iteration-matrix/auth.js` using a direct username/password login flow.
- Module teardown must remain a no-op. Do not reintroduce real UI logout in `_shared.js` files.

## Core Framework Rules

### Fix shared behavior at the root

If multiple specs fail for the same reason, fix the shared helper or selector layer first instead of patching each spec separately.

### Keep selectors resilient

Use candidate selector arrays and fallback handling for brittle UI surfaces. Prefer visible, form-scoped locators when pages duplicate hidden DOM.

### Keep specs thin

Each spec should usually do only this:

1. load runtime data
2. login
3. run one helper-backed business flow
4. call the shared no-op close session

### Match AIQ semantics exactly

Do not strengthen assertions beyond what the source AIQ script actually verifies. If the source checks presence or minimum occurrence, keep that same semantic level in Playwright.

### Keep reports client-readable

Readable Allure execution detail should come from helper-layer wrapped `test.step()` titles, not from raw Playwright click/fill noise.

## Scaffold Commands

### Bootstrap the Iteration Matrix structure

```bash
npm run scaffold:iteration-matrix
```

### Scaffold one module manually

```bash
npm run scaffold:module -- <ModuleName>
```

## Documentation

- [docs/iteration-matrix-handoff.md](docs/iteration-matrix-handoff.md)
  Primary project handoff for Iteration Matrix conversion, reporting, runtime data, and continuation workflow.
- [docs/conversion-framework.md](docs/conversion-framework.md)
  Reusable conversion strategy and framework rules that still apply here.
- [docs/team-project-setup-guide.md](docs/team-project-setup-guide.md)
  Framework reuse guidance when setting up another project.

## Notes For Future Work

- Treat this repo as an Iteration Matrix maintenance and conversion workflow.
- When new AIQ deltas arrive under `source-aiq/Test Scripts/`, extend the shared helper and selector layers before widening spec changes.
- Keep generated `Result/` artifacts out of normal source-editing workflows.
- Remove temporary audit files once their outcomes are captured in durable docs.

