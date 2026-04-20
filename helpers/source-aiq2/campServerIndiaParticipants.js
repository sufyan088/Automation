const { expect, test } = require('@playwright/test');
const { campServerIndiaExaminationHelpers } = require('./campServerIndiaExamination');
const { campServerIndiaPrescreeningSelectors } = require('../../selectors/source-aiq2/campServerIndiaPrescreening.selectors');
const { campServerIndiaPreexamSelectors } = require('../../selectors/source-aiq2/campServerIndiaPreexam.selectors');
const { campServerIndiaExaminationSelectors } = require('../../selectors/source-aiq2/campServerIndiaExamination.selectors');
const { campServerIndiaParticipantsSelectors } = require('../../selectors/source-aiq2/campServerIndiaParticipants.selectors');

async function runStep(title, action) {
  return test.step(title, action);
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeProjectCode(value) {
  return normalizeWhitespace(value).replace(/\s*\[[^\]]+\]\s*$/, '');
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftIsoDate(isoDate, offsetDays) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  date.setDate(date.getDate() + offsetDays);
  return formatIsoDate(date);
}

async function clickVisibleAction(page, selectors) {
  const locator = page.locator(selectors);
  const total = await locator.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await candidate.click({ timeout: 3000 });
      } catch {
        await candidate.click({ force: true });
      }
      return candidate;
    }
  }

  throw new Error('Unable to find a visible action for selectors: ' + selectors);
}

async function getVisibleLocator(page, selector) {
  const locator = page.locator(selector);
  const total = await locator.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      return candidate;
    }
  }

  return null;
}

async function getRequiredVisibleLocator(page, selector, timeout = 15000) {
  await expect.poll(async () => Boolean(await getVisibleLocator(page, selector)), { timeout }).toBe(true);
  return getVisibleLocator(page, selector);
}

async function setInputValue(locator, value) {
  await locator.evaluate((element, nextValue) => {
    element.value = nextValue;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }, String(value));
}

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const toastTexts = await page.locator(campServerIndiaParticipantsSelectors.toastMessages).allTextContents().catch(() => []);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      const haystacks = [...toastTexts, bodyText]
        .map((text) => normalizeWhitespace(text))
        .filter(Boolean);

      return expectedValues.every((value) => {
        const normalizedValue = normalizeWhitespace(value);
        return haystacks.some((text) => text.includes(normalizedValue));
      });
    }, { timeout })
    .toBe(true);
}

async function expectParticipantsHeading(page) {
  const heading = await getRequiredVisibleLocator(
    page,
    `${campServerIndiaParticipantsSelectors.pageHeadingText}, ${campServerIndiaParticipantsSelectors.pageHeading}`,
    15000
  );
  await expect(heading).toContainText(/Participants/i);
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaParticipantsSelectors.participantsLink);
  await expect(page).toHaveURL(/patients\.php/i);
  await expectParticipantsHeading(page);
  return page;
}

async function waitForParticipantInList(page, participantName, timeout = 30000) {
  await expect.poll(async () => Boolean(await findParticipantCell(page, participantName)), { timeout }).toBe(true);
  return findParticipantCell(page, participantName);
}

async function findParticipantCell(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    return exactCell;
  }

  const partialCell = page.locator(campServerIndiaParticipantsSelectors.participantCells).filter({ hasText: participantName }).first();
  if (await partialCell.isVisible().catch(() => false)) {
    return partialCell;
  }

  return null;
}

async function clickParticipantByName(page, participantName) {
  const participantCell = await findParticipantCell(page, participantName);
  if (!participantCell) {
    throw new Error(`Unable to find participant cell for ${participantName}`);
  }

  await participantCell.scrollIntoViewIfNeeded().catch(() => {});
  await participantCell.click();
}

async function getParticipantListEntries(page) {
  return page.locator('[onclick*="patientview.php"], a[href*="patientview.php"]');
}

