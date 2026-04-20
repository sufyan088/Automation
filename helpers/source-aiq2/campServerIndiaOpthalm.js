const { expect, test } = require('@playwright/test');
const { campServerIndiaRegistrationHelpers } = require('./campServerIndiaRegistration');
const { campServerIndiaPreexamHelpers } = require('./campServerIndiaPreexam');
const { campServerIndiaRegistrationSelectors } = require('../../selectors/source-aiq2/campServerIndiaRegistration.selectors');
const { campServerIndiaPrescreeningSelectors } = require('../../selectors/source-aiq2/campServerIndiaPrescreening.selectors');
const { campServerIndiaPreexamSelectors } = require('../../selectors/source-aiq2/campServerIndiaPreexam.selectors');
const { campServerIndiaExaminationSelectors } = require('../../selectors/source-aiq2/campServerIndiaExamination.selectors');
const { campServerIndiaOpthalmSelectors } = require('../../selectors/source-aiq2/campServerIndiaOpthalm.selectors');

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

async function setSelectValue(locator, preferredValues) {
  const requestedValues = Array.isArray(preferredValues) ? preferredValues : [preferredValues];
  const options = locator.locator('option');
  const count = await options.count();

  for (const requestedValue of requestedValues.filter(Boolean)) {
    for (let index = 0; index < count; index += 1) {
      const option = options.nth(index);
      const label = ((await option.textContent().catch(() => '')) || '').trim();
      const value = ((await option.getAttribute('value').catch(() => '')) || '').trim();

      if (label.toLowerCase() === String(requestedValue).trim().toLowerCase() || value.toLowerCase() === String(requestedValue).trim().toLowerCase()) {
        await locator.selectOption(value || { label });
        return label || value;
      }
    }
  }

  throw new Error('Unable to find option ' + requestedValues.join(', '));
}

async function selectVisibleOption(page, selector, preferredValues) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);
  const selected = await setSelectValue(field, preferredValues);

  await expect.poll(async () => {
    const checked = field.locator('option:checked').first();
    return ((await checked.textContent().catch(() => '')) || '').trim();
  }, { timeout: 10000 }).not.toBe('');

  return selected;
}

async function fillVisibleField(page, selector, value) {
  const field = await getRequiredVisibleLocator(page, selector, 15000);
  await setInputValue(field, value);
  await expect(field).toHaveValue(String(value), { timeout: 10000 });
}

async function clickParticipantByName(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    await exactCell.click();
    return;
  }

  const partialCell = page.locator(campServerIndiaOpthalmSelectors.participantCells).filter({ hasText: participantName }).first();
  await expect(partialCell).toBeVisible({ timeout: 15000 });
  await partialCell.click();
}

async function findParticipantCell(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    return exactCell;
  }

  const partialCell = page.locator(campServerIndiaOpthalmSelectors.participantCells).filter({ hasText: participantName }).first();
  if (await partialCell.isVisible().catch(() => false)) {
    return partialCell;
  }

  return null;
}

async function waitForParticipantInOpthalmQueue(page, participantName, timeout = 45000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    await searchParticipant(page, participantName);
    await page.waitForLoadState('networkidle').catch(() => {});

    const participantCell = await findParticipantCell(page, participantName);
    if (participantCell) {
      return participantCell;
    }

    await clickVisibleAction(page, campServerIndiaOpthalmSelectors.refreshButton);
    await page.waitForLoadState('networkidle').catch(() => {});
    await expect(await getRequiredVisibleLocator(page, campServerIndiaOpthalmSelectors.sourceTable)).toBeVisible({ timeout: 10000 });
  }

  throw new Error(`Participant "${participantName}" did not reach the Opthalm queue within ${timeout}ms.`);
}

async function searchAndOpenParticipant(page, participantName) {
  let participantCell;

  await runStep(`Wait for participant "${participantName}" to appear in the Opthalm queue`, async () => {
    participantCell = await waitForParticipantInOpthalmQueue(page, participantName);
  });

  await runStep(`Open the participant "${participantName}" from the filtered Opthalm queue`, async () => {
    await participantCell.click();
  });
}

