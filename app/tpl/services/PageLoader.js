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
    var c = this.container;

    var currentPage = c.getAttribute("data-current-page"); // Save current page

    var performLoad = function() {
        // Actual page loading logic
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("GET", "app/tpl/views/" + pageName + ".html", false);
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

            // Fade-in after DOM load
            setTimeout(function() {
                c.classList.add("visible");
                c.setAttribute("data-current-page", pageName);
            }, 20);

            this.attachNavigation();

            if (pageName === "login") sideBar.style.display = "none";
            else sideBar.style.display = "block";
        } else {
            c.innerHTML = "<h3>Page not found</h3>";
        }
    }.bind(this);

    // Logic to fade out login only
    if (currentPage === "login" && pageName !== "login") {
        c.classList.remove("visible");
        setTimeout(performLoad, 200); // Wait for fade-out
    } else {
        performLoad(); // No delay, just load
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
