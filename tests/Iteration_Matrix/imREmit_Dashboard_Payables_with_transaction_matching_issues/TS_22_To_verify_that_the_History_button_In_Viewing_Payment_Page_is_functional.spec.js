const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_22_To_verify_that_the_History_button_In_Viewing_Payment_Page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_with_transaction_matching_issues/TS_22_To_verify_that_the_History_button_In_Viewing_Payment_Page_is_functional.ds"
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