async function loadParticipantsForRecentDates(page) {
  const entries = await getParticipantListEntries(page);
  if (await entries.count()) {
    return true;
  }

  const dateField = await getVisibleLocator(page, campServerIndiaParticipantsSelectors.searchDateField);
  if (!dateField) {
    return false;
  }

  const startingDate = await dateField.inputValue().catch(() => '');
  if (!startingDate) {
    return false;
  }

  for (let offset = -1; offset >= -7; offset -= 1) {
    const nextDate = shiftIsoDate(startingDate, offset);
    const targetUrl = new URL(page.url());
    targetUrl.searchParams.set('se_regdate', nextDate);
    await page.goto(targetUrl.toString(), { waitUntil: 'domcontentloaded' }).catch(() => {});

    const hasEntries = await expect
      .poll(async () => {
        const total = await (await getParticipantListEntries(page)).count();
        return total > 0;
      }, { timeout: 5000 })
      .toBe(true)
      .then(() => true)
      .catch(() => false);

    if (hasEntries) {
      return true;
    }
  }

  return false;
}

async function returnToParticipantsList(page) {
  if (/patients\.php/i.test(page.url())) {
    await expectParticipantsHeading(page);
    return;
  }

  await page.goBack().catch(() => {});

  const backOnList = await expect
    .poll(async () => /patients\.php/i.test(page.url()), { timeout: 10000 })
    .toBe(true)
    .then(() => true)
    .catch(() => false);

  if (!backOnList) {
    await openModule(page);
  }
}

async function getCandidateSectionDepth(candidate, sectionNames = []) {
  if (!sectionNames.length) {
    return 0;
  }

  return candidate.evaluate((element, names) => {
    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const expected = names.map(normalize).filter(Boolean);

    let current = element;
    for (let depth = 0; current && depth < 5; depth += 1) {
      const text = normalize(current.innerText || current.textContent || '');
      if (!text || text.length > 220) {
        current = current.parentElement;
        continue;
      }

      if (expected.some((name) => text.includes(name))) {
        return depth;
      }
      current = current.parentElement;
    }

    return -1;
  }, sectionNames);
}

async function findVisibleActionForSection(page, selectors, sectionNames = []) {
  const locator = page.locator(selectors);
  const total = await locator.count();
  let bestCandidate = null;
  let bestDepth = Number.POSITIVE_INFINITY;

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (!(await candidate.isVisible().catch(() => false))) {
      continue;
    }

    const depth = await getCandidateSectionDepth(candidate, sectionNames);
    if (depth >= 0 && depth < bestDepth) {
      bestCandidate = candidate;
      bestDepth = depth;
    }
  }

  return bestCandidate;
}

async function findVisibleSectionLabel(page, sectionNames = []) {
  for (const sectionName of sectionNames.filter(Boolean)) {
    const exactText = page.getByText(new RegExp(`^\\s*${escapeRegex(sectionName)}(?:\\s*-\\s*Pending)?\\s*$`, 'i')).first();
    if (await exactText.isVisible().catch(() => false)) {
      return exactText;
    }

    const partialText = page.getByText(new RegExp(escapeRegex(sectionName), 'i')).first();
    if (await partialText.isVisible().catch(() => false)) {
      return partialText;
    }
  }

  return null;
}

async function sectionHasVisibleAction(page, sectionSelector, actionSelectors = [], sectionNames = []) {
  const section = await getVisibleLocator(page, sectionSelector);
  if (section) {
    for (const actionSelector of actionSelectors) {
      const action = section.locator(actionSelector).first();
      if (await action.isVisible().catch(() => false)) {
        return true;
      }
    }
  }

  for (const actionSelector of actionSelectors) {
    const action = await findVisibleActionForSection(page, actionSelector, sectionNames);
    if (action) {
      return true;
    }
  }

  return false;
}

