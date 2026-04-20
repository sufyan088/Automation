# Vision Spring DigitEYESCamp Cluster Handoff

This document captures the current working structure, test script description strategy, conversion rules, and reporting workflow for the DigitEYESCamp Cluster track in this repository.

DigitEYESCamp Cluster is the original `source-aiq/` web-app family and should be maintained separately from the Camp Server `source-aiq2/` track.

## Current Position

- Source-of-truth intake is under `source-aiq/TestScripts/DigitEYESCampsCluster/`.
- Runtime data intake is under `data/`.
- Scaffold generation is handled by `scripts/bootstrap-aiq-structure.js`.
- The generated Playwright track lives under:
  - `tests/DigitEYESCamp_Cluster/`
  - `helpers/`
  - `selectors/`
- Use this handoff as the durable DigitEYESCamp Cluster guide. Keep volatile daily rerun notes out of this file.

## Test Script Description Strategy

- Keep one Playwright module folder per AIQ module folder.
- Keep specs thin and business-readable.
- Use each module `_shared.js` file to centralize:
  - `loadRuntimeData`
  - `loginAsAdmin`
  - `closeSession`
  - module helper exports
  - module selector exports
- Keep real UI behavior in shared helpers under `helpers/`.
- Keep selector definitions in centralized selector files under `selectors/`.
- Register Allure suite hierarchy in every module `_shared.js` through `helpers/allureHierarchy.js`.
- Keep `closeSession(page)` as a no-op in Cluster `_shared.js` files to preserve shared-account stability across parallel workers.

## Intake Mapping

The current DigitEYESCampsCluster AIQ intake maps into the Playwright workspace as follows:

- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESCamps_DataForSalesforce`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESCamps_ManageCampsCluster`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/Participants`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESCamps_Participants`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_DataForSalesForce`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_ParticipantConsents`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderChangeLog`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderErrorCases`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderQueue`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/CampTrends`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_CampTrends`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/InternetAvailability`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_InternetAvailability`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_PopinAvailability`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/SummarySheetData`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_SummarySheetData`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportIPTeams`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_WorkReportIPTeams`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESReporting_WorkReportVSTeams`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESSettings_CountrySettings`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESSettings_DESalesforceFieldMapping`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESSettings_Hospitals`
- `source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/ImplementationPartners`
  -> `tests/DigitEYESCamp_Cluster/DigitEYESSettings_ImplementationPartners`

## Current Module Inventory

### Test folders

- `DigitEYESCamps_DataForSalesforce` contains 14 specs.
- `DigitEYESCamps_ManageCampsCluster` contains 63 specs.
- `DigitEYESCamps_Participants` contains 4 specs.
- `DigitEYESDataLoader_DataForSalesForce` contains 21 specs.
- `DigitEYESDataLoader_ParticipantConsents` contains 5 specs.
- `DigitEYESDataLoader_SFDataLoaderChangeLog` contains 6 specs.
- `DigitEYESDataLoader_SFDataLoaderErrorCases` contains 15 specs.
- `DigitEYESDataLoader_SFDataLoaderQueue` contains 21 specs.
- `DigitEYESReporting_CampTrends` contains 15 specs.
- `DigitEYESReporting_InternetAvailability` contains 9 specs.
- `DigitEYESReporting_PopinAvailability` contains 12 specs.
- `DigitEYESReporting_SummarySheetData` contains 5 specs.
- `DigitEYESReporting_WorkReportIPTeams` contains 18 specs.
- `DigitEYESReporting_WorkReportVSTeams` contains 18 specs.
- `DigitEYESSettings_CountrySettings` contains 8 specs.
- `DigitEYESSettings_DESalesforceFieldMapping` contains 5 specs.
- `DigitEYESSettings_Hospitals` contains 22 specs.
- `DigitEYESSettings_ImplementationPartners` contains 12 specs.

### Shared implementation files

- Core shared files:
  - `helpers/auth.js`
  - `helpers/dataLoader.js`
  - `helpers/actions.js`
  - `helpers/fallback.js`
  - `helpers/allureHierarchy.js`
  - `selectors/common.selectors.js`
