
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const explainMath = async (expression: string, result: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain this mathematical expression and its result in a concise, scientific manner: Expression: ${expression}, Result: ${result}. Include properties of the functions used if relevant.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    });

    return response.text || "Could not generate an explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant is currently unavailable. Please check your connection.";
  }
};

export const solveWordProblem = async (problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are a high-level mathematical assistant. Solve this word problem step-by-step: ${problem}`,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || "Failed to solve the problem.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error solving the problem.";
  }
};
