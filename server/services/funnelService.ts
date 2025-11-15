import { storage } from "../storage";
import type { Lead, UserBehavior } from "@shared/schema";

export type FunnelStage = "curiosity" | "understanding" | "trust" | "desire" | "purchase";

export interface StageIndicators {
  stage: FunnelStage;
  probability: number;
  triggers: string[];
}

/**
 * Calculate the appropriate funnel stage based on user behaviors
 */
export async function calculateFunnelStage(
  sessionId: string,
  leadId?: string
): Promise<StageIndicators> {
  const behaviors = leadId
    ? await storage.getUserBehaviorsByLeadId(leadId)
    : await storage.getUserBehaviorsBySessionId(sessionId);

  if (behaviors.length === 0) {
    return {
      stage: "curiosity",
      probability: 10,
      triggers: ["first_visit"],
    };
  }

  // Analyze behaviors
  const propertyViews = behaviors.filter((b) => b.action === "view_property").length;
  const contentReads = behaviors.filter((b) => b.action === "read_content").length;
  const formSubmissions = behaviors.filter((b) => b.action === "submit_form").length;
  const calculatorUsage = behaviors.filter((b) => b.action === "use_calculator").length;
  const whatsappClicks = behaviors.filter((b) => b.action === "click_whatsapp").length;
  const testimonialViews = behaviors.filter((b) => b.action === "view_testimonials").length;
  const repeatedPropertyViews = behaviors.filter(
    (b) => b.action === "view_property" && b.timeSpent && Number(b.timeSpent) > 30
  ).length;
  const returnVisits = behaviors.filter((b) => b.action === "return_visit").length;

  // Calculate probability score (0-100)
  let probability = 10;
  const triggers: string[] = [];

  // Stage 1: Curiosity (default)
  if (behaviors.length > 0) {
    probability += 10;
    triggers.push("page_view");
  }

  // Stage 2: Understanding
  if (propertyViews >= 3 || contentReads >= 2 || calculatorUsage >= 1) {
    probability = Math.max(probability, 35);
    if (propertyViews >= 3) triggers.push("multiple_property_views");
    if (contentReads >= 2) triggers.push("content_engagement");
    if (calculatorUsage >= 1) triggers.push("calculator_usage");
    
    if (propertyViews >= 3 && contentReads >= 1) {
      return {
        stage: "understanding",
        probability: Math.min(probability + 15, 50),
        triggers: [...triggers, "educational_engagement"],
      };
    }
  }

  // Stage 3: Trust
  if (
    formSubmissions >= 1 ||
    testimonialViews >= 2 ||
    returnVisits >= 1 ||
    (propertyViews >= 5 && contentReads >= 2)
  ) {
    probability = Math.max(probability, 60);
    if (formSubmissions >= 1) triggers.push("form_submission");
    if (testimonialViews >= 2) triggers.push("testimonial_views");
    if (returnVisits >= 1) triggers.push("return_visit");
    
    if (formSubmissions >= 1 || (returnVisits >= 1 && testimonialViews >= 1)) {
      return {
        stage: "trust",
        probability: Math.min(probability + 20, 75),
        triggers: [...triggers, "trust_building"],
      };
    }
  }

  // Stage 4: Desire
  if (
    repeatedPropertyViews >= 3 ||
    whatsappClicks >= 1 ||
    (propertyViews >= 5 && returnVisits >= 2) ||
    (formSubmissions >= 1 && repeatedPropertyViews >= 1)
  ) {
    probability = Math.max(probability, 80);
    if (repeatedPropertyViews >= 3) triggers.push("repeated_property_interest");
    if (whatsappClicks >= 1) triggers.push("whatsapp_contact");
    if (propertyViews >= 5 && returnVisits >= 2) triggers.push("high_engagement");
    
    if (repeatedPropertyViews >= 3 || whatsappClicks >= 1) {
      return {
        stage: "desire",
        probability: Math.min(probability + 15, 90),
        triggers: [...triggers, "high_intent"],
      };
    }
  }

  // Determine decision type
  const decisionType = getDecisionType(behaviors, returnVisits);

  // Return current stage based on probability
  if (probability >= 80) {
    return { stage: "desire", probability, triggers };
  } else if (probability >= 60) {
    return { stage: "trust", probability, triggers };
  } else if (probability >= 35) {
    return { stage: "understanding", probability, triggers };
  } else {
    return { stage: "curiosity", probability, triggers };
  }
}

/**
 * Determine client decision type based on behaviors
 */
function getDecisionType(behaviors: UserBehavior[], returnVisits: number): "fast" | "hesitant" | "researcher" {
  const avgTimeSpent = behaviors.reduce((sum, b) => sum + (Number(b.timeSpent) || 0), 0) / behaviors.length;
  
  if (returnVisits === 0 && behaviors.length > 5 && avgTimeSpent < 20) {
    return "fast";
  } else if (returnVisits >= 3 || behaviors.length > 15) {
    return "researcher";
  } else {
    return "hesitant";
  }
}

/**
 * Update lead funnel stage based on behaviors
 */
export async function updateLeadFunnelStage(
  leadId: string,
  sessionId?: string
): Promise<Lead | undefined> {
  const lead = await storage.getLeadById(leadId);
  if (!lead) return undefined;

  const indicators = await calculateFunnelStage(sessionId || lead.sessionId || "", leadId);
  
  const decisionType = getDecisionType(
    leadId ? await storage.getUserBehaviorsByLeadId(leadId) : [],
    leadId ? (await storage.getUserBehaviorsByLeadId(leadId)).filter((b) => b.action === "return_visit").length : 0
  );

  return await storage.updateLead(leadId, {
    funnelStage: indicators.stage,
    purchaseProbability: indicators.probability.toString(),
    decisionType,
    behavioralTriggers: indicators.triggers.join(", "),
    lastInteractionAt: new Date(),
  });
}

/**
 * Check if lead should be flagged as high-intent
 */
export async function isHighIntentClient(leadId: string): Promise<boolean> {
  const lead = await storage.getLeadById(leadId);
  if (!lead) return false;

  const probability = Number(lead.purchaseProbability) || 0;
  const stage = lead.funnelStage as FunnelStage;

  return probability >= 75 || stage === "desire" || stage === "purchase";
}

