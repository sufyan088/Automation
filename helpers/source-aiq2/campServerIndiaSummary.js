const { expect, test } = require('@playwright/test');
const { campServerIndiaSummarySelectors } = require('../../selectors/source-aiq2/campServerIndiaSummary.selectors');
const { campServerIndiaRegistrationSelectors } = require('../../selectors/source-aiq2/campServerIndiaRegistration.selectors');

const DASHBOARD_CARD_LABELS = [
  'Registration',
  'Pre-Screening',
  'Examination',
  'Opthalm',
  'Need Glasses',
  'Dispense',
  'Referrals',
  'Data Sync to Cloud'
];

const DASHBOARD_STAT_ROWS = [
  'Readers Booked',
  'Readers Dispensed',
  'Rx Booked',
  'Pop-in Dispensed'
];

const SUMMARY_TABLE_HEADERS = [
  'Camp Date',
  '#RegisteredParticipants',
  '#ScreenedParticipants',
  '#DispensedParticipants',
  'Date Closures'
];

const NAVBAR_EXPECTATIONS = [
  {
    label: 'Registration',
    linkSelector: campServerIndiaSummarySelectors.registrationLink,
    urlPattern: /registration\.php/i,
    navbarClass: 'bg-registration'
  },
  {
    label: 'Pre-Screening',
    linkSelector: campServerIndiaSummarySelectors.preScreeningLink,
    urlPattern: /prescreening\.php/i,
    navbarClass: 'bg-prescreening'
  },
  {
    label: 'Pre Exam',
    linkSelector: campServerIndiaSummarySelectors.preExamLink,
    urlPattern: /preexam\.php/i,
    navbarClass: 'bg-preexam'
  },
  {
    label: 'Examination',
    linkSelector: campServerIndiaSummarySelectors.examinationLink,
    urlPattern: /examination\.php/i,
    navbarClass: 'bg-examination'
  },
  {
    label: 'Ophthalm',
    linkSelector: campServerIndiaSummarySelectors.ophthalmLink,
    urlPattern: /doctor\.php/i,
    navbarClass: 'bg-doctor'
  },
  {
    label: 'Dispense',
    linkSelector: campServerIndiaSummarySelectors.dispenseLink,
    urlPattern: /dispatch\.php/i,
    navbarClass: 'bg-dispense'
  },
  {
    label: 'Participants',
    linkSelector: campServerIndiaSummarySelectors.participantsLink,
    urlPattern: /patients\.php/i,
    navbarClass: 'bg-customers'
  },
  {
    label: 'Dashboard',
    linkSelector: campServerIndiaSummarySelectors.dashboardLink,
    urlPattern: /dashboard\.php/i,
    navbarClass: 'bg-primary'
  },
  {
    label: 'Summary',
    linkSelector: campServerIndiaSummarySelectors.summaryLink,
    urlPattern: /summary\.php/i,
    navbarClass: 'bg-summary'
  }
];

async function runStep(title, action) {
  return test.step(title, action);
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeCompact(value) {
  return normalizeWhitespace(value).replace(/\s+/g, '').toLowerCase();
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

async function clickVisibleAction(page, selector) {
  const locator = page.locator(selector);
  const total = await locator.count();

  for (let index = 0; index < total; index += 1) {
    const candidate = locator.nth(index);
    if (!(await candidate.isVisible().catch(() => false))) {
      continue;
    }

    await candidate.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await candidate.click({ timeout: 3000 });
    } catch {
      await candidate.click({ force: true });
    }
    return candidate;
  }

  throw new Error('Unable to find a visible action for selectors: ' + selector);
}

async function expectBodyOrToastText(page, expectedText, timeout = 10000) {
  const expectedValues = Array.isArray(expectedText) ? expectedText : [expectedText];

  await expect
    .poll(async () => {
      const toastTexts = await page.locator(campServerIndiaSummarySelectors.toastMessages).allTextContents().catch(() => []);
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

async function goHome(page) {
  const homeLink = await getVisibleLocator(page, campServerIndiaSummarySelectors.homeLink);
  if (homeLink) {
    await homeLink.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await homeLink.click({ timeout: 3000 });
    } catch {
      await homeLink.click({ force: true });
    }
  } else {
    await page.goto(new URL('home.php', page.url()).toString(), { waitUntil: 'domcontentloaded' });
  }

  await expect.poll(async () => {
    return Boolean(await getVisibleLocator(page, campServerIndiaSummarySelectors.summaryLink));
  }, { timeout: 15000 }).toBe(true);
}

async function openDashboard(page) {
  await clickVisibleAction(page, campServerIndiaSummarySelectors.dashboardLink);
  await expect(page).toHaveURL(/dashboard\.php/i);
  await expect(await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.dashboardContainer, 15000)).toBeVisible();
  return page;
}

async function openModule(page) {
  await clickVisibleAction(page, campServerIndiaSummarySelectors.summaryLink);
  await expect(page).toHaveURL(/summary\.php/i);
  await expect(await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.refreshButton, 15000)).toBeVisible();
  return page;
}

async function openRegistration(page) {
  await clickVisibleAction(page, campServerIndiaSummarySelectors.registrationLink);
  await expect(page).toHaveURL(/registration\.php/i);
  await expect(await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.firstNameField, 15000)).toBeVisible();
}

