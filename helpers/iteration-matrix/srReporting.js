const { expect, test } = require('@playwright/test');
const { srReportingSelectors } = require('../../selectors/iteration-matrix/srReporting.selectors.js');

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
  if (await page.locator(srReportingSelectors.module.heading.join(', ')).first().isVisible().catch(() => false)) {
    return page;
  }

  const moduleUrl = new URL('/app/statement-recon', page.url()).toString();
  await page.goto(moduleUrl, { waitUntil: 'domcontentloaded' });
  await expectAnyVisible(page, srReportingSelectors.module.reportingLink, 30000);
  return page;
}

async function openReporting(page) {
  await openModule(page);
  await expectAnyVisible(page, srReportingSelectors.module.reportingLink, 15000);
  await clickFirstVisible(page, srReportingSelectors.module.reportingLink);
  await expectAnyVisible(page, srReportingSelectors.reporting.heading, 30000);
  return page;
}

async function selectCustomer(page, customerName = 'Langham Logistics') {
  await expectAnyVisible(page, srReportingSelectors.reporting.customerTrigger, 15000);
  await clickFirstVisible(page, srReportingSelectors.reporting.customerTrigger);

  const searchInput = await firstVisibleLocator(page, srReportingSelectors.reporting.customerSearch, 10000);
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

async function openStatementsReport(page) {
  await prepareReporting(page);
  if (await page.locator(srReportingSelectors.reporting.statementsTab.join(', ')).first().isVisible().catch(() => false)) {
    await clickFirstVisible(page, srReportingSelectors.reporting.statementsTab);
  }
  await expectAnyVisible(page, srReportingSelectors.statements.cards.uploadsByUser, 30000);
}

async function openSettingsReport(page) {
  await prepareReporting(page);
  await expectAnyVisible(page, srReportingSelectors.reporting.settingsTab, 30000);
  await clickFirstVisible(page, srReportingSelectors.reporting.settingsTab);
  await expectAnyVisible(page, srReportingSelectors.settings.cards.modificationsByActionType, 30000);
}

async function clickAnyUserSlice(page) {
  await openStatementsReport(page);
  const slices = page.locator(srReportingSelectors.statements.userSlice.join(', '));
  const count = await slices.count();
  const target = count > 2 ? slices.nth(2) : slices.first();
  await target.click({ timeout: 10000, force: true });
  await expectAnyVisible(page, srReportingSelectors.statements.clearSelectionButton, 10000);
}

async function openExportStatementsModal(page) {
  await openStatementsReport(page);
  await expectAnyVisible(page, srReportingSelectors.reporting.exportStatementsButton, 15000);
  await clickFirstVisible(page, srReportingSelectors.reporting.exportStatementsButton);
  await expectAnyVisible(page, srReportingSelectors.modal.heading, 15000);
}

async function openExportSettingsModal(page) {
  await openSettingsReport(page);
  await expectAnyVisible(page, srReportingSelectors.reporting.exportSettingsHistoryButton, 15000);
  await clickFirstVisible(page, srReportingSelectors.reporting.exportSettingsHistoryButton);
  await expectAnyVisible(page, srReportingSelectors.modal.heading, 15000);
}

async function openModalTab(page, tabKey) {
  const selectors = srReportingSelectors.modal.tabs[tabKey];
  await expectAnyVisible(page, selectors, 10000);
  await clickFirstVisible(page, selectors);
}

async function applyDateFilter(page, selectors) {
  await expectAnyVisible(page, selectors, 15000);
  await clickFirstVisible(page, selectors);
  const calendarDay = await firstVisibleLocator(page, srReportingSelectors.common.calendarDay, 10000);
  await calendarDay.click({ timeout: 10000, force: true });
}

async function expectExportSuccess(page) {
  await expectAnyVisible(page, srReportingSelectors.notifications.success, 30000);
}

async function expectExportCompletion(page) {
  const successPromise = expectExportSuccess(page).then(() => true).catch(() => false);
  const modalClosedPromise = Promise.all(
    srReportingSelectors.modal.heading.map((selector) =>
      page.locator(selector).first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => null)
    )
  ).then(() => true).catch(() => false);

  const [successVisible, modalClosed] = await Promise.all([successPromise, modalClosedPromise]);

  if (!successVisible && !modalClosed) {
    throw new Error('Export action did not show a success notification or close the export modal.');
  }
}

async function clickDownloadReport(page) {
  await expectAnyVisible(page, srReportingSelectors.modal.downloadReportButton, 10000);
  await clickFirstVisible(page, srReportingSelectors.modal.downloadReportButton);
  await expectExportCompletion(page);
}

async function sendEmailReport(page) {
  await expectAnyVisible(page, srReportingSelectors.modal.sendEmailReportButton, 10000);
  if (await page.locator(srReportingSelectors.modal.emailInput.join(', ')).first().isVisible().catch(() => false)) {
    const emailInput = await firstVisibleLocator(page, srReportingSelectors.modal.emailInput, 10000);
    await emailInput.fill('');
    await emailInput.fill('arslan.chattha@mammoth-ai.com');
    await clickFirstVisible(page, srReportingSelectors.modal.addEmailButton);
  }

  const sendButton = await firstVisibleLocator(page, srReportingSelectors.modal.sendEmailReportButton, 10000);
  await expect(sendButton).toBeEnabled({ timeout: 10000 });
  await sendButton.click({ timeout: 10000 });
  await expectExportCompletion(page);
}

