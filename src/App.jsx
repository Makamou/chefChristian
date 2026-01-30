import { useState } from "react";
import { ChristianRecipe } from "./components/ChristianRecipe";

export function App() {
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main>
      {/* your form + button logic */}
      <ChristianRecipe recipeAi={recipe} loading={loading} />
    </main>
  );
}
