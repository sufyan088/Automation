const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_02_To_verify_that_the_Go_to_the_last_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Search/TS_02_To_verify_that_the_Go_to_the_last_page_button_is_functional.ds"
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
