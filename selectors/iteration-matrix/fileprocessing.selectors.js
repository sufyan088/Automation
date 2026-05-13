const fileprocessingSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /imremit/i }, name: 'imremit-button' },
      { type: 'text', value: /imremit/i, name: 'imremit-text' }
    ],
    fileProcessing: [
      { type: 'role', role: 'link', options: { name: 'File Processing', exact: true }, name: 'file-processing-link' },
      { type: 'role', role: 'button', options: { name: 'File Processing', exact: true }, name: 'file-processing-button' },
      { type: 'css', value: 'a[href*="/file-processing"]', name: 'file-processing-href' }
    ]
  },
  headings: {
    imremit: [
      { type: 'role', role: 'heading', options: { name: /imremit/i }, name: 'imremit-heading' }
    ],
    fileProcessing: [
      { type: 'role', role: 'heading', options: { name: /file processing/i }, name: 'file-processing-heading' },
      { type: 'role', role: 'link', options: { name: 'File Processing', exact: true }, name: 'file-processing-active-link' }
    ]
  },
  customerContext: {
    selectAll: [
      { type: 'text', value: 'Select All', options: { exact: true }, name: 'select-all-text' },
      { type: 'role', role: 'button', options: { name: /select all/i }, name: 'select-all-button' }
    ]
  },
  searchFields: {
    byId: [
      { type: 'placeholder', value: /search by id/i, name: 'search-by-id' }
    ],
    byFilename: [
      { type: 'placeholder', value: /search by filename/i, name: 'search-by-filename' }
    ],
    allEntries: [
      { type: 'placeholder', value: /search all entries/i, name: 'search-all-entries' }
    ]
  },
  table: {
    rows: [
      { type: 'css', value: 'table tbody tr', name: 'table-row' }
    ],
    packageIdHeader: [
      { type: 'role', role: 'columnheader', options: { name: /package id/i }, name: 'package-id-columnheader' },
      { type: 'text', value: /^Package ID$/i, name: 'package-id-text' }
    ]
  },
  pagination: {
    next: [
      { type: 'role', role: 'button', options: { name: /go to next page|next page/i }, name: 'next-page-button' },
      { type: 'css', value: 'button[aria-label*="next page" i],button[title*="next page" i]', name: 'next-page-css' }
    ],
    previous: [
      { type: 'role', role: 'button', options: { name: /go to previous page|previous page/i }, name: 'previous-page-button' },
      { type: 'css', value: 'button[aria-label*="previous page" i],button[title*="previous page" i]', name: 'previous-page-css' }
    ],
    first: [
      { type: 'role', role: 'button', options: { name: /go to first page|first page/i }, name: 'first-page-button' },
      { type: 'css', value: 'button[aria-label*="first page" i],button[title*="first page" i]', name: 'first-page-css' }
    ],
    last: [
      { type: 'role', role: 'button', options: { name: /go to last page|last page/i }, name: 'last-page-button' },
      { type: 'css', value: 'button[aria-label*="last page" i],button[title*="last page" i]', name: 'last-page-css' }
    ],
    sizeTrigger: [
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"],button[aria-haspopup="listbox"],button[aria-expanded]').filter({ hasText: /^(5|10|25|50|100)$/ }).first(),
        name: 'page-size-trigger'
      },
      { type: 'role', role: 'combobox', options: {}, name: 'page-size-combobox' }
    ],
    sizeOption(value) {
      return [
        { type: 'role', role: 'option', options: { name: new RegExp(`^${value}$`) }, name: `page-size-option-${value}` },
        { type: 'role', role: 'button', options: { name: new RegExp(`^${value}$`) }, name: `page-size-button-${value}` },
        { type: 'text', value: new RegExp(`^${value}$`), name: `page-size-text-${value}` }
      ];
    }
  },
  columnOrder: {
    trigger: [
      { type: 'role', role: 'button', options: { name: 'Column Order', exact: true }, name: 'column-order-button' },
      { type: 'css', value: 'button[aria-label="Column settings"]', name: 'column-settings-button' },
      { type: 'text', value: /^Column Order$/i, name: 'column-order-text' }
    ],
    toggle(label) {
      return [
        { type: 'css', value: `button[aria-label^="Hide ${label}" i],button[aria-label^="Show ${label}" i]`, name: `${label}-toggle-button` },
        {
          type: 'custom',
          factory: (page) => page.locator('[role="dialog"],[data-radix-popper-content-wrapper]').getByText(new RegExp(`^${label}$`, 'i')).first(),
          name: `${label}-toggle-text`
        }
      ];
    }
  },
  headerActions: {
    asc: [
      { type: 'role', role: 'menuitem', options: { name: /^Ascending$/i }, name: 'sort-ascending-menuitem' },
      { type: 'role', role: 'button', options: { name: /^Ascending$/i }, name: 'sort-ascending-button' },
      { type: 'text', value: /^Ascending$/i, name: 'sort-ascending-text' }
    ],
    desc: [
      { type: 'role', role: 'menuitem', options: { name: /^Descending$/i }, name: 'sort-descending-menuitem' },
      { type: 'role', role: 'button', options: { name: /^Descending$/i }, name: 'sort-descending-button' },
      { type: 'text', value: /^Descending$/i, name: 'sort-descending-text' }
    ],
    hide: [
      { type: 'role', role: 'menuitem', options: { name: /^Hide column$/i }, name: 'hide-column-menuitem' },
      { type: 'role', role: 'button', options: { name: /^Hide column$/i }, name: 'hide-column-button' },
      { type: 'text', value: /^Hide column$/i, name: 'hide-column-text' }
    ]
  },
  utilities: {
    returnToTop: [
      { type: 'role', role: 'button', options: { name: /return to top|run to top/i }, name: 'return-to-top-button' },
      { type: 'text', value: /return to top/i, name: 'return-to-top-text' }
    ]
  }
};

module.exports = {
  fileprocessingSelectors
};
