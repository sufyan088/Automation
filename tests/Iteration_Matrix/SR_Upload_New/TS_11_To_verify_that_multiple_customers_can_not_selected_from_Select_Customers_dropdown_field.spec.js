const { test, loadRuntimeData, loginAsAdmin, closeSession, srUploadNewHelpers } = require('./_shared');

test("TS_11_To_verify_that_multiple_customers_can_not_selected_from_Select_Customers_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Upload_New/TS_11_To_verify_that_multiple_customers_can_not_selected_from_Select_Customers_dropdown_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srUploadNewHelpers.openModule(page);
    await srUploadNewHelpers.selectCustomer(page, 'Langham Logistics');
    await srUploadNewHelpers.selectCustomer(page, 'A New Mobile Co');
    await srUploadNewHelpers.verifySelectedCustomer(page, 'A New Mobile Co', 'Langham Logistics');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
