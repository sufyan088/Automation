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
  - `npm run report:iteration-matrix:customer-management-admin-nm:client`
  - `npm run report:iteration-matrix:customer-management-admin-nm:last-failed:client`
  - `npm run report:iteration-matrix:customer-management-payment-method:client`
  - `npm run report:iteration-matrix:customer-management-payment-method:last-failed:client`
  - `npm run report:iteration-matrix:customer-management-admin-two:client`
  - `npm run report:iteration-matrix:customer-management-admin-two:last-failed:client`
  - `npm run report:iteration-matrix:customer-onboarding:client`
  - `npm run report:iteration-matrix:customer-onboarding:last-failed:client`
  - `npm run report:iteration-matrix:customer-onboarding-imremit-lite:client`
  - `npm run report:iteration-matrix:customer-onboarding-imremit-lite:last-failed:client`
  - `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:client`
  - `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:last-failed:client`
  - `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:client`
  - `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:last-failed:client`
  - `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:client`
  - `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:last-failed:client`
  - `npm run report:iteration-matrix:duplicate-dashboard-new:client`
  - `npm run report:iteration-matrix:duplicate-dashboard-new:last-failed:client`
  - `npm run report:iteration-matrix:criteria-settings:client`
  - `npm run report:iteration-matrix:criteria-settings:last-failed:client`
- These flows follow the current Iteration Matrix reporting standard:
  - clean or merge `allure-results`
  - write `environment.properties`, `executor.json`, and `categories.json`
  - normalize suite labels with `scripts/normalize-allure-suites.js`
  - flatten legacy generic wrapper steps such as `Run converted flow` and helper-level `Run TS ...` shells when present
  - strip `Source AIQ:` lines from descriptions
  - generate a single-file Allure report
  - apply Mammoth branding with `scripts/customize-allure-report.js`
  - package the client-shareable zip under `Result/`
- The current Iteration Matrix shareable artifact path is `Result/iteration-matrix-full-project.zip`.
- Dedicated module report flows should preserve the module name as the Allure suite. The suite normalizer now treats `Iteration_Matrix` as a container and keeps the actual module folder name, such as `Criteria Settings`, as the suite label.
- Dedicated module last-failed report flows should reuse the previous module baseline in `allure-results`, rerun only the failed specs with `--last-failed`, replace those prior test entries by Allure test identity, and then regenerate the shareable report. Do not append duplicate result entries for unchanged tests.
- If a dedicated module last-failed rerun has no failed specs available, treat Playwright's `No tests found.` output as a no-op rerun and regenerate the branded shareable report from the preserved module baseline instead of failing the command.
- Treat that last-failed merge flow as the default reporting rule for every future Iteration Matrix module-specific client report runner.
- New Iteration Matrix module report scripts should be added as thin wrappers over `scripts/module-client-report-runner.js` so both full and last-failed flows inherit the same merge, metadata, normalization, branding, and packaging behavior.
- `scripts/flatten-generic-allure-steps.js` only improves module readability when the wrapper already contains nested helper-created child steps. The durable fix is readable helper-layer `test.step()` actions, not report-time flattening alone.
- If a helper-level router such as `runScenario()` already emits the business flow through nested `test.step()` calls, export it directly. Do not wrap that router again with `wrapHelperMapWithReadableSteps`, or the client report will show a stray `Run Scenario` container above the real business steps.
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

## Customer Onboarding imREmit Lite Status

- `tests/Iteration_Matrix/Customer_Onboarding_imREmit_Lite/` is fully converted and validated clean at 5 passing specs.
- The module has dedicated client-report commands for both full reruns and last-failed merge reruns.
- Its readable report structure is driven from helper-layer business steps in `helpers/iteration-matrix/customerOnboardingImremitLite.js`.

## Customer Management Admin NM Status