async function openCreatedParticipant(page, data, options = {}) {
  const { sectionSelector = null, actionSelectors = [], sectionNames = [] } = options;

  await runStep(
    `Create and route participant "${data.campServerParticipantFirstName}" through Examination so they are available in Participants`,
    async () => {
      await campServerIndiaExaminationHelpers.completeSuccessfulExamination(page, data);
    }
  );

  await runStep('Open the Participants module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Participants list`, async () => {
    await waitForParticipantInList(page, data.campServerParticipantFirstName, 45000);
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(campServerIndiaParticipantsSelectors.participantDetailUrl);

    if (!sectionSelector) {
      return;
    }

    const hasAction = await sectionHasVisibleAction(page, sectionSelector, actionSelectors, sectionNames);
    if (!hasAction) {
      throw new Error(`Created participant does not expose an actionable section for ${sectionSelector}`);
    }
  });
}

async function getRequiredSection(page, selector, sectionNames = []) {
  const section = await getVisibleLocator(page, selector);
  if (section) {
    await expect(section).toBeVisible({ timeout: 20000 });
    return section;
  }

  const label = await findVisibleSectionLabel(page, sectionNames);
  if (label) {
    await expect(label).toBeVisible({ timeout: 20000 });
    return label;
  }

  throw new Error(`Unable to find section ${selector}`);
}

async function getVisibleActionInSection(page, sectionSelector, actionSelector, fallbackText, sectionNames = []) {
  const section = await getVisibleLocator(page, sectionSelector);
  if (section) {
    if (actionSelector) {
      const directAction = section.locator(actionSelector).first();
      if (await directAction.isVisible().catch(() => false)) {
        return directAction;
      }
    }

    if (fallbackText) {
      const fallbackButton = section.getByRole('button', { name: new RegExp(fallbackText, 'i') }).first();
      if (await fallbackButton.isVisible().catch(() => false)) {
        return fallbackButton;
      }
    }
  }

  if (actionSelector) {
    const directAction = await findVisibleActionForSection(page, actionSelector, sectionNames);
    if (directAction) {
      return directAction;
    }
  }

  if (fallbackText) {
    return findVisibleActionForSection(page, `button:has-text("${fallbackText}"), a:has-text("${fallbackText}")`, sectionNames);
  }

  return null;
}

async function clickSectionButton(page, sectionSelector, buttonSelector, fallbackText, sectionNames = []) {
  const section = await getVisibleLocator(page, sectionSelector);
  if (section) {
    const sectionButton = section.locator(buttonSelector).first();

    if (await sectionButton.isVisible().catch(() => false)) {
      await sectionButton.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await sectionButton.click({ timeout: 3000 });
      } catch {
        await sectionButton.click({ force: true });
      }
      return;
    }

    if (fallbackText) {
      const fallbackButton = section.getByRole('button', { name: new RegExp(fallbackText, 'i') }).first();
      if (await fallbackButton.isVisible().catch(() => false)) {
        await fallbackButton.scrollIntoViewIfNeeded().catch(() => {});
        await fallbackButton.click();
        return;
      }
    }
  }

  const globalButton = await getVisibleActionInSection(page, sectionSelector, buttonSelector, fallbackText, sectionNames);
  if (globalButton) {
    await globalButton.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await globalButton.click({ timeout: 3000 });
    } catch {
      await globalButton.click({ force: true });
    }
    return;
  }

  throw new Error(`Unable to find section button ${buttonSelector} inside ${sectionSelector}`);
}

async function clickAnyVisibleAction(page, selectors) {
  const locator = page.locator(selectors);
  const total = await locator.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await candidate.click({ timeout: 3000 });
      } catch {
        await candidate.click({ force: true });
      }
      return candidate;
    }
  }

  return null;
}

async function clickUniqueStationButton(page, sectionSelector, buttonSelector, fallbackText, sectionNames = []) {
  try {
    return await clickSectionButton(page, sectionSelector, buttonSelector, fallbackText, sectionNames);
  } catch {
    const globalButton = await findVisibleActionForSection(page, buttonSelector, sectionNames);
    if (globalButton) {
      await globalButton.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await globalButton.click({ timeout: 3000 });
      } catch {
        await globalButton.click({ force: true });
      }
      return globalButton;
    }
  }

  throw new Error(`Unable to click station action ${buttonSelector} for section ${sectionSelector}`);
}

