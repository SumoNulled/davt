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
 */
 PageLoader.prototype.load = function(pageName) {
     var c = this.container;
     if (!c) return null;

     var fso = new ActiveXObject("Scripting.FileSystemObject");
     var folder = "app\\tpl\\views\\";
     var path = folder + pageName + ".html";

     // Check if file exists before trying to load it
     if (!fso.FileExists(path)) {
         c.innerHTML = "<h2 class='page-title'>Page not found</h2>";
         return null;
     }

     // Read and inject content
     var xhr = new ActiveXObject("Microsoft.XMLHTTP");
     xhr.open("GET", path, false);
     xhr.send();

     if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText.length > 0)) {
         var wrapper = document.createElement("div");
         wrapper.innerHTML = xhr.responseText;

         c.innerHTML = "";
         while (wrapper.firstChild) c.appendChild(wrapper.firstChild);

         var scripts = c.getElementsByTagName("script");
         for (var i = 0; i < scripts.length; i++) {
             var s = document.createElement("script");
             if (scripts[i].src) s.src = scripts[i].src;
             else s.text = scripts[i].text;
             scripts[i].parentNode.replaceChild(s, scripts[i]);
         }

         this.attachNavigation();
         return true;
     } else {
         c.innerHTML = "<h2 class='page-title'>Page load failed</h2>";
         return null;
     }
 };

/**
 * Attaches onclick event handlers to buttons and links with a data-page attribute.
 * Clicking these elements loads the specified page via the loader.
 */
 PageLoader.prototype.attachNavigation = function() {
     var elements = [];

     // Only get buttons/links inside the container (prevent global hijack)
     var buttons = this.container.getElementsByTagName("button");
     var links = this.container.getElementsByTagName("a");

     for (var i = 0; i < buttons.length; i++) elements.push(buttons[i]);
     for (var i = 0; i < links.length; i++) elements.push(links[i]);

     for (var i = 0; i < elements.length; i++) {
         (function(el, self) {
             var page = el.getAttribute("data-page");
             if (page) {
                 el.onclick = function() {
                     self.load(page);
                     return false;
                 };
             }
         })(elements[i], this);
     }
 };

 /**
  * Cleans up the current container's contents and event bindings.
  * Useful before loading a new page or tearing down the view.
  */
 PageLoader.prototype.destruct = function() {
     if (!this.container) return;

     // Remove all child nodes from the container
     while (this.container.firstChild) {
         this.container.removeChild(this.container.firstChild);
     }

     // Optional: Reset container reference (if needed)
     // this.container = null;
 };


PageLoader.prototype.setContainer = function(id) {
    this.container = document.getElementById(id);
};