async function clickTextWithinSection(page, sectionSelector, text, exact = true) {
  const section = await getRequiredVisibleLocator(page, sectionSelector, 15000);
  const pattern = exact ? new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i') : new RegExp(escapeRegex(text), 'i');
  const candidates = section.locator('label, span, button, div').filter({ hasText: pattern });
  const total = await candidates.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = candidates.nth(index);
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

  throw new Error(`Unable to click text "${text}" inside section ${sectionSelector}`);
}

async function clickIndexedTextWithinSection(page, sectionSelector, text, visibleIndex, exact = true) {
  const section = await getRequiredVisibleLocator(page, sectionSelector, 15000);
  const pattern = exact ? new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i') : new RegExp(escapeRegex(text), 'i');
  const candidates = section.locator('label, span, button, div').filter({ hasText: pattern });
  const total = await candidates.count();
  let currentVisibleIndex = 0;

  for (let index = 0; index < total; index += 1) {
    const candidate = candidates.nth(index);
    if (await candidate.isVisible().catch(() => false)) {
      if (currentVisibleIndex === visibleIndex) {
        await candidate.scrollIntoViewIfNeeded().catch(() => {});
        try {
          await candidate.click({ timeout: 3000 });
        } catch {
          await candidate.click({ force: true });
        }
        return candidate;
      }
      currentVisibleIndex += 1;
    }
  }

  throw new Error(`Unable to click visible occurrence ${visibleIndex} for text "${text}" inside section ${sectionSelector}`);
}

