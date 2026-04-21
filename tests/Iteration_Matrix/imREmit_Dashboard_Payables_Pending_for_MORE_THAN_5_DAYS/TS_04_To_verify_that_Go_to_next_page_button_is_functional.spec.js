const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_04_To_verify_that_Go_to_next_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Pending_for_MORE_THAN_5_DAYS/TS_04_To_verify_that_Go_to_next_page_button_is_functional.ds"
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
