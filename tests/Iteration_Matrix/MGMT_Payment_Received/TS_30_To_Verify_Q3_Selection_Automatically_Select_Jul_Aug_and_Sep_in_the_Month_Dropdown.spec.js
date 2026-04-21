const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_30_To_Verify_Q3_Selection_Automatically_Select_Jul_Aug_and_Sep_in_the_Month_Dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_30_To_Verify_Q3_Selection_Automatically_Select_Jul_Aug_and_Sep_in_the_Month_Dropdown.ds"
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
