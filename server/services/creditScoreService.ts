import { storage } from "../storage";
import type { Lead, Agent, Property, CreditScore } from "@shared/schema";

/**
 * Calculate buyer credit score (purchase probability)
 * Based on behavior, engagement, budget match, and decision patterns
 */
export async function calculateBuyerCreditScore(leadId: string): Promise<CreditScore> {
  const lead = await storage.getLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const behaviors = await storage.getUserBehaviorsByLeadId(leadId);
  const transactions = await storage.getTransactionsByLeadId(leadId);

  const factors: Record<string, number> = {};

  // Factor 1: Purchase Probability (30%)
  const purchaseProb = parseFloat(lead.purchaseProbability || "0");
  factors.purchaseProbability = purchaseProb * 0.3;

  // Factor 2: Engagement Level (25%)
  const engagementScore = calculateEngagementScore(behaviors, lead);
  factors.engagement = engagementScore * 0.25;

  // Factor 3: Budget Match (20%)
  const budgetScore = await calculateBudgetMatchScore(lead);
  factors.budgetMatch = budgetScore * 0.2;

  // Factor 4: Decision Type (15%)
  const decisionScore = getDecisionTypeScore(lead.decisionType);
  factors.decisionType = decisionScore * 0.15;

  // Factor 5: Historical Success (10%)
  const successScore = transactions.length > 0 ? 1.0 : 0.5;
  factors.historicalSuccess = successScore * 0.1;

  const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0) * 1000;

  return {
    id: "",
    entityId: leadId,
    entityType: "buyer",
    score: totalScore.toString(),
    factors: JSON.stringify(factors),
    lastCalculated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculate project credit score (success likelihood)
 */
export async function calculateProjectCreditScore(propertyId: string): Promise<CreditScore> {
  const property = await storage.getPropertyById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  const factors: Record<string, number> = {};

  // Factor 1: Real Sales Rate (35%)
  const salesRate = parseFloat(property.realSalesRate || "0");
  factors.salesRate = (salesRate / 100) * 0.35;

  // Factor 2: Demand Indicator (25%)
  const demandScore = property.demandIndicator === "high" ? 1.0 : 
                      property.demandIndicator === "medium" ? 0.6 : 0.3;
  factors.demand = demandScore * 0.25;

  // Factor 3: Views/Interest (20%)
  const views = parseFloat(property.views || "0");
  const viewsScore = Math.min(views / 1000, 1.0); // Normalize to 0-1
  factors.interest = viewsScore * 0.2;

  // Factor 4: Developer Reputation (10%)
  // This would come from developer data - defaulting to 0.7
  factors.developerReputation = 0.7 * 0.1;

  // Factor 5: Market Position (10%)
  const marketScore = await calculateMarketPositionScore(property);
  factors.marketPosition = marketScore * 0.1;

  const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0) * 1000;

  return {
    id: "",
    entityId: propertyId,
    entityType: "project",
    score: totalScore.toString(),
    factors: JSON.stringify(factors),
    lastCalculated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculate agent credit score (performance rating)
 */
export async function calculateAgentCreditScore(agentId: string): Promise<CreditScore> {
  const agent = await storage.getAgentById(agentId);
  if (!agent) {
    throw new Error("Agent not found");
  }

  const transactions = await storage.getTransactionsByAgentId(agentId);
  const factors: Record<string, number> = {};

  // Factor 1: Closing Rate (30%)
  const closingRate = parseFloat(agent.closingRate || "0");
  factors.closingRate = (closingRate / 100) * 0.3;

  // Factor 2: Total Deals (25%)
  const totalDeals = parseFloat(agent.totalDeals || "0");
  const dealsScore = Math.min(totalDeals / 50, 1.0); // Normalize
  factors.totalDeals = dealsScore * 0.25;

  // Factor 3: Response Speed (20%)
  const responseSpeed = parseFloat(agent.responseSpeed || "60");
  const speedScore = responseSpeed < 30 ? 1.0 : 
                     responseSpeed < 60 ? 0.7 : 
                     responseSpeed < 120 ? 0.4 : 0.2;
  factors.responseSpeed = speedScore * 0.2;

  // Factor 4: Revenue Performance (15%)
  const revenue = parseFloat(agent.totalRevenue || "0");
  const revenueScore = Math.min(revenue / 10000000, 1.0); // Normalize to 10M
  factors.revenue = revenueScore * 0.15;

  // Factor 5: Interested Clients Ratio (10%)
  const interested = parseFloat(agent.interestedClients || "0");
  const contacts = parseFloat(agent.dailyContacts || "1");
  const interestRatio = interested / contacts;
  factors.interestRatio = Math.min(interestRatio, 1.0) * 0.1;

  const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0) * 1000;

  return {
    id: "",
    entityId: agentId,
    entityType: "agent",
    score: totalScore.toString(),
    factors: JSON.stringify(factors),
    lastCalculated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper functions
function calculateEngagementScore(behaviors: any[], lead: Lead): number {
  if (behaviors.length === 0) return 0.3;

  const recentBehaviors = behaviors.filter(b => {
    const created = new Date(b.createdAt);
    const daysAgo = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  const engagementLevel = Math.min(recentBehaviors.length / 10, 1.0);
  const funnelStage = lead.funnelStage || "curiosity";
  const stageScore = {
    curiosity: 0.2,
    understanding: 0.4,
    trust: 0.6,
    desire: 0.8,
    purchase: 1.0,
  }[funnelStage] || 0.2;

  return (engagementLevel + stageScore) / 2;
}

async function calculateBudgetMatchScore(lead: Lead): Promise<number> {
  if (!lead.budget || !lead.city) return 0.5;

  const marketTrend = await storage.getMarketTrendByCity(lead.city);
  if (!marketTrend || !marketTrend.avgPrice) return 0.5;

  const budgetNum = parseBudget(lead.budget);
  const avgPrice = parseFloat(marketTrend.avgPrice);

  if (budgetNum >= avgPrice * 0.9 && budgetNum <= avgPrice * 1.1) return 1.0;
  if (budgetNum >= avgPrice * 0.7 && budgetNum <= avgPrice * 1.3) return 0.7;
  return 0.4;
}

function getDecisionTypeScore(decisionType: string | null): number {
  const scores: Record<string, number> = {
    fast: 0.9,
    hesitant: 0.5,
    "research-heavy": 0.7,
  };
  return scores[decisionType || "hesitant"] || 0.5;
}

async function calculateMarketPositionScore(property: Property): Promise<number> {
  const marketTrend = await storage.getMarketTrendByCity(property.city);
  if (!marketTrend) return 0.5;

  const propertyPrice = parseFloat(property.price || "0");
  const avgPrice = parseFloat(marketTrend.avgPrice || "0");

  if (avgPrice === 0) return 0.5;

  const priceRatio = propertyPrice / avgPrice;
  // Best position: 0.9-1.1 of average
  if (priceRatio >= 0.9 && priceRatio <= 1.1) return 1.0;
  if (priceRatio >= 0.8 && priceRatio <= 1.2) return 0.8;
  return 0.6;
}

function parseBudget(budget: string): number {
  const cleaned = budget.replace(/[,،]/g, "").replace(/\s/g, "").replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  
  if (budget.includes("مليون") || budget.toLowerCase().includes("m")) {
    return num * 1000000;
  }
  if (budget.includes("ألف") || budget.toLowerCase().includes("k")) {
    return num * 1000;
  }
  return num || 0;
}

