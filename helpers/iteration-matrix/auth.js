const { expect } = require('@playwright/test');
const { iterationMatrixCommonSelectors } = require('../../selectors/iteration-matrix/common.selectors');

function requireCredential(value, label) {
  if (String(value || '').trim()) {
    return String(value);
  }

  throw new Error(`${label} is required. Set it in the Iteration Matrix runtime data or environment variables before running tests.`);
}

function isInvalidCredentialsVisible(page) {
  return page.getByText(/invalid username or password\.?/i).first().isVisible().catch(() => false);
}

async function gotoWithRetry(page, url, options = {}) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await page.goto(url, options);
      return;
    } catch (error) {
      const isRetriableQuicError = /ERR_QUIC_PROTOCOL_ERROR/i.test(error.message || '');
      if (!isRetriableQuicError || attempt === maxAttempts) {
        throw error;
      }

      await page.waitForTimeout(1000 * attempt);
    }
  }
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
    const loginSurfaceVisible = await isVisible(page, iterationMatrixCommonSelectors.login.username);
    const currentUrl = page.url();

    if (loginSurfaceVisible || /\/realms\/|\/login-actions\//i.test(currentUrl)) {
      await page.waitForTimeout(250);
      continue;
    }

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

    const currentUrl = page.url();
    const hasAppShell = await page.locator('main[aria-label="Iteration Matrix Application"], aside[aria-label="Main navigation"], header').first().isVisible().catch(() => false);
    const loginStillVisible = await isVisible(page, iterationMatrixCommonSelectors.login.username);
    if (/\/app\//i.test(currentUrl) && hasAppShell && !loginStillVisible) {
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
    customerAdmin: {
      username: data.UserName_CUSTOMER_ADMIN || data.Username_Customer_Admin || data.Username_CustomerAdmin,
      password: data.Password_CUSTOMER_ADMIN || data.Password_Customer_Admin || data.Password_CustomerAdmin,
      label: 'Iteration Matrix customer admin'
    },
    supplierAdmin: {
      username: data.Username_Supplier_Admin,
      password: data.Password_Supplier_Admin,
      label: 'Iteration Matrix supplier admin'
    },
    supplierUser: {
      username: data.Username_Supplier_User,
      password: data.Password_Supplier_User,
      label: 'Iteration Matrix supplier user'
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
    },
    supplierAdmin: {
      username: process.env.ITERATION_MATRIX_SUPPLIER_ADMIN_USERNAME || 'supplieradmin3',
      password: process.env.ITERATION_MATRIX_SUPPLIER_ADMIN_PASSWORD || '1234',
      label: 'Iteration Matrix supplier admin'
    },
    customerAdmin: {
      username: data.Username_Customer_Admin,
      password: data.Password_Customer_Admin,
      label: 'Iteration Matrix customer admin'
    },
    customerSuperAdmin: {
      username: data.Username_Customer_Super_Admin || process.env.ITERATION_MATRIX_USERNAME_CUSTOMER_SUPER_ADMIN || 'customersuperadmin',
      password: data.Password_Customer_Super_Admin || process.env.ITERATION_MATRIX_PASSWORD_CUSTOMER_SUPER_ADMIN || '1111',
      label: 'Iteration Matrix customer super admin'
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
  const primaryCredentials = resolveRoleCredentials(data, roleKey);
  const credentialAttempts = [primaryCredentials];

  if (roleKey === 'customerAdmin' || roleKey === 'customerSuperAdmin') {
    credentialAttempts.push({
      username: requireCredential(data.Username_Admin, 'Iteration Matrix admin username'),
      password: requireCredential(data.Password_Admin, 'Iteration Matrix admin password')
    });
  }
  await page.goto(baseUrl, { waitUntil: 'commit', timeout: 30000 });

  for (let attemptIndex = 0; attemptIndex < credentialAttempts.length; attemptIndex += 1) {
    const credentials = credentialAttempts[attemptIndex];

    await gotoWithRetry(page, baseUrl, { waitUntil: 'domcontentloaded' });
    await waitForLoginSurface(page, 30000);

    const usernameField = await waitForVisible(page, iterationMatrixCommonSelectors.login.username, 10000);
    await usernameField.fill('');
    await usernameField.fill(credentials.username);

    const passwordField = await waitForVisible(page, iterationMatrixCommonSelectors.login.password, 10000);
    await passwordField.fill('');
    await passwordField.fill(credentials.password);

    await clickIfVisible(page, iterationMatrixCommonSelectors.login.rememberMe);

    const signInButton = await waitForVisible(page, iterationMatrixCommonSelectors.login.signIn);
    await clickIfVisible(page, iterationMatrixCommonSelectors.login.rememberMe);
    await signInButton.click({ timeout: 10000, noWaitAfter: true });

    await page.waitForTimeout(1500);
    if (await isInvalidCredentialsVisible(page)) {
      if (attemptIndex < (credentialAttempts.length - 1)) {
        continue;
      }

      throw new Error(`Invalid credentials were rejected for role ${roleKey}.`);
    }

    try {
      await expect(async () => {
        await waitForAppReady(page, 30000);
      }).toPass({ timeout: 45000 });
      return;
    } catch (error) {
      const canRetrySupplierAdmin = roleKey === 'supplierAdmin'
        && attemptIndex < (credentialAttempts.length - 1)
        && await isInvalidCredentialsVisible(page);
      const canRetryCustomerRoles = (roleKey === 'customerAdmin' || roleKey === 'customerSuperAdmin')
        && attemptIndex < (credentialAttempts.length - 1)
        && await isInvalidCredentialsVisible(page);

      if (canRetrySupplierAdmin || canRetryCustomerRoles) {
        continue;
      }

      throw error;
    }
  }
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