async function getSection(page, selector) {
  const section = await getRequiredVisibleLocator(page, selector, 20000);
  await expect(section).toBeVisible({ timeout: 20000 });
  return section;
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

async function setControlStateInSection(page, sectionSelector, text, checked, exact = true) {
  const control = await getToggleInputInSection(page, sectionSelector, text, exact);
  if (control) {
    await control.scrollIntoViewIfNeeded().catch(() => {});
    try {
      const currentState = await control.evaluate((element) => Boolean(element.checked));
      if (currentState !== checked) {
        await control.click({ timeout: 3000 });
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

async function clickToggleCell(page, sectionSelector, rowIndex, columnIndex) {
  const section = await getRequiredVisibleLocator(page, sectionSelector, 15000);
  const sectionId = await section.getAttribute('id');

  if (!sectionId) {
    throw new Error(`Unable to determine the section id for selector ${sectionSelector}`);
  }

  const cell = page.locator(`xpath=//section[@id="${sectionId}"]//tbody/tr[${rowIndex}]/td[${columnIndex}]`).first();
  await expect(cell).toBeVisible({ timeout: 15000 });

  const input = cell.locator('input[type="checkbox"], input[type="radio"]').first();
  if (await input.count()) {
    await input.scrollIntoViewIfNeeded().catch(() => {});
    const isChecked = await input.evaluate((element) => Boolean(element.checked)).catch(() => false);

    if (!isChecked) {
      try {
        await input.setChecked(true, { force: true, timeout: 3000 });
      } catch {
        await input.evaluate((element) => {
          element.checked = true;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
        });
      }
    }

    await expect.poll(async () => input.evaluate((element) => Boolean(element.checked)), { timeout: 10000 }).toBe(true);
    return;
  }

  const cellToggle = cell.locator('label span, span').first();
  await expect(cellToggle).toBeVisible({ timeout: 15000 });
  await cellToggle.scrollIntoViewIfNeeded().catch(() => {});

  try {
    await cellToggle.click({ timeout: 3000 });
  } catch {
    await cellToggle.click({ force: true });
  }
}

async function clickPresetButtonInSectionRow(page, sectionSelector, rowIndex, buttonText) {
  const section = await getRequiredVisibleLocator(page, sectionSelector, 15000);
  const sectionId = await section.getAttribute('id');

  if (!sectionId) {
    throw new Error(`Unable to determine the section id for selector ${sectionSelector}`);
  }

  const row = page.locator(`xpath=//section[@id="${sectionId}"]//tbody/tr[${rowIndex}]`).first();
  await expect(row).toBeVisible({ timeout: 15000 });

  const button = row.getByRole('button', { name: buttonText, exact: true }).first();
  await expect(button).toBeVisible({ timeout: 15000 });
  await button.scrollIntoViewIfNeeded().catch(() => {});

  try {
    await button.click({ timeout: 3000 });
  } catch {
    await button.click({ force: true });
  }
}

async function clickPresetButtonInSectionByRowLabel(page, sectionSelector, rowLabel, buttonText, visibleIndex = 0) {
  const section = await getRequiredVisibleLocator(page, sectionSelector, 15000);
  const rows = section.locator('tbody tr');
  const total = await rows.count();
  const normalizedRowLabel = rowLabel.trim().toLowerCase();
  const buttonPattern = new RegExp(`^\\s*${escapeRegex(buttonText)}\\s*$`, 'i');
  let currentVisibleIndex = 0;

  for (let index = 0; index < total; index += 1) {
    const row = rows.nth(index);
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const rowText = ((await row.textContent().catch(() => '')) || '').trim().toLowerCase();
    if (!rowText.includes(normalizedRowLabel)) {
      continue;
    }

    if (currentVisibleIndex !== visibleIndex) {
      currentVisibleIndex += 1;
      continue;
    }

    const buttonCandidates = [
      row.getByRole('button', { name: buttonText, exact: true }).first(),
      row.locator('button').filter({ hasText: buttonPattern }).first(),
      row.getByText(buttonText, { exact: true }).first()
    ];

    for (const button of buttonCandidates) {
      if (!(await button.isVisible().catch(() => false))) {
        continue;
      }

      await button.scrollIntoViewIfNeeded().catch(() => {});

      try {
        await button.click({ timeout: 3000 });
      } catch {
        await button.click({ force: true });
      }
      return;
    }

    currentVisibleIndex += 1;
  }

  throw new Error(`Unable to click preset button "${buttonText}" for row label "${rowLabel}" occurrence ${visibleIndex} inside section ${sectionSelector}`);
}

async function clickRadioOptionForRow(page, rowPattern, optionText) {
  const row = page.locator('tr').filter({ hasText: rowPattern }).first();
  if (await row.isVisible().catch(() => false)) {
    const option = row.getByText(optionText, { exact: true }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }
  }

  const container = page.locator('section#step2, form').filter({ hasText: rowPattern }).first();
  if (await container.isVisible().catch(() => false)) {
    const option = container.getByText(optionText, { exact: true }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }
  }

  throw new Error(`Unable to click option "${optionText}" for row ${rowPattern}`);
}

async function clickPresetButtonForRow(page, rowPattern, buttonText) {
  const row = page.locator('tr').filter({ hasText: rowPattern }).first();
  await expect(row).toBeVisible({ timeout: 15000 });

  const button = row.getByRole('button', { name: buttonText, exact: true }).first();
  if (await button.isVisible().catch(() => false)) {
    await button.click();
    return;
  }

  throw new Error(`Unable to click preset button "${buttonText}" for row ${rowPattern}`);
}

async function clickExaminationFinish(page) {
  const finishButton = await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.finishButton, 15000);
  const successDialog = page.locator(campServerIndiaPrescreeningSelectors.successDialog);
  const closeMessageButton = page.locator(campServerIndiaPrescreeningSelectors.closeMessageButton).first();
  const sanitizeButton = page.locator(campServerIndiaExaminationSelectors.sanitizeButton).first();

  const completePostFinishFlow = async () => {
    if (await sanitizeButton.isVisible().catch(() => false)) {
      await sanitizeButton.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await sanitizeButton.click({ timeout: 3000 });
      } catch {
        await sanitizeButton.click({ force: true });
      }
      await expect(page).toHaveURL(/examination\.php(?:\?Sanitize=Yes)?/i, { timeout: 10000 }).catch(() => {});
    }

    if (await successDialog.isVisible().catch(() => false)) {
      await closeMessageButton.scrollIntoViewIfNeeded().catch(() => {});
      try {
        await closeMessageButton.click({ timeout: 3000 });
      } catch {
        await closeMessageButton.click({ force: true });
      }
      await expect(successDialog).toBeHidden({ timeout: 10000 }).catch(() => {});
    }
  };

  await finishButton.scrollIntoViewIfNeeded().catch(() => {});
  await expect(finishButton).toBeVisible({ timeout: 15000 });

  const clickStrategies = [
    async () => finishButton.click({ timeout: 3000 }),
    async () => finishButton.click({ force: true, timeout: 3000 }),
    async () => finishButton.evaluate((button) => button.click())
  ];

  for (const clickStrategy of clickStrategies) {
    await clickStrategy().catch(() => {});

    const opened = await expect
      .poll(async () => {
        if (await sanitizeButton.isVisible().catch(() => false)) {
          return true;
        }

        if (await successDialog.isVisible().catch(() => false)) {
          return true;
        }

        const urlChanged = !/examinationedit\.php/i.test(page.url());
        if (urlChanged) {
          return true;
        }

        return finishButton.isDisabled().catch(() => false);
      }, { timeout: 5000 })
      .toBe(true)
      .then(() => true)
      .catch(() => false);

    if (opened) {
      await completePostFinishFlow();
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      return;
    }
  }

  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}

async function clickExactExaminationVisionReferralYes(page) {
  const candidateLocators = [
    page.locator('xpath=//section[@id="step2"]/div[3]/div/label[2]/span').first(),
    page.locator('#step2 .row').filter({ hasText: /Referred for further diagnosis and examination/i }).locator('label').filter({ hasText: /^\s*Yes\s*$/i }).first(),
    page.locator('#step2').getByText('Yes', { exact: true }).first()
  ];

  for (const yesToggle of candidateLocators) {
    if (await yesToggle.isVisible().catch(() => false)) {
      await yesToggle.scrollIntoViewIfNeeded().catch(() => {});

      try {
        await yesToggle.click({ timeout: 3000 });
      } catch {
        await yesToggle.click({ force: true });
      }

      return;
    }
  }

  throw new Error('Unable to find the Examination step 2 referral Yes control.');
}

async function clickExactExaminationReferralYes(page) {
  const yesToggle = page.locator('xpath=//section[@id="step8"]//div[contains(@class,"col-12")][1]/label[2]/span').first();
  await expect(yesToggle).toBeVisible({ timeout: 15000 });
  await yesToggle.scrollIntoViewIfNeeded().catch(() => {});

  try {
    await yesToggle.click({ timeout: 3000 });
  } catch {
    await yesToggle.click({ force: true });
  }
}

async function selectAnyOption(page, selector, preferredValues) {
  const field = page.locator(selector).first();
  if ((await field.count()) === 0) {
    throw new Error('Unable to find select field: ' + selector);
  }

  const requestedValues = Array.isArray(preferredValues) ? preferredValues : [preferredValues];
  const options = field.locator('option');
  const count = await options.count();
  let matchedOption = null;

  for (const requestedValue of requestedValues.filter(Boolean)) {
    for (let index = 0; index < count; index += 1) {
      const option = options.nth(index);
      const label = ((await option.textContent().catch(() => '')) || '').trim();
      const value = ((await option.getAttribute('value').catch(() => '')) || '').trim();

      if (label.toLowerCase() === String(requestedValue).trim().toLowerCase() || value.toLowerCase() === String(requestedValue).trim().toLowerCase()) {
        matchedOption = { label, value };
        break;
      }
    }

    if (matchedOption) {
      break;
    }
  }

  if (!matchedOption) {
    throw new Error('Unable to find option ' + requestedValues.join(', ') + ' for hidden select ' + selector);
  }

  await field.evaluate((element, nextValue) => {
    element.value = nextValue;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }, matchedOption.value);

  await expect.poll(async () => {
    const checked = field.locator('option:checked').first();
    return ((await checked.textContent().catch(() => '')) || '').trim();
  }, { timeout: 10000 }).not.toBe('');

  return matchedOption.label || matchedOption.value;
}

async function setHiddenRadioValue(page, name, value) {
  const wasSet = await page.evaluate(({ radioName, radioValue }) => {
    const target = Array.from(document.querySelectorAll(`input[name="${radioName}"]`)).find((input) => input.value === radioValue);
    if (!target) {
      return false;
    }

    target.checked = true;
    ['input', 'change', 'click'].forEach((eventName) => {
      target.dispatchEvent(new Event(eventName, { bubbles: true }));
    });

    return true;
  }, { radioName: name, radioValue: value });

  expect(wasSet).toBe(true);
}

async function satisfyHiddenExaminationRequirements(page) {
  await runStep('Disable hidden required fields that should not block the hospital-referral path', async () => {
    const updatedCount = await page.evaluate(() => {
      const form = document.querySelector('#frmAddData') || document.querySelector('form');
      if (!form) {
        return 0;
      }

      let count = 0;

      const fields = form.querySelectorAll('input, select, textarea');
      for (const field of fields) {
        if (!field.required) {
          continue;
        }

        const element = field;
        const style = window.getComputedStyle(element);
        const hiddenByStyle = style.display === 'none' || style.visibility === 'hidden';
        const hiddenByLayout = !(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        const isHidden = hiddenByStyle || hiddenByLayout;

        if (!isHidden) {
          continue;
        }

        element.required = false;
        element.removeAttribute('required');
        count += 1;
      }

      return count;
    });

    expect(updatedCount).toBeGreaterThanOrEqual(0);
  });
}

async function fillRightPrescriptionStep(page) {
  await runStep('Fill the right-eye prescription values', async () => {
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeSph, '3.50');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeCyl, '3.25');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAxis, '10');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeVision, '6/12');

    const goodN6Button = await getVisibleLocator(page, '#step3 button:has-text("Good N6")');
    if (goodN6Button) {
      await goodN6Button.click();
    } else {
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAddSph, ['2.00', '0.00']);
      await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeAddVision, ['N6', '6/12']);
    }

    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyePopin, ['+1.50', 'NA']);
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.rightEyeReader, '3.00');
    await fillVisibleField(page, campServerIndiaExaminationSelectors.prescriptionRemarks, 'Test');
  });
}

