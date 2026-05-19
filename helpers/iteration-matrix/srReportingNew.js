const { expect, test } = require('@playwright/test');
const { srReportingNewSelectors } = require('../../selectors/iteration-matrix/srReportingNew.selectors.js');

async function reportStep(name, action) {
  return test.step(name, action);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function firstVisibleLocator(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function clickFirstVisible(page, selectors, options = {}) {
  const locator = await firstVisibleLocator(page, selectors, options.timeout);
  await locator.click({ timeout: options.timeout || 10000, force: options.force || false });
  return locator;
}

async function expectAnyVisible(page, selectors, timeout = 15000) {
  await firstVisibleLocator(page, selectors, timeout);
}

async function openModule(page) {
  if (await page.locator(srReportingNewSelectors.module.heading.join(', ')).first().isVisible().catch(() => false)) {
    return page;
  }

  const moduleUrl = new URL('/app/statement-recon', page.url()).toString();
  await page.goto(moduleUrl, { waitUntil: 'domcontentloaded' });
  await expectAnyVisible(page, srReportingNewSelectors.module.reportingLink, 30000);
  return page;
}

async function openReporting(page) {
  await openModule(page);

  if (await page.locator(srReportingNewSelectors.reporting.heading.join(', ')).first().isVisible().catch(() => false)) {
    return page;
  }

  await expectAnyVisible(page, srReportingNewSelectors.module.reportingLink, 15000);
  await clickFirstVisible(page, srReportingNewSelectors.module.reportingLink);
  await expectAnyVisible(page, srReportingNewSelectors.reporting.heading, 30000);
  return page;
}

async function selectCustomer(page, customerName = 'Langham Logistics') {
  const nativeSelect = page.locator('select').last();
  if (await nativeSelect.count().catch(() => 0)) {
    try {
      await nativeSelect.selectOption({ label: customerName });
      await page.waitForTimeout(1000);
      return customerName;
    } catch (error) {
      try {
        await nativeSelect.selectOption(customerName);
        await page.waitForTimeout(1000);
        return customerName;
      } catch {
      }
    }
  }

  await expectAnyVisible(page, srReportingNewSelectors.reporting.customerTrigger, 15000);
  await clickFirstVisible(page, srReportingNewSelectors.reporting.customerTrigger);

  const searchInput = await firstVisibleLocator(page, srReportingNewSelectors.reporting.customerSearch, 10000);
  await searchInput.fill('');
  await searchInput.fill(customerName);

  const visibleCustomerResult = page.getByText(new RegExp(`^${escapeRegExp(customerName)}$`, 'i')).last();
  await expect(visibleCustomerResult).toBeVisible({ timeout: 10000 });
  await visibleCustomerResult.click({ timeout: 10000 });
  await page.getByText(/Please select customer/i).waitFor({ state: 'hidden', timeout: 30000 }).catch(() => null);
  return customerName;
}

async function prepareReporting(page, customerName = 'Langham Logistics') {
  await openReporting(page);
  await selectCustomer(page, customerName);
}

async function clickPaginator(page, key) {
  const selectors = srReportingNewSelectors.reporting.paginator[key];
  await expectAnyVisible(page, selectors, 10000);
  await clickFirstVisible(page, selectors);
}

async function openExportSettingsModal(page) {
  await prepareReporting(page);
  await expectAnyVisible(page, srReportingNewSelectors.reporting.settingsTab, 15000);
  await clickFirstVisible(page, srReportingNewSelectors.reporting.settingsTab);
  await expectAnyVisible(page, srReportingNewSelectors.reporting.exportSettingsHistoryButton, 15000);
  const exportButton = await firstVisibleLocator(page, srReportingNewSelectors.reporting.exportSettingsHistoryButton, 15000);
  await expect(exportButton).toBeEnabled({ timeout: 30000 });
  await exportButton.click({ timeout: 10000 });
  await expectAnyVisible(page, srReportingNewSelectors.modal.heading, 15000);
}

async function openModalTab(page, tabKey) {
  const selectors = srReportingNewSelectors.modal.tabs[tabKey];
  await expectAnyVisible(page, selectors, 10000);
  await clickFirstVisible(page, selectors);
}

async function openSettingsReport(page) {
  await prepareReporting(page);
  await expectAnyVisible(page, srReportingNewSelectors.reporting.settingsTab, 30000);
  await clickFirstVisible(page, srReportingNewSelectors.reporting.settingsTab);
  await expectAnyVisible(page, srReportingNewSelectors.table.columnOrderButton, 30000);
}

async function clickSortButton(page, headerKey, clickCount = 1) {
  await expectAnyVisible(page, srReportingNewSelectors.table.headers[headerKey], 20000);
  for (let index = 0; index < clickCount; index += 1) {
    await clickFirstVisible(page, srReportingNewSelectors.table.headers[headerKey], { force: true });
  }
}

async function applyTableAction(page, actionKey) {
  const clickCountByAction = {
    asc: 1,
    desc: 2,
    hide: 3
  };
  const headers = ['action'];

  await openSettingsReport(page);
  for (const headerKey of headers) {
    await clickSortButton(page, headerKey, clickCountByAction[actionKey]);
  }
}

async function clickDownloadReport(page) {
  await expectAnyVisible(page, srReportingNewSelectors.modal.downloadReportButton, 10000);
  await clickFirstVisible(page, srReportingNewSelectors.modal.downloadReportButton);
}

async function setFileName(page, value = 'test value') {
  await openModalTab(page, 'options');
  await expectAnyVisible(page, srReportingNewSelectors.modal.fileOptionsHeading, 10000);
  const input = await firstVisibleLocator(page, srReportingNewSelectors.modal.fileNameInput, 10000);
  await input.fill('');
  await input.fill(value);
}

async function addEmail(page, emailAddress) {
  const input = await firstVisibleLocator(page, srReportingNewSelectors.modal.emailInput, 10000);
  await input.fill('');
  await input.fill(emailAddress);
  await clickFirstVisible(page, srReportingNewSelectors.modal.addEmailButton);
}

async function closeModal(page) {
  await expectAnyVisible(page, srReportingNewSelectors.modal.closeButton, 10000);
  await clickFirstVisible(page, srReportingNewSelectors.modal.closeButton);
}

async function runTs25(page) {
  await reportStep('Open the Reporting page for the selected customer', async () => {
    await prepareReporting(page);
  });
  await reportStep('Use the Last Page button on the Settings history table', async () => {
    await clickPaginator(page, 'last');
  });
}

async function runTs26(page) {
  await reportStep('Open the Reporting page for the selected customer', async () => {
    await prepareReporting(page);
  });
  await reportStep('Move to the last page on the Settings history table', async () => {
    await clickPaginator(page, 'last');
  });
  await reportStep('Use the First Page button on the Settings history table', async () => {
    await clickPaginator(page, 'first');
  });
}

async function runTs27(page) {
  await reportStep('Open the Reporting page for the selected customer', async () => {
    await prepareReporting(page);
  });
  await reportStep('Use the Next Page button on the Settings history table', async () => {
    await clickPaginator(page, 'next');
  });
  await reportStep('Return to the previous page on the Settings history table', async () => {
    await clickPaginator(page, 'previous');
  });
}

async function runTs28(page) {
  await reportStep('Open the Reporting page for the selected customer', async () => {
    await prepareReporting(page);
  });
  await reportStep('Move to the next page on the Settings history table', async () => {
    await clickPaginator(page, 'next');
  });
  await reportStep('Use the Previous Page button on the Settings history table', async () => {
    await clickPaginator(page, 'previous');
  });
}

async function runTs29(page) {
  await reportStep('Sort the Action column in ascending order', async () => {
    await applyTableAction(page, 'asc');
  });
}

async function runTs30(page) {
  await reportStep('Sort the Action column in descending order', async () => {
    await applyTableAction(page, 'desc');
  });
}

async function runTs31(page) {
  await reportStep('Hide the Action column from the Settings history table', async () => {
    await applyTableAction(page, 'hide');
  });
}

async function runTs32(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
}

async function runTs33(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Options tab in the export modal', async () => {
    await openModalTab(page, 'options');
  });
  await reportStep('Verify the file options section is displayed', async () => {
    await expectAnyVisible(page, srReportingNewSelectors.modal.fileOptionsHeading, 10000);
  });
}

