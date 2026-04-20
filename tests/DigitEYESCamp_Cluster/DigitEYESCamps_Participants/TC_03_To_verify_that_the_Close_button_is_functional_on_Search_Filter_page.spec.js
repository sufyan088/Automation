const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsParticipantsHelpers
} = require('./_shared');

test("TC_03_To_verify_that_the_Close_button_is_functional_on_Search_Filter_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/Participants/TC_03_To_verify_that_the_Close_button_is_functional_on_Search_Filter_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyescampsParticipantsHelpers.openModule(page, data.Country || 'India');
    await digiteyescampsParticipantsHelpers.openSearchFilter(page);
    await digiteyescampsParticipantsHelpers.closeSearchFilter(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
