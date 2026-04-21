const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_14_To_verify_that_the_column_names_can_be_toggled_in_the_Column_Views_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Remittance_Management/TS_14_To_verify_that_the_column_names_can_be_toggled_in_the_Column_Views_dropdown_field.ds"
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
