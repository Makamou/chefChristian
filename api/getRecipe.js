import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { ingredients } = req.body;
  const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients...
`;

  const hint = ["Make it spicy", "Add a twist with vegetables" /* etc */][
    Math.floor(Math.random() * 5)
  ];

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