- `tests/Iteration_Matrix/Customer_Management_Admin_NM/` is fully converted, live-aligned, and validated clean at 40 passing specs.
- The module now has the same dedicated client-report wrapper pattern as the New module, including full-run and last-failed rerun scripts under `scripts/` with artifacts written to `Result/`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-customer-management-admin-nm-shareable/` and `Result/iteration-matrix-customer-management-admin-nm.zip`.
- The shared helper/selectors were stabilized for imREmit Lite bank and parent associations, profile editing, bank-management modal add/edit flows, runner-configuration save flows, and resilient payment-method setup for customers that already carry a locked `J.P. Morgan` provider.
- The durable runner-config lesson is to follow the live app path exactly: open `Open Recon Runner Config`, set the target checkbox, click `Add Recon Config Runner`, then click the final summary-step `Complete` button before treating the configuration as saved.
- The validated fixed-customer path for the recon checkbox slice uses `Customertest0100`, and the module report now carries normalized suite labels plus client-facing descriptions limited to `Scenario:` and `Spec File:` with no `Source AIQ:` line.

## Customer Management Admin Two Status

- `tests/Iteration_Matrix/Customer_Management_Admin_Two/` is fully converted, live-aligned, and validated clean at 41 passing specs.
- The module now has dedicated full-module and last-failed client-report wrappers at `npm run report:iteration-matrix:customer-management-admin-two:client` and `npm run report:iteration-matrix:customer-management-admin-two:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-customer-management-admin-two-shareable/` and `Result/iteration-matrix-customer-management-admin-two.zip`.
- The shared helper/selectors were stabilized for Participant Register save/search behavior, Payment Group reflection, Payment Runner navigation, disabled location-field visibility, and live-validator-aligned field-creation scenarios.
- The finalized report format for this module keeps client-facing descriptions limited to `Scenario:` and `Spec File:`, while helper-layer business steps feed the Execution panel and report flattening removes only the leftover wrapper shells above them.

## Customer Management Payment Method Status

- `tests/Iteration_Matrix/Customer_Management_Payment_Method/` is helper-backed and validated for its current single AIQ case.
- The module has dedicated full-module and last-failed client-report wrappers at `npm run report:iteration-matrix:customer-management-payment-method:client` and `npm run report:iteration-matrix:customer-management-payment-method:last-failed:client`.
- The shared helper/selectors cover create-customer onboarding, imREmit action-menu drift, payment-provider/payment-method save flow, and created-customer cleanup.

## Customer Module Management Admin Module Status

- `tests/Iteration_Matrix/Customer_Module_Management_Admin_Module/` is helper-backed through `helpers/iteration-matrix/customerModuleManagementAdminModule.js`.
- The module is now live-aligned and validated clean at 28/28 passing with `--workers=3`.
- The finalized scenario slice spans TS_01 through TS_28, covering table/navigation/search behavior plus update-subscription modal actions.
- The module follows the standard `_shared.js` pattern with direct login, shared helper-backed scenario execution, and no-op close session.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:customer-module-management-admin-module:client` and `npm run report:iteration-matrix:customer-module-management-admin-module:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-customer-module-management-admin-module-shareable/` and `Result/iteration-matrix-customer-module-management-admin-module.zip`.
- Shared helper/selectors were stabilized for exact Program Manager selection, USA -> Alaska onboarding, file transmission fields (`sFTP`, `Payment File`), popup-aware Update Subscription selection, optional update-success toast handling, and cleanup of created customers.
- Report readability for this module now matches the approved Iteration Matrix style: keep `Before Hooks`, `Login into Application`, business steps, `Logout from the application`, and `After Hooks`, while stripping only generic wrapper shells such as `Run converted flow` and helper-level `Run To verify ...` wrappers.
- When a module folder has a nearby sibling folder with a prefix overlap, scope module client-report runs by exact discovered spec files inside the target folder instead of a loose Playwright path regex; this is now the safe pattern implemented through `scripts/module-client-report-runner.js`.

## Customer Module Management Admin Module New Status

