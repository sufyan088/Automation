const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_59_To_verify_that_Daily_and_Monthly_Transaction_Limit_Number_updated to_1_when_the_authorization_type_updated_to_Single", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Mangement/TS_59_To_verify_that_Daily_and_Monthly_Transaction_Limit_Number_updated to_1_when_the_authorization_type_updated_to_Single.ds"
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
