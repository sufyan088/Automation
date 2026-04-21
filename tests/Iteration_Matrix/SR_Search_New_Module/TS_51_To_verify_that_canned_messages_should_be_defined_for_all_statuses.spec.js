const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_51_To_verify_that_canned_messages_should_be_defined_for_all_statuses", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_51_To_verify_that_canned_messages_should_be_defined_for_all_statuses.ds"
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
