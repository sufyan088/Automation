const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');
const { mgmtInformationSystemHelpers } = require('../../../helpers/iteration-matrix/mgmtInformationSystem.js');

test("TS_124_To_verify_that_the_Customers_dropdown_list_is_in_the_alphabetical_order_for_Payments_Posted", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_124_To_verify_that_the_Customers_dropdown_list_is_in_the_alphabetical_order_for_Payments_Posted.ds"
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
