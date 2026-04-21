const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_108_To_verify_the_Consolidated_Recon_Required_checkbox_can_be_checked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_108_To_verify_the_Consolidated_Recon_Required_checkbox_can_be_checked.ds"
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
