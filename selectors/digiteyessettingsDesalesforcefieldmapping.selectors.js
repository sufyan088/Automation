const digiteyessettingsDesalesforcefieldmappingSelectors = {
  settingsMenuButton: [
    { type: 'role', role: 'button', options: { name: /digiteyes\s*settings/i }, name: 'role:DigitEYES Settings' },
    { type: 'css', value: 'button[data-bs-target="#digiteyes-settings"]', name: 'css:settings-toggle' },
    { type: 'text', value: 'DigitEYES Settings', name: 'text:DigitEYES Settings' }
  ],
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /de salesforce field mapping/i }, name: 'role:DE Salesforce Field Mapping' },
    { type: 'css', value: 'a[href="de-salesforce-field-mapping.php"]', name: 'css:de-salesforce-field-mapping.php' },
    { type: 'text', value: 'DE Salesforce Field Mapping', name: 'text:DE Salesforce Field Mapping' }
  ],
  pageMarker: [
    { type: 'css', value: '#datatable', name: 'css:#datatable' },
    { type: 'text', value: 'DE Salesforce Field Mapping', name: 'text:DE Salesforce Field Mapping' }
  ],
  tableHeaders: [
    { type: 'css', value: '#datatable thead:nth-of-type(1) tr th', name: 'css:datatable headers' }
  ],
  paginationSummary: [
    { type: 'css', value: '#datatable thead:nth-of-type(2) tr th:first-child', name: 'css:datatable summary' },
    { type: 'text', value: 'Showing', name: 'text:Showing' }
  ],
  firstSortableHeader: [
    { type: 'css', value: '#datatable thead:nth-of-type(1) tr th:nth-child(2) span img', name: 'css:sortable column image' },
    { type: 'css', value: '#datatable thead:nth-of-type(1) tr th span img', name: 'css:any sort image' }
  ],
  refreshButton: [
    { type: 'role', role: 'button', options: { name: /refresh/i }, name: 'role:Refresh' },
    { type: 'text', value: 'Refresh', name: 'text:Refresh' },
    { type: 'css', value: 'header .btn.btn-info.btn-sm', name: 'css:header refresh button' }
  ]
};

module.exports = {
  digiteyessettingsDesalesforcefieldmappingSelectors
};