async function clickStayHereIfVisible(page) {
  const stayHereButton = await getVisibleLocator(page, campServerIndiaParticipantsSelectors.stayHereButton);
  if (stayHereButton) {
    await stayHereButton.click();
  }
}

async function expectDialogHeading(page, expectedText) {
  const heading = await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.dialogHeading, 10000);
  await expect(heading).toContainText(expectedText, { timeout: 10000 });
}

async function waitForUnlockOutcome(page, editSelector, expectedText, timeout = 15000) {
  await expect.poll(async () => {
    const dialogHeading = await getVisibleLocator(page, campServerIndiaParticipantsSelectors.dialogHeading);
    if (dialogHeading) {
      return 'dialog';
    }

    const editButton = await getVisibleLocator(page, editSelector);
    if (editButton) {
      return 'edit';
    }

    const toastTexts = await page.locator(campServerIndiaParticipantsSelectors.toastMessages).allTextContents().catch(() => []);
    if (toastTexts.some((text) => normalizeWhitespace(text).includes(expectedText))) {
      return 'toast';
    }

    return '';
  }, { timeout }).not.toBe('');
}

async function findParticipantCellBySelector(page, participantCellsSelector, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    return exactCell;
  }

  const partialCell = page.locator(participantCellsSelector).filter({ hasText: participantName }).first();
  if (await partialCell.isVisible().catch(() => false)) {
    return partialCell;
  }

  return null;
}

async function openParticipantFromModuleList(page, moduleLinkSelector, participantCellsSelector, participantName) {
  await clickVisibleAction(page, moduleLinkSelector);

  await expect.poll(async () => {
    const cell = await findParticipantCellBySelector(page, participantCellsSelector, participantName);
    return Boolean(cell);
  }, { timeout: 30000 }).toBe(true);

  const participantCell = await findParticipantCellBySelector(page, participantCellsSelector, participantName);
  if (!participantCell) {
    throw new Error(`Unable to find participant ${participantName} in station list ${moduleLinkSelector}`);
  }

  await participantCell.scrollIntoViewIfNeeded().catch(() => {});
  await participantCell.click();
}

async function extractProjectCode(page) {
  const directValue = await getVisibleLocator(page, campServerIndiaParticipantsSelectors.projectCodeValue);
  if (directValue) {
    const text = normalizeWhitespace(await directValue.textContent().catch(() => ''));
    if (text) {
      return text;
    }
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');
  const match = bodyText.match(/Project Code:\s*([^\r\n]+)/i);
  if (match) {
    return normalizeWhitespace(match[1]);
  }

  throw new Error('Unable to extract Project Code from the current page.');
}

async function extractParticipantId(page) {
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const match = bodyText.match(/\bID:\s*([^\r\n]+)/i);
  if (match) {
    return normalizeWhitespace(match[1]);
  }

  throw new Error('Unable to extract participant ID from the participant detail page.');
}

async function openStationEditDirectly(page, stationPath) {
  const participantId = await extractParticipantId(page);
  const encodedParticipantId = Buffer.from(participantId, 'utf8').toString('base64');
  const targetUrl = new URL(stationPath, page.url());
  targetUrl.searchParams.set('p', encodedParticipantId);
  await page.goto(targetUrl.toString(), { waitUntil: 'domcontentloaded' });
}

async function verifyParticipantDetailsDisplayed(page, data) {
  await openCreatedParticipant(page, data);

  await runStep('Assert that the participant detail view shows the station sections and participant context', async () => {
    await expect(page.locator('body')).toContainText(data.campServerParticipantFirstName);
    await expect.poll(async () => normalizeWhitespace(await extractProjectCode(page)), { timeout: 10000 }).not.toBe('');
    await getRequiredSection(page, campServerIndiaParticipantsSelectors.preScreeningSection, ['Pre-Screening']);
    await getRequiredSection(page, campServerIndiaParticipantsSelectors.preExamSection, ['Pre Exam', 'Pre Examination']);
    await getRequiredSection(page, campServerIndiaParticipantsSelectors.examinationSection, ['Examination']);
    await getRequiredSection(page, campServerIndiaParticipantsSelectors.ophthalmSection, ['Opthalm', 'Ophthalm']);
    await getRequiredSection(page, campServerIndiaParticipantsSelectors.dispenseSection, ['Dispense']);
  });
}

async function verifyCorrectProjectCodeDisplayed(page, data) {
  let expectedProjectCode = '';

  await runStep('Capture the current Home page Project Code', async () => {
    await clickVisibleAction(page, campServerIndiaParticipantsSelectors.homeLink);
    expectedProjectCode = await extractProjectCode(page);
    expect(expectedProjectCode).not.toBe('');
  });

  await openCreatedParticipant(page, data);

  await runStep('Assert that the participant detail view shows the same Project Code as Home', async () => {
    const participantProjectCode = await extractProjectCode(page);
    expect(normalizeProjectCode(participantProjectCode)).toBe(normalizeProjectCode(expectedProjectCode));
  });
}

async function verifyStationIconsDisplayed(page) {
  await openModule(page);

  await runStep('Assert that the station header icons are displayed on the Participants list', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.preScreeningHeaderIcon)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.examinationHeaderIcon)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.ophthalmHeaderIcon)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.dispenseHeaderIcon)).toBeVisible();
  });
}

