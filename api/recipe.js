import process from "node:process";
import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = `You are Chef Christian, a warm, world-class chef who turns available ingredients into delicious, achievable recipes. You need not use every ingredient. Suggest only reasonable pantry additions. Respect dietary preferences, time constraints and cuisine. Format in Markdown: H2 title, one-line description, Ingredients bullets with quantities, numbered Instructions, and a short Chef's Tip.`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed." }); }
  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: "AI service is not configured." });
  const { ingredients, options = {} } = req.body || {};
  if (!Array.isArray(ingredients) || ingredients.length < 1 || ingredients.length > 30 || ingredients.some(x => typeof x !== "string" || x.length > 100)) return res.status(400).json({ error: "Provide between 1 and 30 valid ingredients." });
  const allowed = ["diet", "time", "cuisine", "servings"];
  const preferences = allowed.filter(k => options && typeof options[k] === "string").map(k => `${k}: ${options[k].slice(0, 80)}`).join("; ");
  const message = `Ingredients: ${ingredients.join(", ")}. ${preferences}. Suggest one creative recipe.`;
  try {
    const client = new InferenceClient(token);
    const model = process.env.HF_CHAT_MODEL || "Qwen/Qwen2.5-7B-Instruct";
    const result = await client.chatCompletion({ model, messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: message }], max_tokens: 1024, temperature: 0.7 });
    const recipe = result.choices?.[0]?.message?.content;
    if (!recipe) throw new Error("Empty model response");
    return res.status(200).json({ recipe });
  } catch (err) {
    console.error("Recipe provider error:", err?.message || err);
    return res.status(502).json({ error: "The AI recipe service is unavailable. Please try again later or contact the site owner." });
  }
}
