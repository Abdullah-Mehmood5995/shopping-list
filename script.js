const form = document.querySelector("#item-form");
const formInput = document.querySelector(".form-input");
const itemList = document.querySelector(".items");
const clearBtn = document.getElementById("clear");
const filter = document.querySelector("#filter");
const formBtn = form.querySelector('.btn');

let isEditMod = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
    checkUiState();
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let newInput = formInput.value;
  if (newInput.trim() === "") {
    alert("please enter an item");
    return;
  }

if(isEditMod){
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent)
    // itemToEdit.classList.remove("edit-mode")
    itemToEdit.remove()
    formBtn.innerHTML= '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333"
    isEditMod = false;
}else{
    if(checkIfItemExists(newInput)){
      alert('you already have this item into your list')
      return;
    }
}


  addItemToDOM(newInput);

  formInput.value = "";
  addItemToStorage(newInput);
  checkUiState();
});




function addItemToDOM(item) {
  const li = document.createElement("li");
  li.classList.add("remove-Li");
  li.appendChild(document.createTextNode(item));
  const button = forBtn("remove-item btn-link text-red");

  li.appendChild(button);
  itemList.appendChild(li);
}

function checkIfItemExists(item){
  let itemFromStorage = getItemsFromStorage();
       return itemFromStorage.includes(item)       
}


function forBtn(clsses) {
  const button = document.createElement("button");
  button.className = clsses;

  const icon = forIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function forIcon(clsses) {
  const icon = document.createElement("i");
  icon.className = clsses;
  return icon;
}

function checkUiState() {
  const item = itemList.querySelectorAll("li");
  if (item.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }
}

function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  itemsFromStorage = localStorage.setItem(
    "items",
    JSON.stringify(itemsFromStorage),
  );
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function onClickCross(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  }else{
    setItemToEdit(e.target)
  }
}

function setItemToEdit(item){
  isEditMod = true;
    itemList.querySelectorAll('li').forEach((i)=>
        i.classList.remove("edit-mode"))
    item.classList.add("edit-mode");
    formInput.value = item.textContent;
    formBtn.style.backgroundColor = "blue";
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> update item'
}



function removeItem(item) {
  if (confirm("are you sure")) {
    item.remove();
  }

  removeItemFromStorage(item.textContent);

  checkUiState();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

itemList.addEventListener("click", onClickCross);
clearBtn.addEventListener("click", function () {
  while (itemList.firstChild) {
    // itemList.firstChild.remove()
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("items");
  localStorage.clear();
  checkUiState();
});

filter.addEventListener("input", function (e) {
  let text = e.target.value.toLowerCase();
  const item = itemList.querySelectorAll("li");

  item.forEach((item) => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", displayItems);

checkUiState();



