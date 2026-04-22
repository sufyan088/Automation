const iterationMatrixCommonSelectors = {
  login: {
    username: [
      '#username',
      'input[name="username"]',
      'input[type="text"]'
    ],
    password: [
      'input[name="password"]',
      'input[type="password"]'
    ],
    rememberMe: [
      '#rememberMe',
      'button#rememberMe'
    ],
    signIn: [
      'button[name="login"]',
      'button[value="Sign In"]',
      'button:has-text("Sign In")'
    ]
  },
  app: {
    postLoginMarkers: [
      'text=Management',
      'text=imREmit',
      'a:has-text("Admin")',
      'a:has-text("Supplier Management")',
      'nav[aria-label="Admin Subroute Navigation"]',
      'header'
    ],
    errorPage: [
      'h1:has-text("We encountered an issue")',
      'main:has-text("Error details")'
    ],
    errorPageRecovery: [
      'button:has-text("Go home")',
      'button:has-text("Refresh page")'
    ],
    profileButton: [
      'header span.rounded-full',
      'header [class*="rounded-full"][class*="bg-accent"]',
      'header [class*="rounded-full"][class*="bg-muted"]'
    ],
    logoutButton: [
      'text=Logout',
      'svg.lucide-log-out'
    ]
  }
};

module.exports = {
  iterationMatrixCommonSelectors
};