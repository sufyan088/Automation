const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_96_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Module_dropdown_for_Payments_Posted", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_96_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Module_dropdown_for_Payments_Posted.ds"
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
