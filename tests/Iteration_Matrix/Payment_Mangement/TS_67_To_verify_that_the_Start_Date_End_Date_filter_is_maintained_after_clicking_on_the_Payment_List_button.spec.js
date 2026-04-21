const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_67_To_verify_that_the_Start_Date_End_Date_filter_is_maintained_after_clicking_on_the_Payment_List_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Mangement/TS_67_To_verify_that_the_Start_Date_End_Date_filter_is_maintained_after_clicking_on_the_Payment_List_button.ds"
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
