const { test, loadRuntimeData, loginAsAdmin, closeSession, srUploadNewHelpers } = require('./_shared');

test("TS_12_To_verify_that_multiple_suppliers_can_not_selected_from_Searching_Suppliers_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Upload_New/TS_12_To_verify_that_multiple_suppliers_can_not_selected_from_Searching_Suppliers_dropdown_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await srUploadNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
