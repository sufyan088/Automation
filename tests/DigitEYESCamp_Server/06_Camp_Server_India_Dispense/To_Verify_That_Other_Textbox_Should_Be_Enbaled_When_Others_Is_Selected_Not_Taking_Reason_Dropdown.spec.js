const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaDispenseHelpers
} = require('./_shared');

test("To_Verify_That_Other_Textbox_Should_Be_Enbaled_When_Others_Is_Selected_Not_Taking_Reason_Dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Dispense/To_Verify_That_Other_Textbox_Should_Be_Enbaled_When_Others_Is_Selected_Not_Taking_Reason_Dropdown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaDispenseHelpers.verifyOtherTextboxShouldBeEnbaledWhenOthersIsSelectedNotTakingReasonDropdown(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
