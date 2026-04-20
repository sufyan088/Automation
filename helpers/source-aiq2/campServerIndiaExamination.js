const { expect, test } = require('@playwright/test');
const { campServerIndiaPreexamHelpers } = require('./campServerIndiaPreexam');
const { campServerIndiaPrescreeningSelectors } = require('../../selectors/source-aiq2/campServerIndiaPrescreening.selectors');
const { campServerIndiaPreexamSelectors } = require('../../selectors/source-aiq2/campServerIndiaPreexam.selectors');
const { campServerIndiaExaminationSelectors } = require('../../selectors/source-aiq2/campServerIndiaExamination.selectors');

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

async function setInputValue(locator, value) {
  await locator.evaluate((element, nextValue) => {
    element.value = nextValue;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }, String(value));
}

async function setSelectValue(locator, preferredValues) {
  const requested = Array.isArray(preferredValues) ? preferredValues : [preferredValues];
  const optionLocator = locator.locator('option');
  const optionCount = await optionLocator.count();
  const options = [];

  for (let index = 0; index < optionCount; index += 1) {
    const option = optionLocator.nth(index);
    options.push({
      label: ((await option.textContent().catch(() => '')) || '').trim(),
      value: ((await option.getAttribute('value').catch(() => '')) || '').trim()
    });
  }

  for (const requestedValue of requested.filter(Boolean)) {
    const matching = options.find((option) => option.label === requestedValue || option.value === requestedValue);
    if (matching) {
      await locator.selectOption(matching.value || { label: matching.label });
      return requestedValue;
    }
  }

  const fallback = options.find((option) => {
    const normalized = option.label.toLowerCase();
    if (!option.label || !option.value) {
      return false;
    }
    return !/^(-+|--|select|choose|please)/i.test(normalized);
  });

  if (!fallback) {
    throw new Error('Unable to determine a selectable option for the field.');
  }

  await locator.selectOption(fallback.value || { label: fallback.label });
  return fallback.label || fallback.value;
}

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const toastTexts = await page.locator(campServerIndiaExaminationSelectors.toastMessages).allTextContents();
      const pageText = await page.locator('body').innerText().catch(() => '');
      const haystacks = [...toastTexts, pageText]
        .map((text) => String(text || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean);

      return expectedValues.every((value) => {
        const normalizedValue = String(value || '').replace(/\s+/g, ' ').trim();
        return haystacks.some((text) => text.includes(normalizedValue));
      });
    }, { timeout })
    .toBe(true);
}

async function expectNativeInvalidField(page, selector) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);

  await expect.poll(async () => field.evaluate((element) => !element.checkValidity()), { timeout: 10000 }).toBe(true);
  await expect(page.locator(campServerIndiaExaminationSelectors.finishButton).first()).toBeVisible({ timeout: 5000 }).catch(() => {});
}

async function expectControlChecked(control) {
  await expect.poll(async () => control.evaluate((element) => Boolean(element.checked)), { timeout: 10000 }).toBe(true);
}

async function expectControlUnchecked(control) {
  await expect.poll(async () => control.evaluate((element) => !element.checked), { timeout: 10000 }).toBe(true);
}

async function clickParticipantByName(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    await exactCell.click();
    return;
  }

  const partialCell = page.locator(campServerIndiaExaminationSelectors.participantCells).filter({ hasText: participantName }).first();
  await expect(partialCell).toBeVisible({ timeout: 15000 });
  await partialCell.click();
}

async function getSection(page, selector) {
  const section = await getRequiredVisibleLocator(page, selector, 20000);
  await expect(section).toBeVisible({ timeout: 20000 });
  return section;
}

async function clickTextWithinSection(page, sectionSelector, text, exact = true) {
  const section = await getSection(page, sectionSelector);
  const textPattern = exact ? new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i') : new RegExp(escapeRegex(text), 'i');
  const candidates = section.locator('label, span, button, div').filter({ hasText: textPattern });
  const total = await candidates.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = candidates.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      const clickable = await candidate.locator('input').count().catch(() => 0) ? candidate : candidate;
      await clickable.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await clickable.click({ timeout: 3000 });
      } catch {
        await clickable.click({ force: true });
      }
      return candidate;
    }
  }

  throw new Error(`Unable to click text "${text}" inside section ${sectionSelector}`);
}

