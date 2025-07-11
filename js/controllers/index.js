/**
 * Index class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function Index(containerId) {
  this.views = new PageLoader(containerId);
}

/**
 * Attach onclick handlers to buttons with a data-page attribute.
 * Buttons will load the specified page on click.
 */
Index.prototype.attachNavigation = function() {
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    (function(btn, self) {
      var page = btn.getAttribute("data-page");
      if (page) {
        btn.onclick = function() {
          self.views.load(page);
        };
      }
    })(buttons[i], this);
  }
};

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
  index.attachNavigation();
  index.loadDefault();
};
