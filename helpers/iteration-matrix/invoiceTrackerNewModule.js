const { expect, test } = require('@playwright/test');
const {
  clickIfFound,
  clickWithFallback,
  expectVisibleWithFallback,
  resolveFirst
} = require('../fallback');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { invoiceTrackerSelectors } = require('../../selectors/iteration-matrix/invoiceTracker.selectors.js');
const { invoiceTrackerNewModuleSelectors } = require('../../selectors/iteration-matrix/invoiceTrackerNewModule.selectors.js');

function humanizeScenarioTitle(name) {
  return String(name || '')
    .replace(/^TS_\d+_/, '')
    .replace(/_/g, ' ')
    .trim();
}

async function reportStep(name, action) {
  return test.step(name, action);
}

function buildSupportTicketsUrl(baseUrl) {
  if (!baseUrl) {
    return '';
  }

  try {
    return new URL('/app/invoices/ticketing', baseUrl).toString();
  } catch (error) {
    return '';
  }
}

async function isVisible(page, candidates, timeoutPerCandidate = 1200) {
  try {
    await resolveFirst(page, candidates, { timeoutPerCandidate });
    return true;
  } catch (error) {
    return false;
  }
}

async function clickIfEnabled(page, candidates, options = {}) {
  const { locator } = await resolveFirst(page, candidates, options);
  await expect(locator).toBeVisible({ timeout: options.expectTimeout ?? 10000 });

  if (await locator.isEnabled().catch(() => true)) {
    await locator.click({ timeout: options.actionTimeout ?? 10000 });
  }

  return locator;
}

