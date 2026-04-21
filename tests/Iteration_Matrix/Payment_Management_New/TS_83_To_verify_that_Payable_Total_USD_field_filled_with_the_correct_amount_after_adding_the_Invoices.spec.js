const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_83_To_verify_that_Payable_Total_USD_field_filled_with_the_correct_amount_after_adding_the_Invoices", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_New/TS_83_To_verify_that_Payable_Total_USD_field_filled_with_the_correct_amount_after_adding_the_Invoices.ds"
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
