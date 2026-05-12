const { expect, test } = require('@playwright/test');
const { expectVisibleWithFallback, resolveFirst } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { customerModuleManagementAdminModuleNewHelpers } = require('./customerModuleManagementAdminModuleNew.js');
const { customerModuleManagementAdminTwoSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminTwo.selectors.js');

function humanizeScenarioTitle(scenarioName) {
  return String(scenarioName || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .trim();
}

async function resolveVisible(page, candidates, options = {}) {
  return resolveFirst(page, candidates, { mustBeVisible: true, timeoutPerCandidate: 2500, ...options });
}

async function openAdminModule(page) {
  const adminLink = await resolveVisible(page, customerModuleManagementAdminTwoSelectors.modulePage.adminModule, {
    timeoutPerCandidate: 1500
  }).catch(() => null);

  if (adminLink) {
    await adminLink.locator.click({ timeout: 5000 });
    await waitForAppToSettle(page, 500);
  }
}

async function verifyCustomerModuleManagementIsThirdModule(page) {
  await openAdminModule(page);
  await expectVisibleWithFallback(page, customerModuleManagementAdminTwoSelectors.modulePage.customerManagementLink, { expectTimeout: 15000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminTwoSelectors.modulePage.userManagementLink, { expectTimeout: 15000 });
  await expectVisibleWithFallback(page, customerModuleManagementAdminTwoSelectors.modulePage.customerModuleManagementLink, { expectTimeout: 15000 });

  const linkOrder = await page.locator('nav a').evaluateAll((links) => {
    return links
      .filter((link) => {
        const text = (link.textContent || '').trim();
        const style = window.getComputedStyle(link);
        return text && style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((link) => (link.textContent || '').trim().replace(/\s+/g, ' '));
  });

  const customerManagementIndex = linkOrder.findIndex((label) => /customer management/i.test(label));
  const userManagementIndex = linkOrder.findIndex((label) => /user management/i.test(label));
  const customerModuleManagementIndex = linkOrder.findIndex((label) => /customer module management/i.test(label));

  expect(customerManagementIndex).toBeGreaterThanOrEqual(0);
  expect(userManagementIndex).toBeGreaterThanOrEqual(0);
  expect(customerModuleManagementIndex).toBe(2);
  expect(customerModuleManagementIndex).toBeGreaterThan(userManagementIndex);
  expect(userManagementIndex).toBeGreaterThan(customerManagementIndex);

  const moduleLink = await resolveVisible(page, customerModuleManagementAdminTwoSelectors.modulePage.customerModuleManagementLink, {
    timeoutPerCandidate: 1500
  });
  await moduleLink.locator.click({ timeout: 5000 });
  await page.waitForURL((url) => url.toString().includes(customerModuleManagementAdminTwoSelectors.modulePage.routeFragments.customerModuleManagement), {
    timeout: 15000
  });
  await expectVisibleWithFallback(page, customerModuleManagementAdminTwoSelectors.modulePage.headings.customerModuleManagement, {
    expectTimeout: 15000
  });
}

async function runScenario(page, data, scenarioName) {
  if (scenarioName === 'TS_42_To_verify_Customer_Module_Management_is_showing_at_the_third_module') {
    await verifyCustomerModuleManagementIsThirdModule(page);
    return;
  }

  return customerModuleManagementAdminModuleNewHelpers.runScenario(page, data, scenarioName);
}

module.exports = {
  customerModuleManagementAdminTwoHelpers: {
    ...customerModuleManagementAdminModuleNewHelpers,
    runScenario: async (page, data, scenarioName) => test.step(`Run ${humanizeScenarioTitle(scenarioName)}`, async () => {
      return runScenario(page, data, scenarioName);
    }),
    selectors: customerModuleManagementAdminTwoSelectors
  }
};
