const imremitSelectors = {
  moduleCard: [
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][2]', name: 'xpath:imREmit module card 2' },
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][5]', name: 'xpath:imREmit module card 5' },
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][1]', name: 'xpath:imREmit module card 1' },
    { type: 'text', value: 'imREmit', name: 'text:imREmit' }
  ],
  heading: [
    { type: 'role', role: 'heading', options: { name: 'imREmit' }, name: 'role:heading imREmit' },
    { type: 'text', value: 'imREmit', name: 'text:imREmit heading' },
    { type: 'xpath', value: '//*[@id="root"]//h1[text()="imREmit"]', name: 'xpath:h1 imREmit' }
  ],
  fileProcessingNav: [
    { type: 'role', role: 'link', options: { name: 'File Processing' }, name: 'role:File Processing link' },
    { type: 'css', value: 'a[href="/app/imremit/file-processing"]', name: 'css:file-processing href' },
    { type: 'xpath', value: '//div[@id="root"]/article/main/article/section[1]/nav/a[3]', name: 'xpath:file-processing nav item' },
    { type: 'xpath', value: '//*[text()="File Processing"]', name: 'xpath:text file processing' },
    { type: 'css', value: 'nav[aria-label="imREmit Subroute Navigation"] a:nth-of-type(3)', name: 'css:subroute nav item 3' }
  ],
  selectAllCustomer: [
    { type: 'text', value: 'Select All', name: 'text:Select All' }
  ],
  customerSearch: [
    { type: 'placeholder', value: 'Search customers (min. 3 characters)...', name: 'placeholder:Search customers' },
    { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'css:search customers input' }
  ],
  verizonCustomer: [
    { type: 'text', value: 'Verizon Customer', name: 'text:Verizon Customer' },
    { type: 'xpath', value: '//*[text()="Verizon Customer"]', name: 'xpath:Verizon Customer' }
  ]
};

module.exports = { imremitSelectors };
