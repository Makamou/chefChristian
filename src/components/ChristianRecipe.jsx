import ReactMarkdown from "react-markdown";

export function ChristianRecipe({ recipeAi, loading, streaming, error }) {
  if (loading) {
    return (
      <section className="recipe-section">
        <div className="loading-container">
          <div className="spinner" aria-hidden="true"></div>
          <p className="loading-text">Chef Christian is cooking something up…</p>
          <div className="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recipe-section">
        <div className="error-card" role="alert">
          <h3>Oops — couldn't reach the kitchen</h3>
          <p>{error}</p>
          <p className="error-hint">Please try again in a moment. If this continues, the site owner should check the serverless function logs and Hugging Face model availability.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recipe-section">
      <div className="recipe-header">
        <h2>
          <span className="chef-badge" aria-hidden="true">👨‍🍳</span>
          Chef Christian recommends
        </h2>
        {streaming && (
          <span className="streaming-indicator" aria-live="polite">
            <span className="pulse-dot" />
            streaming
          </span>
        )}
      </div>

      <article className="recipe-container" aria-live="polite">
        <ReactMarkdown>{recipeAi}</ReactMarkdown>
        {streaming && <span className="typing-cursor" aria-hidden="true">▍</span>}
      </article>
    </section>
  );
}
