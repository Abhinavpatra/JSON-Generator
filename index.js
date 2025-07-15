import { GoogleGenAI } from "@google/genai";

require('dotenv').config(); 
const API_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: "Explain how AI works in a few words",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
}

await main();
