import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isDeveloper } from "./replitAuth";
import { insertPaymentSchema, insertConsultationSchema, insertMarketDataSchema, insertBehavioralTrackingSchema, insertPropertySchema } from "@shared/schema";
import rateLimit from "express-rate-limit";

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Apply rate limiting to all API routes
  app.use("/api", apiLimiter);

  // ==================== AUTH ROUTES ====================
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== CLIENT ROUTES ====================
  
  // Get client profile
  app.get('/api/client/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      
      if (!profile) {
        // Create default profile if doesn't exist
        const newProfile = await storage.createBuyerProfile({
          userId,
          profileCompletion: 0,
        });
        return res.json(newProfile);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update client profile
  app.put('/api/client/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      // Calculate profile completion
      const fields = ['budget', 'preferredRegions', 'preferredPropertyTypes', 'riskTolerance', 'investmentGoal'];
      const filledFields = fields.filter(f => updates[f] && (Array.isArray(updates[f]) ? updates[f].length > 0 : true));
      const completion = Math.round((filledFields.length / fields.length) * 100);
      
      const profile = await storage.updateBuyerProfile(userId, {
        ...updates,
        profileCompletion: completion,
      });
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get client consultations
  app.get('/api/client/consultations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const consultations = await storage.getConsultationsByUser(userId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Create consultation
  app.post('/api/client/consultations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const consultationData = insertConsultationSchema.parse({
        ...req.body,
        userId,
      });
      
      const consultation = await storage.createConsultation(consultationData);
      res.json(consultation);
    } catch (error: any) {
      console.error("Error creating consultation:", error);
      res.status(400).json({ message: error.message || "Failed to create consultation" });
    }
  });

  // Get client payments
  app.get('/api/client/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getPaymentsByUser(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Create payment
  app.post('/api/client/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        userId,
      });
      
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(400).json({ message: error.message || "Failed to create payment" });
    }
  });

  // Get saved properties (placeholder - returns all for now)
  app.get('/api/client/saved-properties', isAuthenticated, async (req: any, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties.slice(0, 10)); // Return first 10
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // Get all users
  app.get('/api/admin/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get all developers
  app.get('/api/admin/developers', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const developers = await storage.getAllDevelopers();
      res.json(developers);
    } catch (error) {
      console.error("Error fetching developers:", error);
      res.status(500).json({ message: "Failed to fetch developers" });
    }
  });

  // Get all payments
  app.get('/api/admin/payments', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Get all market data
  app.get('/api/admin/market-data', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = await storage.getAllMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Get all behavioral tracking data
  app.get('/api/admin/behavioral-tracking', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const tracking = await storage.getAllBehavioralTracking();
      res.json(tracking);
    } catch (error) {
      console.error("Error fetching behavioral tracking:", error);
      res.status(500).json({ message: "Failed to fetch behavioral tracking" });
    }
  });

  // Upload market data (JSON)
  app.post('/api/admin/market-data/upload', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { jsonData } = req.body;
      
      if (!jsonData) {
        return res.status(400).json({ message: "JSON data is required" });
      }

      // Parse JSON data
      let parsedData;
      try {
        parsedData = JSON.parse(jsonData);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON format" });
      }

      // Handle both single object and array of objects
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Validate and insert each record
      const validatedData = dataArray.map(item => {
        return insertMarketDataSchema.parse({
          region: item.region,
          propertyType: item.propertyType,
          averagePrice: item.averagePrice?.toString(),
          priceChange: item.priceChange?.toString(),
          demandLevel: item.demandLevel,
          supplyLevel: item.supplyLevel,
          insights: item.insights || {},
          dataSource: item.dataSource || 'manual_upload',
          validFrom: item.validFrom ? new Date(item.validFrom) : new Date(),
          validTo: item.validTo ? new Date(item.validTo) : undefined,
        });
      });

      const records = await storage.bulkCreateMarketData(validatedData);
      
      res.json({ 
        message: `Successfully uploaded ${records.length} market data record(s)`,
        records 
      });
    } catch (error: any) {
      console.error("Error uploading market data:", error);
      res.status(400).json({ message: error.message || "Failed to upload market data" });
    }
  });

  // ==================== DEVELOPER ROUTES ====================
  
  // Get developer profile
  app.get('/api/developer/profile', isAuthenticated, isDeveloper, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer profile not found" });
      }
      
      res.json(developer);
    } catch (error) {
      console.error("Error fetching developer profile:", error);
      res.status(500).json({ message: "Failed to fetch developer profile" });
    }
  });

  // Get developer properties
  app.get('/api/developer/properties', isAuthenticated, isDeveloper, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer profile not found" });
      }
      
      const properties = await storage.getPropertiesByDeveloper(developer.id);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching developer properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Create property
  app.post('/api/developer/properties', isAuthenticated, isDeveloper, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer profile not found" });
      }
      
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        developerId: developer.id,
      });
      
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error: any) {
      console.error("Error creating property:", error);
      res.status(400).json({ message: error.message || "Failed to create property" });
    }
  });

  // Get developer leads (placeholder)
  app.get('/api/developer/leads', isAuthenticated, isDeveloper, async (req: any, res) => {
    try {
      // Placeholder: return empty array
      // In real implementation, this would match clients to developers
      res.json([]);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // ==================== BEHAVIORAL TRACKING ====================
  
  // Track user behavior
  app.post('/api/tracking/behavior', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const trackingData = insertBehavioralTrackingSchema.parse({
        ...req.body,
        userId,
      });
      
      await storage.createBehavioralTracking(trackingData);
      res.json({ message: "Tracked successfully" });
    } catch (error: any) {
      // Don't fail the request if tracking fails
      console.error("Error tracking behavior:", error);
      res.status(200).json({ message: "Tracking failed silently" });
    }
  });

  // ==================== PUBLIC ROUTES ====================
  
  // Get all properties (public)
  app.get('/api/properties', async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get property by ID (public)
  app.get('/api/properties/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Increment view count
      await storage.incrementPropertyViews(id);
      
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Get market data by region (public)
  app.get('/api/market-data/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const data = await storage.getMarketDataByRegion(region);
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
