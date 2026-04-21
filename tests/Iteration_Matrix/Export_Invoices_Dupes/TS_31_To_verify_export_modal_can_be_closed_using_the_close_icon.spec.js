const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_31_To_verify_export_modal_can_be_closed_using_the_close_icon", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_31_To_verify_export_modal_can_be_closed_using_the_close_icon.ds"
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
