# Vision Spring Conversion Handoff

This document captures the latest working conversion logic for this repository so ongoing maintenance and any future AIQ deltas can be handled after pulling the project without depending on chat memory.

## Current Position

- Source-of-truth intake is under source-aiq/TestScripts.
- Treat this handoff as a durable implementation guide, not a live scoreboard.
- Keep volatile counts, pass ratios, and day-to-day execution snapshots in commit messages or PR descriptions.
- Use this file to preserve shared patterns, conversion rules, and lessons that prevent repeated failures.
- Previously tracked module-gap deltas in this continuation wave were completed and validated; use this file for stable reuse rules and future delta handling.

## Latest Validated Baseline (Apr 13, 2026)

- DigitEYESDataLoader_DataForSalesForce: full parity validated.
- DigitEYESDataLoader_SFDataLoaderErrorCases: full parity validated.
- DigitEYESDataLoader_SFDataLoaderQueue: full parity validated.
- DigitEYESCamps_DataForSalesforce: full parity validated.
- DigitEYESDataLoader_ParticipantConsents: full parity validated.
- DigitEYESDataLoader_SFDataLoaderChangeLog: full parity validated.
- DigitEYESCamps_Participants: full parity validated.
- No previously tracked module-gap deltas remain in this wave; new conversion work should be treated as future AIQ intake deltas.

## Shared Logic To Reuse

### Auth and session handling

- Use helpers/auth.js through each module _shared.js. Do not duplicate login logic per module.
- The working login path is Microsoft username -> Microsoft password -> Stay signed in -> app Office 365 Sign In -> country picker -> module navigation.
- closeSession(page) is intentionally a no-op in module _shared.js files to avoid shared-account logout collisions across workers.

### Locator strategy

- Prefer candidate selector arrays plus helpers/fallback.js.
- resolveFirst now checks multiple matched elements instead of assuming the first match is the correct visible one.
- If a page leaves duplicate hidden fields in the DOM after modal interactions, prefer visible form-scoped selectors first.

### Source-alignment rule

- When an AIQ script verifies defaults inside a form, compare the converted helper flow against the source step-for-step before assuming the assertion is wrong.
- In Vision Spring, default values can be initialized only after an explicit in-form selection step. The Country Settings reflection tests proved that opening New Camp Cluster was not enough; the source also selected India before reading the checkbox state.
- If a converted flow uses a direct page jump to shortcut navigation, verify that the source did not rely on menu-driven or form-driven initialization before keeping the shortcut.

### Reporting helper rules

- Keep shared Reporting behavior in helpers/digiteyesreportingCommon.js instead of patching individual specs.
- openSearchFilter must tolerate hidden or delayed modals and retry against a visible #frmSearch.
- applySearch should prefer the visible modal footer Apply button when generic candidates are intercepted.
- Header assertions should poll briefly until table headers are populated.

## Reporting Module Lessons

### Camp Trends

- Shared implementation files:
  - helpers/digiteyesreportingCamptrends.js
  - selectors/digiteyesreportingCamptrends.selectors.js
- Live-validated defaults used for conversion:
  - Country defaults to India.
  - Theme defaults to -- All Themes --.
  - Payer defaults to -- Select Payer --.
  - Date From and Date To default empty.
- Reliable behavior used for assertions:
  - Applying payer Ajmer Sharif changes the chart and preserves the selected payer when the filter is reopened.
  - Chart legend toggles can be verified by canvas image change instead of brittle text assumptions.
### Work Report VS Teams

- Shared implementation files:
  - helpers/digiteyesreportingWorkreportvsteams.js
  - selectors/digiteyesreportingWorkreportvsteams.selectors.js
- Live-validated defaults used for conversion:
  - Country defaults to India.
  - Project Code, Assistant Manager, User Email, Outreach Incharge, Date From, and Date To default empty.
- Live-validated headers used for assertions:
  - Top headers: Reg. Date, Camp Ref., Location, Outreach Incharge, Asst. Manager, #Regs.
  - Registration section headers: Email ID, #Camps, #Participant.
- Important regression lesson:
  - After Apply, the page can leave hidden duplicate filter inputs in the DOM.
  - Fix this with visible form-scoped selectors in selectors/digiteyesreportingWorkreportvsteams.selectors.js.
  - For date-only AIQ cases, do not add a reopen-and-reassert step after Apply if the source script only verifies set-and-apply behavior.
## Recommended Conversion Workflow For Future Deltas

1. Compare the source AIQ folder to the converted tests folder and identify the exact missing script names first.
2. Read the existing module helper and selector files before adding specs.
3. Extend the shared module helper and selectors first; keep spec files thin.
4. Reuse the existing test pattern:
   - login step
   - one business-readable verification step
   - no-op logout step
5. If a failure pattern appears in more than one spec, fix helpers or selectors instead of spec-by-spec workarounds.
6. After adding a batch, run the module alone before widening to family runs.

## Practical Rules For Future Conversions

- Prefer real page defaults and live-validated behavior over guessed assertions.
- For AIQ scripts that only verify field functionality, it is enough to verify fill/select plus Apply or Reset behavior. Do not invent stronger assertions than the source requires.
- For tables with grouped headers, assert the expected header labels are present rather than depending on exact layout positions unless the AIQ case truly requires position.
- For search modals, always assume hidden duplicate nodes may remain in the DOM after Apply, Reset, or Close.
- For reflected-default tests, reproduce the source form initialization sequence exactly, including intermediate selections such as country, before reading field state.

