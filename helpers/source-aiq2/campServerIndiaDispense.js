const { expect, test } = require('@playwright/test');
const { campServerIndiaExaminationHelpers } = require('./campServerIndiaExamination');
const { campServerIndiaDispenseSelectors } = require('../../selectors/source-aiq2/campServerIndiaDispense.selectors');

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
      return matching.label || matching.value;
    }
  }

  const fallback = options.find((option) => {
    const normalized = option.label.toLowerCase();
    if (!option.label && !option.value) {
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

async function hasSelectableOption(locator, preferredValues) {
  const requested = Array.isArray(preferredValues) ? preferredValues.filter(Boolean) : [preferredValues].filter(Boolean);

  return locator.locator('option').evaluateAll((options, requestedValues) => {
    return options.some((option) => {
      if (option.disabled) {
        return false;
      }

      const label = (option.textContent || '').trim();
      const value = (option.value || '').trim();

      if (requestedValues.length) {
        return requestedValues.includes(label) || requestedValues.includes(value);
      }

      if (!label && !value) {
        return false;
      }

      return !/^(-+|--|select|choose|please)/i.test(label.toLowerCase());
    });
  }, requested);
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

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      await page.waitForLoadState('domcontentloaded').catch(() => {});

      const toastTexts = await page.locator(campServerIndiaDispenseSelectors.toastMessages).allTextContents().catch(() => []);
      const normalizedToastTexts = toastTexts.map((text) => text.trim()).filter(Boolean);

      if (normalizedToastTexts.length) {
        return normalizedToastTexts;
      }

      const pageText = await page.locator('body').innerText().catch(() => '');
      return expectedValues.filter((value) => pageText.includes(value));
    }, { timeout })
    .toEqual(expect.arrayContaining(expectedValues));
}

async function findParticipantCell(page, participantName) {
  const exactCell = page.getByRole('cell', { name: participantName, exact: true }).first();
  if (await exactCell.isVisible().catch(() => false)) {
    return exactCell;
  }

  const partialCell = page.locator(campServerIndiaDispenseSelectors.participantCells).filter({ hasText: participantName }).first();
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

  await participantCell.click();
}

async function waitForParticipantInDispenseQueue(page, participantName, timeout = 45000) {
  await expect.poll(async () => Boolean(await findParticipantCell(page, participantName)), { timeout }).toBe(true);
  return findParticipantCell(page, participantName);
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

async function clickNext(page) {
  await clickVisibleAction(page, campServerIndiaDispenseSelectors.nextButton);
}

async function clickFinish(page) {
  await clickVisibleAction(page, campServerIndiaDispenseSelectors.finishButton);
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaDispenseSelectors.dispenseLink);
  await expect(page).toHaveURL(/dispatch\.php/i);
  await expect(await getRequiredVisibleLocator(page, campServerIndiaDispenseSelectors.pageHeading)).toContainText(/Dispense/i);
  return page;
}

async function routeParticipantToDispense(page, data) {
  await runStep('Register, pre-screen, route, and complete the Examination flow so the participant reaches Dispense', async () => {
    await campServerIndiaExaminationHelpers.completeSuccessfulExamination(page, data);
  });
}

async function openCreatedParticipantForDispense(page, data) {
  await routeParticipantToDispense(page, data);

  await runStep('Open the Dispense module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });

  await runStep(`Open the created participant "${data.campServerParticipantFirstName}" from the Dispense queue`, async () => {
    await waitForParticipantInDispenseQueue(page, data.campServerParticipantFirstName);
    await clickParticipantByName(page, data.campServerParticipantFirstName);
    await expect(page).toHaveURL(/dispatch(edit)?\.php/i);
  });
}

async function chooseTaking(page) {
  await runStep('Click the Taking option on the first Dispense step', async () => {
    await clickTextWithinSection(page, campServerIndiaDispenseSelectors.step1, 'Taking');
  });
}

async function chooseNotTaking(page) {
  await runStep('Click the Not Taking option on the first Dispense step', async () => {
    await clickTextWithinSection(page, campServerIndiaDispenseSelectors.step1, 'Not Taking');
  });
}

async function expectNotTakingFieldDisabledOrHidden(page) {
  const field = await getVisibleLocator(page, campServerIndiaDispenseSelectors.notTakingReasonSelect);
  if (!field) {
    return;
  }

  await expect(field).toBeDisabled();
}

async function expectOtherTextboxDisabledOrHidden(page) {
  const field = await getVisibleLocator(page, campServerIndiaDispenseSelectors.notTakingOtherTextbox);
  if (!field) {
    return;
  }

  await expect(field).toBeDisabled();
}

async function selectNotTakingReason(page, preferredValues) {
  await runStep(`Select the Not Taking Reason value ${Array.isArray(preferredValues) ? preferredValues[0] : preferredValues}`, async () => {
    await selectVisibleOption(page, campServerIndiaDispenseSelectors.notTakingReasonSelect, preferredValues);
  });
}

async function proceedTakingToFrameDetails(page) {
  await runStep('Move through the taking flow until the frame-details step is displayed', async () => {
    await clickNext(page);
    await getSection(page, campServerIndiaDispenseSelectors.step2);
    await clickNext(page);
    await clickNext(page);
    await getSection(page, campServerIndiaDispenseSelectors.step4);
  });
}

async function selectTakingYesDispenseDetails(page) {
  await runStep('Fill the taking flow dispense details for a first-time wearer', async () => {
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 1, 2);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 5, 2);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 8, 4);
  });
}

