const { expect } = require('@playwright/test');
const { safeClick, safeExpectVisible, waitForAppToSettle } = require('./actions');
const { digiteyescampsManagecampsclusterHelpers } = require('./digiteyescampsManagecampscluster');
const { digiteyescampsParticipantsSelectors } = require('../selectors/digiteyescampsParticipants.selectors');

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
  await selectParticipantsModule(page, country);
  await verifyPageLoaded(page);
}

async function openSearchFilter(page) {
  await safeClick(page, digiteyescampsParticipantsSelectors.searchFilterButton, 'Search / Filter');
  await waitForAppToSettle(page, 1000);
  await safeExpectVisible(page, digiteyescampsParticipantsSelectors.searchFilterHeading, 'Participant Search / Filter heading', {
    timeoutPerCandidate: 10000
  });
  await safeExpectVisible(page, digiteyescampsParticipantsSelectors.searchFilterModal, 'Participant Search / Filter modal', {
    timeoutPerCandidate: 10000
  });
}

async function closeSearchFilter(page) {
  await safeClick(page, digiteyescampsParticipantsSelectors.closeButton, 'Close Search / Filter');
  await waitForAppToSettle(page, 1000);
  await expect(page.locator('#Modal_frmSearch'), 'Search / Filter modal should close').toBeHidden({ timeout: 10000 });
  await safeExpectVisible(page, digiteyescampsParticipantsSelectors.pageHeading, 'Participants heading', {
    timeoutPerCandidate: 8000
  });
}

async function verifySearchCountryDropdownVisible(page) {
  await safeExpectVisible(
    page,
    digiteyescampsParticipantsSelectors.searchCountryDropdown,
    'Search country dropdown',
    { timeoutPerCandidate: 10000 }
  );
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
