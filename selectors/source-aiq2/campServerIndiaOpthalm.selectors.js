const campServerIndiaOpthalmSelectors = {
  opthalmLink: 'a[href="doctor.php"], a:has-text("Ophthalm"), a:has-text("Opthalm")',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  searchForm: '#frmSearch',
  searchFirstNameField: '#se_firstname, input[name="se_firstname"]',
  searchButton: '#btnSearch, button[name="btnSearch"], button:has-text("Search")',
  refreshButton: 'button:has-text("Refresh")',
  sourceTable: '#Source_data table, #Source_data',
  participantCells: '#Source_data td, [onclick*="doctor.php"], [onclick*="doctoredit.php"]',
  stepPreScreening: '#step1',
  stepExamination: '#step2, #step8',
  tableHeaders: '#Source_data thead th',
  suspectedCataractLabels: 'label:has-text("Suspected Cataract"), span:has-text("Suspected Cataract")'
};

module.exports = {
  campServerIndiaOpthalmSelectors
};
