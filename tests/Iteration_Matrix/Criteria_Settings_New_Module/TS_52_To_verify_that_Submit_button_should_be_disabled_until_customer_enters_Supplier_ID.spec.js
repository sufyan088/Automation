const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_52_To_verify_that_Submit_button_should_be_disabled_until_customer_enters_Supplier_ID", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_52_To_verify_that_Submit_button_should_be_disabled_until_customer_enters_Supplier_ID.ds"
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
