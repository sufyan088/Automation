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
- Camp Server conversion coverage is now complete across login plus all 8 India station modules.
- `01_Camp_Server_India_Registration` is now fully converted at 24 helper-backed specs in `helpers/source-aiq2/campServerIndiaRegistration.js`.
- The Registration module was rerun clean at 24/24 and is implemented against the shared helper layer.
- `02_Camp_Server_India_Prescreening` is now fully converted at 8 helper-backed specs in `helpers/source-aiq2/campServerIndiaPrescreening.js` and `selectors/source-aiq2/campServerIndiaPrescreening.selectors.js`.
- The Prescreening module was rerun clean at 8/8 with `--workers=1` and is implemented against the shared helper layer.
- `03_Camp_Server_India_PreExam` is now fully converted at 9 helper-backed specs in `helpers/source-aiq2/campServerIndiaPreexam.js` and `selectors/source-aiq2/campServerIndiaPreexam.selectors.js`.
- The PreExam module was rerun clean at 9/9 with `--workers=1` and is implemented against the shared helper layer.
- `04_Camp_Server_India_Examination` is now fully converted at 16 helper-backed specs in `helpers/source-aiq2/campServerIndiaExamination.js` and `selectors/source-aiq2/campServerIndiaExamination.selectors.js`.
- The Examination module was rerun clean at 16/16 with `--workers=1` and is implemented against the shared helper layer.
- `06_Camp_Server_India_Dispense` is now fully converted at 10 helper-backed specs in `helpers/source-aiq2/campServerIndiaDispense.js` and `selectors/source-aiq2/campServerIndiaDispense.selectors.js`.
- The Dispense module was rerun clean at 10/10 with `--workers=1` and is implemented against the shared helper layer.
- `07_Camp_Server_India_Participants` is implemented through shared helper flows in `helpers/source-aiq2/campServerIndiaParticipants.js` with selectors in `selectors/source-aiq2/campServerIndiaParticipants.selectors.js`.
- The latest combined validation for `06_Camp_Server_India_Dispense` plus `07_Camp_Server_India_Participants` passed clean at 20/20 after hardening Participants station-action resolution against the live participant-detail DOM.
- `08_Camp_Server_India_Summary` is now fully converted at 4 helper-backed specs in `helpers/source-aiq2/campServerIndiaSummary.js` and `selectors/source-aiq2/campServerIndiaSummary.selectors.js`.
- The Summary module was rerun clean at 4/4 with `--workers=1` and is implemented against the shared helper layer.
- `05_Camp_Server_India_Opthalm` is also fully converted: all 3 scaffold specs were replaced with helper-backed Playwright flows in `helpers/source-aiq2/campServerIndiaOpthalm.js` and `selectors/source-aiq2/campServerIndiaOpthalm.selectors.js`.
- The latest Ophthalm-only rerun finished at 2/3: queue search and Pre-Screening carry-forward passed, while the Examination carry-forward case still fails on the live product state where Suspected Cataract remains unchecked in Ophthalm.
- The Registration helper-backed coverage also supports client-readable nested report steps for actions, values, and assertions.
- The current remaining Camp Server issue is therefore a product-side validation defect, not a missing conversion area.

## Reporting Workflow

- The preferred whole-track client-report command is `npm run report:camp-server:client`.
- `npm run report:camp-server:last-failed:client` reruns only the last failed Camp Server tests, merges those rerun results back into the prior `allure-results` baseline by test identity, and then regenerates the branded shareable report without inflating unchanged counts.
- The dedicated Registration client-report command is `npm run report:camp-server-registration:client`.
- Camp Server client-report flows run `scripts/normalize-allure-suites.js` before `allure generate`, so the Allure Suites card groups by Camp Server module rather than Playwright project metadata.
- Camp Server client-report flows also run `scripts/flatten-generic-allure-steps.js` before report generation. This removes the legacy generic `Run converted flow` wrapper from Allure result JSON and exposes the nested business steps directly in the Execution panel.
- Camp Server client-facing descriptions should contain only:
  - `Scenario: ...`
  - `Spec File: ...`
- `Source AIQ:` lines are stripped from Camp Server client-report results before report generation.
- If a report is generated outside the packaged Camp Server client-report scripts, rerun the same normalization, flattening, and description-sanitizing steps manually before `allure generate`.

### Current validated Camp Server modules

