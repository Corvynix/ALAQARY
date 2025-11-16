import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  propertyContext?: any
): Promise<{ response: string; purchaseProbability: number }> {
  try {
    const systemPrompt = `You are an expert real estate AI assistant helping buyers find their perfect property.
Your goal is to understand their needs, address objections, and guide them toward a purchase decision.
Be warm, professional, and consultative. Ask clarifying questions to understand their preferences.
${propertyContext ? `Context: The buyer is interested in a ${propertyContext.type} property in ${propertyContext.city} priced at ${propertyContext.price}.` : ''}
Respond in a helpful, conversational tone. Keep responses concise (2-3 sentences max).`;

    const conversationHistory = messages.map(m => m.content).join('\n');
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nRespond to the last message:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const aiResponse = response.text || "I'm here to help you find the perfect property. What are you looking for?";
    
    // Calculate purchase probability based on conversation sentiment
    const probabilityPrompt = `Based on this conversation, estimate the purchase probability (0-100) as a single number:
${conversationHistory}
Respond with ONLY a number between 0 and 100.`;

    const probResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: probabilityPrompt,
    });

    let purchaseProbability = 30; // Default
    try {
      const probText = probResponse.text?.trim() || '30';
      const parsed = parseInt(probText.match(/\d+/)?.[0] || '30');
      purchaseProbability = Math.min(100, Math.max(0, parsed));
    } catch {
      // Keep default
    }

    return {
      response: aiResponse,
      purchaseProbability,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      response: "I'm here to help you find the perfect property. What are you looking for?",
      purchaseProbability: 20,
    };
  }
}

export async function analyzeObjection(objection: string): Promise<string> {
  try {
    const prompt = `As a real estate expert, provide a brief, persuasive response to this buyer objection:
"${objection}"
Keep your response concise (2-3 sentences) and focus on addressing the concern positively.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I understand your concern. Let me help you see this from a different perspective.";
  } catch (error) {
    console.error('Objection Analysis Error:', error);
    return "I understand your concern. Let me provide more information to help with your decision.";
  }
}
