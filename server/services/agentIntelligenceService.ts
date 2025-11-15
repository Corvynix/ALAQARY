import { storage } from "../storage";
import type { Agent, Lead, Transaction, UserBehavior } from "@shared/schema";

export interface AgentScriptRecommendation {
  agentId: string;
  clientLeadId: string;
  recommendedScript: string;
  recommendedResponse: string;
  recommendedPrice: number;
  recommendedProperty: string | null;
  reasons: string[];
  expectedSuccessRate: number;
}

export interface AgentIntelligence {
  agent: Agent;
  bestScripts: Array<{ script: string; successRate: number; useCase: string }>;
  commonObjections: Array<{ objection: string; frequency: number; bestResponse: string }>;
  bestPrices: Array<{ price: number; successRate: number; context: string }>;
  clientTypes: Array<{ type: string; successRate: number; count: number }>;
  peakTimes: Array<{ hour: number; contacts: number; successRate: number }>;
}

/**
 * Get best script for an agent to use with a specific client
 */
export async function getBestScriptForAgent(
  agentId: string,
  clientLeadId: string
): Promise<AgentScriptRecommendation | null> {
  const agent = await storage.getAgentById(agentId);
  const lead = await storage.getLeadById(clientLeadId);
  
  if (!agent || !lead) return null;

  const allTransactions = await storage.getAllTransactions();
  const agentTransactions = allTransactions.filter((t) => t.agentId === agentId);

  // Extract agent's scripts and pitches
  let bestScripts: Array<{ script: string; successRate: number }> = [];
  let commonObjections: Array<{ objection: string; response: string }> = [];

  try {
    if (agent.scripts) {
      const scriptsData = JSON.parse(agent.scripts);
      if (scriptsData.pitchTemplates) {
        bestScripts = scriptsData.pitchTemplates;
      }
      if (scriptsData.commonObjections) {
        commonObjections = scriptsData.commonObjections;
      }
    }
  } catch (e) {
    // Use defaults if parsing fails
  }

  // If no scripts in database, analyze successful transactions
  if (bestScripts.length === 0) {
    const successfulTransactions = agentTransactions.filter((t) => t.status === "completed");
    bestScripts = [
      {
        script: "Standard consultation script",
        successRate: Number(agent.closingRate || 0),
      },
    ];
  }

  // Match script to client type
  const decisionType = lead.decisionType || "hesitant";
  let recommendedScript = bestScripts[0]?.script || "Standard consultation approach";
  let recommendedResponse = "";

  if (decisionType === "fast") {
    recommendedScript = "Quick decision maker script - emphasize urgency";
    recommendedResponse = "Limited availability - act fast for best units";
  } else if (decisionType === "researcher") {
    recommendedScript = "Detailed information script - market data and comparisons";
    recommendedResponse = "Here's comprehensive market analysis and property details";
  } else {
    recommendedScript = "Trust-building script - testimonials and guarantees";
    recommendedResponse = "Many clients like you have been satisfied - let me show you";
  }

  // Match objection to response
  if (lead.message) {
    const message = lead.message.toLowerCase();
    const matchedObjection = commonObjections.find((obj) =>
      message.includes(obj.objection.toLowerCase())
    );
    if (matchedObjection) {
      recommendedResponse = matchedObjection.response;
    }
  }

  // Calculate recommended price based on client budget and agent's average
  const clientBudget = lead.budget ? parseFloat(lead.budget.replace(/[^0-9.]/g, "")) : 0;
  const avgDealPrice = Number(agent.averageDealPrice || 0);
  const recommendedPrice = clientBudget > 0 ? clientBudget * 0.95 : avgDealPrice;

  // Find best property match
  const allProperties = await storage.getAllProperties();
  const budgetMatch = allProperties.find((p) => {
    const price = Number(p.price);
    return price > 0 && Math.abs(price - clientBudget) / clientBudget < 0.1;
  });
  const recommendedProperty = budgetMatch?.id || null;

  // Calculate expected success rate
  const agentClosingRate = Number(agent.closingRate || 0);
  const clientProbability = Number(lead.purchaseProbability || 0);
  const expectedSuccessRate = (agentClosingRate + clientProbability) / 2;

  const reasons: string[] = [];
  reasons.push(`Matched to ${decisionType} client type`);
  if (lead.budget) reasons.push(`Budget-appropriate pricing`);
  if (matchedObjection) reasons.push(`Addresses client objection`);
  reasons.push(`Agent closing rate: ${agentClosingRate}%`);

  return {
    agentId,
    clientLeadId,
    recommendedScript,
    recommendedResponse,
    recommendedPrice,
    recommendedProperty,
    reasons,
    expectedSuccessRate,
  };
}