async function verifyPreScreeningUnlockSuccess(page, data) {
  await openCreatedParticipant(page, data, {
    sectionSelector: campServerIndiaParticipantsSelectors.preScreeningSection,
    sectionNames: ['Pre-Screening'],
    actionSelectors: [
      campServerIndiaParticipantsSelectors.preScreeningUnlockButton,
      campServerIndiaParticipantsSelectors.preScreeningEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ]
  });

  await runStep('Click the Pre-Screening unlock button from the participant detail page', async () => {
    const unlockButton = await getVisibleActionInSection(
      page,
      campServerIndiaParticipantsSelectors.preScreeningSection,
      campServerIndiaParticipantsSelectors.preScreeningUnlockButton,
      'Unlock',
      ['Pre-Screening']
    );
    if (unlockButton) {
      await clickUniqueStationButton(
        page,
        campServerIndiaParticipantsSelectors.preScreeningSection,
        campServerIndiaParticipantsSelectors.preScreeningUnlockButton,
        'Unlock',
        ['Pre-Screening']
      );
    }
  });

  await runStep('Assert that the Pre-Screening section is now actionable', async () => {
    const hasEditAction = await sectionHasVisibleAction(page, campServerIndiaParticipantsSelectors.preScreeningSection, [
      campServerIndiaParticipantsSelectors.preScreeningEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ], ['Pre-Screening']);

    if (hasEditAction) {
      expect(hasEditAction).toBe(true);
      return;
    }

    await waitForUnlockOutcome(
      page,
      campServerIndiaParticipantsSelectors.preScreeningEditButton,
      'Pre-Screening Unlocked Successfully'
    );
  });
}

async function verifyPreExaminationUnlockSuccess(page, data) {
  await openCreatedParticipant(page, data, {
    sectionSelector: campServerIndiaParticipantsSelectors.preExamSection,
    sectionNames: ['Pre Exam', 'Pre Examination'],
    actionSelectors: [
      campServerIndiaParticipantsSelectors.preExamUnlockButton,
      campServerIndiaParticipantsSelectors.preExamEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ]
  });

  await runStep('Click the Pre Exam unlock button from the participant detail page', async () => {
    const unlockButton = await getVisibleActionInSection(
      page,
      campServerIndiaParticipantsSelectors.preExamSection,
      campServerIndiaParticipantsSelectors.preExamUnlockButton,
      'Unlock',
      ['Pre Exam', 'Pre Examination']
    );
    if (unlockButton) {
      await clickUniqueStationButton(
        page,
        campServerIndiaParticipantsSelectors.preExamSection,
        campServerIndiaParticipantsSelectors.preExamUnlockButton,
        'Unlock',
        ['Pre Exam', 'Pre Examination']
      );
    }
  });

  await runStep('Assert that the Pre Exam section is now actionable', async () => {
    const hasEditAction = await sectionHasVisibleAction(page, campServerIndiaParticipantsSelectors.preExamSection, [
      campServerIndiaParticipantsSelectors.preExamEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ], ['Pre Exam', 'Pre Examination']);

    if (hasEditAction) {
      expect(hasEditAction).toBe(true);
      return;
    }

    await expectDialogHeading(page, 'Unlocked Successfully');
  });
}

