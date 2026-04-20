const { expect, test } = require('@playwright/test');
const { campServerIndiaPrescreeningHelpers } = require('./campServerIndiaPrescreening');
const { campServerIndiaRegistrationSelectors } = require('../../selectors/source-aiq2/campServerIndiaRegistration.selectors');
const { campServerIndiaPreexamSelectors } = require('../../selectors/source-aiq2/campServerIndiaPreexam.selectors');

async function runStep(title, action) {
  return test.step(title, action);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const toastTexts = await page.locator(campServerIndiaPreexamSelectors.toastMessages).allTextContents();
      const normalizedToastTexts = toastTexts.map((text) => text.trim()).filter(Boolean);

      if (normalizedToastTexts.length) {
        return normalizedToastTexts;
      }

      const pageText = await page.locator('body').innerText().catch(() => '');
      return expectedValues.filter((value) => pageText.includes(value));
    }, { timeout })
    .toEqual(expect.arrayContaining(expectedValues));
}

async function clickParticipantByName(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    await exactCell.click();
    return;
  }

  const partialCell = page
    .locator(campServerIndiaPreexamSelectors.participantCells)
    .filter({ hasText: participantName })
    .first();

  await expect(partialCell).toBeVisible({ timeout: 15000 });
  await partialCell.click();
}

async function getDiagnosisLabel(page, diagnosisLabel) {
  const pattern = new RegExp(`^\\s*${escapeRegex(diagnosisLabel)}\\s*$`, 'i');
  const labels = page.locator(campServerIndiaPreexamSelectors.diagnosisCheckboxLabels).filter({ hasText: pattern });
  const total = await labels.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = labels.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      return candidate;
    }
  }

  throw new Error(`Unable to find visible diagnosis label: ${diagnosisLabel}`);
}

async function getDiagnosisCheckbox(page, diagnosisLabel) {
  const label = await getDiagnosisLabel(page, diagnosisLabel);
  const checkbox = label.locator('input[type="checkbox"], input[type="radio"]').first();

  await expect(checkbox).toHaveCount(1, { timeout: 10000 });
  return checkbox;
}

async function clickDiagnosis(page, diagnosisLabel) {
  const label = await getDiagnosisLabel(page, diagnosisLabel);
  await label.scrollIntoViewIfNeeded();
  await label.click();
}

async function expectDiagnosisChecked(page, diagnosisLabel) {
  const checkbox = await getDiagnosisCheckbox(page, diagnosisLabel);
  await expect(checkbox).toBeChecked();
}

async function expectDiagnosisUnchecked(page, diagnosisLabel) {
  const checkbox = await getDiagnosisCheckbox(page, diagnosisLabel);
  await expect(checkbox).not.toBeChecked();
}

async function expectPreExamHeading(page) {
  await expect(await getRequiredVisibleLocator(page, campServerIndiaPreexamSelectors.pageHeading)).toContainText(/Pre\s*Exam/i);
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaPreexamSelectors.preExamLink);
  await expect(page).toHaveURL(/preexam\.php/i);
  await expectPreExamHeading(page);
  return page;
}

async function openCreatedParticipantForPreExam(page, data) {
  await runStep('Register and Pre-Screen a participant so that they are routed to the Pre Exam station', async () => {
    await campServerIndiaPrescreeningHelpers.verifySuccessPopupMessage(page, data);
  });

  await runStep('Open the Pre Exam module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Pre Exam list`, async () => {
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/preexam(edit)?\.php/i);
  });
}

async function clickNext(page) {
  await clickVisibleAction(page, campServerIndiaPreexamSelectors.nextButton);
}

async function clickFinish(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.finishButton);
}

async function progressToDiagnosisStep(page) {
  await runStep('Click Next twice to reach the Diagnosis step in Pre Exam', async () => {
    await clickNext(page);
    await clickNext(page);
    await expect(page.locator(campServerIndiaPreexamSelectors.diagnosisSection)).toBeVisible({ timeout: 15000 });
  });
}

