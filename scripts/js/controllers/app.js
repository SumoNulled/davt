/**
 * App class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function App() {
  if(!session.isLoggedIn) {
    alert("Error: Session not found. Redirecting to login page.");
    new Login();
    return false;
  }
  Loaders.Root.load('app'); // This loads the HTML.
  Loaders.Page = new PageLoader("mainContent");
  this.views = Loaders.Page;
  this.container = null;
  this.load();
  var self = this;
  // Defer DOM access until next event loop tick
  setTimeout(function() {
    self.container = document.getElementById("appContainer");
    if (self.container) {
      self.container.classList.add("fade-in");
    }
  });
}

/**
 * Load the default page (dashboard by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
App.prototype.load = function(page) {
  page = page || "dashboard";
  this.views.load(page);
};
