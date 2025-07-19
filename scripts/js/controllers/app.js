/**
 * App class to handle page loading and navigation in an HTA.
 *
 * @param {string} containerId ID of the container element for loading pages.
 */
function App() {
  if (!session.isLoggedIn) {
    alert("Error: Session not found. Redirecting to login page.");
    new Login();
    return false;
  }

  Loaders.Root.load('app'); // This loads the HTML.
  Loaders.Page = new PageLoader("mainContent");
  this.views = Loaders.Page;
  this.container = null;

  this.load(); // Load default page

  var self = this;

  // Defer DOM access until next event loop tick
  setTimeout(function () {
    self.container = document.getElementById("appContainer");
    if (self.container) {
      self.container.classList.add("fade-in");
    }

    self.initSidebar(); // Initialize sidebar after DOM is ready
  });
}

/**
 * Load the default page (dashboard by default).
 *
 * @param {string} page The page to load.
 */
App.prototype.load = function (page) {
  page = page || "dashboard";
  this.views.load(page);
};

/**
 * Initialize sidebar navigation and toggle.
 */
App.prototype.initSidebar = function () {
  var sidebar = document.getElementById('sideBar');
  var toggle = document.getElementById('sidebarToggle');

  if (toggle && sidebar) {
    toggle.onclick = function () {
      if (sidebar.className.indexOf("show") === -1) {
        sidebar.className += " show";
      } else {
        sidebar.className = sidebar.className.replace(" show", "");
      }
    };
  }

  var links = document.getElementsByClassName('nav-link');
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = this.createLinkHandler(links[i], links);
  }
};

/**
 * Helper to create link handler closure for older JS compatibility.
 */
 App.prototype.createLinkHandler = function (link, allLinks) {
   var self = this;
   return function (e) {
     if (e && e.preventDefault) e.preventDefault();

     // Remove 'active' class from all links
     for (var j = 0; j < allLinks.length; j++) {
       allLinks[j].className = allLinks[j].className.replace(/\bactive\b/, "");
     }

     // Trim trailing spaces and add 'active'
     link.className = (link.className + " active").replace(/\s+/g, " ").trim();

     // Load the page
     var page = link.getAttribute('data-page');
     self.load(page);
   };
 };