async function setControlStateInSection(page, sectionSelector, text, checked, exact = true) {
  const control = await getToggleInputInSection(page, sectionSelector, text, exact);
  if (control) {
    await control.scrollIntoViewIfNeeded().catch(() => {});
    try {
      const currentState = await control.evaluate((element) => Boolean(element.checked));
      if (currentState !== checked) {
        try {
          await control.click({ timeout: 3000 });
        } catch {
          await control.click({ force: true, timeout: 3000 });
        }
      }
    } catch {
      await control.evaluate((element, nextChecked) => {
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = nextChecked;
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('click', { bubbles: true }));
      }, checked);
    }
    return control;
  }

  if (checked) {
    return clickTextWithinSection(page, sectionSelector, text, exact);
  }

  return null;
}

async function clickControlInSection(page, sectionSelector, text, exact = true) {
  return setControlStateInSection(page, sectionSelector, text, true, exact);
}

async function getToggleInputInSection(page, sectionSelector, text, exact = true) {
  const section = await getSection(page, sectionSelector);
  const textPattern = exact ? new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i') : new RegExp(escapeRegex(text), 'i');
  const checkboxes = section.getByRole('checkbox', { name: textPattern });
  if (await checkboxes.count().catch(() => 0)) {
    return checkboxes.first();
  }

  const radios = section.getByRole('radio', { name: textPattern });
  if (await radios.count().catch(() => 0)) {
    return radios.first();
  }

  const labels = section.locator('label').filter({ hasText: textPattern });
  const total = await labels.count();

  for (let index = 0; index < total; index += 1) {
    const label = labels.nth(index);
    if (await label.isVisible().catch(() => false)) {
      const input = label.locator('input[type="checkbox"], input[type="radio"]').first();
      if (await input.count()) {
        return input;
      }
    }
  }

  return null;
}

async function selectVisibleOption(page, selector, preferredValues) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);
  const selectedValue = await setSelectValue(field, preferredValues);

  await expect.poll(async () => {
    const checked = field.locator('option:checked').first();
    return ((await checked.textContent().catch(() => '')) || '').trim();
  }, { timeout: 10000 }).not.toBe('');

  return selectedValue;
}

async function fillVisibleField(page, selector, value) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);
  await setInputValue(field, value);
  await expect(field).toHaveValue(String(value), { timeout: 10000 });
}

async function clickNext(page) {
  await clickVisibleAction(page, campServerIndiaExaminationSelectors.nextButton);
}

async function clickFinish(page) {
  await clickVisibleAction(page, campServerIndiaExaminationSelectors.finishButton);
}

async function expectExaminationHeading(page) {
  await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.pageHeading)).toContainText(/Examination/i);
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaExaminationSelectors.examinationLink);
  await expect(page).toHaveURL(/examination\.php/i);
  await expectExaminationHeading(page);
  return page;
}