async function expectStillOnDiagnosisStep(page) {
  await expect(page.locator(campServerIndiaPreexamSelectors.diagnosisSection)).toBeVisible({ timeout: 15000 });
  await expect(page).toHaveURL(/preexam(edit)?\.php/i);
  await expect(page.locator(campServerIndiaPreexamSelectors.successDialog).first()).not.toBeVisible({ timeout: 1000 });
}

async function selectStandardDiagnosisBundle(page) {
  await runStep('Select Presbyopia, Myopia, Hyperopia, Other Eye Conditions, Allergies, and Dry Eyes', async () => {
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
    await clickDiagnosis(page, 'Hyperopia');
    await clickDiagnosis(page, 'Other Eye Conditions');
    await clickDiagnosis(page, 'Allergies');
    await clickDiagnosis(page, 'Dry Eyes');

    await expectDiagnosisChecked(page, 'Presbyopia');
    await expectDiagnosisChecked(page, 'Myopia');
    await expectDiagnosisChecked(page, 'Hyperopia');
    await expectDiagnosisChecked(page, 'Other Eye Conditions');
    await expectDiagnosisChecked(page, 'Allergies');
    await expectDiagnosisChecked(page, 'Dry Eyes');
  });
}

async function chooseRoute(page, route) {
  const selector = route === 'dispense'
    ? campServerIndiaPreexamSelectors.dispenseStationButton
    : campServerIndiaPreexamSelectors.examinationStationButton;

  await runStep(`Choose the ${route === 'dispense' ? 'Dispense' : 'Examination'} station in the Diagnosis step`, async () => {
    await clickVisibleAction(page, selector);
  });
}

async function assertParticipantInModuleList(page, linkSelector, urlPattern, participantName) {
  await clickVisibleAction(page, linkSelector);
  await expect(page).toHaveURL(urlPattern);
  await expect(page.getByRole('cell', { name: participantName, exact: true }).first().or(page.locator('td').filter({ hasText: participantName }).first())).toBeVisible({ timeout: 15000 });
}

async function verifyEmptyDiagnosisShowsAlert(page, data) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);

  await runStep('Choose Examination as the target station without selecting any Diagnosis values', async () => {
    await chooseRoute(page, 'examination');
  });

  await runStep('Click Finish without selecting any Diagnosis values', async () => {
    await clickFinish(page);
  });

  await runStep('Assert that the Diagnosis required alert is displayed', async () => {
    await expectBodyOrToastText(page, 'Diagnosis cannot be left blank.');
    await expectStillOnDiagnosisStep(page);
  });
}

async function verifyDiagnosisAndOnlyOtherEyeConditionShowsAlert(page, data) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);

  await runStep('Select Presbyopia and Other Eye Conditions only', async () => {
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Other Eye Conditions');
    await expectDiagnosisChecked(page, 'Presbyopia');
    await expectDiagnosisChecked(page, 'Other Eye Conditions');
  });

  await runStep('Click Examination and Finish without choosing an Other Issues value', async () => {
    await chooseRoute(page, 'examination');
    await clickFinish(page);
  });

  await runStep('Assert that submission is blocked on the Diagnosis step when only the parent Other Eye Conditions checkbox is selected', async () => {
    await expectStillOnDiagnosisStep(page);
    await expect(page.locator(campServerIndiaPreexamSelectors.otherIssuesTextbox).first()).not.toBeVisible();
  });
}

async function verifyNormalUnchecksOtherDiagnoses(page, data) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);

  await runStep('Select Presbyopia, Myopia, and Hyperopia, then select Normal (No refractive error)', async () => {
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
    await clickDiagnosis(page, 'Hyperopia');
    await clickDiagnosis(page, 'Normal (No refractive error)');
  });

  await runStep('Assert that the other diagnosis checkboxes are unchecked when Normal is checked', async () => {
    await expectDiagnosisChecked(page, 'Normal (No refractive error)');
    await expectDiagnosisUnchecked(page, 'Presbyopia');
    await expectDiagnosisUnchecked(page, 'Myopia');
    await expectDiagnosisUnchecked(page, 'Hyperopia');
    await expectDiagnosisUnchecked(page, 'Astigmatism');
    await expectDiagnosisUnchecked(page, 'Referral');
  });
}

