const { expect, test } = require('@playwright/test');
const { safeClick, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { digiteyescampsParticipantsSelectors } = require('../selectors/digiteyescampsParticipants.selectors');

async function runStep(title, action) {
  return test.step(title, action);
}

async function selectParticipantsModule(page, country = 'India') {
  await digiteyescampsManagecampsclusterHelpers.selectLoginCountry(page, country);
  await safeClick(page, digiteyescampsParticipantsSelectors.participantsLink, 'Participants');
  await waitForAppToSettle(page, 1000);
}

async function verifyPageLoaded(page) {
  await safeExpectVisible(page, digiteyescampsParticipantsSelectors.pageHeading, 'Participants heading', {
    timeoutPerCandidate: 8000
  });
  await safeExpectVisible(page, digiteyescampsParticipantsSelectors.searchFilterButton, 'Search / Filter button', {
    timeoutPerCandidate: 8000
  });
}

async function openModule(page, country = 'India') {
  await runStep(`Select login country "${country}" and open the Participants module from the sidebar`, async () => {
    await selectParticipantsModule(page, country);
  });

  await runStep('Assert that the Participants page is displayed with the Search / Filter action', async () => {
    await verifyPageLoaded(page);
  });
}

async function openSearchFilter(page) {
  await runStep('Open the Participants Search / Filter modal', async () => {
    await safeClick(page, digiteyescampsParticipantsSelectors.searchFilterButton, 'Search / Filter');
    await waitForAppToSettle(page, 1000);
  });

  await runStep('Assert that the Participants Search / Filter heading and modal are displayed', async () => {
    await safeExpectVisible(page, digiteyescampsParticipantsSelectors.searchFilterHeading, 'Participant Search / Filter heading', {
      timeoutPerCandidate: 10000
    });
    await safeExpectVisible(page, digiteyescampsParticipantsSelectors.searchFilterModal, 'Participant Search / Filter modal', {
      timeoutPerCandidate: 10000
    });
  });
}

async function closeSearchFilter(page) {
  await runStep('Close the Participants Search / Filter modal', async () => {
    await safeClick(page, digiteyescampsParticipantsSelectors.closeButton, 'Close Search / Filter');
    await waitForAppToSettle(page, 1000);
  });

  await runStep('Assert that the Search / Filter modal closes and the Participants page remains visible', async () => {
    await expect(page.locator('#Modal_frmSearch'), 'Search / Filter modal should close').toBeHidden({ timeout: 10000 });
    await safeExpectVisible(page, digiteyescampsParticipantsSelectors.pageHeading, 'Participants heading', {
      timeoutPerCandidate: 8000
    });
  });
}

async function verifySearchCountryDropdownVisible(page) {
  await runStep('Assert that the Country dropdown is displayed in the Participants Search / Filter modal', async () => {
    await safeExpectVisible(
      page,
      digiteyescampsParticipantsSelectors.searchCountryDropdown,
      'Search country dropdown',
      { timeoutPerCandidate: 10000 }
    );
  });
}

module.exports = {
  digiteyescampsParticipantsHelpers: {
    selectParticipantsModule,
    openModule,
    verifyPageLoaded,
    openSearchFilter,
    closeSearchFilter,
    verifySearchCountryDropdownVisible,
    selectors: digiteyescampsParticipantsSelectors
  }
};
