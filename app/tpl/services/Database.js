/**
 * Database class to handle initializing and storing the database connection.
 *
 * @param {string} dbName Name of the flat file database (without .json)
 */
function Database(dbName)
{
  var config = new DatabaseConfig(dbName);
  this.conn = config.connect(); // Load and validate the database
}

/**
 * Method to test for the database connection
 *
 * @return {string} Expected validation string.
 */
Database.prototype.testConnection = function()
{
  return this.conn.__details.validation;
}
