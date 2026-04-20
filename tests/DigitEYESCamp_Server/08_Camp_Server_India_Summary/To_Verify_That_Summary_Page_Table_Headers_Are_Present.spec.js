const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaSummaryHelpers
} = require('./_shared');

test("To_Verify_That_Summary_Page_Table_Headers_Are_Present", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Summary/To_Verify_That_Summary_Page_Table_Headers_Are_Present.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaSummaryHelpers.verifySummaryPageTableHeaders(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