- `01_Camp_Server_India_Registration` currently represents the first fully converted Camp Server module baseline.
- `02_Camp_Server_India_Prescreening` is now the second fully converted Camp Server India station module baseline.
- `03_Camp_Server_India_PreExam` is now the third fully converted Camp Server India station module baseline.
- `04_Camp_Server_India_Examination` is now the fourth fully converted Camp Server India station module baseline.
- `05_Camp_Server_India_Opthalm` is now the fifth fully converted Camp Server India station module, with one remaining live product defect in Examination-to-Ophthalm carry-forward validation.
- `06_Camp_Server_India_Dispense` is now the sixth fully converted Camp Server India station module baseline.
- `07_Camp_Server_India_Participants` is now the seventh helper-backed Camp Server India station module with clean validation in the latest combined `06` + `07` rerun.
- `08_Camp_Server_India_Summary` is now the eighth helper-backed Camp Server India station module and passed clean at 4/4 in its latest dedicated rerun.
- All eight India station modules are implemented against the shared helper and selector layers; the remaining open item is Ophthalm product behavior, not conversion scope.

### Current validated Registration module

- `01_Camp_Server_India_Registration` currently represents the fully converted Camp Server module baseline.
- All 24 Registration specs are now implemented against the shared helper/selector layer.
- The latest dedicated module report artifact is `Result/digit-eyes-camp-server-registration.zip` with a single branded HTML report under `Result/allure-report-camp-server-registration-shareable/`.

### Current validated Prescreening module

- `02_Camp_Server_India_Prescreening` now has full source parity for the current intake at 8/8 helper-backed specs.
- The module uses the shared registration-created participant flow and keeps the business logic centralized in `helpers/source-aiq2/campServerIndiaPrescreening.js`.
- The latest clean validation baseline for Prescreening is a full module run at `--workers=1`.

### Current validated Examination module

- `04_Camp_Server_India_Examination` now has full source parity for the current intake at 16/16 helper-backed specs.
- The module keeps the multi-step Examination logic centralized in `helpers/source-aiq2/campServerIndiaExamination.js` with durable section and field targeting in `selectors/source-aiq2/campServerIndiaExamination.selectors.js`.
- The latest clean validation baseline for Examination is a full module run at `--workers=1`.

### Current validated Dispense module

- `06_Camp_Server_India_Dispense` now has full source parity for the current intake at 10/10 helper-backed specs.
- The module keeps the routed-participant bootstrap, taking/not-taking branches, and final frame-entry logic centralized in `helpers/source-aiq2/campServerIndiaDispense.js` with durable selectors in `selectors/source-aiq2/campServerIndiaDispense.selectors.js`.
- The latest clean validation baseline for Dispense is a full module run at `--workers=1`.

### Current validated Summary module

- `08_Camp_Server_India_Summary` now has full source parity for the current intake at 4/4 helper-backed specs.
- The module keeps dashboard-card checks, navbar color validation, registration no-phone validation, and Summary table assertions centralized in `helpers/source-aiq2/campServerIndiaSummary.js` with durable selectors in `selectors/source-aiq2/campServerIndiaSummary.selectors.js`.
- The latest clean validation baseline for Summary is a full module run at `--workers=1`.
- Durable Summary lesson: the live `Pop-in Dispensed` dashboard detail opens a participant table instead of echoing the `N Pop-in Dispensed` label in the modal body, so the helper should accept either the original label-text modal shape or the live table-detail shape after the stat is opened.

### Current Opthalm validation status

- `05_Camp_Server_India_Opthalm` now calls shared helper flows for queue search, Pre-Screening carry-forward checks, and Examination carry-forward checks.
- Current live validation baseline is a fresh clean module run at 2/3 with `--workers=1` and `allure-playwright`.
- The queue search case passes.
- The Pre-Screening carry-forward case passes.
- The Examination carry-forward case reaches Ophthalm and opens the participant, but the live Ophthalm page still shows `Suspected Cataract` unchecked even after it was selected in Examination. Treat that remaining failure as a product defect unless product-side evidence later disproves it.
- The latest dedicated Ophthalm client artifact is `Result/digit-eyes-camp-server-opthalm.zip` with the branded single-file report under `Result/allure-report-camp-server-opthalm-shareable/`.
- The current blocker is no longer test discovery, conversion coverage, or general setup. It is the product-side Examination-to-Ophthalm Cataract carry-forward behavior.

