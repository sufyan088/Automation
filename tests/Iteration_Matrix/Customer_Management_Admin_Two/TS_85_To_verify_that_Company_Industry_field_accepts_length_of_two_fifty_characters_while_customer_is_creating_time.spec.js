const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_85_To_verify_that_Company_Industry_field_accepts_length_of_two_fifty_characters_while_customer_is_creating_time", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_85_To_verify_that_Company_Industry_field_accepts_length_of_two_fifty_characters_while_customer_is_creating_time.ds"
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
