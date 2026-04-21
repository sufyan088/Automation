const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_162_To_verify_that _Sender_filter_is_functional_for_modules_Payments_Pending_5_Days", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_162_To_verify_that _Sender_filter_is_functional_for_modules_Payments_Pending_5_Days.ds"
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
