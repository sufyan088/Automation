const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_20_To_verify_that_the_Download_Image_button_is_functional_on_the_Payment_Posted_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Posted/TS_20_To_verify_that_the_Download_Image_button_is_functional_on_the_Payment_Posted_page.ds"
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
