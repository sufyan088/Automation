const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_23_To_verify_that_Run_To_Top_button_is_functional_recon_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_23_To_verify_that_Run_To_Top_button_is_functional_recon_file.ds"
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
