const digiteyesreportingSummarysheetdataSelectors = {
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /summary sheet data/i }, name: 'role:Summary Sheet Data' },
    { type: 'css', value: 'a[href="report-summarysheetdata.php"]', name: 'css:report-summarysheetdata.php' },
    { type: 'text', value: 'Summary Sheet Data', name: 'text:Summary Sheet Data' }
  ],
  pageMarker: [
    { type: 'role', role: 'heading', options: { name: /report:\s*summary data/i }, name: 'role:Report Summary Data heading' },
    { type: 'text', value: 'Report: Summary Data', name: 'text:Report: Summary Data' },
    { type: 'xpath', value: '//h3[contains(normalize-space(),"Report: Summary Data")]', name: 'xpath:Report Summary Data heading' }
  ],
  summaryHeading: [
    { type: 'role', role: 'heading', options: { name: /report:\s*summary data/i }, name: 'role:Report Summary Data heading' },
    { type: 'text', value: 'Report: Summary Data', name: 'text:Report: Summary Data' },
    { type: 'xpath', value: '//h3[contains(normalize-space(),"Report: Summary Data")]', name: 'xpath:Report Summary Data heading' }
  ],
  refreshButton: [
    { type: 'role', role: 'button', options: { name: /^refresh$/i }, name: 'role:Refresh' },
    { type: 'text', value: 'Refresh', name: 'text:Refresh' }
  ],
  dateFromField: [
    { type: 'css', value: '#search_datefrom', name: 'css:#search_datefrom' },
    { type: 'css', value: 'input[name="search_datefrom"]', name: 'css:input[name=search_datefrom]' },
    { type: 'xpath', value: '//*[@id="search_datefrom"]', name: 'xpath:#search_datefrom' }
  ],
  dateToField: [
    { type: 'css', value: '#search_dateto', name: 'css:#search_dateto' },
    { type: 'css', value: 'input[name="search_dateto"]', name: 'css:input[name=search_dateto]' },
    { type: 'xpath', value: '//*[@id="search_dateto"]', name: 'xpath:#search_dateto' }
  ],
  themeField: [
    { type: 'css', value: '#search_theme', name: 'css:#search_theme' },
    { type: 'css', value: 'select[name="search_theme"]', name: 'css:select[name=search_theme]' },
    { type: 'xpath', value: '//*[@id="search_theme"]', name: 'xpath:#search_theme' }
  ],
  countryField: [
    { type: 'css', value: '#search_countrycode', name: 'css:#search_countrycode' },
    { type: 'css', value: 'select[name="search_countrycode"]', name: 'css:select[name=search_countrycode]' },
    { type: 'xpath', value: '//*[@id="search_countrycode"]', name: 'xpath:#search_countrycode' }
  ],
  runReportButton: [
    { type: 'role', role: 'button', options: { name: /run report/i }, name: 'role:Run Report' },
    { type: 'text', value: 'Run Report', name: 'text:Run Report' }
  ],
  exportXlsButton: [
    { type: 'role', role: 'button', options: { name: /export xls/i }, name: 'role:Export Xls' },
    { type: 'text', value: 'Export Xls', name: 'text:Export Xls' }
  ],
  resultsTable: [
    { type: 'css', value: '#tblSummaryData', name: 'css:#tblSummaryData' },
    { type: 'xpath', value: '//*[@id="tblSummaryData"]', name: 'xpath:#tblSummaryData' }
  ]
};

module.exports = {
  digiteyesreportingSummarysheetdataSelectors
};