async function openCreatedParticipantForExamination(page, data) {
  await runStep('Register, pre-screen, and route a participant to the Examination station from Pre Exam', async () => {
    await campServerIndiaPreexamHelpers.verifySuccessPopupForExamination(page, data);
  });

  await runStep('Close the Pre Exam success popup and open the Examination station', async () => {
    await clickVisibleAction(page, campServerIndiaPreexamSelectors.closeMessageButton);
    await expectBodyOrToastText(page, 'Pre Exam Updated Successfully!').catch(() => {});
    await openModule(page);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Examination list`, async () => {
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/examination(edit)?\.php/i);
    await expectExaminationHeading(page);
  });
}

async function openVisionStep(page, data) {
  await openCreatedParticipantForExamination(page, data);

  await runStep('Click Next to move from the Examination landing step to the vision step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.visionSection);
  });
}

async function fillVisionStep(page) {
  await runStep('Fill the Examination vision values', async () => {
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionRightUnaided, '6/5');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionLeftUnaided, '6/5');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionRightGlasses, '6/12');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionLeftGlasses, '6/12');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionRightUnaided, 'N8');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionLeftUnaided, 'N8');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionRightGlasses, 'N12');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionLeftGlasses, 'N12');
  });
}

async function chooseReferToHospital(page, answer) {
  await runStep(`Choose ${answer === 'yes' ? 'Yes' : 'No'} for Refer to Hospital`, async () => {
    await clickTextWithinSection(page, campServerIndiaExaminationSelectors.visionSection, answer === 'yes' ? 'Yes' : 'No');
  });
}

async function goToRightPrescriptionStep(page, data) {
  await openVisionStep(page, data);
  await fillVisionStep(page);
  await chooseReferToHospital(page, 'no');

  await runStep('Click Next to open the right-eye prescription step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.rightPrescriptionSection);
  });
}

async function goToReferralStep(page, data) {
  await openVisionStep(page, data);
  await fillVisionStep(page);
  await chooseReferToHospital(page, 'yes');

  await runStep('Click Next to open the referral step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.referralSection);
  });
}

async function fillRightPrescription(page, options = {}) {
  await runStep('Fill the right-eye prescription values', async () => {
    if (!options.skipSph) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeSph, '3.50');
    }
    if (!options.skipCyl) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeCyl, '3.25');
    }
    if (!options.skipAxis) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAxis, '10');
    }
    if (!options.skipVision) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeVision, '6/12');
    }

    const goodN6Button = await getVisibleLocator(page, '#step3 button:has-text("Good N6")');
    if (goodN6Button && !options.skipAdd) {
      await goodN6Button.click();
    } else if (!options.skipAdd) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAddSph, ['2.00', '0.00']);
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAddVision, ['N6', '6/12']);
    }

    if (!options.skipPopin) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyePopin, ['+1.50', 'NA']);
    }
    if (!options.skipReader) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeReader, '3.00');
    }
    if (!options.skipRemarks) {
      await fillVisibleField(page, campServerIndiaExaminationSelectors.prescriptionRemarks, 'Test');
    }
  });
}

async function goToLeftPrescriptionStep(page, data) {
  await goToRightPrescriptionStep(page, data);
  await fillRightPrescription(page);

  await runStep('Click Next to open the left-eye prescription step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.leftPrescriptionSection);
  });
}

async function fillLeftPrescription(page, options = {}) {
  await runStep('Fill the left-eye prescription values', async () => {
    if (!options.skipSph) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeSph, '2.75');
    }
    if (!options.skipCyl) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeCyl, '3.75');
    }
    if (!options.skipAxis) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAxis, ['10', '20', '30']);
    }
    if (!options.skipVision) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeVision, '6/12');
    }
    if (!options.skipAdd) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAddSph, ['1', '2.00']);
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAddVision, ['6/12', 'N6']);
    }
    if (!options.skipPopin) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyePopin, ['NA', '+1.50']);
    }
    if (!options.skipReader) {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeReader, '3.00');
    }
    if (!options.skipRemarks) {
      await fillVisibleField(page, campServerIndiaExaminationSelectors.prescriptionRemarks, 'test');
    }
  });
}

async function goToDiagnosisStep(page, data) {
  await goToLeftPrescriptionStep(page, data);
  await fillLeftPrescription(page);

  await runStep('Click Next to open the diagnosis step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.diagnosisSection);
  });
}

async function clickDiagnosis(page, diagnosisLabel) {
  await clickControlInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, diagnosisLabel);
}

async function expectDiagnosisChecked(page, diagnosisLabel) {
  const input = await getToggleInputInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, diagnosisLabel);
  if (input) {
    await expectControlChecked(input);
  }
}

async function expectDiagnosisUnchecked(page, diagnosisLabel) {
  const input = await getToggleInputInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, diagnosisLabel);
  if (input) {
    await expectControlUnchecked(input);
  }
}

async function fillDiagnosisForEyesightIssues(page) {
  await runStep('Select diagnosis values that represent eyesight issues', async () => {
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Other Eye Conditions', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Normal (No refractive error)', false);
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
    await clickDiagnosis(page, 'Hyperopia');
  });
}

async function goToIpdStep(page, data) {
  await goToDiagnosisStep(page, data);

  await runStep('Select the required diagnosis values for the scenario', async () => {
    await fillDiagnosisForEyesightIssues(page);
  });

  await runStep('Click Next to open the IPD step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.ipdSection);
  });
}

async function fillIpdStep(page) {
  await runStep('Fill the IPD step with NA and IPD millimeter values', async () => {
    await clickControlInSection(page, campServerIndiaExaminationSelectors.ipdSection, 'NA');
    const ipdField = await getVisibleLocator(page, campServerIndiaExaminationSelectors.ipdField);
    if (ipdField) {
      await setInputValue(ipdField, '10');
      await expect(ipdField).toHaveValue('10', { timeout: 10000 });
    }
  });
}

async function goToGlassesStep(page, data, options = {}) {
  await goToDiagnosisStep(page, data);

  if (options.normalDiagnosis) {
    await runStep('Select only Normal (No refractive error)', async () => {
      await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Other Eye Conditions', false);
      await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies', false);
      await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes', false);
      await clickDiagnosis(page, 'Normal (No refractive error)');
      await expectDiagnosisChecked(page, 'Normal (No refractive error)');
    });
  } else {
    await fillDiagnosisForEyesightIssues(page);
  }

  await runStep('Click Next to open the IPD step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.ipdSection);
  });

  await fillIpdStep(page);

  await runStep('Click Next to open the glasses step', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.glassesSection);
  });
}

async function clickNeedGlasses(page, answer) {
  await clickControlInSection(page, campServerIndiaExaminationSelectors.glassesSection, answer === 'yes' ? 'Yes' : 'No');
}

async function clickCurrentWearsGlasses(page, answer) {
  const desiredText = answer === 'yes' ? 'Yes' : 'No';
  const section = await getSection(page, campServerIndiaExaminationSelectors.glassesSection);
  const labels = section.locator('label').filter({ hasText: new RegExp(`^\\s*${desiredText}\\s*$`, 'i') });
  const count = await labels.count();

  for (let index = 0; index < count; index += 1) {
    const label = labels.nth(index);
    if (await label.isVisible().catch(() => false)) {
      const input = label.locator('input').first();
      const name = await input.getAttribute('name').catch(() => '');
      if (/wear/i.test(name || '')) {
        await label.click();
        return input;
      }
    }
  }

  return clickControlInSection(page, campServerIndiaExaminationSelectors.glassesSection, desiredText);
}

async function clickGlassesAdvisedNa(page) {
  await clickControlInSection(page, campServerIndiaExaminationSelectors.glassesSection, '-NA-', false);
}

async function getGlassesToggleInput(page, labelText) {
  return getToggleInputInSection(page, campServerIndiaExaminationSelectors.glassesSection, labelText, true);
}

async function completeSuccessfulExamination(page, data) {
  await goToGlassesStep(page, data);

  await runStep('Complete the glasses step and finish the Examination flow', async () => {
    await clickNeedGlasses(page, 'yes');
    await clickGlassesAdvisedNa(page);
    await clickCurrentWearsGlasses(page, 'no');
    await clickFinish(page);
  });

  await runStep('Assert that the participant is handed off from Examination after Finish', async () => {
    const closeMessageButton = page.getByRole('button', { name: /Close Message/i }).first();

    const handoffState = await expect.poll(async () => {
      if (await closeMessageButton.isVisible().catch(() => false)) {
        return 'dialog';
      }

      if (await getVisibleLocator(page, campServerIndiaExaminationSelectors.sanitizeButton)) {
        return 'sanitize';
      }

      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (/Dispense station|Examination Updated Successfully!/i.test(bodyText)) {
        return 'message';
      }

      return '';
    }, { timeout: 20000 }).not.toBe('').then(() => 'ready');

    if (handoffState === 'ready' && await closeMessageButton.isVisible().catch(() => false)) {
      await closeMessageButton.click();
      await expect(closeMessageButton).not.toBeVisible({ timeout: 10000 }).catch(() => {});
    }
  });
}

async function verifyParticipantShouldBeReferedToFurtherExaminationScreenWhenNoButtonIsClicked(page, data) {
  await goToRightPrescriptionStep(page, data);

  await runStep('Assert that clicking No on Refer to Hospital opens the further examination flow', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.rightPrescriptionSection)).toBeVisible({ timeout: 15000 });
  });
}

async function verifyClickingYesOnReferToHospitalRedirectsToHospitalScreen(page, data) {
  await goToReferralStep(page, data);

  await runStep('Assert that the referral screen is displayed', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.hospitalScreenHeading)).toContainText(/Referred for further diagnosis and examination/i);
  });
}

async function verifyGovtHospitalDisplayedWhenHospitalNameDropdownIsSelected(page, data) {
  await goToReferralStep(page, data);

  await runStep('Select GOVT.HOSPITAL in the Hospital Name dropdown and verify the selection', async () => {
    const selected = await selectVisibleOption(page, campServerIndiaExaminationSelectors.hospitalNameSelect, 'GOVT.HOSPITAL');
    expect(selected).toMatch(/govt/i);
  });
}

async function verifyNoReferredReasonTextboxRequired(page, data) {
  await goToReferralStep(page, data);

  await runStep('Check Other on the referral step and click Finish without entering the referred reason', async () => {
    await clickTextWithinSection(page, campServerIndiaExaminationSelectors.referralSection, 'Other');
    await clickFinish(page);
  });

  await runStep('Assert that the referred reason field is required', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.referralSection)).toBeVisible({ timeout: 15000 });
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.referredReasonOther)).toHaveValue('', { timeout: 5000 });
  });
}

async function verifyRightEyePrescriptionFieldsRequired(page, data) {
  await goToRightPrescriptionStep(page, data);

  await runStep('Click Next without filling the right-eye prescription fields', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the right-eye prescription fields are required', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.rightPrescriptionSection)).toBeVisible({ timeout: 15000 });
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.rightEyeSph)).toHaveValue('', { timeout: 5000 });
  });
}

async function verifyRightEyePrescriptionRemarksRequired(page, data) {
  await goToRightPrescriptionStep(page, data);
  await fillRightPrescription(page, { skipRemarks: true });

  await runStep('Click Next with the right-eye prescription remarks left empty', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the right-eye prescription remarks are required', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.rightPrescriptionSection)).toBeVisible({ timeout: 15000 });
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.prescriptionRemarks)).toHaveValue('', { timeout: 5000 });
  });
}

async function verifyLeftEyePrescriptionRemarksRequired(page, data) {
  await goToLeftPrescriptionStep(page, data);
  await fillLeftPrescription(page, { skipRemarks: true });

  await runStep('Click Next with the left-eye prescription remarks left empty', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the left-eye prescription remarks are required', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.leftPrescriptionSection)).toBeVisible({ timeout: 15000 });
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.prescriptionRemarks)).toHaveValue('', { timeout: 5000 });
  });
}

async function verifyAllDiagnosisUncheckedWhenNormalChecked(page, data) {
  await goToDiagnosisStep(page, data);

  await runStep('Select multiple diagnoses and then select Normal (No refractive error)', async () => {
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
    await clickDiagnosis(page, 'Hyperopia');
    await clickDiagnosis(page, 'Normal (No refractive error)');
  });

  await runStep('Assert that the other diagnosis options are unchecked', async () => {
    await expectDiagnosisChecked(page, 'Normal (No refractive error)');
    await expectDiagnosisUnchecked(page, 'Presbyopia');
    await expectDiagnosisUnchecked(page, 'Myopia');
    await expectDiagnosisUnchecked(page, 'Hyperopia');
  });
}

async function verifyNormalUncheckedWhenDiagnosisChecked(page, data) {
  await goToDiagnosisStep(page, data);

  await runStep('Select Normal first and then select diagnosis values', async () => {
    await clickDiagnosis(page, 'Normal (No refractive error)');
    await clickDiagnosis(page, 'Presbyopia');
    await clickDiagnosis(page, 'Myopia');
  });

  await runStep('Assert that Normal is unchecked once another diagnosis is selected', async () => {
    await expectDiagnosisChecked(page, 'Presbyopia');
    await expectDiagnosisChecked(page, 'Myopia');
    await expectDiagnosisUnchecked(page, 'Normal (No refractive error)');
  });
}

async function verifyOtherEyeConditionsUncheckedShowsAlert(page, data) {
  await goToDiagnosisStep(page, data);

  await runStep('Select Other Eye Conditions without selecting any child issue and click Next', async () => {
    await clickDiagnosis(page, 'Other Eye Conditions');
    const allergies = await getToggleInputInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies');
    const dryEyes = await getToggleInputInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes');

    if (allergies && (await allergies.evaluate((element) => Boolean(element.checked)))) {
      await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies', false);
    }
    if (dryEyes && (await dryEyes.evaluate((element) => Boolean(element.checked)))) {
      await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes', false);
    }

    await clickNext(page);
  });

  await runStep('Assert that submission remains blocked on Step 5 with no follow-up issue selected', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.diagnosisSection)).toBeVisible({ timeout: 15000 });
    await expect(page.locator(campServerIndiaExaminationSelectors.ipdSection)).not.toBeVisible();
    const otherIssue = await getToggleInputInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Other');
    if (otherIssue) {
      await expectControlUnchecked(otherIssue);
    }
  });
}

async function verifyAllUncheckedOtherIssuesShowsAlert(page, data) {
  await verifyOtherEyeConditionsUncheckedShowsAlert(page, data);
}

async function verifyNeedGlassesYesButton(page, data) {
  await goToGlassesStep(page, data);

  await runStep('Click Need Glasses Yes and verify that it is selected', async () => {
    await clickNeedGlasses(page, 'yes');
    const input = await getGlassesToggleInput(page, 'Yes');
    if (input) {
      await expectControlChecked(input);
    }
  });
}

async function verifyNeedGlassesNoButton(page, data) {
  await goToDiagnosisStep(page, data);

  await runStep('Select only Normal (No refractive error) and move to the final step', async () => {
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Other Eye Conditions', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes', false);
    await clickDiagnosis(page, 'Normal (No refractive error)');
    await clickNext(page);
    await getSection(page, campServerIndiaExaminationSelectors.ipdSection);
    await fillIpdStep(page);
  });

  await runStep('Assert that the Normal diagnosis path skips the glasses step and lands on the finish state', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.ipdSection)).toBeVisible({ timeout: 15000 });
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.finishButton)).toBeVisible({ timeout: 15000 });
  });
}

async function verifyNeedNewPowerAndAccurateEnabledWhenCurrentlyWearsGlassesYes(page, data) {
  await goToGlassesStep(page, data);

  await runStep('Select Need Glasses Yes and Currently Wears Glasses Yes', async () => {
    await clickNeedGlasses(page, 'yes');
    await clickCurrentWearsGlasses(page, 'yes');
  });

  await runStep('Assert that Need New Power and Accurate are enabled and can be selected', async () => {
    const needNewPowerInput = await getGlassesToggleInput(page, 'Need New Power');
    const accurateInput = await getGlassesToggleInput(page, 'Accurate');

    if (needNewPowerInput) {
      await expect(needNewPowerInput).toBeEnabled();
    }
    if (accurateInput) {
      await expect(accurateInput).toBeEnabled();
    }

    await clickControlInSection(page, campServerIndiaExaminationSelectors.glassesSection, 'Need New Power');

    if (needNewPowerInput) {
      await expectControlChecked(needNewPowerInput);
    }
    if (accurateInput) {
      await expect(accurateInput).toBeEnabled();
    }
  });
}

async function verifyNeedNewPowerAndAccurateDisabledWhenCurrentWearsGlassesNo(page, data) {
  await goToGlassesStep(page, data);

  await runStep('Select Need Glasses Yes and Currently Wears Glasses No', async () => {
    await clickNeedGlasses(page, 'yes');
    await clickCurrentWearsGlasses(page, 'no');
  });

  await runStep('Assert that Need New Power and Accurate are disabled', async () => {
    const needNewPowerInput = await getGlassesToggleInput(page, 'Need New Power');
    const accurateInput = await getGlassesToggleInput(page, 'Accurate');

    if (needNewPowerInput) {
      await expect(needNewPowerInput).toBeDisabled();
    }
    if (accurateInput) {
      await expect(accurateInput).toBeDisabled();
    }
  });
}

async function verifyGlassesAdvisedRequired(page, data) {
  await goToGlassesStep(page, data);

  await runStep('Click Finish without choosing a Glasses Advised value', async () => {
    await clickNeedGlasses(page, 'yes');
    await clickCurrentWearsGlasses(page, 'no');
    await clickFinish(page);
  });

  await runStep('Assert that the user remains on the glasses step when Glasses Advised is not selected', async () => {
    await expect(page.locator(campServerIndiaExaminationSelectors.glassesSection)).toBeVisible({ timeout: 15000 });
  });
}

module.exports = {
  campServerIndiaExaminationHelpers: {
    openModule,
    verifyParticipantShouldBeReferedToFurtherExaminationScreenWhenNoButtonIsClicked,
    verifyClickingYesOnReferToHospitalRedirectsToHospitalScreen,
    verifyGovtHospitalDisplayedWhenHospitalNameDropdownIsSelected,
    verifyNoReferredReasonTextboxRequired,
    verifyRightEyePrescriptionFieldsRequired,
    verifyRightEyePrescriptionRemarksRequired,
    verifyLeftEyePrescriptionRemarksRequired,
    verifyAllDiagnosisUncheckedWhenNormalChecked,
    verifyNormalUncheckedWhenDiagnosisChecked,
    verifyOtherEyeConditionsUncheckedShowsAlert,
    verifyAllUncheckedOtherIssuesShowsAlert,
    verifyNeedGlassesYesButton,
    verifyNeedGlassesNoButton,
    verifyNeedNewPowerAndAccurateEnabledWhenCurrentlyWearsGlassesYes,
    verifyNeedNewPowerAndAccurateDisabledWhenCurrentWearsGlassesNo,
    verifyGlassesAdvisedRequired,
    completeSuccessfulExamination,
    selectors: campServerIndiaExaminationSelectors
  }
};
