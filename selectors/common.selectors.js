const commonSelectors = {
  loginUsername: [
    { type: 'label', value: 'Username', name: 'label:Username' },
    { type: 'css', value: '#username', name: 'css:#username' },
    { type: 'css', value: 'input[name="username"]', name: 'css:input[name=username]' },
    { type: 'xpath', value: '//*[@id="username"]', name: 'xpath:username' }
  ],
  loginPassword: [
    { type: 'label', value: 'Password', name: 'label:Password' },
    { type: 'css', value: '#password', name: 'css:#password' },
    { type: 'css', value: 'input[name="password"]', name: 'css:input[name=password]' },
    { type: 'xpath', value: '//*[@id="password"]', name: 'xpath:password' }
  ],
  rememberMe: [
    { type: 'css', value: '#rememberMe', name: 'css:#rememberMe' },
    { type: 'role', role: 'button', options: { name: /remember/i }, name: 'role:Remember' },
    { type: 'xpath', value: '//button[@id="rememberMe"]', name: 'xpath:rememberMe' }
  ],
  signIn: [
    { type: 'role', role: 'button', options: { name: /sign in/i }, name: 'role:Sign In' },
    { type: 'css', value: 'button[name="login"]', name: 'css:button[name=login]' },
    { type: 'xpath', value: '//button[@name="login"]', name: 'xpath:button login' }
  ],
  managementLanding: [
    { type: 'text', value: 'Management', name: 'text:Management' },
    { type: 'text', value: 'Admin CSR', name: 'text:Admin CSR' },
    { type: 'xpath', value: '//*[@id="root"]//p[contains(@class,"font-semibold")]', name: 'xpath:management landing' }
  ],
  userProfile: [
    { type: 'css', value: 'header span[class*="rounded-full"]', name: 'css:user profile badge' },
    { type: 'xpath', value: '//*[contains(@class,"rounded-full") and contains(@class,"bg-")]', name: 'xpath:user profile badge' }
  ],
  logout: [
    { type: 'role', role: 'button', options: { name: /log out|logout/i }, name: 'role:Logout button' },
    { type: 'role', role: 'menuitem', options: { name: /log out|logout/i }, name: 'role:Logout menuitem' },
    { type: 'text', value: 'Log out', name: 'text:Log out' },
    { type: 'text', value: 'Logout', name: 'text:Logout' },
    { type: 'xpath', value: '//*[contains(@class,"text-destructive-foreground") and .//*[name()="svg"]]', name: 'xpath:logout destructive item' },
    { type: 'xpath', value: '//div[contains(@class,"cursor-pointer") and .//*[name()="svg"]]', name: 'xpath:logout div with icon' }
  ]
};

module.exports = { commonSelectors };
