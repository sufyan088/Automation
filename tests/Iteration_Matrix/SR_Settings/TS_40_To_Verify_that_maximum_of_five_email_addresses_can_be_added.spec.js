const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_40_To_Verify_that_maximum_of_five_email_addresses_can_be_added", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Settings/TS_40_To_Verify_that_maximum_of_five_email_addresses_can_be_added.ds"
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
