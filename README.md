# Vision Spring Playwright Automation

This repository is the current AIQ-to-Playwright conversion project for the Vision Spring application. The active work in this repo is maintaining Vision Spring Playwright coverage with shared helpers, centralized selectors, fallback locator handling, and reusable Allure reporting workflows.

The repository currently has two main automation tracks for the same Vision Spring project:

- `DigitEYESCamp_Cluster` for the original `source-aiq` web-app intake and its multiple sub-modules across Camps, Data Loader, Reporting, and Settings.
- `DigitEYESCamp_Server` for the separate `source-aiq2` Camp Server intake and its multiple station sub-modules.

## Project Goal

Convert the Vision Spring AIQ automation assets under `source-aiq/` and `source-aiq2/` into maintainable Playwright coverage with:

- one Playwright module folder per AIQ module
- thin spec files with business-readable `test.step()` flow
- shared helper and selector layers
- centralized auth, fallback locator, and wait behavior
- reusable branded Allure reporting
- a pull-friendly handoff for ongoing maintenance and future AIQ delta intake

## Current Repository Structure

```text
package.json
package-lock.json
playwright.config.js
README.md

allure-results/
playwright-report/
test-results/
Result/
  generated reports and shareable artifacts

assets/
data/
docs/

helpers/
  actions.js
  allureHierarchy.js
  auth.js
  clientReadableSteps.js
  dataLoader.js
  fallback.js
  digiteyes* module helpers
  source-aiq2/ Camp Server helpers

selectors/
  common.selectors.js
  digiteyes* selector files
  source-aiq2/ Camp Server selector files

scripts/
  bootstrap-aiq-structure.js
  bootstrap-source-aiq2-structure.js
  camp-server-modules.js
  customize-allure-report.js
  flatten-generic-allure-steps.js
  normalize-allure-suites.js
  run-camp-cluster-participants-client-report.js
  run-camp-server-client-report.js
  run-camp-server-registration-client-report.js
  run-camp-server-sequence.js
  run-combined-client-report.js
  scaffold-module.js
  strip-source-aiq-from-allure-results.js

tests/
  DigitEYESCamp_Cluster/
    DigitEYESCamps_*/
    DigitEYESDataLoader_*/
    DigitEYESReporting_*/
    DigitEYESSettings_*/
  DigitEYESCamp_Server/

source-aiq/
  TestScripts/
  UtilityFunctions/

source-aiq2/
  Test Scripts/
  Utility Functions/
  Digit_Eyes_JS_DPL.csv
  Digit_Eyes_Synthetic_DPL.csv

data/
  JS_DPL_Camp_Cluster.csv
  source-aiq2/
```

## Current Module Inventory

The repo is organized around the two main Vision Spring tracks below.

### DigitEYESCamp Cluster

This track contains the original web-app families and their sub-modules:

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

### DigitEYES Camp Server

This track contains the Camp Server family and its station sub-modules:

- `Camp_Server_Login`
- `01_Camp_Server_India_Registration`
- `02_Camp_Server_India_Prescreening`
- `03_Camp_Server_India_PreExam`
- `04_Camp_Server_India_Examination`
- `05_Camp_Server_India_Opthalm`
- `06_Camp_Server_India_Dispense`
- `07_Camp_Server_India_Participants`
- `08_Camp_Server_India_Summary`

## Current Status

Conversion parity is complete for the current tracked DigitEYESCampsCluster intake (all 18 source module folders under `source-aiq/TestScripts/DigitEYESCampsCluster`).

- Shared auth, fallback locator handling, Allure hierarchy, and reporting customization are already in place.
- All four module families are validated clean at `--workers=3`.
- Any new AIQ scripts arriving under `source-aiq/TestScripts` are future delta conversions; use the recommended workflow in the handoff doc.
- Current run-level numbers are intentionally maintained in the handoff doc instead of README to keep this file stable.

Camp Server is a separate `source-aiq2` conversion track.

