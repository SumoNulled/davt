/**
 * Index class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Index() {
  this.views = Loaders.Root;
}

/**
 * Load the default page (login by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
Index.prototype.loadDefault = function(defaultPage) {
  //defaultPage = defaultPage || "login";
  //this.views.load(defaultPage);
  new Pages.App();
};

// Usage: Initialize and run when document is ready
window.onload = function() {
  var index = new Index();
  index.loadDefault();
};
