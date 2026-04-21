const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_To_verify_that_Verbiage_of_Missed_Credits_Card_is_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_42_To_verify_that_Verbiage_of_Missed_Credits_Card_is_updated.ds"
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
