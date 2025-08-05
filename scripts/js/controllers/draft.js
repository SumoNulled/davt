/**
 * Draft class to handle drafting message logic.
 *
 */
function Draft() {
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

  this.boundUpdate = this.update.bind(this);

  // Initialize events and rendering
  this.init();
}

Draft.prototype.load = function () {
  // Load the page view
  this.views.load('draft');
}

/**
 * Initialize the Draft form.
 *
 */
Draft.prototype.init = function () {
  // Store form field references
  this.from = document.getElementById("from");
  this.to = document.getElementById("to");
  this.subject = document.getElementById("subject");
  this.info = document.getElementById("info");
  this.precedence = document.getElementById("precedence");
  this.classification = document.getElementById("classification");
  this.datetime = document.getElementById("datetime");
  document.getElementById("datetime").value = getCurrentZuluDateTime();
  this.body = document.getElementById("body");
  this.preview = document.getElementById("preview");

  // Bindings
  this.fields = [
    this.from,
    this.to,
    this.subject,
    this.info,
    this.precedence,
    this.classification,
    this.datetime,
    this.body
  ];
  // Attach input/change event listeners
  for (var i = 0; i < this.fields.length; i++) {
    this.fields[i].addEventListener("input", this.boundUpdate);
    this.fields[i].addEventListener("change", this.boundUpdate);
  }

  // Initial preview render
  this.update();
};

/**
 * Update the preview text area with formatted message.
 *
 */
 Draft.prototype.update = function () {
   var precedenceChar = this.precedence.value[0] || "";
   var classificationChar = this.classification.value[0] || "";
   var qzclass = "";
   var input = this.datetime.value;
   var dateObj = new Date(input.slice(0, 10) + 'T' + input.slice(11, 13) + ':' + input.slice(13) + "Z");
   var date = formatDate(dateObj);
   var time = formatTime(dateObj);
   const dateStr = formatDateTime(dateObj);

   if (classificationChar == "U") {
     qzclass = "ZNR";
   } else {
     qzclass = "ZNY";
   }
   var julianDate = getMilitaryJulian(date);

   // Format INFO line as multiple lines
   var infoRaw = this.info.value || "";
   var infoList = infoRaw
     .split(",")
     .map(function (item) { return item.trim(); }) // remove whitespace
     .filter(Boolean); // remove empty strings

   var lines = [
     precedenceChar + "AA" + classificationChar + "ZYUW" + " " + "GHICSUU0001 " + julianDate + time + "-" + classificationChar + classificationChar + classificationChar + classificationChar + "--DEFCSUU.",
     qzclass + " " + classificationChar + classificationChar + classificationChar + classificationChar + classificationChar,
     precedenceChar + " " + dateStr,
     "FM " + this.from.value,
     "TO " + this.to.value,
     "INFO " + (infoList.shift() || "") // First one goes on same line
   ];
   // Add the rest of the INFO entries on new lines
   lines = lines.concat(infoList);
   lines.push("BT");
   if (this.classification.value === "UNCLAS") {
  lines.push("UNCLASS");
} else {
  lines.push(this.classification.value.split("").join(" "));
}

   lines.push("MSGID/GENADMIN/" + this.from.value + "//\nSUBJ/" + this.subject.value.toUpperCase() + "//")
   const prefix = "GENTEXT/REMARKS/";
 const suffix = "//";
 const maxLineLength = 69;

 const body = this.body.value.trim();
 const words = body.split(/\s+/);

 var currentLine = prefix + words[0]; // start with prefix + first word

 for (var i = 1; i < words.length; i++) {
   var word = words[i];
   if ((currentLine + " " + word).length > maxLineLength) {
     lines.push(currentLine);
     currentLine = word;
   } else {
     currentLine += " " + word;
   }
 }

 if (currentLine.length > 0) {
   currentLine += suffix;
   lines.push(currentLine);
 }

lines.push("BT");
lines.push("#0001");
lines.push("\n\n\n\n\n\nNNNN");


   this.preview.value = lines.join("\n");
 };

function getMilitaryJulian(dateStr) {
  var now = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
  var day = Math.floor(diff / 86400000);
  return isNaN(day) ? "DDD" : pad3(day);
}

function pad3(n) {
  return n < 10 ? "00" + n : n < 100 ? "0" + n : "" + n;
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "YYYY-MM-DD";
  }
  return year + '-' + pad2(month) + '-' + pad2(day);
}

function formatTime(dateObj) {
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();

  if (isNaN(hours) || isNaN(minutes)) {
    return "HHMM";
  }
  return pad2(hours) + pad2(minutes);
}

function formatDateTime(dateObj) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const day = pad2(dateObj.getUTCDate());
  const hours = pad2(dateObj.getUTCHours());
  const minutes = pad2(dateObj.getUTCMinutes());
  const month = months[dateObj.getUTCMonth()];
  const year = String(dateObj.getUTCFullYear()).slice(-2);

  return day + hours + minutes + "Z" + " " + month + " " + year;
}

function getCurrentZuluDateTime() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = pad2(now.getUTCMonth() + 1);
  const day = pad2(now.getUTCDate());
  const hours = pad2(now.getUTCHours());
  const minutes = pad2(now.getUTCMinutes());

  return year + "-" + month + "-" + day + " " + hours + minutes;
}

/**
 * Remove event listeners and references for cleanup.
 *
 */
Draft.prototype.destruct = function () {
  // Remove all input/change listeners
  for (var i = 0; i < this.fields.length; i++) {
    this.fields[i].removeEventListener("input", this.boundUpdate);
    this.fields[i].removeEventListener("change", this.boundUpdate);
  }

  // Clear preview
  if (this.preview) {
    this.preview.value = "";
  }

  // Clear reference to DOM nodes
  this.from = null;
  this.to = null;
  this.info = null;
  this.precedence = null;
  this.classification = null;
  this.datetime = null;
  this.body = null;
  this.preview = null;
  this.fields = null;
  this.container = null;

  // Optionally remove the page loader view
  if (this.views && typeof this.views.destruct === "function") {
    this.views.destruct();
  }

  this.views = null;
};
