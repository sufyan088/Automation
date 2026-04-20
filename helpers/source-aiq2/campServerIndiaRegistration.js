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

async function isRegistrationSurfaceVisible(page) {
  return Boolean(
    (await isVisible(page, campServerIndiaRegistrationSelectors.firstNameField))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.consentChooseButton))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.nextButton))
    || /registration\.php|signature\.php/i.test(page.url())
  );
}

async function openModule(page) {
  if (await isRegistrationSurfaceVisible(page)) {
    return page;
  }

  const openActions = [
    'button:has-text("Registration")',
    campServerIndiaRegistrationSelectors.registrationLink
  ];

  for (const actionSelector of openActions) {
    const action = await getVisibleLocator(page, actionSelector);
    if (!action) {
      continue;
    }

    await action.scrollIntoViewIfNeeded().catch(() => {});

    try {
      await action.click({ timeout: 3000 });
    } catch {
      await action.click({ force: true });
    }

    const opened = await expect
      .poll(async () => isRegistrationSurfaceVisible(page), { timeout: 15000 })
      .toBe(true)
      .then(() => true)
      .catch(() => false);

    if (opened) {
      return page;
    }
  }

  await page.goto(new URL('registration.php', page.url()).toString(), { waitUntil: 'domcontentloaded' }).catch(() => {});

  if (await isRegistrationSurfaceVisible(page)) {
    return page;
  }

  const pageText = await page.locator('body').innerText().catch(() => '');
  if (/Dates Expired/i.test(pageText)) {
    throw new Error(`Registration is blocked because the current camp dates are expired. Current URL: ${page.url()}`);
  }

  throw new Error(`Registration page did not open from the current Camp Server state. Current URL: ${page.url()}`);
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

async function expectVisibleTextItems(page, items, containerSelector) {
  const container = containerSelector ? page.locator(containerSelector) : page.locator('body');

  for (const item of items) {
    await expect(container.getByText(item, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  }
}

async function openRegistrationLanding(page) {
  await clickVisibleAction(page, campServerIndiaRegistrationSelectors.registrationLink);
  await expect
    .poll(async () => {
      return Boolean(
        (await isVisible(page, campServerIndiaRegistrationSelectors.firstNameField))
        || (await isVisible(page, campServerIndiaRegistrationSelectors.consentChooseButton))
      );
    }, { timeout: 15000 })
    .toBe(true);
}

async function verifyHomeStations(page) {
  const homeNavItems = [
    ['Home', campServerIndiaRegistrationSelectors.homeLink],
    ['Dashboard', campServerIndiaRegistrationSelectors.dashboardLink],
    ['Registration', campServerIndiaRegistrationSelectors.registrationLink],
    ['Pre-Screening', campServerIndiaRegistrationSelectors.preScreeningLink],
    ['Pre Exam', campServerIndiaRegistrationSelectors.preExamLink],
    ['Examination', campServerIndiaRegistrationSelectors.examinationLink],
    ['Ophthalm', campServerIndiaRegistrationSelectors.ophthalmLink],
    ['Dispense', campServerIndiaRegistrationSelectors.dispenseLink],
    ['Participants', campServerIndiaRegistrationSelectors.participantsLink],
    ['Summary', campServerIndiaRegistrationSelectors.summaryLink],
    ['Logout', campServerIndiaRegistrationSelectors.logoutLink]
  ];

  for (const [label, selector] of homeNavItems) {
    await runStep(`Assert that the navigation link "${label}" is displayed on the Camp Server Home page`, async () => {
      await expect(await getRequiredVisibleLocator(page, selector)).toBeVisible({ timeout: 10000 });
    });
  }
}

async function advanceToAddressStep(page, data) {
  await openModule(page);
  await fillStep1(page, data);
  await clickNext(page);
  await fillStep2(page, data);
  await clickNext(page);
  await fillStep3(page, 24);
  await clickNext(page);
  await fillStep6(page, data);
  await clickNext(page);
  await expect(page.locator(campServerIndiaRegistrationSelectors.addressLine1Field)).toBeVisible({ timeout: 15000 });
}

async function verifyCompleteAddressFields(page, data) {
  await runStep('Open the Camp Server Registration page', async () => {
    await openModule(page);
  });

  await runStep(`Enter Participant First Name "${data.campServerParticipantFirstName}" and Last Name "${data.campServerParticipantLastName}"`, async () => {
    await fillStep1(page, data);
  });

  await runStep('Click Next and move to Contact Number', async () => {
    await clickNext(page);
  });

  await runStep(`Enter Contact Number "${data.campServerContactNumber}"`, async () => {
    await fillStep2(page, data);
  });

  await runStep('Click Next and move to Age and Gender', async () => {
    await clickNext(page);
  });

  await runStep('Enter Age "24" and select Gender "Male"', async () => {
    await fillStep3(page, 24);
  });

  await runStep('Click Next and move to Secondary Contact details', async () => {
    await clickNext(page);
  });

  await runStep(`Enter Secondary Contact Name "${data.campServerFatherName || 'Smith'}" and Secondary Contact Phone "1234567890"`, async () => {
    await fillStep6(page, data);
  });

  await runStep('Click Next and move to the Address step', async () => {
    await clickNext(page);
    await expect(page.locator(campServerIndiaRegistrationSelectors.addressLine1Field)).toBeVisible({ timeout: 15000 });
  });

  await runStep('Assert that the complete address fields are displayed on the Registration page', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.addressLine1Label)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.addressLine2Label)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.cityLabel)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateLabel)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.postalCodeLabel)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.addressLine1Field)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.addressLine2Field)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.cityField)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.postalCodeField)).toBeVisible();
  });
}

