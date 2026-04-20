const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaPrescreeningHelpers
} = require('./_shared');

test("To_Verify_That_All_Checkboxes_Should_Be_Checked_NA_When_No_Complaints_Button_Is_Clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Prescreening/To_Verify_That_All_Checkboxes_Should_Be_Checked_NA_When_No_Complaints_Button_Is_Clicked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaPrescreeningHelpers.verifyNoComplaintsMarksAllAsNa(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
