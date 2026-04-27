# Iteration Matrix Handoff

This document captures the durable framework, reporting, and conversion rules for the Iteration Matrix track in this repository.

Use it as the project-specific companion to [docs/conversion-framework.md](./conversion-framework.md) when continuing conversion or regenerating client-shareable artifacts.

## Current Position

- Iteration Matrix is the active AIQ intake project in this workspace.
- The source intake lives under `source-aiq/` and currently uses spaced folder names: `Test Scripts` and `Utility Functions`.
- The track is namespaced under its own project surfaces:
  - `tests/Iteration_Matrix/`
  - `helpers/iteration-matrix/`
  - `selectors/iteration-matrix/`
  - `data/iteration-matrix/`
- The scaffold entry point for this track is `npm run scaffold:iteration-matrix`.

## Framework Structure

- Keep one Playwright module folder per AIQ module under `tests/Iteration_Matrix/`.
- Keep module specs thin and helper-backed through a local `_shared.js`.
- Centralize reusable UI logic in `helpers/iteration-matrix/*.js` and raw locator candidates in `selectors/iteration-matrix/*.selectors.js`.
- Preserve the shared Allure hierarchy setup through `helpers/allureHierarchy.js` and `registerModuleSuite(test, __dirname)`.
- Prefer wrapping exported Iteration Matrix helper maps with `helpers/clientReadableSteps.js` so Allure keeps readable nested business steps in the Execution panel instead of relying only on raw Playwright API detail.

## Runtime Data And Auth

- Runtime data is loaded through `helpers/iteration-matrix/dataLoader.js`.
- The default runtime CSV preference is:
  - `data/iteration-matrix/IM_DPL1.csv`
  - fallback to `source-aiq/IM_DPL1.csv`
- Supported environment overrides are:
  - `ITERATION_MATRIX_DATA_FILE`
  - `ITERATION_MATRIX_BASE_URL`
  - `ITERATION_MATRIX_USERNAME_ADMIN`
  - `ITERATION_MATRIX_PASSWORD_ADMIN`
- Iteration Matrix uses a direct username/password login flow through `helpers/iteration-matrix/auth.js`.

## Session Strategy

- `closeSession(page)` must be a no-op.
- The root control point is `helpers/iteration-matrix/auth.js`, where logout is intentionally a no-op.
- The Iteration Matrix scaffold now generates no-op `closeSession()` behavior for new module `_shared.js` files.
- Do not reintroduce real UI logout in module teardown. If a login/session issue appears, fix the shared auth or navigation layer instead.

## Reporting Workflow

- Store generated Iteration Matrix reports under `Result/`.
- Use the packaged client-report commands for shareable output:
  - `npm run report:iteration-matrix:client`
  - `npm run report:iteration-matrix:last-failed:client`
  - `npm run report:iteration-matrix:card-on-file:client`
  - `npm run report:iteration-matrix:customer-management-admin-new:client`
  - `npm run report:iteration-matrix:customer-management-admin-new:last-failed:client`
  - `npm run report:iteration-matrix:criteria-settings:client`
  - `npm run report:iteration-matrix:criteria-settings:last-failed:client`
- These flows follow the current Iteration Matrix reporting standard:
  - clean or merge `allure-results`
  - write `environment.properties`, `executor.json`, and `categories.json`
  - normalize suite labels with `scripts/normalize-allure-suites.js`
  - flatten legacy generic `Run converted flow` wrapper steps when present
  - strip `Source AIQ:` lines from descriptions
  - generate a single-file Allure report
  - apply Mammoth branding with `scripts/customize-allure-report.js`
  - package the client-shareable zip under `Result/`
