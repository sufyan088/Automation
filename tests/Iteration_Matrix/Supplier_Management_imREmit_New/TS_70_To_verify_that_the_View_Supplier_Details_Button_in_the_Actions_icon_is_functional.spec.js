const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_70_To_verify_that_the_View_Supplier_Details_Button_in_the_Actions_icon_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_New/TS_70_To_verify_that_the_View_Supplier_Details_Button_in_the_Actions_icon_is_functional.ds"
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