- The Camp Server scaffold is generated under `tests/DigitEYESCamp_Server/`, `helpers/source-aiq2/`, `selectors/source-aiq2/`, and `data/source-aiq2/`.
- Camp Server conversion coverage is now complete across login plus all 8 India modules.
- `01_Camp_Server_India_Registration` is now fully converted at 24 helper-backed specs.
- `02_Camp_Server_India_Prescreening` is now fully converted at 8 helper-backed specs and validated clean at 8/8 with `--workers=1`.
- `03_Camp_Server_India_PreExam` is now fully converted at 9 helper-backed specs and validated clean at 9/9 with `--workers=1`.
- `04_Camp_Server_India_Examination` is now fully converted at 16 helper-backed specs and validated clean at 16/16 with `--workers=1`.
- `06_Camp_Server_India_Dispense` is now fully converted at 10 helper-backed specs and validated clean at 10/10 with `--workers=1`.
- `07_Camp_Server_India_Participants` is now fully helper-backed at 10 specs, and the latest combined Participants plus Dispense validation passed clean at 20/20.
- `08_Camp_Server_India_Summary` is fully converted at 4 helper-backed specs and validated clean at 4/4 with `--workers=1`.
- `05_Camp_Server_India_Opthalm` is also converted and helper-backed, but its latest rerun finished at 2/3 because the live product does not carry `Suspected Cataract` into Ophthalm from Examination.
- A dedicated Registration client report flow now exists via `npm run report:camp-server-registration:client` and produces a Mammoth-branded single-file artifact under `Result/`.
- Cluster client-report flows normalize Allure suite labels before report generation and strip `Source AIQ:` lines so client-facing descriptions keep only `Scenario:` and `Spec File:`.
- Camp Server client-report flows normalize Allure suite labels, flatten the legacy generic `Run converted flow` wrapper step from result JSON, strip `Source AIQ:` lines, and then generate the Mammoth-branded portable artifact.
- The remaining Camp Server gap is not a conversion gap. It is the current product-side Ophthalm carry-forward defect documented in the Camp Server handoff.

For the most current module-by-module handoff and remaining conversion guidance:

- use [docs/vision-spring-camp-cluster-handoff.md](docs/vision-spring-camp-cluster-handoff.md) for the DigitEYESCampsCluster families
- use [docs/vision-spring-camp-server-handoff.md](docs/vision-spring-camp-server-handoff.md) for the `source-aiq2` Camp Server track
- use [docs/vision-spring-conversion-handoff.md](docs/vision-spring-conversion-handoff.md) for the older general conversion guidance and durable cross-family lessons

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
npx playwright test tests/DigitEYESCamp_Server/01_Camp_Server_India_Registration --workers=1
```

### Run one module

```bash
npx playwright test tests/DigitEYESReporting_CampTrends
npx playwright test tests/DigitEYESReporting_WorkReportVSTeams
npx playwright test tests/DigitEYESCamp_Server/01_Camp_Server_India_Registration --workers=1
npx playwright test tests/DigitEYESCamp_Server/02_Camp_Server_India_Prescreening --workers=1
npx playwright test tests/DigitEYESCamp_Server/03_Camp_Server_India_PreExam --workers=1
npx playwright test tests/DigitEYESCamp_Server/04_Camp_Server_India_Examination --workers=1
npx playwright test tests/DigitEYESCamp_Server/05_Camp_Server_India_Opthalm --workers=1
npx playwright test tests/DigitEYESCamp_Server/06_Camp_Server_India_Dispense --workers=1
```

### Camp Server shortcuts

```bash
npm run test:camp-server-login
npm run test:camp-server-registration
npm run test:camp-server-prescreening
npm run test:camp-server-preexam
npm run test:camp-server-examination
npm run test:camp-server-opthalm
npm run test:camp-server-dispense
npm run test:camp-server-participants
npm run test:camp-server-summary
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

## Reporting Workflow

Use the packaged client-report flows whenever the output is meant to be shared.

### DigitEYESCamp Cluster

- `npm run report:camp-cluster:client` is the preferred whole-track shareable report command.
- `npm run report:camp-cluster-participants:client` is the current dedicated module client-report command.
- `npm run report:combined:client` remains available as the legacy alias for the same whole-track Cluster flow.
- The combined package shortcuts in `package.json` now normalize suites before `allure generate`, so older combined-report entry points no longer leak a `chromium` Suites grouping.
- Cluster client-facing descriptions intentionally keep only `Scenario:` and `Spec File:`.
- Cluster execution readability is driven primarily from helper-layer nested `test.step()` titles rather than report-time step rewriting.

### DigitEYESCamp Server

- `npm run report:camp-server:client` is the preferred whole-track shareable report command.
- `npm run report:camp-server-registration:client` is the dedicated Registration client-report command.
- Camp Server client-report flows normalize suites before report generation so the Suites card groups by module instead of Playwright project metadata.
- Camp Server client-report flows also flatten the generic `Run converted flow` wrapper step from legacy result files so the Execution panel shows the nested business steps directly.
- Camp Server client-facing descriptions also keep only `Scenario:` and `Spec File:`.

### Ad hoc report generation

If you build a report outside the packaged client scripts, run the same result processing first:

