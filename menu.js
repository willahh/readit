const { Menu, shell } = require("electron");
module.exports = (appWindow) => {
  let template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add new",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWindow.send("menu-show-modal");
          },
        },
        {
          label: "Read item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWindow.send("menu-open-item");
          },
        },
        {
          label: "Delete item",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWindow.send("menu-delete-item");
          },
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift+Enter",
          click: () => {
            appWindow.send("menu-open-item-native");
          },
        },
        {
          label: "Search items",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            appWindow.send("menu-focus-search");
          },
        },
      ],
    },
    { role: "editMenu" },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        {
          label: "Learn more",
          click: () => {
            shell.openExternal("https://github.com/willahh/readit");
          },
        },
      ],
    },
  ];
  // Create Mac app menu
  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
