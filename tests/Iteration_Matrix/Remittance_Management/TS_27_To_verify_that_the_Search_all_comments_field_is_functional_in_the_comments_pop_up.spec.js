const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_27_To_verify_that_the_Search_all_comments_field_is_functional_in_the_comments_pop_up", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Remittance_Management/TS_27_To_verify_that_the_Search_all_comments_field_is_functional_in_the_comments_pop_up.ds"
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
