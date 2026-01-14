import { useState } from "react";
import { ChristianRecipe } from "./ChristianRecipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromMistral } from "./ai";
import { useRef } from "react";
import { useEffect } from "react";

export function Entry() {
  let [ingredients, setIngredients] = useState([]);
  const [recipeShown, setRecipeShown] = useState(false);
  const [recipeAi, setRecipeAi] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingredientInput, setIngredientInput] = useState(""); // controlled input
  const [error, setError] = useState("");
  const recipeSection = useRef(null);
  // eslint-disable-next-line react-hooks/refs
  console.log(recipeSection);

  useEffect(() => {
    if (recipeAi && recipeSection.current) {
      recipeSection.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [recipeAi]);

  function submitForm(e) {
    e.preventDefault();

    const trimmedInput = ingredientInput.trim();

    if (!trimmedInput) {
      setError("Please enter an ingredient.");
      return; // stop here until user enters value
    }

    setIngredients((prev) => [...prev, trimmedInput]);
    setIngredientInput(""); // clear input
    setError(""); // clear error
  }

  async function toggleRecipeShown() {
    if (loading) return;

    setLoading(true);
    setRecipeShown(!recipeShown);
    const result = await getRecipeFromMistral(ingredients);
    setRecipeAi(result);
    setLoading(false);
  }

  return (
    <>
      <main className="container">
        <form onSubmit={submitForm} className="add-ingredient-form">
          <input
            type="text"
            placeholder="e.g. spinach"
            aria-label="Add ingredient"
            name="ingredient"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <button type="submit">Add ingredient</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <IngredientsList
          ingredients={ingredients}
          toggleRecipeShown={toggleRecipeShown}
          recipeSectionRef={recipeSection}
        />

        {recipeShown && (
          <ChristianRecipe recipeAi={recipeAi} loading={loading} />
        )}
      </main>
    </>
  );
}
