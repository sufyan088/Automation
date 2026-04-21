const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_06_To_Verify_That_Pagination_Button_Is_Functional ", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Mangement/TS_06_To_Verify_That_Pagination_Button_Is_Functional .ds"
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
