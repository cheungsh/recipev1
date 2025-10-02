/* Declare api key value */
const apiKey = "72aaf2e41d404b3ca40632f08d48031f";

/* Get recipe ID from URL */
/* Ref: https://www.w3schools.com/jsref/prop_loc_search.asp */
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');
const recipeDiv = document.getElementById("recipe-detail");

/* Fetch Recipe Detail */
async function fetchRecipeDetail() {
  //If recipe ID doesn't exist/dull then return
  if (!recipeId) {
    recipeDiv.innerHTML = "<p>No recipe selected.</p>";
    return;
  }
  try {
    //Fetch recipe detail from API
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const res = await fetch(url);
    const recipe = await res.json();
    if (!recipeId) {
      alert("Sorry, no recipe found");
      return;
    }else{
      displayRecipeDetail(recipe);
    }
  } catch (err) {//Print error message
      alert("Error. Please try again.");
      return;
  }
}

/* Display Recipe Details */
function displayRecipeDetail(recipe) {
  //Diet tags
  const dietTags = recipe.diets.map(d => `<span class="tag">${d}</span>`).join('');

  //Ingredients
  const ingredientList = recipe.extendedIngredients
    .map(i => `<li>${i.original}</li>`)
    .join('');

  //Instructions
  let instructions = "<p>No instructions available.</p>";
  if (recipe.analyzedInstructions.length > 0) {
    instructions = recipe.analyzedInstructions[0].steps
      .map(step => `<li>${step.step}</li>`)
      .join('');
    instructions = `<ol>${instructions}</ol>`;
  }

  //Recipe detail and structure
  recipeDiv.innerHTML = `
    <h1>${recipe.title}</h1>
    <img class="recipe-image" src="${recipe.image}" alt="${recipe.title}">
    <h3>Ingredients:</h3>
    <ul>${ingredientList}</ul>
    <h3>Instructions:</h3>
    ${instructions}
  `;
}

fetchRecipeDetail();
