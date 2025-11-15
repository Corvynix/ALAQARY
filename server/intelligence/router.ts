import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import * as controllers from "./controllers/index";

export const intelligenceRouter = Router();

// Public endpoint - Behavior Event Tracking (can be called by frontend)
// MUST be before admin middleware to remain public
intelligenceRouter.post(
  "/behavior/track",
  controllers.trackBehaviorEvent
);

// All other intelligence endpoints require admin authentication
intelligenceRouter.use(requireAuth, (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
});

// Client Intelligence Routes
intelligenceRouter.get(
  "/client/:id/qualification",
  controllers.getClientQualification
);

// Market Intelligence Routes
intelligenceRouter.get(
  "/market/heatmap",
  controllers.getMarketHeatmap
);

// Agent Intelligence Routes
intelligenceRouter.get(
  "/agent/rankings",
  controllers.getAgentRankings
);

intelligenceRouter.get(
  "/agent/:id/performance",
  controllers.getAgentPerformance
);

// Property Intelligence Routes
intelligenceRouter.get(
  "/property/:clientId/recommendations",
  controllers.getPropertyRecommendations
);

// Predictive Intelligence Routes
intelligenceRouter.post(
  "/predict/closing",
  controllers.predictClosingProbability
);

// Behavior Intelligence Routes
intelligenceRouter.get(
  "/behavior/triggers",
  controllers.getBehaviorTriggers
);

intelligenceRouter.get(
  "/behavior/patterns",
  controllers.getBehaviorPatterns
);

// Overview/Summary Routes
intelligenceRouter.get(
  "/overview/stats",
  controllers.getOverviewStats
);

export default intelligenceRouter;
