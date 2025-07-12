window.db = new Database("database");

window.Models = {
  User: new UserModel(db)
}

window.Loaders = {
  Page: new PageLoader('viewContainer')
}

window.session = {
  isLoggedIn: false,
  userId: null,
  startTime: null,      // timestamp when session started
  timeoutSeconds: 10    // debug session length
}
