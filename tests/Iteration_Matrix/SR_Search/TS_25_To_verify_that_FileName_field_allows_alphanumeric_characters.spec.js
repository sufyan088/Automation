const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_25_To_verify_that_FileName_field_allows_alphanumeric_characters", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_25_To_verify_that_FileName_field_allows_alphanumeric_characters.ds"
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
