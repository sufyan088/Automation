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

async function waitForLoginSurface(page, timeout = 30000) {
  const startedAt = Date.now();
  let reloadedStalledShell = false;

  while ((Date.now() - startedAt) < timeout) {
    if (await isVisible(page, iterationMatrixCommonSelectors.login.username)) {
      return;
    }

    const authShellVisible = await isVisible(page, iterationMatrixCommonSelectors.login.pageShell);
    if (authShellVisible && !reloadedStalledShell && (Date.now() - startedAt) > 8000) {
      reloadedStalledShell = true;
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => null);
      continue;
    }

    if (await isVisible(page, iterationMatrixCommonSelectors.app.errorPage)) {
      await clickIfVisible(page, iterationMatrixCommonSelectors.app.errorPageRecovery);
      await page.waitForLoadState('domcontentloaded').catch(() => null);
    }

    await page.waitForTimeout(250);
  }

  throw new Error('Iteration Matrix login form did not render from the authentication shell.');
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

async function isVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

async function waitForAppReady(page, timeout = 30000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeout) {
    if (await isVisible(page, iterationMatrixCommonSelectors.app.errorPage)) {
      await clickIfVisible(page, iterationMatrixCommonSelectors.app.errorPageRecovery);
      await page.waitForLoadState('domcontentloaded').catch(() => null);
      await page.waitForTimeout(1000);
      continue;
    }

    if (await isVisible(page, iterationMatrixCommonSelectors.app.loadingWorkspace)) {
      await page.waitForTimeout(500);
      continue;
    }

    if (await isVisible(page, iterationMatrixCommonSelectors.app.postLoginMarkers)) {
      return;
    }

    await page.waitForTimeout(250);
  }

  throw new Error('Iteration Matrix app did not reach a ready post-login state.');
}

function resolveRoleCredentials(data, roleKey) {
  const roleMap = {
    admin: {
      username: data.Username_Admin,
      password: data.Password_Admin,
      label: 'Iteration Matrix admin'
    },
    management: {
      username: data.Username_Management,
      password: data.Password_Management,
      label: 'Iteration Matrix management'
    },
    projectManager: {
      username: data.Username_ProjectManager,
      password: data.Password_ProjectManager,
      label: 'Iteration Matrix project manager'
    },
    programManager: {
      username: data.Username_ProgramManager,
      password: data.Password_ProgramManager,
      label: 'Iteration Matrix program manager'
    },
    ePayAdmin: {
      username: data.Username_imREmit_Admin,
      password: data.Password_imREmit_Admin,
      label: 'Iteration Matrix ePay admin'
    },
    ePayUser: {
      username: data.Username_imREmit_User,
      password: data.Password_imREmit_User,
      label: 'Iteration Matrix ePay user'
    }
  };

  const credentials = roleMap[roleKey];
  if (!credentials) {
    throw new Error(`Unsupported Iteration Matrix role: ${roleKey}`);
  }

  return {
    username: requireCredential(credentials.username, `${credentials.label} username`),
    password: requireCredential(credentials.password, `${credentials.label} password`)
  };
}

async function loginAsRole(page, data, roleKey = 'admin') {
  const baseUrl = requireCredential(data.URL, 'Iteration Matrix base URL');
  const credentials = resolveRoleCredentials(data, roleKey);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  await waitForLoginSurface(page, 30000);

  const usernameField = await waitForVisible(page, iterationMatrixCommonSelectors.login.username, 10000);
  await usernameField.fill('');
  await usernameField.fill(credentials.username);

  const passwordField = await waitForVisible(page, iterationMatrixCommonSelectors.login.password, 10000);
  await passwordField.fill('');
  await passwordField.fill(credentials.password);

  await clickIfVisible(page, iterationMatrixCommonSelectors.login.rememberMe);

  const signInButton = await waitForVisible(page, iterationMatrixCommonSelectors.login.signIn);
  await signInButton.click({ timeout: 10000 });

  await expect(async () => {
    await waitForAppReady(page, 30000);
  }).toPass({ timeout: 45000 });
}

async function loginAsAdmin(page, data) {
  await loginAsRole(page, data, 'admin');
}

async function logout() {
  return;
}

module.exports = {
  loginAsAdmin,
  loginAsRole,
  logout
};