async function getDashboardCardText(page) {
  const container = await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.dashboardContainer, 15000);
  const headings = container.locator('h3');
  const total = await headings.count();
  const values = [];

  for (let index = 0; index < total; index += 1) {
    values.push(normalizeWhitespace(await headings.nth(index).textContent().catch(() => '')));
  }

  return values.filter(Boolean);
}

async function findDashboardStatRow(page, label) {
  const container = await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.statsContainer, 15000);
  const rows = container.locator('tbody tr');
  const total = await rows.count();

  for (let index = 0; index < total; index += 1) {
    const row = rows.nth(index);
    if (!(await row.isVisible().catch(() => false))) {
      continue;
    }

    const text = normalizeWhitespace(await row.textContent().catch(() => ''));
    if (new RegExp(escapeRegex(label), 'i').test(text)) {
      return row;
    }
  }

  throw new Error(`Unable to find Summary dashboard stat row: ${label}`);
}

async function closeDetailsModal(page) {
  const button = await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.detailModalCloseButton, 10000);
  await button.scrollIntoViewIfNeeded().catch(() => {});
  try {
    await button.click({ timeout: 3000 });
  } catch {
    await button.click({ force: true });
  }

  await expect(page.locator(campServerIndiaSummarySelectors.detailModal)).toBeHidden({ timeout: 10000 });
}

async function verifyDashboardStatModal(page, label) {
  const row = await findDashboardStatRow(page, label);
  const cells = row.locator('td');
  const countText = normalizeWhitespace(await cells.nth(1).textContent().catch(() => ''));
  const numericCount = Number.parseInt(countText, 10);
  const labelCell = cells.first();

  await labelCell.scrollIntoViewIfNeeded().catch(() => {});
  try {
    await labelCell.click({ timeout: 3000 });
  } catch {
    await labelCell.click({ force: true });
  }

  await expect(await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.detailModal, 10000)).toBeVisible();
  const modalText = normalizeWhitespace(await page.locator(campServerIndiaSummarySelectors.detailModalText).first().textContent().catch(() => ''));

  if (countText) {
    expect(modalText).toContain(countText);
  }

  if (modalText.toLowerCase().includes(label.toLowerCase())) {
    await closeDetailsModal(page);
    return;
  }

  const detailRows = page.locator('#divDetails tbody tr');
  const detailRowCount = await detailRows.count().catch(() => 0);

  if (Number.isInteger(numericCount) && numericCount > 0) {
    expect(detailRowCount).toBeGreaterThan(0);
    await closeDetailsModal(page);
    return;
  }

  expect(modalText.toLowerCase()).toMatch(/no data|no records|0/);

  await closeDetailsModal(page);
}

async function verifyAllModulesExistingOnDashboard(page) {
  await runStep('Open the Dashboard module from the Camp Server navigation bar', async () => {
    await openDashboard(page);
  });

  await runStep('Assert that all expected Dashboard cards are displayed', async () => {
    const cardTexts = await getDashboardCardText(page);

    for (const expectedLabel of DASHBOARD_CARD_LABELS) {
      expect(cardTexts.some((text) => text.toLowerCase().includes(expectedLabel.toLowerCase()))).toBe(true);
    }
  });

  for (const statLabel of DASHBOARD_STAT_ROWS) {
    await runStep(`Open the Dashboard stat detail for "${statLabel}" and assert the count is carried into the detail modal`, async () => {
      await verifyDashboardStatModal(page, statLabel);
    });
  }

  await runStep('Assert that the Data Sync to Cloud summary card is visible', async () => {
    const syncHeading = await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.syncHeading, 10000);
    await expect(syncHeading).toContainText(/Data Sync to Cloud/i);
  });
}

