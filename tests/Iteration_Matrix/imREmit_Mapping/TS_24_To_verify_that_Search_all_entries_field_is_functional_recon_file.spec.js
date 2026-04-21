const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_24_To_verify_that_Search_all_entries_field_is_functional _recon_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_24_To_verify_that_Search_all_entries_field_is_functional _recon_file.ds"
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
