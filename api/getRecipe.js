import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ingredients } = req.body;
  const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe.
You don't need to use every ingredient they mention.
The recipe can include additional ingredients, but try not to include too many.
Format your response in markdown.
`;

  const randomHint = [
    "Make it spicy",
    "Add a twist with vegetables",
    "Use an unusual herb",
    "Make it quick and easy",
    "Turn it into a casserole",
  ];
  const hint = randomHint[Math.floor(Math.random() * randomHint.length)];

  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-Coder-7B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredients.join(", ")}. ${hint}. Please give me a creative recipe.`,
        },
      ],
      max_new_tokens: 1024,
      temperature: 0.8,
    });

    res.status(200).json({ recipe: response.choices[0].message.content });
  } catch (err) {
    console.error("HF Error:", err);
    res.status(500).json({ error: "Could not generate recipe." });
  }
}
