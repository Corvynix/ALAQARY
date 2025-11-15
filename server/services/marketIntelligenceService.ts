import { storage } from "../storage";
import type { MarketTrend, Property, Transaction, Agent } from "@shared/schema";

export interface MarketIntelligence {
  city: string;
  avgPrice: number;
  dailyDemand: number;
  weeklyDemand: number;
  monthlyDemand: number;
  supply: number;
  demandSupplyRatio: number;
  salesVelocity: number;
  priceTrend: "up" | "down" | "stable";
  newProjects: number;
  topBrokers: Array<{ name: string; deals: number; area: string }>;
  hotAreas: Array<{ area: string; demand: number; growth: number }>;
  predictions: {
    nextMonthPrice: number;
    nextMonthDemand: number;
    trendingAreas: string[];
  };
}

/**
 * Get comprehensive market intelligence for a city
 */
export async function getMarketIntelligence(city: string): Promise<MarketIntelligence | null> {
  const marketTrend = await storage.getMarketTrendByCity(city);
  if (!marketTrend) return null;

  // Get all properties in this city
  const allProperties = await storage.getAllProperties();
  const cityProperties = allProperties.filter((p) => p.city === city);

  // Get all transactions
  const allTransactions = await storage.getAllTransactions();
  const cityTransactions = allTransactions.filter((t) => {
    const property = cityProperties.find((p) => p.id === t.propertyId);
    return property !== undefined;
  });

  // Get all agents
  const allAgents = await storage.getAllAgents();

  // Calculate supply
  const supply = cityProperties.filter((p) => p.status === "available").length;

  // Calculate demand-supply ratio
  const demand = Number(marketTrend.dailyDemand || 0) * 30; // Monthly estimate
  const demandSupplyRatio = supply > 0 ? demand / supply : 0;

  // Calculate sales velocity (transactions per month)
  const last30DaysTransactions = cityTransactions.filter((t) => {
    if (!t.purchaseDate) return false;
    const purchaseDate = new Date(t.purchaseDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return purchaseDate >= thirtyDaysAgo;
  });
  const salesVelocity = last30DaysTransactions.length;

  // Parse broker performance
  let topBrokers: Array<{ name: string; deals: number; area: string }> = [];
  try {
    if (marketTrend.brokerPerformance) {
      topBrokers = JSON.parse(marketTrend.brokerPerformance);
    }
  } catch (e) {
    // If parsing fails, calculate from agents
    const agentStats = allAgents.map((agent) => ({
      name: agent.name,
      deals: Number(agent.totalDeals || 0),
      area: city,
    }));
    topBrokers = agentStats
      .sort((a, b) => b.deals - a.deals)
      .slice(0, 5);
  }

  // Calculate price trend
  const changePercent = Number(marketTrend.changePercent || 0);
  let priceTrend: "up" | "down" | "stable" = "stable";
  if (changePercent > 5) priceTrend = "up";
  else if (changePercent < -5) priceTrend = "down";

  // Count new projects
  const newProjects = cityProperties.filter((p) => {
    const createdDate = new Date(p.createdAt);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    return createdDate >= last30Days;
  }).length;

  // Calculate hot areas (areas with high demand and growth)
  const areaStats = new Map<string, { demand: number; growth: number }>();
  cityProperties.forEach((property) => {
    // Assuming we can extract area from property data
    const area = property.city; // You might want to add area field
    if (!areaStats.has(area)) {
      areaStats.set(area, { demand: 0, growth: 0 });
    }
    const stats = areaStats.get(area)!;
    stats.demand += Number(property.views || 0);
  });

  const hotAreas = Array.from(areaStats.entries())
    .map(([area, stats]) => ({
      area,
      demand: stats.demand,
      growth: stats.growth || 0,
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 5);

  // Predictions
  const currentPrice = Number(marketTrend.avgPrice || 0);
  const currentDemand = Number(marketTrend.monthlyDemand || marketTrend.weeklyDemand || marketTrend.dailyDemand || 0) * 30;
  const nextMonthPrice = currentPrice * (1 + changePercent / 100);
  const nextMonthDemand = currentDemand * (1 + (changePercent > 0 ? 0.1 : -0.05));

  return {
    city,
    avgPrice: currentPrice,
    dailyDemand: Number(marketTrend.dailyDemand || 0),
    weeklyDemand: Number(marketTrend.weeklyDemand || 0),
    monthlyDemand: Number(marketTrend.monthlyDemand || marketTrend.weeklyDemand || marketTrend.dailyDemand || 0) * 30,
    supply,
    demandSupplyRatio,
    salesVelocity,
    priceTrend,
    newProjects,
    topBrokers,
    hotAreas,
    predictions: {
      nextMonthPrice,
      nextMonthDemand,
      trendingAreas: hotAreas.slice(0, 3).map((a) => a.area),
    },
  };
}

/**
 * Get market intelligence for all cities
 */
export async function getAllMarketIntelligence(): Promise<MarketIntelligence[]> {
  const allTrends = await storage.getAllMarketTrends();
  const cities = Array.from(new Set(allTrends.map((t) => t.city)));
  
  const intelligencePromises = cities.map((city) => getMarketIntelligence(city));
  const results = await Promise.all(intelligencePromises);
  
  return results.filter((r) => r !== null) as MarketIntelligence[];
}

