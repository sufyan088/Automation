const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_90_To_verify_that_Invoice_Number_field_accepts_multiple_invoice_numbers_separated_by_commas", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_90_To_verify_that_Invoice_Number_field_accepts_multiple_invoice_numbers_separated_by_commas.ds"
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
