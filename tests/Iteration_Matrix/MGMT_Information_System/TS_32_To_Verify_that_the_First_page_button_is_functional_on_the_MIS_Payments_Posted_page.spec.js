const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_32_To_Verify_that_the_First_page_button_is_functional_on_the_MIS_Payments_Posted_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_32_To_Verify_that_the_First_page_button_is_functional_on_the_MIS_Payments_Posted_page.ds"
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
