const digiteyesdataloaderDataforsalesforceSelectors = {
  moduleLabel: 'Data for Salesforce',
  pageLabel: 'Data for Salesforce heading',
  tableLabel: 'Data for Salesforce listing table',
  dataLoaderMenu: [
    { type: 'role', role: 'link', options: { name: /digiteyes data loader/i }, name: 'role:DigitEYES Data Loader link' },
    { type: 'role', role: 'button', options: { name: /digiteyes data loader/i }, name: 'role:DigitEYES Data Loader button' },
    { type: 'text', value: 'DigitEYES Data Loader', name: 'text:DigitEYES Data Loader' }
  ],
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /data for salesforce/i }, name: 'role:Data for Salesforce' },
    { type: 'text', value: 'Data for Salesforce', name: 'text:Data for Salesforce' },
    { type: 'xpath', value: '//a[contains(normalize-space(),"Data for Salesforce")]', name: 'xpath:Data for Salesforce link' }
  ],
  pageHeading: [
    { type: 'role', role: 'heading', options: { name: /data for salesforce/i }, name: 'role:Data for Salesforce heading' },
    { type: 'text', value: 'Data for Salesforce', name: 'text:Data for Salesforce heading' },
    { type: 'xpath', value: '//h3[normalize-space()="Data for Salesforce"]', name: 'xpath:Data for Salesforce heading' }
  ],
  listingTable: [
    { type: 'css', value: '#datatable', name: 'css:#datatable' },
    { type: 'xpath', value: '//table[@id="datatable"]', name: 'xpath:#datatable' }
  ],
  searchFilterButton: [
    { type: 'role', role: 'button', options: { name: /search\s*\/\s*filter/i }, name: 'role:Search / Filter' },
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'text', value: 'Search / Filter', name: 'text:Search / Filter' },
    {
      type: 'custom',
      name: 'custom:Search / Filter button text',
      factory: (page) => page.locator('button, a').filter({ hasText: /search\s*\/\s*filter/i })
    }
  ],
  refreshButton: [
    { type: 'role', role: 'button', options: { name: /^refresh$/i }, name: 'role:Refresh' },
    { type: 'text', value: 'Refresh', name: 'text:Refresh' }
  ],
  searchFilterModal: [
    { type: 'css', value: '#Modal_frmSearch.show', name: 'css:#Modal_frmSearch.show' },
    { type: 'css', value: '#Modal_frmSearch[style*="display: block"]', name: 'css:#Modal_frmSearch[display:block]' },
    {
      type: 'custom',
      name: 'custom:visible search filter modal',
      factory: (page) => page.locator('#Modal_frmSearch').filter({ has: page.locator('button, a, input').filter({ hasText: /^Apply$|^Reset$|^Close$/i }) })
    }
  ],
  searchLocationLabel: [
    { type: 'text', value: 'Location', name: 'text:Location' },
    { type: 'xpath', value: '//label[contains(normalize-space(),"Location")]', name: 'xpath:Location label' }
  ],
  searchLocationField: [
    { type: 'css', value: 'input[name="search_location"]', name: 'css:input[name=search_location]' },
    { type: 'css', value: '#search_location', name: 'css:#search_location' }
  ],
  searchApplyButton: [
    {
      type: 'xpath',
      value: '//div[@id="Modal_frmSearch"]//button[normalize-space()="Apply"]',
      name: 'xpath:modal Apply'
    },
    { type: 'role', role: 'button', options: { name: /^apply$/i }, name: 'role:Apply' },
    { type: 'text', value: 'Apply', name: 'text:Apply' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Apply"]', name: 'xpath:Apply' }
  ],
  searchResetButton: [
    {
      type: 'xpath',
      value: '//div[@id="Modal_frmSearch"]//button[normalize-space()="Reset"]',
      name: 'xpath:modal Reset'
    },
    { type: 'role', role: 'button', options: { name: /^reset$/i }, name: 'role:Reset' },
    { type: 'text', value: 'Reset', name: 'text:Reset' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Reset"]', name: 'xpath:Reset' }
  ],
  searchCloseButton: [
    {
      type: 'xpath',
      value: '//div[@id="Modal_frmSearch"]//button[normalize-space()="Close"]',
      name: 'xpath:modal Close'
    },
    { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'role:Close' },
    { type: 'text', value: 'Close', name: 'text:Close' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Close"]', name: 'xpath:Close' }
  ],
  downloadXlsButton: [
    { type: 'css', value: '.btnDownloadXLS', name: 'css:.btnDownloadXLS' },
    { type: 'css', value: '.fa-file-excel-o', name: 'css:.fa-file-excel-o' },
    { type: 'text', value: 'XLS', name: 'text:XLS' }
  ],
  downloadCsvButton: [
    { type: 'css', value: '.btnDownloadCSV', name: 'css:.btnDownloadCSV' },
    { type: 'css', value: '.fa-file-csv-o', name: 'css:.fa-file-csv-o' },
    { type: 'text', value: 'CSV', name: 'text:CSV' }
  ],
  viewSummaryReportButton: [
    { type: 'css', value: '.btnViewSummaryReport', name: 'css:.btnViewSummaryReport' },
    { type: 'text', value: 'View Summary Report', name: 'text:View Summary Report' }
  ],
  viewSummaryReportHeading: [
    { type: 'css', value: '#lblDetailsTitle', name: 'css:#lblDetailsTitle' },
    { type: 'text', value: 'View Summary Report', name: 'text:View Summary Report heading' }
  ],
  showDatesButton: [
    { type: 'role', role: 'button', options: { name: /show dates/i }, name: 'role:Show Dates' },
    { type: 'text', value: 'Show Dates', name: 'text:Show Dates' },
    {
      type: 'custom',
      name: 'custom:#datatable Show Dates',
      factory: (page) => page.locator('#datatable').locator('button, a').filter({ hasText: /show dates/i })
    }
  ],
  searchFilterHeading: [
    { type: 'css', value: '#myModalLabel', name: 'css:#myModalLabel' },
    { type: 'xpath', value: '//h4[normalize-space()="Camp Cluster Data Search / Filter"]', name: 'xpath:filter heading' }
  ],
  searchFilterXButton: [
    { type: 'css', value: '#Modal_frmSearch .btn-close', name: 'css:modal X close' },
    { type: 'xpath', value: '//div[@id="Modal_frmSearch"]//button[@class="btn-close"]', name: 'xpath:modal btn-close' }
  ],
  dataImportedPendingRadio: [
    { type: 'css', value: 'input[value="Pending"]', name: 'css:Pending radio' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//input[@value="Pending"]', name: 'xpath:Pending radio' }
  ],
  dataImportedMarkedRadio: [
    { type: 'css', value: 'input[value="Marked"]', name: 'css:Marked radio' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//input[@value="Marked"]', name: 'xpath:Marked radio' }
  ],
  dataImportedAllRadio: [
    { type: 'css', value: 'input[value="All"]', name: 'css:All radio' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//input[@value="All"]', name: 'xpath:All radio' }
  ],
  pageSizeDropdown: [
    { type: 'css', value: '.dataTables_length select', name: 'css:.dataTables_length select' },
    { type: 'css', value: 'select[name="datatable_length"]', name: 'css:select[name=datatable_length]' }
  ],
  searchTokenHeaders: ['Location', 'Camp Information']
};

module.exports = {
  digiteyesdataloaderDataforsalesforceSelectors
};
