var fso = new ActiveXObject("Scripting.FileSystemObject");
var tempFolder = fso.GetSpecialFolder(2); // 2 = TemporaryFolder
var lockFilePath = fso.BuildPath(tempFolder, "DAVTApp.lock");
var isOwner = false;

if (fso.FileExists(lockFilePath)) {
  var network = new ActiveXObject("WScript.Network");
  var loggedInUserName = network.UserName;
  alert("This application is already in use by " + loggedInUserName + ".");
  window.resizeTo(0, 0);      // shrink window first
  window.moveTo(-32000, -32000); // move off-screen (optional)
  window.close();
} else {
  var lockFile = fso.CreateTextFile(lockFilePath, true);
  lockFile.WriteLine("running");
  lockFile.Close();
  isOwner = true;
}

window.onunload = function () {
  if (isOwner && fso.FileExists(lockFilePath)) {
    fso.DeleteFile(lockFilePath);
  }
};
