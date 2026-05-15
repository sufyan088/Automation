const srSearchNewModuleSelectors = {
  moduleCard: [
    { type: 'role', role: 'link', options: { name: /statement recon/i }, name: 'role:Statement Recon link' },
    { type: 'css', value: 'a[href^="/app/statement-recon/"]', name: 'css:Statement Recon sidebar href' },
    { type: 'css', value: 'a[aria-label="Statement Recon"]', name: 'css:Statement Recon link' },
    { type: 'css', value: 'img[alt="Statement Recon Icon"]', name: 'css:Statement Recon icon' },
    { type: 'text', value: 'Statement Recon', name: 'text:Statement Recon' }
  ],
  customerCombobox: [
    { type: 'custom', factory: (page) => page.locator('button[role="combobox"]').filter({ hasText: /select customer/i }).first(), name: 'custom:customer combobox' },
    { type: 'custom', factory: (page) => page.getByRole('combobox').filter({ hasText: /select customer/i }).first(), name: 'custom:customer combobox role' },
    { type: 'custom', factory: (page) => page.locator('button[role="combobox"]').last(), name: 'custom:last combobox button' },
    { type: 'custom', factory: (page) => page.getByRole('combobox').last(), name: 'custom:last combobox role' },
    { type: 'text', value: /select customer/i, name: 'text:Select customer' }
  ],
  customerSearchInput: [
    { type: 'placeholder', value: 'Search customers (min. 3 characters)...', name: 'placeholder:Search customers' },
    { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'css:Search customers input' }
  ],
  searchTab: [
    { type: 'custom', factory: (page) => page.locator('nav[aria-label="StatementRecon Subroute Navigation"] a').filter({ hasText: /^Search$/i }).first(), name: 'custom:Statement Recon Search tab' },
    { type: 'role', role: 'link', options: { name: /^(statement search|search)$/i }, name: 'role:Search link' },
    { type: 'role', role: 'tab', options: { name: /^search$/i }, name: 'role:Search tab' },
    { type: 'css', value: 'a[href="/app/statement-recon/file-history"]', name: 'css:Search href' },
    { type: 'text', value: /^search$/i, name: 'text:Search' }
  ],
  settingsTab: [
    { type: 'custom', factory: (page) => page.locator('nav[aria-label="StatementRecon Subroute Navigation"] a').filter({ hasText: /^Settings$/i }).first(), name: 'custom:Statement Recon Settings tab' },
    { type: 'role', role: 'link', options: { name: /^settings$/i }, name: 'role:Settings link' },
    { type: 'css', value: 'nav[aria-label="StatementRecon Subroute Navigation"] a[href="/app/statement-recon/settings"]', name: 'css:Statement Recon Settings href' },
    { type: 'text', value: /^settings$/i, name: 'text:Settings' }
  ],
  searchAllEntries: [
    { type: 'placeholder', value: 'Search all entries...', name: 'placeholder:Search all entries' },
    { type: 'css', value: 'input[placeholder="Search all entries..."]', name: 'css:Search all entries input' }
  ],
  matchedTab: [
    { type: 'role', role: 'tab', options: { name: /^matched$/i }, name: 'role:Matched tab' },
    { type: 'role', role: 'button', options: { name: /^matched$/i }, name: 'role:Matched button' },
    { type: 'text', value: /^matched$/i, name: 'text:Matched' }
  ],
  matchedStatusBadge: [
    { type: 'custom', factory: (page) => page.locator('table tbody tr').first().locator('td').nth(1).locator('span').filter({ hasText: /^matched$/i }).first(), name: 'custom:first row matched badge' },
    { type: 'custom', factory: (page) => page.locator('table tbody tr td span').filter({ hasText: /^matched$/i }).first(), name: 'custom:any matched badge' },
    { type: 'text', value: /^matched$/i, name: 'text:matched badge' }
  ],
  updateCannedMessagesButton: [
    { type: 'role', role: 'button', options: { name: /update canned messages/i }, name: 'role:Update Canned Messages' },
    { type: 'text', value: /update canned messages/i, name: 'text:Update Canned Messages' }
  ],
  configurationHeading: [
    { type: 'role', role: 'heading', options: { name: /match types\s*&\s*canned messages/i }, name: 'role:Match Types & Canned Messages' },
    { type: 'text', value: /match types\s*&\s*canned messages/i, name: 'text:Match Types & Canned Messages' }
  ],
  rematchDateButton: [
    { type: 'custom', factory: (page) => page.locator('button').filter({ hasText: /^Rematch Date/i }).first(), name: 'custom:Rematch Date filter button' },
    { type: 'css', value: 'button:has-text("Rematch Date")', name: 'css:Rematch Date filter button' },
    { type: 'role', role: 'button', options: { name: /sort by rematch date/i }, name: 'role:Sort by Rematch Date button' },
    { type: 'role', role: 'columnheader', options: { name: /sort by rematch date/i }, name: 'role:Sort by Rematch Date header' },
    { type: 'role', role: 'button', options: { name: /rematch date/i }, name: 'role:Rematch Date button' },
    { type: 'text', value: /rematch date/i, name: 'text:Rematch Date' }
  ],
  tooltip: [
    { type: 'css', value: 'td div.z-50.rounded-md.border.bg-root p.whitespace-pre-line.break-words.text-sm', name: 'css:inline tooltip text paragraph' },
    { type: 'css', value: 'td div.z-50.rounded-md.border.bg-root', name: 'css:inline tooltip container' },
    { type: 'css', value: '[role="tooltip"]', name: 'css:tooltip' },
    { type: 'css', value: 'div[role="dialog"]', name: 'css:dialog tooltip' },
    { type: 'css', value: 'div.z-50.rounded-md.border.bg-root', name: 'css:tooltip container' }
  ]
};

module.exports = {
  srSearchNewModuleSelectors
};
