const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_05_To_verify_that_the_Go_to_previous_page_button_is_functional_on_the_Duplicate_Tracker_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicates_Tracker/TS_05_To_verify_that_the_Go_to_previous_page_button_is_functional_on_the_Duplicate_Tracker_page.ds"
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
