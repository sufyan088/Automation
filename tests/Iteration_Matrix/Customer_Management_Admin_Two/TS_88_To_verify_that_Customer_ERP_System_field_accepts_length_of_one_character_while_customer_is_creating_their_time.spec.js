const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_88_To_verify_that_Customer_ERP_System_field_accepts_length_of_one_character_while_customer_is_creating_their_time", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_88_To_verify_that_Customer_ERP_System_field_accepts_length_of_one_character_while_customer_is_creating_their_time.ds"
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
