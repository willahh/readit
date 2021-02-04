const fs = require("fs");
const {shell} = require('electron');
let items = document.getElementById("items");

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// Storage in localStorage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

// Listen for "done" message from reader windoww
window.addEventListener("message", (e) => {
  // Delete item at given index
  if (e.data.action == "delete-reader-item") {
    e.source.close();
    this.delete(e.data.itemIndex);
  }
});

exports.delete = (itemIndex) => {
  items.removeChild(items.childNodes[itemIndex]);
  this.storage.splice(itemIndex, 1);
  this.save();
  if (this.storage.length) {
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

exports.getSelectedItem = () => {
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;
  return { node: currentItem, index: itemIndex };
};

exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

// Select item
exports.select = (e) => {
  this.getSelectedItem().node.classList.remove("selected");
  e.currentTarget.classList.add("selected");
};

// Move to newly selected item
exports.changeSelection = (direction) => {
  console.log("changeSelection");
  let currentItem = this.getSelectedItem();

  if (direction == "ArrowUp" && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction == "ArrowDown" && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextElementSibling.classList.add("selected");
  }
};

exports.openNative = () => {
  if (!this.storage.length) {
    return;
  }
  let selectedItem = this.getSelectedItem();
  let contentURL = selectedItem.node.dataset.url;
  shell.openExternal(contentURL);
};

// Open selected item
exports.open = () => {
  if (!this.storage.length) {
    return;
  }
  let selectedItem = this.getSelectedItem();
  let contentURL = selectedItem.node.dataset.url;

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
  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

exports.addItem = (item, isNew = false) => {
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
