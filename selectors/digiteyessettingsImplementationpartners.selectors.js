const digiteyessettingsImplementationpartnersSelectors = {
  settingsMenuButton: [
    { type: 'role', role: 'button', options: { name: /digiteyes\s*settings/i }, name: 'role:DigitEYES Settings' },
    { type: 'css', value: 'button[data-bs-target="#digiteyes-settings"]', name: 'css:settings-toggle' },
    { type: 'text', value: 'DigitEYES Settings', name: 'text:DigitEYES Settings' }
  ],
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /implementation partners/i }, name: 'role:Implementation Partners' },
    { type: 'css', value: 'a[href="implementationpartners.php"]', name: 'css:implementationpartners.php' },
    { type: 'text', value: 'Implementation Partners', name: 'text:Implementation Partners' }
  ],
  pageMarker: [
    { type: 'css', value: '#datatable', name: 'css:#datatable' },
    { type: 'text', value: 'Implementation Partners', name: 'text:Implementation Partners' }
  ],
  searchFilterButton: [
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'role', role: 'button', options: { name: /search\s*\/\s*filter/i }, name: 'role:Search / Filter' }
  ],
  searchForm: [
    { type: 'css', value: '#frmSearch', name: 'css:#frmSearch' }
  ],
  searchCountryField: [
    { type: 'css', value: '#search_countrycode', name: 'css:#search_countrycode' },
    { type: 'css', value: 'select[name="search_countrycode"]', name: 'css:select[name=search_countrycode]' }
  ],
  searchPartnerNameField: [
    { type: 'css', value: '#search_ipname', name: 'css:#search_ipname' },
    { type: 'css', value: 'input[name="search_ipname"]', name: 'css:input[name=search_ipname]' }
  ],
  searchStatusField: [
    { type: 'css', value: '#search_status', name: 'css:#search_status' },
    { type: 'css', value: 'select[name="search_status"]', name: 'css:select[name=search_status]' }
  ],
  applyButton: [
    { type: 'css', value: '#frmSearch .modal-footer .btn.btn-sm.btn-primary', name: 'css:search apply button' },
    { type: 'role', role: 'button', options: { name: /^apply$/i }, name: 'role:Apply' }
  ],
  closeButton: [
    { type: 'css', value: '#frmSearch .modal-footer .btn.btn-sm.btn-secondary', name: 'css:search close button' },
    { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'role:Close' }
  ],
  partnerNameField: [
    { type: 'css', value: '#DE_CS_ipname', name: 'css:#DE_CS_ipname' }
  ],
  salesforceCodeField: [
    { type: 'css', value: '#DE_CS_sfcode', name: 'css:#DE_CS_sfcode' }
  ],
  countryField: [
    { type: 'css', value: '#DE_CS_country', name: 'css:#DE_CS_country' },
    { type: 'css', value: 'select[name="DE_CS_country"]', name: 'css:select[name=DE_CS_country]' }
  ],
  activeField: [
    { type: 'css', value: '#DE_CS_status', name: 'css:#DE_CS_status' },
    { type: 'css', value: 'select[name="DE_CS_status"]', name: 'css:select[name=DE_CS_status]' }
  ],
  addButton: [
    { type: 'css', value: '#btnAdd', name: 'css:#btnAdd' },
    { type: 'role', role: 'button', options: { name: /add implementation partner|add/i }, name: 'role:Add Implementation Partner' }
  ],
  resultRow: [
    { type: 'css', value: '#datatable tbody tr.cursor-pointer td:nth-child(2)', name: 'css:first result country cell' },
    { type: 'css', value: '#datatable tbody tr.cursor-pointer td:nth-child(3)', name: 'css:first result partner cell' },
    { type: 'css', value: '#datatable tbody tr:first-child td:nth-child(2)', name: 'css:first row second cell' }
  ],
  saveButton: [
    { type: 'css', value: 'button[name="btnsubmit"]', name: 'css:button[name=btnsubmit]' },
    { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'role:Save' }
  ],
  cancelButton: [
    { type: 'css', value: '#DE_Camp_Form .btn.btn-sm.btn-secondary', name: 'css:form cancel button' },
    { type: 'role', role: 'button', options: { name: /^cancel$/i }, name: 'role:Cancel' }
  ],
  pageSizeSelect: [
    { type: 'css', value: '#cmbpagesize', name: 'css:#cmbpagesize' },
    { type: 'css', value: 'select[name="cmbpagesize"]', name: 'css:select[name=cmbpagesize]' }
  ],
  paginationSummary: [
    { type: 'css', value: '#datatable thead:nth-of-type(2) tr th:first-child', name: 'css:datatable pagination summary' },
    { type: 'text', value: 'Showing:', name: 'text:Showing:' }
  ],
  pagination: {
    first: [
      { type: 'css', value: '#pp_1', name: 'css:#pp_1' },
      { type: 'css', value: 'a[id^="pp_"]', name: 'css:a[id^=pp_]' }
    ],
    previous: [
      { type: 'css', value: '#pp_2', name: 'css:#pp_2' },
      { type: 'css', value: 'a[id^="pp_"]', name: 'css:a[id^=pp_]' }
    ],
    next: [
      { type: 'css', value: '#pn_2', name: 'css:#pn_2' },
      { type: 'css', value: 'a[id^="pn_"]', name: 'css:a[id^=pn_]' }
    ],
    last: [
      { type: 'css', value: '#pg_3', name: 'css:#pg_3' },
      { type: 'css', value: 'a[id^="pg_"]', name: 'css:a[id^=pg_]' }
    ]
  }
};

module.exports = {
  digiteyessettingsImplementationpartnersSelectors
};
