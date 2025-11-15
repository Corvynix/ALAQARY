import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../../storage";
import * as clientQualification from "../services/clientQualification";
import * as marketHeatmap from "../services/marketHeatmap";
import * as agentRanking from "../services/agentRanking";
import * as propertyRecommendations from "../services/propertyRecommendations";
import * as closingProbability from "../services/closingProbability";
import * as behaviorAnalysis from "../services/behaviorAnalysis";
import type { MarketTrend, Lead, Agent } from "@shared/schema";

/**
 * GET /api/intelligence/client/:id/qualification
 * Get client qualification score and analysis
 */
export async function getClientQualification(req: Request, res: Response) {
  try {
    const clientId = req.params.id;

    const client = await storage.getLeadById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Get market average price for the client's target city
    let avgMarketPrice: number | undefined;
    if (client.city) {
      const marketTrends = await storage.listMarketTrends();
      const cityTrend = marketTrends.find(
        (t: MarketTrend) => t.city.toLowerCase() === client.city?.toLowerCase()
      );
      if (cityTrend && cityTrend.avgPrice) {
        avgMarketPrice = parseFloat(cityTrend.avgPrice);
      }
    }

    const result = clientQualification.calculateClientQualification(
      client,
      avgMarketPrice
    );

    return res.json({
      clientId: client.id,
      clientName: client.name,
      ...result,
    });
  } catch (error) {
    console.error("Error calculating client qualification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/market/heatmap
 * Get market heatmap with investment opportunities
 */
export async function getMarketHeatmap(req: Request, res: Response) {
  try {
    const trends = await storage.listMarketTrends();
    const heatmap = marketHeatmap.generateMarketHeatmap(trends);

    return res.json({
      areas: heatmap,
      timestamp: new Date().toISOString(),
      totalAreas: heatmap.length,
    });
  } catch (error) {
    console.error("Error generating market heatmap:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/agent/rankings
 * Get agent performance rankings
 */
export async function getAgentRankings(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    const agents = await storage.listAgents();
    const rankings = agentRanking.rankAgents(agents);

    return res.json({
      rankings: rankings.slice(0, limit),
      timestamp: new Date().toISOString(),
      totalAgents: agents.length,
    });
  } catch (error) {
    console.error("Error generating agent rankings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/agent/:id/performance
 * Get specific agent performance analysis
 */
export async function getAgentPerformance(req: Request, res: Response) {
  try {
    const agentId = req.params.id;

    const agent = await storage.getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const allAgents = await storage.listAgents();
    const rankings = agentRanking.rankAgents(allAgents);
    const agentRank = rankings.find((r) => r.agentId === agentId);

    return res.json({
      agent,
      performance: agentRank,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting agent performance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/property/:clientId/recommendations
 * Get personalized property recommendations for a client
 */
export async function getPropertyRecommendations(req: Request, res: Response) {
  try {
    const clientId = req.params.clientId;
    const limit = parseInt(req.query.limit as string) || 10;

    const client = await storage.getLeadById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const properties = await storage.listProperties();
    const recommendations = propertyRecommendations.recommendProperties(
      client,
      properties,
      limit
    );

    return res.json({
      clientId: client.id,
      clientName: client.name,
      recommendations,
      timestamp: new Date().toISOString(),
      totalRecommendations: recommendations.length,
    });
  } catch (error) {
    console.error("Error generating property recommendations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /api/intelligence/predict/closing
 * Predict closing probability for a specific deal scenario
 * Body: { agentId, clientId, propertyId }
 */
export async function predictClosingProbability(req: Request, res: Response) {
  try {
    const schema = z.object({
      agentId: z.string(),
      clientId: z.string(),
      propertyId: z.string(),
    });

    const { agentId, clientId, propertyId } = schema.parse(req.body);

    const [agent, client, property] = await Promise.all([
      storage.getAgentById(agentId),
      storage.getLeadById(clientId),
      storage.getPropertyById(propertyId),
    ]);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const prediction = closingProbability.calculateClosingProbability(
      agent,
      client,
      property
    );

    return res.json({
      agent: { id: agent.id, name: agent.name },
      client: { id: client.id, name: client.name },
      property: { id: property.id, title: property.title },
      ...prediction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error predicting closing probability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/behavior/triggers
 * Get behavior trigger analysis
 */
export async function getBehaviorTriggers(req: Request, res: Response) {
  try {
    const behaviors = await storage.listUserBehaviors();
    
    // Get converted leads (those with high purchase probability or in purchase stage)
    const leads = await storage.listLeads();
    const conversions = new Set<string>(
      leads
        .filter((l: Lead) => 
          l.funnelStage === "purchase" || parseFloat(l.purchaseProbability || "0") >= 0.7
        )
        .map((l: Lead) => l.id)
    );

    const analysis = behaviorAnalysis.analyzeBehaviorTriggers(behaviors, conversions);

    return res.json({
      ...analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing behavior triggers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/behavior/patterns
 * Get behavior pattern analysis
 */
export async function getBehaviorPatterns(req: Request, res: Response) {
  try {
    const behaviors = await storage.listUserBehaviors();
    
    const leads = await storage.listLeads();
    const conversions = new Set<string>(
      leads
        .filter((l: Lead) => 
          l.funnelStage === "purchase" || parseFloat(l.purchaseProbability || "0") >= 0.7
        )
        .map((l: Lead) => l.id)
    );

    const analysis = behaviorAnalysis.analyzeBehaviorTriggers(behaviors, conversions);

    return res.json({
      patterns: analysis.patterns,
      summary: analysis.summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing behavior patterns:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /api/intelligence/behavior/track
 * Track a behavior event
 * Body: UserBehavior data
 */
export async function trackBehaviorEvent(req: Request, res: Response) {
  try {
    const schema = z.object({
      sessionId: z.string(),
      leadId: z.string().optional(),
      behaviorType: z.string(),
      action: z.string(),
      target: z.string().optional(),
      targetId: z.string().optional(),
      metadata: z.string().optional(),
      timeSpent: z.string().or(z.number()).optional(),
      scrollDepth: z.string().or(z.number()).optional(),
      pageUrl: z.string().optional(),
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
    });

    const data = schema.parse(req.body);

    // Convert numbers to strings for storage
    const behaviorData = {
      ...data,
      timeSpent: data.timeSpent?.toString(),
      scrollDepth: data.scrollDepth?.toString(),
    };

    const behavior = await storage.createUserBehavior(behaviorData);

    return res.status(201).json({
      success: true,
      behaviorId: behavior.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    console.error("Error tracking behavior event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/intelligence/overview/stats
 * Get overview statistics for admin dashboard
 */
export async function getOverviewStats(req: Request, res: Response) {
  try {
    const [leads, agents, properties, behaviors, trends] = await Promise.all([
      storage.listLeads(),
      storage.listAgents(),
      storage.listProperties(),
      storage.listUserBehaviors(),
      storage.listMarketTrends(),
    ]);

    // Calculate high-level stats
    const hotLeads = leads.filter((l: Lead) => 
      parseFloat(l.purchaseProbability || "0") >= 0.7 || 
      l.funnelStage === "purchase" || 
      l.funnelStage === "intent"
    ).length;

    const topAgents = agentRanking.getTopAgents(agents, 5);
    const heatmap = marketHeatmap.generateMarketHeatmap(trends);
    const hotMarkets = heatmap.filter((h) => h.recommendation === "hot").length;

    const avgClosingRate = agents.length > 0
      ? agents.reduce((sum: number, a: Agent) => sum + parseFloat(a.closingRate || "0"), 0) / agents.length
      : 0;

    return res.json({
      summary: {
        totalLeads: leads.length,
        hotLeads,
        totalAgents: agents.length,
        totalProperties: properties.length,
        totalBehaviors: behaviors.length,
        avgClosingRate: Math.round(avgClosingRate),
        hotMarkets,
      },
      topAgents: topAgents.slice(0, 3).map((a) => ({
        name: a.name,
        score: a.overallScore,
        tier: a.tier,
      })),
      recentActivity: {
        lastBehaviorAt: behaviors[behaviors.length - 1]?.createdAt,
        lastLeadAt: leads[leads.length - 1]?.createdAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting overview stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
