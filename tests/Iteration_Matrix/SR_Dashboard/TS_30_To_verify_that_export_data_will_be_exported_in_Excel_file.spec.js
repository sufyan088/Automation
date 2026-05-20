const { test, loadRuntimeData, loginAsAdmin, closeSession, runConvertedFlow } = require('./_shared');

test("TS_30_To_verify_that_export_data_will_be_exported_in_Excel_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_30_To_verify_that_export_data_will_be_exported_in_Excel_file.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await runConvertedFlow(page, data);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
