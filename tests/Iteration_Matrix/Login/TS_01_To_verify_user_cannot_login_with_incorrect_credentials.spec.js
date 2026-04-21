const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_To_verify_user_cannot_login_with_incorrect_credentials", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_01_To_verify_user_cannot_login_with_incorrect_credentials.ds"
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
