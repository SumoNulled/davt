/**
 * UserModel class manages users, permissions, and ranks from the database object.
 *
 * @param {Object} database Parsed JSON database object
 */
function UserModel(database) {
  this.db = database;
  this.users = database.users || [];
  this.permissions = database.permissions || [];
  this.ranks = database.ranks || [];
}

/**
 * Find a user by username.
 *
 * @param {string} username
 * @return {Object|null} Returns the user object or null if not found
 */
UserModel.prototype.findByUsername = function(username) {
  for (var i = 0; i < this.users.length; i++) {
    if (this.users[i].username === username) return this.users[i];
  }
  return null;
};

/**
 * Get full name of a user by their ID.
 *
 * @param {number} userId
 * @return {string|null} Returns "First Last" or null if user not found
 */
UserModel.prototype.getFullName = function(userId) {
  var user = this.findById(userId);
  return user ? user.first_name + " " + user.last_name : null;
};

/**
 * Find a user by their ID.
 *
 * @param {number} id
 * @return {Object|null} Returns the user object or null if not found
 */
UserModel.prototype.findById = function(id) {
  for (var i = 0; i < this.users.length; i++) {
    if (this.users[i].id === id) return this.users[i];
  }
  return null;
};

/**
 * Get the rank name for a user by ID.
 *
 * @param {number} userId
 * @return {string|null} Returns the rank name or null if not found
 */
UserModel.prototype.getRank = function(userId) {
  var user = this.findById(userId);
  if (!user) return null;
  for (var i = 0; i < this.ranks.length; i++) {
    if (this.ranks[i].id === user.rank_id) return this.ranks[i].name;
  }
  return null;
};

/**
 * Get an array of permission names for a user by ID.
 *
 * @param {number} userId
 * @return {Array<string>} Returns an array of permission names, empty if none or user not found
 */
UserModel.prototype.getPermissions = function(userId) {
  var user = this.findById(userId);
  if (!user) return [];
  var result = [];
  for (var i = 0; i < user.permission_ids.length; i++) {
    var pid = user.permission_ids[i];
    for (var j = 0; j < this.permissions.length; j++) {
      if (this.permissions[j].id === pid) {
        result.push(this.permissions[j].name);
        break;
      }
    }
  }
  return result;
};

/**
 * Check if a user has a specific permission.
 *
 * @param {number} userId
 * @param {string} permissionName
 * @return {boolean} Returns true if the user has the permission, false otherwise
 */
UserModel.prototype.hasPermission = function(userId, permissionName) {
  var perms = this.getPermissions(userId);
  for (var i = 0; i < perms.length; i++) {
    if (perms[i] === permissionName) return true;
  }
  return false;
};