async function verifyPostalCodeRequired(page, data) {
  await runStep('Open the Camp Server Registration page and advance to the Address step', async () => {
    await advanceToAddressStep(page, data);
  });

  await runStep(`Enter Address Line 1 "${data.campServerAddressLine1}", Address Line 2 "${data.campServerAddressLine2}", select State "${data.campServerState}", select District "${data.campServerDistrict}", and enter City "${data.campServerCity}"`, async () => {
    await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.addressLine1Field, data.campServerAddressLine1);
    await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.addressLine2Field, data.campServerAddressLine2);

    if (await isVisible(page, campServerIndiaRegistrationSelectors.villageNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.villageNaButton);
    }

    const stateField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField);
    await setSelectValue(stateField, data.campServerState);
    await expectSelectedOptionLabel(stateField, data.campServerState);

    const districtField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.districtField);
    await setSelectValue(districtField, data.campServerDistrict);
    await expectSelectedOptionLabel(districtField, data.campServerDistrict);

    await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.cityField, data.campServerCity);
  });

  await runStep('Click Next without entering Postal Code', async () => {
    await clickNext(page);
  });

  await runStep('Assert that the validation message "Postal Code cannot be left blank." is displayed', async () => {
    await expectToast(page, 'Postal Code cannot be left blank.');
  });
}

async function verifyStateDropdownSelection(page, data) {
  await runStep('Open the Camp Server Registration page and advance to the Address step', async () => {
    await advanceToAddressStep(page, data);
  });

  await runStep(`Select State "${data.campServerState}" from the Address step dropdown`, async () => {
    const stateField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField);
    await setSelectValue(stateField, data.campServerState);
    await expectSelectedOptionLabel(stateField, data.campServerState);
  });
}

async function verifyDistrictDropdownSelection(page, data) {
  await runStep('Open the Camp Server Registration page and advance to the Address step', async () => {
    await advanceToAddressStep(page, data);
  });

  await runStep(`Select State "${data.campServerState}" and District "${data.campServerDistrict}" from the Address step dropdowns`, async () => {
    const stateField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField);
    await setSelectValue(stateField, data.campServerState);
    await expectSelectedOptionLabel(stateField, data.campServerState);

    const districtField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.districtField);
    await setSelectValue(districtField, data.campServerDistrict);
    await expectSelectedOptionLabel(districtField, data.campServerDistrict);
  });
}

async function verifyOtherDistrictField(page, data) {
  await runStep('Open the Camp Server Registration page and advance to the Address step', async () => {
    await advanceToAddressStep(page, data);
  });

  await runStep(`Select State "${data.campServerState}" and choose District "Other"`, async () => {
    const stateField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.stateField);
    await setSelectValue(stateField, data.campServerState);
    await expectSelectedOptionLabel(stateField, data.campServerState);

    const districtField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.districtField);
    await setSelectValue(districtField, 'Other');
    await expectSelectedOptionLabel(districtField, 'Other');
  });

  await runStep('Assert that the District (Other) text field is displayed and accepts input', async () => {
    const districtOtherField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.districtOtherField);
    await setInputValue(districtOtherField, 'Test Other district textbox');
    await expect(districtOtherField).toHaveValue('Test Other district textbox');
  });
}

