const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_11_To_verify_that_xlsx_extension_will_added_automatically_in_exported_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_11_To_verify_that_xlsx_extension_will_added_automatically_in_exported_file.ds"
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
