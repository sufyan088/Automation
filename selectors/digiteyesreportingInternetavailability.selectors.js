const digiteyesreportingInternetavailabilitySelectors = {
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /internet availability/i }, name: 'role:Internet Availability' },
    { type: 'css', value: 'a[href="report-internet.php"]', name: 'css:report-internet.php' },
    { type: 'text', value: 'Internet Availability', name: 'text:Internet Availability' }
  ],
  pageMarker: [
    { type: 'css', value: '#search_datefrom', name: 'css:#search_datefrom' },
    { type: 'css', value: '#search_dateto', name: 'css:#search_dateto' },
    { type: 'role', role: 'button', options: { name: /run report/i }, name: 'role:Run Report' }
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
  ],
  sourceDataPanel: [
    { type: 'css', value: '#Source_data', name: 'css:#Source_data' }
  ]
};

module.exports = {
  digiteyesreportingInternetavailabilitySelectors
};
