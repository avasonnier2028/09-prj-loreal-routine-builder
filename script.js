//RTL Support
/*  RTL languages
Arabic (ar), Hebrew (he), Persian/Farsi (fa), and Urdu (ur).
*/
const rtlLangs = ["ar", "he", "fa", "ur", "yi"];
function updateLanguageDirection(currentLang) {
  const isRtl = rtlLangs.includes(currentLang);
  const direction = isRtl ? "rtl" : "ltr";

  // Apply attributes to the root HTML node
  document.documentElement.dir = direction;
  document.documentElement.lang = currentLang;
}
console.log(`Current Language: ${navigator.language}`);
updateLanguageDirection(navigator.language.split("-")[0]);


/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const searchFilter = document.getElementById("search-bar");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedList = document.getElementById("selectedProductsList");
const genRoutine = document.getElementById("generateRoutine");

const resetListBtn = document.getElementById("btn-clear-selected");
const completeResetBtn = document.getElementById("complete-reset");

/* Show initial placeholder until user selects a category */
// Or load currProducts if it exists
productsContainer.innerHTML =
  localStorage.getItem("currProducts") ||
  `<div class="placeholder-message">
    Select a category to view products
  </div>`;

//List of selected items as reference
let products;
loadProducts();
let searchProducts = products;
let categoryProducts = products;
let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
//Chat url & history
const workerURL = "https://lorealchatbot.ava-sonnier2028.workers.dev/";
let messages = JSON.parse(localStorage.getItem("messagesArr")) || [
  {
    role: "system",
    content:
      "You are a dignified and refined product advisor for L'Oréal that helps customers navigate L'Oréal's extensive product catalog and gives tailored recommendations based on their needs & desired products. You politely decline to answer any questions that don't relate to your job.",
  },
];
//reload html where appropriate
selectedList.innerHTML = localStorage.getItem("selectedList") || "";
productsContainer.innerHTML = localStorage.getItem("productsContainer") || "";
searchFilter.value = localStorage.getItem("searchFilter") || "";
categoryFilter.value = localStorage.getItem("categoryFilter") || "null";

if(messages.length > 1){
  repopulateChat(messages);
}

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  products = data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  if (products.length == 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products were found matching your selection. Try again?
      </div>
    `;
    return;
  }
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card ${product.id} ${selectedItems.some((obj) => obj.id === product.id.toString()) ? "selected" : ""}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
       <p class="description">${product.description}</p>
    </div>
  `,
    )
    .join("");
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  if (searchFilter.value.trim() == "") {
    searchProducts = products;
  }

  if (selectedCategory == "all") {
    categoryProducts = products;
    displayProducts(searchProducts);
    return;
  }
  categoryProducts = products.filter(
    (product) => product.category === selectedCategory,
  );

  displayProducts(
    categoryProducts.filter((item) => searchProducts.includes(item)),
  );
});

searchFilter.addEventListener("input", async (e) => {
  const search = e.target.value.toLowerCase().trim();
  if (search === "") {
    searchProducts = products;
    if (categoryFilter.value != "null") {
      displayProducts(categoryProducts);
    }
    return;
  }
  searchProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  });

  if (categoryFilter.value === "null") {
    displayProducts(searchProducts);
    return;
  }
  displayProducts(
    searchProducts.filter((item) => categoryProducts.includes(item)),
  );
});

/* Selection of products */

// function: adding item to selected list
function addToSelected(item) {
  item.classList.add("selected");
  const name = item.querySelector("h3").innerHTML;
  const brand = item.querySelector("p").innerHTML;

  selectedItems.push({
    id: `${item.classList[1]}`,
    name: name,
    brand: brand,
    description: item.querySelector(".description").innerHTML,
    htmlString: `<div class="selected-product ${item.classList[1]}">
    <h4>${brand} — ${name}</h4>
    <i class="fa-solid fa-xmark delete-item"></i>
    </div>`,
  });

  selectedList.innerHTML += selectedItems.at(-1).htmlString;
}

// function: removing item from selected list
function removeFromSelected(item) {
  if (item.classList.contains("product-card")) {
    item.classList.remove("selected"); //card given
  } else {
    //given list item with card on-screen
    const card = productsContainer.querySelector(
      `[class*="${item.classList[1]}"]`,
    );
    if (card) card.classList.remove("selected");
  }
  //Take it out of the array
  const index = selectedItems.findIndex(
    (obj) => obj.id === `${item.classList[1]}`,
  );
  if (index == -1) return; //error
  selectedItems.splice(index, 1);
  //Take it out of the selected list
  selectedList
    .querySelector(`[class="selected-product ${item.classList[1]}"]`)
    .remove();
}

// Select/Deselect via product cards
productsContainer.addEventListener("click", (event) => {
  const child = event.target.closest(".product-card");
  if (!child) return;

  if (child.classList.contains("selected")) {
    removeFromSelected(child);
  } else {
    addToSelected(child);
  }
});

