const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_81_To_verify_that_Customer_Aliases_accepts_special_characters_and_create_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_81_To_verify_that_Customer_Aliases_accepts_special_characters_and_create_customer.ds"
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