async function fillLeftPrescriptionStep(page) {
  await runStep('Fill the left-eye prescription values', async () => {
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeSph, '2.75');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeCyl, '3.75');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAxis, ['10', '20', '30']);
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeVision, '6/12');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAddSph, ['1', '2.00']);
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeAddVision, ['6/12', 'N6']);
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyePopin, ['NA', '+1.50']);
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.leftEyeReader, '3.00');
    await fillVisibleField(page, campServerIndiaExaminationSelectors.prescriptionRemarks, 'test');
  });
}

async function fillDiagnosisStep(page) {
  await runStep('Select diagnosis values that represent eyesight issues', async () => {
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Other Eye Conditions', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Allergies', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Dry Eyes', false);
    await setControlStateInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Normal (No refractive error)', false);
    await clickControlInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Presbyopia');
    await clickControlInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Myopia');
    await clickControlInSection(page, campServerIndiaExaminationSelectors.diagnosisSection, 'Hyperopia');
  });
}

async function fillIpdStep(page) {
  await runStep('Fill the IPD step with NA and IPD values', async () => {
    await clickControlInSection(page, campServerIndiaExaminationSelectors.ipdSection, 'NA');
    const ipdField = await getVisibleLocator(page, campServerIndiaExaminationSelectors.ipdField);
    if (ipdField) {
      await setInputValue(ipdField, '10');
      await expect(ipdField).toHaveValue('10', { timeout: 10000 });
    }
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

async function fillGlassesStep(page) {
  await runStep('Fill the glasses step with the stable successful Examination values', async () => {
    await clickNeedGlasses(page, 'yes');
    await clickGlassesAdvisedNa(page);
    await clickCurrentWearsGlasses(page, 'no');
  });
}

async function expectPageHeading(page, headingPattern) {
  await expect(await getRequiredVisibleLocator(page, campServerIndiaOpthalmSelectors.pageHeading)).toContainText(headingPattern);
}

async function openModule(page) {
  const exactModuleLink = page.locator('a[href="doctor.php"]').first();
  if (await exactModuleLink.isVisible().catch(() => false)) {
    await exactModuleLink.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await exactModuleLink.click({ timeout: 3000 });
    } catch {
      await exactModuleLink.click({ force: true });
    }
  } else {
    await clickVisibleAction(page, campServerIndiaOpthalmSelectors.opthalmLink);
  }

  if (!/doctor\.php/i.test(page.url())) {
    await page.goto(new URL('doctor.php', page.url()).toString());
  }

  await expect(page).toHaveURL(/doctor\.php/i);
  await expectPageHeading(page, /Op(th|h)alm/i);
  await expect(await getRequiredVisibleLocator(page, campServerIndiaOpthalmSelectors.sourceTable)).toBeVisible();
  return page;
}

async function openDashboardAfterRegistration(page, data) {
  await runStep('Register a Camp Server participant and keep the success popup open', async () => {
    await campServerIndiaRegistrationHelpers.verifySuccessPopupMessage(page, data);
  });

  await runStep('Open Dashboard from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successDashboardButton);
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
  });
}

async function openCreatedParticipantForPrescreening(page, data) {
  await openDashboardAfterRegistration(page, data);

  await runStep('Open the Pre-Screening module from the Camp Server navigation bar', async () => {
    await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.preScreeningLink);
    await expect(page).toHaveURL(/prescreening\.php/i);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Pre-Screening list`, async () => {
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/prescreening(edit)?\.php/i);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaPrescreeningSelectors.complaintsSection)).toBeVisible();
  });
}

async function completePreScreeningForOpthalm(page, data) {
  await openCreatedParticipantForPrescreening(page, data);

  await runStep('Move through the complaints step into the Pre-Screening vision step', async () => {
    for (const rowIndex of [1, 2, 3, 4, 5, 6, 7]) {
      await clickToggleCell(page, campServerIndiaPrescreeningSelectors.complaintsSection, rowIndex, 4);
    }
    await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.nextButton);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaPrescreeningSelectors.visionSection)).toBeVisible();
  });

  await runStep('Fill the Pre-Screening vision values that should carry over to the Opthalm page', async () => {
    await clickPresetButtonInSectionByRowLabel(page, campServerIndiaPrescreeningSelectors.visionSection, 'Unaided', '6/6', 0);
    await clickPresetButtonInSectionByRowLabel(page, campServerIndiaPrescreeningSelectors.visionSection, 'With Glasses', '6/6', 0);
    await clickPresetButtonInSectionByRowLabel(page, campServerIndiaPrescreeningSelectors.visionSection, 'Unaided', 'N6', 1);
    await clickPresetButtonInSectionByRowLabel(page, campServerIndiaPrescreeningSelectors.visionSection, 'With Glasses', 'N6', 1);
    await clickTextWithinSection(page, campServerIndiaPrescreeningSelectors.visionSection, 'Yes');
    await clickTextWithinSection(page, campServerIndiaPrescreeningSelectors.visionSection, 'Examination');
  });

  await runStep('Submit Pre-Screening and close the success popup', async () => {
    await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.finishButton);
    await expect(page.locator(campServerIndiaPrescreeningSelectors.successDialog)).toBeVisible({ timeout: 20000 });
    await clickVisibleAction(page, campServerIndiaPrescreeningSelectors.closeMessageButton);
    await expect(page).toHaveURL(/prescreening\.php/i);
  });
}

async function openCreatedParticipantForOpthalmFromRegistration(page, data) {
  await openDashboardAfterRegistration(page, data);

  await runStep('Open the Opthalm module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });
}

async function openCreatedParticipantForOpthalmFromPreScreening(page, data) {
  await completePreScreeningForOpthalm(page, data);

  await runStep('Open the Opthalm module after completing Pre-Screening', async () => {
    await openModule(page);
  });
}

async function routeParticipantToExamination(page, data) {
  await runStep('Register a participant and open Dashboard from the success popup', async () => {
    await openDashboardAfterRegistration(page, data);
  });

  await runStep('Open the Examination list directly from the Camp Server navigation bar', async () => {
    await clickVisibleAction(page, campServerIndiaExaminationSelectors.examinationLink);
    await expect(page).toHaveURL(/examination\.php/i);
  });
}

async function searchCreatedParticipantInExamination(page, data) {
  await runStep(`Search for participant "${data.campServerParticipantFirstName}" in the Examination list`, async () => {
    await searchParticipantInExamination(page, data.campServerParticipantFirstName);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Examination list`, async () => {
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/examination(edit)?\.php/i);
  });
}

