import type { UserBehavior } from "@shared/schema";

export interface BehaviorTrigger {
  trigger: string;
  frequency: number;
  conversionRate: number;
  avgTimeSpent: number;
  topPages: string[];
  insights: string[];
}

export interface BehaviorPattern {
  pattern: string;
  occurrences: number;
  avgScrollDepth: number;
  successRate: number;
  recommendation: string;
}

export interface BehaviorAnalysisResult {
  triggers: BehaviorTrigger[];
  patterns: BehaviorPattern[];
  summary: {
    totalBehaviors: number;
    uniqueSessions: number;
    avgTimeSpent: number;
    topActions: string[];
  };
}

/**
 * Analyze user behavior patterns to identify conversion triggers
 * Returns insights about what actions/pages lead to conversions
 */
export function analyzeBehaviorTriggers(
  behaviors: UserBehavior[],
  conversions?: Set<string> // leadIds that converted
): BehaviorAnalysisResult {
  if (!behaviors || behaviors.length === 0) {
    return {
      triggers: [],
      patterns: [],
      summary: {
        totalBehaviors: 0,
        uniqueSessions: 0,
        avgTimeSpent: 0,
        topActions: [],
      },
    };
  }

  // Group behaviors by action type
  const actionGroups: Map<string, UserBehavior[]> = new Map();
  const sessionSet = new Set<string>();
  let totalTimeSpent = 0;

  behaviors.forEach((behavior) => {
    const action = behavior.action;
    
    if (!actionGroups.has(action)) {
      actionGroups.set(action, []);
    }
    actionGroups.get(action)!.push(behavior);

    sessionSet.add(behavior.sessionId);
    totalTimeSpent += parseFloat(behavior.timeSpent || "0");
  });

  // Analyze triggers
  const triggers: BehaviorTrigger[] = [];

  actionGroups.forEach((actionBehaviors, action) => {
    const frequency = actionBehaviors.length;
    
    // Calculate conversion rate if we have conversion data
    let conversionCount = 0;
    if (conversions) {
      conversionCount = actionBehaviors.filter((b) => 
        b.leadId && conversions.has(b.leadId)
      ).length;
    }
    const conversionRate = frequency > 0 ? conversionCount / frequency : 0;

    // Calculate average time spent
    const totalTime = actionBehaviors.reduce(
      (sum, b) => sum + parseFloat(b.timeSpent || "0"),
      0
    );
    const avgTimeSpent = totalTime / frequency;

    // Get top pages for this action
    const pageCount: Map<string, number> = new Map();
    actionBehaviors.forEach((b) => {
      if (b.pageUrl) {
        pageCount.set(b.pageUrl, (pageCount.get(b.pageUrl) || 0) + 1);
      }
    });

    const topPages = Array.from(pageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([page]) => page);

    // Generate insights
    const insights: string[] = [];
    
    if (conversionRate >= 0.5) {
      insights.push("🔥 HIGH CONVERSION - Strong buying signal");
    } else if (conversionRate >= 0.3) {
      insights.push("⚡ MODERATE CONVERSION - Interested behavior");
    }

    if (avgTimeSpent > 120) {
      insights.push("⏱️ High engagement - Users spend significant time");
    }

    if (frequency > behaviors.length * 0.2) {
      insights.push("📊 POPULAR ACTION - Frequently performed");
    }

    triggers.push({
      trigger: action,
      frequency,
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgTimeSpent: Math.round(avgTimeSpent),
      topPages,
      insights,
    });
  });

  // Sort triggers by conversion rate and frequency
  triggers.sort((a, b) => {
    const scoreA = a.conversionRate * 0.7 + (a.frequency / behaviors.length) * 0.3;
    const scoreB = b.conversionRate * 0.7 + (b.frequency / behaviors.length) * 0.3;
    return scoreB - scoreA;
  });

  // Analyze patterns (behavior sequences)
  const patterns = analyzePatterns(behaviors, conversions);

  // Calculate summary
  const topActions = triggers
    .slice(0, 5)
    .map((t) => t.trigger);

  const avgTimeSpent = behaviors.length > 0 
    ? totalTimeSpent / behaviors.length 
    : 0;

  return {
    triggers: triggers.slice(0, 20), // Top 20 triggers
    patterns: patterns.slice(0, 10), // Top 10 patterns
    summary: {
      totalBehaviors: behaviors.length,
      uniqueSessions: sessionSet.size,
      avgTimeSpent: Math.round(avgTimeSpent),
      topActions,
    },
  };
}

/**
 * Analyze behavior patterns (sequences of actions)
 */
