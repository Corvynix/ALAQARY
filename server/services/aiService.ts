import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "../storage";

// Initialize Google AI with API key
const API_KEY = process.env.GOOGLE_AI_API_KEY || "AIzaSyBlPYnSImmeWudAITAQZKsmh6XPGoLTKNw";
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface AIBrainRequest {
  question: string;
  userRole?: string;
  userId?: string;
  context?: {
    city?: string;
    budget?: string;
    propertyType?: string;
  };
}

export interface AIBrainResponse {
  response: string;
  sources?: string[];
  confidence?: number;
}

/**
 * Generate AI-powered response for real estate questions
 */
export async function generateAIResponse(
  request: AIBrainRequest
): Promise<AIBrainResponse> {
  try {
    // Build context from database if available
    let contextData = "";
    
    if (request.context?.city) {
      const marketTrends = await storage.getAllMarketTrends();
      const cityTrend = marketTrends.find(
        (t) => t.city.toLowerCase() === request.context!.city!.toLowerCase()
      );
      if (cityTrend) {
        contextData += `\nMarket Data for ${request.context.city}:\n`;
        contextData += `- Average Price: ${cityTrend.avgPrice || "N/A"}\n`;
        contextData += `- Demand Level: ${cityTrend.demandLevel || "N/A"}\n`;
        contextData += `- Change Percent: ${cityTrend.changePercent || "N/A"}%\n`;
        if (cityTrend.notes) {
          contextData += `- Notes: ${cityTrend.notes}\n`;
        }
      }
    }

    // Get property data if property type is specified
    if (request.context?.propertyType) {
      const properties = await storage.getAllProperties();
      const relevantProperties = properties.filter(
        (p) => p.propertyType.toLowerCase().includes(request.context!.propertyType!.toLowerCase())
      );
      if (relevantProperties.length > 0) {
        contextData += `\nAvailable Properties (${relevantProperties.length} found):\n`;
        relevantProperties.slice(0, 5).forEach((p) => {
          contextData += `- ${p.title}: ${p.price} EGP, ${p.city}\n`;
        });
      }
    }

    // Build the prompt
    const roleContext = request.userRole 
      ? `You are an AI assistant helping a ${request.userRole} in the real estate market.`
      : "You are an AI assistant helping users in the real estate market.";

    const prompt = `${roleContext}

${contextData ? `Context Information:\n${contextData}\n` : ""}

User Question: ${request.question}

Please provide a helpful, accurate, and professional response in ${request.userRole === 'client' ? 'Arabic' : 'both Arabic and English'}. 
Focus on:
1. Providing actionable advice
2. Using the context data when relevant
3. Being specific about market conditions
4. Offering practical recommendations

Response:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      response: text,
      confidence: 0.85, // Gemini doesn't provide confidence scores, using default
    };
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    
    // Fallback response
    return {
      response: request.userRole === 'client' 
        ? "عذراً، حدث خطأ في معالجة سؤالك. يرجى المحاولة مرة أخرى أو الاتصال بالدعم."
        : "Sorry, an error occurred while processing your question. Please try again or contact support.",
      confidence: 0,
    };
  }
}

/**
 * Generate AI response with market intelligence context
 */
export async function generateMarketIntelligenceResponse(
  question: string,
  city?: string
): Promise<AIBrainResponse> {
  const marketTrends = await storage.getAllMarketTrends();
  const properties = await storage.getAllProperties();
  
  let marketContext = "Market Overview:\n";
  
  if (city) {
    const cityTrend = marketTrends.find(
      (t) => t.city.toLowerCase() === city.toLowerCase()
    );
    if (cityTrend) {
      marketContext += `- City: ${city}\n`;
      marketContext += `- Average Price: ${cityTrend.avgPrice || "N/A"}\n`;
      marketContext += `- Demand: ${cityTrend.demandLevel || "N/A"}\n`;
      marketContext += `- Supply: ${cityTrend.supply || "N/A"}\n`;
    }
  } else {
    marketContext += `- Total Market Trends Tracked: ${marketTrends.length}\n`;
    marketContext += `- Total Properties Available: ${properties.length}\n`;
  }

  const prompt = `You are a real estate market intelligence AI. 

${marketContext}

Question: ${question}

Provide a detailed, data-driven response about the real estate market.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      response: text,
      confidence: 0.9,
    };
  } catch (error: any) {
    console.error("Error generating market intelligence response:", error);
    return {
      response: "Unable to generate market intelligence at this time. Please try again later.",
      confidence: 0,
    };
  }
}

