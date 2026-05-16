import { useState, useRef } from "react";
import { ChristianRecipe } from "./ChristianRecipe";
import IngredientsList from "./IngredientsList";
import { streamRecipeFromMistral } from "./ai";

const DIET_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "keto", label: "Keto" },
  { value: "pescatarian", label: "Pescatarian" },
];

const TIME_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "under 15 minutes", label: "< 15 min" },
  { value: "under 30 minutes", label: "< 30 min" },
  { value: "under 1 hour", label: "< 1 hour" },
  { value: "slow-cooked", label: "Slow-cooked" },
];

const CUISINE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "asian", label: "Asian" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "indian", label: "Indian" },
  { value: "american", label: "American" },
  { value: "french", label: "French" },
];

export function Entry() {
  const [ingredients, setIngredients] = useState([]);
  const [recipeShown, setRecipeShown] = useState(false);
  const [recipeAi, setRecipeAi] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  const [diet, setDiet] = useState("any");
  const [time, setTime] = useState("any");
  const [cuisine, setCuisine] = useState("any");

  const recipeRef = useRef(null);

  function submitForm(e) {
    e.preventDefault();
    const trimmedInput = ingredientInput.trim();

    if (!trimmedInput) {
      setError("Please enter an ingredient.");
      return;
    }

    // Avoid duplicates (case-insensitive)
    if (
      ingredients.some(
        (i) => i.toLowerCase() === trimmedInput.toLowerCase()
      )
    ) {
      setError(`"${trimmedInput}" is already in your list.`);
      return;
    }

    setIngredients((prev) => [...prev, trimmedInput]);
    setIngredientInput("");
    setError("");
  }

  function removeIngredient(target) {
    setIngredients((prev) => prev.filter((i) => i !== target));
  }

  function clearAll() {
    setIngredients([]);
    setRecipeShown(false);
    setRecipeAi("");
    setAiError("");
  }

  async function generateRecipe() {
    if (loading) return;

    setLoading(true);
    setStreaming(true);
    setRecipeShown(true);
    setRecipeAi("");
    setAiError("");

    // Smooth scroll to the recipe area
    setTimeout(() => {
      recipeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      await streamRecipeFromMistral(
        ingredients,
        { diet, time, cuisine },
        (delta) => {
          setRecipeAi((prev) => prev + delta);
        }
      );
    } catch (err) {
      console.error("AI Error:", err);
      setAiError(
        err?.message ||
          "Something went wrong generating your recipe. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <h1 className="hero-title">
          What's in your <span className="accent">kitchen</span>?
        </h1>
        <p className="hero-subtitle">
          Add a few ingredients and let Chef Christian craft something delicious.
        </p>
      </section>

      <form onSubmit={submitForm} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. spinach, garlic, tomatoes…"
          aria-label="Add ingredient"
          name="ingredient"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn-primary">
          Add ingredient
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {ingredients.length > 0 && (
        <section className="options-panel" aria-label="Recipe preferences">
          <div className="option-group">
            <label htmlFor="diet">Diet</label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
            >
              {DIET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {TIME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="option-group">
            <label htmlFor="cuisine">Cuisine</label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              {CUISINE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      <IngredientsList
        ingredients={ingredients}
        onRemove={removeIngredient}
        onClear={clearAll}
        toggleRecipeShown={generateRecipe}
        loading={loading}
      />

      <div ref={recipeRef}>
        {recipeShown && (
          <ChristianRecipe
            recipeAi={recipeAi}
            loading={loading && !recipeAi}
            streaming={streaming}
            error={aiError}
          />
        )}
      </div>
    </main>
  );
}