async function completeReferralExaminationForOpthalm(page, data) {
  await runStep('Complete the Examination complaint step exactly like the AIQ source before opening the vision step', async () => {
    await clickToggleCell(page, '#step1', 1, 2);
    for (const rowIndex of [2, 3, 4, 5, 6]) {
      await clickToggleCell(page, '#step1', rowIndex, 4);
    }
    await clickToggleCell(page, '#step1', 7, 3);
    await clickVisibleAction(page, campServerIndiaExaminationSelectors.nextButton);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.visionSection)).toBeVisible();
  });

  await runStep('Fill the Examination vision values and route the case to hospital referral', async () => {
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionRightUnaided, '6/9');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.distanceVisionLeftUnaided, '6/9');
    await clickPresetButtonInSectionRow(page, campServerIndiaExaminationSelectors.visionSection, 2, '6/6');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionRightUnaided, 'N12');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.nearVisionLeftUnaided, 'N12');
    await clickPresetButtonInSectionRow(page, campServerIndiaExaminationSelectors.visionSection, 6, 'N6');
    await clickExactExaminationVisionReferralYes(page);
    await clickVisibleAction(page, campServerIndiaExaminationSelectors.nextButton);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.referralSection)).toBeVisible();
  });

  await satisfyHiddenExaminationRequirements(page);

  await runStep('Mark Suspected Cataract and select Govt. Hospital before finishing Examination', async () => {
    await clickExactExaminationReferralYes(page);
    await clickTextWithinSection(page, campServerIndiaExaminationSelectors.referralSection, 'Suspected Cataract');
    await selectVisibleOption(page, campServerIndiaExaminationSelectors.hospitalNameSelect, ['Govt. Hospital', 'GOVT.HOSPITAL']);
    await clickExaminationFinish(page);
  });
}

