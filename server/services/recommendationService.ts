import { storage } from "../storage";
import type { Lead, Property, Agent, UserBehavior, Transaction } from "@shared/schema";

export interface PropertyRecommendation {
  property: Property;
  matchScore: number;
  reasons: string[];
  estimatedInterest: number; // 0-100
}

export interface AgentRecommendation {
  agent: Agent;
  matchScore: number;
  reasons: string[];
  successRate: number;
  bestScript: string;
  bestPrice: number;
}

export interface ClientQualification {
  leadId: string;
  qualificationScore: number; // 0-100
  purchaseProbability: number;
  decisionType: "fast" | "hesitant" | "researcher";
  recommendedProperties: PropertyRecommendation[];
  recommendedAgent: AgentRecommendation | null;
  objectionPatterns: string[];
  bestPitch: string;
  urgency: "high" | "medium" | "low";
}

/**
 * Recommend best 5 properties for a client based on budget and interests
 */
export async function recommendPropertiesForClient(
  leadId: string
): Promise<PropertyRecommendation[]> {
  const lead = await storage.getLeadById(leadId);
  if (!lead) return [];

  const allProperties = await storage.getAllProperties();
  const behaviors = await storage.getUserBehaviorsByLeadId(leadId);

  // Extract client preferences
  const budget = lead.budget ? parseFloat(lead.budget.replace(/[^0-9.]/g, "")) : 0;
  const preferredCity = lead.city || "";
  const viewedProperties = behaviors
    .filter((b) => b.action === "view_property" && b.targetId)
    .map((b) => b.targetId!);

  // Score each property
  const scoredProperties = allProperties.map((property) => {
    let matchScore = 0;
    const reasons: string[] = [];

    // Budget match (40% weight)
    const propertyPrice = Number(property.price);
    if (budget > 0) {
      const priceDiff = Math.abs(propertyPrice - budget) / budget;
      if (priceDiff < 0.1) {
        matchScore += 40;
        reasons.push("Perfect budget match");
      } else if (priceDiff < 0.2) {
        matchScore += 30;
        reasons.push("Good budget match");
      } else if (priceDiff < 0.3) {
        matchScore += 20;
        reasons.push("Close to budget");
      }
    }

    // City match (30% weight)
    if (preferredCity && property.city.toLowerCase().includes(preferredCity.toLowerCase())) {
      matchScore += 30;
      reasons.push(`In preferred city: ${property.city}`);
    }

    // Viewed before (20% weight)
    if (viewedProperties.includes(property.id)) {
      matchScore += 20;
      reasons.push("Previously viewed by client");
    }

    // Demand indicator (10% weight)
    if (property.demandIndicator === "high") {
      matchScore += 10;
      reasons.push("High demand property");
    }

    // Real sales rate boost
    const salesRate = Number(property.realSalesRate || 0);
    if (salesRate > 80) {
      matchScore += 5;
      reasons.push("High conversion rate");
    }

    // Calculate estimated interest based on match score
    const estimatedInterest = Math.min(100, matchScore * 1.2);

    return {
      property,
      matchScore,
      reasons,
      estimatedInterest,
    };
  });

  // Sort by match score and return top 5
  return scoredProperties
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

/**
 * Recommend best agent for a client/property type
 */
export async function recommendAgentForClient(
  leadId: string,
  propertyType?: string
): Promise<AgentRecommendation | null> {
  const allAgents = await storage.getAllAgents();
  if (allAgents.length === 0) return null;

  const lead = await storage.getLeadById(leadId);
  if (!lead) return null;

  const allTransactions = await storage.getAllTransactions();

  // Score each agent
  const scoredAgents = allAgents.map((agent) => {
    let matchScore = 0;
    const reasons: string[] = [];

    // Closing rate (40% weight)
    const closingRate = Number(agent.closingRate || 0);
    matchScore += closingRate * 0.4;
    if (closingRate > 70) reasons.push(`High closing rate: ${closingRate}%`);

    // Response speed (20% weight)
    const responseSpeed = Number(agent.responseSpeed || 60); // minutes
    if (responseSpeed < 30) {
      matchScore += 20;
      reasons.push("Fast response time");
    } else if (responseSpeed < 60) {
      matchScore += 15;
      reasons.push("Good response time");
    }

    // Total deals (20% weight)
    const totalDeals = Number(agent.totalDeals || 0);
    matchScore += Math.min(20, (totalDeals / 100) * 20);
    if (totalDeals > 50) reasons.push(`Experienced: ${totalDeals} deals closed`);

    // Recent performance (20% weight)
    const agentTransactions = allTransactions.filter((t) => t.agentId === agent.id);
    const recentTransactions = agentTransactions.filter((t) => {
      if (!t.purchaseDate) return false;
      const date = new Date(t.purchaseDate);
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      return date >= last30Days;
    });
    matchScore += Math.min(20, recentTransactions.length * 4);
    if (recentTransactions.length > 3) reasons.push("Recent high activity");

    // Extract best script
    let bestScript = "Standard consultation script";
    try {
      if (agent.scripts) {
        const scripts = JSON.parse(agent.scripts);
        if (scripts.bestResponses && scripts.bestResponses.length > 0) {
          bestScript = scripts.bestResponses[0];
        }
      }
    } catch (e) {
      // Use default
    }

    // Calculate average deal price
    const dealPrices = agentTransactions.map((t) => Number(t.dealValue || 0));
    const bestPrice =
      dealPrices.length > 0
        ? dealPrices.reduce((a, b) => a + b, 0) / dealPrices.length
        : Number(agent.averageDealPrice || 0);

    const successRate = closingRate;

    return {
      agent,
      matchScore,
      reasons,
      successRate,
      bestScript,
      bestPrice,
    };
  });

  // Return top agent
  const topAgent = scoredAgents.sort((a, b) => b.matchScore - a.matchScore)[0];
  return topAgent || null;
}

/**
 * Qualify a client - AI Qualification System
 */
export async function qualifyClient(leadId: string): Promise<ClientQualification> {
  const lead = await storage.getLeadById(leadId);
  if (!lead) throw new Error("Lead not found");

  const behaviors = await storage.getUserBehaviorsByLeadId(leadId);
  const transactions = await storage.getTransactionsByLeadId(leadId);

  // Calculate qualification score
  let qualificationScore = 0;

  // Form submission (30 points)
  const hasFormSubmission = behaviors.some((b) => b.action === "submit_form");
  if (hasFormSubmission) qualificationScore += 30;

  // Multiple property views (20 points)
  const propertyViews = behaviors.filter((b) => b.action === "view_property").length;
  if (propertyViews >= 5) qualificationScore += 20;
  else if (propertyViews >= 3) qualificationScore += 15;
  else if (propertyViews >= 1) qualificationScore += 10;

  // WhatsApp click (20 points)
  const hasWhatsApp = behaviors.some((b) => b.action === "click_whatsapp");
  if (hasWhatsApp) qualificationScore += 20;

  // Return visit (15 points)
  const returnVisits = behaviors.filter((b) => b.action === "return_visit").length;
  if (returnVisits >= 2) qualificationScore += 15;
  else if (returnVisits >= 1) qualificationScore += 10;

  // Calculator usage (10 points)
  const hasCalculator = behaviors.some((b) => b.action === "use_calculator");
  if (hasCalculator) qualificationScore += 10;

  // Content engagement (5 points)
  const contentReads = behaviors.filter((b) => b.action === "read_content").length;
  if (contentReads >= 2) qualificationScore += 5;

  // Budget provided (10 points)
  if (lead.budget && lead.budget.length > 0) qualificationScore += 10;

  // Calculate decision type
  const avgTimeSpent =
    behaviors.reduce((sum, b) => sum + (Number(b.timeSpent) || 0), 0) / behaviors.length || 0;
  let decisionType: "fast" | "hesitant" | "researcher" = "hesitant";
  if (returnVisits === 0 && propertyViews > 5 && avgTimeSpent < 20) {
    decisionType = "fast";
  } else if (returnVisits >= 3 || behaviors.length > 15) {
    decisionType = "researcher";
  }

  // Extract objection patterns
  const objectionPatterns: string[] = [];
  if (lead.message) {
    const message = lead.message.toLowerCase();
    const objectionKeywords = ["expensive", "caro", "مكلف", "price", "سعر", "wait", "انتظر"];
    objectionKeywords.forEach((keyword) => {
      if (message.includes(keyword)) {
        objectionPatterns.push(keyword);
      }
    });
  }

  // Purchase probability from lead
  const purchaseProbability = Number(lead.purchaseProbability || 0);

  // Determine urgency
  let urgency: "high" | "medium" | "low" = "low";
  if (purchaseProbability >= 80 || hasWhatsApp || propertyViews >= 5) urgency = "high";
  else if (purchaseProbability >= 50 || hasFormSubmission) urgency = "medium";

  // Get recommendations
  const recommendedProperties = await recommendPropertiesForClient(leadId);
  const recommendedAgent = await recommendAgentForClient(leadId);

  // Generate best pitch
  let bestPitch = "Standard consultation approach";
  if (recommendedAgent && recommendedAgent.bestScript) {
    bestPitch = recommendedAgent.bestScript;
  } else if (decisionType === "fast") {
    bestPitch = "Quick decision maker - emphasize urgency and limited availability";
  } else if (decisionType === "researcher") {
    bestPitch = "Thorough researcher - provide detailed information and market data";
  } else {
    bestPitch = "Hesitant buyer - focus on trust building and testimonials";
  }

  return {
    leadId,
    qualificationScore,
    purchaseProbability,
    decisionType,
    recommendedProperties,
    recommendedAgent,
    objectionPatterns,
    bestPitch,
    urgency,
  };
}

