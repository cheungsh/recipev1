/* Declare api key value */
const apiKey = "72aaf2e41d404b3ca40632f08d48031f";

/* Declare Health Score silder and value */
const healthSlider = document.getElementById("healthScore");
const healthValue = document.getElementById("healthScoreValue");

/* Ingredient list */
const ingredients = [
  { name: "Apple", emoji: "🍎" },
  { name: "Avocado", emoji: "🥑" },
  { name: "Bacon", emoji: "🥓" },
  { name: "Bagel", emoji: "🥯" },
  { name: "Banana", emoji: "🍌" },
  { name: "Beef", emoji: "🥩" },
  { name: "Bread", emoji: "🍞" },
  { name: "Carrot", emoji: "🥕" },
  { name: "Cabbage", emoji: "🥬" },
  { name: "Cheese", emoji: "🧀" },
  { name: "Cherry", emoji: "🍒" },
  { name: "Chili", emoji: "🌶️" },
  { name: "Clam", emoji: "🦪" },
  { name: "Coffee", emoji: "☕" },
  { name: "Coconut", emoji: "🥥" },
  { name: "Corn", emoji: "🌽" },
  { name: "Cucumber", emoji: "🥒" },
  { name: "Egg", emoji: "🥚" },
  { name: "Fish", emoji: "🐟" },
  { name: "Garlic", emoji: "🧄" },
  { name: "Milk", emoji: "🥛" },
  { name: "Mushroom", emoji: "🍄" },
  { name: "Nuts", emoji: "🥜" },
  { name: "Orange", emoji: "🍊" },
  { name: "Pepper", emoji: "🫑" },
  { name: "Pasta", emoji: "🍝" },
  { name: "Pineapple", emoji: "🍍" },
  { name: "Potato", emoji: "🥔" },
  { name: "Pumpkin", emoji: "🎃" },
  { name: "Rice", emoji: "🍚" },
  { name: "Strawberry", emoji: "🍓" },
  { name: "Tea", emoji: "🍵" },
  { name: "Tortilla", emoji: "🌮" }
];

/* Create Ingredient buttons */
function createIngredientsButtons() {
  const ingredientButtons = document.getElementById("ingredient-buttons");
  //Loop create button for each ingredient
  ingredients.forEach((ingredient) => {
    const button = document.createElement("button");
    button.classList.add("ingredient-btn");
    button.dataset.ingredient = ingredient.name;
    button.innerHTML = `${ingredient.emoji} ${ingredient.name}`;
    button.addEventListener("click", () => button.classList.toggle("selected"));
    ingredientButtons.appendChild(button);
  });
}
createIngredientsButtons();

/* Diet Preferences list */
const diets = [
  { name: "Dairy Free", emoji: "🧀" },
  { name: "Gluten Free", emoji: "🌾" },
  { name: "Ketogenic", emoji: "🥓" },
  { name: "Lacto-Vegetarian", emoji: "🥛" },
  { name: "Low FODMAP", emoji: "🌽" },
  { name: "Ovo-Vegetarian", emoji: "🥚" },
  { name: "Paleo", emoji: "🦴" },
  { name: "Pescetarian", emoji: "🐟" },
  { name: "Primal", emoji: "🥩" },
  { name: "Vegan", emoji: "🥦" },
  { name: "Vegetarian", emoji: "🥗" },
  { name: "Whole30", emoji: "🍎" }
];

/* Create Diet Preferences buttons */
function createDietButtons() {
  const dietButtons = document.getElementById("diet-buttons");
  //Loop create button for each diet preferences
  diets.forEach((diet) => {
    const button = document.createElement("button");
    button.classList.add("diet-btn");
    button.dataset.diet = diet.name;
    button.innerHTML = `${diet.emoji} ${diet.name}`;
    button.addEventListener("click", () => button.classList.toggle("selected"));
    dietButtons.appendChild(button);
  });
}
createDietButtons();

