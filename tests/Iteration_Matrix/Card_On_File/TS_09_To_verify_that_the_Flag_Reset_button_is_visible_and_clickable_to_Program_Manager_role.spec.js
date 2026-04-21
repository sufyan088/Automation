const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_09_To_verify_that_the_Flag_Reset_button_is_visible_and_clickable_to_Program_Manager_role", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Card_On_File/TS_09_To_verify_that_the_Flag_Reset_button_is_visible_and_clickable_to_Program_Manager_role.ds"
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