- Camps helpers/selectors:
  - `helpers/digiteyescampsDataforsalesforce.js`
  - `helpers/digiteyescampsManagecampscluster.js`
  - `helpers/digiteyescampsParticipants.js`
  - `selectors/digiteyescampsDataforsalesforce.selectors.js`
  - `selectors/digiteyescampsManagecampscluster.selectors.js`
  - `selectors/digiteyescampsParticipants.selectors.js`
- Data Loader helpers/selectors:
  - `helpers/digiteyesdataloaderCommon.js`
  - `helpers/digiteyesdataloaderDataforsalesforce.js`
  - `helpers/digiteyesdataloaderParticipantconsents.js`
  - `helpers/digiteyesdataloaderSfdataloaderchangelog.js`
  - `helpers/digiteyesdataloaderSfdataloadererrorcases.js`
  - `helpers/digiteyesdataloaderSfdataloaderqueue.js`
  - `selectors/digiteyesdataloaderDataforsalesforce.selectors.js`
  - `selectors/digiteyesdataloaderParticipantconsents.selectors.js`
  - `selectors/digiteyesdataloaderSfdataloaderchangelog.selectors.js`
  - `selectors/digiteyesdataloaderSfdataloadererrorcases.selectors.js`
  - `selectors/digiteyesdataloaderSfdataloaderqueue.selectors.js`
- Reporting helpers/selectors:
  - `helpers/digiteyesreportingCommon.js`
  - `helpers/digiteyesreportingCamptrends.js`
  - `helpers/digiteyesreportingInternetavailability.js`
  - `helpers/digiteyesreportingPopinavailability.js`
  - `helpers/digiteyesreportingSummarysheetdata.js`
  - `helpers/digiteyesreportingWorkreportipteams.js`
  - `helpers/digiteyesreportingWorkreportvsteams.js`
  - `selectors/digiteyesreportingCamptrends.selectors.js`
  - `selectors/digiteyesreportingInternetavailability.selectors.js`
  - `selectors/digiteyesreportingPopinavailability.selectors.js`
  - `selectors/digiteyesreportingSummarysheetdata.selectors.js`
  - `selectors/digiteyesreportingWorkreportipteams.selectors.js`
  - `selectors/digiteyesreportingWorkreportvsteams.selectors.js`
- Settings helpers/selectors:
  - `helpers/digiteyessettingsCommon.js`
  - `helpers/digiteyessettingsCountrysettings.js`
  - `helpers/digiteyessettingsDesalesforcefieldmapping.js`
  - `helpers/digiteyessettingsHospitals.js`
  - `helpers/digiteyessettingsImplementationpartners.js`
  - `selectors/digiteyessettingsCountrysettings.selectors.js`
  - `selectors/digiteyessettingsDesalesforcefieldmapping.selectors.js`
  - `selectors/digiteyessettingsHospitals.selectors.js`
  - `selectors/digiteyessettingsImplementationpartners.selectors.js`

## Current Status

- The DigitEYESCamp Cluster track is fully represented across the current 18-module `source-aiq/TestScripts/DigitEYESCampsCluster` intake.
- Every Cluster module folder under `tests/DigitEYESCamp_Cluster/` has a local `_shared.js` bootstrap file.
- The track follows the same thin-spec/shared-helper strategy used across the repo, but it uses the original `helpers/auth.js` and `helpers/dataLoader.js` stack instead of the Camp Server `source-aiq2` helpers.
- The current validated baseline from the existing conversion handoff is:
  - DigitEYESCamps family clean at `--workers=3`
  - DigitEYESDataLoader family clean at `--workers=3`
  - DigitEYESReporting family clean at `--workers=3`
  - DigitEYESSettings family clean at `--workers=3`
- Treat new scripts arriving under `source-aiq/TestScripts/DigitEYESCampsCluster/` as future delta intake, not as missing baseline coverage.

## Reporting Workflow

- The preferred whole-track client-report command is `npm run report:camp-cluster:client`.
- The dedicated module client-report command currently maintained in-repo is `npm run report:camp-cluster-participants:client`.
- `npm run report:combined:client` remains available as the legacy alias for the same whole-track Cluster flow.
- The combined package shortcuts in `package.json` now run `npm run allure:normalize` before `allure generate`, so whole-track and portable combined reports keep proper module grouping in the Allure Suites card.
- Cluster client-facing Allure descriptions should contain only:
  - `Scenario: ...`
  - `Spec File: ...`