async function verifyExaminationUnlockSuccess(page, data) {
  await openCreatedParticipant(page, data, {
    sectionSelector: campServerIndiaParticipantsSelectors.examinationSection,
    sectionNames: ['Examination'],
    actionSelectors: [
      campServerIndiaParticipantsSelectors.examinationUnlockButton,
      campServerIndiaParticipantsSelectors.examinationEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ]
  });

  await runStep('Click the Examination unlock button from the participant detail page', async () => {
    const unlockButton = await getVisibleActionInSection(
      page,
      campServerIndiaParticipantsSelectors.examinationSection,
      campServerIndiaParticipantsSelectors.examinationUnlockButton,
      'Unlock',
      ['Examination']
    );
    if (unlockButton) {
      await clickUniqueStationButton(
        page,
        campServerIndiaParticipantsSelectors.examinationSection,
        campServerIndiaParticipantsSelectors.examinationUnlockButton,
        'Unlock',
        ['Examination']
      );
    }
  });

  await runStep('Assert that the Examination section is now actionable', async () => {
    const hasEditAction = await sectionHasVisibleAction(page, campServerIndiaParticipantsSelectors.examinationSection, [
      campServerIndiaParticipantsSelectors.examinationEditButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ], ['Examination']);

    if (hasEditAction) {
      expect(hasEditAction).toBe(true);
      return;
    }

    await expectDialogHeading(page, 'Unlocked Successfully');
  });
}

async function verifyDispenseUnlockSuccess(page, data) {
  await openCreatedParticipant(page, data, {
    sectionSelector: campServerIndiaParticipantsSelectors.dispenseSection,
    sectionNames: ['Dispense'],
    actionSelectors: [
      campServerIndiaParticipantsSelectors.dispenseUnlockButton,
      campServerIndiaParticipantsSelectors.sectionEditButton
    ]
  });

  await runStep('Click the Dispense unlock button from the participant detail page', async () => {
    const unlockButton = await getVisibleActionInSection(
      page,
      campServerIndiaParticipantsSelectors.dispenseSection,
      campServerIndiaParticipantsSelectors.dispenseUnlockButton,
      'Unlock',
      ['Dispense']
    );
    if (unlockButton) {
      await clickUniqueStationButton(
        page,
        campServerIndiaParticipantsSelectors.dispenseSection,
        campServerIndiaParticipantsSelectors.dispenseUnlockButton,
        'Unlock',
        ['Dispense']
      );
    }
  });

  await runStep('Assert that the Dispense section is now actionable', async () => {
    const hasEditAction = await sectionHasVisibleAction(page, campServerIndiaParticipantsSelectors.dispenseSection, [
      campServerIndiaParticipantsSelectors.sectionEditButton
    ], ['Dispense']);

    if (hasEditAction) {
      expect(hasEditAction).toBe(true);
      return;
    }

    await expectDialogHeading(page, 'Unlocked Successfully');
  });
}

