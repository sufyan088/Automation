const {
  openSettingsMenu,
  openSettingsModule,
  openFirstRowConfigure,
  setCheckbox,
  clickSave
} = require('./digiteyessettingsCommon');
const { safeClick, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { commonSelectors } = require('../selectors/common.selectors');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { digiteyessettingsCountrysettingsSelectors } = require('../selectors/digiteyessettingsCountrysettings.selectors');

async function verifySettingsMenu(page, data) {
  await openSettingsMenu(page, data, digiteyessettingsCountrysettingsSelectors);
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.moduleLink, 'Country Settings module link');
}

async function verifySettingsOptions(page, data) {
  await openSettingsMenu(page, data, digiteyessettingsCountrysettingsSelectors);
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.implementationPartnersLink, 'Implementation Partners link');
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.moduleLink, 'Country Settings link');
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.hospitalsLink, 'Hospitals link');
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.deSalesforceFieldMappingLink, 'DE Salesforce Field Mapping link');
}

async function openModule(page, data) {
  await openSettingsModule(page, data, digiteyessettingsCountrysettingsSelectors, 'Country Settings');
}

async function openModuleDirect(page, data) {
  await page.goto(new URL('countrysettings.php', data.URL).toString(), { waitUntil: 'domcontentloaded' });
  await waitForAppToSettle(page, 1000);
  await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, data.visionSpringCountry);
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.pageMarker, 'Country Settings page marker');
}

async function openManageCampClusterFromSidebar(page, data) {
  await safeClick(page, commonSelectors.digitEyesCampsMenu, 'DigitEYES Camps menu');
  await waitForAppToSettle(page, 500);
  await safeClick(page, commonSelectors.manageCampClusterLink, 'Manage Camp Cluster', { noWaitAfter: true });
  await waitForAppToSettle(page, 1000);
  await digiteyescampsManagecampsclusterHelpers.verifyManageCampClusterLanding(page);
  await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, data.visionSpringCountry);
}

async function openCampClusterFormAndSelectCountry(page, data) {
  await openManageCampClusterFromSidebar(page, data);
  await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
    page,
    digiteyescampsManagecampsclusterHelpers.selectors.countryField,
    data.visionSpringCountry,
    'Camp country'
  );
  await waitForAppToSettle(page, 600);
}

async function verifyConfigureButton(page, data) {
  await openModule(page, data);
  await openFirstRowConfigure(page, digiteyessettingsCountrysettingsSelectors);
}

async function openCountryConfigure(page, countryName) {
  const countryRow = page.locator('#datatable tbody tr', { hasText: countryName }).first();
  const rowCount = await countryRow.count();

  if (rowCount > 0) {
    const configureButton = countryRow.locator('button:has(i.fa.fa-cogs), button[title="Configure"]').first();
    await configureButton.click({ timeout: 10000 });
    await waitForAppToSettle(page, 600);
    return;
  }

  await openFirstRowConfigure(page, digiteyessettingsCountrysettingsSelectors);
}

async function verifyCheckboxReflection(page, data, settingKey) {
  const settingMap = {
    fullAddress: {
      settingsSelector: digiteyessettingsCountrysettingsSelectors.fullAddressCheckbox,
      campSelector: digiteyescampsManagecampsclusterHelpers.selectors.fullAddressCheckbox,
      label: 'Full Address'
    },
    prescreening: {
      settingsSelector: digiteyessettingsCountrysettingsSelectors.prescreeningCheckbox,
      campSelector: digiteyescampsManagecampsclusterHelpers.selectors.prescreeningCheckbox,
      label: 'Prescreening'
    },
    preExam: {
      settingsSelector: digiteyessettingsCountrysettingsSelectors.preExamCheckbox,
      campSelector: digiteyescampsManagecampsclusterHelpers.selectors.preExamCheckbox,
      label: 'Pre Exam'
    },
    fflAtPrescreening: {
      settingsSelector: digiteyessettingsCountrysettingsSelectors.fflAtPrescreeningCheckbox,
      campSelector: digiteyescampsManagecampsclusterHelpers.selectors.fflAtPrescreeningCheckbox,
      label: 'FFL at Prescreening'
    }
  };

  const target = settingMap[settingKey];
  if (!target) {
    throw new Error(`Unsupported country setting key: ${settingKey}`);
  }

  await openModule(page, data);
  await openCountryConfigure(page, data.visionSpringCountry);
  await setCheckbox(page, target.settingsSelector, false, `${target.label} setting`);
  await clickSave(page, digiteyessettingsCountrysettingsSelectors);
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.successToast, 'Country settings success toast');

  await openCampClusterFormAndSelectCountry(page, data);
  await digiteyescampsManagecampsclusterHelpers.expectCheckboxState(page, target.campSelector, false, `${target.label} create-form checkbox`);

  await openModuleDirect(page, data);
  await openCountryConfigure(page, data.visionSpringCountry);
  await setCheckbox(page, target.settingsSelector, true, `${target.label} setting restore`);
  await clickSave(page, digiteyessettingsCountrysettingsSelectors);
  await safeExpectVisible(page, digiteyessettingsCountrysettingsSelectors.successToast, 'Country settings success toast');

  await openCampClusterFormAndSelectCountry(page, data);
  await digiteyescampsManagecampsclusterHelpers.expectCheckboxState(page, target.campSelector, true, `${target.label} create-form checkbox`);
}

module.exports = {
  digiteyessettingsCountrysettingsHelpers: {
    verifySettingsMenu,
    verifySettingsOptions,
    openModule,
    verifyConfigureButton,
    verifyCheckboxReflection,
    selectors: digiteyessettingsCountrysettingsSelectors
  }
};
