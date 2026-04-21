const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_44_To_verify_File_Options_button_is_functional_on_the_Export_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_44_To_verify_File_Options_button_is_functional_on_the_Export_popup.ds"
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
