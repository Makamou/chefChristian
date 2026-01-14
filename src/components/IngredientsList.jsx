export default function IngredientsList(props) {
  const ingredientListItems = props.ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  return (
    <>
      {ingredientListItems.length > 0 && (
        <section>
          <h2>Ingredients on hand:</h2>
          <ul className="ingredients-list" aria-live="polite">
            {ingredientListItems}
          </ul>
          {ingredientListItems.length > 3 && (
            <div className="get-recipe-container">
              <div ref={props.recipeSectionRef}>
                <h3>Ready for a recipe?</h3>
                <p>Generate a recipe from your list of ingredients.</p>
              </div>
              {/* eslint-disable-next-line react-hooks/refs */}
              <button onClick={props.toggleRecipeShown}>Get a recipe</button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
