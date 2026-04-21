const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_89_To_verify_that_Clear_All_button_is_functional_for_Select_Facility_dropdown_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit/TS_89_To_verify_that_Clear_All_button_is_functional_for_Select_Facility_dropdown_field.ds"
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
