window.db = new Database("database");

window.Models = {
  User: new UserModel(db)
}

window.Loaders = {
  Page: new PageLoader('viewContainer')
}

window.session = {
  isLoggedIn: false,
  userId: null
}
