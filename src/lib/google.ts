import { GoogleGenAI } from "@google/genai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY 

const ai = new GoogleGenAI({apiKey: API_KEY});

export default async function getJSON ({schema, count}: { schema: string; count: number }): Promise<string | undefined> {

  const prompt = `Generate an array of ${count} JSON objects.
        Each object should represent a realistic dataset based on the following high-level description: "${schema}".
        Infer a suitable JSON schema, including appropriate field names and data types (e.g., string, number, boolean, email, date, url, uuid, etc.).
        For each field, generate realistic dummy data that fits the inferred type and context.
        For example, if you infer a 'name' field, provide realistic names. If an 'age' field, provide realistic numbers.
        If an array is inferred, include 1-3 relevant items.
        Ensure the output is *only* the JSON array, with no additional text, markdown wrappers (like \`\`\`json), or formatting outside the JSON itself.`;

  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
  return response.text;
}
