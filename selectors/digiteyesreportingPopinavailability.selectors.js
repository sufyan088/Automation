const digiteyesreportingPopinavailabilitySelectors = {
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /popins availability/i }, name: 'role:Popins Availability' },
    { type: 'css', value: 'a[href="report-popins.php"]', name: 'css:report-popins.php' },
    { type: 'text', value: 'Popins Availability', name: 'text:Popins Availability' }
  ],
  pageMarker: [
    { type: 'text', value: 'Report: Popins Availability', name: 'text:Report: Popins Availability' },
    { type: 'css', value: '#search_datefrom', name: 'css:#search_datefrom' },
    { type: 'css', value: '#search_dateto', name: 'css:#search_dateto' },
    { type: 'role', role: 'button', options: { name: /run report/i }, name: 'role:Run Report' }
  ],
  countryField: [
    { type: 'css', value: '#search_countrycode', name: 'css:#search_countrycode' },
    { type: 'css', value: 'select[name="search_countrycode"]', name: 'css:select[name=search_countrycode]' }
  ],
  themeField: [
    { type: 'css', value: '#search_theme', name: 'css:#search_theme' },
    { type: 'css', value: 'select[name="search_theme"]', name: 'css:select[name=search_theme]' }
  ],
  dateFromField: [
    { type: 'css', value: '#search_datefrom', name: 'css:#search_datefrom' }
  ],
  dateToField: [
    { type: 'css', value: '#search_dateto', name: 'css:#search_dateto' }
  ],
  runReportButton: [
    { type: 'role', role: 'button', options: { name: /run report/i }, name: 'role:Run Report' },
    { type: 'text', value: 'Run Report', name: 'text:Run Report' }
  ]
};

module.exports = {
  digiteyesreportingPopinavailabilitySelectors
};
