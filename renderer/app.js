const { ipcRenderer, TouchBarOtherItemsProxy } = require("electron");
const items = require("./items");

let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");
let search = document.getElementById("search");

// Filter items
search.addEventListener("keyup", (e) => {
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

// Navigation item selection with up/down arrows
document.addEventListener('keydown', e => {
  console.log('e.key', e.key);
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
})

const toggleModalButton = () => {
  if (addItem.disabled) {
    addItem.disable = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add item";
    closeModal.style.display = "inline";
  } else {
    addItem.disable = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

addItem.addEventListener("click", (e) => {
  if (itemUrl.value) {
    ipcRenderer.send("new-item", itemUrl.value);
    toggleModalButton();
  }
});

itemUrl.addEventListener("keyUp", (e) => {
  if (e.key == "Enter") {
    addItem.click();
  }
});

ipcRenderer.on("new-item-success", (e, newItem) => {
  console.log("on:new-item-success", newItem);
  items.addItem(newItem, true);
  modal.style.display = "none";
  itemUrl.value = "";
});
