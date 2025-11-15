import { storage } from "../storage";
import type { Lead, Agent, Property, UserBehavior } from "@shared/schema";

/**
 * Dependency Loop Service
 * Tracks and manages the three dependency loops that make the system self-reinforcing
 */

// =====================================================
// VALUE LOOP (Clients)
// =====================================================

/**
 * Value Loop: Clients contribute demand data and behavior patterns
 * In return, they get smart matching, trust signals, and AI advisor
 */
export async function processValueLoop(leadId: string) {
  const lead = await storage.getLeadById(leadId);
  if (!lead) return null;

  const behaviors = await storage.getUserBehaviorsByLeadId(leadId);
  
  // What the system gets from the client
  const systemGains = {
    demandData: {
      budget: lead.budget,
      city: lead.city,
      propertyType: lead.purpose,
      interestLevel: parseFloat(lead.interestLevel || "0"),
    },
    behaviorPatterns: behaviors.map(b => ({
      action: b.action,
      triggerType: b.triggerType,
      decisionDriver: b.decisionDriver,
      peakTime: b.peakTimeIndicator,
    })),
    decisionTriggers: {
      decisionType: lead.decisionType,
      behavioralTriggers: lead.behavioralTriggers,
      pitchResponses: lead.pitchResponses,
    },
  };

  // What the client gets from the system
  const clientGains = {
    smartMatching: await getSmartMatches(lead),
    trustSignals: await getTrustSignals(lead),
    aiAdvisor: true, // Access to AI Brain
  };

  // Store the data contribution
  await trackDataContribution(leadId, "client", systemGains);

  return {
    clientGains,
    systemGains,
  };
}

// =====================================================
// PROFIT LOOP (Agents)
// =====================================================

/**
 * Profit Loop: Agents contribute sales data and closing patterns
 * In return, they get qualified leads, AI scripts, and performance scoring
 */
export async function processProfitLoop(agentId: string) {
  const agent = await storage.getAgentById(agentId);
  if (!agent) return null;

  const transactions = await storage.getTransactionsByAgentId(agentId);
  const behaviors = await storage.getAllUserBehaviors();
  const agentBehaviors = behaviors.filter(b => 
    transactions.some(t => t.leadId === b.leadId)
  );

  // What the system gets from the agent
  const systemGains = {
    salesData: transactions.map(t => ({
      dealValue: t.dealValue,
      commission: t.commission,
      propertyId: t.propertyId,
      closingDate: t.purchaseDate,
    })),
    closingPatterns: {
      averageDealPrice: agent.averageDealPrice,
      closingRate: agent.closingRate,
      responseSpeed: agent.responseSpeed,
      scripts: agent.scripts,
      pitchEffectiveness: agent.pitchEffectiveness,
    },
    realPrices: transactions.map(t => ({
      propertyId: t.propertyId,
      actualPrice: t.dealValue,
      listedPrice: null, // Would compare with property price
    })),
    objectionHandling: {
      objections: agent.objections,
      bestResponses: agent.scripts ? JSON.parse(agent.scripts).bestResponses : [],
    },
  };

  // What the agent gets from the system
  const agentGains = {
    qualifiedLeads: await getQualifiedLeads(agent),
    aiScripts: await getAIScripts(agent),
    performanceScoring: await getPerformanceScore(agent),
  };

  // Store the data contribution
  await trackDataContribution(agentId, "agent", systemGains);

  return {
    agentGains,
    systemGains,
  };
}

// =====================================================
// EXPANSION LOOP (Developers)
// =====================================================

/**
 * Expansion Loop: Developers contribute real pricing and inventory data
 * In return, they get demand forecasting, market heatmaps, and launch intelligence
 */