## Participants Lessons

### Shared flow structure now implemented

- The current Participants helper bootstrap is centralized in `helpers/source-aiq2/campServerIndiaParticipants.js` and reuses the shared Examination completion path before opening the participant from the Participants list.
- Thin specs now delegate to the shared helper for participant detail checks, project-code comparison, station-icon checks, unlock checks, and edit-navigation attempts.

### Project Code comparison needs normalization

- The live Camp Home page currently shows the project code with a trailing suffix like `ALI18SSINDIVP110CHIC [S2E]`.
- The participant-detail page currently shows the base project code without that suffix, for example `ALI18SSINDIVP110CHIC`.
- Durable comparison logic should therefore normalize the optional bracketed suffix before asserting equality between Home and Participant Details.

### Participant-detail station controls do not match the old AIQ expectation set

- The live participant-detail page currently shows `Unlock` for Pre-Screening, Pre Examination, and Examination.
- The same page currently shows `Edit` for Ophthalm and Dispense.
- The durable helper fix is to resolve station actions by nearby station text aliases and choose the nearest matching ancestor instead of assuming a stable wrapper container around each station block.
- This matters because generic `Edit` and `Unlock` buttons can otherwise drift into the Registration block or another station block when the participant-detail DOM is loose.

### Validation posture

- Participants list/header coverage, participant-detail rendering, station unlock flows, and Pre-Screening / Pre Examination / Examination navigation flows are implemented in the shared helper layer.
- The latest targeted rerun proved the previously failing Pre Examination and Examination navigation cases now pass after the shared helper hardening.
- The latest combined validation for `06_Camp_Server_India_Dispense` plus `07_Camp_Server_India_Participants` passed 20/20.

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
- The preferred runtime file is `data/source-aiq2/Digit_Eyes_Runtime_DPL.csv`, which was added as a clean runtime CSV to bypass the malformed imported intake file.
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

### Source-aligned success and validation branches

- The final Registration conversion set also hardened shared handling for success popup verification, participant-name verification, edit-participant redirection, and blocking invalid Aadhaar/ID-proof branches.
- Fixes were kept in `helpers/source-aiq2/campServerIndiaRegistration.js` and `selectors/source-aiq2/campServerIndiaRegistration.selectors.js` instead of patching individual specs.

### Runtime CSV lesson

- Prefer fixing the runtime intake at `data/source-aiq2/` instead of hardcoding values into the Registration helper.
- The current working pattern is to keep a clean runtime CSV in `data/source-aiq2/Digit_Eyes_Runtime_DPL.csv` and let `helpers/source-aiq2/dataLoader.js` prefer that file first.

### Client-readable report steps

- The validated Registration helper now emits nested `test.step()` entries with business-readable descriptions.
- Use that same pattern for future Camp Server conversions when the client needs to understand what values were entered, what button was clicked, or what assertion was verified.
- Keep those steps readable and explicit, for example:
  - what field was filled
  - what value was selected
  - what navigation action happened
  - what message or card was asserted

## Prescreening Lessons Already Proven

### Shared flow structure

- The working Prescreening conversion pattern is: create participant through the Registration helper, click Dashboard from the Registration success popup, open Pre-Screening from the navbar, then open the created participant from the list.
- Keep that cross-module setup in the shared Prescreening helper instead of duplicating the registration bootstrap in every spec.

### Mixed editable and mirrored vision fields

- The live Pre-Screening Visual Acuity table is not uniformly editable across both eyes.
- Some left-eye Near Vision fields are rendered as readonly mirrored inputs while the corresponding right-eye field remains the actual editable select.
- The durable rule is to inspect the live element type before driving it. If the field is a `select`, select the option. If it is a readonly mirrored `input`, assert its reflected value instead of forcing direct selection.

### Validation behavior differs from the source alert wording

- The AIQ source asserts user-visible messages like `DV Left Eye Unaided cannot be left blank.` and similar DV cases.
- In the current live runtime, the missing Distance Vision cases are enforced through native required-field blocking on the invalid DV control rather than a reusable toast that is easy to capture.
- The stable Playwright assertion is therefore: Finish is blocked, the invalid DV control fails browser validity, and the user remains on the Pre-Screening vision step.

### Success modal text in the live app