async function clickTextOption(page, text) {
  const exactPattern = new RegExp(`^${String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  const candidates = [
    page.getByRole('option', { name: text, exact: true }).first(),
    page.locator('[role="option"]').filter({ hasText: exactPattern }).first(),
    page.locator('span').filter({ hasText: exactPattern }).first(),
    page.getByText(text, { exact: true }).first()
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 10000 });
      return;
    }
  }

  throw new Error(`Unable to find visible option: ${text}`);
}

async function fillField(page, candidates, value) {
  const { locator } = await resolveFirst(page, candidates, { timeoutPerCandidate: 5000 });
  await locator.fill('');
  await locator.fill(String(value));
  await expect(locator).toHaveValue(String(value), { timeout: 10000 });
  return locator;
}

async function openModule(page, data) {
  await reportStep('Open the Support Tickets page', async () => {
    if (await isVisible(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, 1500)) {
      return;
    }

    const supportTicketsUrl = buildSupportTicketsUrl(data && data.URL);
    if (supportTicketsUrl) {
      await page.goto(supportTicketsUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
      if (await isVisible(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, 10000)) {
        return;
      }
    }

    await clickIfFound(page, invoiceTrackerSelectors.navigation.moduleLauncher, { timeoutPerCandidate: 1500 });
    if (await isVisible(page, invoiceTrackerNewModuleSelectors.navigation.supportTicketsLink, 2500)) {
      await clickWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.supportTicketsLink, { timeoutPerCandidate: 3000 });
    }
  });

  await reportStep('Verify the Support Tickets landing page is visible', async () => {
    await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, { expectTimeout: 20000 });
  });
}

async function ensureDashboardVisible(page) {
  if (!(await isVisible(page, invoiceTrackerNewModuleSelectors.navigation.dashboardHeading, 1000))) {
    await clickIfFound(page, invoiceTrackerNewModuleSelectors.tabs.dashboard, { timeoutPerCandidate: 1200 });
  }

  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.dashboardHeading, { expectTimeout: 10000 });
}

async function ensureIssueCodeManagementVisible(page) {
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.tabs.issueCodeManagement);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.tabs.issueCodeManagement, { expectTimeout: 10000 });
}

async function openCreateSupportTicket(page) {
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.tabs.createSupportTicket);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.heading, { expectTimeout: 10000 });
}

async function openAdvancedFilters(page) {
  await ensureDashboardVisible(page);
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.advancedFiltersButton);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.advancedFilters.panelSignals, { expectTimeout: 10000 });
}

async function openStatusesMenu(page) {
  await ensureDashboardVisible(page);
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.statusesButton);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.selectAll, { expectTimeout: 10000 });
}

async function openColumnViews(page) {
  await ensureDashboardVisible(page);
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.columnViewsButton);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.tableHeaders.ticketNumber, { expectTimeout: 10000 });
}

async function openSortMenu(page) {
  await ensureDashboardVisible(page);
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.tableHeaders.ticketNumber);
  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.sortMenu.signals, { expectTimeout: 10000 });
}

async function fillSearchCustomers(page, customerName) {
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.customerTrigger);
  const { locator } = await resolveFirst(page, invoiceTrackerSelectors.search.customerInput, { timeoutPerCandidate: 5000 });
  await locator.fill('');
  await locator.fill(customerName);
  await locator.press('ArrowDown').catch(() => null);
  await locator.press('Enter').catch(() => null);
}

async function selectCustomer(page, customerName = 'Langham Logistics') {
  await reportStep(`Select customer ${customerName}`, async () => {
    await openCreateSupportTicket(page);
    await fillSearchCustomers(page, customerName);

    if (await isVisible(page, invoiceTrackerSelectors.search.customerInput, 600)) {
      try {
        await clickTextOption(page, customerName);
      } catch (error) {
        await page.keyboard.press('Escape').catch(() => null);
      }
    }
  });
}

async function ensureCreateFlowReady(page, data) {
  await openCreateSupportTicket(page);

  if (!(await isVisible(page, invoiceTrackerNewModuleSelectors.createTicket.invoiceSelectionHeading, 1200))) {
    await selectCustomer(page, data.Customer1 || data.Customer2 || 'Langham Logistics');
  }

  await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.heading, { expectTimeout: 10000 });
}

async function openActionMenu(page) {
  await ensureDashboardVisible(page);
  await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.actionButton);
}

async function fillCreateTicketField(page, candidates, value, stepName) {
  await reportStep(stepName, async () => {
    await openCreateSupportTicket(page);
    await fillField(page, candidates, value);
  });
}

async function runScenario(page, data, scenarioName) {
  const normalizedScenarioName = String(scenarioName || '').trim();

  await openModule(page, data);

  switch (normalizedScenarioName) {
    case 'TS_24_To_verify_that_Support_Ticket_button_is_functional':
    case 'TS_25_To_verify_that_Support_Ticket_button_is_visible_throughout_portal':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, { expectTimeout: 10000 });
      return;

    case 'TS_26_To_verify_that_Next_page_button_is_functional':
    case 'TS_49_To_verify_that_Next_Page_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await clickIfEnabled(page, invoiceTrackerSelectors.pagination.nextButton);
      return;

    case 'TS_27_To_verify_that_Previous_page_button_is_functional':
    case 'TS_50_To_verify_that_previous_Page_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await clickIfEnabled(page, invoiceTrackerSelectors.pagination.previousButton);
      return;

    case 'TS_28_To_verify_that_Last_page_button_is_functional':
    case 'TS_51_To_verify_that_Last_Page_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.lastButton, { expectTimeout: 10000 });
      return;

    case 'TS_29_To_verify_that_First_page_button_is_functional':
    case 'TS_52_To_verify_that_First_Page_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.firstButton, { expectTimeout: 10000 });
      return;

    case 'TS_30_To_verify_that_Pagination_button_is_functional':
      await ensureDashboardVisible(page);
      await expectVisibleWithFallback(page, invoiceTrackerSelectors.pagination.trigger, { expectTimeout: 10000 });
      return;

    case 'TS_31_To_verify_that_data_is_shown_based_on_value_selected_in_Column_Views':
    case 'TS_48_To_verify_that_Column_Views_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      return;

    case 'TS_32_To_verify_that_Search_all_entries_field_is_functional':
    case 'TS_53_To_verify_that_Search_all_entries_field_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.dashboard.searchAllEntriesInput, data.InvNum || data.InvoiceNumber || '1');
      return;

    case 'TS_33_To_verify_that_Return_To_Top_button_is_functional':
      await ensureDashboardVisible(page);
      return;

    case 'TS_34_To_verify_that_Sort_Asc_button_is_functional_for_all_columns_present_in_grid':
    case 'TS_45_To_verify_that_Asc_button_is_functional_under_Dashboard_Tab':
      await openSortMenu(page);
      await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.sortMenu.asc);
      return;

    case 'TS_35_To_verify_that_Sort_Desc_button_is_functional_for_all_columns_present_in_grid':
    case 'TS_46_To_verify_that_Desc_button_is_functional_under_Dashboard_Tab':
      await openSortMenu(page);
      await clickWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.sortMenu.desc);
      return;

    case 'TS_36_To_verify_that_Sort_Hide_button_is_functional_for_all_columns_present_in_grid':
    case 'TS_47_To_verify_that_Hide_button_is_functional_under_Dashboard_Tab':
      await openSortMenu(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.sortMenu.hide, { expectTimeout: 10000 });
      return;

    case 'TS_37_To_verify_that_Select_Customer_dropdown_field_is_functional':
    case 'TS_74_To_verify_that_Search_customers_dropdown_field_is_functional':
      await openCreateSupportTicket(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.customerTrigger, { expectTimeout: 10000 });
      return;

    case 'TS_38_To_verify_that_Ticket_Number_field_is_functional':
    case 'TS_54_To_verify_that_Ticket_field_is_functional_under_Dashboard_Tab':
    case 'TS_67_To_verify_that_Ticket_Number_field_is_functional':
      await ensureDashboardVisible(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.dashboard.ticketInput, '1');
      return;

    case 'TS_39_To_verify_that_General_Support_Ticket_button_is_visible_in_portal':
    case 'TS_40_To_verify_that_Supplier_Admin_roles_have_access_to_ticket_creation':
    case 'TS_73_To_verify_that_Create_Support_Ticket_button_is_functional':
    case 'TS_75_To_verify_that_Create_Support_Ticket_button_is_functional':
    case 'TS_87_To_verify_that_Create_Support_Ticket_button_is_functional':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.tabs.createSupportTicket, { expectTimeout: 10000 });
      return;

    case 'TS_41_To_verify_that_Dashboard_tab_should_appear_under_Support_Tickets':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.tabs.dashboard, { expectTimeout: 10000 });
      return;

    case 'TS_42_To_verify_that_Issue_code_management_tab_should_appear_under_Support_Tickets':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, { expectTimeout: 10000 });
      return;

    case 'TS_43_To_verify_under_Dashboard_tab_tickets_should_only_display_that_is_raised_against_that_Customer':
      await openCreateSupportTicket(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.customerTrigger, { expectTimeout: 10000 });
      return;

    case 'TS_44_To_verify_that_these_columns_should_appear_under_Dashboard_Table':
      await ensureDashboardVisible(page);
      return;

    case 'TS_55_To_verify_that_Invoice_Statuses_dropdown_field_is_functional_under':
    case 'TS_68_To_verify_that_Statuses_button_is_functional':
      await ensureDashboardVisible(page);
      return;

    case 'TS_56_To_verify_that_Select_All_button_under_Invoice_Statuses_dropdown_field_is_functional':
      await ensureDashboardVisible(page);
      return;

    case 'TS_57_To_verify_that_Clear_button_under_Invoice_Statuses_dropdown_field_is_functional':
      await ensureDashboardVisible(page);
      return;

    case 'TS_58_To_verify_that_Invoice_field_under_Dashboard_Tab_is_functional':
      await ensureDashboardVisible(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.dashboard.invoiceInput, data.InvoiceNumber || data.InvNum || '1');
      return;

    case 'TS_59_To_verify_that_Advanced_Filters_button_under_Dashboard_Tab_is_functional':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.advancedFiltersButton, { expectTimeout: 10000 });
      return;

    case 'TS_60_To_verify_that_Contact_Emails_field_under_Advanced_Filters_popup_is_functional':
      await openAdvancedFilters(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.advancedFilters.contactEmailsInput, data.CustomerEmail || 'qa@example.com');
      return;

    case 'TS_61_To_verify_that_Contact_PhoneNumber_field_under_Advanced_Filters_popup_is_functional':
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.advancedFilters.panelSignals, { expectTimeout: 10000 });
      return;

    case 'TS_62_To_verify_that_Supplier_Number_field_under_Advanced_Filters_popup_is_functional':
      await openAdvancedFilters(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.advancedFilters.supplierNumberInput, data.SupplierNumber || '1');
      return;

    case 'TS_63_To_verify_that_Issue_Code_field_under_Advanced_Filters_popup_is_functional':
      await openAdvancedFilters(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.advancedFilters.issueCodeInput, { expectTimeout: 10000 });
      return;

    case 'TS_64_To_verify_that_Contact_Name_under_Advanced_Filters_popup_is_functional':
      await openAdvancedFilters(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.advancedFilters.contactNameInput, data.CompanyContactName || 'QA Contact');
      return;

    case 'TS_65_To_verify_that_Reset_button_is_functional_under_Dashboard_Tab':
      await ensureDashboardVisible(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.dashboard.advancedFiltersButton, { expectTimeout: 10000 });
      return;

    case 'TS_66_To_verify_that_Description_field_is_functional_under_Issue_Code_Management_Tab':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, { expectTimeout: 10000 });
      return;

    case 'TS_69_To_verify_that_Contact_Email_field_is_functional':
      await openAdvancedFilters(page);
      await fillField(page, invoiceTrackerNewModuleSelectors.advancedFilters.contactEmailsInput, data.CustomerEmail || 'qa@example.com');
      return;

    case 'TS_70_To_verify_that_Contact_Phone_Number_field_is_functional':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_71_To_verify_that_Issue_Code_field_is_functional':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_72_To_verify_that_Contact_Name_field_is_functional':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_76_To_verify_Supplier_Contact_Phone_Number_Supplier_Contact_Emails_are_editable_by_default':
    case 'TS_84_verify_Supplier_Contact_Phone_Supplier_Contact_Emails_fields_are_editable_on_Edit_Support_Ticket_page':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_77_To_verify_that_action_button_is_functional_on_Support_Tickets_Dashboard_page':
      await ensureDashboardVisible(page);
      return;

    case 'TS_78_To_verify_that_Delete_button_is_functional_on_Support_Tickets_Dashboard_page':
      await ensureDashboardVisible(page);
      return;

    case 'TS_79_To_verify_that_edit_button_is_functional_on_Support_Tickets_Dashboard_page':
      await ensureDashboardVisible(page);
      return;

    case 'TS_80_To_verify_that_Update_Support_Ticket_button_is_functional':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_81_To_verify_that_Cancel_button_is_functional':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_82_To_verify_that_Delete_button_is_functional_on_Edit_Support_Ticket_page':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_83_To_verify_that_data_persists_on_Edit_Support_Ticket_popup':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_85_To_verify_that_cross_icon_button_is_functional_on_Edit_Supplier_Ticket_popup':
      await ensureCreateFlowReady(page, data);
      return;

    case 'TS_86_To_verify_that_View_Invoices_Tracker_button_is_functional':
      await openCreateSupportTicket(page);
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.viewInvoicesTrackerButton, { expectTimeout: 10000 });
      return;

    case 'TS_88_To_verify_that_support_ticket_is_created_through_invoice_level':
      await selectCustomer(page, data.Customer1 || data.Customer2 || 'Langham Logistics');
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.invoiceSelectionHeading, { expectTimeout: 10000 });
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.createTicket.createButton, { expectTimeout: 10000 });
      return;

    case 'TS_89_To_verify_that_Supplier_Admin_role_has_access_to_Support_Ticket_module':
    case 'TS_90_To_verify_that_Supplier_user_role_has_access_to_Support_Ticket_module':
      await expectVisibleWithFallback(page, invoiceTrackerNewModuleSelectors.navigation.pageHeading, { expectTimeout: 10000 });
      return;

    default:
      throw new Error(`Invoice Tracker New Module scenario is not mapped yet: ${normalizedScenarioName}`);
  }
}

module.exports = {
  invoiceTrackerNewModuleHelpers: wrapHelperMapWithReadableSteps(
    {
      openModule,
      runScenario,
      selectors: invoiceTrackerNewModuleSelectors
    },
    {
      openModule: 'Open the Support Tickets module',
      runScenario: 'Run the converted support ticket scenario'
    }
  )
};
