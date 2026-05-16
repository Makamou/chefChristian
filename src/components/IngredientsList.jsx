export default function IngredientsList({
  ingredients,
  onRemove,
  onClear,
  toggleRecipeShown,
  loading,
}) {
  if (ingredients.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <div className="empty-state-emoji" aria-hidden="true">🍳</div>
        <p>Your ingredient list is empty. Add at least 4 ingredients to get a recipe.</p>
      </section>
    );
  }

  return (
    <section className="ingredients-section">
      <div className="ingredients-header">
        <h2>Ingredients on hand</h2>
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          aria-label="Clear all ingredients"
        >
          Clear all
        </button>
      </div>

      <ul className="ingredients-list" aria-live="polite">
        {ingredients.map((ingredient) => (
          <li key={ingredient} className="ingredient-chip">
            <span>{ingredient}</span>
            <button
              type="button"
              className="chip-remove"
              onClick={() => onRemove(ingredient)}
              aria-label={`Remove ${ingredient}`}
              title={`Remove ${ingredient}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {ingredients.length > 3 ? (
        <div className="get-recipe-container">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>
              Generate a personalized recipe from your ingredients and
              preferences.
            </p>
          </div>
          <button
            className="btn-accent"
            onClick={toggleRecipeShown}
            disabled={loading}
          >
            {loading ? "Cooking…" : "Get a recipe"}
          </button>
        </div>
      ) : (
        <p className="hint">
          Add {4 - ingredients.length} more ingredient
          {4 - ingredients.length > 1 ? "s" : ""} to unlock recipe generation.
        </p>
      )}
    </section>
  );
}
