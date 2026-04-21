const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_127_To_verify_that_the_Customers_dropdown_list_is_in_the_alphabetical_order_for_Percentage_Growth", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_127_To_verify_that_the_Customers_dropdown_list_is_in_the_alphabetical_order_for_Percentage_Growth.ds"
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