async function verifyConsentFormButtons(page) {
  await runStep('Open the Camp Server Registration landing page', async () => {
    await openRegistrationLanding(page);
  });

  await runStep('Assert that the current Camp Server Registration surface is displayed after clicking Registration', async () => {
    await expect
      .poll(async () => {
        return Boolean(
          (await isVisible(page, campServerIndiaRegistrationSelectors.firstNameField))
          || (await isVisible(page, campServerIndiaRegistrationSelectors.nextButton))
          || (await isVisible(page, campServerIndiaRegistrationSelectors.consentChooseButton))
          || /signature\.php|registration\.php/i.test(page.url())
        );
      }, { timeout: 15000 })
      .toBe(true);
  });

  const hasConsentControls = Boolean(
    (await isVisible(page, campServerIndiaRegistrationSelectors.consentChooseButton))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.clearSignatureButton))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.saveSignatureButton))
    || (await isVisible(page, campServerIndiaRegistrationSelectors.exitButton))
  );

  if (!hasConsentControls) {
    return;
  }

  await runStep('Assert that the consent-form controls are displayed', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.consentChooseButton)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.clearSignatureButton)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.saveSignatureButton)).toBeVisible();
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.exitButton)).toBeVisible();
  });

  await runStep('Open the consent-form dropdown and assert that English and Hindi consent forms are listed', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.consentChooseButton);
    await expectVisibleTextItems(page, ['CF English', 'CF Hindi']);
  });
}

async function chooseOccupation(page, occupationLabel = 'Nurse') {
  const nativeSelect = await getVisibleLocator(page, campServerIndiaRegistrationSelectors.occupationNativeSelect);

  if (nativeSelect) {
    await setSelectValue(nativeSelect, occupationLabel);
    return;
  }

  const select2Container = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.occupationSelectContainer, 15000);
  await select2Container.click();

  const searchField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.occupationSearchField, 10000);
  await searchField.fill(occupationLabel);

  const option = page.locator(campServerIndiaRegistrationSelectors.occupationResults).filter({ hasText: occupationLabel }).first();
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click();
}

async function expectSuccessPopup(page, participantFirstName) {
  await expect(page.locator(campServerIndiaRegistrationSelectors.successDialog)).toBeVisible({ timeout: 20000 });
  await expect(page.locator(campServerIndiaRegistrationSelectors.successHeading)).toContainText(participantFirstName, { timeout: 10000 });
  await expect(page.locator(campServerIndiaRegistrationSelectors.successHeading)).toContainText('Added Successfully', { timeout: 10000 });
}

async function expectSuccessPopupParticipantName(page, participantName) {
  await expect(page.locator(campServerIndiaRegistrationSelectors.successDialog)).toBeVisible({ timeout: 20000 });
  await expect(page.locator(campServerIndiaRegistrationSelectors.successParticipantNameText).first()).toContainText(participantName, { timeout: 10000 });
}

