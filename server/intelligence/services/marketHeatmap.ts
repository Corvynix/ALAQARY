import type { MarketTrend } from "@shared/schema";

export interface HeatmapArea {
  city: string;
  heatScore: number; // 0-1
  metrics: {
    priceScore: number;
    demandScore: number;
    velocityScore: number;
    supplyScore: number;
  };
  insights: string[];
  recommendation: "hot" | "warm" | "cold";
}

/**
 * Generate market heatmap showing investment opportunities by area
 * Higher score = better investment opportunity
 */
export function generateMarketHeatmap(trends: MarketTrend[]): HeatmapArea[] {
  if (!trends || trends.length === 0) {
    return [];
  }

  const heatmapAreas = trends.map((trend) => {
    const metrics = {
      priceScore: calculatePriceScore(trend),
      demandScore: calculateDemandScore(trend),
      velocityScore: calculateVelocityScore(trend),
      supplyScore: calculateSupplyScore(trend),
    };

    const insights: string[] = [];

    // Price analysis
    const changePercent = parseFloat(trend.changePercent || "0");
    if (changePercent > 10) {
      insights.push(`🚀 Fast price growth: +${changePercent}%`);
    } else if (changePercent > 5) {
      insights.push(`📈 Steady appreciation: +${changePercent}%`);
    } else if (changePercent < -5) {
      insights.push(`💎 Potential bargain: ${changePercent}%`);
    }

    // Demand analysis
    if (trend.demandLevel === "high") {
      insights.push("🔥 High buyer demand");
    } else if (trend.demandLevel === "medium") {
      insights.push("⚡ Moderate market activity");
    }

    // Velocity analysis
    const velocity = parseFloat(trend.salesVelocity || "0");
    if (velocity > 0.8) {
      insights.push("⏱️ Fast-moving properties");
    } else if (velocity > 0.5) {
      insights.push("🏃 Healthy sales pace");
    }

    // Supply analysis
    const supply = parseFloat(trend.supply || "0");
    if (supply < 50) {
      insights.push("⚠️ Limited inventory - act fast");
    } else if (supply > 200) {
      insights.push("🏢 Good selection available");
    }

    // New projects
    if (trend.newProjectIndicator && trend.newProjectIndicator !== "none") {
      insights.push("🏗️ New developments launching");
    }

    // Calculate overall heat score (weighted average)
    const heatScore =
      metrics.priceScore * 0.25 +
      metrics.demandScore * 0.35 +
      metrics.velocityScore * 0.25 +
      metrics.supplyScore * 0.15;

    // Determine recommendation
    let recommendation: "hot" | "warm" | "cold";
    if (heatScore >= 0.7) {
      recommendation = "hot";
      insights.push("🔥 HOT MARKET - Prime investment area");
    } else if (heatScore >= 0.4) {
      recommendation = "warm";
      insights.push("⚡ WARM MARKET - Good potential");
    } else {
      recommendation = "cold";
      insights.push("❄️ COOL MARKET - Wait or negotiate");
    }

    return {
      city: trend.city,
      heatScore: Math.round(heatScore * 100) / 100,
      metrics,
      insights,
      recommendation,
    };
  });

  // Sort by heat score (highest first)
  return heatmapAreas.sort((a, b) => b.heatScore - a.heatScore);
}

/**
 * Calculate price score based on growth and value
 */
function calculatePriceScore(trend: MarketTrend): number {
  const changePercent = parseFloat(trend.changePercent || "0");
  
  // Ideal: 5-15% growth (not too hot, not cold)
  if (changePercent >= 5 && changePercent <= 15) {
    return 1.0;
  } else if (changePercent >= 15 && changePercent <= 25) {
    return 0.8; // Growing fast but may be overheated
  } else if (changePercent >= 0 && changePercent < 5) {
    return 0.6; // Stable
  } else if (changePercent < 0 && changePercent >= -10) {
    return 0.7; // Potential bargain
  } else {
    return 0.3; // Declining market
  }
}

/**
 * Calculate demand score
 */
function calculateDemandScore(trend: MarketTrend): number {
  const demandLevel = trend.demandLevel?.toLowerCase();
  
  if (demandLevel === "high") return 1.0;
  if (demandLevel === "medium") return 0.6;
  if (demandLevel === "low") return 0.3;
  
  // Fallback to daily/weekly/monthly demand
  const dailyDemand = parseFloat(trend.dailyDemand || "0");
  const weeklyDemand = parseFloat(trend.weeklyDemand || "0");
  
  if (dailyDemand > 10 || weeklyDemand > 50) return 0.9;
  if (dailyDemand > 5 || weeklyDemand > 25) return 0.6;
  
  return 0.3;
}

/**
 * Calculate sales velocity score
 */
function calculateVelocityScore(trend: MarketTrend): number {
  const velocity = parseFloat(trend.salesVelocity || "0");
  
  if (velocity >= 0.8) return 1.0;  // Very fast
  if (velocity >= 0.6) return 0.8;  // Fast
  if (velocity >= 0.4) return 0.6;  // Moderate
  if (velocity >= 0.2) return 0.4;  // Slow
  
  return 0.2; // Very slow
}

/**
 * Calculate supply score
 * Lower supply with high demand = higher score
 */
function calculateSupplyScore(trend: MarketTrend): number {
  const supply = parseFloat(trend.supply || "100");
  
  // Ideal: 30-100 units (balanced market)
  if (supply >= 30 && supply <= 100) return 1.0;
  if (supply < 30) return 0.8;  // Low supply - competitive
  if (supply <= 200) return 0.6; // Good availability
  
  return 0.3; // Oversupply
}
