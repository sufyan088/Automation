const { expect, test } = require('@playwright/test');
const { campServerIndiaRegistrationSelectors } = require('../../selectors/source-aiq2/campServerIndiaRegistration.selectors');

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
        return;
      } catch {
        if (await candidate.isVisible().catch(() => false)) {
          await candidate.click({ force: true });
          return;
        }
      }
    }
  }

  throw new Error('Unable to find a visible action for selectors: ' + selectors);
}

async function clickNext(page) {
  await page.locator(campServerIndiaRegistrationSelectors.nextButton).click();
}

async function clickNextNoWait(page) {
  await page.locator(campServerIndiaRegistrationSelectors.nextButton).click({ noWaitAfter: true });
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

async function isVisible(page, selector) {
  return Boolean(await getVisibleLocator(page, selector));
}

async function isDepartmentStepVisible(page) {
  return page.getByText('Department', { exact: false }).first().isVisible().catch(() => false);
}

async function isIdentityStepVisible(page) {
  return Boolean(
    (await isVisible(page, campServerIndiaRegistrationSelectors.aadhaarField))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.otherIdTypeField))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.otherIdValueField))
  );
}

async function getVisibleTextbox(page) {
  return getVisibleLocator(page, 'input');
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
  }, value);
}

async function fillVisibleInput(page, selector, value, timeout = 15000) {
  const locator = await getRequiredVisibleLocator(page, selector, timeout);
  await setInputValue(locator, value);
  await expect(locator).toHaveValue(String(value));
  return locator;
}

async function fillVisibleInputLikeUser(page, selector, value, timeout = 15000) {
  const locator = await getRequiredVisibleLocator(page, selector, timeout);
  await locator.click();
  await locator.fill(String(value));
  await expect(locator).toHaveValue(String(value));
  return locator;
}

async function typeLikeUser(page, locator, value) {
  await locator.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(value, { delay: 100 });
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

async function expectSelectedOptionLabel(locator, expectedLabel) {
  await expect
    .poll(async () => {
      return locator.locator('option:checked').textContent().catch(() => '');
    }, { timeout: 20000 })
    .toBe(expectedLabel);
}

async function expectToast(page, expectedText) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const texts = await page.locator(campServerIndiaRegistrationSelectors.toastTitle).allTextContents();
      const normalizedTexts = texts.map((text) => text.trim()).filter(Boolean);

      if (normalizedTexts.length) {
        return normalizedTexts;
      }

      const pageText = await page.locator('body').innerText().catch(() => '');
      return expectedValues.filter((value) => pageText.includes(value));
    }, { timeout: 10000 })
    .toEqual(expect.arrayContaining(expectedValues));
}

async function expectInvalidDrivingLicenseMessage(page, expectedText) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];
  const toastLocator = page.locator(campServerIndiaRegistrationSelectors.toastTitle);

  const directToastMatch = await toastLocator
    .filter({ hasText: /DL No\. should be atleast 6 character(s)?/i })
    .first()
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (directToastMatch) {
    return;
  }

  await expect
    .poll(async () => {
      const texts = await toastLocator.allTextContents();
      const normalizedTexts = texts.map((text) => text.trim()).filter(Boolean);

      if (normalizedTexts.length) {
        return normalizedTexts;
      }

      const pageText = await page.locator('body').innerText().catch(() => '');
      return expectedValues.filter((value) => pageText.includes(value));
    }, { timeout: 10000 })
    .toEqual(expect.arrayContaining(expectedValues));
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.registrationLink);
  await expect(page.locator(campServerIndiaRegistrationSelectors.firstNameField)).toBeVisible({ timeout: 15000 });
  return page;
}

async function fillStep1(page, data, options = {}) {
  await page.locator(campServerIndiaRegistrationSelectors.firstNameField).fill(options.firstName ?? data.campServerParticipantFirstName);
  await page.locator(campServerIndiaRegistrationSelectors.lastNameField).fill(options.lastName ?? data.campServerParticipantLastName);
}

async function fillStep2(page, data) {
  await page.locator(campServerIndiaRegistrationSelectors.contactNumberField).fill(data.campServerContactNumber);
}

async function fillStep3(page, age) {
  await page.locator(campServerIndiaRegistrationSelectors.ageField).fill(String(age));
  await page.locator(campServerIndiaRegistrationSelectors.maleLabel).click();
}

