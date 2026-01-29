import { useState } from "react";
import { ChristianRecipe } from "./ChristianRecipe";

export function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipeAi, setRecipeAi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getRecipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipeAi(data.recipe);
    } catch (err) {
      console.error(err);
      setRecipeAi("Failed to generate recipe.");
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ingredients comma-separated"
        onChange={(e) => setIngredients(e.target.value.split(","))}
      />
      <button onClick={handleSubmit}>Get Recipe</button>

      <ChristianRecipe loading={loading} recipeAi={recipeAi} />
    </div>
  );
}
