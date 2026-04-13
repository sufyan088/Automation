const digiteyescampsParticipantsSelectors = {
  participantsLink: [
    { type: 'role', role: 'link', options: { name: /^participants$/i }, name: 'role:Participants link' },
    { type: 'css', value: 'a[href="manage-camps-patients.php"]', name: 'css:a[href=manage-camps-patients.php]' },
    { type: 'text', value: 'Participants', name: 'text:Participants' },
    { type: 'xpath', value: '//a[contains(@href,"manage-camps-patients.php")]', name: 'xpath:Participants link' }
  ],
  pageHeading: [
    { type: 'role', role: 'heading', options: { name: /participants/i }, name: 'role:Participants heading' },
    { type: 'text', value: 'Participants', name: 'text:Participants' },
    { type: 'css', value: 'header h3.m-0', name: 'css:header h3.m-0' },
    { type: 'xpath', value: '//header//h3[normalize-space()="Participants"]', name: 'xpath:Participants heading' }
  ],
  searchFilterButton: [
    { type: 'role', role: 'button', options: { name: /search\s*\/\s*filter/i }, name: 'role:Search / Filter' },
    { type: 'css', value: '#btnSearch', name: 'css:#btnSearch' },
    { type: 'xpath', value: '//button[@id="btnSearch"]', name: 'xpath:#btnSearch' }
  ],
  searchFilterHeading: [
    { type: 'role', role: 'heading', options: { name: /participant search\s*\/\s*filter/i }, name: 'role:Participant Search / Filter heading' },
    { type: 'text', value: 'Participant Search / Filter', name: 'text:Participant Search / Filter' },
    { type: 'css', value: '#myModalLabel', name: 'css:#myModalLabel' },
    { type: 'xpath', value: '//h4[@id="myModalLabel"]', name: 'xpath:#myModalLabel' }
  ],
  searchFilterModal: [
    { type: 'css', value: '#Modal_frmSearch', name: 'css:#Modal_frmSearch' },
    { type: 'css', value: '#frmSearch', name: 'css:#frmSearch' },
    { type: 'xpath', value: '//form[@id="frmSearch"]', name: 'xpath:#frmSearch' }
  ],
  searchCountryDropdown: [
    { type: 'css', value: 'select#search_countrycode', name: 'css:#search_countrycode' },
    { type: 'xpath', value: '//select[@id="search_countrycode"]', name: 'xpath:#search_countrycode' }
  ],
  closeButton: [
    { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'role:Close' },
    { type: 'text', value: 'Close', name: 'text:Close' },
    { type: 'xpath', value: '//form[@id="frmSearch"]//button[normalize-space()="Close"]', name: 'xpath:frmSearch Close' }
  ]
};

module.exports = {
  digiteyescampsParticipantsSelectors
};