- `tests/Iteration_Matrix/Customer_Module_Management_Admin_Module_New/` is helper-backed through `helpers/iteration-matrix/customerModuleManagementAdminModuleNew.js`.
- The current implemented scenario slice spans TS_29 through TS_41, covering management-role access and the self-funding/update-subscription behavior currently wired in that helper.
- This slice reuses the Customer Management Admin New create-customer flow for seeded setup work, so create-form and module-loading behavior should be fixed at the shared helper layer first if those scenarios drift.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:customer-module-management-admin-module-new:client` and `npm run report:iteration-matrix:customer-module-management-admin-module-new:last-failed:client`.
- The current module artifact paths are `Result/allure-report-iteration-matrix-customer-module-management-admin-module-new-shareable/` and `Result/iteration-matrix-customer-module-management-admin-module-new.zip`.

## Customer Onboarding Status

- `tests/Iteration_Matrix/Customer_Onboarding/` is now helper-backed and validated clean at 21/21 passing specs with `--workers=3`.
- The primary shared implementation surface is `helpers/iteration-matrix/customerOnboarding.js`, with selectors rooted in `selectors/iteration-matrix/customerOnboarding.selectors.js`.
- Shared helper/selectors were stabilized for exact wizard `Next page` / `Previous page` navigation, Payment Method and Participant Register save-before-advance behavior, `Return to top` verification, customer-list search semantics for TS_21, and resilient Program Manager selection under module load.
- Shared auth readiness for this module also depends on the `Loading your workspace...` handling in `helpers/iteration-matrix/auth.js` and `selectors/iteration-matrix/common.selectors.js`.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:customer-onboarding:client` and `npm run report:iteration-matrix:customer-onboarding:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-customer-onboarding-shareable/` and `Result/iteration-matrix-customer-onboarding.zip`.
- `tests/Iteration_Matrix/Customer_Onboarding_imREmit_Lite/` remains a separate sibling module surface and should not be conflated with the completed base Customer_Onboarding report scope.

## Invoice Tracker Status

- `tests/Iteration_Matrix/Invoice_Tracker/` is fully helper-backed, live-aligned, and validated clean at 23/23 passing specs with `--workers=3`.
- The primary shared implementation surface is `helpers/iteration-matrix/invoiceTracker.js`, with selectors rooted in `selectors/iteration-matrix/invoiceTracker.selectors.js`.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:invoice-tracker:client` and `npm run report:iteration-matrix:invoice-tracker:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-invoice-tracker-shareable/` and `Result/iteration-matrix-invoice-tracker.zip`.
- Because `Invoice_Tracker` overlaps sibling folder prefixes, the report wrappers use exact discovered spec-file scoping so only the intended module contributes results.
- Report readability for this module follows the approved Iteration Matrix style: keep client-facing descriptions limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow from helper-owned steps instead of generic wrapper shells.

## imREmit Dashboard Failed Payments On IM IM Error Status

- `tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR/` is helper-backed through `helpers/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.js` and selectors rooted in `selectors/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.selectors.js`.
- The module is validated clean at 29/29 passing with `--workers=3`.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:client` and `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-im-im-error:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-imremit-dashboard-failed-payments-on-im-im-error-shareable/` and `Result/iteration-matrix-imremit-dashboard-failed-payments-on-im-im-error.zip`.
- Report readability for this module follows the approved Iteration Matrix pattern: keep `Description` limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow from helper-owned steps instead of a wrapped `runScenario` shell.
- When generating a dedicated report for this module, keep exact discovered spec-file scoping enabled so the long folder name is treated as the report scope and no sibling dashboard folders bleed into the artifact.

## imREmit Dashboard New Select Multiple Customers Status

- `tests/Iteration_Matrix/imREmit_Dashboard_New_Select_Multiple_Customers/` is helper-backed through `helpers/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.js` and selectors rooted in `selectors/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.selectors.js`.
- The module is validated clean at 5/5 passing.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:client` and `npm run report:iteration-matrix:imremit-dashboard-new-select-multiple-customers:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-imremit-dashboard-new-select-multiple-customers-shareable/` and `Result/iteration-matrix-imremit-dashboard-new-select-multiple-customers.zip`.
- Report readability for this module follows the approved Iteration Matrix pattern: keep `Description` limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow directly from helper-owned steps with no spec-level `Run converted flow` wrapper and no helper-level `Run Scenario` shell.

## Supplier Management imREmit New Reporting Status

- `tests/Iteration_Matrix/Supplier_Management_imREmit_New/` is now fully helper-backed through `helpers/iteration-matrix/supplierManagementImremitNew.js` and selectors rooted in `selectors/iteration-matrix/supplierManagementImremitNew.selectors.js`.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:supplier-management-imremit-new:client` and `npm run report:iteration-matrix:supplier-management-imremit-new:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-supplier-management-imremit-new-shareable/` and `Result/iteration-matrix-supplier-management-imremit-new.zip`.
- Report readability for this module follows the approved Iteration Matrix pattern: keep `Description` limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow directly from helper-owned steps with no helper-level `Run Supplier Management imREmit New scenario` wrapper.

## imREmit Dashboard New Bank Reconciliation File Not Received Status

