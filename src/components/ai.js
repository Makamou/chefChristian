import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients.
You don't need to use every ingredient they mention.
The recipe can include additional ingredients, but try not to include too many.
 Format your response in markdown to make it easier to render to a web page
`;

const hf = new InferenceClient(import.meta.env.VITE_HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

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
          content: `I have ${ingredientsString}. ${hint}. Please give me a creative recipe.`,
        },
      ],
      max_new_tokens: 1024, // ✅ FIXED
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("HF Error:", err);
    throw err;
  }
}
