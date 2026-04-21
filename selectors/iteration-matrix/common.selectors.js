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
      'nav[aria-label="Admin Subroute Navigation"]',
      'main article'
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