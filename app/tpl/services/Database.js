/**
 * Database class to handle initializing and storing the database connection.
 *
 * @param {string} dbName Name of the flat file database (without .json)
 */
function Database(dbName) {
    var config = new DatabaseConfig(dbName);
    this.config = config;
    this.conn = this.config.connect(); // Load and validate the database
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
    if (!t) return []; // If the table does not exist, return an empty array.

    var result = []; // Prepare the results array.

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
Database.prototype.selectAll = function(table) {
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

/**
 * Inserts a new row into the specified table.
 *
 * @param {string} table Name of the table (e.g., "users")
 * @param {Array<string>} columns Array of column names (e.g., ["username", "rate"])
 * @param {Array<any>} values Array of values (e.g., ["claydk", "ITR3"])
 * @return {Object|boolean} The inserted record, or false on failure
 */
Database.prototype.insert = function(table, columns, values) {
  var t = this.conn[table];
  if (!t || typeof t.length !== "number") return false;
  if (columns.length !== values.length) return false;

  // Build the new record
  var record = {};
  for (var i = 0; i < columns.length; i++) {
    record[columns[i]] = values[i];
  }

  // Optional: Auto-increment ID
  var lastId = 0;
  for (var j = 0; j < t.length; j++) {
    if (typeof t[j].id === "number" && t[j].id > lastId) {
      lastId = t[j].id;
    }
  }
  record.id = lastId + 1;

  // Optional: Add created_at timestamp
  var now = new Date();
function pad(n) { return n < 10 ? "0" + n : n; }

record.created_at =
  now.getUTCFullYear() + "-" +
  pad(now.getUTCMonth() + 1) + "-" +
  pad(now.getUTCDate()) + "T" +
  pad(now.getUTCHours()) + ":" +
  pad(now.getUTCMinutes()) + ":" +
  pad(now.getUTCSeconds()) + "Z";


  // Insert the record
  if(t.push(record)) {
    this.save();
  }

  return record;
};

/**
 * Saves the current state of the database to disk.
 *
 * Attempts to stringify the in-memory database connection object (`this.conn`)
 * and write it to the file path defined in the configuration object (`this.config.dbFilePath`).
 *
 * @return {boolean} Returns true on successful write, false if an error occurs.
 */
Database.prototype.save = function() {
  try {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var file = fso.OpenTextFile(this.config.dbFilePath, 2 /* ForWriting */, true);
    var jsonString = jsonStringify(this.conn, null, 2); // Pretty print

    file.Write(jsonString);
    file.Close();

    return true; // Success
  } catch (e) {
    // Handle or log error here
    alert("Failed to save database: " + e.message);
    return false;
  }
};

function jsonStringify(value, indentLevel) {
  var type = typeof value;
  var indent = indentLevel || 0;
  var indentStr = "  "; // 2 spaces
  var pad = new Array(indent + 1).join(indentStr);

  if (value === null) return "null";

  if (type === "number" || type === "boolean") return String(value);

  if (type === "string")
    return '"' + value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';

  if (value && typeof value === "object" && typeof value.length === "number") {
    var res = [];
    for (var i = 0; i < value.length; i++) {
      res.push(jsonStringify(value[i], indent + 1));
    }
    return "[\n" + pad + indentStr + res.join(",\n" + pad + indentStr) + "\n" + pad + "]";
  }

  if (type === "object") {
    var res = [];
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var k = jsonStringify(key);
        var v = jsonStringify(value[key], indent + 1);
        res.push(k + ": " + v);
      }
    }
    return "{\n" + pad + indentStr + res.join(",\n" + pad + indentStr) + "\n" + pad + "}";
  }

  return undefined;
}
