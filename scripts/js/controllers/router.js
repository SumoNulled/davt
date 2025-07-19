/**
 * Index class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Router() {
  this.views = Loaders.Root;
}

/**
 * Load the default page (login by default).
 *
 * @param {string} defaultPage The page to load by default.
 */
Router.prototype.loadDefault = function(defaultPage) {
  new Pages.App();
};

// Usage: Initialize and run when document is ready
window.onload = function() {
  var router = new Router();
  router.loadDefault();
};
