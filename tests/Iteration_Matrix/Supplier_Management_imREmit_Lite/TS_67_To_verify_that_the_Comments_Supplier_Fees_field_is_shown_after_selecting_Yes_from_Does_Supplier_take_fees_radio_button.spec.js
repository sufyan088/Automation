const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_67_To_verify_that_the_Comments_Supplier_Fees_field_is_shown_after_selecting_Yes_from_Does_Supplier_take_fees_radio_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_67_To_verify_that_the_Comments_Supplier_Fees_field_is_shown_after_selecting_Yes_from_Does_Supplier_take_fees_radio_button.ds"
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
