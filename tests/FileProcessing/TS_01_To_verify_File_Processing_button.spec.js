const { test, expect } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, closeSession } = require('./_shared');
const { safeClick, safeExpectVisible } = require('../../helpers/actions');
const { imremitSelectors } = require('../../selectors/imremit.selectors');

test('TS_01_To_verify_File_Processing_button', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit', async () => {
    await openImRemitModule(page);
  });

  await test.step('Navigate to File Processing', async () => {
    await safeClick(page, imremitSelectors.fileProcessingNav, 'File Processing navigation');
  });

  await test.step('Verify File Processing page is displayed', async () => {
    await expect(page).toHaveURL(/file-processing/);
    await safeExpectVisible(page, imremitSelectors.selectAllCustomer, 'Select All customer control visible on File Processing page');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
