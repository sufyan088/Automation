const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_31_To_verify_that_the_Hide_Table_button_is_functional_on_the_Pending_Payments_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Pending_5Days/TS_31_To_verify_that_the_Hide_Table_button_is_functional_on_the_Pending_Payments_page.ds"
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
