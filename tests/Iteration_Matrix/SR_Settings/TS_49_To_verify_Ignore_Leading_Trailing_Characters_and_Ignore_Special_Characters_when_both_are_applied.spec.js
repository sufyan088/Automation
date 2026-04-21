const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_49_To_verify_Ignore_Leading_Trailing_Characters_and_Ignore_Special_Characters_when_both_are_applied", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_49_To_verify_Ignore_Leading_Trailing_Characters_and_Ignore_Special_Characters_when_both_are_applied.ds"
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