async function runTs34(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Delivery tab in the export modal', async () => {
    await openModalTab(page, 'delivery');
  });
}

async function runTs35(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Download the Settings history report', async () => {
    await clickDownloadReport(page);
  });
}

async function runTs36(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Options tab in the export modal', async () => {
    await openModalTab(page, 'options');
  });
  await reportStep('Download the Settings history report from the Options tab', async () => {
    await clickDownloadReport(page);
  });
}

async function runTs37(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Edit the file name in the Options tab', async () => {
    await setFileName(page);
  });
}

async function runTs38(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Columns tab in the export modal', async () => {
    await openModalTab(page, 'columns');
  });
  await reportStep('Toggle the Select All checkbox in the Columns tab', async () => {
    await expectAnyVisible(page, srReportingNewSelectors.modal.selectAll, 10000);
    await clickFirstVisible(page, srReportingNewSelectors.modal.selectAll);
    await clickFirstVisible(page, srReportingNewSelectors.modal.selectAll);
  });
}

async function runTs39(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Close the export modal', async () => {
    await closeModal(page);
  });
  await reportStep('Verify the Reporting page is displayed again', async () => {
    await expectAnyVisible(page, srReportingNewSelectors.reporting.heading, 15000);
  });
}

async function runTs40(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Delivery tab in the export modal', async () => {
    await openModalTab(page, 'delivery');
  });
  await reportStep('Select the download delivery method', async () => {
    await clickFirstVisible(page, srReportingNewSelectors.modal.downloadMethod);
  });
  await reportStep('Download the Settings history report', async () => {
    await clickDownloadReport(page);
  });
}

