const { expect, test } = require('@playwright/test');
const { campServerIndiaRegistrationHelpers } = require('./campServerIndiaRegistration');
const { campServerIndiaRegistrationSelectors } = require('../../selectors/source-aiq2/campServerIndiaRegistration.selectors');
const { campServerIndiaPrescreeningSelectors } = require('../../selectors/source-aiq2/campServerIndiaPrescreening.selectors');

async function runStep(title, action) {
  return test.step(title, action);
}

async function clickVisibleAction(page, selectors) {
  const locator = page.locator(selectors);
  const total = await locator.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      try {
        await candidate.click({ timeout: 3000 });
        return candidate;
      } catch {
        if (await candidate.isVisible().catch(() => false)) {
          await candidate.click({ force: true });
          return candidate;
        }
      }
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

async function setSelectValue(locator, value) {
  const optionLocator = locator.locator('option');
  const optionCount = await optionLocator.count();

  for (let index = 0; index < optionCount; index += 1) {
    const option = optionLocator.nth(index);
    const optionLabel = (await option.textContent().catch(() => '') || '').trim();
    const optionValue = (await option.getAttribute('value').catch(() => '') || '').trim();

    if (optionLabel === value || optionValue === value) {
      await locator.selectOption(optionValue || { label: optionLabel });
      return;
    }
  }

  await locator.selectOption({ label: value });
}

async function getElementTagName(locator) {
  return locator.evaluate((element) => element.tagName.toLowerCase());
}

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const toastTexts = await page.locator(campServerIndiaPrescreeningSelectors.toastMessages).allTextContents();
      const normalizedToastTexts = toastTexts.map((text) => text.trim()).filter(Boolean);

      if (normalizedToastTexts.length) {
        return normalizedToastTexts;
      }

      const pageText = await page.locator('body').innerText().catch(() => '');
      return expectedValues.filter((value) => pageText.includes(value));
    }, { timeout })
    .toEqual(expect.arrayContaining(expectedValues));
}

async function expectNativeInvalidField(page, selector) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);

  await expect
    .poll(async () => field.evaluate((element) => !element.checkValidity()), { timeout: 10000 })
    .toBe(true);

  const validationMessage = await field.evaluate((element) => element.validationMessage || '');
  if (!validationMessage.trim()) {
    await expect(field).toHaveValue('', { timeout: 5000 });
  }

  await expect(page.locator(campServerIndiaPrescreeningSelectors.successDialog).first()).not.toBeVisible({ timeout: 1000 });
}

async function expectPreScreeningHeading(page) {
  await expect(await getRequiredVisibleLocator(page, campServerIndiaPrescreeningSelectors.pageHeading)).toContainText('Pre-Screening');
}

async function clickParticipantByName(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    await exactCell.click();
    return;
  }

  const partialCell = page
    .locator(campServerIndiaPrescreeningSelectors.participantCells)
    .filter({ hasText: participantName })
    .first();

  await expect(partialCell).toBeVisible({ timeout: 15000 });
  await partialCell.click();
}

async function clickRadioOptionForRow(page, rowPattern, optionText) {
  const row = page.locator('tr').filter({ hasText: rowPattern }).first();
  if (await row.isVisible().catch(() => false)) {
    const rowOption = row.getByText(optionText, { exact: true }).first();
    if (await rowOption.isVisible().catch(() => false)) {
      await rowOption.click();
      return;
    }
  }

  const container = page.locator('section#step2, form').filter({ hasText: rowPattern }).first();
  if (await container.isVisible().catch(() => false)) {
    const fallbackOption = container.getByText(optionText, { exact: true }).first();
    if (await fallbackOption.isVisible().catch(() => false)) {
      await fallbackOption.click();
      return;
    }
  }

  throw new Error(`Unable to click option "${optionText}" for row ${rowPattern}`);
}

async function createRegisteredParticipant(page, data) {
  await campServerIndiaRegistrationHelpers.verifySuccessPopupMessage(page, data);
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.preScreeningLink);
  await expectPreScreeningHeading(page);
  await expect(page).toHaveURL(/prescreening\.php/i);
  return page;
}

