const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_43_To_verify_that_Edit_Criteria_button_is_functional_for_Exclude_Date_Format_Invoices_card", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_43_To_verify_that_Edit_Criteria_button_is_functional_for_Exclude_Date_Format_Invoices_card.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