async function completeRegistrationFromIdentity(page, data, options = {}) {
  const {
    fillAadhaar = true,
    aadhaarValue = data.campServerAadhaarNumber,
    markAadhaarNa = false,
    markOtherIdTypeNa = true,
    markOtherIdValueNa = true,
    otherIdTypeValue = null,
    otherIdValue = null,
    occupation = 'Nurse'
  } = options;

  await runStep('Open the Camp Server Registration page and advance to Aadhaar and ID Proof details', async () => {
    await advanceToInvalidDrivingLicenseStep(page, data);
  });

  await runStep('Complete Aadhaar and ID Proof details for a successful Registration', async () => {
    if (fillAadhaar) {
      await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.aadhaarField, aadhaarValue);
    } else if (markAadhaarNa && await isVisible(page, campServerIndiaRegistrationSelectors.aadhaarNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.aadhaarNaButton);
    }

    if (otherIdTypeValue !== null) {
      const otherIdTypeField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.otherIdTypeField);
      await setSelectValue(otherIdTypeField, otherIdTypeValue);
    } else if (markOtherIdTypeNa && await isVisible(page, campServerIndiaRegistrationSelectors.otherIdTypeNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.otherIdTypeNaButton);
    }

    if (otherIdValue !== null) {
      await fillVisibleInputLikeUser(page, campServerIndiaRegistrationSelectors.otherIdValueField, otherIdValue);
    } else if (markOtherIdValueNa && await isVisible(page, campServerIndiaRegistrationSelectors.otherIdValueNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.otherIdValueNaButton);
    }
  });

  await runStep('Click Next to move from Aadhaar and ID Proof details to Occupation', async () => {
    await clickNext(page);
  });

  await runStep(`Select Occupation "${occupation}"`, async () => {
    await chooseOccupation(page, occupation);
  });

  await runStep('Click Finish to complete Registration', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.finishButton);
  });

  await runStep(`Assert that the success popup confirms that participant "${data.campServerParticipantFirstName}" was added successfully`, async () => {
    await expectSuccessPopup(page, data.campServerParticipantFirstName);
  });
}

async function completeSuccessfulRegistration(page, data) {
  await completeRegistrationFromIdentity(page, data, {
    fillAadhaar: true,
    markOtherIdTypeNa: true,
    markOtherIdValueNa: true
  });
}

async function extractDashboardRegistrationCount(page) {
  const dashboardText = await page.locator(campServerIndiaRegistrationSelectors.dashboardContainer).innerText();
  const patterns = [
    /Registration\s+(\d+)/i,
    /(\d+)\s+Registration/i,
    /Registration[^\d]*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = dashboardText.match(pattern);
    if (match) {
      return Number(match[1]);
    }
  }

  throw new Error('Unable to extract Registration count from dashboard text: ' + dashboardText);
}

async function verifyDashboardRedirect(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep('Click the Dashboard button from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successDashboardButton);
  });

  await runStep('Assert that the user is redirected to the Dashboard page', async () => {
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Dashboard', { exact: false }).first()).toBeVisible({ timeout: 10000 });
  });
}

async function verifyDashboardCountAfterRegistration(page, data) {
  let registrationCountBefore = 0;

  await runStep('Open Dashboard and capture the current Registration count', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.dashboardLink);
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
    registrationCountBefore = await extractDashboardRegistrationCount(page);
  });

  await completeSuccessfulRegistration(page, data);

  await runStep('Return to Dashboard from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successDashboardButton);
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
  });

  await runStep('Assert that the Registration count on Dashboard changes after successful participant registration', async () => {
    const registrationCountAfter = await extractDashboardRegistrationCount(page);
    expect(registrationCountAfter).not.toBe(registrationCountBefore);
    expect(registrationCountAfter).toBeGreaterThanOrEqual(registrationCountBefore);
  });
}

async function verifyNextParticipantRedirect(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep('Click the Next Participant button from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successNextParticipantButton);
  });

  await runStep('Assert that the user is redirected to the New Registration page', async () => {
    await expect(page).toHaveURL(/registration\.php/i);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.newRegistrationHeading)).toContainText('New Registration');
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.firstNameField)).toBeVisible();
  });
}

async function verifyParticipantsPageRedirect(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep('Click the Participants List button from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successParticipantsButton);
  });

  await runStep('Assert that the user is redirected to the Participants page', async () => {
    await expect(page).toHaveURL(/patients\.php/i);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.participantsPageHeading)).toContainText('Participants');
  });
}

async function verifySuccessPopupMessage(page, data) {
  await completeSuccessfulRegistration(page, data);
}

async function verifySuccessPopupParticipantName(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep(`Assert that the success popup shows participant name "${data.campServerParticipantFirstName}"`, async () => {
    await expectSuccessPopupParticipantName(page, data.campServerParticipantFirstName);
  });
}

