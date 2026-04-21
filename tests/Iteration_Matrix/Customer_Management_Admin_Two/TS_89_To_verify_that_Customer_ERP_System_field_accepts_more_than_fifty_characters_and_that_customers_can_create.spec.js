const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_89_To_verify_that_Customer_ERP_System_field_accepts_more_than_fifty_characters_and_that_customers_can_create", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_89_To_verify_that_Customer_ERP_System_field_accepts_more_than_fifty_characters_and_that_customers_can_create.ds"
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
