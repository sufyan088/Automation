const commonSelectors = {
  microsoftLoginUsername: [
    { type: 'css', value: 'input#i0116:not([type="hidden"])', name: 'css:#i0116 visible' },
    { type: 'css', value: 'input[name="loginfmt"]:not([type="hidden"])', name: 'css:input[name=loginfmt] visible' },
    { type: 'placeholder', value: 'Email, phone, or Skype', name: 'placeholder:Email, phone, or Skype' }
  ],
  microsoftLoginPassword: [
    { type: 'label', value: 'Password', name: 'label:Password' },
    { type: 'css', value: 'input#i0118[type="password"]', name: 'css:#i0118[type=password]' },
    { type: 'css', value: 'input[name="passwd"][type="password"]', name: 'css:input[name=passwd][type=password]' },
    { type: 'placeholder', value: 'Password', name: 'placeholder:Password' }
  ],
  legacyLoginUsername: [
    { type: 'label', value: 'Username', name: 'label:Username' },
    { type: 'css', value: '#username', name: 'css:#username' },
    { type: 'css', value: 'input[name="username"]', name: 'css:input[name=username]' },
    { type: 'xpath', value: '//*[@id="username"]', name: 'xpath:username' }
  ],
  legacyLoginPassword: [
    { type: 'label', value: 'Password', name: 'label:Password' },
    { type: 'css', value: '#password', name: 'css:#password' },
    { type: 'css', value: 'input[name="password"]', name: 'css:input[name=password]' },
    { type: 'xpath', value: '//*[@id="password"]', name: 'xpath:password' }
  ],
  staySignedInPrompt: [
    { type: 'role', role: 'heading', options: { name: /stay signed in\?/i }, name: 'role:Stay signed in heading' },
    { type: 'text', value: 'Stay signed in?', name: 'text:Stay signed in?' },
    { type: 'text', value: "Don't show this again", name: "text:Don't show this again" }
  ],
  loginUsername: [
    { type: 'label', value: 'Username', name: 'label:Username' },
    { type: 'css', value: '#i0116', name: 'css:#i0116' },
    { type: 'css', value: 'input[name="loginfmt"]', name: 'css:input[name=loginfmt]' },
    { type: 'css', value: '#username', name: 'css:#username' },
    { type: 'css', value: 'input[name="username"]', name: 'css:input[name=username]' },
    { type: 'xpath', value: '//*[@id="username"]', name: 'xpath:username' }
  ],
  loginPassword: [
    { type: 'label', value: 'Password', name: 'label:Password' },
    { type: 'css', value: '#i0118', name: 'css:#i0118' },
    { type: 'css', value: 'input[name="passwd"]', name: 'css:input[name=passwd]' },
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
    { type: 'css', value: '#idSIButton9', name: 'css:#idSIButton9' },
    { type: 'role', role: 'button', options: { name: /sign in/i }, name: 'role:Sign In' },
    { type: 'role', role: 'button', options: { name: /next/i }, name: 'role:Next' },
    { type: 'css', value: 'button[name="login"]', name: 'css:button[name=login]' },
    { type: 'css', value: 'input[value="Sign in"]', name: 'css:input[value=Sign in]' },
    { type: 'css', value: 'input[value="Next"]', name: 'css:input[value=Next]' },
    { type: 'xpath', value: '//button[@name="login"]', name: 'xpath:button login' }
  ],
  staySignedInYes: [
    { type: 'role', role: 'button', options: { name: /^yes$/i }, name: 'role:Yes' },
    { type: 'css', value: 'input#idSIButton9[value="Yes"]', name: 'css:#idSIButton9[value=Yes]' },
    { type: 'css', value: 'input[value="Yes"]', name: 'css:input[value=Yes]' },
    { type: 'xpath', value: '//input[@id="idSIButton9" and @value="Yes"]', name: 'xpath:Yes input' }
  ],
  appSignIn: [
    { type: 'role', role: 'button', options: { name: /sign-?in with office 365/i }, name: 'role:Office 365 Sign In' },
    { type: 'text', value: 'Sign-in with Office 365', name: 'text:Sign-in with Office 365' },
    { type: 'css', value: 'button.btn.btn-primary.btn-sm.full-width.m-b', name: 'css:app sign in button' },
    { type: 'xpath', value: '//button[contains(@class,"full-width") and normalize-space()="Sign in"]', name: 'xpath:app sign in' }
  ],
  countryPicker: [
    { type: 'css', value: '#divLoginCountry', name: 'css:#divLoginCountry' },
    { type: 'css', value: '#divLoginCountry label[for="btnLoginCountryIND"]', name: 'css:#divLoginCountry India label' },
    { type: 'xpath', value: '//*[@id="divLoginCountry"]//*[@for="btnLoginCountryIND"]', name: 'xpath:divLoginCountry India label' }
  ],
  loginCountryIndia: [
    { type: 'css', value: '#divLoginCountry label[for="btnLoginCountryIND"]', name: 'css:#divLoginCountry India label' },
    { type: 'xpath', value: '//*[@id="divLoginCountry"]//*[@for="btnLoginCountryIND"]', name: 'xpath:divLoginCountry India label' },
    { type: 'label', value: 'India', name: 'label:India' },
    { type: 'text', value: 'India', name: 'text:India' },
    { type: 'xpath', value: '//*[@for="btnLoginCountryIND"]', name: 'xpath:country India label' }
  ],
  appReady: [
    { type: 'role', role: 'link', options: { name: /welcome/i }, name: 'role:Welcome link' },
    { type: 'role', role: 'link', options: { name: /log out|logout/i }, name: 'role:Logout link' },
    { type: 'text', value: 'DigitEYES Data Loader', name: 'text:DigitEYES Data Loader' },
    { type: 'text', value: 'DigitEYES Camps', name: 'text:DigitEYES Camps' }
  ],
  digitEyesCampsMenu: [
    { type: 'role', role: 'button', options: { name: /digiteyes\s*camps/i }, name: 'role:DigitEYES Camps' },
    { type: 'text', value: 'DigitEYES Camps', name: 'text:DigitEYES Camps' },
    { type: 'css', value: 'button[data-bs-target="#home-collapse"]', name: 'css:home-collapse toggle' }
  ],
  manageCampClusterLink: [
    { type: 'role', role: 'link', options: { name: /manage camp cluster/i }, name: 'role:Manage Camp Cluster' },
    { type: 'text', value: 'Manage Camp Cluster', name: 'text:Manage Camp Cluster' },
    { type: 'css', value: 'a[href="manage-camps.php"]', name: 'css:manage-camps.php' }
  ],
  loginReadyState: [
    { type: 'css', value: '#i0116', name: 'css:#i0116' },
    { type: 'css', value: 'input[name="loginfmt"]', name: 'css:input[name=loginfmt]' },
    { type: 'css', value: '#username', name: 'css:#username' }
  ],
  postLoginReady: [
    { type: 'css', value: '#divLoginCountry', name: 'css:#divLoginCountry' },
    { type: 'css', value: '#divLoginCountry label[for="btnLoginCountryIND"]', name: 'css:#divLoginCountry India label' },
    { type: 'role', role: 'link', options: { name: /welcome/i }, name: 'role:Welcome link' },
    { type: 'role', role: 'link', options: { name: /log out|logout/i }, name: 'role:Logout link' },
    { type: 'text', value: 'DigitEYES Data Loader', name: 'text:DigitEYES Data Loader' }
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
    { type: 'role', role: 'link', options: { name: /log out|logout/i }, name: 'role:Logout link' },
    { type: 'role', role: 'button', options: { name: /log out|logout/i }, name: 'role:Logout button' },
    { type: 'role', role: 'menuitem', options: { name: /log out|logout/i }, name: 'role:Logout menuitem' },
    { type: 'text', value: 'Log out', name: 'text:Log out' },
    { type: 'text', value: 'Logout', name: 'text:Logout' },
    { type: 'xpath', value: '//*[contains(@class,"text-destructive-foreground") and .//*[name()="svg"]]', name: 'xpath:logout destructive item' },
    { type: 'xpath', value: '//div[contains(@class,"cursor-pointer") and .//*[name()="svg"]]', name: 'xpath:logout div with icon' }
  ]
};

module.exports = { commonSelectors };
