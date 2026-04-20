const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers
} = require('./_shared');

test('TC_5_To_Verify_that_pagination_functionality_on_Participant_Consents_page_is_working_Correctly', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents/TC_5_To_Verify_that_pagination_functionality_on_Participant_Consents_page_is_working_Correctly .ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participant Consents and verify pagination to page 2 is clickable', async () => {
    await digiteyesdataloaderParticipantconsentsHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');

    const pageTwoLink = page.locator('#pg_2').first();
    await expect(pageTwoLink, 'Page 2 link should be visible in pagination').toBeVisible({ timeout: 10000 });
    await pageTwoLink.click();

    const recordsInfo = page.locator('.dataTables_info, [id*="datatable_info"], [title*="records"]');
    await expect(recordsInfo.first(), 'Records info should remain visible after page navigation').toBeVisible({ timeout: 10000 });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
