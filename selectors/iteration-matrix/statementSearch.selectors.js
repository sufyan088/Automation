const statementSearchSelectors = {
  moduleCard: [
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][6]', name: 'xpath:Statement Recon module card' },
    { type: 'text', value: 'Statement Recon', name: 'text:Statement Recon module card' }
  ],
  heading: [
    { type: 'role', role: 'heading', options: { name: /statement recon/i }, name: 'role:Statement Recon heading' },
    { type: 'text', value: 'Statement Recon', name: 'text:Statement Recon heading' },
    { type: 'xpath', value: '//*[@id="root"]//h1[text()="Statement Recon"]', name: 'xpath:Statement Recon heading' }
  ],
  customerCombobox: [
    { type: 'custom', factory: (page) => page.locator('button[role="combobox"]').filter({ hasText: /select customer/i }).first(), name: 'custom:customer combobox button' },
    { type: 'custom', factory: (page) => page.getByRole('combobox').filter({ hasText: /select customer/i }).first(), name: 'custom:customer combobox' },
    { type: 'text', value: 'Select customer...', name: 'text:Select customer' }
  ],
  customerSearchInput: [
    { type: 'placeholder', value: 'Search customers (min. 3 characters)...', name: 'placeholder:Search customers' },
    { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'css:search customers input' }
  ],
  searchTab: [
    { type: 'custom', factory: (page) => page.locator('nav[aria-label="StatementRecon Subroute Navigation"] a').filter({ hasText: /^Search$/i }).first(), name: 'custom:StatementRecon Search tab' },
    { type: 'role', role: 'link', options: { name: /^(statement search|search)$/i }, name: 'role:Search tab' },
    { type: 'css', value: 'a[href="/app/statement-recon/file-history"]', name: 'css:file-history href' },
    { type: 'text', value: 'Search', name: 'text:Search tab' },
    { type: 'text', value: 'Statement Search', name: 'text:Statement Search tab' }
  ],
  searchAllEntries: [
    { type: 'placeholder', value: 'Search all entries...', name: 'placeholder:Search all entries' },
    { type: 'css', value: 'input[placeholder="Search all entries..."]', name: 'css:Search all entries input' }
  ],
  paginationSizeTrigger: [
    { type: 'custom', factory: (page) => page.locator('button[role="combobox"]').filter({ hasText: /^(5|10|25|50|100)$/ }).first(), name: 'custom:pagination size combobox' },
    { type: 'custom', factory: (page) => page.locator('button[role="combobox"][class*="w-[80px]"]').first(), name: 'custom:pagination size width combobox' }
  ],
  columnOrderButton: [
    { type: 'role', role: 'button', options: { name: /column order|column views/i }, name: 'role:Column Order button' },
    { type: 'css', value: 'button[aria-label="Column settings"]', name: 'css:Column settings button' },
    { type: 'text', value: 'Column Order', name: 'text:Column Order button' }
  ],
  goToLastPage: [
    { type: 'role', role: 'button', options: { name: /go to last page/i }, name: 'role:Go to last page' },
    { type: 'text', value: 'Go to last page', name: 'text:Go to last page' }
  ],
  goToFirstPage: [
    { type: 'role', role: 'button', options: { name: /go to first page/i }, name: 'role:Go to first page' },
    { type: 'text', value: 'Go to first page', name: 'text:Go to first page' }
  ],
  goToPreviousPage: [
    { type: 'role', role: 'button', options: { name: /go to previous page/i }, name: 'role:Go to previous page' },
    { type: 'text', value: 'Go to previous page', name: 'text:Go to previous page' }
  ],
  goToNextPage: [
    { type: 'role', role: 'button', options: { name: /go to next page/i }, name: 'role:Go to next page' },
    { type: 'text', value: 'Go to next page', name: 'text:Go to next page' }
  ],
  returnToTop: [
    { type: 'role', role: 'button', options: { name: /return to top/i }, name: 'role:Return to top' },
    { type: 'text', value: 'Return to top', name: 'text:Return to top' }
  ],
  viewMappingDetails: [
    { type: 'role', role: 'menuitem', options: { name: /view mapping details/i }, name: 'role:View Mapping Details' },
    { type: 'text', value: 'View Mapping Details', name: 'text:View Mapping Details' }
  ],
  viewStatementDetails: [
    { type: 'role', role: 'menuitem', options: { name: /view statement details/i }, name: 'role:View Statement Details' },
    { type: 'text', value: 'View Statement Details', name: 'text:View Statement Details' }
  ]
};

module.exports = {
  statementSearchSelectors
};
