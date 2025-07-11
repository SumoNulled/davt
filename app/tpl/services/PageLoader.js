/**
 * PageLoader class to handle switching views in an HTA.
 */
function PageLoader(containerId) {
  this.container = document.getElementById(containerId);
}

PageLoader.prototype.load = function(pageName) {
  try {
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", "app/tpl/views/" + pageName + ".html", false); // synchronous
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
    } else {
      this.container.innerHTML = "<h3>Page not found</h3>";
    }
  } catch (e) {
    this.container.innerHTML = "<h3>Error loading page.</h3>";
  }
};