async function fillStep4(page) {
  await page.locator(campServerIndiaRegistrationSelectors.covidTemperatureField).fill('96');

  const noOptions = page.locator(campServerIndiaRegistrationSelectors.covidNoOptions);
  const noOptionCount = Math.min(await noOptions.count(), 7);

  for (let index = 0; index < noOptionCount; index += 1) {
    await noOptions.nth(index).click();
  }

  await page.locator(campServerIndiaRegistrationSelectors.covidEntryAllowedYes).click();
}

async function fillStep5(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.vaccinationTwoDoseLabel);
}

async function fillStep6(page, data) {
  const secondaryContactNameField = await getVisibleLocator(page, campServerIndiaRegistrationSelectors.secondaryContactNameField);

  if (secondaryContactNameField) {
    await setInputValue(secondaryContactNameField, data.campServerFatherName || 'Smith');
    await expect(secondaryContactNameField).toHaveValue(data.campServerFatherName || 'Smith');
  } else {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.secondaryContactNaButton);
  }

  const secondaryContactPhoneField = await getVisibleLocator(page, campServerIndiaRegistrationSelectors.secondaryContactPhoneField);

  if (secondaryContactPhoneField) {
    await setInputValue(secondaryContactPhoneField, '1234567890');
    await expect(secondaryContactPhoneField).toHaveValue('1234567890');
  } else {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.secondaryContactNoPhoneButton);
  }
}

async function fillStep7(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.villageNaButton);
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.districtNaButton);
}

async function fillStep8(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.departmentNaButton);
}

async function fillDepartmentStep(page, data) {
  const departmentValue = data.campServerDepartment || 'Administration';
  const departmentField = await getVisibleLocator(page, campServerIndiaRegistrationSelectors.departmentField);

  if (departmentField) {
    await departmentField.click();
    await departmentField.fill(String(departmentValue));
    await expect(departmentField).toHaveValue(departmentValue);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.departmentNaButton)) {
    await fillStep8(page);
    return true;
  }

  return false;
}

async function fillAddressStep(page, data) {
  await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.addressLine1Field, data.campServerAddressLine1);
  await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.addressLine2Field, data.campServerAddressLine2);
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.villageNaButton);

  const stateField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField);
  await stateField.selectOption({ label: data.campServerState });

  const districtField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.districtField);
  await districtField.selectOption({ label: data.campServerDistrict });

  await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.cityField, data.campServerCity);
  await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.postalCodeField, data.campServerPostalCode);
}

async function progressVisibleStep(page, data) {
  if (await isIdentityStepVisible(page)) {
    return false;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.secondaryContactNaButton)) {
    await fillStep6(page, data);
    await clickNext(page);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.covidTemperatureField)) {
    await fillStep4(page);
    await clickNext(page);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.vaccinationTwoDoseLabel)) {
    await fillStep5(page);
    await clickNext(page);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.addressLine1Field)) {
    await fillVisibleInput(page, campServerIndiaRegistrationSelectors.addressLine1Field, data.campServerAddressLine1);
    await fillVisibleInput(page, campServerIndiaRegistrationSelectors.addressLine2Field, data.campServerAddressLine2);

    if (await isVisible(page, campServerIndiaRegistrationSelectors.stateField)) {
      await (await getVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField)).selectOption({ label: data.campServerState });
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.villageNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.villageNaButton);
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.districtNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.districtNaButton);
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.districtField)) {
      const districtField = await getVisibleLocator(page, campServerIndiaRegistrationSelectors.districtField);
      const options = await districtField.locator('option').allTextContents();
      const matchingOption = options.find((option) => option.trim() === data.campServerDistrict);

      if (matchingOption) {
        await districtField.selectOption({ label: matchingOption.trim() });
      }
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.districtOtherField)) {
      await fillVisibleInput(page, campServerIndiaRegistrationSelectors.districtOtherField, data.campServerDistrict);
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.cityField)) {
      await fillVisibleInput(page, campServerIndiaRegistrationSelectors.cityField, data.campServerCity);
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.postalCodeField)) {
      await fillVisibleInput(page, campServerIndiaRegistrationSelectors.postalCodeField, data.campServerPostalCode);
    }

    await clickNext(page);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.departmentField)) {
    await fillDepartmentStep(page, data);
    await clickNext(page);

    return true;
  }

  if (await isDepartmentStepVisible(page)) {
    await fillDepartmentStep(page, data);

    await clickNext(page);
    return true;
  }

  if (await isVisible(page, campServerIndiaRegistrationSelectors.villageNaButton)) {
    await fillStep7(page);
    await clickNext(page);
    return true;
  }

  if (await isDepartmentStepVisible(page) && await isVisible(page, campServerIndiaRegistrationSelectors.departmentNaButton)) {
    await fillStep8(page);
    await clickNext(page);
    return true;
  }

  return false;
}

