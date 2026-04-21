const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_27_To_verify_that_first_one_should_be_auto_populated_as_users_email_address", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_27_To_verify_that_first_one_should_be_auto_populated_as_users_email_address.ds"
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
