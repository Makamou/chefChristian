// All Hugging Face credentials stay on the server.
export async function getRecipeFromMistral(ingredientsArr, options = {}) {
  return streamRecipeFromMistral(ingredientsArr, options);
}

export async function streamRecipeFromMistral(ingredientsArr, options = {}, onChunk = () => {}) {
  const response = await fetch("/api/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients: ingredientsArr, options }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Recipe generation is temporarily unavailable.");
  if (!payload.recipe) throw new Error("The AI returned an empty recipe. Please try again.");
  onChunk(payload.recipe);
  return payload.recipe;
}
