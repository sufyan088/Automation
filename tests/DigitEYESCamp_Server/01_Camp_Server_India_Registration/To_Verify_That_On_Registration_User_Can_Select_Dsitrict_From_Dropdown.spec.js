const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_On_Registration_User_Can_Select_Dsitrict_From_Dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_On_Registration_User_Can_Select_Dsitrict_From_Dropdown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that user can select District from the Registration dropdown', async () => {
    await campServerIndiaRegistrationHelpers.verifyDistrictDropdownSelection(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
