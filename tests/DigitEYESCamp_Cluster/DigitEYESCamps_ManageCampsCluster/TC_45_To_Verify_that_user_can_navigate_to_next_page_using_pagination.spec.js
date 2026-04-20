const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_45_To_Verify_that_user_can_navigate_to_next_page_using_pagination", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_45_To_Verify_that_user_can_navigate_to_next_page_using_pagination.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Navigate to the next result page using pagination', async () => {
    await digiteyescampsManagecampsclusterHelpers.setListingPageSize(page, 'Show: 5');
    const firstPageReference = await page.locator('#datatable tbody tr td:nth-child(2)').first().textContent();
    await digiteyescampsManagecampsclusterHelpers.goToListingPage(page, 2);
    const secondPageReference = await page.locator('#datatable tbody tr td:nth-child(2)').first().textContent();

    expect(secondPageReference?.trim()).not.toBe(firstPageReference?.trim());
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
