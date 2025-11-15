import type { Agent } from "@shared/schema";

export interface AgentRank {
  agentId: string;
  name: string;
  rank: number;
  overallScore: number; // 0-1
  metrics: {
    closingScore: number;
    volumeScore: number;
    revenueScore: number;
    speedScore: number;
  };
  strengths: string[];
  stats: {
    closingRate: number;
    totalDeals: number;
    totalRevenue: number;
    averageDealPrice: number;
    responseSpeed: number;
  };
  tier: "elite" | "top" | "rising" | "developing";
}

/**
 * Rank agents by performance across multiple dimensions
 * Returns sorted leaderboard from best to worst
 */
export function rankAgents(agents: Agent[]): AgentRank[] {
  if (!agents || agents.length === 0) {
    return [];
  }

  // Calculate max values for normalization
  const maxDeals = Math.max(...agents.map((a) => parseFloat(a.totalDeals || "0")));
  const maxRevenue = Math.max(...agents.map((a) => parseFloat(a.totalRevenue || "0")));
  const minResponseSpeed = Math.min(
    ...agents.map((a) => parseFloat(a.responseSpeed || "999")).filter((s) => s > 0)
  );

  const rankings = agents.map((agent) => {
    const closingRate = parseFloat(agent.closingRate || "0");
    const totalDeals = parseFloat(agent.totalDeals || "0");
    const totalRevenue = parseFloat(agent.totalRevenue || "0");
    const averageDealPrice = parseFloat(agent.averageDealPrice || "0");
    const responseSpeed = parseFloat(agent.responseSpeed || "60");

    const metrics = {
      closingScore: closingRate / 100, // Convert percentage to 0-1
      volumeScore: maxDeals > 0 ? totalDeals / maxDeals : 0,
      revenueScore: maxRevenue > 0 ? totalRevenue / maxRevenue : 0,
      // Fix speedScore: Guard against division by zero and cap at 1.0
      speedScore: responseSpeed > 0 && minResponseSpeed > 0 
        ? Math.min(minResponseSpeed / responseSpeed, 1.0) 
        : 0.5,
    };

    const strengths: string[] = [];

    // Analyze strengths
    if (closingRate >= 80) {
      strengths.push("🎯 Elite Closer - Exceptional conversion rate");
    } else if (closingRate >= 60) {
      strengths.push("✅ Strong Closer - Above average success");
    }

    if (totalDeals >= maxDeals * 0.8) {
      strengths.push("📊 High Volume - Top deal count");
    }

    if (totalRevenue >= maxRevenue * 0.8) {
      strengths.push("💰 Revenue Leader - Highest earnings");
    }

    if (averageDealPrice > 500000) {
      strengths.push("💎 Luxury Specialist - Premium properties");
    }

    if (responseSpeed <= 5) {
      strengths.push("⚡ Lightning Fast - Rapid response time");
    } else if (responseSpeed <= 15) {
      strengths.push("🏃 Quick Responder - Fast follow-up");
    }

    if (agent.activeProjects && agent.activeProjects.length > 5) {
      strengths.push("🏗️ Multi-Project Expert - Wide portfolio");
    }

    // Calculate weighted overall score
    const overallScore =
      metrics.closingScore * 0.4 +       // 40% - Most important
      metrics.volumeScore * 0.25 +       // 25% - Deal volume
      metrics.revenueScore * 0.25 +      // 25% - Revenue
      metrics.speedScore * 0.1;          // 10% - Speed bonus

    // Determine tier
    let tier: "elite" | "top" | "rising" | "developing";
    if (overallScore >= 0.8) {
      tier = "elite";
      strengths.push("🏆 ELITE PERFORMER - Top of the market");
    } else if (overallScore >= 0.6) {
      tier = "top";
      strengths.push("⭐ TOP PERFORMER - Consistently strong");
    } else if (overallScore >= 0.4) {
      tier = "rising";
      strengths.push("🌟 RISING STAR - Great potential");
    } else {
      tier = "developing";
      strengths.push("📈 DEVELOPING - Building track record");
    }

    return {
      agentId: agent.id,
      name: agent.name,
      rank: 0, // Will be set after sorting
      overallScore: Math.round(overallScore * 100) / 100,
      metrics,
      strengths,
      stats: {
        closingRate,
        totalDeals,
        totalRevenue,
        averageDealPrice,
        responseSpeed,
      },
      tier,
    };
  });

  // Sort by overall score (highest first) and assign ranks
  rankings.sort((a, b) => b.overallScore - a.overallScore);
  rankings.forEach((agent, index) => {
    agent.rank = index + 1;
  });

  return rankings;
}

/**
 * Get top N agents
 */
export function getTopAgents(agents: Agent[], limit: number = 10): AgentRank[] {
  const rankings = rankAgents(agents);
  return rankings.slice(0, limit);
}

/**
 * Find agents by tier
 */
export function getAgentsByTier(
  agents: Agent[],
  tier: "elite" | "top" | "rising" | "developing"
): AgentRank[] {
  const rankings = rankAgents(agents);
  return rankings.filter((r) => r.tier === tier);
}
