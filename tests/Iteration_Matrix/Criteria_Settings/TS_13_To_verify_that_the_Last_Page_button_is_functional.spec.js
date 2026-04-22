const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_13_To_verify_that_the_Last_Page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_13_To_verify_that_the_Last_Page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Criteria Settings page', async () => {
    await criteriaSettingsHelpers.openModule(page);
    await criteriaSettingsHelpers.selectCustomer(page, 'Stanford U');
    await criteriaSettingsHelpers.openPageSizeMenu(page);
    await criteriaSettingsHelpers.choosePageSize(page, 5);
  });

  await test.step('Navigate to the last page', async () => {
    const pagination = await criteriaSettingsHelpers.readPaginationState(page);
    await criteriaSettingsHelpers.clickPaginationButton(page, 'lastPage');
    await criteriaSettingsHelpers.expectPageNumber(page, pagination.totalPages);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
