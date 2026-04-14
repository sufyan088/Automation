# Vision Spring Playwright Automation

This repository is the current AIQ-to-Playwright conversion project for the Vision Spring application. It is no longer a File Processing proof of concept. The active work in this repo is maintaining Vision Spring Playwright coverage with shared helpers, centralized selectors, fallback locator handling, and reusable Allure reporting workflows.

## Project Goal

Convert the Vision Spring AIQ automation assets under `source-aiq/` into maintainable Playwright coverage with:

- one Playwright module folder per AIQ module
- thin spec files with business-readable `test.step()` flow
- shared helper and selector layers
- centralized auth, fallback locator, and wait behavior
- reusable branded Allure reporting
- a pull-friendly handoff for ongoing maintenance and future AIQ delta intake

## Current Repository Structure

```text
tests/
  DigitEYESCamps_*/
  DigitEYESDataLoader_*/
  DigitEYESReporting_*/
  DigitEYESSettings_*/

helpers/
  actions.js
  auth.js
  dataLoader.js
  fallback.js
  digiteyes* module helpers

selectors/
  common selectors
  module selector files

source-aiq/
  TestScripts/
  UtilityFunctions/

data/
  JS_DPL_Camp_Cluster.csv

docs/
  conversion-framework.md
  team-project-setup-guide.md
  vision-spring-conversion-handoff.md

scripts/
  bootstrap-aiq-structure.js
  scaffold-module.js
  customize-allure-report.js
  normalize-allure-suites.js
  run-combined-client-report.js

Result/
  generated reports and shareable artifacts
```

## Current Module Inventory

The repo currently contains module folders for these Vision Spring families:

### DigitEYES Camps

- `DigitEYESCamps_DataForSalesforce`
- `DigitEYESCamps_ManageCampsCluster`
- `DigitEYESCamps_Participants`

### DigitEYES Data Loader

- `DigitEYESDataLoader_DataForSalesForce`
- `DigitEYESDataLoader_ParticipantConsents`
- `DigitEYESDataLoader_SFDataLoaderChangeLog`
- `DigitEYESDataLoader_SFDataLoaderErrorCases`
- `DigitEYESDataLoader_SFDataLoaderQueue`

### DigitEYES Reporting

- `DigitEYESReporting_CampTrends`
- `DigitEYESReporting_InternetAvailability`
- `DigitEYESReporting_PopinAvailability`
- `DigitEYESReporting_SummarySheetData`
- `DigitEYESReporting_WorkReportIPTeams`
- `DigitEYESReporting_WorkReportVSTeams`

### DigitEYES Settings

- `DigitEYESSettings_CountrySettings`
- `DigitEYESSettings_DESalesforceFieldMapping`
- `DigitEYESSettings_Hospitals`
- `DigitEYESSettings_ImplementationPartners`

## Current Status

Conversion parity is complete for the current tracked intake (all 18 source module folders under `source-aiq/TestScripts/DigitEYESCampsCluster`).

- Shared auth, fallback locator handling, Allure hierarchy, and reporting customization are already in place.
- All four module families are validated clean at `--workers=3`.
- Any new AIQ scripts arriving under `source-aiq/TestScripts` are future delta conversions; use the recommended workflow in the handoff doc.
- Current run-level numbers are intentionally maintained in the handoff doc instead of README to keep this file stable.

For the most current module-by-module handoff and remaining conversion guidance, use [docs/vision-spring-conversion-handoff.md](docs/vision-spring-conversion-handoff.md).

## Install

```bash
npm install
npx playwright install
```

## Preferred Test Commands

Use direct Playwright commands for the active Vision Spring modules.

### Run everything

```bash
npm test
```

### Run one family

```bash
npx playwright test tests/DigitEYESReporting_* --workers=3
npx playwright test tests/DigitEYESSettings_* --workers=3
npx playwright test tests/DigitEYESDataLoader_* --workers=3
npx playwright test tests/DigitEYESCamps_* --workers=3
```

### Run one module