/* Change Health Score slider's color based on value */
function updateSliderColor() {
  const value = parseInt(healthSlider.value, 10);
  //65 feels like a decent health score nowadays so I'm hoping they would consider food above 65
  let color = "#ffd16a";
  let emojiImg = "img/MidEmoji.png"; 

  //Less than 40 is red, 40-65 is yellow, above 70 is green
  if (value < 40) {
    color = "#ad031a";
    emojiImg = "img/LowEmoji.png";
  } else if (value <= 65) {
    color = "#ffd16a";
    emojiImg = "img/MidEmoji.png";
  } else {
    color = "#87ad38";
    emojiImg = "img/HighEmoji.png";
  }
  /* Ref: https://www.w3schools.com/jsref/met_cssstyle_setproperty.asp */
  healthSlider.style.setProperty("--slider-color", color);
  healthValue.textContent = `${value}`;
  healthSlider.style.setProperty("--thumb-image",`url(${emojiImg})`);
}
/* Sync slider color based on how much user slides */
healthSlider.addEventListener("input", updateSliderColor);
updateSliderColor();

/* Fetch Recipes */
async function fetchRecipes() {
  //Check selected ingredients
  const selectedIngredients = Array.from(
    document.querySelectorAll(".ingredient-btn.selected")
  ).map((btn) => btn.dataset.ingredient);
  //Check selected diets
  const selectedDiets = Array.from(
    document.querySelectorAll(".diet-btn.selected")
  ).map((btn) => btn.dataset.diet);
  //Check health score value
  const healthScoreVal = healthSlider.value;

  //Ask user to select at least one ingredient in order to fetch recipes
  if (selectedIngredients.length === 0) {
    /* Ref: https://www.w3schools.com/howto/howto_js_alert.asp */
    alert("Please select at least one ingredient");
    return;
  }

  /* Fetch Recipes from Spooncular API that aligns with user input */
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&includeIngredients=${selectedIngredients.join(",")}&number=10&addRecipeInformation=true&fillIngredients=true${selectedDiets.length ? `&diet=${selectedDiets[0]}` : ""}`;

  /* Fetch Recipes */
  //Fetch recipes from API and display them
  try {
    const fetchRecipe = await fetch(url);
    const data = await fetchRecipe.json();

    //Check recipe's health score has to be equal or above health score value
    const filteredRecipes = data.results.filter(recipe => recipe.healthScore >= healthScoreVal);

    //If there's no matching recipes, display message
    if (filteredRecipes.length === 0) {
      alert("No recipes found matches your selection. Please try different options.");
      return;
    } else { //Display recipes
      displayRecipes(filteredRecipes);
    }
  } catch (err) { //Print error message
      alert("Error. Please try again.");
      return;
  }
}

/* Display Recipes */
function displayRecipes(recipes) {
  //Refresh recipes
  const recipesDiv = document.getElementById("recipes");
  recipesDiv.innerHTML = "";

  //Indication that recipe card can be flipped
  const instruction = document.createElement("p");
  instruction.classList.add("instruction-text");
  instruction.textContent = "Click to flip the recipe card!";
  recipesDiv.appendChild(instruction);

  //Loop and create recipe flip cards
  recipes.forEach((recipe) => {
    const usedIngredients = recipe.usedIngredients?.map(i => i.name).join(", ") ?? "None";
    const missingIngredients = recipe.missedIngredients?.map(i => i.name).join(", ") ?? "None";

    const div = document.createElement("div");
    div.classList.add("recipe");

    /* Ref: https://codepen.io/pranav-raut/pen/QWzWGwQ */
    div.innerHTML = `
      <div class="recipe-inner">
        <!-- Front Side -->
        <div class="recipe-front">
          <img src="${recipe.image}" alt="${recipe.title}">
          <h4>${recipe.title}</h4>
          <button class="view-recipe-btn" onclick="window.location.href='recipe.html?id=${recipe.id}'">View Recipe</button>
          <br>
        </div>

        <!-- Back Side -->
        <div class="recipe-back">
          <h4>Ingredients</h4>
          <p><strong>Selected Ingredient:</strong> ${usedIngredients}</p>
          <p><strong>Missing Ingredient:</strong> ${missingIngredients}</p>
          <div class="tags-row">
            <span class="tag">Health: ${recipe.healthScore || "N/A"}</span>
            ${recipe.diets.map((d) => `<span class="tag">${d}</span>`).join("")}
          </div>
          <br>
        </div>
      </div>
    `;

    //Flip on click
    div.addEventListener("click", () => {
      div.classList.toggle("flipped");
    });

    //Add recipes to page
    recipesDiv.appendChild(div);
  });
}

/* Fetch recipes after Get Recipe button is clicked */
document.getElementById("get-recipes-btn").addEventListener("click", fetchRecipes);
