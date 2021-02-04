const { ipcRenderer } = require("electron");

let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");

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
  toggleModalButton();
  modal.style.display = "none";
  itemUrl.value = "";
});
