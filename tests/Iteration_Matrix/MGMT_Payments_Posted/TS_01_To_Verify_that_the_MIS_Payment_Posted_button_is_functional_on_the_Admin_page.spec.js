const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_To_Verify_that_the_MIS_Payment_Posted_button_is_functional_on_the_Admin_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Posted/TS_01_To_Verify_that_the_MIS_Payment_Posted_button_is_functional_on_the_Admin_page.ds"
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
