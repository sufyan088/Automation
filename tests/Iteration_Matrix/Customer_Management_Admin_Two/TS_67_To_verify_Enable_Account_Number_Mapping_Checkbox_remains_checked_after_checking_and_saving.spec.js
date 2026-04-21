const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_67_To_verify_Enable_Account_Number_Mapping_Checkbox_remains_checked_after_checking_and_saving", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Management_Admin_Two/TS_67_To_verify_Enable_Account_Number_Mapping_Checkbox_remains_checked_after_checking_and_saving.ds"
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
