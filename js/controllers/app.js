/**
 * App class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function App() {
  Loaders.Root.load('app');
  Loaders.Page = new PageLoader("viewContainer");
  this.views = Loaders.Page;
  this.container = null;
  this.load();

  // Defer DOM access until next event loop tick
  setTimeout(function() {
    this.container = document.getElementById("appContainer");
    if (this.container) {
      this.container.classList.add("fade-in");
    }
  });
}

/**
 * Load the default page (dashboard by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
App.prototype.load = function(defaultPage) {
  //var classificationBar = document.getElementById("classification");
  //  classificationBar.className = "classification unclassified"; // replace secret with any level
  //  classificationBar.innerHTML = "UNCLASSIFIED";

  defaultPage = defaultPage || "dashboard";
  this.views.load(defaultPage);
};

var s = false;
if (s) {
  //var app = new App();
}
