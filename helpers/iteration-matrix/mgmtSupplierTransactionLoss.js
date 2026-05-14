const path = require('path');
const { expect } = require('@playwright/test');
const { mgmtSupplierTransactionLossSelectors } = require('../../selectors/iteration-matrix/mgmtSupplierTransactionLoss.selectors.js');

async function waitForFirstVisible(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector);
      const matchCount = Math.min(await locator.count().catch(() => 0), 5);

      for (let index = 0; index < matchCount; index += 1) {
        const candidate = locator.nth(index);
        if (await candidate.isVisible().catch(() => false)) {
          return candidate;
        }
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function maybeVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const matchCount = Math.min(await locator.count().catch(() => 0), 5);

    for (let index = 0; index < matchCount; index += 1) {
      const candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }
  }

  return null;
}

async function clickFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.click({ timeout: 5000 });
  return locator;
}

async function fillFirstVisible(page, selectors, value, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.fill('');
  await locator.fill(String(value));
  return locator;
}

async function expectVisible(page, selectors, timeout = 15000) {
  await waitForFirstVisible(page, selectors, timeout);
}

async function openAdmin(page) {
  const adminHeading = await maybeVisible(page, mgmtSupplierTransactionLossSelectors.admin.heading);
  if (adminHeading) {
    return;
  }

  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.admin.moduleEntry);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.admin.heading);
}

async function openMIS(page) {
  const misHeading = await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.landingHeading);
  if (misHeading) {
    return;
  }

  await openAdmin(page);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.admin.misLink);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.landingHeading);
}

async function openModule(page) {
  const moduleHeading = await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.supplierTransactionLossHeading);
  if (moduleHeading) {
    return page;
  }

  await openMIS(page);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.supplierTransactionLossTab);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.supplierTransactionLossHeading);
  return page;
}

async function ensureChartVisible(page) {
  await openModule(page);
  if (await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.graphHeading)) {
    return;
  }

  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.showChartButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.graphHeading);
}

async function ensureTableVisible(page) {
  await openModule(page);
  if (
    await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.tableHeading)
    || await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.hideTableButton)
  ) {
    return;
  }

  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.showTableButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.tableHeading);
}

async function hideAndShowChart(page) {
  await ensureChartVisible(page);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.hideChartButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.showChartButton);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.showChartButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.graphHeading);
}

async function hideAndShowTable(page) {
  await ensureChartVisible(page);
  await ensureTableVisible(page);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.graphHeading);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.hideTableButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.showTableButton);
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.showTableButton);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.tableHeading);
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.graphHeading);
}

async function useReturnToTop(page) {
  await ensureTableVisible(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await clickFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.returnToTopButton);
}

async function clickPaginationButton(page, direction) {
  await ensureTableVisible(page);
  const selectorSet = mgmtSupplierTransactionLossSelectors.mis.paginationButton[direction];
  if (!selectorSet) {
    throw new Error(`Unsupported pagination button: ${direction}`);
  }

  const button = await waitForFirstVisible(page, selectorSet);
  const target = await button.evaluateHandle((node) => node.closest('button') || node).catch(() => null);
  const disabled = target
    ? await target.evaluate((node) => node.disabled || node.getAttribute('aria-disabled') === 'true').catch(() => false)
    : await button.isDisabled().catch(() => false);

  if (disabled) {
    await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.pageSummary);
    return;
  }

  const summary = await maybeVisible(page, mgmtSupplierTransactionLossSelectors.mis.pageSummary);
  const before = summary ? await summary.textContent().catch(() => '') : '';
  if (target) {
    await target.evaluate((node) => node.click()).catch(async () => {
      await button.click({ timeout: 5000 });
    });
  } else {
    await button.click({ timeout: 5000 });
  }

  if (summary && before) {
    await expect(summary).not.toHaveText(before, { timeout: 10000 });
  }
}

async function searchAllEntries(page, value = 'Infios') {
  await ensureTableVisible(page);
  const input = await fillFirstVisible(page, mgmtSupplierTransactionLossSelectors.mis.searchAllEntriesInput, value);
  await expect(input).toHaveValue(String(value));
  await expectVisible(page, mgmtSupplierTransactionLossSelectors.mis.resultCell('Infios Supply'));
}

async function runScenario(page, sourceFile) {
  const caseId = path.basename(sourceFile, '.spec.js').match(/^(TS_\d+)/i)?.[1];

  switch (caseId) {
    case 'TS_01':
    case 'TS_02':
      await openModule(page);
      break;
    case 'TS_03':
      await ensureChartVisible(page);
      break;
    case 'TS_04':
      await hideAndShowTable(page);
      break;
    case 'TS_05':
      await useReturnToTop(page);
      break;
    case 'TS_06':
      await clickPaginationButton(page, 'next');
      break;
    case 'TS_07':
      await clickPaginationButton(page, 'previous');
      break;
    case 'TS_08':
      await clickPaginationButton(page, 'last');
      break;
    case 'TS_09':
      await clickPaginationButton(page, 'first');
      break;
    case 'TS_10':
      await searchAllEntries(page);
      break;
    default:
      throw new Error(`Unsupported MGMT Supplier Transaction Loss scenario for ${sourceFile}`);
  }
}

module.exports = {
  mgmtSupplierTransactionLossHelpers: {
    openModule,
    ensureTableVisible,
    ensureChartVisible,
    runScenario,
    selectors: mgmtSupplierTransactionLossSelectors
  }
};
