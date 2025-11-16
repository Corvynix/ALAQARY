import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateAIResponse } from "./services/aiService";
import { calculateMatchScore, calculateTrustScore } from "./services/matchingEngine";
import { insertPropertySchema, insertDeveloperSchema, insertBuyerProfileSchema, insertBehavioralEventSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
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

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const { city, type, search } = req.query;
      const properties = await storage.getProperties({
        city: city as string,
        type: type as string,
        search: search as string,
      });
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getPropertyWithDeveloper(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(403).json({ message: "Only developers can create properties" });
      }

      const validated = insertPropertySchema.parse({ ...req.body, developerId: developer.id });
      const property = await storage.createProperty(validated);
      res.json(property);
    } catch (error: any) {
      console.error("Error creating property:", error);
      res.status(400).json({ message: error.message || "Failed to create property" });
    }
  });

  // Developer routes
  app.get('/api/developers/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer profile not found" });
      }

      // Update trust score
      const trustScore = calculateTrustScore(developer);
      await storage.updateDeveloper(developer.id, { trustScore });
      
      const updated = await storage.getDeveloper(developer.id);
      res.json(updated);
    } catch (error) {
      console.error("Error fetching developer:", error);
      res.status(500).json({ message: "Failed to fetch developer" });
    }
  });

  app.post('/api/developers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertDeveloperSchema.parse({ ...req.body, userId });
      const developer = await storage.createDeveloper(validated);
      
      // Update user role
      await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      });

      res.json(developer);
    } catch (error: any) {
      console.error("Error creating developer:", error);
      res.status(400).json({ message: error.message || "Failed to create developer" });
    }
  });

  app.get('/api/developers/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const developer = await storage.getDeveloperByUserId(userId);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer profile not found" });
      }

      // Get all matches for this developer's properties
      // This is a simplified version - in production, we'd query across all developer's properties
      res.json([]);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Buyer Profile routes
  app.get('/api/buyer-profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Buyer profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching buyer profile:", error);
      res.status(500).json({ message: "Failed to fetch buyer profile" });
    }
  });

  app.post('/api/buyer-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertBuyerProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createBuyerProfile(validated);

      // Generate initial matches
      const properties = await storage.getProperties({});
      for (const property of properties.slice(0, 20)) {
        const { matchScore, breakdown, explanation } = calculateMatchScore(
          profile,
          property,
          property.developer ?? null
        );

        if (matchScore >= 30) {
          await storage.createPropertyMatch({
            buyerProfileId: profile.id,
            propertyId: property.id,
            matchScore,
            scoreBreakdown: breakdown,
            explanation,
          });
        }
      }

      res.json(profile);
    } catch (error: any) {
      console.error("Error creating buyer profile:", error);
      res.status(400).json({ message: error.message || "Failed to create buyer profile" });
    }
  });

  // Property Match routes
  app.get('/api/matches/my-matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      
      if (!profile) {
        return res.json([]);
      }

      const matches = await storage.getMatchesByBuyerProfileId(profile.id);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // AI Closer routes
  app.post('/api/ai-closer/message', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, sessionId, propertyId } = req.body;

      let session;
      if (sessionId) {
        session = await storage.getAICloserSession(sessionId);
      }

      if (!session) {
        // Create new session
        session = await storage.createAICloserSession({
          buyerId: userId,
          propertyId: propertyId || null,
          sessionHistory: [],
          purchaseProbability: 0,
        });
      }

      // Get property context if available
      let propertyContext;
      if (session.propertyId) {
        const property = await storage.getProperty(session.propertyId);
        if (property) {
          propertyContext = {
            type: property.type,
            city: property.city,
            price: property.price,
          };
        }
      }

      // Add user message to history
      const sessionHistory = session.sessionHistory as any[] || [];
      sessionHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Generate AI response
      const { response, purchaseProbability } = await generateAIResponse(
        sessionHistory,
        propertyContext
      );

      // Add AI response to history
      sessionHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      // Update session
      await storage.updateAICloserSession(session.id, {
        sessionHistory,
        purchaseProbability,
      });

      res.json({
        response,
        sessionId: session.id,
        purchaseProbability,
      });
    } catch (error) {
      console.error("Error processing AI message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Behavioral Events routes
  app.post('/api/behavioral-events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertBehavioralEventSchema.parse({ ...req.body, userId });
      const event = await storage.createBehavioralEvent(validated);
      res.json(event);
    } catch (error: any) {
      console.error("Error creating behavioral event:", error);
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Referral routes
  app.post('/api/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.referralCode) {
        // Generate referral code
        const referralCode = `REF${randomUUID().substring(0, 8).toUpperCase()}`;
        await storage.upsertUser({
          id: userId,
          email: user?.email || req.user.claims.email,
          firstName: user?.firstName || req.user.claims.first_name,
          lastName: user?.lastName || req.user.claims.last_name,
          profileImageUrl: user?.profileImageUrl || req.user.claims.profile_image_url,
        });
      }

      const referrals = await storage.getReferralsByUserId(userId);
      res.json({ referralCode: user?.referralCode, referrals });
    } catch (error) {
      console.error("Error managing referrals:", error);
      res.status(500).json({ message: "Failed to manage referrals" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