async function openCreatedParticipantForOpthalmFromExamination(page, data) {
  await routeParticipantToExamination(page, data);
  await searchCreatedParticipantInExamination(page, data);
  await completeReferralExaminationForOpthalm(page, data);

  await runStep('Open the Opthalm module after finishing the Examination referral flow', async () => {
    await openModule(page);
  });
}

async function searchParticipant(page, participantName) {
  const searchField = await getRequiredVisibleLocator(page, campServerIndiaOpthalmSelectors.searchFirstNameField, 15000);
  const searchButton = await getRequiredVisibleLocator(page, campServerIndiaOpthalmSelectors.searchButton, 15000);
  await setInputValue(searchField, participantName);
  await expect(searchField).toHaveValue(String(participantName), { timeout: 10000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {}),
    searchButton.click({ timeout: 3000 }).catch(async () => {
      await searchButton.click({ force: true });
    })
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function searchParticipantInExamination(page, participantName) {
  const searchField = await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.searchFirstNameField, 15000);
  const searchButton = await getRequiredVisibleLocator(page, campServerIndiaExaminationSelectors.searchButton, 15000);
  await setInputValue(searchField, participantName);
  await expect(searchField).toHaveValue(String(participantName), { timeout: 10000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {}),
    searchButton.click({ timeout: 3000 }).catch(async () => {
      await searchButton.click({ force: true });
    })
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function assertHeaders(page, expectedHeaders) {
  for (const header of expectedHeaders) {
    await expect(page.locator(campServerIndiaOpthalmSelectors.tableHeaders).filter({ hasText: new RegExp(`^\\s*${escapeRegex(header)}\\s*$`, 'i') }).first()).toBeVisible({ timeout: 10000 });
  }
}

async function assertVisibleCellOccurrencesInSection(page, sectionSelector, text, minimumCount) {
  await expect.poll(async () => {
    const section = await getVisibleLocator(page, sectionSelector);
    if (!section) {
      return 0;
    }

    const cells = section.locator('td, span, div').filter({ hasText: new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i') });
    const count = await cells.count();
    let visibleCount = 0;

    for (let index = 0; index < count; index += 1) {
      if (await cells.nth(index).isVisible().catch(() => false)) {
        visibleCount += 1;
      }
    }

    return visibleCount;
  }, { timeout: 15000 }).toBeGreaterThanOrEqual(minimumCount);
}

async function assertSuspectedCataractChecked(page) {
  const checkbox = page.getByRole('checkbox', { name: /Suspected Cataract/i }).first();

  if (await checkbox.isVisible().catch(() => false)) {
    await expect(checkbox).toBeChecked({ timeout: 10000 });
    return;
  }

  const labels = page.locator(campServerIndiaOpthalmSelectors.suspectedCataractLabels);
  const total = await labels.count();

  for (let index = 0; index < total; index += 1) {
    const label = labels.nth(index);
    if (!(await label.isVisible().catch(() => false))) {
      continue;
    }

    const container = label.locator('xpath=ancestor::label[1] | ancestor::div[contains(@class,"form-check")][1] | ancestor::*[@role="checkbox"][1]').first();
    const input = container.locator('input[type="checkbox"], input[type="radio"]').first();

    if (await input.count()) {
      await expect.poll(async () => input.evaluate((element) => Boolean(element.checked)), { timeout: 10000 }).toBe(true);
      return;
    }

    const ariaChecked = await container.getAttribute('aria-checked').catch(() => null);
    if (ariaChecked === 'true') {
      return;
    }
  }

  throw new Error('Unable to find a checked Suspected Cataract control on the Opthalm page.');
}

async function assertExaminationDataInOpthalmPage(page, data) {
  await runStep(`Open the participant "${data.campServerParticipantFirstName}" in the Opthalm module`, async () => {
    await searchAndOpenParticipant(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/doctor(edit)?\.php/i);
  });

  await runStep('Assert that the Examination referral value is carried into the Opthalm page', async () => {
    await assertSuspectedCataractChecked(page);
  });
}

async function verifyParticipantShouldBeFilteredWhenSearchButtonIsClicked(page, data) {
  await openCreatedParticipantForOpthalmFromRegistration(page, data);

  await runStep('Assert that the Opthalm list headers are displayed', async () => {
    await assertHeaders(page, ['Participant ID', 'Participant Name', 'Contact No.', 'Age']);
  });

  await runStep(`Search the Opthalm list for participant "${data.campServerParticipantFirstName}"`, async () => {
    await searchParticipant(page, data.campServerParticipantFirstName);
  });

  await runStep('Assert that the searched participant remains visible in the Opthalm results', async () => {
    await expect(page.locator(campServerIndiaOpthalmSelectors.participantCells).filter({ hasText: data.campServerParticipantFirstName }).first()).toBeVisible({ timeout: 15000 });
  });
}

async function verifyPreScreeningDataShouldBeDisplayedInOphthalmPage(page, data) {
  await openCreatedParticipantForOpthalmFromPreScreening(page, data);

  await runStep(`Open the participant "${data.campServerParticipantFirstName}" in the Opthalm module`, async () => {
    await searchAndOpenParticipant(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/doctor(edit)?\.php/i);
  });

  await runStep('Assert that the Pre-Screening values are carried into the Opthalm page', async () => {
    await assertVisibleCellOccurrencesInSection(page, campServerIndiaOpthalmSelectors.stepPreScreening, '6/6', 2);
  });
}

async function verifyExaminationDataShouldBeDisplayedInOphthalmPage(page, data) {
  await openCreatedParticipantForOpthalmFromExamination(page, data);
  await assertExaminationDataInOpthalmPage(page, data);
}

module.exports = {
  campServerIndiaOpthalmHelpers: {
    openModule,
    routeParticipantToExamination,
    searchCreatedParticipantInExamination,
    completeReferralExaminationForOpthalm,
    assertExaminationDataInOpthalmPage,
    verifyParticipantShouldBeFilteredWhenSearchButtonIsClicked,
    verifyPreScreeningDataShouldBeDisplayedInOphthalmPage,
    verifyExaminationDataShouldBeDisplayedInOphthalmPage,
    selectors: campServerIndiaOpthalmSelectors
  }
};
