const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_04_To_verify_that_the_captcha_timer_field_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Script_Management_imREmit_Lite/TC_04_To_verify_that_the_captcha_timer_field_is_functional.ds"
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
