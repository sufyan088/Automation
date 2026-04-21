const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_15_If_Universal_Acceptor_No_Payment_Limits_Yes_following_fields_should_made_visible_to_user", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_15_If_Universal_Acceptor_No_Payment_Limits_Yes_following_fields_should_made_visible_to_user.ds"
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
