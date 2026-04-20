const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaOpthalmHelpers
} = require('./_shared');

test("To_Verify_That_Pre-Screening_Data_Should_Be_Displayed_In_Ophthalm_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Opthalm/To_Verify_That_Pre-Screening_Data_Should_Be_Displayed_In_Ophthalm_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaOpthalmHelpers.verifyPreScreeningDataShouldBeDisplayedInOphthalmPage(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
