import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertMarketTrendSchema, 
  insertLeadSchema, 
  insertContentSchema,
  insertUserBehaviorSchema,
  insertAgentSchema,
  insertTransactionSchema,
  insertUserSchema
} from "@shared/schema";
import { updateLeadFunnelStage, isHighIntentClient } from "./services/funnelService";
import { getBehavioralInsights } from "./services/behaviorAnalyzer";
import { getMarketIntelligence, getAllMarketIntelligence } from "./services/marketIntelligenceService";
import { recommendPropertiesForClient, recommendAgentForClient, qualifyClient } from "./services/recommendationService";
import { getBestScriptForAgent, getAgentIntelligence } from "./services/agentIntelligenceService";
import { requireAuth, requireRole, generateToken, type AuthRequest } from "./middleware/auth";
import { intelligenceRouter } from "./intelligence/router";
import { 
  calculateBuyerCreditScore, 
  calculateProjectCreditScore, 
  calculateAgentCreditScore 
} from "./services/creditScoreService";
import * as creditService from "./services/creditService";
import * as aiService from "./services/aiService";
import { db } from "./db";
import { users } from "@shared/schema";
import { aiLimiter, authLimiter } from "./middleware/rateLimiter";
import healthRouter from "./routes/health";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check routes (no rate limiting)
  app.use('/', healthRouter);

  // Mount Intelligence API Router (admin-only analytics endpoints)
  app.use("/api/intelligence", intelligenceRouter);

  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, phone, fullName, role, companyName } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "اسم المستخدم موجود بالفعل" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        phone,
        fullName,
        role: role || "client",
        companyName
      });

      const token = generateToken(user.id, user.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        companyName: user.companyName,
        credits: user.credits,
        accuracyScore: user.accuracyScore
      });
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "بيانات غير صحيحة", details: error.errors });
      }
      res.status(500).json({ error: "فشل إنشاء الحساب" });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "اسم المستخدم وكلمة المرور مطلوبان" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      const token = generateToken(user.id, user.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        companyName: user.companyName,
        credits: user.credits,
        accuracyScore: user.accuracyScore
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "فشل تسجيل الدخول" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: "غير مسجل الدخول" });
    }
    res.json({
      id: authReq.user.id,
      username: authReq.user.username,
      role: authReq.user.role,
      email: authReq.user.email,
      phone: authReq.user.phone,
      fullName: authReq.user.fullName,
      companyName: authReq.user.companyName,
      credits: authReq.user.credits,
      accuracyScore: authReq.user.accuracyScore,
      profileComplete: authReq.user.profileComplete,
      preferences: authReq.user.preferences
    });
  });

  app.patch("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json({ error: "غير مسجل الدخول" });
      }

      const updates: any = {};
      if (req.body.role) updates.role = req.body.role;
      if (req.body.preferences) updates.preferences = typeof req.body.preferences === 'string' 
        ? req.body.preferences 
        : JSON.stringify(req.body.preferences);
      if (req.body.profileComplete !== undefined) updates.profileComplete = req.body.profileComplete;
      if (req.body.fullName) updates.fullName = req.body.fullName;
      if (req.body.companyName) updates.companyName = req.body.companyName;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.phone) updates.phone = req.body.phone;

      const updatedUser = await storage.updateUser(authReq.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        email: updatedUser.email,
        phone: updatedUser.phone,
        fullName: updatedUser.fullName,
        companyName: updatedUser.companyName,
        credits: updatedUser.credits,
        accuracyScore: updatedUser.accuracyScore,
        profileComplete: updatedUser.profileComplete,
        preferences: updatedUser.preferences
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  
  // User Favorites Routes
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const favorites: any[] = [];
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { propertyId, notes } = req.body;
      
      const favorite = {
        id: Math.random().toString(36).substring(7),
        userId: authReq.user!.id,
        propertyId,
        notes,
        createdAt: new Date()
      };
      
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

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

  app.post("/api/properties", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.patch("/api/properties/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/properties/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.post("/api/market-trends", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.patch("/api/market-trends/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/market-trends/:id", requireAuth, requireRole('admin'), async (req, res) => {
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
  app.get("/api/leads", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/leads/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.post("/api/content", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.patch("/api/content/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/content/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  // Agent Routes (Admin Only)
  app.get("/api/agents", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.post("/api/agents", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.patch("/api/agents/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/agents/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  // Transaction Routes (Admin Only)
  app.get("/api/transactions", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.post("/api/transactions", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.patch("/api/transactions/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  app.delete("/api/transactions/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  // Update lead route to handle funnel stage updates (Admin Only)
  app.patch("/api/leads/:id", requireAuth, requireRole('admin'), async (req, res) => {
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

  // =====================================================
  // MARKET LAYER API - Market Intelligence (Admin Only)
  // =====================================================
  app.get("/api/market/intelligence", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const intelligence = await getAllMarketIntelligence();
      res.json(intelligence);
    } catch (error) {
      console.error("Error fetching market intelligence:", error);
      res.status(500).json({ error: "Failed to fetch market intelligence" });
    }
  });

  app.get("/api/market/intelligence/:city", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const intelligence = await getMarketIntelligence(req.params.city);
      if (!intelligence) {
        return res.status(404).json({ error: "Market intelligence not found for this city" });
      }
      res.json(intelligence);
    } catch (error) {
      console.error("Error fetching market intelligence:", error);
      res.status(500).json({ error: "Failed to fetch market intelligence" });
    }
  });

  // =====================================================
  // AGENT LAYER API - Agent Intelligence & Scripts (Admin Only)
  // =====================================================
  app.get("/api/agents/:id/intelligence", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const intelligence = await getAgentIntelligence(req.params.id);
      if (!intelligence) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(intelligence);
    } catch (error) {
      console.error("Error fetching agent intelligence:", error);
      res.status(500).json({ error: "Failed to fetch agent intelligence" });
    }
  });

  app.get("/api/agents/:agentId/script/:clientLeadId", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const script = await getBestScriptForAgent(req.params.agentId, req.params.clientLeadId);
      if (!script) {
        return res.status(404).json({ error: "Script recommendation not found" });
      }
      res.json(script);
    } catch (error) {
      console.error("Error fetching script recommendation:", error);
      res.status(500).json({ error: "Failed to fetch script recommendation" });
    }
  });

  // =====================================================
  // CLIENT LAYER API - Client Qualification & Recommendations (Admin Only)
  // =====================================================
  app.get("/api/clients/:leadId/qualification", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const qualification = await qualifyClient(req.params.leadId);
      res.json(qualification);
    } catch (error) {
      console.error("Error qualifying client:", error);
      res.status(500).json({ error: "Failed to qualify client" });
    }
  });

  app.get("/api/clients/:leadId/recommendations/properties", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const recommendations = await recommendPropertiesForClient(req.params.leadId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting property recommendations:", error);
      res.status(500).json({ error: "Failed to get property recommendations" });
    }
  });

  app.get("/api/clients/:leadId/recommendations/agent", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { propertyType } = req.query;
      const recommendation = await recommendAgentForClient(
        req.params.leadId,
        propertyType as string
      );
      if (!recommendation) {
        return res.status(404).json({ error: "No agent recommendation found" });
      }
      res.json(recommendation);
    } catch (error) {
      console.error("Error getting agent recommendation:", error);
      res.status(500).json({ error: "Failed to get agent recommendation" });
    }
  });

  // =====================================================
  // PROPERTY LAYER API - Property Recommendations
  // =====================================================
  app.get("/api/properties/recommendations/:leadId", async (req, res) => {
    try {
      const recommendations = await recommendPropertiesForClient(req.params.leadId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting property recommendations:", error);
      res.status(500).json({ error: "Failed to get property recommendations" });
    }
  });

  app.get("/api/properties/search", async (req, res) => {
    try {
      const { budget, city, propertyType, maxBudget } = req.query;
      let properties = await storage.getAllProperties();

      // Filter by budget
      if (budget && typeof budget === "string") {
        const budgetNum = parseFloat(budget);
        properties = properties.filter((p) => {
          const price = Number(p.price);
          return price <= budgetNum * 1.1 && price >= budgetNum * 0.9; // 10% range
        });
      }

      // Filter by max budget
      if (maxBudget && typeof maxBudget === "string") {
        const maxBudgetNum = parseFloat(maxBudget);
        properties = properties.filter((p) => Number(p.price) <= maxBudgetNum);
      }

      // Filter by city
      if (city && typeof city === "string") {
        properties = properties.filter((p) =>
          p.city.toLowerCase().includes(city.toLowerCase())
        );
      }

      // Filter by property type
      if (propertyType && typeof propertyType === "string") {
        properties = properties.filter((p) =>
          p.propertyType.toLowerCase().includes(propertyType.toLowerCase())
        );
      }

      // Sort by demand indicator and real sales rate
      properties.sort((a, b) => {
        const aDemand = a.demandIndicator === "high" ? 1 : 0;
        const bDemand = b.demandIndicator === "high" ? 1 : 0;
        if (aDemand !== bDemand) return bDemand - aDemand;

        const aSalesRate = Number(a.realSalesRate || 0);
        const bSalesRate = Number(b.realSalesRate || 0);
        return bSalesRate - aSalesRate;
      });

      res.json(properties.slice(0, 10)); // Return top 10
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  // =====================================================
  // BEHAVIOR LAYER API - Advanced Behavioral Insights
  // =====================================================
  app.get("/api/behavior/triggers", async (req, res) => {
    try {
      const allBehaviors = await storage.getBehaviorsByType("engagement", 1000);
      const formSubmissions = allBehaviors.filter((b) => b.action === "submit_form");
      const whatsappClicks = allBehaviors.filter((b) => b.action === "click_whatsapp");
      const propertyViews = allBehaviors.filter((b) => b.action === "view_property");

      // Analyze what triggers responses
      const triggers = {
        formSubmissions: formSubmissions.length,
        whatsappClicks: whatsappClicks.length,
        propertyViews: propertyViews.length,
        averageTimeToRespond: 0,
        peakEngagementHours: [] as Array<{ hour: number; count: number }>,
      };

      // Calculate peak hours
      const hourStats = new Map<number, number>();
      allBehaviors.forEach((b) => {
        const hour = new Date(b.createdAt).getHours();
        hourStats.set(hour, (hourStats.get(hour) || 0) + 1);
      });

      const peakHours = Array.from(hourStats.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      triggers.peakEngagementHours = peakHours;

      res.json(triggers);
    } catch (error) {
      console.error("Error analyzing behavior triggers:", error);
      res.status(500).json({ error: "Failed to analyze behavior triggers" });
    }
  });

  app.get("/api/behavior/peak-times", async (req, res) => {
    try {
      const insights = await getBehavioralInsights();
      res.json({
        peakEngagementTimes: insights.peakEngagementTimes,
        averageTimeToTrust: insights.averageTimeToTrust,
        averageTimeToPurchase: insights.averageTimeToPurchase,
      });
    } catch (error) {
      console.error("Error fetching peak times:", error);
      res.status(500).json({ error: "Failed to fetch peak times" });
    }
  });

  app.get("/api/behavior/best-scripts", async (req, res) => {
    try {
      const allAgents = await storage.getAllAgents();
      const bestScripts: Array<{
        script: string;
        agent: string;
        successRate: number;
        useCase: string;
      }> = [];

      for (const agent of allAgents) {
        try {
          if (agent.pitchEffectiveness) {
            const pitches = JSON.parse(agent.pitchEffectiveness);
            if (pitches.bestPitches) {
              pitches.bestPitches.forEach((pitch: any) => {
                bestScripts.push({
                  script: pitch.pitch || "",
                  agent: agent.name,
                  successRate: pitch.conversionRate || Number(agent.closingRate || 0),
                  useCase: pitch.context || "General",
                });
              });
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }

      // Sort by success rate
      bestScripts.sort((a, b) => b.successRate - a.successRate);

      res.json(bestScripts.slice(0, 10)); // Top 10 scripts
    } catch (error) {
      console.error("Error fetching best scripts:", error);
      res.status(500).json({ error: "Failed to fetch best scripts" });
    }
  });

  app.get("/api/behavior/common-objections", async (req, res) => {
    try {
      const insights = await getBehavioralInsights();
      res.json({
        commonObjections: insights.commonObjections,
      });
    } catch (error) {
      console.error("Error fetching common objections:", error);
      res.status(500).json({ error: "Failed to fetch common objections" });
    }
  });

  // =====================================================
  // CREDIT SCORE API
  // =====================================================
  
  app.get("/api/credit-scores/:entityType/:entityId", requireAuth, async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      const score = await storage.getCreditScore(entityId, entityType);
      
      if (!score) {
        // Calculate if doesn't exist
        let calculatedScore;
        if (entityType === "buyer") {
          calculatedScore = await calculateBuyerCreditScore(entityId);
        } else if (entityType === "project") {
          calculatedScore = await calculateProjectCreditScore(entityId);
        } else if (entityType === "agent") {
          calculatedScore = await calculateAgentCreditScore(entityId);
        } else {
          return res.status(400).json({ error: "Invalid entity type" });
        }
        
        const savedScore = await storage.createOrUpdateCreditScore({
          entityId: calculatedScore.entityId,
          entityType: calculatedScore.entityType,
          score: calculatedScore.score,
          factors: calculatedScore.factors || "",
        });
        
        return res.json(savedScore);
      }
      
      res.json(score);
    } catch (error: any) {
      console.error("Error fetching credit score:", error);
      res.status(500).json({ error: error.message || "Failed to fetch credit score" });
    }
  });

  app.get("/api/credit-scores/:entityType", requireAuth, async (req, res) => {
    try {
      const { entityType } = req.params;
      const scores = await storage.getCreditScoresByType(entityType);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching credit scores:", error);
      res.status(500).json({ error: "Failed to fetch credit scores" });
    }
  });

  app.post("/api/credit-scores/calculate/:entityType/:entityId", requireAuth, async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      
      let calculatedScore;
      if (entityType === "buyer") {
        calculatedScore = await calculateBuyerCreditScore(entityId);
      } else if (entityType === "project") {
        calculatedScore = await calculateProjectCreditScore(entityId);
      } else if (entityType === "agent") {
        calculatedScore = await calculateAgentCreditScore(entityId);
      } else {
        return res.status(400).json({ error: "Invalid entity type" });
      }
      
      const savedScore = await storage.createOrUpdateCreditScore({
        entityId: calculatedScore.entityId,
        entityType: calculatedScore.entityType,
        score: calculatedScore.score,
        factors: calculatedScore.factors || "",
      });
      
      res.json(savedScore);
    } catch (error: any) {
      console.error("Error calculating credit score:", error);
      res.status(500).json({ error: error.message || "Failed to calculate credit score" });
    }
  });

  // =====================================================
  // DATA CONTRIBUTIONS API
  // =====================================================
  
  app.post("/api/contributions", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { dataType, region, data, isAnonymous } = req.body;
      
      if (!dataType || !data) {
        return res.status(400).json({ error: "dataType and data are required" });
      }
      
      // Calculate credits earned (basic calculation)
      const creditsEarned = calculateContributionCredits(dataType, data);
      
      const contribution = await storage.createDataContribution({
        contributorId: authReq.user!.id,
        dataType,
        region: region || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
        isAnonymous: isAnonymous ? "true" : "false",
        creditsEarned: creditsEarned.toString(),
      });
      
      // Award credits to user
      if (creditsEarned > 0) {
        await storage.updateUserCredits(authReq.user!.id, creditsEarned);
        await storage.createCreditTransaction({
          userId: authReq.user!.id,
          amount: creditsEarned.toString(),
          type: "earn",
          reason: "data_contribution",
          relatedEntityId: contribution.id,
          relatedEntityType: "contribution",
        });
      }
      
      res.status(201).json(contribution);
    } catch (error: any) {
      console.error("Error creating contribution:", error);
      res.status(500).json({ error: error.message || "Failed to create contribution" });
    }
  });

  app.get("/api/contributions", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const contributions = await storage.getDataContributions(authReq.user!.id);
      res.json(contributions);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  // Helper function to calculate contribution credits
  function calculateContributionCredits(dataType: string, data: any): number {
    // Base credits by data type
    const baseCredits: Record<string, number> = {
      property_info: 10,
      pricing: 15,
      market_trends: 20,
      sales_data: 25,
    };
    
    const base = baseCredits[dataType] || 5;
    
    // Additional credits for data completeness
    const dataSize = typeof data === 'string' ? data.length : JSON.stringify(data).length;
    const sizeBonus = Math.floor(dataSize / 100); // 1 credit per 100 chars
    
    return base + sizeBonus;
  }

  // =====================================================
  // AI BRAIN API
  // =====================================================
  
  // AI Brain endpoint - Generate AI-powered responses
  app.post("/api/ai/brain", requireAuth, aiLimiter, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { question, context } = req.body;

      if (!question || typeof question !== "string" || question.trim().length === 0) {
        return res.status(400).json({ error: "Question is required" });
      }

      // Optional: Check if user has enough credits (if AI queries cost credits)
      // For now, we'll make it free but track usage
      const user = authReq.user!;
      
      // Generate AI response
      const aiResponse = await aiService.generateAIResponse({
        question: question.trim(),
        userRole: user.role,
        userId: user.id,
        context: context || {},
      });

      // Optional: Deduct credits for AI query (uncomment if needed)
      // try {
      //   await creditService.spendCredits(
      //     user.id,
      //     1, // 1 credit per query
      //     "AI Brain query",
      //     undefined,
      //     "ai_query"
      //   );
      // } catch (creditError) {
      //   // Log but don't fail the request if credit deduction fails
      //   console.error("Error deducting credits for AI query:", creditError);
      // }

      res.json({
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error processing AI brain request:", error);
      res.status(500).json({ 
        error: "Failed to process AI request",
        message: error.message 
      });
    }
  });

  // =====================================================
  // CREDIT SYSTEM API
  // =====================================================
  
  // Get current user's credit balance
  app.get("/api/credits/balance", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const balance = await creditService.getCreditBalance(authReq.user!.id);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      res.status(500).json({ error: "Failed to fetch credit balance" });
    }
  });

  // Get credit transaction history
  app.get("/api/credits/history", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const history = await creditService.getCreditHistory(authReq.user!.id);
      res.json({ transactions: history });
    } catch (error) {
      console.error("Error fetching credit history:", error);
      res.status(500).json({ error: "Failed to fetch credit history" });
    }
  });

  // Earn credits
  app.post("/api/credits/earn", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { amount, reason, relatedEntityId, relatedEntityType } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid credit amount" });
      }
      if (!reason) {
        return res.status(400).json({ error: "Reason is required" });
      }

      const result = await creditService.earnCredits(
        authReq.user!.id,
        amount,
        reason,
        relatedEntityId,
        relatedEntityType
      );

      res.json(result);
    } catch (error: any) {
      console.error("Error earning credits:", error);
      res.status(500).json({ error: error.message || "Failed to earn credits" });
    }
  });

  // Spend credits
  app.post("/api/credits/spend", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { amount, reason, relatedEntityId, relatedEntityType } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid credit amount" });
      }
      if (!reason) {
        return res.status(400).json({ error: "Reason is required" });
      }

      const result = await creditService.spendCredits(
        authReq.user!.id,
        amount,
        reason,
        relatedEntityId,
        relatedEntityType
      );

      res.json(result);
    } catch (error: any) {
      console.error("Error spending credits:", error);
      if (error.message === "Insufficient credits") {
        return res.status(400).json({ error: "Insufficient credits" });
      }
      res.status(500).json({ error: error.message || "Failed to spend credits" });
    }
  });

  // =====================================================
  // ADMIN CREDIT MANAGEMENT API
  // =====================================================

  // Get all users with credit balances (Admin only)
  app.get("/api/admin/users", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      // Get all users from database
      const allUsers = await db.select().from(users);
      const usersWithCredits = await Promise.all(
        allUsers.map(async (user) => {
          const balance = await creditService.getCreditBalance(user.id);
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            credits: balance,
          };
        })
      );
      res.json({ users: usersWithCredits });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin: Manually add credits to a user
  app.post("/api/admin/credits/add", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const { userId, amount, reason } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid credit amount" });
      }

      const result = await creditService.adminAddCredits(
        userId,
        amount,
        reason || "Admin manual credit addition"
      );

      res.json(result);
    } catch (error: any) {
      console.error("Error adding credits:", error);
      res.status(500).json({ error: error.message || "Failed to add credits" });
    }
  });

  // Get all credit transactions (Admin only)
  app.get("/api/admin/credits/transactions", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const transactions = await storage.getAllCreditTransactions();
      res.json({ transactions });
    } catch (error) {
      console.error("Error fetching credit transactions:", error);
      res.status(500).json({ error: "Failed to fetch credit transactions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