/**
 * Get comprehensive intelligence for an agent
 */
export async function getAgentIntelligence(agentId: string): Promise<AgentIntelligence | null> {
  const agent = await storage.getAgentById(agentId);
  if (!agent) return null;

  const allTransactions = await storage.getAllTransactions();
  const allLeads = await storage.getAllLeads();
  const allBehaviors = await storage.getUserBehaviorsByLeadId(agentId); // Note: might need adjustment

  const agentTransactions = allTransactions.filter((t) => t.agentId === agentId);
  const agentLeads = allLeads.filter((l) => {
    // Assuming we can match leads to agents somehow
    // This might need adjustment based on your data model
    return false; // Placeholder
  });

  // Extract best scripts
  let bestScripts: Array<{ script: string; successRate: number; useCase: string }> = [];
  try {
    if (agent.pitchEffectiveness) {
      const pitches = JSON.parse(agent.pitchEffectiveness);
      if (pitches.bestPitches) {
        bestScripts = pitches.bestPitches.map((p: any) => ({
          script: p.pitch,
          successRate: p.conversionRate || 0,
          useCase: p.context || "General",
        }));
      }
    }
  } catch (e) {
    bestScripts = [
      {
        script: "Standard consultation script",
        successRate: Number(agent.closingRate || 0),
        useCase: "General",
      },
    ];
  }

  // Extract common objections
  let commonObjections: Array<{ objection: string; frequency: number; bestResponse: string }> = [];
  try {
    if (agent.objections) {
      const objectionsData = JSON.parse(agent.objections);
      if (objectionsData.common) {
        commonObjections = objectionsData.common.map((obj: any) => ({
          objection: obj.objection,
          frequency: obj.frequency || 0,
          bestResponse: obj.response || "Standard response",
        }));
      }
    }
  } catch (e) {
    commonObjections = [];
  }

  // Analyze deal prices
  const dealPrices = agentTransactions.map((t) => Number(t.dealValue || 0));
  const priceGroups = new Map<string, { price: number; count: number; success: number }>();

  agentTransactions.forEach((t) => {
    const price = Number(t.dealValue || 0);
    const priceRange = getPriceRange(price);
    if (!priceGroups.has(priceRange)) {
      priceGroups.set(priceRange, { price: price, count: 0, success: 0 });
    }
    const group = priceGroups.get(priceRange)!;
    group.count++;
    if (t.status === "completed") group.success++;
  });

  const bestPrices = Array.from(priceGroups.entries())
    .map(([range, data]) => ({
      price: data.price,
      successRate: data.count > 0 ? (data.success / data.count) * 100 : 0,
      context: `Price range: ${range}`,
    }))
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 5);

  // Analyze client types
  const clientTypes = new Map<string, { count: number; success: number }>();
  agentLeads.forEach((lead) => {
    const type = lead.decisionType || "unknown";
    if (!clientTypes.has(type)) {
      clientTypes.set(type, { count: 0, success: 0 });
    }
    const stats = clientTypes.get(type)!;
    stats.count++;
    const hasTransaction = agentTransactions.some((t) => t.leadId === lead.id);
    if (hasTransaction) stats.success++;
  });

  const clientTypeStats = Array.from(clientTypes.entries()).map(([type, stats]) => ({
    type,
    successRate: stats.count > 0 ? (stats.success / stats.count) * 100 : 0,
    count: stats.count,
  }));

  // Analyze peak times (would need behavior data with timestamps)
  const peakTimes: Array<{ hour: number; contacts: number; successRate: number }> = [];
  for (let hour = 0; hour < 24; hour++) {
    peakTimes.push({
      hour,
      contacts: 0, // Would need to calculate from behavior data
      successRate: 0,
    });
  }

  return {
    agent,
    bestScripts,
    commonObjections,
    bestPrices,
    clientTypes: clientTypeStats,
    peakTimes,
  };
}

function getPriceRange(price: number): string {
  if (price < 1000000) return "< 1M";
  if (price < 3000000) return "1M - 3M";
  if (price < 5000000) return "3M - 5M";
  if (price < 10000000) return "5M - 10M";
  return "> 10M";
}

