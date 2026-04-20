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
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    const pageText = await getPageText(page);

    if (/No Camp is configured yet!/i.test(pageText) || /Please contact Camp Coordinator to Setup Camp Server/i.test(pageText)) {
      throw new Error(`Camp Server is reachable but no active camp is configured for this environment. URL: ${getMainUrl(data.URL)}`);
    }

    if (await emailField.isVisible().catch(() => false)) {
      break;
    }

    await page.waitForTimeout(250);
  }

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

async function getPageText(page) {
  return String(await page.locator('body').textContent().catch(() => '') || '').replace(/\s+/g, ' ').trim();
}

async function resolveCampServerState(page, timeout = 15000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const pageText = await getPageText(page);

    if (/No Camp is configured yet!/i.test(pageText) || /Please contact Camp Coordinator to Setup Camp Server/i.test(pageText)) {
      return { state: 'no-camp-configured', pageText };
    }

    if (await page.getByRole('button', { name: /Run as Station/i }).isVisible().catch(() => false)) {
      return { state: 'run-as-station', pageText };
    }

    if (await page.locator('#emailid').isVisible().catch(() => false)) {
      return { state: 'direct-login', pageText };
    }

    await page.waitForTimeout(250);
  }

  return {
    state: 'unknown',
    pageText: await getPageText(page)
  };
}

async function loginAsAdmin(page, data) {
  if (!data.URL) {
    throw new Error('Missing source-aiq2 base URL. Set SOURCE_AIQ2_BASE_URL or provide URL in data/source-aiq2/*.csv before running Camp Server tests.');
  }

  await page.goto(getMainUrl(data.URL), { waitUntil: 'domcontentloaded' });

  const runAsStationButton = page.getByRole('button', { name: /Run as Station/i });
  const { state, pageText } = await resolveCampServerState(page);

  if (state === 'no-camp-configured') {
    throw new Error(`Camp Server is reachable but no active camp is configured for this environment. URL: ${getMainUrl(data.URL)}`);
  }

  if (state === 'run-as-station') {
    const passwordText = await extractCampPassword(page);
    await runAsStationButton.click();
    await fillAndSubmitLogin(page, data, passwordText);
  } else if (state === 'direct-login') {
    await fillAndSubmitLogin(page, data);
  } else {
    throw new Error(`Camp Server did not show the expected login screen. URL: ${getMainUrl(data.URL)}. Visible page text: ${pageText.slice(0, 300) || '[empty page]'}`);
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
