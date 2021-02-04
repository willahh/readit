const fs = require("fs");
let items = document.getElementById("items");

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// Storage in localStorage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

// Select item
exports.select = (e) => {
  document
    .getElementsByClassName("read-item selected")[0]
    .classList.remove("selected");
  e.currentTarget.classList.add("selected");
};

// Move to newly selected item
exports.changeSelection = (direction) => {
  console.log("changeSelection");
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  if (direction == "ArrowUp" && currentItem.previousElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.previousElementSibling.classList.add("selected");
  } else if (direction == "ArrowDown" && currentItem.nextElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.nextElementSibling.classList.add("selected");
  }
};

// Open selected item
exports.open = () => {
  if (!this.storage.length) {
    return;
  }
  let selectedItem = document.getElementsByClassName("read-item selected")[0];
  let contentURL = selectedItem.dataset.url;
  console.log("contentURL", contentURL);

  // Open item in proxy BrowserWindow
  let readerWin = window.open(
    contentURL,
    `
    maxWidth=1920,
    maxHeight=1080,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `
  );

  // Inject js
  readerWin.eval(readerJS);
};

exports.addItem = (item, isNew = false) => {
  console.log("addItem", item);

  let itemNode = document.createElement("div");
  itemNode.setAttribute("class", "read-item");
  itemNode.setAttribute("data-url", item.url);
  itemNode.innerHTML = `<img src="${item.screenshot}"/><h2>${item.title}</h2>`;
  items.appendChild(itemNode);
  itemNode.addEventListener("click", this.select);
  itemNode.addEventListener("dblclick", this.open);

  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add items from storage when app loads
this.storage.forEach((item) => {
  this.addItem(item);
});