async function selectNeedNewPowerDetails(page) {
  await runStep('Fill the taking flow details for a current glasses wearer needing new power', async () => {
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 1, 3);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 2, 2);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 3, 2);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 5, 2);
    await clickToggleCell(page, campServerIndiaDispenseSelectors.step2, 8, 4);
  });
}

async function fillFrameDetails(page) {
  await runStep('Fill the frame details required to finish the Dispense flow', async () => {
    await fillVisibleField(page, campServerIndiaDispenseSelectors.frameModelField, 'Round Glasses');
    await selectVisibleOption(page, campServerIndiaDispenseSelectors.frameColorSelect, 'Red');
    await selectVisibleOption(page, campServerIndiaDispenseSelectors.tasselSelect, 'Yes');

    const frameType = await getVisibleLocator(page, campServerIndiaDispenseSelectors.frameTypeSelect);
    if (frameType && await hasSelectableOption(frameType, ['Metal', 'Plastic'])) {
      await selectVisibleOption(page, campServerIndiaDispenseSelectors.frameTypeSelect, ['Metal', 'Plastic']);
    }

    await selectVisibleOption(page, campServerIndiaDispenseSelectors.caseSelect, 'Yes');
    await selectVisibleOption(page, campServerIndiaDispenseSelectors.selvetSelect, 'Yes');
  });
}

async function finishAndAssertSuccess(page) {
  await runStep('Click Finish and assert that the Dispense success message is displayed', async () => {
    await clickFinish(page);
    await expectBodyOrToastText(page, 'Dispense Updated Successfully!', 20000);
  });
}

async function verifyBackButtonShouldNotBeDisplayedOnTheIstDispensePage(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseTaking(page);

  await runStep('Assert that the Back button is not displayed on the first Dispense page', async () => {
    await expect(page.locator(campServerIndiaDispenseSelectors.backButton).first()).not.toBeVisible();
  });
}

async function verifyNextButtonShouldBeDisplayedWhenVSGlassesTakingButtonIsClicked(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseTaking(page);

  await runStep('Assert that the Next button is displayed after Taking is selected', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaDispenseSelectors.nextButton)).toBeVisible();
  });
}