async function openCreatedParticipantForPrescreening(page, data) {
  await runStep(`Register participant "${data.campServerParticipantFirstName}" from the Camp Server Registration module`, async () => {
    await createRegisteredParticipant(page, data);
  });

  await runStep('Open Dashboard from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successDashboardButton);
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
  });

  await runStep('Open the Pre-Screening module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Pre-Screening list`, async () => {
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/prescreening(edit)?\.php/i);
    await expectPreScreeningHeading(page);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.complaintsSection)).toBeVisible({ timeout: 15000 });
  });
}

async function clickNoComplaints(page) {
  await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.noComplaintsButton);
}

async function clickNext(page) {
  await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.nextButton);
}

async function clickFinish(page) {
  await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.finishButton);
}

async function selectVisionValue(page, selector, value) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);
  const tagName = await getElementTagName(field);

  if (tagName === 'select') {
    await setSelectValue(field, value);
    await expect
      .poll(async () => field.locator('option:checked').textContent().catch(() => ''))
      .toContain(value);
    return;
  }

  await expect(field).toHaveValue(value, { timeout: 10000 });
}

async function fillVisionStep(page, overrides = {}) {
  const values = {
    distanceVisionRightUnaided: '6/5',
    distanceVisionLeftUnaided: '6/5',
    distanceVisionRightGlasses: '6/12',
    distanceVisionLeftGlasses: '6/12',
    nearVisionRightUnaided: 'N8',
    nearVisionLeftUnaided: 'N8',
    nearVisionRightGlasses: 'N12',
    nearVisionLeftGlasses: 'N12',
    ...overrides
  };

  const fieldMap = [
    ['distanceVisionRightUnaided', campServerIndiaPrescreeningSelectors.distanceVisionRightUnaided],
    ['distanceVisionLeftUnaided', campServerIndiaPrescreeningSelectors.distanceVisionLeftUnaided],
    ['distanceVisionRightGlasses', campServerIndiaPrescreeningSelectors.distanceVisionRightGlasses],
    ['distanceVisionLeftGlasses', campServerIndiaPrescreeningSelectors.distanceVisionLeftGlasses],
    ['nearVisionRightUnaided', campServerIndiaPrescreeningSelectors.nearVisionRightUnaided],
    ['nearVisionLeftUnaided', campServerIndiaPrescreeningSelectors.nearVisionLeftUnaided],
    ['nearVisionRightGlasses', campServerIndiaPrescreeningSelectors.nearVisionRightGlasses],
    ['nearVisionLeftGlasses', campServerIndiaPrescreeningSelectors.nearVisionLeftGlasses]
  ];

  for (const [key, selector] of fieldMap) {
    if (values[key] !== null) {
      await selectVisionValue(page, selector, values[key]);
    }
  }
}

async function moveToVisionStepWithNoComplaints(page) {
  await runStep('Click the No Complaints button on the Pre-Screening complaints step', async () => {
    await clickNoComplaints(page);
  });

  await runStep('Click Next to move from Chief Complaints to the Vision step', async () => {
    await clickNext(page);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.visionSection)).toBeVisible({ timeout: 15000 });
  });
}

async function completeVisionStep(page, overrides = {}) {
  await runStep('Fill the Pre-Screening Distance Vision and Near Vision values', async () => {
    await fillVisionStep(page, overrides);
  });

  await runStep('Set the Pinhole test response to No', async () => {
    await clickRadioOptionForRow(page, /Pinhole/i, 'No');
  });
}

async function finishVisionStep(page) {
  await runStep('Click Finish to submit the Pre-Screening form', async () => {
    await clickFinish(page);
  });
}

async function verifyPreScreeningPageDisplayed(page, data) {
  await openCreatedParticipantForPrescreening(page, data);

  await runStep('Assert that the Pre-Screening page is displayed for the selected participant', async () => {
    await expectPreScreeningHeading(page);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.complaintsSection)).toBeVisible();
  });
}

async function verifyNoComplaintsMarksAllAsNa(page, data) {
  await openCreatedParticipantForPrescreening(page, data);

  await runStep('Click No Complaints and verify that the complaint rows are marked as NA', async () => {
    await clickNoComplaints(page);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.headacheEyeStrainNa)).toBeChecked();
    await expect(page.locator(campServerIndiaPrescreeningSelectors.blurredVisionNa)).toBeChecked();
    await expect(page.locator(campServerIndiaPrescreeningSelectors.painRednessNa)).toBeChecked();
    await expect(page.locator(campServerIndiaPrescreeningSelectors.wateringDischargeNa)).toBeChecked();
    await expect(page.locator(campServerIndiaPrescreeningSelectors.swellingNa)).toBeChecked();
  });
}

