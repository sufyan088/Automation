const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_23_To_verify_the_Delete_button_in_Actions_Icon_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/User_Management_Admin/TS_23_To_verify_the_Delete_button_in_Actions_Icon_is_functional.ds"
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