async function waitForIdentityStep(page, timeout = 30000) {
  await expect.poll(async () => isIdentityStepVisible(page), { timeout }).toBe(true);
}

async function progressToIdentityStep(page, data, maxAttempts = 10) {
  for (let attempts = 0; attempts < maxAttempts; attempts += 1) {
    if (await isIdentityStepVisible(page)) {
      return;
    }

    const progressed = await progressVisibleStep(page, data);

    if (!progressed) {
      break;
    }

    if (await isIdentityStepVisible(page)) {
      return;
    }

    if (await isDepartmentStepVisible(page)) {
      for (let retry = 0; retry < 3; retry += 1) {
        await clickNext(page);

        const reachedIdentityStep = await expect
          .poll(async () => isIdentityStepVisible(page), { timeout: 4000 })
          .toBe(true)
          .then(() => true)
          .catch(() => false);

        if (reachedIdentityStep) {
          return;
        }

        if (!await isDepartmentStepVisible(page)) {
          break;
        }
      }
    }
  }

  await waitForIdentityStep(page);
}

async function advanceToIdentityStep(page, data) {
  await openModule(page);
  await fillStep1(page, data);
  await clickNext(page);
  await expect(page.locator(campServerIndiaRegistrationSelectors.contactNumberField)).toBeVisible({ timeout: 10000 });
  await fillStep2(page, data);
  await clickNext(page);
  await expect(page.locator(campServerIndiaRegistrationSelectors.ageField)).toBeVisible({ timeout: 10000 });
  await fillStep3(page, 24);
  await clickNext(page);

  await progressToIdentityStep(page, data);
}

async function advanceToInvalidDrivingLicenseStep(page, data) {
  await runStep('Open the Camp Server Registration page', async () => {
    await openModule(page);
  });

  await runStep(`Enter Participant First Name "${data.campServerParticipantFirstName}" and Last Name "${data.campServerParticipantLastName}"`, async () => {
    await fillStep1(page, data);
  });

  await runStep('Click Next to move from Participant Name to Contact Number', async () => {
    await clickNext(page);
    await expect(page.locator(campServerIndiaRegistrationSelectors.contactNumberField)).toBeVisible({ timeout: 10000 });
  });

  await runStep(`Enter Contact Number "${data.campServerContactNumber}"`, async () => {
    await fillStep2(page, data);
  });

  await runStep('Click Next to move from Contact Number to Age and Gender', async () => {
    await clickNext(page);
    await expect(page.locator(campServerIndiaRegistrationSelectors.ageField)).toBeVisible({ timeout: 10000 });
  });

  await runStep('Enter Age "24" and select Gender "Male"', async () => {
    await fillStep3(page, 24);
  });

  await runStep('Click Next to move from Age and Gender to Secondary Contact details', async () => {
    await clickNext(page);
  });

  await runStep(`Enter Secondary Contact Name "${data.campServerFatherName || 'Smith'}" and Secondary Contact Phone "1234567890"`, async () => {
    await fillStep6(page, data);
  });

  await runStep(`Enter Address Line 1 "${data.campServerAddressLine1}", Address Line 2 "${data.campServerAddressLine2}", select State "${data.campServerState}", select District "${data.campServerDistrict}", enter City "${data.campServerCity}", and Postal Code "${data.campServerPostalCode}"`, async () => {
    if (await isVisible(page, campServerIndiaRegistrationSelectors.addressLine1Field)) {
      await fillAddressStep(page, data);
      return;
    }

    await clickNext(page);
    await fillAddressStep(page, data);
  });

  await runStep('Click Next to move from Address details to Department', async () => {
    await clickNext(page);
  });

  await runStep(`Enter Department "${data.campServerDepartment || 'Administration'}"`, async () => {
    await fillDepartmentStep(page, data);
  });

  await runStep('Click Next to move from Department to Aadhaar and ID Proof details', async () => {
    await clickNext(page);
    await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.aadhaarField, 20000);
    await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.otherIdTypeField, 20000);
    await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.otherIdValueField, 20000);
  });
}

