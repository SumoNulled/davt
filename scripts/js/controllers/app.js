/**
 * App class to handle page loading and navigation in an HTA.
 *
 */
function App() {
  if (!session.isLoggedIn) {
    alert("Error: Session not found. Redirecting to login page.");
    new Login();
    return false;
  }

  Loaders.Root.load('app'); // This loads the HTML.
  this.load();
  this.initSidebar(); // Initialize sidebar after DOM is ready
  this.showZuluTime();
}

/**
 * Load the default page (dashboard by default).
 *
 * @param {string} page The page to load.
 */
 App.prototype.load = function (page) {
   page = page || "dashboard";

   // Destruct the previous view
   if (this.view && typeof this.view.destruct === "function") {
     this.view.destruct();
     this.view = null;
   }

   var oldScript = document.getElementById("page-script");
   if (oldScript && oldScript.parentNode) {
    oldScript.parentNode.removeChild(oldScript);
   }

   // Dynamically load new script
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.src = "scripts/js/controllers/" + page + ".js";
   script.id = "page-script";

   var self = this;
   script.onload = function () {
     // Assume page class name matches file name (e.g., Draft.js → Draft)
     var PageClass = window[capitalize(page)];
     if (typeof PageClass === "function") {
       self.view = new PageClass();
     } else {
       alert("Failed to load page class for: " + page);
     }
   };

   document.body.appendChild(script);
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

 App.prototype.showZuluTime = function () {
  var container = document.getElementById("zulu-time-display");
  if (!container) return;

  function updateTime() {
    var now = new Date();
    var zulu = now.toISOString().replace("T", " ").replace(/\.\d+Z$/, "Z");
    container.innerText = zulu;
  }

  updateTime();
  setInterval(updateTime, 1000); // Optional: live updating
};


 function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
