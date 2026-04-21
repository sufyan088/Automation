const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_79_To_verify_that_PO_Match_Hover_Over_icon_should_be_removed", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_79_To_verify_that_PO_Match_Hover_Over_icon_should_be_removed.ds"
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
