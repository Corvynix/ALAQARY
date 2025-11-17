import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isDeveloper } from "./replitAuth";
import { insertPaymentSchema, insertConsultationSchema, insertConsultationBookingSchema, insertMarketDataSchema, insertBehavioralTrackingSchema, insertPropertySchema, upsertUserSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logger, sanitizeError } from "./logger";

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Rate limiting configuration for admin authentication endpoints
 * Max 5 attempts per 15 minutes to prevent brute force attacks
 */
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting configuration for client/developer authentication endpoints
 * Max 10 attempts per 15 minutes - slightly more lenient than admin
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Validation schemas for query parameters and request bodies
 */
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  role: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const regionParamSchema = z.object({
  region: z.string().min(1).max(100),
});

const updateNotesSchema = z.object({
  notes: z.string().max(5000).optional().default(''),
});

const updateStatusSchema = z.object({
  status: z.string().min(1),
});

const updatePaymentStatusSchema = z.object({
  status: z.string().min(1),
  phone: z.string().optional(),
});

// Middleware to require admin session
const requireAdminSession = (req: any, res: any, next: any) => {
  const adminUser = req.session?.adminUser;
  if (!adminUser) {
    logger.warn({ path: req.path, ip: req.ip }, 'Unauthorized admin access attempt');
    return res.status(401).json({ message: "Admin authentication required" });
  }
  next();
};

// Middleware to enforce password change requirement
const requirePasswordChanged = (req: any, res: any, next: any) => {
  const adminUser = req.session?.adminUser;
  
  if (!adminUser) {
    logger.warn({ path: req.path, ip: req.ip }, 'Unauthenticated admin access attempt');
    return res.status(401).json({ message: "Admin authentication required" });
  }
  
  if (adminUser.mustChangePassword && req.path !== '/api/admin/change-password' && req.path !== '/api/admin/logout') {
    logger.warn({ 
      username: adminUser.username, 
      path: req.path 
    }, 'Admin must change password before accessing other routes');
    return res.status(403).json({ 
      message: "You must change your password before accessing other features",
      mustChangePassword: true 
    });
  }
  
  next();
};