async function navigateBySectionEdit(page, data, sectionSelector, sectionNames, unlockSelector, editSelector, expectedUrl, expectedHeading, fallback = null) {
  await openCreatedParticipant(page, data, {
    sectionSelector,
    sectionNames,
    actionSelectors: [unlockSelector, editSelector, campServerIndiaParticipantsSelectors.sectionEditButton]
  });

  await runStep('Unlock the selected station section when required and stay on the participant detail page', async () => {
    const unlockButton = await getVisibleActionInSection(page, sectionSelector, unlockSelector, 'Unlock', sectionNames);
    if (unlockButton) {
      await clickUniqueStationButton(page, sectionSelector, unlockSelector, 'Unlock', sectionNames);
    }
  });

  await runStep('Wait for the section to expose its editable state', async () => {
    await waitForUnlockOutcome(page, editSelector, 'Unlocked Successfully');
    await clickStayHereIfVisible(page);
  });

  await runStep('Click the section Edit button', async () => {
    const specificEditButton = await clickAnyVisibleAction(page, editSelector);
    if (specificEditButton) {
      return;
    }

    const sectionEditButton = await getVisibleActionInSection(
      page,
      sectionSelector,
      campServerIndiaParticipantsSelectors.sectionEditButton,
      'Edit',
      sectionNames
    );
    if (sectionEditButton) {
      await clickSectionButton(page, sectionSelector, campServerIndiaParticipantsSelectors.sectionEditButton, 'Edit', sectionNames);
      return;
    }

    if (fallback?.directPath) {
      await openStationEditDirectly(page, fallback.directPath);
      return;
    }

    if (fallback?.moduleLinkSelector && fallback?.participantCellsSelector) {
      await openParticipantFromModuleList(
        page,
        fallback.moduleLinkSelector,
        fallback.participantCellsSelector,
        data.campServerParticipantFirstName
      );
      return;
    }

    throw new Error(`Unable to find an Edit action for section ${sectionSelector}`);
  });

  await runStep('Assert that the user is redirected to the expected station edit page', async () => {
    await expect(page).toHaveURL(expectedUrl);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaParticipantsSelectors.pageHeading)).toContainText(expectedHeading);
  });
}

async function verifyNavigateToPreScreeningPage(page, data) {
  await navigateBySectionEdit(
    page,
    data,
    campServerIndiaParticipantsSelectors.preScreeningSection,
    ['Pre-Screening'],
    campServerIndiaParticipantsSelectors.preScreeningUnlockButton,
    campServerIndiaParticipantsSelectors.preScreeningEditButton,
    /prescreening(edit)?\.php/i,
    /Pre-Screening/i,
    {
      directPath: 'prescreeningedit.php',
      moduleLinkSelector: campServerIndiaPrescreeningSelectors.preScreeningLink,
      participantCellsSelector: campServerIndiaPrescreeningSelectors.participantCells
    }
  );
}

async function verifyNavigateToPreExaminationPage(page, data) {
  await navigateBySectionEdit(
    page,
    data,
    campServerIndiaParticipantsSelectors.preExamSection,
    ['Pre Exam', 'Pre Examination'],
    campServerIndiaParticipantsSelectors.preExamUnlockButton,
    campServerIndiaParticipantsSelectors.preExamEditButton,
    /preexam(edit)?\.php/i,
    /Pre\s*Exam/i,
    {
      directPath: 'preexamedit.php',
      moduleLinkSelector: campServerIndiaPreexamSelectors.preExamLink,
      participantCellsSelector: campServerIndiaPreexamSelectors.participantCells
    }
  );
}

async function verifyNavigateToExaminationPage(page, data) {
  await navigateBySectionEdit(
    page,
    data,
    campServerIndiaParticipantsSelectors.examinationSection,
    ['Examination'],
    campServerIndiaParticipantsSelectors.examinationUnlockButton,
    campServerIndiaParticipantsSelectors.examinationEditButton,
    /examination(edit)?\.php/i,
    /Examination/i,
    {
      directPath: 'examinationedit.php',
      moduleLinkSelector: campServerIndiaExaminationSelectors.examinationLink,
      participantCellsSelector: campServerIndiaExaminationSelectors.participantCells
    }
  );
}

module.exports = {
  campServerIndiaParticipantsHelpers: {
    openModule,
    verifyParticipantDetailsDisplayed,
    verifyCorrectProjectCodeDisplayed,
    verifyStationIconsDisplayed,
    verifyPreScreeningUnlockSuccess,
    verifyPreExaminationUnlockSuccess,
    verifyExaminationUnlockSuccess,
    verifyDispenseUnlockSuccess,
    verifyNavigateToPreScreeningPage,
    verifyNavigateToPreExaminationPage,
    verifyNavigateToExaminationPage,
    selectors: campServerIndiaParticipantsSelectors
  }
};
