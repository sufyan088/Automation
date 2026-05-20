const { test, loadRuntimeData, loginAsAdmin, closeSession, runConvertedFlow } = require('./_shared');

test("TS_31_To_verify_that_we_can_see_all_statements_that_have_uploaded_by_Customer_and_their_suppliers", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_31_To_verify_that_we_can_see_all_statements_that_have_uploaded_by_Customer_and_their_suppliers.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await runConvertedFlow(page, data);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
