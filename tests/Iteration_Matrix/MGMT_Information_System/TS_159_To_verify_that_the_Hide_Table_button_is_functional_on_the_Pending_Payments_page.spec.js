const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtInformationSystemHelpers } = require('./_shared');

test("TS_159_To_verify_that_the_Hide_Table_button_is_functional_on_the_Pending_Payments_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_159_To_verify_that_the_Hide_Table_button_is_functional_on_the_Pending_Payments_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtInformationSystemHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
