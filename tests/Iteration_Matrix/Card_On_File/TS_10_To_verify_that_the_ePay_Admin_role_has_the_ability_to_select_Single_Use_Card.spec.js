const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_10_To_verify_that_the_ePay_Admin_role_has_the_ability_to_select_Single_Use_Card", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_10_To_verify_that_the_ePay_Admin_role_has_the_ability_to_select_Single_Use_Card.ds"
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
