import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertMarketTrendSchema, 
  insertLeadSchema, 
  insertContentSchema 
} from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
