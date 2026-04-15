const { expect } = require('@playwright/test');

function getMainUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.pathname = '/server.php';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

async function fillAndSubmitLogin(page, data, fallbackPassword = '') {
  const emailField = page.locator('#emailid');
  const personNameField = page.locator('#personname');
  const passwordField = page.locator('#password');
  const loginButton = page.locator('#loginBtn');

  await expect(emailField).toBeVisible({ timeout: 15000 });
  await expect(personNameField).toBeVisible({ timeout: 15000 });
  await expect(passwordField).toBeVisible({ timeout: 15000 });

  await emailField.fill(data.Username_Admin);
  await personNameField.fill(data.CampServerPersonName);
  await passwordField.fill((fallbackPassword || data.Password_Admin || '').trim());
  await loginButton.click();
}

async function extractCampPassword(page) {
  const explicitPasswordText = await page.getByText(/Camp Password:/i).first().textContent().catch(() => '');
  const inlinePasswordMatch = String(explicitPasswordText || '').match(/Camp Password:\s*(\S+)/i);

  if (inlinePasswordMatch?.[1]) {
    return inlinePasswordMatch[1].trim();
  }

  const pageText = await page.locator('body').textContent().catch(() => '');
  const pageMatch = String(pageText || '').match(/Camp Password:\s*(\S+)/i);
  return pageMatch?.[1]?.trim() || '';
}

async function loginAsAdmin(page, data) {
  if (!data.URL) {
    throw new Error('Missing source-aiq2 base URL. Set SOURCE_AIQ2_BASE_URL or provide URL in data/source-aiq2/*.csv before running Camp Server tests.');
  }

  await page.goto(getMainUrl(data.URL), { waitUntil: 'domcontentloaded' });

  const runAsStationButton = page.getByRole('button', { name: /Run as Station/i });
  const emailField = page.locator('#emailid');

  if (await runAsStationButton.isVisible().catch(() => false)) {
    const passwordText = await extractCampPassword(page);
    await runAsStationButton.click();
    await fillAndSubmitLogin(page, data, passwordText);
  } else if (await emailField.isVisible().catch(() => false)) {
    await fillAndSubmitLogin(page, data);
  }

  await expect(page.locator('#navbars')).toBeVisible({ timeout: 15000 });
}

async function logout(page) {
  return page;
}

module.exports = {
  loginAsAdmin,
  logout
};
