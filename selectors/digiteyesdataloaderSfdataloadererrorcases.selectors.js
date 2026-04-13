const digiteyesdataloaderSfdataloadererrorcasesSelectors = {
  moduleLabel: 'SF Data Loader Error Cases',
  pageLabel: 'Salesforce Data Loader - Error Case heading',
  tableLabel: 'Salesforce Data Loader - Error Case listing table',
  dataLoaderMenu: [
    { type: 'role', role: 'link', options: { name: /digiteyes data loader/i }, name: 'role:DigitEYES Data Loader link' },
    { type: 'role', role: 'button', options: { name: /digiteyes data loader/i }, name: 'role:DigitEYES Data Loader button' },
    { type: 'text', value: 'DigitEYES Data Loader', name: 'text:DigitEYES Data Loader' }
  ],
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /sf data loader error case|salesforce data loader error case|error cases/i }, name: 'role:Error Cases link' },
    { type: 'text', value: 'SF Data Loader Error Case', name: 'text:SF Data Loader Error Case' },
    { type: 'text', value: 'Salesforce Data Loader - Error Case', name: 'text:Salesforce Data Loader - Error Case' },
    { type: 'xpath', value: '//a[contains(normalize-space(),"Error") and contains(normalize-space(),"Loader")]', name: 'xpath:Error Cases link' }
  ],
  pageHeading: [
    { type: 'role', role: 'heading', options: { name: /salesforce data loader\s*-\s*error case|sf data loader error case|error cases/i }, name: 'role:Error Cases heading' },
    { type: 'text', value: 'Salesforce Data Loader - Error Case', name: 'text:Salesforce Data Loader - Error Case' },
    { type: 'text', value: 'SF Data Loader Error Case', name: 'text:SF Data Loader Error Case' },
    { type: 'xpath', value: '//h3[contains(normalize-space(),"Error") and contains(normalize-space(),"Loader")]', name: 'xpath:Error Cases heading' }
  ],
  listingTable: [
    { type: 'css', value: '#datatable', name: 'css:#datatable' },
    { type: 'xpath', value: '//table[@id="datatable"]', name: 'xpath:#datatable' }
  ],
  searchFilterButton: [
    { type: 'role', role: 'button', options: { name: /search\s*\/\s*filter/i }, name: 'role:Search / Filter' },
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'text', value: 'Search / Filter', name: 'text:Search / Filter' }
  ],
  refreshButton: [
    { type: 'role', role: 'button', options: { name: /^refresh$/i }, name: 'role:Refresh' },
    { type: 'text', value: 'Refresh', name: 'text:Refresh' }
  ],
  searchFilterModal: [
    { type: 'css', value: '#Modal_frmSearch', name: 'css:#Modal_frmSearch' },
    { type: 'css', value: '#frmSearch', name: 'css:#frmSearch' }
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
    { type: 'role', role: 'button', options: { name: /^apply$/i }, name: 'role:Apply' },
    { type: 'text', value: 'Apply', name: 'text:Apply' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Apply"]', name: 'xpath:Apply' }
  ],
  searchResetButton: [
    { type: 'role', role: 'button', options: { name: /^reset$/i }, name: 'role:Reset' },
    { type: 'text', value: 'Reset', name: 'text:Reset' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Reset"]', name: 'xpath:Reset' }
  ],
  searchCloseButton: [
    { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'role:Close' },
    { type: 'text', value: 'Close', name: 'text:Close' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Close"]', name: 'xpath:Close' }
  ],
  pageSizeDropdown: [
    { type: 'css', value: '.dataTables_length select', name: 'css:.dataTables_length select' },
    { type: 'css', value: 'select[name="datatable_length"]', name: 'css:select[name=datatable_length]' }
  ],
  retryUploadButton: [
    { type: 'css', value: '.fa-upload.cursor-pointer', name: 'css:.fa-upload.cursor-pointer' },
    { type: 'css', value: '.fa-upload', name: 'css:.fa-upload' }
  ],
  editIconButton: [
    { type: 'css', value: '.fa-edit.cursor-pointer', name: 'css:.fa-edit.cursor-pointer' },
    { type: 'css', value: '.fa-edit', name: 'css:.fa-edit' }
  ],
  editModalHeading: [
    { type: 'css', value: '#divEditDataForSalesforce .modal-title', name: 'css:edit modal title' },
    { type: 'xpath', value: '//div[@id="divEditDataForSalesforce"]//h4[contains(@class,"modal-title")]', name: 'xpath:edit modal title' }
  ],
  assignmentDeoCheckbox: [
    { type: 'css', value: 'input[name="search_assignment[]"][value="1"]', name: 'css:assignment DEO' }
  ],
  assignmentSuperDeoCheckbox: [
    { type: 'css', value: 'input[name="search_assignment[]"][value="2"]', name: 'css:assignment Super DEO' }
  ],
  paginationLink: [
    {
      type: 'custom',
      name: 'custom:pagination by page number',
      factory: (page, pageNumber) => page.locator(`#pg_${pageNumber}`)
    }
  ],
  searchTokenHeaders: ['Location', 'Participant Name']
};

module.exports = {
  digiteyesdataloaderSfdataloadererrorcasesSelectors
};
