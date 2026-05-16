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
    const looksLikeAuth =
      /invalid username|password|401|403|unauthor/i.test(error);
    return (
      <section className="recipe-section">
        <div className="error-card" role="alert">
          <h3>Oops — couldn't reach the kitchen</h3>
          <p>{error}</p>
          {looksLikeAuth ? (
            <>
              <p className="error-hint">
                Your Hugging Face token was rejected. A few things to check:
              </p>
              <ul className="error-hint">
                <li>
                  The token must be a <strong>Read</strong> token (or fine-grained
                  with <em>Make calls to Inference Providers</em> enabled).
                </li>
                <li>
                  Regenerate it at{" "}
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                  >
                    huggingface.co/settings/tokens
                  </a>
                  , paste it into <code>.env</code>, then restart{" "}
                  <code>npm run dev</code>.
                </li>
                <li>
                  Make sure the file is named exactly <code>.env</code> (not{" "}
                  <code>.env.example</code> or <code>.env.txt</code>).
                </li>
              </ul>
            </>
          ) : (
            <p className="error-hint">
              Make sure you have a <code>.env</code> file with{" "}
              <code>VITE_HF_ACCESS_TOKEN</code> set, and that you restarted{" "}
              <code>npm run dev</code> after creating it.
            </p>
          )}
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