- The durable success confirmation after a clean Prescreening submission is the visible `#divExaSuccess` modal text `Please direct the Participant to the Pre Exam station.` followed by a `Close Message` button.
- Do not hardcode an older generic `Pre-Screening Updated Successfully!` string as the only success signal unless the live UI changes back and is revalidated.

### Pinhole and station-routing source alignment

- The converted happy path sets Pinhole test to `No` before Finish.
- The final station routing in the validated success path lands on the Pre-Exam direction dialog, so keep the success assertion aligned to that modal rather than assuming Examination routing.

## PreExam Lessons Already Proven

### Shared flow structure

- The working PreExam conversion pattern is: create participant through the Registration helper, complete Prescreening through the shared Prescreening helper, close the Prescreening success popup, open Pre Exam from the navbar, then open the created participant from the Pre Exam list.
- Keep that cross-module bootstrap inside `helpers/source-aiq2/campServerIndiaPreexam.js` instead of duplicating Registration and Prescreening setup in each spec.

### Diagnosis toggles and routing

- The Diagnosis step is the live `#step3` section and is reached by two `Next` clicks after opening the participant in Pre Exam.
- Durable checkbox targeting is by visible label text inside the Diagnosis table, not by fixed DOM index.
- The validated routing flows are: choose diagnosis values in `#step3`, choose `Examination` or `Dispense`, click `Finish`, then assert the `#divPreExaSuccess` modal text for the selected station.

### Validation behavior differs from the older AIQ alert expectation

- In the current live runtime, the empty-diagnosis case only surfaces the `Diagnosis cannot be left blank.` toast once a target station is selected first; finishing with both diagnosis and route blank does not produce the reusable toast asserted by the older AIQ script.
- In the current live runtime, selecting `Presbyopia` plus the parent `Other Eye Conditions` checkbox does not produce the older `Plese choose Other Issues` toast. The stable assertion is that submission remains blocked on the Diagnosis step with no success modal, and the dedicated `Other` checkbox still controls visibility of the `#de_exa_diagnosisoiothers` textbox.

### Clean validation baseline

- `03_Camp_Server_India_PreExam` now has full source parity for the current intake at 9/9 helper-backed specs.
- The latest clean validation baseline for PreExam is a full module run at `--workers=1`.

## Examination Lessons Already Proven

### Shared flow structure

- The working Examination conversion pattern is: create participant through the Registration helper, complete Prescreening through the shared Prescreening helper, complete PreExam through the shared PreExam helper, close the PreExam success popup, open Examination from the navbar, then open the created participant from the Examination list.
- Keep that cross-module bootstrap inside `helpers/source-aiq2/campServerIndiaExamination.js` instead of duplicating Registration, Prescreening, and PreExam setup in each spec.

### Multi-step section model

- The live Examination flow is implemented as section-based steps covering vision, right-eye prescription, left-eye prescription, diagnosis, IPD/color, glasses, and referral behavior.
- Durable targeting is by visible section container and label text, not by assuming every AIQ utility filename maps cleanly to a modern live DOM control.

### Validation behavior differs from the older AIQ alert expectation

- In the current live runtime, selecting the parent `Other Eye Conditions` checkbox without a follow-up issue should be asserted as blocked submission on the Diagnosis step rather than as a durable reusable toast capture.
- The stable Playwright assertion is: the page remains on the Diagnosis step, it does not advance to the next section, and no follow-up `Other` issue is selected.

### Step-7 live behavior

- The glasses step uses mutually exclusive radio behavior for `Need New Power` and `Accurate`; a stable assertion should verify that the controls are enabled and selectable, not that both remain checked at once.
- The `Normal (No refractive error)` path can end on the IPD step with a visible Finish action instead of always rendering a separate glasses-step Next path, so helpers should follow the live branch rather than forcing one static route.

### Finish handoff behavior into downstream stations

- The Examination `Finish` action does not always end on the older sanitization-confirmation branch.
- In the live routing path toward Dispense, the durable post-finish state can instead be the visible direction dialog telling the user to send the participant to the Dispense station, with a `Close Message` action.
- Shared completion helpers should therefore treat either post-finish state as valid when the source flow is routing into the next station, instead of overfitting to one fixed modal.

## Dispense Lessons Already Proven

### Shared flow structure

