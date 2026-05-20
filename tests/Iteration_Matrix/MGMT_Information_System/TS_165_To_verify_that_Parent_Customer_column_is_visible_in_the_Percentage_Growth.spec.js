const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtInformationSystemHelpers } = require('./_shared');

test("TS_165_To_verify that_Parent_Customer_column_is_visible_in_the_Percentage_Growth", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_165_To_verify that_Parent_Customer_column_is_visible_in_the_Percentage_Growth.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtInformationSystemHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