async function verifyLogout(page) {
  await runStep('Click the Logout link from the Camp Server navigation bar', async () => {
    await page.locator(campServerIndiaRegistrationSelectors.logoutLink).click();
  });

  await runStep('Assert that the user is redirected to the logout URL', async () => {
    await expect(page).toHaveURL(/index\.php\?opt=logout$/);
  });
}

async function verifyFirstNameRequired(page) {
  await runStep('Open the Camp Server Registration page', async () => {
    await openModule(page);
  });

  await runStep('Leave Participant First Name blank and enter Last Name "Jones"', async () => {
    await fillStep1(page, {}, { firstName: '', lastName: 'Jones' });
  });

  await runStep('Click Next to submit the Participant Name step', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the validation message "First Name cannot be left blank." is displayed', async () => {
    await expectToast(page, 'First Name cannot be left blank.');
  });
}

async function verifyAgeUpperBound(page, data) {
  await runStep('Open the Camp Server Registration page', async () => {
    await openModule(page);
  });

  await runStep(`Enter Participant First Name "${data.campServerParticipantFirstName}" and Last Name "${data.campServerParticipantLastName}"`, async () => {
    await fillStep1(page, data);
  });

  await runStep('Click Next to move from Participant Name to Contact Number', async () => {
    await clickNext(page);
  });

  await runStep(`Enter Contact Number "${data.campServerContactNumber}"`, async () => {
    await fillStep2(page, data);
  });

  await runStep('Click Next to move from Contact Number to Age and Gender', async () => {
    await clickNext(page);
  });

  await runStep('Enter Age "112" and select Gender "Male"', async () => {
    await fillStep3(page, 112);
  });

  await runStep('Click Next to submit the Age and Gender step', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the validation message "Age should be between 0 and 110" is displayed', async () => {
    await expectToast(page, 'Age should be between 0 and 110');
  });
}

async function verifyInvalidDrivingLicense(page, data) {
  await advanceToInvalidDrivingLicenseStep(page, data);
  await runStep(`Enter Aadhaar Number "${data.campServerAadhaarNumber}", select ID Proof Type "Driving License No.", and enter invalid Driving License Number "5555"`, async () => {
    const aadhaarField = await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.aadhaarField, data.campServerAadhaarNumber);
    const otherIdTypeField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.otherIdTypeField);
    const otherIdValueField = await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.otherIdValueField, '5555');

    await setSelectValue(otherIdTypeField, 'Driving License No.');
    await expectSelectedOptionLabel(otherIdTypeField, 'Driving License No.');
    await expect(aadhaarField).toHaveValue(data.campServerAadhaarNumber);
    await expect(otherIdValueField).toHaveValue('5555');
    await otherIdValueField.press('Tab');
  });

  await runStep('Click Next to submit Aadhaar and ID Proof details', async () => {
    await clickNextNoWait(page);
  });

  await runStep('Assert that the validation message for invalid Driving License length is displayed', async () => {
    await expectInvalidDrivingLicenseMessage(page, [
      'DL No. should be atleast 6 character',
      'DL No. should be atleast 6 characters'
    ]);
  });
}

async function verifyDashboardStations(page) {
  await runStep('Click the Dashboard link from the Camp Server navigation bar', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.dashboardLink);
  });

  await runStep('Assert that the Camp Server Dashboard is visible', async () => {
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
  });

  for (const cardText of campServerIndiaRegistrationSelectors.dashboardCardLabels) {
    await runStep(`Assert that the station card "${cardText}" is displayed on the Dashboard`, async () => {
      await expect(page.getByText(cardText, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    });
  }
}

module.exports = {
  campServerIndiaRegistrationHelpers: {
    openModule,
    verifyLogout,
    verifyFirstNameRequired,
    verifyAgeUpperBound,
    verifyInvalidDrivingLicense,
    verifyDashboardStations,
    selectors: campServerIndiaRegistrationSelectors
  }
};