- The current Iteration Matrix shareable artifact path is `Result/iteration-matrix-full-project.zip`.
- Dedicated module report flows should preserve the module name as the Allure suite. The suite normalizer now treats `Iteration_Matrix` as a container and keeps the actual module folder name, such as `Criteria Settings`, as the suite label.
- Dedicated module last-failed report flows should reuse the previous module baseline in `allure-results`, rerun only the failed specs with `--last-failed`, replace those prior test entries by Allure test identity, and then regenerate the shareable report. Do not append duplicate result entries for unchanged tests.
- Treat that last-failed merge flow as the default reporting rule for every future Iteration Matrix module-specific client report runner.
- New Iteration Matrix module report scripts should be added as thin wrappers over `scripts/module-client-report-runner.js` so both full and last-failed flows inherit the same merge, metadata, normalization, branding, and packaging behavior.
- `scripts/flatten-generic-allure-steps.js` only improves module readability when the generic wrapper already contains nested helper-created child steps. The durable fix is readable helper export steps, not report-time flattening alone.
- Apply that readable-step shaping module-wise during conversion completion. Do not treat a repo-wide wrapper cleanup as a prerequisite unless a cross-module reporting deadline requires it.

## Criteria Settings Status

- `tests/Iteration_Matrix/Criteria_Settings/` is now fully helper-backed and validated clean at 66 passing specs.
- The module has dedicated client-report commands for both full reruns and last-failed merge reruns.
- Its readable report structure is driven from helper-layer wrapped steps in `helpers/iteration-matrix/criteriaSettings.js`, not from report-time flattening alone.

## Customer Management Admin New Status

- `tests/Iteration_Matrix/Customer_Management_Admin_New/` is fully converted, live-aligned, and validated clean at 17 passing specs.
- The shared helper/selectors were stabilized for USA -> Alaska onboarding, optional transmission controls, Duplicate Payments and Statement Recon behavior, and resilient submit success handling.
- The module has dedicated client-report commands for both full reruns and last-failed merge reruns.
- Its readable report structure is driven from helper-layer business steps in `helpers/iteration-matrix/customerManagementAdminNew.js`, with report flattening used only to remove the top-level generic wrapper.

## Card On File Reporting Status

- `tests/Iteration_Matrix/Card_On_File/` has a validated dedicated module client-report flow.
- Report readability was restored without rewriting every spec by shaping the shared helper export layer in `helpers/iteration-matrix/cardOnFile.js`.
- Treat this as the retrofit pattern for previously converted modules that still expose only a generic `Run converted flow` wrapper in raw spec code.

## Conversion Rules To Reuse

- Treat shared helpers and selectors as the primary fix layer. Avoid patching many specs with the same workaround.
- Use AIQ-semantic assertions. Do not strengthen the assertion beyond what the source script actually verifies.
- Keep client-facing Allure descriptions limited to:
  - `Scenario:`
  - `Spec File:`
- Keep report folders and zip artifacts under `Result/`; do not leave them at the repository root.

## Current Durable Lessons

### User Role Relation drift

- The original AIQ user-role-relation flow no longer matches the current live app route.
- Avoid broad combobox fallbacks in this slice; they can create false greens on unrelated User Management widgets.

### SR Upload New

- Customer selection is more stable by typing into the searchable combobox and confirming with Enter.
- Supplier search is currently driven by the visible input with placeholder `Search suppliers (min 3 characters)...`.
- If a customer is already selected on page load, supplier-focused flows should reuse that state instead of forcing a brittle reselection.

### Customer Management Admin

- Current admin route coverage is aligned to the live app, not stale AIQ submenu names.
- Pagination parsing must wait for a real `Page: <n> of <m>` summary instead of reading the intermediate `Page: loading..` state.

## Recommended Continuation Workflow

1. Start from the owning Iteration Matrix module folder under `tests/Iteration_Matrix/`.
2. Extend the module helper and selectors first, and keep readable helper-step exports when the module is intended for client-facing report consumption.
3. Keep the spec pattern consistent: load runtime data, login, one helper-backed business flow, no-op close session.
4. Validate the touched module or focused rerun before widening to a broader track run.
5. Shape report readability during the same module conversion slice. Do not defer helper-layer readable steps to a later repo-wide cleanup unless a reporting deadline forces it.
6. For module-level failure follow-up, prefer the module-specific last-failed client-report command so only the failed test entries are replaced inside the existing report baseline.
7. Regenerate the shareable report from the latest `allure-results` when client output is needed.