- The working Dispense conversion pattern is: create participant through the Registration helper, complete Prescreening through the shared Prescreening helper, complete PreExam through the shared PreExam helper, complete the shared Examination routing flow into Dispense, open Dispense from the navbar, then open the created participant from the Dispense queue.
- Keep that cross-module bootstrap inside `helpers/source-aiq2/campServerIndiaDispense.js` instead of duplicating Registration, Prescreening, PreExam, and Examination setup in each spec.

### Taking and Not Taking branch model

- The live Dispense flow is stable when modeled as a first-step branch between `Taking` and `Not Taking`, followed by either a multi-step Taking path or an immediate finishable Not Taking path.
- Durable assertions should target the actual branch controls that appear after the first-step choice: `Next` for Taking, `Finish` plus the Not Taking reason dropdown for Not Taking.

### Frame Type field can be visible but intentionally non-selectable

- In the current live runtime, the final Dispense step can render `Frame Type` as a visible select already fixed to `-NA-`, with the other options disabled.
- Helpers should not assume that a visible select is automatically actionable. The stable rule is to skip Frame Type selection unless the desired options are actually enabled.
- This matters for the `Taking Yes` and `Need New Power` happy paths, where the rest of the final frame details can still be completed successfully even when Frame Type is locked.

### Success signal and completion behavior

- The durable completion assertion for the validated Dispense flows is the visible success signal `Dispense Updated Successfully!` after `Finish`.
- The queue-return/navigation timing after Finish can vary, so shared success handling should tolerate the post-submit transition instead of assuming the queue table is instantly available on the same tick.

## Opthalm Lessons In Progress

### Shared flow structure now implemented

- The current Opthalm helper bootstrap is centralized in `helpers/source-aiq2/campServerIndiaOpthalm.js` and reuses shared Registration, Prescreening, PreExam, and Examination flows instead of duplicating setup inside specs.
- The queue/search case opens Opthalm from Dashboard and asserts the visible list headers `Participant ID`, `Participant Name`, `Contact No.`, and `Age` before searching by participant first name.

### Pre-Screening carry-forward nuance

- The live Pre-Screening visual-acuity step still shows the mixed control behavior already seen in module 02: some Near Vision values are driven by preset row buttons and some cells render mirrored textboxes.
- For the Opthalm setup path, the AIQ-aligned row quick-pick buttons (`6/6`, `N6`) are a better fit than forcing `selectOption` on every Near Vision field.

### Examination-to-Opthalm blocker still open

- The remaining Opthalm blocker is the Examination referral setup path, not the Opthalm queue/search page itself.
- Live debug on Apr 16, 2026 confirmed the failure reproduces in headed Playwright debug mode.
- The current next step is to finish aligning the Examination referral actions that should feed Opthalm, then rerun the two failing Opthalm detail specs against that shared setup.

### Clean validation baseline

- `04_Camp_Server_India_Examination` now has full source parity for the current intake at 16/16 helper-backed specs.
- The latest clean validation baseline for Examination is a full module run at `--workers=1`.

## Reporting Workflow

### Full Camp Server client report

- `npm run report:camp-server:client` runs the ordered Camp Server modules from `scripts/camp-server-modules.js`.
- It then:
  - generates `allure-results`
  - normalizes suite labels
  - creates a single-file Allure report
  - applies Mammoth branding
  - zips the result into `Result/digit-eyes-camp-server.zip`
- The runner now uses Windows-safe process launching instead of shell-based command dispatch, which prevents branding/generation failures when the workspace path contains spaces.

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

### Dedicated Registration client report

- `npm run report:camp-server-registration:client` is the dedicated client-report workflow for `01_Camp_Server_India_Registration`.
- It performs these steps in one script:
  - clean `allure-results`
  - write `environment.properties`, `executor.json`, and `categories.json`
  - run only the 24 Registration specs with `allure-playwright`
  - normalize Allure suite labels
  - enrich each result file with scenario/spec/source description text
  - generate a single-file report
  - apply Mammoth branding
  - sync the branded file to `Result/index.html`
  - zip the shareable report under `Result/`
- The runner also uses the Windows-safe launch pattern so branding is applied reliably on paths like `C:\vision spring`.

### Reporting caution

- Do not present the full Camp Server client report as fully converted coverage while Ophthalm still has a live product blocker and Participants/Summary still contain scaffold coverage.
- Registration-only reporting is still the only dedicated Camp Server client-report workflow currently scripted in the repo.
- Prescreening, PreExam, Examination, and Dispense are now fully converted and validated, but they do not yet have dedicated client-report runners analogous to Registration.
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