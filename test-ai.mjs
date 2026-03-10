import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

async function test() {
  try {
    // Tentando o modelo solicitado pelo usuário (pode ser 2.0 ou 1.5 dependendo da disponibilidade da API)
    const modelName = "gemini-2.5-flash"; 
    console.log(`Testando modelo: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = "Teste rápido: Responda apenas com a palavra 'OK'.";
    
    console.log("Enviando prompt ao Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Resposta da IA:", text);
  } catch (error) {
    console.error("ERRO NA API:", error.message);
    if (error.status === 404) {
        console.log("DICA: O modelo pode estar com nome diferente. Tentando 'gemini-1.5-flash'...");
    }
  }
}

test();
