window.db = new Database("database");

window.Models = {
  User: new UserModel(db)
}

window.Loaders = {
  Root: new PageLoader('root'),
  Page: new PageLoader('mainContent')
}

window.Pages = {
  App: App,
  Login: Login
}

window.session = {
  isLoggedIn: true,
  userId: null,
  startTime: Date.now(),      // timestamp when session started
  timeoutSeconds: 86400    // debug session length
}
