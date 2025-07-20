/**
 * Login class to handle login view logic and session setup in an HTA.
 */
function Login() {
  Loaders.Root.load('login'); // This loads the HTML.
  this.container = null;
  this.message = null;
  this.view = null;

  var self = this;
  // Defer DOM access until next event loop tick
  setTimeout(function() {
    self.container = document.getElementById("loginView");
    if (self.container) {
      self.message = document.getElementById("loginMessage");
      self.view = document.getElementById("loginContainer");
      self.init();
    }
  });
}

/**
 * Initialize the login view behavior and event listeners.
 */
Login.prototype.init = function () {
  document.getElementById("username").focus();
  this.view.classList.remove("fade-out");
  this.view.classList.add("fade-in");

  document.getElementById("loginForm").addEventListener("submit", this.handleLoginClick.bind(this));
};

/**
 * Trim whitespace from a string.
 *
 * @param {string} str - The input string.
 * @returns {string} - Trimmed string.
 */
Login.prototype.trim = function (str) {
  return str.replace(/^\s+|\s+$/g, "");
};

/**
 * Handle the login form submission.
 *
 * @param {Event} e - The form submit event.
 */
Login.prototype.handleLoginClick = function (e) {
  e.preventDefault();

  var username = this.trim(document.getElementById("username").value);
  var password = document.getElementById("password").value;
  var user = Models.User.validateCredentials(username, password);

  if (user) {
    // Valid credentials
    this.message.style.color = "green";
    this.message.innerHTML = "\u2705 Success! Establishing session";

    var count = 0;
    var interval = setInterval(function() {
      count = (count + 1) % 4;
      var dots = "";
      for (var i = 0; i < count; i++) {
        dots += ".";
      }
      this.message.innerHTML = "\u2705 Success! Establishing session" + dots;
    }.bind(this), 250);


    // Initialize session
    window.session.isLoggedIn = true;
    window.session.user = user;
    window.session.startTime = Math.floor(Date.now() / 1000);

    var self = this;
    // Fade out login container
    setTimeout(function() {
      self.container.classList.add("fade-out");
    }, 3000);

    // After fade out, load the app
    this.container.addEventListener("transitionend", function(event) {
      if (event.propertyName === "opacity") {
        new Pages.App();
      }
    });

  } else {
    // Invalid credentials
    this.message.style.color = "red";
    this.message.innerHTML = "Invalid username or password. Please try again.";
    alert("Invalid username or password.");
  }
};
