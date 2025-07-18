/**
 * App class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function App() {
  Loaders.Page = new PageLoader("viewContainer");
  this.views = Loaders.Page;
}

/**
 * Load the default page (dashboard by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
App.prototype.loadDefault = function(defaultPage) {
  defaultPage = defaultPage || "dashboard";
  this.views.load(defaultPage);
};

// Usage: Initialize and run when document is ready
var app = new App();
app.loadDefault();

var classificationBar = document.getElementById("classification");
classificationBar.className = "classification unclassified"; // replace secret with any level
classificationBar.innerHTML = "UNCLASSIFIED";
