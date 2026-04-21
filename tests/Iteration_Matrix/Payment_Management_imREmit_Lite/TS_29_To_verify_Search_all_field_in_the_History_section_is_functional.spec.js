const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_29_To_verify_Search_all_field_in_the_History_section is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit_Lite/TS_29_To_verify_Search_all_field_in_the_History_section is_functional.ds"
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
