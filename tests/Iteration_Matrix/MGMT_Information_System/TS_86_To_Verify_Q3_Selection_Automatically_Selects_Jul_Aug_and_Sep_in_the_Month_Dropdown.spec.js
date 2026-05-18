const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');
const { mgmtInformationSystemHelpers } = require('../../../helpers/iteration-matrix/mgmtInformationSystem.js');

test("TS_86_To_Verify_Q3_Selection_Automatically_Selects_Jul_Aug_and_Sep_in_the_Month_Dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_86_To_Verify_Q3_Selection_Automatically_Selects_Jul_Aug_and_Sep_in_the_Month_Dropdown.ds"
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
