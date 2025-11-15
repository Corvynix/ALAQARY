import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface TrackBehaviorParams {
  behaviorType: string;
  action: string;
  target?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  timeSpent?: number;
  scrollDepth?: number;
}

export function useFunnelTracking() {
  const [sessionId] = useState(() => {
    // Get or create session ID
    let sid = sessionStorage.getItem("funnel_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("funnel_session_id", sid);
    }
    return sid;
  });

  const [leadId, setLeadId] = useState<string | null>(() => {
    return sessionStorage.getItem("funnel_lead_id");
  });

  const [location] = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const trackInterval = useRef<NodeJS.Timeout | null>(null);

  // Define trackBehavior first
  const trackBehavior = useCallback(
    async (params: TrackBehaviorParams) => {
      try {
        const behaviorData = {
          sessionId,
          leadId: leadId || null,
          behaviorType: params.behaviorType,
          action: params.action,
          target: params.target || null,
          targetId: params.targetId || null,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
          timeSpent: params.timeSpent || null,
          scrollDepth: params.scrollDepth || null,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          ipAddress: null, // Will be handled server-side if needed
        };

        await apiRequest("POST", "/api/tracking/behavior", behaviorData);
      } catch (error) {
        console.error("Error tracking behavior:", error);
        // Silently fail to not disrupt user experience
      }
    },
    [sessionId, leadId]
  );

  // Track page view on mount and location change
  useEffect(() => {
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;

    // Track page view
    trackBehavior({
      behaviorType: "page_view",
      action: "view_page",
      target: location,
      metadata: {
        pathname: location,
        timestamp: new Date().toISOString(),
      },
    });

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Track time spent on page when leaving
    return () => {
      window.removeEventListener("scroll", handleScroll);
      const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000); // in seconds
      
      if (timeSpent > 5) {
        trackBehavior({
          behaviorType: "page_view",
          action: "leave_page",
          target: location,
          timeSpent,
          scrollDepth: maxScrollDepth.current,
          metadata: {
            pathname: location,
          },
        });
      }
    };
  }, [location, trackBehavior]);

  // Track return visits
  useEffect(() => {
    const lastVisit = localStorage.getItem(`last_visit_${location}`);
    const now = Date.now();
    
    if (lastVisit) {
      const timeSinceLastVisit = now - parseInt(lastVisit);
      // If more than 30 minutes since last visit, count as return visit
      if (timeSinceLastVisit > 30 * 60 * 1000) {
        trackBehavior({
          behaviorType: "engagement",
          action: "return_visit",
          target: location,
          metadata: {
            timeSinceLastVisit: Math.floor(timeSinceLastVisit / 1000), // in seconds
          },
        });
      }
    }
    
    localStorage.setItem(`last_visit_${location}`, now.toString());
  }, [location, trackBehavior]);

  // Helper functions for common tracking scenarios
  const trackPropertyView = useCallback(
    (propertyId: string, propertyTitle: string) => {
      trackBehavior({
        behaviorType: "property_interaction",
        action: "view_property",
        target: "property_card",
        targetId: propertyId,
        metadata: {
          propertyTitle,
        },
      });
    },
    [trackBehavior]
  );

  const trackFormInteraction = useCallback(
    (formName: string, fieldName?: string) => {
      trackBehavior({
        behaviorType: "form_interaction",
        action: fieldName ? "field_focus" : "form_view",
        target: formName,
        metadata: {
          fieldName: fieldName || null,
        },
      });
    },
    [trackBehavior]
  );

  const trackFormSubmit = useCallback(
    (formName: string, leadId?: string) => {
      if (leadId) {
        setLeadId(leadId);
        sessionStorage.setItem("funnel_lead_id", leadId);
      }

      trackBehavior({
        behaviorType: "form_interaction",
        action: "submit_form",
        target: formName,
        metadata: {
          leadId: leadId || null,
        },
      });
    },
    [trackBehavior]
  );

  const trackCTAClick = useCallback(
    (ctaType: string, target?: string) => {
      trackBehavior({
        behaviorType: "cta_interaction",
        action: `click_${ctaType}`,
        target: target || ctaType,
        metadata: {
          ctaType,
        },
      });
    },
    [trackBehavior]
  );

  const trackCalculatorUsage = useCallback(() => {
    trackBehavior({
      behaviorType: "tool_usage",
      action: "use_calculator",
      target: "roi_calculator",
    });
  }, [trackBehavior]);

  const trackContentRead = useCallback(
    (contentId: string, contentTitle: string) => {
      trackBehavior({
        behaviorType: "content_interaction",
        action: "read_content",
        target: "content",
        targetId: contentId,
        metadata: {
          contentTitle,
        },
      });
    },
    [trackBehavior]
  );

  const trackTestimonialView = useCallback(() => {
    trackBehavior({
      behaviorType: "trust_signal",
      action: "view_testimonials",
      target: "testimonials",
    });
  }, [trackBehavior]);

  const trackWhatsAppClick = useCallback(() => {
    trackCTAClick("whatsapp");
  }, [trackCTAClick]);

  const trackFilterUsage = useCallback(
    (filterType: string, filterValue: string) => {
      trackBehavior({
        behaviorType: "navigation",
        action: "use_filter",
        target: filterType,
        metadata: {
          filterValue,
        },
      });
    },
    [trackBehavior]
  );

  return {
    sessionId,
    leadId,
    trackBehavior,
    trackPropertyView,
    trackFormInteraction,
    trackFormSubmit,
    trackCTAClick,
    trackCalculatorUsage,
    trackContentRead,
    trackTestimonialView,
    trackWhatsAppClick,
    trackFilterUsage,
  };
}

