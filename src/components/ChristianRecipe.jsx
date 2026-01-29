import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { getRecipeFromMistral } from "./ai";

export function ChristianRecipe() {
  const [ingredients, setIngredients] = useState("");
  const [recipeAi, setRecipeAi] = useState("");
  const [dishImage, setDishImage] = useState(""); // optional, if you want to generate images later
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    const ingredientsArr = ingredients.split(",").map((i) => i.trim());

    try {
      const recipe = await getRecipeFromMistral(ingredientsArr);
      setRecipeAi(recipe);
      // setDishImage(""); // You can update this if you have an image generator later
    } catch (err) {
      setRecipeAi("Sorry, we couldn't generate a recipe at this time.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-generator-container">
      <h2>Chef Christian Recipe Generator</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients, separated by commas"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Get Recipe"}
        </button>
      </form>

      <section className="recipe-output">
        <ChristianRecipeDisplay
          loading={loading}
          recipeAi={recipeAi}
          dishImage={dishImage}
        />
      </section>
    </div>
  );
}

// Separate component for displaying recipe (your original code)
function ChristianRecipeDisplay({ loading, recipeAi, dishImage }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Generating recipe...</p>
      </div>
    );
  }

  return (
    <section>
      <h2>Chef Christian Recommends:</h2>
      <section className="recipe-container" aria-live="polite">
        {dishImage && (
          <div className="dish-image-container">
            <img
              src={dishImage}
              alt="Generated dish"
              style={{
                maxWidth: "100%",
                borderRadius: "12px",
                marginBottom: "1rem",
              }}
            />
          </div>
        )}
        <ReactMarkdown>{recipeAi}</ReactMarkdown>
      </section>
    </section>
  );
}
