/**
 * Router class to handle page loading and navigation
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Router() {
  this.views = Loaders.Root;
}

/**
 * Load the default page
 *
 * @return {void}
 */
Router.prototype.load = function() {
  new Pages.App();
};

// Usage: Initialize and run when DOM is ready
window.onload = function() {
  var router = new Router();
  router.load();
};
