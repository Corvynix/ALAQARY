import type { Agent, Lead, Property } from "@shared/schema";

export interface ClosingProbabilityResult {
  probability: number; // 0-1
  confidence: "high" | "medium" | "low";
  factors: {
    agentFactor: number;
    clientFactor: number;
    propertyFactor: number;
    matchFactor: number;
  };
  insights: string[];
  recommendation: string;
  estimatedDaysToClose?: number;
}

/**
 * Predict the probability of closing a deal
 * Combines agent performance, client readiness, property fit, and alignment
 */
export function calculateClosingProbability(
  agent: Agent,
  client: Lead,
  property: Property
): ClosingProbabilityResult {
  const factors = {
    agentFactor: calculateAgentFactor(agent),
    clientFactor: calculateClientFactor(client),
    propertyFactor: calculatePropertyFactor(property),
    matchFactor: calculateMatchFactor(client, property),
  };

  const insights: string[] = [];

  // Agent analysis
  const closingRate = parseFloat(agent.closingRate || "0");
  if (closingRate >= 70) {
    insights.push(`✅ Strong agent track record (${closingRate}% close rate)`);
  } else if (closingRate >= 50) {
    insights.push(`👍 Decent agent performance (${closingRate}% close rate)`);
  } else {
    insights.push(`⚠️ Agent needs support (${closingRate}% close rate)`);
  }

  const responseSpeed = parseFloat(agent.responseSpeed || "60");
  if (responseSpeed <= 10) {
    insights.push("⚡ Lightning-fast agent responses boost conversion");
  }

  // Client analysis
  const clientStage = client.funnelStage || "curiosity";
  if (clientStage === "purchase" || clientStage === "intent") {
    insights.push("🎯 Client in buying mode - high conversion potential");
  } else if (clientStage === "consideration") {
    insights.push("🤔 Client evaluating options - needs convincing");
  } else {
    insights.push("👀 Early-stage client - requires nurturing");
  }

  const purchaseProbability = parseFloat(client.purchaseProbability || "0");
  if (purchaseProbability >= 0.7) {
    insights.push("🔥 Strong buying signals detected");
  }

  // Property analysis
  const salesRate = parseFloat(property.realSalesRate || "0");
  if (salesRate >= 0.7) {
    insights.push("📈 Hot property - fast-moving inventory");
  }

  if (property.demandIndicator === "high") {
    insights.push("⚠️ High demand creates urgency");
  }

  // Price-Budget Match
  if (client.budget) {
    const budget = parseBudget(client.budget);
    const price = parseFloat(property.price);
    const priceRatio = price / budget;

    if (priceRatio >= 0.8 && priceRatio <= 1.1) {
      insights.push("💰 Price perfectly aligned with budget");
    } else if (priceRatio > 1.1 && priceRatio <= 1.3) {
      insights.push("💵 Slight stretch - may need financing discussion");
    } else if (priceRatio > 1.3) {
      insights.push("⚠️ Price concerns - address affordability");
    }
  }

  // Location Match
  if (client.city && client.city.toLowerCase() === property.city.toLowerCase()) {
    insights.push("📍 Perfect location match");
  }

  // Payment Plan
  if (property.paymentPlan) {
    const cashPercentage = parseFloat(property.cashPercentage || "100");
    if (cashPercentage < 30) {
      insights.push("💳 Flexible payment plan increases accessibility");
    }
  }

  // Calculate weighted probability
  const probability =
    factors.agentFactor * 0.30 +      // 30% - Agent skill
    factors.clientFactor * 0.35 +     // 35% - Client readiness (most important)
    factors.propertyFactor * 0.15 +   // 15% - Property appeal
    factors.matchFactor * 0.20;       // 20% - Overall alignment

  // Determine confidence level
  let confidence: "high" | "medium" | "low";
  if (probability >= 0.7 && factors.clientFactor >= 0.7) {
    confidence = "high";
  } else if (probability >= 0.5) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  // Generate recommendation
  let recommendation: string;
  let estimatedDaysToClose: number | undefined;

  if (probability >= 0.8) {
    recommendation = "🚀 URGENT: Schedule property viewing ASAP - Very high close probability";
    estimatedDaysToClose = 7;
  } else if (probability >= 0.6) {
    recommendation = "⭐ PRIORITY: Strong potential - Follow up within 24 hours";
    estimatedDaysToClose = 14;
  } else if (probability >= 0.4) {
    recommendation = "👍 NURTURE: Good prospect - Build relationship and address concerns";
    estimatedDaysToClose = 30;
  } else {
    recommendation = "💭 EDUCATE: Early stage - Focus on value demonstration";
    estimatedDaysToClose = 60;
  }

  return {
    probability: Math.round(probability * 100) / 100,
    confidence,
    factors,
    insights,
    recommendation,
    estimatedDaysToClose,
  };
}

