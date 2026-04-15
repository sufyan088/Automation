# Vision Spring Camp Server Handoff

This document captures the current working structure, conversion rules, and reporting workflow for the Camp Server track in this repository.

Camp Server is not part of the original `source-aiq/TestScripts/DigitEYESCampsCluster` web-app family. It is a separate intake under `source-aiq2/` and should be maintained as its own conversion stream.

## Current Position

- Source-of-truth intake is under `source-aiq2/Test Scripts/Camp Server/`.
- Runtime data intake is under `data/source-aiq2/`.
- Scaffold generation is handled by `scripts/bootstrap-source-aiq2-structure.js`.
- The generated Playwright track lives under:
  - `tests/DigitEYESCamp_Server/`
  - `helpers/source-aiq2/`
  - `selectors/source-aiq2/`
- Use this handoff as the durable Camp Server guide. Keep volatile daily run snapshots out of this file.

## Intake Mapping

The current source-aiq2 Camp Server intake maps into the Playwright workspace as follows:

- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration`
  -> `tests/DigitEYESCamp_Server/01_Camp_Server_India_Registration`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Prescreening`
  -> `tests/DigitEYESCamp_Server/02_Camp_Server_India_Prescreening`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/PreExam`
  -> `tests/DigitEYESCamp_Server/03_Camp_Server_India_PreExam`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Examination`
  -> `tests/DigitEYESCamp_Server/04_Camp_Server_India_Examination`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Opthalm`
  -> `tests/DigitEYESCamp_Server/05_Camp_Server_India_Opthalm`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Dispense`
  -> `tests/DigitEYESCamp_Server/06_Camp_Server_India_Dispense`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Participants`
  -> `tests/DigitEYESCamp_Server/07_Camp_Server_India_Participants`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Summary`
  -> `tests/DigitEYESCamp_Server/08_Camp_Server_India_Summary`
- `source-aiq2/Test Scripts/Camp Server/Camp_Server_Login`
  -> `tests/DigitEYESCamp_Server/Camp_Server_Login`

## Current Module Inventory

### Test folders

- `Camp_Server_Login` contains 1 spec.
- `01_Camp_Server_India_Registration` contains 24 specs.
- `02_Camp_Server_India_Prescreening` contains 8 specs.
- `03_Camp_Server_India_PreExam` contains 9 specs.
- `04_Camp_Server_India_Examination` contains 16 specs.
- `05_Camp_Server_India_Opthalm` contains 3 specs.
- `06_Camp_Server_India_Dispense` contains 10 specs.
- `07_Camp_Server_India_Participants` contains 10 specs.
- `08_Camp_Server_India_Summary` contains 4 specs.

### Shared implementation files

- `helpers/source-aiq2/auth.js`
- `helpers/source-aiq2/dataLoader.js`
- `helpers/source-aiq2/campServerLogin.js`
- `helpers/source-aiq2/campServerIndiaRegistration.js`
- `helpers/source-aiq2/campServerIndiaPrescreening.js`
- `helpers/source-aiq2/campServerIndiaPreexam.js`
- `helpers/source-aiq2/campServerIndiaExamination.js`
- `helpers/source-aiq2/campServerIndiaOpthalm.js`
- `helpers/source-aiq2/campServerIndiaDispense.js`
- `helpers/source-aiq2/campServerIndiaParticipants.js`
- `helpers/source-aiq2/campServerIndiaSummary.js`

## Current Status

- The Camp Server scaffold is complete across login plus the 8 India station modules.
- The current track is **partial conversion**, not full source parity.
- Most Camp Server specs are still scaffolds with a placeholder `Run converted flow` step.
- The currently validated converted batch is the first 5 Registration specs backed by real helper logic in `helpers/source-aiq2/campServerIndiaRegistration.js`.
- Those 5 specs were rerun successfully and also support client-readable nested report steps for actions, values, and assertions.

### Current validated Registration batch

- `To_Verifty_That_User_Is_Successfully_Log_Out_From_The_Camp_Server_Upon_Clicking_On_The_Logout_Button.spec.js`
- `To_Verify_That_Alert_Message_Should_Be_Displayed_By_Entering_Invalid_Driving_License_Number.spec.js`
- `To_Verify_That_Alert_Message_Should_Be_Displayed_When_Age_Is_Greater_Than_110_While_Registration.spec.js`
- `To_Verify_That_Alert_Message_Should_Be_Displayed_When_Participant_First_Name_Text_Field_Is_Empty.spec.js`
- `To_Verify_That_All_Stations_Should_Be_Displayed_According_To_The_Camp_Cluster_When_User_Redirects_To_Camp_Server_Dashboard.spec.js`

## Shared Logic To Reuse

### Camp Server auth flow

- Camp Server auth is separate from the Microsoft web-app flow used by the DigitEYESCampsCluster families.
- `helpers/source-aiq2/auth.js` goes directly to the Camp Server URL and normalizes it to `server.php`.
- The helper supports two entry shapes:
  - direct login fields visible immediately
  - `Run as Station` button first, followed by a station login form
