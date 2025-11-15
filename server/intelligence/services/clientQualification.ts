import type { Lead } from "@shared/schema";

export interface QualificationResult {
  score: number; // 0-1
  factors: {
    budgetMatch: number;
    engagementLevel: number;
    behavioralScore: number;
    timelinessScore: number;
  };
  reasons: string[];
  recommendation: "hot" | "warm" | "cold";
}

/**
 * Calculate client qualification score based on multiple factors
 * Returns a score from 0 (unqualified) to 1 (highly qualified)
 */
export function calculateClientQualification(
  lead: Lead,
  averageMarketPrice?: number
): QualificationResult {
  const factors = {
    budgetMatch: 0,
    engagementLevel: 0,
    behavioralScore: 0,
    timelinessScore: 0,
  };
  const reasons: string[] = [];

  // 1. Budget Match (30% weight)
  if (lead.budget && averageMarketPrice) {
    const budgetNum = parseBudget(lead.budget);
    if (budgetNum >= averageMarketPrice * 0.8) {
      factors.budgetMatch = 1.0;
      reasons.push("Budget aligns with market prices");
    } else if (budgetNum >= averageMarketPrice * 0.5) {
      factors.budgetMatch = 0.6;
      reasons.push("Budget is moderate for target area");
    } else {
      factors.budgetMatch = 0.3;
      reasons.push("Budget below market average");
    }
  } else if (lead.budget) {
    factors.budgetMatch = 0.5; // Has budget but no market comparison
    reasons.push("Budget provided");
  }

  // 2. Engagement Level - Funnel Stage (30% weight)
  const funnelStages: Record<string, number> = {
    curiosity: 0.2,
    interest: 0.4,
    consideration: 0.6,
    intent: 0.8,
    purchase: 1.0,
  };
  
  factors.engagementLevel = funnelStages[lead.funnelStage || "curiosity"] || 0.2;
  
  if (factors.engagementLevel >= 0.8) {
    reasons.push("High engagement - ready to purchase");
  } else if (factors.engagementLevel >= 0.6) {
    reasons.push("Actively considering options");
  } else {
    reasons.push("Early exploration stage");
  }

  // 3. Behavioral Score (25% weight)
  const purchaseProbability = parseFloat(lead.purchaseProbability || "0");
  factors.behavioralScore = purchaseProbability;
  
  if (purchaseProbability >= 0.7) {
    reasons.push("Strong buying signals detected");
  } else if (purchaseProbability >= 0.4) {
    reasons.push("Moderate interest indicators");
  }

  // 4. Timeliness Score (15% weight)
  if (lead.lastInteractionAt) {
    const daysSinceInteraction = Math.floor(
      (Date.now() - new Date(lead.lastInteractionAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceInteraction <= 1) {
      factors.timelinessScore = 1.0;
      reasons.push("Very recent interaction");
    } else if (daysSinceInteraction <= 3) {
      factors.timelinessScore = 0.8;
      reasons.push("Recent activity");
    } else if (daysSinceInteraction <= 7) {
      factors.timelinessScore = 0.5;
      reasons.push("Active within last week");
    } else {
      factors.timelinessScore = 0.2;
      reasons.push("Not recently active");
    }
  } else {
    factors.timelinessScore = 0.5; // Default for new leads
  }

  // Calculate weighted score
  const score = 
    factors.budgetMatch * 0.3 +
    factors.engagementLevel * 0.3 +
    factors.behavioralScore * 0.25 +
    factors.timelinessScore * 0.15;

  // Determine recommendation
  let recommendation: "hot" | "warm" | "cold";
  if (score >= 0.7) {
    recommendation = "hot";
    reasons.push("🔥 High-priority lead - immediate follow-up recommended");
  } else if (score >= 0.4) {
    recommendation = "warm";
    reasons.push("⚡ Promising lead - nurture with targeted content");
  } else {
    recommendation = "cold";
    reasons.push("❄️ Early-stage lead - continue education phase");
  }

  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimals
    factors,
    reasons,
    recommendation,
  };
}

/**
 * Parse budget string to numeric value
 * Handles Arabic and English formats
 */
function parseBudget(budget: string): number {
  // Remove currency symbols and convert Arabic numerals
  const cleaned = budget
    .replace(/[,،]/g, "")
    .replace(/\s/g, "")
    .replace(/[^\d.]/g, "");
  
  const num = parseFloat(cleaned);
  
  // Handle "million" notation
  if (budget.includes("مليون") || budget.toLowerCase().includes("m")) {
    return num * 1000000;
  }
  
  // Handle "thousand" notation
  if (budget.includes("ألف") || budget.toLowerCase().includes("k")) {
    return num * 1000;
  }
  
  return num || 0;
}
