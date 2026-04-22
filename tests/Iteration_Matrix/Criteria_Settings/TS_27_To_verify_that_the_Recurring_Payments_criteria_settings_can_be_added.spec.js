const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_27_To_verify_that_the_Recurring_Payments_criteria_settings_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  const criteriaValue = String(Date.now()).slice(-3);
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_27_To_verify_that_the_Recurring_Payments_criteria_settings_can_be_added.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
  });

  await test.step('Add Recurring Payments criteria', async () => {
    await criteriaSettingsHelpers.openCriteriaCardAction(page, 'Recurring Payments', 'Add Criteria');
    await criteriaSettingsHelpers.fillRecurringPaymentsFields(page, {
      supplierId: `9${criteriaValue}`,
      invoiceAmount: criteriaValue,
      facilityId: `8${criteriaValue}`
    });
    await criteriaSettingsHelpers.submitCriteriaDialog(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
