const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_52_To_verify_that_configuration_section_should_be_accessible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_52_To_verify_that_configuration_section_should_be_accessible.ds"
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
