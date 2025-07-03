/**
 * Database class to handle initializing and storing the database connection.
 *
 * @param {string} dbName Name of the flat file database (without .json)
 */
function Database(dbName) {
    var config = new DatabaseConfig(dbName);
    this.conn = config.connect(); // Load and validate the database
}

/**
 * Method to test for the database connection
 *
 * @return {string} Expected validation string.
 */
Database.prototype.testConnection = function() {
    return this.conn.__details[0].validation;
}

/**
 * Method to mimic SQL SELECT operations with filtering.
 *
 * @param {string} parameter Field name to filter by (e.g., "id", "rank_id")
 * @param {string|number} value Value to match (e.g., 1, "claydk")
 * @param {string} table Name of the table (e.g., "users")
 * @return {Array<Object>} Array of matching records (can be empty)
 */
Database.prototype.select = function(parameter, value, table) {
    var t = this.conn[table];
    if (!t) return [];

    var result = [];

    // Array mode
    if (typeof t.length === "number") {
        for (var i = 0; i < t.length; i++) {
            if (t[i][parameter] === value) {
                result.push(t[i]);
            }
        }
    }

    // Object mode
    else if (typeof t === "object") {
        if (t[parameter] === value) {
            result.push(t);
        }
    }

    return result;
};

/**
 * Returns all rows from a given table.
 *
 * @param {string} table Name of the table (e.g., "users")
 * @return {Array<Object>} Array of all records in the table, or empty array
 */
Database.prototype.selectMulti = function(table) {
    var t = this.conn[table];

    if (!t) return [];

    if (typeof t.length === "number") {
        // It's an array
        return t;
    } else if (typeof t === "object") {
        // It's a plain object
        return [t];
    }

    return [];
};
