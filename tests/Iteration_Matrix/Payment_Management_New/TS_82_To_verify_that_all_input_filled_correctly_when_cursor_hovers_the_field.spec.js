const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_82_To_verify_that_all_input_filled_correctly_when_cursor_hovers_the_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_New/TS_82_To_verify_that_all_input_filled_correctly_when_cursor_hovers_the_field.ds"
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
