const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_02_To_verify_a_Single_Sign_On_SSO", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_02_To_verify_a_Single_Sign_On_SSO.ds"
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
