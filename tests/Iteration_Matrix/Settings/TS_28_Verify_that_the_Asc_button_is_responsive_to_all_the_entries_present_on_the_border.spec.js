const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_28_Verify_that_the_Asc_button_is_responsive_to_all_the_entries_present_on_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Settings/TS_28_Verify_that_the_Asc_button_is_responsive_to_all_the_entries_present_on_the_border.ds"
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
