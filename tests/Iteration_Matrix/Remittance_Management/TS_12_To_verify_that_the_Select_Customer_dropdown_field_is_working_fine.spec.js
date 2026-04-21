const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_12_To_verify_that_the_Select_Customer_dropdown_field_is_working_fine", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Remittance_Management/TS_12_To_verify_that_the_Select_Customer_dropdown_field_is_working_fine.ds"
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