- `tests/Iteration_Matrix/imREmit_Dashboard_New_Bank_reconciliation_file_not_received/` is helper-backed through `helpers/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.js` and selectors rooted in `selectors/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.selectors.js`.
- The module is validated clean at 23/23 passing through the dedicated full client-report run.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:imremit-dashboard-new-bank-reconciliation-file-not-received:client` and `npm run report:iteration-matrix:imremit-dashboard-new-bank-reconciliation-file-not-received:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-imremit-dashboard-new-bank-reconciliation-file-not-received-shareable/` and `Result/iteration-matrix-imremit-dashboard-new-bank-reconciliation-file-not-received.zip`.
- Report readability for this module follows the approved Iteration Matrix pattern: keep `Description` limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow directly from helper-owned steps with no spec-level `Run converted flow` wrapper and no helper-level `Run Scenario` shell.
- The helper-owned step wording for this module was explicitly aligned to the FileProcessing reporting style so the Allure `Test body` reads as business actions such as opening Payment Management, opening payment details, and verifying pagination-size choices.
- The module-specific last-failed wrapper is validated. When there are no failed specs available for rerun, it regenerates the branded module report from the preserved baseline results instead of treating Playwright's `No tests found.` output as a hard failure.
- The live module differs from the older failed-payments surfaces: pagination relies on lucide icon controls and page-size menus, row actions use a grip-vertical control, and helper/selectors should be reused from this module instead of falling back to the generic failed-payments selectors.

## imREmit Dashboard Failed Payments On Provider Payment Provider Error Status

- `tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR/` is helper-backed through `helpers/iteration-matrix/imremitDashboardFailedPaymentsOnProviderPaymentProviderError.js` and selectors rooted in `selectors/iteration-matrix/imremitDashboardFailedPaymentsOnProviderPaymentProviderError.selectors.js`.
- The module is validated clean at 29/29 passing through direct per-spec relative-path Playwright runs.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:client` and `npm run report:iteration-matrix:imremit-dashboard-failed-payments-on-provider-payment-provider-error:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-imremit-dashboard-failed-payments-on-provider-payment-provider-error-shareable/` and `Result/iteration-matrix-imremit-dashboard-failed-payments-on-provider-payment-provider-error.zip`.
- Report readability for this module follows the approved Iteration Matrix pattern: keep `Description` limited to `Scenario:` and `Spec File:`, keep `Login into Application` and `Logout from the application` visible, and expose the business flow from helper-owned steps instead of a wrapped `runScenario` shell.
- For validation in this environment, prefer direct relative-path `playwright test <relative-spec>` invocations; bulk harnesses that detach child processes or pass absolute file paths can produce false `No tests found` failures.
- Both provider report wrappers are validated. The full client report reruns the module clean at 29/29 passing, and the last-failed wrapper now succeeds by rebuilding from preserved baseline results when no failed specs are available for rerun.

## Card On File Reporting Status

- `tests/Iteration_Matrix/Card_On_File/` has a validated dedicated module client-report flow.
- Report readability was restored without rewriting every spec by shaping the shared helper export layer in `helpers/iteration-matrix/cardOnFile.js`.
- Treat this as the retrofit pattern for previously converted modules that still expose only a generic `Run converted flow` wrapper in raw spec code.

## Duplicate Dashboard New Status

