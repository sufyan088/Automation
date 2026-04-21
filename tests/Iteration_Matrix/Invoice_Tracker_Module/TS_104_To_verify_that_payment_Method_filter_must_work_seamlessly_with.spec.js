const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_104_To_verify_that_payment_Method_filter_must_work_seamlessly_with", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_104_To_verify_that_payment_Method_filter_must_work_seamlessly_with.ds"
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