- When the `Run as Station` page shows `Camp Password: ...`, the helper extracts that password from the page and uses it for login.
- Successful login is treated as the `#navbars` container becoming visible.

### Camp Server runtime data

- `helpers/source-aiq2/dataLoader.js` resolves the default runtime CSV from `data/source-aiq2/`.
- If the CSV is malformed, the loader logs a fallback message and uses environment/default values instead of failing immediately.
- Supported environment overrides include:
  - `SOURCE_AIQ2_DATA_FILE`
  - `SOURCE_AIQ2_BASE_URL`
  - `SOURCE_AIQ2_USERNAME`
  - `SOURCE_AIQ2_PASSWORD`
  - `SOURCE_AIQ2_PERSON_NAME`
  - participant and address-field overrides used by Registration helpers

### Session handling

- Camp Server `_shared.js` files use `closeSession(page)` as a no-op.
- Keep that behavior. Do not introduce real teardown logout from `_shared.js` unless the track has a proven need and isolated credentials.

### Helper-first conversion rule

- Keep Camp Server specs thin.
- Put real UI behavior in `helpers/source-aiq2/*.js` and selectors in `selectors/source-aiq2/*.selectors.js`.
- If multiple specs in the same station fail for the same reason, fix the helper or selector layer first.

### Source-alignment rule

- Read the AIQ test script and relevant utility DS files before implementing the helper.
- Camp Server Registration already demonstrated that live step numbering and source utility numbering can drift.
- When that happens, follow the source interaction order while tolerating the current live UI shape in the helper.

## Registration Lessons Already Proven

### Invalid driving license validation

- The working fix lives in `helpers/source-aiq2/campServerIndiaRegistration.js`.
- The main rule is to keep the Registration flow source-aligned instead of relying on generic step inference.
- The live app shows a short-lived top-right toast for invalid driving license length.
- Reliable capture required submitting the final step with `noWaitAfter` and checking the toast immediately.

### Hidden duplicate DOM nodes

- Registration pages can leave hidden duplicate fields and controls in the DOM.
- Prefer visible-locator resolution over direct first-match targeting.
- This mattered for secondary contact fields, address controls, and Department entry.

### Client-readable report steps

- The validated Registration helper now emits nested `test.step()` entries with business-readable descriptions.
- Use that same pattern for future Camp Server conversions when the client needs to understand what values were entered, what button was clicked, or what assertion was verified.
- Keep those steps readable and explicit, for example:
  - what field was filled
  - what value was selected
  - what navigation action happened
  - what message or card was asserted

## Reporting Workflow

### Full Camp Server client report

- `npm run report:camp-server:client` runs the ordered Camp Server modules from `scripts/camp-server-modules.js`.
- It then:
  - generates `allure-results`
  - normalizes suite labels
  - creates a single-file Allure report
  - applies Mammoth branding
  - zips the result into `Result/digit-eyes-camp-server.zip`

### Targeted Camp Server report

- For a specific spec batch, rerun only those specs with `--reporter=allure-playwright`.
- Add:
  - `allure-results/environment.properties`
  - `allure-results/executor.json`
  - `allure-results/categories.json`
- Run `node scripts/normalize-allure-suites.js`.
- Generate a single-file report with `npx allure generate allure-results --clean --single-file -o <target>`.
- Apply Mammoth branding with `node scripts/customize-allure-report.js <target>`.
- Place the shareable folder and zip under `Result/`.

### Reporting caution

- Do not present a full Camp Server client report as fully converted coverage while most specs are still placeholders.
- Placeholder specs can still produce an Allure result, but they are not equivalent to completed automation.

## Recommended Workflow For Next Camp Server Conversions

1. Compare the source DS folder to the target Playwright folder and identify which specs are still scaffolds.
2. Read the source AIQ test script first.
3. Read the utility DS files used by that script before implementing the helper.
4. Extend the station helper and selector files first.
5. Keep the spec file thin:
   - login
   - one business-readable verification step
   - no-op logout
6. Add nested helper-driven `test.step()` entries if the client report needs readable actions and assertions.
7. Run the smallest targeted batch first.
8. Generate client-facing reports only from clean targeted reruns or clearly-scoped intended module runs.

## Practical Rules For Ongoing Camp Server Work

- Treat `source-aiq2` as a separate family with separate helper surfaces.
- Do not reuse `helpers/auth.js` or `helpers/dataLoader.js` from the DigitEYESCampsCluster track for Camp Server behavior.
- Keep all Camp Server-specific logic under `helpers/source-aiq2/` and `selectors/source-aiq2/`.
- Prefer source alignment over guessed UI shortcuts.
- If a spec still contains `Run converted flow`, treat it as a scaffold, not finished conversion.
- Keep durable Camp Server lessons here so future continuation does not depend on chat memory.