async function verifyChiefComplaintsRequired(page, data) {
  await openCreatedParticipantForPrescreening(page, data);

  await runStep('Click Next without selecting any Chief Complaint values', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the Chief Complaint validation alert is displayed', async () => {
    await expectBodyOrToastText(page, 'Headache/Eye Strain cannot be left blank.');
    await expect(page.locator(campServerIndiaPrescreeningSelectors.complaintsSection)).toBeVisible();
  });
}

async function verifyDistanceVisionValidation(page, data, options) {
  await openCreatedParticipantForPrescreening(page, data);
  await moveToVisionStepWithNoComplaints(page);
  await completeVisionStep(page, options.overrides);
  await finishVisionStep(page);

  await runStep(`Assert that submission is blocked because the required field for "${options.fieldLabel}" is invalid`, async () => {
    await expectNativeInvalidField(page, options.invalidSelector);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.visionSection)).toBeVisible();
    await expect(page).toHaveURL(/prescreening(edit)?\.php/i);
  });
}

async function verifyDistanceVisionUnaidedRightRequired(page, data) {
  await verifyDistanceVisionValidation(page, data, {
    overrides: { distanceVisionRightUnaided: null },
    fieldLabel: 'DV Right Eye Unaided',
    invalidSelector: campServerIndiaPrescreeningSelectors.distanceVisionRightUnaided
  });
}

async function verifyDistanceVisionUnaidedLeftRequired(page, data) {
  await verifyDistanceVisionValidation(page, data, {
    overrides: { distanceVisionLeftUnaided: null },
    fieldLabel: 'DV Left Eye Unaided',
    invalidSelector: campServerIndiaPrescreeningSelectors.distanceVisionLeftUnaided
  });
}

async function verifyDistanceVisionWithGlassesRightRequired(page, data) {
  await verifyDistanceVisionValidation(page, data, {
    overrides: { distanceVisionRightGlasses: null },
    fieldLabel: 'DV Right Eye With Glasses',
    invalidSelector: campServerIndiaPrescreeningSelectors.distanceVisionRightGlasses
  });
}

async function verifyDistanceVisionWithGlassesLeftRequired(page, data) {
  await verifyDistanceVisionValidation(page, data, {
    overrides: { distanceVisionLeftGlasses: null },
    fieldLabel: 'DV Left Eye With Glasses',
    invalidSelector: campServerIndiaPrescreeningSelectors.distanceVisionLeftGlasses
  });
}

async function verifySuccessPopupMessage(page, data) {
  await openCreatedParticipantForPrescreening(page, data);
  await moveToVisionStepWithNoComplaints(page);
  await completeVisionStep(page);
  await finishVisionStep(page);

  await runStep('Assert that the Pre-Screening success popup is displayed', async () => {
    await expect(page.locator(campServerIndiaPrescreeningSelectors.successDialog)).toBeVisible({ timeout: 20000 });
    await expect(page.locator(campServerIndiaPrescreeningSelectors.successMessage).filter({ hasText: /Please direct the Participant to the Pre Exam station\./i }).first()).toBeVisible({ timeout: 10000 });
  });

  await runStep('Close the success popup and verify that the participant returns to the Pre-Screening list', async () => {
    await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.closeMessageButton);
    await expect(page).toHaveURL(/prescreening\.php/i);
    await expectPreScreeningHeading(page);
  });
}

module.exports = {
  campServerIndiaPrescreeningHelpers: {
    openModule,
    verifyPreScreeningPageDisplayed,
    verifyNoComplaintsMarksAllAsNa,
    verifyChiefComplaintsRequired,
    verifyDistanceVisionUnaidedRightRequired,
    verifyDistanceVisionUnaidedLeftRequired,
    verifyDistanceVisionWithGlassesRightRequired,
    verifyDistanceVisionWithGlassesLeftRequired,
    verifySuccessPopupMessage,
    selectors: campServerIndiaPrescreeningSelectors
  }
};
