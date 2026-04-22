const { test, loadRuntimeData, loginAsAdmin, closeSession, criteriaSettingsHelpers } = require('./_shared');

test("TS_12_To_verify_that_the_First_Page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings/TS_12_To_verify_that_the_First_Page_button_is_functional.ds"
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

  await test.step('Go to last page then return to first page', async () => {
    const pagination = await criteriaSettingsHelpers.readPaginationState(page);
    await criteriaSettingsHelpers.clickPaginationButton(page, 'lastPage');
    await criteriaSettingsHelpers.expectPageNumber(page, pagination.totalPages);
    await criteriaSettingsHelpers.clickPaginationButton(page, 'firstPage');
    await criteriaSettingsHelpers.expectPageNumber(page, 1);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
