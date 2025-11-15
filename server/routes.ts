import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertMarketTrendSchema, 
  insertLeadSchema, 
  insertContentSchema,
  insertUserBehaviorSchema,
  insertAgentSchema,
  insertTransactionSchema
} from "@shared/schema";
import { updateLeadFunnelStage, isHighIntentClient } from "./services/funnelService";
import { getBehavioralInsights } from "./services/behaviorAnalyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties Routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error: any) {
      console.error("Error creating property:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const success = await storage.deleteProperty(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Market Trends Routes
  app.get("/api/market-trends", async (req, res) => {
    try {
      const trends = await storage.getAllMarketTrends();
      res.json(trends);
    } catch (error) {
      console.error("Error fetching market trends:", error);
      res.status(500).json({ error: "Failed to fetch market trends" });
    }
  });

  app.get("/api/market-trends/:id", async (req, res) => {
    try {
      const trend = await storage.getMarketTrendById(req.params.id);
      if (!trend) {
        return res.status(404).json({ error: "Market trend not found" });
      }
      res.json(trend);
    } catch (error) {
      console.error("Error fetching market trend:", error);
      res.status(500).json({ error: "Failed to fetch market trend" });
    }
  });

  app.get("/api/market-trends/city/:city", async (req, res) => {
    try {
      const trend = await storage.getMarketTrendByCity(req.params.city);
      if (!trend) {
        return res.status(404).json({ error: "Market trend not found for this city" });
      }
      res.json(trend);
    } catch (error) {
      console.error("Error fetching market trend by city:", error);
      res.status(500).json({ error: "Failed to fetch market trend" });
    }
  });

  app.post("/api/market-trends", async (req, res) => {
    try {
      const validatedData = insertMarketTrendSchema.parse(req.body);
      const trend = await storage.createMarketTrend(validatedData);
      res.status(201).json(trend);
    } catch (error: any) {
      console.error("Error creating market trend:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid market trend data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create market trend" });
    }
  });

  app.patch("/api/market-trends/:id", async (req, res) => {
    try {
      const trend = await storage.updateMarketTrend(req.params.id, req.body);
      if (!trend) {
        return res.status(404).json({ error: "Market trend not found" });
      }
      res.json(trend);
    } catch (error) {
      console.error("Error updating market trend:", error);
      res.status(500).json({ error: "Failed to update market trend" });
    }
  });

  app.delete("/api/market-trends/:id", async (req, res) => {
    try {
      const success = await storage.deleteMarketTrend(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Market trend not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting market trend:", error);
      res.status(500).json({ error: "Failed to delete market trend" });
    }
  });

  // Leads Routes
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error: any) {
      console.error("Error creating lead:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const success = await storage.deleteLead(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Content Routes
  app.get("/api/content", async (req, res) => {
    try {
      const { category } = req.query;
      let content;
      if (category && typeof category === 'string') {
        content = await storage.getContentByCategory(category);
      } else {
        content = await storage.getAllContent();
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const contentItem = await storage.getContentById(req.params.id);
      if (!contentItem) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(contentItem);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const contentItem = await storage.createContent(validatedData);
      res.status(201).json(contentItem);
    } catch (error: any) {
      console.error("Error creating content:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.patch("/api/content/:id", async (req, res) => {
    try {
      const contentItem = await storage.updateContent(req.params.id, req.body);
      if (!contentItem) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(contentItem);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const success = await storage.deleteContent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // View Tracking Routes
  app.post("/api/views/property/:id", async (req, res) => {
    try {
      await storage.incrementPropertyViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing property views:", error);
      res.status(500).json({ error: "Failed to increment views" });
    }
  });

  app.post("/api/views/content/:id", async (req, res) => {
    try {
      await storage.incrementContentViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing content views:", error);
      res.status(500).json({ error: "Failed to increment views" });
    }
  });

  app.post("/api/views/market-trend/:id", async (req, res) => {
    try {
      await storage.incrementMarketTrendViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing market trend views:", error);
      res.status(500).json({ error: "Failed to increment views" });
    }
  });

  // ROI Calculator Routes
  app.get("/api/roi-calculator/usage", async (req, res) => {
    try {
      const usage = await storage.getRoiCalculatorUsage();
      res.json({ totalUsage: usage });
    } catch (error) {
      console.error("Error fetching ROI calculator usage:", error);
      res.status(500).json({ error: "Failed to fetch usage" });
    }
  });

  app.post("/api/roi-calculator/usage", async (req, res) => {
    try {
      const usage = await storage.incrementRoiCalculatorUsage();
      res.json({ totalUsage: usage });
    } catch (error) {
      console.error("Error incrementing ROI calculator usage:", error);
      res.status(500).json({ error: "Failed to increment usage" });
    }
  });

  // Behavioral Tracking Routes
  app.post("/api/tracking/behavior", async (req, res) => {
    try {
      const validatedData = insertUserBehaviorSchema.parse(req.body);
      const behavior = await storage.createUserBehavior(validatedData);
      
      // Automatically update funnel stage if leadId exists
      if (validatedData.leadId) {
        await updateLeadFunnelStage(validatedData.leadId, validatedData.sessionId);
      }
      
      res.status(201).json(behavior);
    } catch (error: any) {
      console.error("Error creating behavior:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid behavior data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create behavior" });
    }
  });

  app.get("/api/tracking/behaviors/:sessionId", async (req, res) => {
    try {
      const behaviors = await storage.getUserBehaviorsBySessionId(req.params.sessionId);
      res.json(behaviors);
    } catch (error) {
      console.error("Error fetching behaviors:", error);
      res.status(500).json({ error: "Failed to fetch behaviors" });
    }
  });

  app.get("/api/tracking/behaviors/lead/:leadId", async (req, res) => {
    try {
      const behaviors = await storage.getUserBehaviorsByLeadId(req.params.leadId);
      res.json(behaviors);
    } catch (error) {
      console.error("Error fetching lead behaviors:", error);
      res.status(500).json({ error: "Failed to fetch behaviors" });
    }
  });

  // Funnel Routes
  app.post("/api/funnel/update-stage/:leadId", async (req, res) => {
    try {
      const { sessionId } = req.body;
      const updatedLead = await updateLeadFunnelStage(req.params.leadId, sessionId);
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating funnel stage:", error);
      res.status(500).json({ error: "Failed to update funnel stage" });
    }
  });

  app.get("/api/funnel/analytics", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      const behaviors = await storage.getBehaviorsByType("page_view", 10000);
      
      // Calculate funnel distribution
      const stageCounts = {
        curiosity: leads.filter(l => l.funnelStage === "curiosity" || !l.funnelStage).length,
        understanding: leads.filter(l => l.funnelStage === "understanding").length,
        trust: leads.filter(l => l.funnelStage === "trust").length,
        desire: leads.filter(l => l.funnelStage === "desire").length,
        purchase: leads.filter(l => l.funnelStage === "purchase").length,
      };

      // Calculate conversion rates
      const total = leads.length || 1;
      const conversionRates = {
        curiosity: (stageCounts.curiosity / total) * 100,
        understanding: (stageCounts.understanding / total) * 100,
        trust: (stageCounts.trust / total) * 100,
        desire: (stageCounts.desire / total) * 100,
        purchase: (stageCounts.purchase / total) * 100,
      };

      // Get high-intent clients
      const highIntentLeads = [];
      for (const lead of leads) {
        if (lead.id && await isHighIntentClient(lead.id)) {
          highIntentLeads.push(lead);
        }
      }

      res.json({
        stageCounts,
        conversionRates,
        totalLeads: total,
        highIntentCount: highIntentLeads.length,
        highIntentLeads: highIntentLeads.slice(0, 10),
      });
    } catch (error) {
      console.error("Error fetching funnel analytics:", error);
      res.status(500).json({ error: "Failed to fetch funnel analytics" });
    }
  });

  app.get("/api/funnel/client/:leadId", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const behaviors = await storage.getUserBehaviorsByLeadId(req.params.leadId);
      const transactions = await storage.getTransactionsByLeadId(req.params.leadId);
      const isHighIntent = await isHighIntentClient(req.params.leadId);

      res.json({
        lead,
        behaviors,
        transactions,
        isHighIntent,
      });
    } catch (error) {
      console.error("Error fetching client journey:", error);
      res.status(500).json({ error: "Failed to fetch client journey" });
    }
  });

  // Behavioral Insights Routes
  app.get("/api/insights/behavioral", async (req, res) => {
    try {
      const insights = await getBehavioralInsights();
      res.json(insights);
    } catch (error) {
      console.error("Error fetching behavioral insights:", error);
      res.status(500).json({ error: "Failed to fetch behavioral insights" });
    }
  });

  // Agent Routes
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgentById(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      res.status(201).json(agent);
    } catch (error: any) {
      console.error("Error creating agent:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid agent data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.updateAgent(req.params.id, req.body);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const success = await storage.deleteAgent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting agent:", error);
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  // Transaction Routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransactionById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      // Update lead stage to purchase
      if (validatedData.leadId) {
        await storage.updateLead(validatedData.leadId, {
          funnelStage: "purchase",
          purchaseProbability: "100",
          lastInteractionAt: new Date(),
        });
      }
      
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.updateTransaction(req.params.id, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const success = await storage.deleteTransaction(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // Update lead route to handle funnel stage updates
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.updateLead(req.params.id, req.body);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