- `Source AIQ:` lines are stripped from Cluster client-report results before report generation.
- Cluster execution readability is helper-driven. The preferred fix is to add readable nested `test.step()` titles in shared helpers rather than relying on report-time post-processing.

### Current validated Cluster families

- `DigitEYESCamps_*` is fully helper-backed for the current intake.
- `DigitEYESDataLoader_*` is fully helper-backed for the current intake.
- `DigitEYESReporting_*` is fully helper-backed for the current intake.
- `DigitEYESSettings_*` is fully helper-backed for the current intake.

## Shared Logic To Reuse

### Cluster auth flow

- Use `helpers/auth.js` through each module `_shared.js`.
- The working login path is Microsoft username -> Microsoft password -> Stay signed in -> app Office 365 Sign In -> country picker -> module navigation.
- Do not duplicate login behavior inside individual specs.

### Cluster runtime data

- `helpers/dataLoader.js` resolves the default runtime CSV from `data/`.
- The preferred runtime file is `data/JS_DPL_Camp_Cluster.csv`.
- If the CSV is malformed, the loader falls back to environment/default values instead of failing immediately.

### Session handling

- Cluster `_shared.js` files use `closeSession(page)` as a no-op.
- Keep that behavior. Do not introduce real teardown logout into module `_shared.js` files.

### Helper-first conversion rule

- Keep Cluster specs thin.
- Put real UI behavior in `helpers/digiteyes*.js` and selectors in `selectors/digiteyes*.selectors.js`.
- If multiple specs fail for the same reason, fix the helper or selector layer first.

### Locator strategy

- Prefer candidate selector arrays plus `helpers/fallback.js`.
- `resolveFirst` should be treated as the default durable path when pages can leave hidden duplicate DOM nodes behind.
- For forms and search modals, prefer visible scoped selectors over naive first-match selectors.

### Source-alignment rule

- Read the source AIQ script before extending a helper.
- Reproduce the AIQ interaction order exactly when a default value or reflected setting depends on in-form initialization.
- Do not strengthen assertions beyond what the source verifies unless there is a clear product requirement.

### Allure suite grouping

- `helpers/allureHierarchy.js` stamps `parentSuite` and `suite` from the top-level module folder name.
- It is registered in every `tests/DigitEYESCamp_Cluster/*/_shared.js` via `test.beforeEach`.
- This is the durable grouping pattern for combined Allure reports.

## Module Lessons Worth Preserving

### ManageCampsCluster lessons

- The module is fully converted at 63 specs.
- Currency country-mapping coverage depends on the shared country-selection helper in `helpers/digiteyescampsManagecampscluster.js`, including Bangladesh, Ghana, Nigeria, Uganda, and Zambia in addition to India.
- Currency assertions should wait for a non-empty field value before asserting the expected code.
- Camp Cluster Settings checkbox flows should scope to the visible fieldset row to avoid hidden checkbox collisions.

### CountrySettings source-alignment lesson

- The reflected default checkbox cases depend on selecting the country inside the New Camp Cluster form before reading the checkbox state.
- Opening the form alone is not enough; reproduce the source sequence exactly.
- After assertions, navigate back cleanly so the open form does not block sidebar interactions.

### DataLoader lessons

- Preserve blank header columns when reading tables.
- Read direct visible cells instead of deep descendant text to avoid duplicate counts.
- For AIQ scripts that verify presence of matching cells, use minimum-occurrence assertions instead of equality assertions.
- Queue and Data for Salesforce search modals should scope Apply, Reset, and Close actions to the visible modal footer.

### Reporting lessons

- Keep shared Reporting behavior in `helpers/digiteyesreportingCommon.js`.
- Search filter helpers should tolerate hidden or delayed modals and retry until a visible `#frmSearch` is available.
- Apply actions should prefer the visible modal-footer button when generic selectors are intercepted.
- Header assertions should poll until table headers are populated.

## Recommended Workflow For Future Cluster Deltas

1. Compare the AIQ source folder against the Playwright module folder and identify exact missing script names first.
2. Read the existing module helper and selector files before editing specs.
3. Extend the shared helper and selectors first; keep specs thin.
4. Reuse the standard test shape:
   - login step
   - one business-readable verification step
   - no-op logout step
5. If a failure appears in more than one spec, fix helpers or selectors instead of adding spec-specific workarounds.
6. Run the module alone before widening to family-level execution.