const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_To_verify_File_Processing_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/FileProcessing/TS_01_To_verify_File_Processing_button.ds"
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