```bash
node scripts/normalize-allure-suites.js
node scripts/flatten-generic-allure-steps.js   # Camp Server / legacy wrapper-step results only
node scripts/strip-source-aiq-from-allure-results.js
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

### Camp Server data and authentication

- Camp Server runtime data is loaded through `helpers/source-aiq2/dataLoader.js`.
- Camp Server intake lives under `source-aiq2/`, and the runtime CSV search path defaults to `data/source-aiq2/*.csv`.
- The default runtime CSV preference is now `data/source-aiq2/Digit_Eyes_Runtime_DPL.csv`, which avoids the malformed imported intake CSV and keeps Camp Server runs off hardcoded fallback defaults.
- The loader supports environment overrides such as `SOURCE_AIQ2_DATA_FILE`, `SOURCE_AIQ2_BASE_URL`, `SOURCE_AIQ2_USERNAME`, `SOURCE_AIQ2_PASSWORD`, `SOURCE_AIQ2_PERSON_NAME`, and the participant/address field overrides used by the Registration helper.
- If the `data/source-aiq2/*.csv` file is malformed, the loader logs a fallback message and uses environment/default values.
- Camp Server auth is separate from the Microsoft web-app flow. The current logic in `helpers/source-aiq2/auth.js` goes directly to `server.php`, supports the `Run as Station` flow, extracts the on-page camp password when needed, fills `emailid`, `personname`, and `password`, and then waits for `#navbars`.
- Camp Server module `_shared.js` files also use a no-op `closeSession(page)` for consistency and to avoid teardown side effects.
- The current Prescreening module is helper-backed in `helpers/source-aiq2/campServerIndiaPrescreening.js` and uses the same thin-spec pattern as Registration.
- Prescreening live-form lesson: some left-eye Near Vision fields are readonly mirrored inputs in the runtime UI, so helper logic must drive the editable right-eye control and assert the mirrored value instead of forcing direct selection on every field.
- Prescreening validation lesson: the missing Distance Vision cases block submission through native required-field behavior on the invalid control rather than a reusable toast message, so assertions should target submission blocking and invalid field state instead of overfitting to a toast.
- Prescreening success lesson: the durable client-visible completion dialog currently says `Please direct the Participant to the Pre Exam station.` in the visible `#divExaSuccess` modal after Finish.
- Examination validation lesson: in the current live runtime, the `Other Eye Conditions` parent checkbox path is most stable when asserted as blocked submission on the Diagnosis step instead of overfitting to the short-lived top-right toast from the older AIQ expectation.

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

### Camp Server reporting

- `npm run report:camp-server:client` runs the ordered Camp Server module sequence from `scripts/camp-server-modules.js`, generates a single-file Allure report, applies Mammoth branding, and packages it under `Result/`.
- `npm run report:camp-server-registration:client` runs only `tests/DigitEYESCamp_Server/01_Camp_Server_India_Registration`, enriches Allure descriptions from the converted spec/source mapping, generates a single-file Mammoth-branded report, syncs `Result/index.html`, and packages the shareable zip under `Result/`.
- The Camp Server report runners now use Windows-safe command launching for `npx` and branding steps, which avoids path-splitting failures in workspace paths such as `C:\vision spring`.
- For other targeted Camp Server client artifacts, rerun only the intended spec batch with `--reporter=allure-playwright`, add `environment.properties`, `executor.json`, and `categories.json`, run `scripts/normalize-allure-suites.js`, then generate and brand the single-file report.
- Do not present a full Camp Server client report as complete converted coverage unless the included specs are actually implemented; non-converted placeholder specs are scaffolds, not finished automation.

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
  Current DigitEYESCampsCluster-specific status, latest fixes, completed delta batches, and recommended next modules.
- [docs/vision-spring-camp-server-handoff.md](docs/vision-spring-camp-server-handoff.md)
  Current Camp Server-specific intake mapping, helper architecture, partial conversion status, reporting workflow, and next conversion guidance.

For teammate onboarding and AI agent overviews, start with the family-specific handoff doc that matches the active track, then read this README for commands and structure.

## Notes For Future Work

- Treat this repo as a maintenance and regression-stability workflow for the current converted intake.
- If new AIQ deltas arrive under `source-aiq/TestScripts`, convert module-by-module using existing shared helper and selector surfaces first.
- For Reporting specifically, continue through shared `digiteyesreportingCommon.js` behavior rather than introducing module-specific one-off modal logic where the same fix can be centralized.
- Generated `Result/` artifacts should not be treated as source files for ongoing development work.
- Temporary audit files (for example `.tmp_*`) should be removed after decisions are captured in durable docs.
