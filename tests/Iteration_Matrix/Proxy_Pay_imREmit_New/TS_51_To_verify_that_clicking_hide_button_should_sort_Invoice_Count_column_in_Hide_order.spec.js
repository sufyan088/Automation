const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_51_To_verify_that_clicking_hide_button_should_sort_Invoice_Count_column_in_Hide_order", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_New/TS_51_To_verify_that_clicking_hide_button_should_sort_Invoice_Count_column_in_Hide_order.ds"
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