- `tests/Iteration_Matrix/Duplicate_Dashboard_New/` is helper-backed through `helpers/iteration-matrix/duplicateDashboardNew.js`.
- The current scenario slice contains TS_31 and is validated clean after moving business execution into helper-owned readable steps.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:duplicate-dashboard-new:client` and `npm run report:iteration-matrix:duplicate-dashboard-new:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-duplicate-dashboard-new-shareable/` and `Result/iteration-matrix-duplicate-dashboard-new.zip`.
- Keep this single-spec module distinct from the larger sibling folder `tests/Iteration_Matrix/Duplicate_Dashboard_New_Module/`; exact discovered spec-file scoping is required to avoid cross-folder report contamination.

## Duplicate Dashboard New Module Status

- `tests/Iteration_Matrix/Duplicate_Dashboard_New_Module/` now routes spec execution through `helpers/iteration-matrix/duplicateDashboardNewModule.js` instead of per-spec empty `Run converted flow` wrappers.
- The initial validated slice is TS_32, using helper-owned steps that create a fresh Duplicate Payments customer, open the dashboard, select the seeded customer, and open the run-type control.
- Additional validated helper-backed slices now include:
  - TS_41 and TS_64 for settings-form visibility.
  - TS_50, TS_51, TS_53, TS_54, TS_55, TS_56, and TS_57 for One Time Run existing-settings date/calendar and mandatory-label checks.
  - TS_52, TS_58, TS_59, TS_60, TS_61, and TS_62 for One Time Run button-visibility and notes-entry variants.
  - TS_63, TS_68, TS_69, TS_70, TS_72, TS_74, TS_75, TS_77, TS_78, and TS_79 for Initial Run configure/default/mandatory/button-visibility variants.
- The current unresolved blocker is the Submit Settings branch, and it is application-side. TS_65 fails before the settings form can be used because a `getCustomerSettingsByExternalId` backend error notification/toast intercepts the `Configure` click after customer selection. TS_42/TS_65 should be treated as blocked until the application/backend is healthy again or the live flow is re-aligned to the actual app behavior.
- The remaining clearly unmapped scenarios after this slice are the title bands around TS_43-49, TS_66-67, TS_71, and TS_73.
- The module helper is now the only intended place to continue this conversion; do not reopen per-spec business logic unless the shared router abstraction proves incorrect.
- The module now has dedicated full-run and last-failed client-report wrappers at `npm run report:iteration-matrix:duplicate-dashboard-new-module:client` and `npm run report:iteration-matrix:duplicate-dashboard-new-module:last-failed:client`.
- The finalized module artifact paths are `Result/allure-report-iteration-matrix-duplicate-dashboard-new-module-shareable/` and `Result/iteration-matrix-duplicate-dashboard-new-module.zip`.
- Because `Duplicate_Dashboard_New` and `Duplicate_Dashboard_New_Module` overlap by prefix, keep exact discovered spec-file scoping enabled for this module's report scripts.

## Conversion Rules To Reuse

- Treat shared helpers and selectors as the primary fix layer. Avoid patching many specs with the same workaround.
- Use AIQ-semantic assertions. Do not strengthen the assertion beyond what the source script actually verifies.
- Keep client-facing Allure descriptions limited to:
  - `Scenario:`
  - `Spec File:`
- Keep report folders and zip artifacts under `Result/`; do not leave them at the repository root.
- For Iteration Matrix module reports, shape readable business execution in the shared helper layer with named `test.step()` actions, then let `scripts/flatten-generic-allure-steps.js` remove only the generic wrapper shells above them.
- Do not hide `Before Hooks`, `Login into Application`, `Logout from the application`, or `After Hooks` in final Iteration Matrix client reports; the desired client format keeps those sections visible above and below the business flow.
- Treat the Customer Onboarding report fix as the approved default for future module conversions: keep `Description` limited to `Scenario:` and `Spec File:`, and place the business flow directly in `Test body` through helper-owned steps rather than spec-level `Run converted flow` wrappers or helper-level `Run <scenario>` shells.

### Approved client-report shape for future conversions

- `Description`:
  - `Scenario:`
  - `Spec File:`
- `Test body`:
  - `Before Hooks`
  - `Login into Application`
  - top-level business-readable helper steps
  - `Logout from the application`
  - `After Hooks`
- Avoid generic wrapper containers in newly converted modules when the helper can emit the real business steps directly.

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
- For Customer_Management_Admin_NM runner-configuration flows, treat the shared helper as the source of truth for payment-method recovery and post-save completion; do not patch TS_108/TS_109 directly when the live wizard path shifts.

## Recommended Continuation Workflow

1. Start from the owning Iteration Matrix module folder under `tests/Iteration_Matrix/`.
2. Extend the module helper and selectors first, and keep readable helper-step exports when the module is intended for client-facing report consumption.
3. Keep the spec pattern consistent: load runtime data, login, one helper-backed business flow, no-op close session.
4. Validate the touched module or focused rerun before widening to a broader track run.
5. Shape report readability during the same module conversion slice. Do not defer helper-layer readable steps to a later repo-wide cleanup unless a reporting deadline forces it.
6. For module-level failure follow-up, prefer the module-specific last-failed client-report command so only the failed test entries are replaced inside the existing report baseline.
7. Regenerate the shareable report from the latest `allure-results` when client output is needed.