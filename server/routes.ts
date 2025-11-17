import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isDeveloper } from "./replitAuth";
import { insertPaymentSchema, insertConsultationSchema, insertConsultationBookingSchema, insertMarketDataSchema, insertBehavioralTrackingSchema, insertPropertySchema, upsertUserSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Stricter rate limiting for admin authentication
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts, please try again later.",
});

// Middleware to require admin session
const requireAdminSession = (req: any, res: any, next: any) => {
  const adminUser = req.session?.adminUser;
  if (!adminUser) {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  next();
};

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

  // ==================== ADMIN AUTH ROUTES ====================
  
  // Initialize default admin account (protected with initialization secret)
  app.post('/api/admin/init', adminAuthLimiter, async (req, res) => {
    try {
      const expectedSecret = process.env.ADMIN_INIT_SECRET;
      
      if (!expectedSecret) {
        console.error("ADMIN_INIT_SECRET environment variable not set");
        return res.status(500).json({ message: "Server misconfiguration - admin initialization unavailable" });
      }
      
      const { initSecret } = req.body;
      
      if (initSecret !== expectedSecret) {
        return res.status(401).json({ message: "Invalid initialization secret" });
      }
      
      const existingAdmin = await storage.getAdminByUsername('admin');
      
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already initialized" });
      }
      
      const defaultPassword = 'admin';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      await storage.createAdminCredential({
        username: 'admin',
        passwordHash,
        mustChangePassword: true,
      });
      
      res.json({ message: "Admin account created successfully" });
    } catch (error) {
      console.error("Error initializing admin:", error);
      res.status(500).json({ message: "Failed to initialize admin" });
    }
  });
  
  // Admin login
  app.post('/api/admin/login', adminAuthLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await storage.verifyAdminPassword(username, password);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerating session:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        
        (req.session as any).adminUser = {
          username: admin.username,
          mustChangePassword: admin.mustChangePassword,
        };
        
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          
          res.json({
            username: admin.username,
            mustChangePassword: admin.mustChangePassword,
          });
        });
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Check admin session
  app.get('/api/admin/session', async (req, res) => {
    const adminUser = (req.session as any).adminUser;
    
    if (!adminUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json(adminUser);
  });
  
  // Change admin password
  app.post('/api/admin/change-password', adminAuthLimiter, async (req, res) => {
    try {
      const adminUser = (req.session as any).adminUser;
      
      if (!adminUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords required" });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      
      const isValid = await storage.verifyAdminPassword(adminUser.username, currentPassword);
      
      if (!isValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateAdminPassword(adminUser.username, newPasswordHash);
      
      (req.session as any).adminUser = {
        username: adminUser.username,
        mustChangePassword: false,
      };
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Admin logout
  app.post('/api/admin/logout', async (req, res) => {
    (req.session as any).adminUser = null;
    res.json({ message: "Logged out successfully" });
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

  // ==================== CONSULTATION BOOKING ROUTES ====================
  
  // Public consultation booking endpoint (no authentication required)
  app.post('/api/consultations/bookings/public', async (req: any, res) => {
    try {
      // Validate time slot (2-10 PM)
      const allowedTimes = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      if (!allowedTimes.includes(req.body.preferredTime)) {
        return res.status(400).json({ 
          message: "Invalid time slot. Please select a time between 2 PM and 10 PM." 
        });
      }
      
      // Validate date is in the future
      const preferredDate = new Date(req.body.preferredDate);
      if (preferredDate <= new Date()) {
        return res.status(400).json({ 
          message: "Please select a future date for your consultation." 
        });
      }
      
      // Check if date is Friday (day 5)
      if (preferredDate.getDay() === 5) {
        return res.status(400).json({ 
          message: "Consultations are not available on Fridays. Please select another day." 
        });
      }
      
      // Create booking with Zod validation
      const bookingSchema = z.object({
        customerName: z.string().min(2, "Name must be at least 2 characters"),
        customerEmail: z.string().email("Invalid email format"),
        customerPhone: z.string().min(10, "Invalid phone number"),
        preferredDate: z.date(),
        preferredTime: z.string(),
        message: z.string().optional(),
      });
      
      const validatedData = bookingSchema.parse({
        ...req.body,
        preferredDate,
      });
      
      // Create a temporary/guest user ID or use a default placeholder
      const bookingData = {
        ...validatedData,
        userId: 'guest-' + Date.now(), // Temporary guest user ID
      };
      
      const booking = await storage.createConsultationBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      console.error("Error creating public consultation booking:", error);
      res.status(400).json({ message: error.message || "Failed to create booking" });
    }
  });

  // Create consultation booking with validation (authenticated users)
  app.post('/api/consultations/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate time slot (2-10 PM)
      const allowedTimes = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      if (!allowedTimes.includes(req.body.preferredTime)) {
        return res.status(400).json({ 
          message: "Invalid time slot. Please select a time between 2 PM and 10 PM." 
        });
      }
      
      // Validate date is in the future
      const preferredDate = new Date(req.body.preferredDate);
      if (preferredDate <= new Date()) {
        return res.status(400).json({ 
          message: "Please select a future date for your consultation." 
        });
      }
      
      // Check if date is Friday (day 5)
      if (preferredDate.getDay() === 5) {
        return res.status(400).json({ 
          message: "Consultations are not available on Fridays. Please select another day." 
        });
      }
      
      // Create booking with Zod validation
      const bookingSchema = insertConsultationBookingSchema.extend({
        customerName: z.string().min(2, "Name must be at least 2 characters"),
        customerEmail: z.string().email("Invalid email format"),
        customerPhone: z.string().min(10, "Invalid phone number"),
      });
      
      const bookingData = bookingSchema.parse({
        ...req.body,
        userId,
        preferredDate,
      });
      
      const booking = await storage.createConsultationBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      console.error("Error creating consultation booking:", error);
      res.status(400).json({ message: error.message || "Failed to create booking" });
    }
  });
  
  // Get user's consultation bookings
  app.get('/api/consultations/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getUserConsultationBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching consultation bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // Get all users
  app.get('/api/admin/users', requireAdminSession, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;
      
      const result = await storage.getAllUsers(page, limit, search, role);
      res.json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create user (admin only)
  app.post('/api/admin/users', requireAdminSession, async (req, res) => {
    try {
      const userData = upsertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  // Delete user (admin only)
  app.delete('/api/admin/users/:id', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Get all developers
  app.get('/api/admin/developers', requireAdminSession, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      
      const result = await storage.getAllDevelopers(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error("Error fetching developers:", error);
      res.status(500).json({ message: "Failed to fetch developers" });
    }
  });

  // Get all payments
  app.get('/api/admin/payments', requireAdminSession, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getAllPayments(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Get all consultation bookings (admin, paginated)
  app.get('/api/admin/consultations/bookings', requireAdminSession, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getAllConsultationBookings(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching consultation bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update consultation booking payment status (admin only)
  app.put('/api/admin/consultations/bookings/:id/payment', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, phone } = req.body;
      
      await storage.updateBookingPaymentStatus(id, status, phone);
      res.json({ message: "Payment status updated successfully" });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // Update consultation booking notes (admin only)
  app.put('/api/admin/consultations/bookings/:id/notes', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      await storage.updateBookingNotes(id, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  // Update consultation booking status (admin only)
  app.put('/api/admin/consultations/bookings/:id/status', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await storage.updateBookingStatus(id, status);
      res.json({ message: "Booking status updated successfully" });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Get all market data
  app.get('/api/admin/market-data', requireAdminSession, async (req, res) => {
    try {
      const data = await storage.getAllMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Get all behavioral tracking data
  app.get('/api/admin/behavioral-tracking', requireAdminSession, async (req, res) => {
    try {
      const tracking = await storage.getAllBehavioralTracking();
      res.json(tracking);
    } catch (error) {
      console.error("Error fetching behavioral tracking:", error);
      res.status(500).json({ message: "Failed to fetch behavioral tracking" });
    }
  });

  // Upload market data (JSON)
  app.post('/api/admin/market-data/upload', requireAdminSession, async (req, res) => {
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

  // ==================== NOTES CRUD OPERATIONS ====================
  
  // Update user notes (admin only)
  app.put('/api/admin/users/:id/notes', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      await storage.updateUserNotes(id, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating user notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });
  
  // Update developer notes (admin only)
  app.put('/api/admin/developers/:id/notes', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      await storage.updateDeveloperNotes(id, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating developer notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });
  
  // Update property notes (admin only)
  app.put('/api/admin/properties/:id/notes', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      await storage.updatePropertyNotes(id, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating property notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });
  
  // Update buyer profile notes (admin only)
  app.put('/api/admin/buyer-profiles/:userId/notes', requireAdminSession, async (req, res) => {
    try {
      const { userId } = req.params;
      const { notes } = req.body;
      await storage.updateBuyerProfileNotes(userId, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating buyer profile notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });
  
  // Update market data notes (admin only)
  app.put('/api/admin/market-data/:id/notes', requireAdminSession, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      await storage.updateMarketDataNotes(id, notes || '');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      console.error("Error updating market data notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  // ==================== CMS CONTENT MANAGEMENT ====================
  
  // Get all CMS content (admin only)
  app.get('/api/admin/cms', requireAdminSession, async (req: any, res) => {
    try {
      const content = await storage.getAllCmsContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      res.status(500).json({ message: "Failed to fetch CMS content" });
    }
  });
  
  // Get CMS content by key (public)
  app.get('/api/cms/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const content = await storage.getCmsContentByKey(key);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  
  // Upsert CMS content (admin only)
  app.put('/api/admin/cms', requireAdminSession, async (req: any, res) => {
    try {
      const adminUser = req.session.adminUser;
      const { key, contentType, contentEn, contentAr, metadata } = req.body;
      
      if (!key || !contentType) {
        return res.status(400).json({ message: "Key and content type are required" });
      }
      
      const content = await storage.upsertCmsContent({
        key,
        contentType,
        contentEn,
        contentAr,
        metadata,
        updatedBy: adminUser.username,
      });
      
      res.json(content);
    } catch (error: any) {
      console.error("Error upserting CMS content:", error);
      res.status(400).json({ message: error.message || "Failed to update content" });
    }
  });
  
  // Delete CMS content (admin only)
  app.delete('/api/admin/cms/:key', requireAdminSession, async (req, res) => {
    try {
      const { key } = req.params;
      await storage.deleteCmsContent(key);
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting CMS content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
