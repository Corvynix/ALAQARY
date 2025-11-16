import type { BuyerProfile, Property, Developer } from "@shared/schema";

export interface MatchScoreResult {
  matchScore: number;
  breakdown: Record<string, number>;
  explanation: string;
}

export function calculateMatchScore(
  profile: BuyerProfile,
  property: Property,
  developer: Developer | null
): MatchScoreResult {
  const breakdown: Record<string, number> = {};
  
  const budgetFit = profile.budgetMin && profile.budgetMax
    ? property.price >= profile.budgetMin && property.price <= profile.budgetMax
      ? 25
      : property.price < profile.budgetMin
        ? Math.max(0, 25 - ((profile.budgetMin - property.price) / profile.budgetMin) * 25)
        : Math.max(0, 25 - ((property.price - profile.budgetMax) / profile.budgetMax) * 25)
    : 15;
  breakdown.budgetFit = budgetFit;

  const locationMatch = profile.preferredCities?.includes(property.city) ? 20 : 5;
  breakdown.locationMatch = locationMatch;

  const typeMatch = profile.preferredTypes?.includes(property.type) ? 20 : 5;
  breakdown.typeMatch = typeMatch;

  const riskScore = property.riskIndicators?.length || 0;
  const riskAlignment = profile.riskTolerance === "high"
    ? 15
    : profile.riskTolerance === "medium"
      ? Math.max(0, 15 - riskScore * 3)
      : Math.max(0, 15 - riskScore * 5);
  breakdown.riskAlignment = riskAlignment;

  const developerTrust = developer?.trustScore
    ? (developer.trustScore / 100) * 10
    : 5;
  breakdown.developerTrust = developerTrust;

  const behavioralSignals = 10;
  breakdown.behavioralSignals = behavioralSignals;

  const matchScore = budgetFit + locationMatch + typeMatch + riskAlignment + developerTrust + behavioralSignals;

  const explanation = generateMatchExplanation(matchScore, breakdown, profile, property);

  return {
    matchScore: Math.round(matchScore),
    breakdown,
    explanation,
  };
}

function generateMatchExplanation(
  score: number,
  breakdown: Record<string, number>,
  profile: BuyerProfile,
  property: Property
): string {
  const explanations: string[] = [];

  if (breakdown.budgetFit >= 20) {
    explanations.push("Price is within your budget range");
  } else if (breakdown.budgetFit >= 10) {
    explanations.push("Price is close to your budget");
  } else {
    explanations.push("Price is outside your target range");
  }

  if (breakdown.locationMatch >= 15) {
    explanations.push(`Located in ${property.city}, one of your preferred cities`);
  }

  if (breakdown.typeMatch >= 15) {
    explanations.push(`${property.type} matches your property type preference`);
  }

  if (breakdown.riskAlignment >= 10) {
    explanations.push("Risk profile aligns with your tolerance");
  }

  if (breakdown.developerTrust >= 7) {
    explanations.push("Developer has a strong trust score");
  }

  return explanations.join(". ") + ".";
}

export function calculateTrustScore(developer: Developer): number {
  const totalContracts = developer.totalContracts ?? 0;
  const completedContracts = developer.completedContracts ?? 0;
  const completionRate = totalContracts > 0
    ? (completedContracts / totalContracts) * 100
    : 50;

  const complaints = developer.complaints ?? 0;
  const complaintPenalty = Math.min(complaints * 5, 30);

  const averageRating = developer.averageRating ?? 0;
  const ratingScore = (averageRating / 5) * 20;

  const yearsInBusiness = developer.yearsInBusiness ?? 0;
  const experienceScore = Math.min(yearsInBusiness * 2, 20);

  const trustScore = Math.max(0, Math.min(100,
    completionRate * 0.4 +
    ratingScore +
    experienceScore -
    complaintPenalty
  ));

  return Math.round(trustScore);
}
