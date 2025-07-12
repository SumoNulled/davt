/**
 * Index class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Index(containerId) {
  this.views = new PageLoader(containerId);
}

/**
 * Load the default page (login by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
Index.prototype.loadDefault = function(defaultPage) {
  defaultPage = defaultPage || "login";
  this.views.load(defaultPage);
};

// Usage: Initialize and run when document is ready
window.onload = function() {
  var index = new Index("viewContainer");
  index.loadDefault();
  var classificationBar = document.getElementById("classification");
  classificationBar.className = "classification secret"; // replace secret with any level
  //classificationBar.innerHTML = "SECRET";
};