// Generate a secure random password
function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  
  return password;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth and CSRF middleware (CSRF is now initialized inside setupAuth)
  await setupAuth(app);

  // CSRF token endpoint
  app.get('/api/csrf-token', (req: any, res) => {
    try {
      res.json({ csrfToken: req.csrfToken() });
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Failed to generate CSRF token');
      res.status(500).json({ message: "Failed to generate CSRF token", requestId: req.id });
    }
  });

  // ==================== AUTH ROUTES ====================
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        logger.warn({ requestId: req.id, userId }, 'User not found');
        return res.status(404).json({ message: "User not found", requestId: req.id });
      }
      
      res.json(user);
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error fetching user');
      res.status(500).json({ message: "Failed to fetch user", requestId: req.id });
    }
  });

  // ==================== ADMIN AUTH ROUTES ====================
  
  // Initialize default admin account (protected with initialization secret)
  app.post('/api/admin/init', adminAuthLimiter, async (req, res) => {
    try {
      const expectedSecret = process.env.ADMIN_INIT_SECRET;
      
      if (!expectedSecret) {
        logger.error("ADMIN_INIT_SECRET environment variable not set");
        return res.status(500).json({ message: "Server misconfiguration - admin initialization unavailable" });
      }
      
      const { initSecret } = req.body;
      
      if (initSecret !== expectedSecret) {
        logger.warn({ ip: req.ip }, 'Invalid admin initialization secret attempt');
        return res.status(401).json({ message: "Invalid initialization secret" });
      }
      
      const existingAdmin = await storage.getAdminByUsername('admin');
      
      if (existingAdmin) {
        logger.warn('Attempt to reinitialize existing admin account');
        return res.status(400).json({ message: "Admin already initialized" });
      }
      
      const bootstrapPassword = generateSecurePassword(16);
      const passwordHash = await bcrypt.hash(bootstrapPassword, 10);
      
      await storage.createAdminCredential({
        username: 'admin',
        passwordHash,
        mustChangePassword: true,
      });
      
      logger.warn('\n' + '='.repeat(80));
      logger.warn('🔐 ADMIN ACCOUNT CREATED');
      logger.warn('='.repeat(80));
      logger.warn(`Username: admin`);
      logger.warn(`Bootstrap Password: ${bootstrapPassword}`);
      logger.warn('⚠️  IMPORTANT: Save this password immediately!');
      logger.warn('⚠️  You will be required to change it on first login');
      logger.warn('⚠️  This password will NOT be shown again!');
      logger.warn('='.repeat(80) + '\n');
      
      res.json({ 
        message: "Admin account created successfully",
        username: "admin",
        bootstrapPassword,
        mustChangePassword: true 
      });
    } catch (error) {
      logger.error({ error }, "Error initializing admin");
      res.status(500).json({ message: "Failed to initialize admin" });
    }
  });
  
  // Admin login
  app.post('/api/admin/login', adminAuthLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        logger.warn({ ip: req.ip }, 'Admin login attempt with missing credentials');
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        logger.warn({ username, ip: req.ip }, 'Admin login attempt with non-existent username');
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await storage.verifyAdminPassword(username, password);
      
      if (!isValid) {
        logger.warn({ username, ip: req.ip }, 'Admin login attempt with invalid password');
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          logger.error({ error: err }, "Error regenerating session");
          return res.status(500).json({ message: "Login failed" });
        }
        
        (req.session as any).adminUser = {
          username: admin.username,
          mustChangePassword: admin.mustChangePassword,
        };
        
        req.session.save((err) => {
          if (err) {
            logger.error({ error: err }, "Error saving session");
            return res.status(500).json({ message: "Login failed" });
          }
          
          logger.info({ username: admin.username }, 'Admin logged in successfully');
          
          res.json({
            username: admin.username,
            mustChangePassword: admin.mustChangePassword,
          });
        });
      });
    } catch (error) {
      logger.error({ error }, "Error during admin login");
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Check admin session
  app.get('/api/admin/session', async (req: any, res) => {
    try {
      const adminUser = (req.session as any).adminUser;
      
      if (!adminUser) {
        return res.status(401).json({ message: "Not authenticated", requestId: req.id });
      }
      
      res.json(adminUser);
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error checking admin session');
      res.status(500).json({ message: "Failed to check session", requestId: req.id });
    }
  });
  
  // Change admin password
  app.post('/api/admin/change-password', requireAdminSession, adminAuthLimiter, async (req, res) => {
    try {
      const adminUser = (req.session as any).adminUser;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        logger.warn({ username: adminUser.username }, 'Password change attempt with missing fields');
        return res.status(400).json({ message: "Current and new passwords required" });
      }
      
      if (newPassword.length < 8) {
        logger.warn({ username: adminUser.username }, 'Password change attempt with weak password');
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      
      const isValid = await storage.verifyAdminPassword(adminUser.username, currentPassword);
      
      if (!isValid) {
        logger.warn({ username: adminUser.username }, 'Password change attempt with incorrect current password');
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateAdminPassword(adminUser.username, newPasswordHash);
      
      (req.session as any).adminUser = {
        username: adminUser.username,
        mustChangePassword: false,
      };
      
      logger.info({ username: adminUser.username }, 'Admin password changed successfully');
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      logger.error({ error }, "Error changing password");
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Admin logout
  app.post('/api/admin/logout', async (req: any, res) => {
    try {
      (req.session as any).adminUser = null;
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error during admin logout');
      res.status(500).json({ message: "Logout failed", requestId: req.id });
    }
  });

  // ==================== CLIENT ROUTES ====================
  
  // Get client profile
  app.get('/api/client/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getBuyerProfileByUserId(userId);
      
      if (!profile) {
        const newProfile = await storage.createBuyerProfile({
          userId,
        });
        logger.info({ requestId: req.id, userId }, 'Created new buyer profile');
        return res.json(newProfile);
      }
      
      res.json(profile);
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error fetching client profile');
      res.status(500).json({ message: "Failed to fetch profile", requestId: req.id });
    }
  });

  // Update client profile
  app.put('/api/client/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const updateSchema = z.object({
        budget: z.string().optional(),
        preferredLocations: z.array(z.string()).optional(),
        propertyTypes: z.array(z.string()).optional(),
        notes: z.string().max(5000).optional(),
      });
      
      const updates = updateSchema.parse(req.body);
      const profile = await storage.updateBuyerProfile(userId, updates);
      
      logger.info({ requestId: req.id, userId }, 'Updated buyer profile');
      res.json(profile);
    } catch (error: any) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error updating profile');
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors, requestId: req.id });
      }
      res.status(500).json({ message: "Failed to update profile", requestId: req.id });
    }
  });

  // Get client consultations
  app.get('/api/client/consultations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const consultations = await storage.getConsultationsByUser(userId);
      res.json(consultations);
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching consultations:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error creating consultation:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching payments:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error creating payment:");
      res.status(400).json({ message: error.message || "Failed to create payment" });
    }
  });

  // Get saved properties (placeholder - returns all for now)
  app.get('/api/client/saved-properties', isAuthenticated, async (req: any, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties.slice(0, 10)); // Return first 10
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching properties:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error creating public consultation booking:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error creating consultation booking:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching consultation bookings:");
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // Get all users
  app.get('/api/admin/users', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path, query: req.query }, 'Fetching all users');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;
      
      const result = await storage.getAllUsers(page, limit, search, role);
      res.json(result);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching users");
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create user (admin only)
  app.post('/api/admin/users', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path }, 'Creating new user');
      const userData = upsertUserSchema.parse(req.body);
      const user = await storage.upsertUser(userData);
      logger.info({ userId: user.id }, 'User created successfully');
      res.json(user);
    } catch (error: any) {
      logger.error({ error, path: req.path }, "Error creating user");
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  // Get all developers
  app.get('/api/admin/developers', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path, query: req.query }, 'Fetching all developers');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      
      const result = await storage.getAllDevelopers(page, limit, search);
      res.json(result);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching developers");
      res.status(500).json({ message: "Failed to fetch developers" });
    }
  });

  // Get all payments
  app.get('/api/admin/payments', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path, query: req.query }, 'Fetching all payments');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getAllPayments(page, limit);
      res.json(result);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching payments");
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Get all consultation bookings (admin, paginated)
  app.get('/api/admin/consultations/bookings', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path, query: req.query }, 'Fetching consultation bookings');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getAllConsultationBookings(page, limit);
      res.json(result);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching consultation bookings");
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update consultation booking payment status (admin only)
  app.put('/api/admin/consultations/bookings/:id/payment', requirePasswordChanged, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, phone } = req.body;
      
      if (!status) {
        logger.warn({ bookingId: id }, 'Payment status update missing status field');
        return res.status(400).json({ message: "Payment status is required" });
      }
      
      logger.debug({ bookingId: id, status }, 'Updating booking payment status');
      await storage.updateBookingPaymentStatus(id, status, phone);
      logger.info({ bookingId: id, status }, 'Payment status updated successfully');
      res.json({ message: "Payment status updated successfully" });
    } catch (error) {
      logger.error({ error, bookingId: req.params.id }, "Error updating payment status");
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // Update consultation booking notes (admin only)
  app.put('/api/admin/consultations/bookings/:id/notes', requirePasswordChanged, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      logger.debug({ bookingId: id }, 'Updating booking notes');
      await storage.updateBookingNotes(id, notes || '');
      logger.info({ bookingId: id }, 'Notes updated successfully');
      res.json({ message: "Notes updated successfully" });
    } catch (error) {
      logger.error({ error, bookingId: req.params.id }, "Error updating notes");
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  // Update consultation booking status (admin only)
  app.put('/api/admin/consultations/bookings/:id/status', requirePasswordChanged, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        logger.warn({ bookingId: id }, 'Booking status update missing status field');
        return res.status(400).json({ message: "Booking status is required" });
      }
      
      logger.debug({ bookingId: id, status }, 'Updating booking status');
      await storage.updateBookingStatus(id, status);
      logger.info({ bookingId: id, status }, 'Booking status updated successfully');
      res.json({ message: "Booking status updated successfully" });
    } catch (error) {
      logger.error({ error, bookingId: req.params.id }, "Error updating booking status");
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Get all market data
  app.get('/api/admin/market-data', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path }, 'Fetching market data');
      const data = await storage.getAllMarketData();
      res.json(data);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching market data");
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Get all behavioral tracking data
  app.get('/api/admin/behavioral-tracking', requirePasswordChanged, async (req, res) => {
    try {
      logger.debug({ path: req.path }, 'Fetching behavioral tracking');
      const tracking = await storage.getAllBehavioralTracking();
      res.json(tracking);
    } catch (error) {
      logger.error({ error, path: req.path }, "Error fetching behavioral tracking");
      res.status(500).json({ message: "Failed to fetch behavioral tracking" });
    }
  });

  // Upload market data (JSON)
  app.post('/api/admin/market-data/upload', requirePasswordChanged, async (req, res) => {
    try {
      const { jsonData } = req.body;
      
      if (!jsonData) {
        logger.warn({ path: req.path }, 'Market data upload missing JSON data');
        return res.status(400).json({ message: "JSON data is required" });
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonData);
      } catch (e) {
        logger.warn({ path: req.path, error: e }, 'Invalid JSON format in market data upload');
        return res.status(400).json({ message: "Invalid JSON format" });
      }

      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
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
      logger.info({ recordCount: records.length }, 'Market data uploaded successfully');
      
      res.json({ 
        message: `Successfully uploaded ${records.length} market data record(s)`,
        records 
      });
    } catch (error: any) {
      logger.error({ error, path: req.path }, "Error uploading market data");
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid market data format", errors: error.errors });
      }
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching developer profile:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching developer properties:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error creating property:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching leads:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error tracking behavior:");
      res.status(200).json({ message: "Tracking failed silently" });
    }
  });

  // ==================== PUBLIC ROUTES ====================
  
  // Get all properties (public) - with query param validation
  app.get('/api/properties', async (req: any, res) => {
    try {
      const querySchema = z.object({
        search: z.string().optional(),
        region: z.string().optional(),
        propertyType: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
      });
      
      const queryParams = querySchema.parse(req.query);
      logger.debug({ requestId: req.id, query: queryParams }, 'Fetching properties');
      
      const properties = await storage.getAllProperties();
      
      let filtered = properties;
      if (queryParams.search) {
        const searchLower = queryParams.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.title?.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower)
        );
      }
      if (queryParams.region) {
        filtered = filtered.filter(p => p.location?.toLowerCase().includes(queryParams.region!.toLowerCase()));
      }
      if (queryParams.propertyType) {
        filtered = filtered.filter(p => p.type === queryParams.propertyType);
      }
      if (queryParams.minPrice) {
        filtered = filtered.filter(p => p.price && parseInt(p.price) >= queryParams.minPrice!);
      }
      if (queryParams.maxPrice) {
        filtered = filtered.filter(p => p.price && parseInt(p.price) <= queryParams.maxPrice!);
      }
      
      res.json(filtered);
    } catch (error: any) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error fetching properties');
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid query parameters", errors: error.errors, requestId: req.id });
      }
      res.status(500).json({ message: "Failed to fetch properties", requestId: req.id });
    }
  });

  // Get property by ID (public) - with ID validation
  app.get('/api/properties/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.length < 1) {
        return res.status(400).json({ message: "Invalid property ID", requestId: req.id });
      }
      
      const property = await storage.getProperty(id);
      
      if (!property) {
        logger.debug({ requestId: req.id, propertyId: id }, 'Property not found');
        return res.status(404).json({ message: "Property not found", requestId: req.id });
      }
      
      await storage.incrementPropertyViews(id);
      logger.debug({ requestId: req.id, propertyId: id }, 'Property view incremented');
      
      res.json(property);
    } catch (error) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error fetching property');
      res.status(500).json({ message: "Failed to fetch property", requestId: req.id });
    }
  });

  // Get market data by region (public) - with region validation
  app.get('/api/market-data/:region', async (req: any, res) => {
    try {
      const params = regionParamSchema.parse(req.params);
      logger.debug({ requestId: req.id, region: params.region }, 'Fetching market data');
      
      const data = await storage.getMarketDataByRegion(params.region);
      res.json(data);
    } catch (error: any) {
      logger.error({ requestId: req.id, error: sanitizeError(error) }, 'Error fetching market data');
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid region parameter", errors: error.errors, requestId: req.id });
      }
      res.status(500).json({ message: "Failed to fetch market data", requestId: req.id });
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error updating user notes:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error updating developer notes:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error updating property notes:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error updating buyer profile notes:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error updating market data notes:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching CMS content:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error fetching CMS content:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error upserting CMS content:");
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
      logger.error({ requestId: req.id, error: sanitizeError(error) },"Error deleting CMS content:");
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
