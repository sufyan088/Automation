const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_23_To_verify_that_the_start_date_and_end_date_search_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Premium/TC_23_To_verify_that_the_start_date_and_end_date_search_field_is_functional.ds"
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
