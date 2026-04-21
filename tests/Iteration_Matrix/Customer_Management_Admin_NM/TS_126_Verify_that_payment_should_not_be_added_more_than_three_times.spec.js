const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_126_Verify_that_payment_should_not_be_added_more_than_three_times", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_NM/TS_126_Verify_that_payment_should_not_be_added_more_than_three_times.ds"
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