export async function processExpansionLoop(developerId: string) {
  // Get developer's properties
  const allProperties = await storage.getAllProperties();
  const developerProperties = allProperties.filter(p => 
    p.developer && p.developer.includes(developerId)
  );

  // What the system gets from the developer
  const systemGains = {
    realPricing: developerProperties.map(p => ({
      propertyId: p.id,
      listedPrice: p.price,
      realSalesRate: p.realSalesRate,
      demandIndicator: p.demandIndicator,
    })),
    inventoryData: {
      totalProperties: developerProperties.length,
      available: developerProperties.filter(p => p.status === "available").length,
      sold: developerProperties.filter(p => p.status === "sold").length,
    },
    projectPerformance: developerProperties.map(p => ({
      propertyId: p.id,
      views: p.views,
      commonObjections: p.commonObjections,
      closingFeatures: p.closingFeatures,
    })),
  };

  // What the developer gets from the system
  const developerGains = {
    demandForecasting: await getDemandForecast(developerProperties),
    marketHeatmaps: await getMarketHeatmaps(developerProperties),
    launchIntelligence: await getLaunchIntelligence(developerProperties),
  };

  // Store the data contribution
  await trackDataContribution(developerId, "developer", systemGains);

  return {
    developerGains,
    systemGains,
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function getSmartMatches(lead: Lead) {
  // Use recommendation service
  const { recommendPropertiesForClient } = await import("./recommendationService");
  return await recommendPropertiesForClient(lead.id);
}

async function getTrustSignals(lead: Lead) {
  const behaviors = await storage.getUserBehaviorsByLeadId(lead.id);
  return {
    engagementLevel: behaviors.length,
    recentActivity: behaviors.filter(b => {
      const daysAgo = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length,
    trustScore: parseFloat(lead.purchaseProbability || "0"),
  };
}

async function getQualifiedLeads(agent: Agent) {
  const allLeads = await storage.getAllLeads();
  const { qualifyClient } = await import("./recommendationService");
  
  const qualified = [];
  for (const lead of allLeads) {
    try {
      const qualification = await qualifyClient(lead.id);
      // qualification is a ClientQualification with qualificationScore property
      if (qualification && qualification.qualificationScore >= 70) {
        qualified.push(lead);
      }
    } catch (error) {
      // Skip leads that can't be qualified
      continue;
    }
  }
  
  return qualified.slice(0, 10); // Top 10 qualified leads
}

async function getAIScripts(agent: Agent) {
  const { getBestScriptForAgent } = await import("./agentIntelligenceService");
  // Get scripts for top leads
  const allLeads = await storage.getAllLeads();
  const topLead = allLeads[0];
  
  if (topLead) {
    return await getBestScriptForAgent(agent.id, topLead.id);
  }
  
  return {
    commonObjections: agent.objections ? JSON.parse(agent.objections).common : [],
    bestResponses: agent.scripts ? JSON.parse(agent.scripts).bestResponses : [],
  };
}

async function getPerformanceScore(agent: Agent) {
  const { getAgentIntelligence } = await import("./agentIntelligenceService");
  return await getAgentIntelligence(agent.id);
}

async function getDemandForecast(properties: Property[]) {
  const cities = [...new Set(properties.map(p => p.city))];
  const forecasts = [];
  
  for (const city of cities) {
    const trend = await storage.getMarketTrendByCity(city);
    if (trend) {
      forecasts.push({
        city,
        predictedDemand: trend.demandLevel,
        pricePrediction: trend.pricePrediction,
      });
    }
  }
  
  return forecasts;
}

async function getMarketHeatmaps(properties: Property[]) {
  const { generateMarketHeatmap } = await import("../intelligence/services/marketHeatmap");
  const trends = await storage.getAllMarketTrends();
  return generateMarketHeatmap(trends);
}

async function getLaunchIntelligence(properties: Property[]) {
  return {
    recommendedPriceRange: calculateOptimalPriceRange(properties),
    targetAudience: analyzeTargetAudience(properties),
    launchTiming: recommendLaunchTiming(properties),
  };
}

function calculateOptimalPriceRange(properties: Property[]) {
  const prices = properties.map(p => parseFloat(p.price || "0")).filter(p => p > 0);
  if (prices.length === 0) return null;
  
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return {
    min: avg * 0.9,
    max: avg * 1.1,
    average: avg,
  };
}

function analyzeTargetAudience(properties: Property[]) {
  const types = properties.map(p => p.propertyType);
  const typeCounts: Record<string, number> = {};
  
  types.forEach(type => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  return Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);
}

function recommendLaunchTiming(properties: Property[]) {
  // Simple recommendation based on demand indicators
  const highDemand = properties.filter(p => p.demandIndicator === "high").length;
  const total = properties.length;
  
  if (highDemand / total > 0.5) {
    return "immediate";
  } else if (highDemand / total > 0.3) {
    return "within_3_months";
  } else {
    return "wait_for_market_improvement";
  }
}

async function trackDataContribution(entityId: string, entityType: string, data: any) {
  // This would store the contribution for analytics
  // For now, we'll just log it
  console.log(`Data contribution from ${entityType}:${entityId}`, {
    timestamp: new Date().toISOString(),
    dataType: `${entityType}_contribution`,
    data,
  });
}

