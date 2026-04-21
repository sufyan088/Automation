const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_11_To_verify_that_the_First_Page_button_is_functiofnal", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicates_Dashboard/TS_11_To_verify_that_the_First_Page_button_is_functiofnal.ds"
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