async function runTs41(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Columns tab in the export modal', async () => {
    await openModalTab(page, 'columns');
  });
}

async function runTs42(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Delivery tab in the export modal', async () => {
    await openModalTab(page, 'delivery');
  });
  await reportStep('Switch the delivery method to email', async () => {
    await clickFirstVisible(page, srReportingNewSelectors.modal.emailMethod);
    await expectAnyVisible(page, srReportingNewSelectors.modal.emailInput, 10000);
  });
}

async function runTs43(page) {
  await reportStep('Open the Settings history export modal', async () => {
    await openExportSettingsModal(page);
  });
  await reportStep('Open the Delivery tab in the export modal', async () => {
    await openModalTab(page, 'delivery');
  });
  await reportStep('Switch the delivery method to email', async () => {
    await clickFirstVisible(page, srReportingNewSelectors.modal.emailMethod);
  });
  await reportStep('Add multiple email recipients for the export', async () => {
    await addEmail(page, 'anfal.liaqat@mammoth-ai.com');
    await addEmail(page, 'arslan.chattha@mammoth-ai.com');
  });
}

async function runScenario(page, data, scenarioName) {
  const scenarioMap = {
    TS_25_To_Verify_that_last_page_button_is_functional: runTs25,
    TS_26_To_Verify_that_first_page_button_is_functional: runTs26,
    TS_27_To_Verify_that_Next_page_button_is_functional: runTs27,
    TS_28_To_Verify_that_previous_page_button_is_functional: runTs28,
    TS_29_To_Verify_that_ASC_dropdown_is_functional: runTs29,
    TS_30_To_Verify_that_Desc_dropdown_is_functional: runTs30,
    TS_31_To_Verify_that_Hide_dropdown_is_functional: runTs31,
    TS_32_To_Verify_that_export_setting_modification_history_button_is_functional: runTs32,
    TS_33_To_Verify_options_button_is_functional_on_export_setting_modification_history_popup: runTs33,
    TS_34_To_Verify_delivery_button_is_functional_on_export_setting_modification_history_popup: runTs34,
    TS_35_Verify_download_report_button_is_functional_on_export_setting_modification_history_popup: runTs35,
    TS_36_To_Verify_download_report_button_is_functional_on_options_button: runTs36,
    TS_37_To_Verify_that_file_name_field_is_editable_on_options_button: runTs37,
    TS_38_To_Verify_that_Select_all_checkbox_is_functional_on_columns_button: runTs38,
    TS_39_To_Verify_that_cross_icon_is_functional_on_Export_setting_button: runTs39,
    TS_40_To_Verify_that_download_checkbox_is_functional_on_delivery_button: runTs40,
    TS_41_Verify_Column_button_is_functional_on_export_setting_modification_history_popup: runTs41,
    TS_42_To_verify_user_can_switch_delivery_method_to_email: runTs42,
    TS_43_To_verify_user_can_add_multiple_email_in_email_delivery_method: runTs43
  };

  const action = scenarioMap[scenarioName];
  if (!action) {
    throw new Error(`No SR Reporting New conversion implemented yet for scenario: ${scenarioName}`);
  }

  return action(page, data);
}

module.exports = {
  srReportingNewHelpers: {
    openModule,
    openReporting,
    selectCustomer,
    prepareReporting,
    runScenario,
    selectors: srReportingNewSelectors
  }
};
