// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./readItem");
const appMenu = require('./menu');
const updater = require('./updater');

console.log("Checking ready:", app.isReady());

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

ipcMain.on("new-item", (e, itemUrl) => {
  console.log(itemUrl);

  readItem(itemUrl, (item) => {
    e.sender.send("new-item-success", item);
  });
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // Check for app updates after 3 secondes
  setTimeout(updater, 3000);
  
  let state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 650,
  });
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
  appMenu(mainWindow.webContents)
  mainWindow.loadFile("renderer/main.html");

  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
   // mainWindow.webContents.openDevTools();
}

// Electron `app` is ready
app.on("ready", () => {
  console.log("App is ready !");
  createWindow();
});