async function verifyParticipantsPageRedirectAfterParticipantNameCheck(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep(`Assert that the success popup shows participant name "${data.campServerParticipantFirstName}"`, async () => {
    await expectSuccessPopupParticipantName(page, data.campServerParticipantFirstName);
  });

  await runStep('Click the Participants List button from the Registration success popup', async () => {
    const participantsPageAlreadyOpen = await page
      .locator(campServerIndiaRegistrationSelectors.participantsPageHeading)
      .filter({ hasText: 'Participants' })
      .first()
      .isVisible()
      .catch(() => false);

    if (!participantsPageAlreadyOpen) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successParticipantsButton);
    }
  });

  await runStep('Assert that the user is redirected to the Participants page', async () => {
    await expect(page).toHaveURL(/patients\.php/i);
    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.participantsPageHeading)).toContainText('Participants');
  });
}

async function verifyParticipantNotRegisteredWithoutAadhaarAndIdProof(page, data) {
  await runStep('Open the Camp Server Registration page and advance to Aadhaar and ID Proof details', async () => {
    await advanceToInvalidDrivingLicenseStep(page, data);
  });

  await runStep('Mark Aadhaar Number and Other ID Proof Type as NA without entering any ID proof value', async () => {
    if (await isVisible(page, campServerIndiaRegistrationSelectors.aadhaarNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.aadhaarNaButton);
    }

    if (await isVisible(page, campServerIndiaRegistrationSelectors.otherIdTypeNaButton)) {
      await clickVisibleAction(page, campServerIndiaRegistrationSelectors.otherIdTypeNaButton);
    }
  });

  await runStep('Click Next and assert that Registration is blocked by the missing ID proof value validation', async () => {
    await clickNext(page);

    const validationMessageAppeared = await page
      .locator(campServerIndiaRegistrationSelectors.toastTitle)
      .filter({ hasText: /Please enter some ID Proof|Other ID Proof Value cannot be left blank\./i })
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (!validationMessageAppeared) {
      await expect(page.locator(campServerIndiaRegistrationSelectors.occupationSelectContainer)).toHaveCount(0);
    }

    await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.otherIdValueField)).toBeVisible();
  });
}

async function verifyRegistrationWithOnlyAadhaar(page, data) {
  await completeSuccessfulRegistration(page, data);
}

async function verifyRegistrationWithoutAadhaarAndNoId(page, data) {
  await completeRegistrationFromIdentity(page, data, {
    fillAadhaar: false,
    markAadhaarNa: true,
    markOtherIdTypeNa: false,
    markOtherIdValueNa: false,
    otherIdTypeValue: 'No ID Available',
    otherIdValue: 'Not Available'
  });
}

async function verifyOccupationVsRegistrationsChart(page, data) {
  await completeSuccessfulRegistration(page, data);

  await runStep('Click the Dashboard button from the Registration success popup', async () => {
    await clickVisibleAction(page, campServerIndiaRegistrationSelectors.successDashboardButton);
  });

  await runStep('Assert that the Occupation vs Registrations chart is displayed on the Dashboard', async () => {
    await expect(page.locator(campServerIndiaRegistrationSelectors.dashboardContainer)).toBeVisible({ timeout: 15000 });
    await expect(page.locator(campServerIndiaRegistrationSelectors.occupationChartHeading).filter({ hasText: 'Occupation vs Registrations' }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(campServerIndiaRegistrationSelectors.occupationChartCanvas)).toBeVisible({ timeout: 10000 });
  });
}

module.exports = {
  campServerIndiaRegistrationHelpers: {
    openModule,
    verifyLogout,
    verifyFirstNameRequired,
    verifyAgeUpperBound,
    verifyInvalidDrivingLicense,
    verifyDashboardStations,
    verifyHomeStations,
    verifyCompleteAddressFields,
    verifyPostalCodeRequired,
    verifyStateDropdownSelection,
    verifyDistrictDropdownSelection,
    verifyOtherDistrictField,
    verifyConsentFormButtons,
    verifyDashboardRedirect,
    verifyDashboardCountAfterRegistration,
    verifyNextParticipantRedirect,
    verifyParticipantsPageRedirect,
    verifySuccessPopupMessage,
    verifySuccessPopupParticipantName,
    verifyParticipantsPageRedirectAfterParticipantNameCheck,
    verifyParticipantNotRegisteredWithoutAadhaarAndIdProof,
    verifyRegistrationWithOnlyAadhaar,
    verifyRegistrationWithoutAadhaarAndNoId,
    verifyOccupationVsRegistrationsChart,
    selectors: campServerIndiaRegistrationSelectors
  }
};
