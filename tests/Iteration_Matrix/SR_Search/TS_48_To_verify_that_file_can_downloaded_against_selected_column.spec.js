const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_48_To_verify_that_file_can_downloaded_against_selected_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_48_To_verify_that_file_can_downloaded_against_selected_column.ds"
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
