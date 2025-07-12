/**
 * PageLoader class to handle switching views in an HTA.
 */
function PageLoader(containerId) {
  this.container = document.getElementById(containerId);
}

PageLoader.prototype.load = function(pageName, is404Attempt) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var folder = "app\\tpl\\views\\";
  var path = folder + pageName + ".html";

  try {
    if (!fso.FileExists(path)) {
      alert("NO perms");
      if (!is404Attempt) {
        // If the requested page doesn't exist, try loading the custom 404 page
        // You can define this dynamically or keep as a variable somewhere
        var custom404Page = "404"; // <-- change this as needed

        // Check if the custom 404 page exists before loading it
        if (fso.FileExists(folder + custom404Page + ".html")) {
          this.load(custom404Page, true); // pass true to avoid recursion
          this.attachNavigation();
        } else {
          this.container.innerHTML = "<h3>Page not found</h3>";
        }
      } else {
        // We are already trying to load the 404 page and it doesn't exist
        this.container.innerHTML = "<h3>Page not found</h3>";
      }
      return; // exit early
    }

    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", "app/tpl/views/" + pageName + ".html", false);
    xhr.send();

    if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText.length > 0)) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = xhr.responseText;
      this.container.innerHTML = "";

      while (wrapper.firstChild) {
        this.container.appendChild(wrapper.firstChild);
      }

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
    this.container.innerHTML = "<h3>Error loading page: " + e.message + "</h3>";
  }
};

/**
 * Attach onclick handlers to buttons with a data-page attribute.
 * Buttons will load the specified page on click.
 */
 PageLoader.prototype.attachNavigation = function() {
   var elements = [];
   var buttons = document.getElementsByTagName("button");
   var links = document.getElementsByTagName("a");

   for (var i = 0; i < buttons.length; i++) elements.push(buttons[i]);
   for (var i = 0; i < links.length; i++) elements.push(links[i]);

   for (var i = 0; i < elements.length; i++) {
     (function(el, self) {
       var page = el.getAttribute("data-page");
       if (page) {
         el.onclick = function() {
           self.load(page);
           return false; // HTA-safe way to stop default behavior
         };
       }
     })(elements[i], this);
   }
 };
