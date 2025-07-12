/**
 * PageLoader class to handle switching views in an HTA.
 *
 * @param {string} containerId - The ID of the container element where pages are loaded.
 */
function PageLoader(containerId) {
  this.container = document.getElementById(containerId);
}

/**
 * Loads an HTML page into the container.
 * Handles file existence, 404 fallback, and script execution.
 *
 * @param {string} pageName - Name of the page (filename without extension).
 * @param {boolean} is404Attempt - Internal flag to prevent infinite 404 recursion.
 */
PageLoader.prototype.load = function(pageName, is404Attempt) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var folder = "app\\tpl\\views\\";
  var path = folder + pageName + ".html";

  try {
    // Check if requested file exists
    if (!fso.FileExists(path)) {
      alert("NO perms");
      if (!is404Attempt) {
        var custom404Page = "404";

        // Load custom 404 page if it exists
        if (fso.FileExists(folder + custom404Page + ".html")) {
          this.load(custom404Page, true);
          this.attachNavigation();
        } else {
          this.container.innerHTML = "<h3>Page not found</h3>";
        }
      } else {
        // Already attempted 404 page and it doesn't exist
        this.container.innerHTML = "<h3>Page not found</h3>";
      }
      return; // Stop execution early
    }

    // Load page content synchronously via XMLHttpRequest ActiveX
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", "app/tpl/views/" + pageName + ".html", false);
    xhr.send();

    if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText.length > 0)) {
      // Parse response text into DOM nodes
      var wrapper = document.createElement("div");
      wrapper.innerHTML = xhr.responseText;

      this.container.innerHTML = "";

      // Move all nodes into container
      while (wrapper.firstChild) {
        this.container.appendChild(wrapper.firstChild);
      }

      // Re-execute scripts in loaded content
      var scripts = this.container.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        var s = document.createElement("script");
        if (scripts[i].src) {
          s.src = scripts[i].src;
        } else {
          s.text = scripts[i].text;
        }
        scripts[i].parentNode.replaceChild(s, scripts[i]);
      }
      this.attachNavigation();
    } else {
      this.container.innerHTML = "<h3>Page not found</h3>";
    }
  } catch (e) {
    // Show error message in container on exception
    this.container.innerHTML = "<h3>Error loading page: " + e.message + "</h3>";
  }
};

/**
 * Attaches onclick event handlers to buttons and links with a data-page attribute.
 * Clicking these elements loads the specified page via the loader.
 */
PageLoader.prototype.attachNavigation = function() {
  var elements = [];
  var buttons = document.getElementsByTagName("button");
  var links = document.getElementsByTagName("a");

  // Collect all buttons and links
  for (var i = 0; i < buttons.length; i++) elements.push(buttons[i]);
  for (var i = 0; i < links.length; i++) elements.push(links[i]);

  // Attach click handlers to elements with data-page attribute
  for (var i = 0; i < elements.length; i++) {
    (function(el, self) {
      var page = el.getAttribute("data-page");
      if (page) {
        el.onclick = function() {
          self.load(page);
          return false; // Prevent default link/button action
        };
      }
    })(elements[i], this);
  }
};
