const adminSelectors = {
  moduleCard: [
    { type: 'text', value: 'Admin', name: 'text:Admin' },
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][8]', name: 'xpath:admin module card 8' },
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][6]', name: 'xpath:admin module card 6' },
    { type: 'xpath', value: '//*[contains(@class,"w-full h-full flex flex-col justify-center items-center")][7]', name: 'xpath:admin module card 7' }
  ],
  customerManagementNav: [
    { type: 'role', role: 'link', options: { name: 'Customer Management' }, name: 'role:Customer Management link' },
    { type: 'text', value: 'Customer Management', name: 'text:Customer Management' },
    { type: 'css', value: 'a[href="/app/admin/customer-management"]', name: 'css:customer-management href' }
  ],
  customerManagementHeading: [
    { type: 'role', role: 'heading', options: { name: 'Customer Management' }, name: 'role:heading Customer Management' },
    { type: 'text', value: 'Customer Management', name: 'text:Customer Management heading' }
  ],
  customerModuleManagementNav: [
    { type: 'role', role: 'link', options: { name: 'Customer Module Management' }, name: 'role:Customer Module Management link' },
    { type: 'text', value: 'Customer Module Management', name: 'text:Customer Module Management' },
    { type: 'css', value: 'a[href="/app/admin/customer-module-management"]', name: 'css:customer-module-management href' }
  ]
};

module.exports = { adminSelectors };