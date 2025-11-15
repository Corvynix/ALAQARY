import type { Property } from "@shared/schema";
import type { Lead } from "@shared/schema";

export interface PropertyRecommendation {
  propertyId: string;
  property: Property;
  matchScore: number; // 0-1
  matchFactors: {
    priceMatch: number;
    locationMatch: number;
    preferenceMatch: number;
    featuresMatch: number;
  };
  reasons: string[];
  priority: "high" | "medium" | "low";
}

/**
 * Recommend properties for a client based on their profile and preferences
 * Returns sorted list from best match to worst
 */
export function recommendProperties(
  client: Lead,
  allProperties: Property[],
  limit: number = 10
): PropertyRecommendation[] {
  if (!allProperties || allProperties.length === 0) {
    return [];
  }

  // Filter only available properties
  const availableProperties = allProperties.filter((p) => p.status === "available");

  // Score each property
  const recommendations = availableProperties.map((property) => {
    const matchFactors = {
      priceMatch: calculatePriceMatch(client, property),
      locationMatch: calculateLocationMatch(client, property),
      preferenceMatch: calculatePreferenceMatch(client, property),
      featuresMatch: calculateFeaturesMatch(client, property),
    };

    const reasons: string[] = [];

    // Price analysis
    if (matchFactors.priceMatch >= 0.9) {
      reasons.push("💰 Perfect price match for budget");
    } else if (matchFactors.priceMatch >= 0.7) {
      reasons.push("💵 Good value within budget");
    } else if (matchFactors.priceMatch < 0.5) {
      reasons.push("⚠️ Above typical budget");
    }

    // Location analysis
    if (matchFactors.locationMatch === 1.0) {
      reasons.push("📍 Exact location match");
    } else if (matchFactors.locationMatch >= 0.7) {
      reasons.push("🗺️ Near desired area");
    }

    // Property features
    if (property.developer) {
      reasons.push(`🏗️ By ${property.developer}`);
    }

    if (property.deliveryTime) {
      reasons.push(`⏰ Ready ${property.deliveryTime}`);
    }

    if (property.paymentPlan) {
      reasons.push(`💳 ${property.paymentPlan}`);
    }

    if (property.services && property.services.length > 0) {
      const servicesCount = property.services.length;
      reasons.push(`✨ ${servicesCount} premium amenities`);
    }

    // Demand indicators
    if (property.demandIndicator === "high") {
      reasons.push("🔥 High demand - act fast");
    }

    const realSalesRate = parseFloat(property.realSalesRate || "0");
    if (realSalesRate > 0.7) {
      reasons.push("📈 Fast-selling property");
    }

    // Calculate weighted match score
    const matchScore =
      matchFactors.priceMatch * 0.35 +        // 35% - Price most important
      matchFactors.locationMatch * 0.30 +     // 30% - Location critical
      matchFactors.preferenceMatch * 0.20 +   // 20% - Preferences
      matchFactors.featuresMatch * 0.15;      // 15% - Features bonus

    // Determine priority
    let priority: "high" | "medium" | "low";
    if (matchScore >= 0.7) {
      priority = "high";
      reasons.push("⭐ HIGHLY RECOMMENDED - Excellent match");
    } else if (matchScore >= 0.5) {
      priority = "medium";
      reasons.push("👍 GOOD OPTION - Worth considering");
    } else {
      priority = "low";
      reasons.push("💭 ALTERNATIVE - May not be ideal fit");
    }

    return {
      propertyId: property.id,
      property,
      matchScore: Math.round(matchScore * 100) / 100,
      matchFactors,
      reasons,
      priority,
    };
  });

  // Sort by match score (highest first) and limit results
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Calculate price match score
 */
function calculatePriceMatch(client: Lead, property: Property): number {
  if (!client.budget) return 0.5; // No budget info

  const budget = parseBudget(client.budget);
  const price = parseFloat(property.price);

  if (budget === 0) return 0.5;

  const priceRatio = price / budget;

  // Perfect match: property is 80-100% of budget
  if (priceRatio >= 0.8 && priceRatio <= 1.0) return 1.0;
  
  // Good match: property is 100-120% of budget (stretch budget)
  if (priceRatio > 1.0 && priceRatio <= 1.2) return 0.7;
  
  // Affordable: property is 50-80% of budget
  if (priceRatio >= 0.5 && priceRatio < 0.8) return 0.8;
  
  // Too expensive: > 120% of budget
  if (priceRatio > 1.2) return Math.max(0, 1 - (priceRatio - 1.2) * 0.5);
  
  // Too cheap: < 50% of budget (may not meet expectations)
  return 0.4;
}

/**
 * Calculate location match score
 */
function calculateLocationMatch(client: Lead, property: Property): number {
  if (!client.city) return 0.5; // No location preference

  const clientCity = client.city.toLowerCase().trim();
  const propertyCity = property.city.toLowerCase().trim();

  if (clientCity === propertyCity) return 1.0;
  
  // Check if one contains the other (e.g., "New Cairo" vs "Cairo")
  if (clientCity.includes(propertyCity) || propertyCity.includes(clientCity)) {
    return 0.8;
  }

  return 0.2; // Different location
}

/**
 * Calculate preference match based on purpose
 */
function calculatePreferenceMatch(client: Lead, property: Property): number {
  if (!client.purpose) return 0.5;

  const purpose = client.purpose.toLowerCase();
  const propertyType = property.propertyType.toLowerCase();

  // Investment purpose
  if (purpose.includes("investment") || purpose.includes("استثمار")) {
    const salesRate = parseFloat(property.realSalesRate || "0");
    if (salesRate > 0.7) return 1.0;
    if (property.demandIndicator === "high") return 0.9;
    return 0.6;
  }

  // Living/residence purpose
  if (purpose.includes("living") || purpose.includes("سكن") || purpose.includes("residence")) {
    if (propertyType.includes("apartment") || propertyType.includes("villa")) {
      return 1.0;
    }
    return 0.7;
  }

  return 0.5;
}

/**
 * Calculate features match score
 */
function calculateFeaturesMatch(client: Lead, property: Property): number {
  let score = 0.5; // Base score

  // Check if property has services/amenities
  if (property.services && property.services.length > 0) {
    score += 0.2;
  }

  // Developer reputation
  if (property.developer) {
    score += 0.1;
  }

  // Payment flexibility
  if (property.paymentPlan) {
    score += 0.1;
    
    const cashPercentage = parseFloat(property.cashPercentage || "100");
    if (cashPercentage < 30) {
      score += 0.1; // Flexible payment
    }
  }

  return Math.min(score, 1.0);
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
