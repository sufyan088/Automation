const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_To_verify_that_Sender_dropdown_allows_multi_selection", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_imREmit_Lite/TS_63_To_verify_that_Sender_dropdown_allows_multi_selection.ds"
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
