const { test, loadRuntimeData, loginAsAdmin, closeSession, srReportingNewHelpers } = require('./_shared');

test("TS_43_To_verify_user_can_add_multiple_email_in_email_delivery_method", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Reporting_New/TS_43_To_verify_user_can_add_multiple_email_in_email_delivery_method.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await srReportingNewHelpers.runScenario(page, data, 'TS_43_To_verify_user_can_add_multiple_email_in_email_delivery_method');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
