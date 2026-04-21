const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_08_To_verify_Toggle_Columns_functionality_is_working_properly", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoices_Mapping/TS_08_To_verify_Toggle_Columns_functionality_is_working_properly.ds"
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