```bash
npx playwright test tests/DigitEYESReporting_CampTrends
npx playwright test tests/DigitEYESReporting_WorkReportVSTeams
```

### Run headed or debug

```bash
npm run test:headed
npm run test:debug
```

### Run one spec

```bash
npx playwright test tests/DigitEYESReporting_CampTrends/TC_01_To_verify_that_DigitEYES_Reporting_displays_the_Camps_Trend_button.spec.js --headed --debug
```

## Data and Authentication Behavior

- Runtime data is loaded through `helpers/dataLoader.js`.
- The current DPL file is `data/JS_DPL_Camp_Cluster.csv`.
- The runtime copy under `data/JS_DPL_Camp_Cluster.csv` has been repaired to a valid minimal CSV; default credential fallback remains only as a safety net in `helpers/dataLoader.js` when intake data is malformed.
- Auth is centralized in `helpers/auth.js` and supports the working Microsoft-backed Vision Spring flow:
  - Microsoft username
  - Microsoft password
  - Stay signed in
  - app Office 365 Sign In
  - country picker
  - target module navigation
- Module `_shared.js` files intentionally use a no-op `closeSession(page)` to avoid shared-account logout collisions across parallel workers.

## Core Framework Rules Used In This Repo

### Shared fixes belong in helpers and selectors

If multiple specs show the same failure pattern, fix:

- `helpers/`
- `selectors/`

Do not patch each spec separately unless the behavior is truly one-off.

### Fallback locator strategy is required

`helpers/fallback.js` is the Playwright equivalent of AIQ fallback accessors.

Use candidate selector arrays in selector files instead of relying on a single brittle locator.

### Prefer visible form-scoped selectors when pages duplicate hidden DOM

Some Vision Spring pages leave hidden duplicate modal fields after Apply, Reset, or Close. When that happens:

- prefer visible form-scoped selectors first
- then keep the generic selector as a fallback

### Keep specs thin

Each spec should usually do only this:

1. load runtime data
2. login
3. call one helper-driven business verification
4. call the shared no-op logout

### Match AIQ initialization steps exactly when asserting defaults

If a source AIQ script performs an in-form selection before checking a default, keep that step in the converted helper even if the form already appears open. The latest Country Settings fix depended on selecting `India` in the New Camp Cluster form before asserting reflected checkbox state.

## Reporting Workflow

- Local and client-shareable reports are generated from `allure-results`.
- Shareable artifacts and report folders belong under `Result/`.
- Branded single-file Allure customization is handled by `scripts/customize-allure-report.js`.
- If a report needs correct suite grouping from existing result files, use `scripts/normalize-allure-suites.js` before generating the final artifact.
- Before generating a client-facing report, make sure `allure-results` contains:
  - `environment.properties`
  - `executor.json`
  - `categories.json`

## Conversion Commands

### Bootstrap scaffold from source AIQ structure

```bash
npm run scaffold:source-aiq
```

### Scaffold one module manually

```bash
npm run scaffold:module -- <ModuleName>
```

## Documentation

- [docs/conversion-framework.md](docs/conversion-framework.md)
  General conversion framework used by the team.
- [docs/team-project-setup-guide.md](docs/team-project-setup-guide.md)
  How to reuse this framework in another project.
- [docs/vision-spring-conversion-handoff.md](docs/vision-spring-conversion-handoff.md)
  Current Vision Spring-specific status, latest fixes, completed delta batches, and recommended next modules.

For teammate onboarding and AI agent overviews, start with `docs/vision-spring-conversion-handoff.md` first, then read this README for commands and structure.

## Notes For Future Work

- Treat this repo as a maintenance and regression-stability workflow for the current converted intake.
- If new AIQ deltas arrive under `source-aiq/TestScripts`, convert module-by-module using existing shared helper and selector surfaces first.
- For Reporting specifically, continue through shared `digiteyesreportingCommon.js` behavior rather than introducing module-specific one-off modal logic where the same fix can be centralized.
- Generated `Result/` artifacts should not be treated as source files for ongoing development work.
- Temporary audit files (for example `.tmp_*`) should be removed after decisions are captured in durable docs.
