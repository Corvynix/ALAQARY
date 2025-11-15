import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Type Definitions for Intelligence API Responses
export interface MarketHeatArea {
  city: string;
  heatScore: number;
  priceChange: number;
  demandLevel: string;
  supplyLevel: string;
  velocity: number;
  insights: string;
  tier: string;
}

export interface MarketHeatmapResponse {
  areas: MarketHeatArea[];
  timestamp: string;
  totalAreas: number;
}

export interface AgentRanking {
  agentId: string;
  agentName: string;
  overallScore: number;
  tier: string;
  closingRate: number;
  totalDeals: number;
  totalRevenue: number;
  averageDealPrice: number;
  responseSpeed: number;
  metrics: {
    closingScore: number;
    volumeScore: number;
    revenueScore: number;
    speedScore: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  rank: number;
}

export interface AgentRankingsResponse {
  rankings: AgentRanking[];
  timestamp: string;
  totalAgents: number;
}

export interface AgentPerformanceResponse {
  agentId: string;
  agentName: string;
  overallScore: number;
  tier: string;
  rank: number;
  totalAgents: number;
  closingRate: number;
  totalDeals: number;
  totalRevenue: number;
  averageDealPrice: number;
  responseSpeed: number;
  metrics: {
    closingScore: number;
    volumeScore: number;
    revenueScore: number;
    speedScore: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  percentile: number;
}

export interface ClientQualificationResponse {
  clientId: string;
  clientName: string;
  qualificationScore: number;
  tier: string;
  factors: {
    budgetMatch: number;
    engagement: number;
    behavioralScore: number;
    timeliness: number;
  };
  insights: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  timestamp: string;
}

export interface PropertyRecommendation {
  propertyId: string;
  matchScore: number;
  reasoning: string;
  tier: string;
  property: {
    title: string;
    price: string;
    location: string;
    type: string;
    status: string;
  };
}

export interface PropertyRecommendationsResponse {
  clientId: string;
  recommendations: PropertyRecommendation[];
  totalMatches: number;
  timestamp: string;
}

export interface ClosingProbabilityResponse {
  probability: number;
  confidence: string;
  factors: {
    agentFactor: number;
    clientFactor: number;
    propertyFactor: number;
    matchFactor: number;
  };
  insights: {
    strengths: string[];
    risks: string[];
    recommendations: string[];
  };
  expectedCloseDate: string | null;
  timestamp: string;
}

export interface BehaviorTrigger {
  trigger: string;
  count: number;
  conversionRate: number;
  averageTimeTo: string;
  tier: string;
}

export interface BehaviorTriggersResponse {
  triggers: BehaviorTrigger[];
  totalTriggers: number;
  timestamp: string;
}

export interface BehaviorPattern {
  pattern: string;
  occurrences: number;
  conversionRate: number;
  averageSteps: number;
  insight: string;
}

export interface BehaviorPatternsResponse {
  patterns: BehaviorPattern[];
  totalPatterns: number;
  timestamp: string;
}

export interface OverviewStats {
  totalClients: number;
  qualifiedClients: number;
  totalAgents: number;
  topAgents: number;
  totalMarkets: number;
  hotMarkets: number;
  totalProperties: number;
  matchedProperties: number;
  avgClosingProbability: number;
  topTriggers: number;
}

export interface OverviewStatsResponse {
  stats: OverviewStats;
  timestamp: string;
}

// Custom Hooks for Intelligence Data

export function useMarketHeatmap(options?: UseQueryOptions<MarketHeatmapResponse>) {
  return useQuery<MarketHeatmapResponse>({
    queryKey: ['intelligence', 'market', 'heatmap'],
    ...options,
  });
}

export function useAgentRankings(options?: UseQueryOptions<AgentRankingsResponse>) {
  return useQuery<AgentRankingsResponse>({
    queryKey: ['intelligence', 'agent', 'rankings'],
    ...options,
  });
}

export function useAgentPerformance(agentId: string, options?: UseQueryOptions<AgentPerformanceResponse>) {
  return useQuery<AgentPerformanceResponse>({
    queryKey: ['intelligence', 'agent', agentId, 'performance'],
    enabled: !!agentId,
    ...options,
  });
}

export function useClientQualification(clientId: string, options?: UseQueryOptions<ClientQualificationResponse>) {
  return useQuery<ClientQualificationResponse>({
    queryKey: ['intelligence', 'client', clientId, 'qualification'],
    enabled: !!clientId,
    ...options,
  });
}

export function usePropertyRecommendations(clientId: string, options?: UseQueryOptions<PropertyRecommendationsResponse>) {
  return useQuery<PropertyRecommendationsResponse>({
    queryKey: ['intelligence', 'property', clientId, 'recommendations'],
    enabled: !!clientId,
    ...options,
  });
}

export function useClosingProbability() {
  return useMutation({
    mutationFn: async (params: { agentId: string; clientId: string; propertyId: string }): Promise<ClosingProbabilityResponse> => {
      const response = await apiRequest(
        'POST',
        `/api/intelligence/predict/closing`,
        params
      );
      return await response.json();
    },
  });
}

export function useBehaviorTriggers(options?: UseQueryOptions<BehaviorTriggersResponse>) {
  return useQuery<BehaviorTriggersResponse>({
    queryKey: ['intelligence', 'behavior', 'triggers'],
    ...options,
  });
}

export function useBehaviorPatterns(options?: UseQueryOptions<BehaviorPatternsResponse>) {
  return useQuery<BehaviorPatternsResponse>({
    queryKey: ['intelligence', 'behavior', 'patterns'],
    ...options,
  });
}

export function useOverviewStats(options?: UseQueryOptions<OverviewStatsResponse>) {
  return useQuery<OverviewStatsResponse>({
    queryKey: ['intelligence', 'overview', 'stats'],
    ...options,
  });
}

export function useTrackBehavior() {
  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      behaviorType: string;
      action: string;
      pageUrl?: string;
      elementId?: string;
      propertyId?: string;
      leadId?: string;
      metadata?: Record<string, any>;
    }): Promise<{ success: boolean; behaviorId: string; timestamp: string }> => {
      const response = await apiRequest(
        'POST',
        `/api/intelligence/behavior/track`,
        params
      );
      return await response.json();
    },
  });
}

// Adapter Functions to Transform API Data

export function adaptMarketHeatmapToLegacy(heatmap: MarketHeatmapResponse) {
  // Transform new heatmap format to legacy market intelligence format
  return heatmap.areas.map(area => ({
    city: area.city,
    avgPrice: area.priceChange > 0 ? "Rising" : area.priceChange < 0 ? "Falling" : "Stable",
    demandLevel: area.demandLevel,
    supply: area.supplyLevel,
    priceTrend: area.priceChange > 5 ? "up" : area.priceChange < -5 ? "down" : "stable",
    salesVelocity: area.velocity,
    heatScore: area.heatScore,
    insights: area.insights,
    tier: area.tier,
  }));
}

export function adaptAgentRankingToCard(ranking: AgentRanking) {
  return {
    id: ranking.agentId,
    name: ranking.agentName,
    closingRate: ranking.closingRate.toString(),
    totalDeals: ranking.totalDeals.toString(),
    totalRevenue: ranking.totalRevenue.toString(),
    averageDealPrice: ranking.averageDealPrice.toString(),
    responseSpeed: ranking.responseSpeed.toString(),
    overallScore: ranking.overallScore,
    tier: ranking.tier,
    rank: ranking.rank,
  };
}
