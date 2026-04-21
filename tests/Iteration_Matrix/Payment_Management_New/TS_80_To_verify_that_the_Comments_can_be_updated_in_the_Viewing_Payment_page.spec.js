const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_80_To_verify_that_the_Comments_can_be_updated_in_the_Viewing_Payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_New/TS_80_To_verify_that_the_Comments_can_be_updated_in_the_Viewing_Payment_page.ds"
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
