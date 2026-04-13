const digiteyesreportingWorkreportipteamsSelectors = {
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /work report - ip teams/i }, name: 'role:Work Report - IP Teams' },
    { type: 'css', value: 'a[href="workreport-ip.php"]', name: 'css:workreport-ip.php' },
    { type: 'text', value: 'Work Report - IP Teams', name: 'text:Work Report - IP Teams' }
  ],
  pageMarker: [
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'text', value: 'Search / Filter', name: 'text:Search / Filter' },
    { type: 'css', value: '#datatable', name: 'css:#datatable' }
  ],
  searchFilterButton: [
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'role', role: 'button', options: { name: /search\s*\/\s*filter/i }, name: 'role:Search / Filter' }
  ],
  searchForm: [
    { type: 'css', value: '#frmSearch', name: 'css:#frmSearch' }
  ],
  countryField: [
    { type: 'css', value: '#frmSearch:visible #search_countrycode', name: 'css:#frmSearch:visible #search_countrycode' },
    { type: 'css', value: '#search_countrycode', name: 'css:#search_countrycode' },
    { type: 'css', value: 'select[name="search_countrycode"]', name: 'css:select[name=search_countrycode]' }
  ],
  projectCodeField: [
    { type: 'css', value: '#frmSearch:visible #search_projectcode', name: 'css:#frmSearch:visible #search_projectcode' },
    { type: 'css', value: '#search_projectcode', name: 'css:#search_projectcode' },
    { type: 'css', value: 'input[name="search_projectcode"]', name: 'css:input[name=search_projectcode]' }
  ],
  userNameField: [
    { type: 'css', value: '#frmSearch:visible #search_username', name: 'css:#frmSearch:visible #search_username' },
    { type: 'css', value: '#search_username', name: 'css:#search_username' }
  ],
  ipPartnerField: [
    { type: 'css', value: '#frmSearch:visible #search_ip', name: 'css:#frmSearch:visible #search_ip' },
    { type: 'css', value: '#search_ip', name: 'css:#search_ip' },
    { type: 'css', value: 'select[name="search_ip"]', name: 'css:select[name=search_ip]' }
  ],
  ipTeamField: [
    { type: 'css', value: '#frmSearch:visible #search_ipteam', name: 'css:#frmSearch:visible #search_ipteam' },
    { type: 'css', value: '#search_ipteam', name: 'css:#search_ipteam' },
    { type: 'css', value: 'select[name="search_ipteam"]', name: 'css:select[name=search_ipteam]' }
  ],
  dateFromField: [
    { type: 'css', value: '#frmSearch:visible #search_datefrom', name: 'css:#frmSearch:visible #search_datefrom' },
    { type: 'css', value: '#search_datefrom', name: 'css:#search_datefrom' }
  ],
  dateToField: [
    { type: 'css', value: '#frmSearch:visible #search_dateto', name: 'css:#frmSearch:visible #search_dateto' },
    { type: 'css', value: '#search_dateto', name: 'css:#search_dateto' }
  ],
  applyButton: [
    { type: 'css', value: '#frmSearch .modal-footer .btn.btn-sm.btn-primary', name: 'css:Apply button' },
    { type: 'role', role: 'button', options: { name: /^apply$/i }, name: 'role:Apply' }
  ],
  resetButton: [
    { type: 'css', value: '#frmSearch .modal-footer .btn.btn-sm.btn-secondary', name: 'css:Reset button' },
    { type: 'role', role: 'button', options: { name: /^reset$/i }, name: 'role:Reset' }
  ],
  closeButton: [
    { type: 'css', value: '#frmSearch .modal-footer button:has-text("Close"):visible', name: 'css:Close button' },
    { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'role:Close' }
  ],
  noRecordsText: [
    { type: 'text', value: '(0) Records Found.', name: 'text:(0) Records Found.' }
  ],
  tableHeaderCells: '#datatable thead th'
};

module.exports = {
  digiteyesreportingWorkreportipteamsSelectors
};
