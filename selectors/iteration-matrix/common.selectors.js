const iterationMatrixCommonSelectors = {
  login: {
    pageShell: [
      'main[aria-label="Iteration Matrix Authentication"]',
      'text=Skip to sign-in',
      'img[alt="Iteration Matrix Banner"]'
    ],
    username: [
      '#username',
      '#username',
      'input[name="username"]',
      'input[placeholder*="username or email" i]',
      'input[type="text"]'
    ],
    password: [
      '#password',
      'input[name="password"]',
      'input[placeholder*="password" i]',
      'input[type="password"]'
    ],
    rememberMe: [
      '#rememberMe',
      'input[name="rememberMe"]',
      'button#rememberMe'
    ],
    signIn: [
      'button[type="submit"]',
      'button[name="login"]',
      'button[value="Sign In"]',
      'button:has-text("Sign In")'
    ]
  },
  app: {
    postLoginMarkers: [
      'main[aria-label="Iteration Matrix Application"]',
      'button:has-text("Logout")',
      'a[href="/app/admin/mis"]',
      'a[href="/app/imremit/dashboard"]',
      'a:has-text("Admin")',
      'nav[aria-label="Admin Subroute Navigation"]',
      'header'
    ],
    errorPage: [
      'h1:has-text("We encountered an issue")',
      'main:has-text("Error details")'
    ],
    loadingWorkspace: [
      'text=Loading your workspace...',
      'status:has-text("Loading Iteration Matrix")',
      'img[alt*="Loading application" i]'
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