const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_18_To_verify_that_the_User_Details_can_be_updated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/User_Management_Admin/TS_18_To_verify_that_the_User_Details_can_be_updated.ds"
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