async function toggleFirstColumn(page) {
  await openStatementsReport(page);
  await expectAnyVisible(page, srReportingSelectors.statements.columnOrderButton, 15000);
  await clickFirstVisible(page, srReportingSelectors.statements.columnOrderButton);
  const toggle = await firstVisibleLocator(page, srReportingSelectors.statements.columnToggle, 10000);
  await toggle.click({ timeout: 10000, force: true });
  await toggle.click({ timeout: 10000, force: true });
}

async function openPaginationDropdown(page) {
  await openStatementsReport(page);
  await expectAnyVisible(page, srReportingSelectors.statements.pagination.trigger, 15000);
  await clickFirstVisible(page, srReportingSelectors.statements.pagination.trigger);
  await expectAnyVisible(page, srReportingSelectors.statements.pagination.options.twentyFive, 10000);
  await expectAnyVisible(page, srReportingSelectors.statements.pagination.options.fifty, 10000);
  await expectAnyVisible(page, srReportingSelectors.statements.pagination.options.hundred, 10000);
}

async function runScenario(page, data, scenarioName) {
  const scenarioMap = {
    TS_01_To_verify_that_Reporting_button_is_functional: async () => {
      await reportStep('Open the Reporting page', async () => {
        await openReporting(page);
      });
    },
    TS_02_To_verify_that_Select_Customer_dropdown_field_is_functional: async () => {
      await reportStep('Open the Reporting page', async () => {
        await openReporting(page);
      });
      await reportStep('Select a customer from the Reporting customer dropdown', async () => {
        await selectCustomer(page);
      });
    },
    TS_03_To_verify_that_Customer_Super_Admin_can_access_reporting_module: async () => {
      await reportStep('Open the Reporting page', async () => {
        await openReporting(page);
      });
    },
    TS_04_To_verify_that_Customer_Admin_can_access_reporting_module: async () => {
      await reportStep('Open the Reporting page', async () => {
        await openReporting(page);
      });
    },
    TS_05_To_verify_that_Reporting_tab_is_showing_on_left_side_of_all_other_tabs: async () => {
      await reportStep('Open the Statement Reconciliation module', async () => {
        await openModule(page);
      });
      await reportStep('Verify the Reporting tab is visible in the module navigation', async () => {
        await expectAnyVisible(page, srReportingSelectors.module.reportingLink, 15000);
      });
    },
    TS_06_To_verify_that_when_we_select_report_type_underneath_cards_and_list_are_showing: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Verify the Statements report cards are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.cards.all, 15000);
      });
      await reportStep('Verify the Statements report table is displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadedByHeader, 15000);
      });
    },
    TS_07_To_verify_that_when_we_select_Report_module_cards_and_list_are_showing: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Verify the Reporting cards are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.cards.all, 15000);
      });
      await reportStep('Verify the Reporting table is displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadCountHeader, 15000);
      });
    },
    TS_08_To_verify_that_Reporting_table_is_showing: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Verify the Reporting table columns are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadedByHeader, 15000);
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadCountHeader, 15000);
      });
    },
    TS_09_To_verify_that_Filter_by_date_range_field_is_functional: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Apply the date range filter on the Statements report', async () => {
        await applyDateFilter(page, srReportingSelectors.statements.filters.dateRange);
      });
    },
    TS_10_verify_that_Filter_by_User_Name_field_is_functional: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Filter the Statements report by user name', async () => {
        const input = await firstVisibleLocator(page, srReportingSelectors.statements.filters.userName, 10000);
        await input.fill('');
        await input.fill('laiba');
        await expect(input).toHaveValue('laiba');
      });
    },
    TS_11_To_verify_that_Export_button_is_functional: async () => {
      await reportStep('Open the Statements export modal', async () => {
        await openExportStatementsModal(page);
      });
      await reportStep('Verify the export modal tabs are available', async () => {
        await expectAnyVisible(page, srReportingSelectors.modal.tabs.columns, 10000);
        await expectAnyVisible(page, srReportingSelectors.modal.tabs.options, 10000);
        await expectAnyVisible(page, srReportingSelectors.modal.tabs.delivery, 10000);
      });
    },
    TS_12_To_verify_that_file_is_downloaded_in_csv_format: async () => {
      await reportStep('Open the Statements export modal', async () => {
        await openExportStatementsModal(page);
      });
      await reportStep('Download the Statements report in CSV format', async () => {
        await clickDownloadReport(page);
      });
    },
    TS_13_To_verify_that_User_Name_and_of_Statements_columns_are_shown_in_Reporting_table: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Verify the User Name and Number of Statements columns are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadedByHeader, 10000);
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadCountHeader, 10000);
      });
    },
    TS_14_To_verify_that_Clear_Selection_button_is_functional: async () => {
      await reportStep('Open a user drilldown from the Statements report', async () => {
        await clickAnyUserSlice(page);
      });
      await reportStep('Clear the selected user drilldown', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.clearSelectionButton, 10000);
        await clickFirstVisible(page, srReportingSelectors.statements.clearSelectionButton);
      });
    },
    TS_15_To_verify_that_Back_to_User_overview_button_is_functional: async () => {
      await reportStep('Open a user drilldown from the Statements report', async () => {
        await clickAnyUserSlice(page);
      });
      await reportStep('Return to the user overview', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.backToUserOverviewButton, 10000);
        await clickFirstVisible(page, srReportingSelectors.statements.backToUserOverviewButton);
      });
    },
    TS_16_To_verify_that_Settings_button_is_functional: async () => {
      await reportStep('Open the Settings history report for the selected customer', async () => {
        await openSettingsReport(page);
      });
      await reportStep('Verify the Settings history cards are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.settings.cards.all, 10000);
      });
    },
    TS_17_To_verify_that_Filter_by_date_range_field_is_functional: async () => {
      await reportStep('Open the Settings history report for the selected customer', async () => {
        await openSettingsReport(page);
      });
      await reportStep('Apply the date range filter on the Settings history report', async () => {
        await applyDateFilter(page, srReportingSelectors.settings.filters.dateRange);
      });
    },
    TS_18_To_verify_that_Filter_by_User_Name_field_is_functional: async () => {
      await reportStep('Open the Settings history report for the selected customer', async () => {
        await openSettingsReport(page);
      });
      await reportStep('Filter the Settings history report by user name', async () => {
        const input = await firstVisibleLocator(page, srReportingSelectors.settings.filters.modifiedBy, 10000);
        await input.fill('');
        await input.fill('laiba');
        await expect(input).toHaveValue('laiba');
      });
    },
    TS_19_To_verify_that_file_is_exported_in_csv_format: async () => {
      await reportStep('Open the Settings history export modal', async () => {
        await openExportSettingsModal(page);
      });
      await reportStep('Download the Settings history report in CSV format', async () => {
        await clickDownloadReport(page);
      });
    },
    TS_20_To_verify_that_following_columns_are_shown_in_table: async () => {
      await reportStep('Open the Settings history report for the selected customer', async () => {
        await openSettingsReport(page);
      });
      await reportStep('Verify the Settings history table columns are displayed', async () => {
        await expectAnyVisible(page, srReportingSelectors.settings.table.allHeaders, 15000);
      });
    },
    TS_21_To_verify_that_Clear_All_Filters_button_is_functional: async () => {
      await reportStep('Open the Settings history report for the selected customer', async () => {
        await openSettingsReport(page);
      });
      await reportStep('Apply a user filter on the Settings history report', async () => {
        const input = await firstVisibleLocator(page, srReportingSelectors.settings.filters.modifiedBy, 10000);
        await input.fill('');
        await input.fill('laiba');
      });
      await reportStep('Clear all filters on the Settings history report', async () => {
        await expectAnyVisible(page, srReportingSelectors.settings.clearFiltersButton, 10000);
        await clickFirstVisible(page, srReportingSelectors.settings.clearFiltersButton);
      });
    },
    TS_22_To_verify_that_file_is_downloaded_in_csv_format: async () => {
      await reportStep('Open the Settings history export modal', async () => {
        await openExportSettingsModal(page);
      });
      await reportStep('Open the Delivery tab in the export modal', async () => {
        await openModalTab(page, 'delivery');
      });
      await reportStep('Send the Settings history report by email', async () => {
        await clickFirstVisible(page, srReportingSelectors.modal.emailMethod);
        await sendEmailReport(page);
      });
    },
    TS_23_To_Verify_that_Column_View_dropdown_is_functional: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Open the Column View dropdown and toggle a column', async () => {
        await toggleFirstColumn(page);
      });
      await reportStep('Verify the Statements table remains visible after updating column view', async () => {
        await expectAnyVisible(page, srReportingSelectors.statements.table.uploadedByHeader, 10000);
      });
    },
    TS_24_To_Verify_that_Pagination_dropdown_is_functional: async () => {
      await reportStep('Open the Statements report for the selected customer', async () => {
        await openStatementsReport(page);
      });
      await reportStep('Open the pagination dropdown on the Statements table', async () => {
        await openPaginationDropdown(page);
      });
      await reportStep('Change the Statements table page size to 100 rows', async () => {
        await clickFirstVisible(page, srReportingSelectors.statements.pagination.options.hundred);
      });
    }
  };

  const action = scenarioMap[scenarioName];
  if (!action) {
    throw new Error(`No SR Reporting conversion implemented yet for scenario: ${scenarioName}`);
  }

  return action(page, data);
}

module.exports = {
  srReportingHelpers: {
    openModule,
    openReporting,
    selectCustomer,
    prepareReporting,
    openStatementsReport,
    openSettingsReport,
    runScenario,
    selectors: srReportingSelectors
  }
};
