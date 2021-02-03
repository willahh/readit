// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");

console.log("Checking ready:", app.isReady());

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

ipcMain.on("new-item", (e, itemUrl) => {
  console.log(itemUrl);

  setTimeout(() => {
    e.sender.send("new-item-success", "new item from main process");
  }, 2000);
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  let state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 650,
  });
  console.log("state", state);
  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 350,
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadFile("renderer/main.html");

  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  // mainWindow.on("closed", () => {
  //   mainWindow = null;
  // });
}

// Electron `app` is ready
app.on("ready", () => {
  console.log("App is ready !");
  // console.log("desktop: ", app.getPath("desktop"));
  // console.log("music: ", app.getPath("music"));
  // console.log("temp: ", app.getPath("temp"));
  // console.log("userData: ", app.getPath("userData"));
  createWindow();
});

// // Quit when all windows are closed - (Not macOS - Darwin)
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });

// // When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
// app.on("activate", () => {
//   if (mainWindow === null) createWindow();
// });
