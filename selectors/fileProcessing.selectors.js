const fileProcessingSelectors = {
  searchById: [
    { type: 'placeholder', value: 'Search by ID...', name: 'placeholder:Search by ID' },
    { type: 'css', value: 'input[placeholder="Search by ID..."]', name: 'css:search by id' },
    { type: 'xpath', value: '//div[@id="root"]/article/main/article/section[2]/div[2]/div[1]/input[2]', name: 'xpath:search by id' }
  ],
  searchByFilename: [
    { type: 'placeholder', value: 'Search by filename...', name: 'placeholder:Search by filename' },
    { type: 'css', value: 'input[placeholder="Search by filename..."]', name: 'css:search by filename' },
    { type: 'xpath', value: '//div[@id="root"]/article/main/article/section[2]/div[2]/div[1]/input[3]', name: 'xpath:search by filename' }
  ],
  searchAllEntries: [
    { type: 'placeholder', value: 'Search all entries...', name: 'placeholder:Search all entries' },
    { type: 'css', value: 'input[placeholder="Search all entries..."]', name: 'css:search all entries' }
  ],
  nextPage: [
    { type: 'text', value: 'Go to next page', name: 'text:Go to next page' },
    { type: 'role', role: 'button', options: { name: /go to next page/i }, name: 'role:Go to next page' },
    { type: 'xpath', value: '//*[@aria-label="Go to next page"]', name: 'xpath:next page aria label' }
  ],
  previousPage: [
    { type: 'text', value: 'Go to previous page', name: 'text:Go to previous page' },
    { type: 'role', role: 'button', options: { name: /go to previous page/i }, name: 'role:Go to previous page' },
    { type: 'xpath', value: '//*[@aria-label="Go to previous page"]', name: 'xpath:previous page aria label' }
  ],
  firstPage: [
    { type: 'text', value: 'Go to first page', name: 'text:Go to first page' },
    { type: 'role', role: 'button', options: { name: /go to first page/i }, name: 'role:Go to first page' },
    { type: 'xpath', value: '//*[@aria-label="Go to first page"]', name: 'xpath:first page aria label' }
  ],
  lastPage: [
    { type: 'text', value: 'Go to last page', name: 'text:Go to last page' },
    { type: 'role', role: 'button', options: { name: /go to last page/i }, name: 'role:Go to last page' },
    { type: 'xpath', value: '//*[@aria-label="Go to last page"]', name: 'xpath:last page aria label' }
  ],
  pageSizeDropdown: [
    { type: 'role', role: 'button', options: { name: /go to page|page/i }, name: 'role:Page size or page button' },
    { type: 'xpath', value: '//div[@id="root"]/article/main/article/section[2]/section/div[1]/div[1]/button[4]', name: 'xpath:page size button' },
    { type: 'css', value: 'section button svg.lucide-chevrons-up-down', name: 'css:chevrons up down svg' }
  ],
  pageSize5: [
    { type: 'text', value: '5', name: 'text:5' },
    { type: 'xpath', value: '//*[text()="5"]', name: 'xpath:5' }
  ],
  pageSize10: [
    { type: 'text', value: '10', name: 'text:10' },
    { type: 'xpath', value: '//*[text()="10"]', name: 'xpath:10' }
  ],
  pageSize25: [
    { type: 'text', value: '25', name: 'text:25' },
    { type: 'xpath', value: '//*[text()="25"]', name: 'xpath:25' }
  ],
  pageSize50: [
    { type: 'text', value: '50', name: 'text:50' },
    { type: 'xpath', value: '//*[text()="50"]', name: 'xpath:50' }
  ],
  pageSize100: [
    { type: 'text', value: '100', name: 'text:100' },
    { type: 'xpath', value: '//*[text()="100"]', name: 'xpath:100' }
  ],
  columnViews: [
    { type: 'role', role: 'button', options: { name: /column views|column order/i }, name: 'role:Column Views' },
    { type: 'text', value: 'Column Views', name: 'text:Column Views' },
    { type: 'text', value: 'Column Order', name: 'text:Column Order' }
  ],
  packageIdHeader: [
    { type: 'text', value: 'Package ID', name: 'text:Package ID' },
    { type: 'role', role: 'button', options: { name: /package id/i }, name: 'role:Package ID button' },
    { type: 'xpath', value: '//button/div/span[text()="Package ID"]', name: 'xpath:Package ID header' }
  ],
  packageIdText: [
    { type: 'text', value: 'Package ID', name: 'text:Package ID' }
  ],
  orgIdText: [
    { type: 'text', value: 'Org Id', name: 'text:Org Id' },
    { type: 'text', value: 'Org ID', name: 'text:Org ID' }
  ],
  nameText: [
    { type: 'text', value: 'Name', name: 'text:Name' }
  ],
  ascending: [
    { type: 'text', value: 'Ascending', name: 'text:Ascending' },
    { type: 'text', value: 'Asc', name: 'text:Asc' }
  ],
  descending: [
    { type: 'text', value: 'Descending', name: 'text:Descending' },
    { type: 'text', value: 'Desc', name: 'text:Desc' }
  ],
  hideColumn: [
    { type: 'text', value: 'Hide column', name: 'text:Hide column' },
    { type: 'text', value: 'Hide', name: 'text:Hide' }
  ],
  returnToTop: [
    { type: 'text', value: 'Return to top', name: 'text:Return to top' },
    { type: 'role', role: 'button', options: { name: /return to top/i }, name: 'role:Return to top' }
  ]
};

module.exports = { fileProcessingSelectors };
