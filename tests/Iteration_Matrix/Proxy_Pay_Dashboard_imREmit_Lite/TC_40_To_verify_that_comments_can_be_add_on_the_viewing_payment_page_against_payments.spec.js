const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_40_To_verify_that_comments_can_be_add_on_the_viewing_payment_page_against_payments", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite/TC_40_To_verify_that_comments_can_be_add_on_the_viewing_payment_page_against_payments.ds"
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
