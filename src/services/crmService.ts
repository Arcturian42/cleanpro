import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prospect } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function sourceProspectsWithAI(currentProspects: Prospect[], rejectedFeedback: string[]): Promise<Partial<Prospect>> {
  const prompt = `
    You are an expert B2B Sales Prospecting AI for a high-end commercial cleaning company.
    Current business focus: Office cleaning, Construction site cleanup, Luxury coproprieties.
    
    Current Prospects: ${JSON.stringify(currentProspects.map(p => ({ name: p.companyName, sector: p.sector })))}
    Previous feedback for rejected prospects (DO NOT include similar ones): ${rejectedFeedback.join(", ")}
    
    Task: Suggest ONE high-value prospect in the Paris area.
    Format your response as a JSON object with:
    {
      "companyName": "string",
      "sector": "string",
      "contactName": "string",
      "email": "string",
      "phone": "string",
      "score": number (0-100),
      "notes": "string explaining why this is a good lead"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Sourcing Error:", error);
    // Fallback mock
    return {
      companyName: "Skyline Tower Management",
      sector: "Immobilier de Luxe",
      contactName: "Jean Dupont",
      email: "contact@skytower.fr",
      phone: "01 88 77 66 55",
      score: 88,
      notes: "Gestionnaire de 3 nouvelles tours de bureaux à La Défense."
    };
  }
}