async function verifyNavbarClass(page, navbarClass) {
  const navContainer = await getRequiredVisibleLocator(
    page,
    `nav.${navbarClass} .container-fluid, nav[class*="${navbarClass}"] .container-fluid`,
    15000
  );
  await expect(navContainer).toBeVisible();
}

async function verifyStationNavbarColors(page) {
  for (const expectation of NAVBAR_EXPECTATIONS) {
    await runStep(`Open ${expectation.label} and assert the navbar uses ${expectation.navbarClass}`, async () => {
      await goHome(page);
      await clickVisibleAction(page, expectation.linkSelector);
      await expect(page).toHaveURL(expectation.urlPattern);
      await verifyNavbarClass(page, expectation.navbarClass);
    });
  }

  await runStep('Return to the Camp Server home page after validating the navbar classes', async () => {
    await goHome(page);
  });
}

async function fillStepOne(page, data) {
  const firstNameField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.firstNameField, 15000);
  const lastNameField = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.lastNameField, 15000);

  await firstNameField.fill(data.campServerParticipantFirstName);
  await lastNameField.fill(data.campServerParticipantLastName);

  await expect(firstNameField).toHaveValue(data.campServerParticipantFirstName, { timeout: 10000 });
  await expect(lastNameField).toHaveValue(data.campServerParticipantLastName, { timeout: 10000 });
}

async function clickNext(page) {
  const nextButton = await getRequiredVisibleLocator(page, campServerIndiaRegistrationSelectors.nextButton, 15000);
  await nextButton.scrollIntoViewIfNeeded().catch(() => {});
  try {
    await nextButton.click({ timeout: 3000 });
  } catch {
    await nextButton.click({ force: true });
  }
}

async function verifyParticipantCannotRegisterWithoutContactPhoneNumber(page, data) {
  await runStep('Open the Camp Server Registration page', async () => {
    await openRegistration(page);
  });

  await runStep(`Enter Participant First Name "${data.campServerParticipantFirstName}" and Last Name "${data.campServerParticipantLastName}"`, async () => {
    await fillStepOne(page, data);
  });

  await runStep('Click Next to move to the Contact Number step', async () => {
    await clickNext(page);
  });

  await runStep('Mark the Contact Number field as No Phone Number', async () => {
    await clickVisibleAction(page, '#btn_reg_contactno, button[denaforxx="de_reg_contactno"], button:has-text("-No Phone Number-")');
  });

  await runStep('Click Next and assert the Contact Number required validation is shown', async () => {
    await clickNext(page);
    await expectBodyOrToastText(page, 'Contact No. cannot be left blank.');
  });
}

async function verifySummaryPageTableHeaders(page) {
  await runStep('Open the Summary module from the Camp Server navigation bar', async () => {
    await openModule(page);
  });

  await runStep('Assert that the Summary table headers are displayed', async () => {
    const headerLocator = page.locator(campServerIndiaSummarySelectors.sourceTableHeaders);
    await expect(headerLocator.first()).toBeVisible({ timeout: 15000 });

    const headerTexts = (await headerLocator.allTextContents())
      .map((text) => normalizeWhitespace(text))
      .filter(Boolean);
    const compactHeaders = headerTexts.map(normalizeCompact);

    for (const expectedHeader of SUMMARY_TABLE_HEADERS) {
      expect(compactHeaders).toContain(normalizeCompact(expectedHeader));
    }
  });

  await runStep('Assert that the Summary Refresh button is displayed', async () => {
    await expect(await getRequiredVisibleLocator(page, campServerIndiaSummarySelectors.refreshButton, 10000)).toBeVisible();
  });
}

module.exports = {
  campServerIndiaSummaryHelpers: {
    openModule,
    openDashboard,
    verifyAllModulesExistingOnDashboard,
    verifyStationNavbarColors,
    verifyParticipantCannotRegisterWithoutContactPhoneNumber,
    verifySummaryPageTableHeaders,
    selectors: campServerIndiaSummarySelectors
  }
};