// Deselect via individual item delete button
selectedList.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-item");
  if (!btn) return;
  removeFromSelected(btn.closest(".selected-product"));
});

// Deselect via list clearing button
resetListBtn.addEventListener("click", resetList);
function resetList() {
  selectedItems = [];
  selectedList.innerHTML = "";
  productsContainer.querySelectorAll(".selected").forEach((child) => {
    child.classList.remove("selected");
  });
}
/* Chat form submission handler  */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  chatWindow.appendChild(messageInterpreter("user", `${userInput.value}`));
  messages.push({
    role: "user",
    content: `${userInput.value}`,
  });
  sendGetMsg();
});

// Generate-Routine Handler
genRoutine.addEventListener("click", () => {
  chatWindow.appendChild(
    messageInterpreter("generate", "<i>~~ Generate My Routine ~~</i>"),
  );
  messages.push({
    role: "system",
    content: `The current user desires these products currently: ${JSON.stringify(selectedItems)}. Suggest a routine using these products.`,
  });
  sendGetMsg();
});

//Functin for sending a message to the endpoint & getting the response
async function sendGetMsg() {
  let aiMsg = messageInterpreter("assistant", ". . .  ");
  chatWindow.appendChild(aiMsg);
  chatForm.reset();

  const response = await fetch(workerURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages,
    }),
  });
  const data = await response.json();
  console.log(data);
  let rep;
  if (data.output.length === 2) {
    rep = data.output[1].content[0].text;
  } else {
    rep = data.output[0].content[0].text;
  }
  messages.push({
    role: "assistant",
    content: `${rep}`,
  });

  aiMsg.innerHTML = `${mdInterpreter(rep)}`;
}

//Full page data reset
completeResetBtn.addEventListener("click", fullReset);
function fullReset() {
  resetList();
  //reset the chat history/form
  chatWindow.innerHTML = "";
  messages.splice(1);
  console.log("Reset all data");

  //reset search
  productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div> `;
  searchFilter.value = "";
  categoryFilter.value = "null";

  //reset localStorage
  localStorage.clear();
}

// Save all data before a page reload/tab close
window.addEventListener("pagehide", (e) => {
  e.preventDefault();

  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  localStorage.setItem("selectedList", selectedList.innerHTML);
  localStorage.setItem("productsContainer", productsContainer.innerHTML);

  localStorage.setItem("messagesArr", JSON.stringify(messages));
  localStorage.setItem("searchFilter", searchFilter.value);
  localStorage.setItem("categoryFilter", categoryFilter.value);

  window.location.reload();
});

function mdInterpreter(msg) {
  let startTagB = false;
  let startTagI = false;
  let startTagBI = false;

  //replace bold & italic tags
  while (msg.includes("*")) {
    if (msg.includes("***") && !startTagBI) {
      msg = msg.replace("***", "<b><i>");
      startTagBI = true;
      continue;
    } else if (msg.includes("***")) {
      msg = msg.replace("***", "</i></b>");
      startTagBI = false;
      continue;
    }

    if (msg.includes("**") && !startTagB) {
      msg = msg.replace("**", "<b>");
      startTagB = true;
      continue;
    } else if (msg.includes("**")) {
      msg = msg.replace("**", "</b>");
      startTagB = false;
      continue;
    }

    if (msg.includes("*") && !startTagI) {
      msg = msg.replace("*", "<i>");
      startTagI = true;
    } else if (msg.includes("*")) {
      msg = msg.replace("***", "</i>");
      startTagI = false;
    }
  }

  //Replace header tags (###)
  msg = msg.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    if (level === hashes.length) {
      return `<h${level}>${title}</h${level}><hr/>`;
    }
    return `<h${level}>${title}</h${level}>`;
  });

  //Replace line breaks (---)
  msg = msg.replaceAll("---", "<hr/>");

  //add line breaks
  msg = msg.replaceAll("\n", "<br/>");

  //add real links; uses global flag to replace all with regex match
  msg = msg.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    `<a href="$2" target="_blank">$1</a>`,
  );

  return msg;
}
function messageInterpreter(role, msg) {
  let message = document.createElement("p");
  message.classList.add("msg");
  message.innerHTML = `${msg}`;
  if (role === "user") {
    message.classList.add("user");
  } else if (role === "generate") {
    message.classList.add("user");
    message.classList.add("gen");
  } else {
    message.classList.add("ai");
  }
  return message;
}

function repopulateChat(msgs){
  //skip the system message
  let msg;
  for(i=1; i < msgs.length; i++){
    msg = msgs[i];
    if(msg.role === "assistant"){
      chatWindow.appendChild(
        messageInterpreter("assistant", `${mdInterpreter(msg.content)}`),
      );
    }else if(msg.role === "system"){
      chatWindow.appendChild(messageInterpreter("generate", "<i>~~ Generate My Routine ~~</i>"));
    }else{
      chatWindow.appendChild(messageInterpreter("user", `${msg.content}`));
    }
  }
}
