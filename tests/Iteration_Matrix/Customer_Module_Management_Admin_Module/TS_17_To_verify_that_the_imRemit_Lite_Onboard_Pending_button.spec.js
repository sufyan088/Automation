const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_17_To_verify_that_the_imRemit_Lite_Onboard_Pending_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module/TS_17_To_verify_that_the_imRemit_Lite_Onboard_Pending_button.ds"
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
