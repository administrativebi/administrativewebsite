import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Ler o arquivo de conhecimento (Cérebro)
    const knowledgePath = path.join(process.cwd(), "md/ai_knowledge.md");
    const knowledgeBase = fs.readFileSync(knowledgePath, "utf8");

    // 2. Configurar o Modelo
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Você é o especialista técnico da empresa Administrative. 
      Baseie suas respostas estritamente no CONHECIMENTO BASE abaixo.
      
      CONHECIMENTO BASE:
      ${knowledgeBase}
      
      PERGUNTA DO USUÁRIO:
      ${message}
      
      Responda de forma curta, impactante e técnica. Se for um problema, gere uma Hipótese de Intervenção.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Erro ao processar consulta de IA" }, { status: 500 });
  }
}