async function verifyFinishButtonShouldBeDisplayedWhenVSGlassesNotTakingButtonIsClicked(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseNotTaking(page);

  await runStep('Assert that the Finish button is displayed after Not Taking is selected', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaDispenseSelectors.finishButton)).toBeVisible();
  });
}

async function verifyNotTakingDropdownShouldBeEnabledWhenVSGlassesNonTakingButtonIsClicked(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseNotTaking(page);

  await runStep('Assert that the Not Taking Reason dropdown is enabled', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaDispenseSelectors.notTakingReasonSelect)).toBeEnabled();
  });
}

async function verifyNotTakingDropdownShouldBeDisabledWhenVSGlassesTakingButtonIsClicked(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseTaking(page);

  await runStep('Assert that the Not Taking Reason dropdown is not available for the Taking path', async () => {
    await expectNotTakingFieldDisabledOrHidden(page);
  });
}

async function verifyOtherTextboxShouldBeEnbaledWhenOthersIsSelectedNotTakingReasonDropdown(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseNotTaking(page);
  await selectNotTakingReason(page, ['Other', 'Others']);

  await runStep('Assert that the Other textbox is enabled when Other is selected in Not Taking Reason', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaDispenseSelectors.notTakingOtherTextbox)).toBeEnabled();
  });
}

async function verifyOtherTextboxShouldBeDisabledWhenFramesNotGoodIsSelected(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseNotTaking(page);
  await selectNotTakingReason(page, ['Frames Not Good', 'Frames not good']);

  await runStep('Assert that the Other textbox is hidden or disabled when Frames Not Good is selected', async () => {
    await expectOtherTextboxDisabledOrHidden(page);
  });
}

async function verifyParticipantsShouldBeDispensedForGlassesTakingNo(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseNotTaking(page);
  await selectNotTakingReason(page, 'Long Delivery Period');
  await finishAndAssertSuccess(page);
}

async function verifyParticipantsShouldBeDispensedForGlassesTakingYes(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseTaking(page);
  await clickNext(page);
  await getSection(page, campServerIndiaDispenseSelectors.step2);
  await selectTakingYesDispenseDetails(page);
  await clickNext(page);
  await clickNext(page);
  await getSection(page, campServerIndiaDispenseSelectors.step4);
  await fillFrameDetails(page);
  await finishAndAssertSuccess(page);
}

async function verifyParticipantsShouldBeNeedNewPowerGlasses(page, data) {
  await openCreatedParticipantForDispense(page, data);
  await chooseTaking(page);
  await clickNext(page);
  await getSection(page, campServerIndiaDispenseSelectors.step2);
  await selectNeedNewPowerDetails(page);
  await clickNext(page);
  await clickNext(page);
  await getSection(page, campServerIndiaDispenseSelectors.step4);
  await fillFrameDetails(page);
  await finishAndAssertSuccess(page);
}

module.exports = {
  campServerIndiaDispenseHelpers: {
    openModule,
    routeParticipantToDispense,
    verifyBackButtonShouldNotBeDisplayedOnTheIstDispensePage,
    verifyNextButtonShouldBeDisplayedWhenVSGlassesTakingButtonIsClicked,
    verifyFinishButtonShouldBeDisplayedWhenVSGlassesNotTakingButtonIsClicked,
    verifyNotTakingDropdownShouldBeEnabledWhenVSGlassesNonTakingButtonIsClicked,
    verifyNotTakingDropdownShouldBeDisabledWhenVSGlassesTakingButtonIsClicked,
    verifyOtherTextboxShouldBeEnbaledWhenOthersIsSelectedNotTakingReasonDropdown,
    verifyOtherTextboxShouldBeDisabledWhenFramesNotGoodIsSelected,
    verifyParticipantsShouldBeDispensedForGlassesTakingNo,
    verifyParticipantsShouldBeDispensedForGlassesTakingYes,
    verifyParticipantsShouldBeNeedNewPowerGlasses,
    selectors: campServerIndiaDispenseSelectors
  }
};
