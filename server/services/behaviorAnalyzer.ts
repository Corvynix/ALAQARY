import { storage } from "../storage";
import type { UserBehavior, Property, Content, Lead } from "@shared/schema";

export interface BehavioralInsights {
  mostEffectiveContent: Array<{ id: string; title: string; conversionRate: number }>;
  bestConvertingProperties: Array<{ id: string; title: string; conversionRate: number }>;
  commonObjections: Array<{ objection: string; count: number }>;
  peakEngagementTimes: Array<{ hour: number; engagement: number }>;
  averageTimeToTrust: number;
  averageTimeToPurchase: number;
}

/**
 * Analyze which content pieces are most effective at building trust
 */
export async function analyzeContentEffectiveness(): Promise<
  Array<{ id: string; title: string; conversionRate: number; views: number }>
> {
  const allBehaviors = await storage.getBehaviorsByType("content_interaction", 1000);
  const contentReads = allBehaviors.filter((b) => b.action === "read_content");
  
  // Group by content ID
  const contentStats = new Map<string, { views: number; conversions: number }>();
  
  for (const behavior of contentReads) {
    if (!behavior.targetId) continue;
    
    const stats = contentStats.get(behavior.targetId) || { views: 0, conversions: 0 };
    stats.views++;
    
    // Check if this content read led to form submission within same session
    const sessionBehaviors = await storage.getUserBehaviorsBySessionId(behavior.sessionId);
    const hasConversion = sessionBehaviors.some(
      (b) => b.createdAt > behavior.createdAt && b.action === "submit_form"
    );
    if (hasConversion) {
      stats.conversions++;
    }
    
    contentStats.set(behavior.targetId, stats);
  }

  // Get content titles
  const results = [];
  for (const [contentId, stats] of contentStats.entries()) {
    const content = await storage.getContentById(contentId);
    if (!content) continue;
    
    results.push({
      id: contentId,
      title: content.title,
      conversionRate: stats.views > 0 ? (stats.conversions / stats.views) * 100 : 0,
      views: stats.views,
    });
  }

  return results.sort((a, b) => b.conversionRate - a.conversionRate);
}

/**
 * Analyze which properties convert best
 */
export async function analyzePropertyConversion(): Promise<
  Array<{ id: string; title: string; conversionRate: number; views: number }>
> {
  const allBehaviors = await storage.getBehaviorsByType("property_interaction", 1000);
  const propertyViews = allBehaviors.filter((b) => b.action === "view_property");
  
  // Group by property ID
  const propertyStats = new Map<string, { views: number; conversions: number }>();
  
  for (const behavior of propertyViews) {
    if (!behavior.targetId) continue;
    
    const stats = propertyStats.get(behavior.targetId) || { views: 0, conversions: 0 };
    stats.views++;
    
    // Check if this property view led to form submission or WhatsApp click
    const sessionBehaviors = await storage.getUserBehaviorsBySessionId(behavior.sessionId);
    const hasConversion = sessionBehaviors.some(
      (b) =>
        b.createdAt > behavior.createdAt &&
        (b.action === "submit_form" || b.action === "click_whatsapp")
    );
    if (hasConversion) {
      stats.conversions++;
    }
    
    propertyStats.set(behavior.targetId, stats);
  }

  // Get property titles
  const results = [];
  for (const [propertyId, stats] of propertyStats.entries()) {
    const property = await storage.getPropertyById(propertyId);
    if (!property) continue;
    
    results.push({
      id: propertyId,
      title: property.title,
      conversionRate: stats.views > 0 ? (stats.conversions / stats.views) * 100 : 0,
      views: stats.views,
    });
  }

  return results.sort((a, b) => b.conversionRate - a.conversionRate);
}

/**
 * Extract common objections from form messages and behaviors
 */
