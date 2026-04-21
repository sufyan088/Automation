const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_49_To_verify_that_xlsx_extension_will_be_added_automatically_if_not_included_in_File_Name_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search/TS_49_To_verify_that_xlsx_extension_will_be_added_automatically_if_not_included_in_File_Name_field.ds"
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
