window.db = new Database("database");

window.Models = {
  User: new UserModel(db)
}

window.Loaders = {
  Page: new PageLoader('viewContainer')
}

window.session = {
  isLoggedIn: true,
  userId: null,
  startTime: Date.now(),      // timestamp when session started
  timeoutSeconds: 86400    // debug session length
}