export async function analyzeCommonObjections(): Promise<Array<{ objection: string; count: number }>> {
  const leads = await storage.getAllLeads();
  const objectionKeywords = [
    "expensive",
    "caro",
    "مكلف",
    "budget",
    "ميزانية",
    "price",
    "سعر",
    "location",
    "موقع",
    "not sure",
    "لست متأكد",
    "think",
    "أفكر",
    "wait",
    "انتظر",
  ];

  const objections = new Map<string, number>();

  for (const lead of leads) {
    if (!lead.message) continue;
    
    const message = lead.message.toLowerCase();
    for (const keyword of objectionKeywords) {
      if (message.includes(keyword.toLowerCase())) {
        objections.set(keyword, (objections.get(keyword) || 0) + 1);
      }
    }
  }

  return Array.from(objections.entries())
    .map(([objection, count]) => ({ objection, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Analyze peak engagement times
 */
export async function analyzePeakEngagementTimes(): Promise<Array<{ hour: number; engagement: number }>> {
  const allBehaviors = await storage.getBehaviorsByType("page_view", 5000);
  
  const hourStats = new Map<number, number>();
  
  for (const behavior of allBehaviors) {
    const hour = new Date(behavior.createdAt).getHours();
    hourStats.set(hour, (hourStats.get(hour) || 0) + 1);
  }

  const results = [];
  for (let hour = 0; hour < 24; hour++) {
    results.push({
      hour,
      engagement: hourStats.get(hour) || 0,
    });
  }

  return results.sort((a, b) => b.engagement - a.engagement);
}

/**
 * Calculate average time to reach trust stage
 */
export async function calculateAverageTimeToTrust(): Promise<number> {
  const leads = await storage.getAllLeads();
  const trustLeads = leads.filter((l) => l.funnelStage === "trust" || l.funnelStage === "desire" || l.funnelStage === "purchase");
  
  let totalTime = 0;
  let count = 0;

  for (const lead of trustLeads) {
    if (!lead.lastInteractionAt || !lead.createdAt) continue;
    
    const behaviors = await storage.getUserBehaviorsByLeadId(lead.id);
    const trustBehavior = behaviors.find((b) => 
      b.action === "submit_form" || b.action === "view_testimonials"
    );
    
    if (trustBehavior) {
      const timeDiff = new Date(trustBehavior.createdAt).getTime() - new Date(lead.createdAt).getTime();
      totalTime += timeDiff / (1000 * 60); // Convert to minutes
      count++;
    }
  }

  return count > 0 ? Math.round(totalTime / count) : 0;
}

/**
 * Calculate average time to purchase
 */
export async function calculateAverageTimeToPurchase(): Promise<number> {
  const transactions = await storage.getAllTransactions();
  
  let totalTime = 0;
  let count = 0;

  for (const transaction of transactions) {
    if (!transaction.purchaseDate) continue;
    
    const lead = await storage.getLeadById(transaction.leadId);
    if (!lead || !lead.createdAt) continue;
    
    const timeDiff = new Date(transaction.purchaseDate).getTime() - new Date(lead.createdAt).getTime();
    totalTime += timeDiff / (1000 * 60 * 60 * 24); // Convert to days
    count++;
  }

  return count > 0 ? Math.round(totalTime / count) : 0;
}

/**
 * Get comprehensive behavioral insights
 */
export async function getBehavioralInsights(): Promise<BehavioralInsights> {
  const [contentEffectiveness, propertyConversion, objections, peakTimes, avgTrustTime, avgPurchaseTime] =
    await Promise.all([
      analyzeContentEffectiveness(),
      analyzePropertyConversion(),
      analyzeCommonObjections(),
      analyzePeakEngagementTimes(),
      calculateAverageTimeToTrust(),
      calculateAverageTimeToPurchase(),
    ]);

  return {
    mostEffectiveContent: contentEffectiveness.slice(0, 5),
    bestConvertingProperties: propertyConversion.slice(0, 5),
    commonObjections: objections.slice(0, 10),
    peakEngagementTimes: peakTimes.slice(0, 5),
    averageTimeToTrust: avgTrustTime,
    averageTimeToPurchase: avgPurchaseTime,
  };
}

