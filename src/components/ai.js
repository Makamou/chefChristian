import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = `You are Chef Christian, a warm, world-class chef who loves turning whatever ingredients a home cook has into a delicious, achievable recipe.

When responding:
- You don't need to use every ingredient the user lists.
- You may suggest a few extra common pantry items, but keep additions reasonable.
- Always respect the user's dietary preference, time constraint, and cuisine if provided.
- Structure the recipe in clean Markdown with:
  - A creative dish title as an H2
  - A one-line description
  - "Ingredients" section as a bullet list (with quantities)
  - "Instructions" section as numbered steps
  - A short "Chef's Tip" at the end
- Keep the tone friendly and encouraging.`;

// Models reliably available across the HF Inference Providers network
// (Together, Fireworks, Cerebras, Nebius, etc.). We try them in order
// until one responds successfully. The SDK will auto-route to whichever
// provider hosts the model — your token needs the
// "Make calls to Inference Providers" permission.
const MODELS = [
  "meta-llama/Llama-3.1-8B-Instruct",
  "meta-llama/Llama-3.3-70B-Instruct",
  "Qwen/Qwen2.5-7B-Instruct",
  "mistralai/Mistral-Nemo-Instruct-2407",
];

const token = import.meta.env.VITE_HF_ACCESS_TOKEN;
const hf = new InferenceClient(token);

function buildUserMessage(ingredientsArr, options = {}) {
  const ingredientsString = ingredientsArr.join(", ");
  const parts = [`I have the following ingredients on hand: ${ingredientsString}.`];

  if (options.diet && options.diet !== "any") {
    parts.push(`Dietary preference: ${options.diet}.`);
  }
  if (options.time && options.time !== "any") {
    parts.push(`Time available: ${options.time}.`);
  }
  if (options.cuisine && options.cuisine !== "any") {
    parts.push(`Preferred cuisine: ${options.cuisine}.`);
  }
  if (options.servings) {
    parts.push(`Servings: ${options.servings}.`);
  }

  parts.push("Please suggest one creative, well-formatted recipe I can make.");
  return parts.join(" ");
}

/**
 * Non-streaming recipe generation (kept as a fallback). Tries each model
 * in MODELS until one returns successfully.
 */
export async function getRecipeFromMistral(ingredientsArr, options = {}) {
  if (!token) {
    throw new Error(
      "Missing VITE_HF_ACCESS_TOKEN. Add it to a .env file at the project root and restart the dev server."
    );
  }

  const userMessage = buildUserMessage(ingredientsArr, options);
  let lastErr;

  for (const model of MODELS) {
    try {
      const response = await hf.chatCompletion({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.8,
      });
      return response.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      console.warn(`Model "${model}" failed:`, err?.message || err);
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("No model returned a response.");
}

/**
 * Streaming recipe generation. Calls `onChunk(text)` every time new text arrives.
 * Returns the final, fully concatenated recipe string.
 */
export async function streamRecipeFromMistral(
  ingredientsArr,
  options = {},
  onChunk = () => {}
) {
  if (!token) {
    throw new Error(
      "Missing VITE_HF_ACCESS_TOKEN. Add it to a .env file at the project root and restart the dev server."
    );
  }

  const userMessage = buildUserMessage(ingredientsArr, options);
  let lastErr;

  for (const model of MODELS) {
    let full = "";
    try {
      const stream = hf.chatCompletionStream({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.8,
      });

      for await (const chunk of stream) {
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      }
      if (full) return full;
    } catch (err) {
      console.warn(`Streaming model "${model}" failed:`, err?.message || err);
      lastErr = err;
    }
  }

  // Final fallback: try the non-streaming path (also iterates MODELS).
  try {
    const result = await getRecipeFromMistral(ingredientsArr, options);
    onChunk(result);
    return result;
  } catch (err) {
    throw lastErr ?? err;
  }
}
