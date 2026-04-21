const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_03_To_verify_that_the_Last_Page_button_is_Clickable", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite/TS_03_To_verify_that_the_Last_Page_button_is_Clickable.ds"
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
