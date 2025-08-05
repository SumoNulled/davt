/**
 * Dashboard controller
 *
 */
function Dashboard() {
  // Session check
  if (!session.isLoggedIn) {
    alert("Error: Session not found. Redirecting to login page.");
    new Login();
    return false;
  }

  Loaders.Page = new PageLoader("mainContent");
  this.views = Loaders.Page;
  this.container = null;

  // Load default page layout
  this.load();
}

Dashboard.prototype.load = function () {
  // Load the page view
  this.views.load('dashboard');
}

Dashboard.prototype.destruct = function () {

  // Optionally remove the page loader view
  if (this.views && typeof this.views.destruct === "function") {
    this.views.destruct();
  }

  this.views = null;
};