/**
 * Calculate agent performance factor
 */
function calculateAgentFactor(agent: Agent): number {
  const closingRate = parseFloat(agent.closingRate || "0") / 100;
  const responseSpeed = parseFloat(agent.responseSpeed || "60");
  const totalDeals = parseFloat(agent.totalDeals || "0");

  // Speed bonus (faster response = higher score)
  const speedBonus = responseSpeed <= 10 ? 0.2 : responseSpeed <= 30 ? 0.1 : 0;

  // Experience bonus (more deals = higher score)
  const experienceBonus = totalDeals >= 50 ? 0.2 : totalDeals >= 20 ? 0.1 : 0;

  const baseFactor = closingRate;
  const adjustedFactor = Math.min(baseFactor + speedBonus + experienceBonus, 1.0);

  return adjustedFactor;
}

/**
 * Calculate client readiness factor
 */
function calculateClientFactor(client: Lead): number {
  // Funnel stage scoring
  const stageScores: Record<string, number> = {
    curiosity: 0.2,
    interest: 0.4,
    consideration: 0.6,
    intent: 0.8,
    purchase: 1.0,
  };

  const stageScore = stageScores[client.funnelStage || "curiosity"] || 0.2;
  const purchaseProbability = parseFloat(client.purchaseProbability || "0");

  // Budget clarity bonus
  const budgetBonus = client.budget ? 0.1 : 0;

  // Recent interaction bonus
  let recencyBonus = 0;
  if (client.lastInteractionAt) {
    const daysSince = Math.floor(
      (Date.now() - new Date(client.lastInteractionAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince <= 1) recencyBonus = 0.2;
    else if (daysSince <= 3) recencyBonus = 0.1;
  }

  const factor = Math.min(
    (stageScore * 0.5 + purchaseProbability * 0.5) + budgetBonus + recencyBonus,
    1.0
  );

  return factor;
}

/**
 * Calculate property appeal factor
 */
function calculatePropertyFactor(property: Property): number {
  const salesRate = parseFloat(property.realSalesRate || "0");
  const demandBonus = property.demandIndicator === "high" ? 0.2 : 0;
  const servicesBonus = property.services && property.services.length > 3 ? 0.1 : 0;
  const developerBonus = property.developer ? 0.1 : 0;

  const factor = Math.min(salesRate + demandBonus + servicesBonus + developerBonus, 1.0);

  return factor;
}

/**
 * Calculate overall match factor
 */
function calculateMatchFactor(client: Lead, property: Property): number {
  let matchScore = 0.5; // Base score

  // Price match
  if (client.budget) {
    const budget = parseBudget(client.budget);
    const price = parseFloat(property.price);
    const priceRatio = price / budget;

    if (priceRatio >= 0.8 && priceRatio <= 1.1) {
      matchScore += 0.3; // Perfect match
    } else if (priceRatio <= 1.3) {
      matchScore += 0.15; // Close match
    }
  }

  // Location match
  if (client.city && client.city.toLowerCase() === property.city.toLowerCase()) {
    matchScore += 0.2;
  }

  return Math.min(matchScore, 1.0);
}

/**
 * Parse budget string to numeric value
 */
function parseBudget(budget: string): number {
  const cleaned = budget
    .replace(/[,،]/g, "")
    .replace(/\s/g, "")
    .replace(/[^\d.]/g, "");
  
  const num = parseFloat(cleaned);
  
  if (budget.includes("مليون") || budget.toLowerCase().includes("m")) {
    return num * 1000000;
  }
  
  if (budget.includes("ألف") || budget.toLowerCase().includes("k")) {
    return num * 1000;
  }
  
  return num || 0;
}
