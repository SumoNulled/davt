/**
 * Index class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Index() {
  this.views = Loaders.Page;
}

/**
 * Load the default page (login by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
Index.prototype.loadDefault = function(defaultPage) {
  defaultPage = defaultPage || "dashboard";
  this.views.load(defaultPage);
  document.getElementById("appContainer").classList.add("fade-in");
};

// Usage: Initialize and run when document is ready
window.onload = function() {
  var index = new Index();
  //index.loadDefault();
  Loaders.Login.load('login');
  var classificationBar = document.getElementById("classification");
  classificationBar.className = "classification unclassified"; // replace secret with any level
  classificationBar.innerHTML = "UNCLASSIFIED";
};
