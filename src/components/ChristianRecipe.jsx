import ReactMarkdown from "react-markdown";

export function ChristianRecipe(props) {
  if (props.loading) {
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
        {/* Display the image if available */}
        {props.dishImage && (
          <div className="dish-image-container">
            <img
              src={props.dishImage}
              alt="Generated dish"
              style={{
                maxWidth: "100%",
                borderRadius: "12px",
                marginBottom: "1rem",
              }}
            />
          </div>
        )}
        <ReactMarkdown>{props.recipeAi}</ReactMarkdown>
      </section>
    </section>
  );
}
