const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_57_To_verify_that_Text_can_be_edited_for_a_canned_Message", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_57_To_verify_that_Text_can_be_edited_for_a_canned_Message.ds"
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
