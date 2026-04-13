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
