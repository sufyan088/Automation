const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_77_To_verify_that_Potential_Match_Hover_Over_icon_description_should_be_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_77_To_verify_that_Potential_Match_Hover_Over_icon_description_should_be_updated.ds"
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
