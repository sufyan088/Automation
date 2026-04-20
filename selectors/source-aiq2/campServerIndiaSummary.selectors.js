const { campServerIndiaRegistrationSelectors } = require('./campServerIndiaRegistration.selectors');

const campServerIndiaSummarySelectors = {
  homeLink: campServerIndiaRegistrationSelectors.homeLink,
  registrationLink: campServerIndiaRegistrationSelectors.registrationLink,
  dashboardLink: campServerIndiaRegistrationSelectors.dashboardLink,
  preScreeningLink: campServerIndiaRegistrationSelectors.preScreeningLink,
  preExamLink: campServerIndiaRegistrationSelectors.preExamLink,
  examinationLink: campServerIndiaRegistrationSelectors.examinationLink,
  ophthalmLink: campServerIndiaRegistrationSelectors.ophthalmLink,
  dispenseLink: campServerIndiaRegistrationSelectors.dispenseLink,
  participantsLink: campServerIndiaRegistrationSelectors.participantsLink,
  summaryLink: campServerIndiaRegistrationSelectors.summaryLink,
  navContainer: 'nav .container-fluid, nav.container-fluid, .navbar .container-fluid',
  dashboardContainer: '#dashboardcontent',
  statsContainer: '#divstats',
  statsRows: '#divstats tbody tr',
  syncContainer: '#divsync',
  syncHeading: '#divsync h3',
  detailModal: '#divPreview',
  detailModalText: '#divDetails td.text-center, #divDetails',
  detailModalCloseButton: '#divPreview button.btn-close, .modal.show button.btn-close',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  refreshButton: '#btnRefresh, button[name="btnRefresh"], button:has-text("Refresh")',
  sourceTable: '#Source_data table, #Source_data',
  sourceTableHeaders: '#Source_data thead th',
  toastMessages: '#toast-container .toast .toast-title, #toast-container .toast .toast-message'
};

module.exports = {
  campServerIndiaSummarySelectors
};