async function verifyOtherDiagnosesUncheckNormal(page, data) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);

  await runStep('Select Normal (No refractive error), then select Presbyopia, Myopia, and Hyperopia', async () => {
    await clickDiagnosis(page, 'Normal (No refractive error)');
    await expectDiagnosisChecked(page, 'Normal (No refractive error)');
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
    await clickDiagnosis(page, 'Hyperopia');
  });

  await runStep('Assert that Normal is unchecked when any other diagnosis is checked', async () => {
    await expectDiagnosisChecked(page, 'Presbyopia');
    await expectDiagnosisChecked(page, 'Myopia');
    await expectDiagnosisChecked(page, 'Hyperopia');
    await expectDiagnosisUnchecked(page, 'Normal (No refractive error)');
  });
}

async function verifyOtherIssuesTextboxDisplayed(page, data) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);
  await selectStandardDiagnosisBundle(page);

  await runStep('Select the Other checkbox in Other Eye Conditions and verify the Other Issues textbox is displayed', async () => {
    await clickDiagnosis(page, 'Other');
    await expectDiagnosisChecked(page, 'Other');
    await expect(await getRequiredVisibleLocator(page, campServerIndiaPreexamSelectors.otherIssuesTextbox)).toBeVisible();
  });
}

async function submitParticipantToRoute(page, data, route) {
  await openCreatedParticipantForPreExam(page, data);
  await progressToDiagnosisStep(page);
  await selectStandardDiagnosisBundle(page);
  await chooseRoute(page, route);

  await runStep('Click Finish to submit the Pre Exam form', async () => {
    await clickFinish(page);
  });
}

async function verifySuccessPopupForExamination(page, data) {
  await submitParticipantToRoute(page, data, 'examination');

  await runStep('Assert that the Examination routing success popup is displayed', async () => {
    await expect(page.locator(campServerIndiaPreexamSelectors.successDialog)).toBeVisible({ timeout: 20000 });
    await expect(page.locator(campServerIndiaPreexamSelectors.successMessage).filter({ hasText: /Please direct the Participant to the Examination station\./i }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function verifyParticipantMovedToExamination(page, data) {
  await verifySuccessPopupForExamination(page, data);

  await runStep('Close the success popup and verify that the participant is listed in the Examination station', async () => {
    await clickVisibleAction(page, campServerIndiaPreexamSelectors.closeMessageButton);
    await assertParticipantInModuleList(page, campServerIndiaRegistrationSelectors.examinationLink, /examination\.php/i, data.campServerParticipantFirstName);
  });
}

async function verifySuccessPopupForDispense(page, data) {
  await submitParticipantToRoute(page, data, 'dispense');

  await runStep('Assert that the Dispense routing success popup is displayed', async () => {
    await expect(page.locator(campServerIndiaPreexamSelectors.successDialog)).toBeVisible({ timeout: 20000 });
    await expect(page.locator(campServerIndiaPreexamSelectors.successMessage).filter({ hasText: /Please direct the Participant to the Dispense station\./i }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function verifyParticipantMovedToDispense(page, data) {
  await verifySuccessPopupForDispense(page, data);

  await runStep('Close the success popup and verify that the participant is listed in the Dispense station', async () => {
    await clickVisibleAction(page, campServerIndiaPreexamSelectors.closeMessageButton);
    await assertParticipantInModuleList(page, campServerIndiaRegistrationSelectors.dispenseLink, /dispatch\.php/i, data.campServerParticipantFirstName);
  });
}

module.exports = {
  campServerIndiaPreexamHelpers: {
    openModule,
    verifyEmptyDiagnosisShowsAlert,
    verifyDiagnosisAndOnlyOtherEyeConditionShowsAlert,
    verifyNormalUnchecksOtherDiagnoses,
    verifyOtherDiagnosesUncheckNormal,
    verifyOtherIssuesTextboxDisplayed,
    verifySuccessPopupForExamination,
    verifyParticipantMovedToExamination,
    verifySuccessPopupForDispense,
    verifyParticipantMovedToDispense,
    selectors: campServerIndiaPreexamSelectors
  }
};
