/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedList = document.getElementById("selectedProductsList");

const resetListBtn = document.getElementById("btn-clear-selected");
const completeResetBtn = document.getElementById("complete-reset");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

//List of selected items as reference
let selectedItems = [ ];


/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
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
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);

});

/* Selection of products */

// function: adding item to selected list
function addToSelected(item){
  item.classList.add("selected");
  selectedItems.push({
    id: `${item.classList[1]}`,
    htmlString: `<div class="selected-product ${item.classList[1]}">
    <h4>${item.querySelector("p").innerHTML} — ${item.querySelector("h3").innerHTML}</h4>
    <i class="fa-solid fa-xmark delete-item"></i>
    </div>`,
  });
  selectedList.innerHTML += selectedItems.at(-1).htmlString;
}

// function: removing item from selected list
function removeFromSelected(item){
  if(item.classList.contains('product-card')){
    item.classList.remove("selected"); //card given
  }else{ //given list item with card on-screen
    const card = productsContainer.querySelector(`[class*="${item.classList[1]}"]`);
    if(card) card.classList.remove("selected");
  }
  //Take it out of the array
  const index = selectedItems.findIndex(
    (obj) => obj.id === `${item.classList[1]}`,
  );
  if(index == -1) return; //error
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
selectedList.addEventListener('click', (event)=>{
  const btn = event.target.closest(".delete-item");
  if (!btn) return;
  removeFromSelected(btn.closest(".selected-product"));
})

// Deselect via list clearing button
resetListBtn.addEventListener('click', resetList);
function resetList(){
  selectedItems = [];
  selectedList.innerHTML = "";
  productsContainer.querySelectorAll(".selected").forEach((child) => {
    child.classList.remove("selected"); });
}
/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

completeResetBtn.addEventListener('click', fullReset);
function fullReset(){
  resetList();
  //reset the chat history/form
}