function analyzePatterns(
  behaviors: UserBehavior[],
  conversions?: Set<string>
): BehaviorPattern[] {
  // Group by session to analyze sequences
  const sessionBehaviors: Map<string, UserBehavior[]> = new Map();

  behaviors.forEach((b) => {
    if (!sessionBehaviors.has(b.sessionId)) {
      sessionBehaviors.set(b.sessionId, []);
    }
    sessionBehaviors.get(b.sessionId)!.push(b);
  });

  // Analyze common patterns
  const patternCounts: Map<string, {
    count: number;
    scrollDepths: number[];
    conversions: number;
  }> = new Map();

  sessionBehaviors.forEach((sessionActions, sessionId) => {
    if (sessionActions.length < 2) return; // Need at least 2 actions

    // Sort by timestamp
    sessionActions.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Create pattern string (first 3 actions)
    const patternActions = sessionActions
      .slice(0, 3)
      .map((b) => b.action)
      .join(" → ");

    if (!patternCounts.has(patternActions)) {
      patternCounts.set(patternActions, {
        count: 0,
        scrollDepths: [],
        conversions: 0,
      });
    }

    const patternData = patternCounts.get(patternActions)!;
    patternData.count++;

    // Track scroll depths
    sessionActions.forEach((b) => {
      const scrollDepth = parseFloat(b.scrollDepth || "0");
      if (scrollDepth > 0) {
        patternData.scrollDepths.push(scrollDepth);
      }
    });

    // Check if session led to conversion
    if (conversions && sessionActions.some((b) => b.leadId && conversions.has(b.leadId))) {
      patternData.conversions++;
    }
  });

  // Convert to pattern objects
  const patterns: BehaviorPattern[] = [];

  patternCounts.forEach((data, pattern) => {
    const avgScrollDepth = data.scrollDepths.length > 0
      ? data.scrollDepths.reduce((a, b) => a + b, 0) / data.scrollDepths.length
      : 0;

    const successRate = data.count > 0 ? data.conversions / data.count : 0;

    let recommendation = "";
    if (successRate >= 0.5) {
      recommendation = "🎯 OPTIMIZE - High-converting pattern, replicate this flow";
    } else if (successRate >= 0.3) {
      recommendation = "⚡ IMPROVE - Good potential, test variations";
    } else if (data.count > 10) {
      recommendation = "🔍 ANALYZE - Popular but low conversion, find friction points";
    } else {
      recommendation = "💭 MONITOR - Track for more data";
    }

    patterns.push({
      pattern,
      occurrences: data.count,
      avgScrollDepth: Math.round(avgScrollDepth),
      successRate: Math.round(successRate * 100) / 100,
      recommendation,
    });
  });

  // Sort by success rate and frequency
  patterns.sort((a, b) => {
    const scoreA = a.successRate * 0.6 + (a.occurrences / behaviors.length) * 0.4;
    const scoreB = b.successRate * 0.6 + (b.occurrences / behaviors.length) * 0.4;
    return scoreB - scoreA;
  });

  return patterns;
}

/**
 * Get top converting actions
 */
export function getTopConvertingActions(
  behaviors: UserBehavior[],
  conversions: Set<string>,
  limit: number = 5
): BehaviorTrigger[] {
  const analysis = analyzeBehaviorTriggers(behaviors, conversions);
  return analysis.triggers.slice(0, limit);
}

/**
 * Get engagement metrics for a specific action
 */
export function getActionEngagement(
  behaviors: UserBehavior[],
  action: string
): {
  count: number;
  avgTimeSpent: number;
  avgScrollDepth: number;
  topPages: string[];
} {
  const actionBehaviors = behaviors.filter((b) => b.action === action);

  if (actionBehaviors.length === 0) {
    return {
      count: 0,
      avgTimeSpent: 0,
      avgScrollDepth: 0,
      topPages: [],
    };
  }

  const totalTime = actionBehaviors.reduce(
    (sum, b) => sum + parseFloat(b.timeSpent || "0"),
    0
  );

  const totalScroll = actionBehaviors.reduce(
    (sum, b) => sum + parseFloat(b.scrollDepth || "0"),
    0
  );

  const pageCount: Map<string, number> = new Map();
  actionBehaviors.forEach((b) => {
    if (b.pageUrl) {
      pageCount.set(b.pageUrl, (pageCount.get(b.pageUrl) || 0) + 1);
    }
  });

  const topPages = Array.from(pageCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page]) => page);

  return {
    count: actionBehaviors.length,
    avgTimeSpent: Math.round(totalTime / actionBehaviors.length),
    avgScrollDepth: Math.round(totalScroll / actionBehaviors.length),
    topPages,
  };
}
