export async function getRecipeFromMistral(ingredientsArr) {
  try {
    const response = await fetch("/api/getRecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      console.error("Error fetching recipe:", response.statusText);
      return "Sorry, the recipe could not be generated.";
    }

    const data = await response.json();
    return data.recipe;
  } catch (err) {
    console.error("Error calling API:", err);
    return "Sorry, there was an error generating the recipe.";
  }
}
