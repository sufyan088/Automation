const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_41_To_verify_that_following_field_will_visible_in_Duplicate_Payments_Onboarding_Form_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_41_To_verify_that_following_field_will_visible_in_Duplicate_Payments_Onboarding_Form_page.ds"
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