## Reporting Status

- Reporting source parity is complete across Camp Trends, Internet Availability, Popin Availability, Summary Sheet Data, Work Report IP Teams, and Work Report VS Teams.
- If Reporting is rerun as a full family and a failure appears, treat auth/session timing first as a shared-layer issue before assuming a missing conversion.
- Keep exact pass/fail numbers out of this file to reduce maintenance churn.

## Parallel Execution Stability

### Shared-account no-op logout rule

- `closeSession(page)` must be a **no-op** in every module `_shared.js`.
- Real UI logout invalidates the shared Mammoth account session for sibling workers and causes cascading auth failures.
- This rule applies to all families (Camps, DataLoader, Reporting, Settings).
- Do not reintroduce UI logout as a teardown even if auth failures reappear; instead investigate auth state detection in `helpers/auth.js`.

### Parallel safety confirmed

- All four families have been validated clean at `--workers=3`:
  - DigitEYESCamps (49 specs)
  - DigitEYESDataLoader (42 specs)
  - DigitEYESReporting (34 specs)
  - DigitEYESSettings (20 specs)
- Use `--workers=3` as the default parallel setting for module-scoped runs and family runs.
- For final client report generation, `--workers=1` is always safe if stability concerns arise.

### Reporting-specific parallel hardening (helpers layer)

- `helpers/fallback.js` resolveFirst checks multiple matched elements instead of assuming first hidden match is correct.
- `helpers/digiteyesreportingCommon.js` openSearchFilter retries until `#frmSearch` is visible.
- Apply preferentially targets visible modal footer buttons.
- Table header assertions briefly poll until headers are populated.

## Allure Suite Grouping

### allureHierarchy.js

- `helpers/allureHierarchy.js` stamps `parentSuite` and `suite` from the top-level module folder name.
- It is registered in every `tests/*/_shared.js` via `test.beforeEach`.
- This enables whole-project runs to group results by the 18 module folders in the Allure Suites card.

### normalize-allure-suites.js (retroactive fix)

- Use `node scripts/normalize-allure-suites.js` to rewrite allure-results `*-result.json` files before report generation.
- Required when existing result files still carry Playwright's default `chromium` parentSuite label, which collapses the Suites card to 1 entry.
- Run before calling `scripts/customize-allure-report.js` when generating a full-project combined report.

## ManageCampsCluster Specific Lessons

- The module is fully converted at 63 specs.
- Currency country-mapping specs (TC_30–TC_34 for BDT, GHS, NGN, KES, ZMW) required extending the shared country-selection helper in `helpers/digiteyescampsManagecampscluster.js` to support Bangladesh, Ghana, Nigeria, Uganda, and Zambia in addition to India.
- Currency assertion stabilization: wait for a non-empty currency field before asserting the expected currency code.
- Checkbox locator strategy for TC_19: scope inside the Camp Cluster Settings fieldset, resolve the row by visible label fallback (e.g., Revised Adult Screening Protocol or Ask Blood Pressure), then toggle only the visible checkbox in that row to avoid hidden or duplicate checkbox collisions.

## CountrySettings Source-Alignment Lesson

- TC_05 through TC_08 verify reflected checkbox defaults for the selected country.
- The AIQ source selects India *inside* the New Camp Cluster form before reading the checkbox state.
- The converted helper must reproduce that in-form country selection before asserting defaults; skipping it causes false failures.
- After asserting defaults, navigate back to Settings to avoid the open-form overlay blocking sidebar clicks.

## DataLoader Module Specific Lessons

### Table parsing conventions (helpers/digiteyesdataloaderCommon.js)

- Preserve blank header columns when reading table headers; do not strip them.
- Read direct cell children instead of descendant matches to avoid double-counting nested content.
- Use visible-row filtering for row counts and table assertions.
- Scope Data for Salesforce modal controls to the visible modal footer.

### AIQ semantic assertions

- Several AIQ scripts verify presence of repeated matching cells, not that every visible row equals the same value.
- Use `expectColumnValueOccurrenceAtLeast` for those cases instead of `expectColumnValuesEqual`.
- Applies to DataForSalesForce and Queue status/sync-pending columns.

### Queue specifics

- TC_3: assert that Ref values are populated numeric identifiers, not globally unique across the full dataset.
- Pending/Marked/All apply handling is centralized in the Queue helper.

### ErrorCases specifics

- Assignment filter controls in live UI data can diverge from source assumptions.
- Validate against a captured page snapshot and assert stable assignment-column semantics (DEO/Super DEO pattern) after Apply.

## Full Project Parity Milestone (Apr 13, 2026)

- All 18 source module folders under `source-aiq/TestScripts/DigitEYESCampsCluster` are represented under `tests/` with full source parity.
- No testcase gaps remain from the previously tracked delta intake.
- Full project run produced 145 specs; all four families are clean at `--workers=3` in module-scoped runs.
- New AIQ intake arriving under `source-aiq/TestScripts` after this date should be treated as future delta conversions using the standard recommended workflow below.
