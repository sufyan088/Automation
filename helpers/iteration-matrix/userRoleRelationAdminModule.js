const { userRoleRelationAdminModuleSelectors } = require('../../selectors/iteration-matrix/userRoleRelationAdminModule.selectors.js');

async function waitForFirstVisible(page, selectors, timeout = 15000) {
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

async function clickFirstVisible(page, selectors, timeout = 15000) {
  const locator = await waitForFirstVisible(page, selectors, timeout);
  await locator.click({ timeout: 5000 });
  return locator;
}

async function openAdminModule(page) {
  await clickFirstVisible(page, userRoleRelationAdminModuleSelectors.adminModule);
}

async function openModule(page) {
  await openAdminModule(page);
  await clickFirstVisible(page, userRoleRelationAdminModuleSelectors.userRoleRelationLink);
  await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.pageHeading);
  return page;
}

async function verifyPageLoaded(page) {
  await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.pageHeading);
}

async function openUserDropdown(page) {
  await clickFirstVisible(page, userRoleRelationAdminModuleSelectors.selectUserButton);
  await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.userOptions);
}

async function selectFirstUser(page, preferredNames = []) {
  await openUserDropdown(page);

  for (const preferredName of preferredNames) {
    const option = page.getByRole('option', { name: preferredName }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click({ timeout: 5000 });
      return preferredName;
    }
  }

  if (preferredNames.length) {
    throw new Error(`None of the expected users were available in the User Role Relation dropdown: ${preferredNames.join(', ')}`);
  }

  for (const selector of userRoleRelationAdminModuleSelectors.userOptions) {
    const option = page.locator(selector).first();
    if (await option.isVisible().catch(() => false)) {
      const optionText = (await option.textContent().catch(() => ''))?.trim() || '';
      await option.click({ timeout: 5000 });
      return optionText;
    }
  }

  throw new Error('No visible user option was available in the User Role Relation dropdown.');
}

async function verifyReturnToTop(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  try {
    const button = await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.returnToTopButton, 3000);
    await button.click({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch {
    // AIQ uses clickIfFound here, so absence is non-failing.
  }
}

async function verifyActionButtons(page) {
  await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.unassignSelectedRolesButton);
  await waitForFirstVisible(page, userRoleRelationAdminModuleSelectors.assignSelectedRolesButton);
}

async function assignFirstAvailableRoles(page, count = 2) {
  const selectedLabels = [];
  const checkboxes = page.locator(userRoleRelationAdminModuleSelectors.roleCheckboxButtons[0]);
  const total = await checkboxes.count();

  for (let index = 0; index < total && selectedLabels.length < count; index += 1) {
    const checkbox = checkboxes.nth(index);
    if (!(await checkbox.isVisible().catch(() => false))) {
      continue;
    }

    const checked = (await checkbox.getAttribute('data-state').catch(() => '')) === 'checked'
      || (await checkbox.getAttribute('aria-checked').catch(() => '')) === 'true';
    if (checked) {
      continue;
    }

    const containerText = (await checkbox.locator('xpath=ancestor::div[1]').textContent().catch(() => ''))?.trim() || '';
    await checkbox.click({ timeout: 5000 });
    selectedLabels.push(containerText);
  }

  if (!selectedLabels.length) {
    throw new Error('No available unchecked role checkbox was found to assign.');
  }

  await clickFirstVisible(page, userRoleRelationAdminModuleSelectors.assignSelectedRolesButton);
  return selectedLabels;
}

module.exports = {
  userRoleRelationAdminModuleHelpers: {
    openModule,
    openAdminModule,
    verifyPageLoaded,
    openUserDropdown,
    selectFirstUser,
    verifyReturnToTop,
    verifyActionButtons,
    assignFirstAvailableRoles,
    selectors: userRoleRelationAdminModuleSelectors
  }
};
