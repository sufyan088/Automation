const { expect } = require('@playwright/test');
const { iterationMatrixCommonSelectors } = require('../../selectors/iteration-matrix/common.selectors');

function requireCredential(value, label) {
  if (String(value || '').trim()) {
    return String(value);
  }

  throw new Error(`${label} is required. Set it in the Iteration Matrix runtime data or environment variables before running tests.`);
}

async function waitForVisible(page, selectors, timeout = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`None of the selectors became visible within ${timeout}ms: ${selectors.join(', ')}`);
}

async function clickIfVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 5000 }).catch(() => null);
      return true;
    }
  }

  return false;
}

async function loginAsAdmin(page, data) {
  const baseUrl = requireCredential(data.URL, 'Iteration Matrix base URL');
  const username = requireCredential(data.Username_Admin, 'Iteration Matrix admin username');
  const password = requireCredential(data.Password_Admin, 'Iteration Matrix admin password');

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  const usernameField = await waitForVisible(page, iterationMatrixCommonSelectors.login.username);
  await usernameField.fill('');
  await usernameField.fill(username);

  const passwordField = await waitForVisible(page, iterationMatrixCommonSelectors.login.password);
  await passwordField.fill('');
  await passwordField.fill(password);

  await clickIfVisible(page, iterationMatrixCommonSelectors.login.rememberMe);

  const signInButton = await waitForVisible(page, iterationMatrixCommonSelectors.login.signIn);
  await signInButton.click({ timeout: 10000 });

  await expect(async () => {
    await waitForVisible(page, iterationMatrixCommonSelectors.app.postLoginMarkers, 10000);
  }).toPass({ timeout: 20000 });
}

async function logout(page) {
  if (!page || page.isClosed()) {
    return;
  }

  const openedProfile = await clickIfVisible(page, iterationMatrixCommonSelectors.app.profileButton);
  if (!openedProfile) {
    return;
  }

  const clickedLogout = await clickIfVisible(page, iterationMatrixCommonSelectors.app.logoutButton);
  if (!clickedLogout) {
    return;
  }

  await waitForVisible(page, iterationMatrixCommonSelectors.login.username, 10000).catch(() => null);
}

module.exports = {
  loginAsAdmin,
  logout
};