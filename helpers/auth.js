const { safeClick, safeFill, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { commonSelectors } = require('../selectors/common.selectors');
const { clickIfFound } = require('./fallback');

async function loginAsAdmin(page, data) {
  // Retry navigation up to 5 times with exponential backoff for network errors
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await page.goto(data.URL, { waitUntil: 'domcontentloaded' });
      await waitForAppToSettle(page, 1000);
      break; // Success - exit retry loop
    } catch (error) {
      lastError = error;
      if (attempt < 5) {
        const delayMs = 1000 * attempt; // 1s, 2s, 3s, 4s backoff
        console.log(`Navigation attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await page.waitForTimeout(delayMs);
      } else {
        throw lastError; // All retries failed
      }
    }
  }

  try {
    await page.locator('#username, input[name="username"], input[type="text"]').first().waitFor({ state: 'visible', timeout: 10000 });
  } catch (error) {
    console.log(`Login form did not become visible within the initial wait: ${error.message}`);
  }

  await safeFill(page, commonSelectors.loginUsername, data.Username_Admin, 'Username', { timeoutPerCandidate: 5000 });
  await safeFill(page, commonSelectors.loginPassword, data.Password_Admin, 'Password', { timeoutPerCandidate: 5000 });

  // Keep this optional because the control state can vary between sessions.
  await safeClick(page, commonSelectors.rememberMe, 'Remember Me').catch(() => {});

  await safeClick(page, commonSelectors.signIn, 'Sign In');
  await waitForAppToSettle(page, 2500);
  await safeExpectVisible(page, commonSelectors.managementLanding, 'Management landing verification', { timeoutPerCandidate: 5000 });
}

async function logout(page) {
  await waitForAppToSettle(page, 750);
  const explicitLogoutControls = [
    page.getByRole('button', { name: /log out|logout/i }).first(),
    page.getByText(/^logout$/i).first(),
    page.locator('button').filter({ hasText: /logout/i }).first()
  ];

  for (const locator of explicitLogoutControls) {
    if (await locator.count()) {
      try {
        await locator.click({ timeout: 5000, force: true });
        await page.waitForTimeout(1500);
        return;
      } catch (error) {
        console.log(`Direct logout control click failed: ${error.message}`);
      }
    }
  }

  const directLogout = await clickIfFound(page, commonSelectors.logout, { timeoutPerCandidate: 1500, actionTimeout: 5000 });

  if (!directLogout.clicked) {
    await safeClick(page, commonSelectors.userProfile, 'User Profile');
    await page.waitForTimeout(500);
    await safeClick(page, commonSelectors.logout, 'Logout');
  } else {
    console.log(`[CLICK] Logout -> ${directLogout.matchedBy}`);
  }

  await page.waitForTimeout(1500);
}

module.exports = {
  loginAsAdmin,
  logout
};
