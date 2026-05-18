const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');
const { mgmtInformationSystemHelpers } = require('../../../helpers/iteration-matrix/mgmtInformationSystem.js');

test("TS_90_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Month_dropdown_for_Payments_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_90_To_verify_that_the_Select_All_option_is_selected_by_default_in_the_Month_dropdown_for_Payments_Received.ds"
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
