const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_92_To_verify_that_Field_Name_should_be_named_as_Payment_Method", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_Module/TS_92_To_verify_that_Field_Name_should_be_named_as_Payment_Method.ds"
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
