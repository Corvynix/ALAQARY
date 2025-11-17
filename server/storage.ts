import {
  users,
  developers,
  properties,
  buyerProfiles,
  consultations,
  consultationBookings,
  payments,
  contracts,
  commissions,
  marketData,
  behavioralTracking,
  referrals,
  notifications,
  adminCredentials,
  cmsContent,
  type User,
  type UpsertUser,
  type Developer,
  type InsertDeveloper,
  type Property,
  type InsertProperty,
  type BuyerProfile,
  type InsertBuyerProfile,
  type Consultation,
  type InsertConsultation,
  type ConsultationBooking,
  type InsertConsultationBooking,
  type Payment,
  type InsertPayment,
  type Contract,
  type InsertContract,
  type Commission,
  type InsertCommission,
  type MarketData,
  type InsertMarketData,
  type BehavioralTracking,
  type InsertBehavioralTracking,
  type Referral,
  type InsertReferral,
  type Notification,
  type InsertNotification,
  type AdminCredential,
  type InsertAdminCredential,
  type CmsContent,
  type InsertCmsContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, or, ilike, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function generateCustomerCode(role: string, existingCode?: string | null): string {
  if (existingCode) return existingCode;
  
  const prefixes: { [key: string]: string } = {
    'admin': 'ADM',
    'client': 'CLT',
    'developer': 'DEV'
  };
  
  const prefix = prefixes[role] || 'USR';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(page?: number, limit?: number, search?: string, role?: string): Promise<PaginatedResponse<User>>;
  
  // Developer operations
  getDeveloperByUserId(userId: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloperTrustScore(id: string, score: number): Promise<void>;
  getAllDevelopers(page?: number, limit?: number, search?: string): Promise<PaginatedResponse<Developer>>;
  
  // Property operations
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByDeveloper(developerId: string): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property>;
  incrementPropertyViews(id: string): Promise<void>;
  
  // Buyer Profile operations
  getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined>;
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  updateBuyerProfile(userId: string, updates: Partial<BuyerProfile>): Promise<BuyerProfile>;
  
  // Consultation operations
  getConsultation(id: string): Promise<Consultation | undefined>;
  getConsultationsByUser(userId: string): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation>;
  
  // Consultation Booking operations
  createConsultationBooking(booking: InsertConsultationBooking): Promise<ConsultationBooking>;
  getAllConsultationBookings(page?: number, limit?: number): Promise<PaginatedResponse<ConsultationBooking>>;
  getUserConsultationBookings(userId: string): Promise<ConsultationBooking[]>;
  updateBookingPaymentStatus(id: string, status: string, phone?: string): Promise<void>;
  updateBookingNotes(id: string, notes: string): Promise<void>;
  updateBookingStatus(id: string, status: string): Promise<void>;
  
  // Payment operations
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  getAllPayments(page?: number, limit?: number): Promise<PaginatedResponse<Payment>>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string): Promise<void>;
  
  // Contract operations
  getContractsByUser(userId: string): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  
  // Commission operations
  getCommissionsByDeveloper(developerId: string): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  
  // Market Data operations
  getAllMarketData(): Promise<MarketData[]>;
  getMarketDataByRegion(region: string): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  bulkCreateMarketData(dataArray: InsertMarketData[]): Promise<MarketData[]>;
  
  // Behavioral Tracking operations
  createBehavioralTracking(tracking: InsertBehavioralTracking): Promise<BehavioralTracking>;
  getBehavioralTrackingByUser(userId: string): Promise<BehavioralTracking[]>;
  getAllBehavioralTracking(): Promise<BehavioralTracking[]>;
  
  // Referral operations
  getReferralByCode(code: string): Promise<Referral | undefined>;
  getReferralsByReferrer(referrerId: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Admin Credentials operations
  getAdminByUsername(username: string): Promise<AdminCredential | undefined>;
  createAdminCredential(credential: InsertAdminCredential): Promise<AdminCredential>;
  updateAdminPassword(username: string, newPasswordHash: string): Promise<void>;
  verifyAdminPassword(username: string, password: string): Promise<boolean>;
  
  // CMS Content operations
  getCmsContentByKey(key: string): Promise<CmsContent | undefined>;
  getAllCmsContent(): Promise<CmsContent[]>;
  upsertCmsContent(content: InsertCmsContent): Promise<CmsContent>;
  deleteCmsContent(key: string): Promise<void>;
  
  // Update notes for entities
  updateUserNotes(id: string, notes: string): Promise<void>;
  updateDeveloperNotes(id: string, notes: string): Promise<void>;
  updatePropertyNotes(id: string, notes: string): Promise<void>;
  updateBuyerProfileNotes(userId: string, notes: string): Promise<void>;
  updateMarketDataNotes(id: string, notes: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const customerCode = generateCustomerCode(userData.role || 'client', userData.customerCode);
    
    const [user] = await db
      .insert(users)
      .values({ ...userData, customerCode })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          customerCode,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string
  ): Promise<PaginatedResponse<User>> {
    const offset = (page - 1) * limit;
    
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.customerCode, `%${search}%`)
        )
      );
    }
    
    if (role && role !== 'all') {
      conditions.push(eq(users.role, role as any));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(users)
        .where(whereClause)
    ]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(Number(total) / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages,
      },
    };
  }

  // Developer operations
  async getDeveloperByUserId(userId: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.userId, userId));
    return developer;
  }

  async createDeveloper(developerData: InsertDeveloper): Promise<Developer> {
    const [developer] = await db.insert(developers).values(developerData).returning();
    return developer;
  }

  async updateDeveloperTrustScore(id: string, score: number): Promise<void> {
    await db.update(developers)
      .set({ trustScore: score.toString(), updatedAt: new Date() })
      .where(eq(developers.id, id));
  }

  async getAllDevelopers(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<PaginatedResponse<Developer>> {
    const offset = (page - 1) * limit;
    
    const whereClause = search
      ? or(
          ilike(developers.companyName, `%${search}%`),
          ilike(developers.licenseNumber, `%${search}%`)
        )
      : undefined;
    
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(developers)
        .where(whereClause)
        .orderBy(desc(developers.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(developers)
        .where(whereClause)
    ]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(Number(total) / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages,
      },
    };
  }

  // Property operations
  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByDeveloper(developerId: string): Promise<Property[]> {
    return db.select().from(properties)
      .where(eq(properties.developerId, developerId))
      .orderBy(desc(properties.createdAt));
  }

  async getAllProperties(): Promise<Property[]> {
    return db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(propertyData).returning();
    return property;
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const [property] = await db.update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async incrementPropertyViews(id: string): Promise<void> {
    await db.update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, id));
  }

  // Buyer Profile operations
  async getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
    return profile;
  }

  async createBuyerProfile(profileData: InsertBuyerProfile): Promise<BuyerProfile> {
    const [profile] = await db.insert(buyerProfiles).values(profileData).returning();
    return profile;
  }

  async updateBuyerProfile(userId: string, updates: Partial<BuyerProfile>): Promise<BuyerProfile> {
    const [profile] = await db.update(buyerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(buyerProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Consultation operations
  async getConsultation(id: string): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation;
  }

  async getConsultationsByUser(userId: string): Promise<Consultation[]> {
    return db.select().from(consultations)
      .where(eq(consultations.userId, userId))
      .orderBy(desc(consultations.createdAt));
  }

  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db.insert(consultations).values(consultationData).returning();
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation> {
    const [consultation] = await db.update(consultations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(consultations.id, id))
      .returning();
    return consultation;
  }

  // Consultation Booking operations
  async createConsultationBooking(bookingData: InsertConsultationBooking): Promise<ConsultationBooking> {
    const [booking] = await db.insert(consultationBookings).values(bookingData).returning();
    return booking;
  }

  async getAllConsultationBookings(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<ConsultationBooking>> {
    const offset = (page - 1) * limit;
    
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(consultationBookings)
        .orderBy(desc(consultationBookings.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(consultationBookings)
    ]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(Number(total) / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages,
      },
    };
  }

  async getUserConsultationBookings(userId: string): Promise<ConsultationBooking[]> {
    return db.select().from(consultationBookings)
      .where(eq(consultationBookings.userId, userId))
      .orderBy(desc(consultationBookings.createdAt));
  }

  async updateBookingPaymentStatus(id: string, status: string, phone?: string): Promise<void> {
    const updates: any = {
      paymentStatus: status,
      updatedAt: new Date(),
    };
    if (phone) {
      updates.paymentPhone = phone;
    }
    await db.update(consultationBookings)
      .set(updates)
      .where(eq(consultationBookings.id, id));
  }

  async updateBookingNotes(id: string, notes: string): Promise<void> {
    await db.update(consultationBookings)
      .set({ notes, updatedAt: new Date() })
      .where(eq(consultationBookings.id, id));
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db.update(consultationBookings)
      .set({ bookingStatus: status as any, updatedAt: new Date() })
      .where(eq(consultationBookings.id, id));
  }

  // Payment operations
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return db.select().from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getAllPayments(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Payment>> {
    const offset = (page - 1) * limit;
    
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(payments)
        .orderBy(desc(payments.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(payments)
    ]);
    
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(Number(total) / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages,
      },
    };
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<void> {
    await db.update(payments)
      .set({ paymentStatus: status as any })
      .where(eq(payments.id, id));
  }

  // Contract operations
  async getContractsByUser(userId: string): Promise<Contract[]> {
    return db.select().from(contracts)
      .where(eq(contracts.userId, userId))
      .orderBy(desc(contracts.createdAt));
  }

  async createContract(contractData: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(contractData).returning();
    return contract;
  }

  // Commission operations
  async getCommissionsByDeveloper(developerId: string): Promise<Commission[]> {
    return db.select().from(commissions)
      .where(eq(commissions.developerId, developerId))
      .orderBy(desc(commissions.createdAt));
  }

  async createCommission(commissionData: InsertCommission): Promise<Commission> {
    const [commission] = await db.insert(commissions).values(commissionData).returning();
    return commission;
  }

  // Market Data operations
  async getAllMarketData(): Promise<MarketData[]> {
    return db.select().from(marketData).orderBy(desc(marketData.createdAt));
  }

  async getMarketDataByRegion(region: string): Promise<MarketData[]> {
    return db.select().from(marketData)
      .where(eq(marketData.region, region))
      .orderBy(desc(marketData.createdAt));
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const [record] = await db.insert(marketData).values(data).returning();
    return record;
  }

  async bulkCreateMarketData(dataArray: InsertMarketData[]): Promise<MarketData[]> {
    return db.insert(marketData).values(dataArray).returning();
  }

  // Behavioral Tracking operations
  async createBehavioralTracking(trackingData: InsertBehavioralTracking): Promise<BehavioralTracking> {
    const [record] = await db.insert(behavioralTracking).values(trackingData).returning();
    return record;
  }

  async getBehavioralTrackingByUser(userId: string): Promise<BehavioralTracking[]> {
    return db.select().from(behavioralTracking)
      .where(eq(behavioralTracking.userId, userId))
      .orderBy(desc(behavioralTracking.timestamp));
  }

  async getAllBehavioralTracking(): Promise<BehavioralTracking[]> {
    return db.select().from(behavioralTracking).orderBy(desc(behavioralTracking.timestamp));
  }

  // Referral operations
  async getReferralByCode(code: string): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.referralCode, code));
    return referral;
  }

  async getReferralsByReferrer(referrerId: string): Promise<Referral[]> {
    return db.select().from(referrals)
      .where(eq(referrals.referrerId, referrerId))
      .orderBy(desc(referrals.createdAt));
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(referralData).returning();
    return referral;
  }

  // Notification operations
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  // Admin Credentials operations
  async getAdminByUsername(username: string): Promise<AdminCredential | undefined> {
    const [admin] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username));
    return admin;
  }

  async createAdminCredential(credentialData: InsertAdminCredential): Promise<AdminCredential> {
    const [credential] = await db.insert(adminCredentials).values(credentialData).returning();
    return credential;
  }

  async updateAdminPassword(username: string, newPasswordHash: string): Promise<void> {
    await db.update(adminCredentials)
      .set({ 
        passwordHash: newPasswordHash,
        mustChangePassword: false,
        lastPasswordChange: new Date(),
        updatedAt: new Date()
      })
      .where(eq(adminCredentials.username, username));
  }

  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compare(password, admin.passwordHash);
  }

  // CMS Content operations
  async getCmsContentByKey(key: string): Promise<CmsContent | undefined> {
    const [content] = await db.select().from(cmsContent).where(eq(cmsContent.key, key));
    return content;
  }

  async getAllCmsContent(): Promise<CmsContent[]> {
    return db.select().from(cmsContent).orderBy(desc(cmsContent.updatedAt));
  }

  async upsertCmsContent(contentData: InsertCmsContent): Promise<CmsContent> {
    const [content] = await db
      .insert(cmsContent)
      .values(contentData)
      .onConflictDoUpdate({
        target: cmsContent.key,
        set: {
          ...contentData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return content;
  }

  async deleteCmsContent(key: string): Promise<void> {
    await db.delete(cmsContent).where(eq(cmsContent.key, key));
  }

  // Update notes for entities
  async updateUserNotes(id: string, notes: string): Promise<void> {
    await db.update(users)
      .set({ notes, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async updateDeveloperNotes(id: string, notes: string): Promise<void> {
    await db.update(developers)
      .set({ notes, updatedAt: new Date() })
      .where(eq(developers.id, id));
  }

  async updatePropertyNotes(id: string, notes: string): Promise<void> {
    await db.update(properties)
      .set({ notes, updatedAt: new Date() })
      .where(eq(properties.id, id));
  }

  async updateBuyerProfileNotes(userId: string, notes: string): Promise<void> {
    await db.update(buyerProfiles)
      .set({ notes, updatedAt: new Date() })
      .where(eq(buyerProfiles.userId, userId));
  }

  async updateMarketDataNotes(id: string, notes: string): Promise<void> {
    await db.update(marketData)
      .set({ notes })
      .where(eq(marketData.id, id));
  }
}

/**
 * MemStorage - In-memory storage implementation for development only
 * 
 * ⚠️  WARNING: This storage is NOT persistent!
 * ⚠️  All data will be LOST when the server restarts
 * ⚠️  Only use this for development and testing
 * ⚠️  NEVER use in production
 * 
 * This implementation is used when DATABASE_URL is not set in development mode.
 */
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private developers: Map<string, Developer> = new Map();
  private properties: Map<string, Property> = new Map();
  private buyerProfiles: Map<string, BuyerProfile> = new Map();
  private consultations: Map<string, Consultation> = new Map();
  private consultationBookings: Map<string, ConsultationBooking> = new Map();
  private payments: Map<string, Payment> = new Map();
  private contracts: Map<string, Contract> = new Map();
  private commissions: Map<string, Commission> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private behavioralTracking: Map<string, BehavioralTracking> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private adminCredentials: Map<string, AdminCredential> = new Map();
  private cmsContent: Map<string, CmsContent> = new Map();

  constructor() {
    console.warn('\n' + '='.repeat(80));
    console.warn('⚠️  WARNING: USING IN-MEMORY STORAGE (MemStorage)');
    console.warn('⚠️  All data will be LOST when the server restarts!');
    console.warn('⚠️  This is for DEVELOPMENT ONLY - DO NOT use in production');
    console.warn('⚠️  Set DATABASE_URL environment variable to use persistent storage');
    console.warn('='.repeat(80) + '\n');
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = Array.from(this.users.values()).find(u => u.id === userData.id);
    const customerCode = generateCustomerCode(userData.role || 'client', existing?.customerCode);
    
    const user: User = {
      ...(existing || {}),
      ...userData,
      id: userData.id || this.generateId(),
      customerCode,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    } as User;
    
    this.users.set(user.id, user);
    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 20, search?: string, role?: string): Promise<PaginatedResponse<User>> {
    let allUsers = Array.from(this.users.values());
    
    if (search) {
      const searchLower = search.toLowerCase();
      allUsers = allUsers.filter(u => 
        u.firstName?.toLowerCase().includes(searchLower) ||
        u.lastName?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.customerCode?.toLowerCase().includes(searchLower)
      );
    }
    
    if (role && role !== 'all') {
      allUsers = allUsers.filter(u => u.role === role);
    }
    
    allUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = allUsers.length;
    const start = (page - 1) * limit;
    const data = allUsers.slice(start, start + limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDeveloperByUserId(userId: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(d => d.userId === userId);
  }

  async createDeveloper(developerData: InsertDeveloper): Promise<Developer> {
    const developer: Developer = {
      ...developerData,
      id: this.generateId(),
      trustScore: developerData.trustScore || '0',
      totalDeals: developerData.totalDeals || 0,
      successfulDeals: developerData.successfulDeals || 0,
      complaints: developerData.complaints || 0,
      verified: developerData.verified || false,
      notes: developerData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Developer;
    
    this.developers.set(developer.id, developer);
    return developer;
  }

  async updateDeveloperTrustScore(id: string, score: number): Promise<void> {
    const developer = this.developers.get(id);
    if (developer) {
      developer.trustScore = score.toString();
      developer.updatedAt = new Date();
    }
  }

  async getAllDevelopers(page: number = 1, limit: number = 20, search?: string): Promise<PaginatedResponse<Developer>> {
    let allDevelopers = Array.from(this.developers.values());
    
    if (search) {
      const searchLower = search.toLowerCase();
      allDevelopers = allDevelopers.filter(d => 
        d.companyName?.toLowerCase().includes(searchLower) ||
        d.licenseNumber?.toLowerCase().includes(searchLower)
      );
    }
    
    allDevelopers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = allDevelopers.length;
    const start = (page - 1) * limit;
    const data = allDevelopers.slice(start, start + limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByDeveloper(developerId: string): Promise<Property[]> {
    return Array.from(this.properties.values())
      .filter(p => p.developerId === developerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const property: Property = {
      ...propertyData,
      id: this.generateId(),
      images: propertyData.images || [],
      amenities: propertyData.amenities || [],
      status: propertyData.status || 'available',
      featured: propertyData.featured || false,
      viewCount: propertyData.viewCount || 0,
      notes: propertyData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Property;
    
    this.properties.set(property.id, property);
    return property;
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const property = this.properties.get(id);
    if (!property) throw new Error('Property not found');
    
    const updated = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async incrementPropertyViews(id: string): Promise<void> {
    const property = this.properties.get(id);
    if (property) {
      property.viewCount++;
    }
  }

  async getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined> {
    return Array.from(this.buyerProfiles.values()).find(p => p.userId === userId);
  }

  async createBuyerProfile(profileData: InsertBuyerProfile): Promise<BuyerProfile> {
    const profile: BuyerProfile = {
      ...profileData,
      id: this.generateId(),
      preferredRegions: profileData.preferredRegions || [],
      preferredPropertyTypes: profileData.preferredPropertyTypes || [],
      riskTolerance: profileData.riskTolerance || 'moderate',
      profileCompletion: profileData.profileCompletion || 0,
      notes: profileData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as BuyerProfile;
    
    this.buyerProfiles.set(profile.id, profile);
    return profile;
  }

  async updateBuyerProfile(userId: string, updates: Partial<BuyerProfile>): Promise<BuyerProfile> {
    const profile = Array.from(this.buyerProfiles.values()).find(p => p.userId === userId);
    if (!profile) throw new Error('Profile not found');
    
    const updated = { ...profile, ...updates, updatedAt: new Date() };
    this.buyerProfiles.set(profile.id, updated);
    return updated;
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async getConsultationsByUser(userId: string): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const consultation: Consultation = {
      ...consultationData,
      id: this.generateId(),
      questionsAsked: consultationData.questionsAsked || [],
      status: consultationData.status || 'active',
      notes: consultationData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Consultation;
    
    this.consultations.set(consultation.id, consultation);
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation> {
    const consultation = this.consultations.get(id);
    if (!consultation) throw new Error('Consultation not found');
    
    const updated = { ...consultation, ...updates, updatedAt: new Date() };
    this.consultations.set(id, updated);
    return updated;
  }

  async createConsultationBooking(bookingData: InsertConsultationBooking): Promise<ConsultationBooking> {
    const booking: ConsultationBooking = {
      ...bookingData,
      id: this.generateId(),
      consultationFee: bookingData.consultationFee || '200',
      paymentStatus: bookingData.paymentStatus || 'pending',
      bookingStatus: bookingData.bookingStatus || 'pending',
      priorities: bookingData.priorities || [],
      notes: bookingData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ConsultationBooking;
    
    this.consultationBookings.set(booking.id, booking);
    return booking;
  }

  async getAllConsultationBookings(page: number = 1, limit: number = 20): Promise<PaginatedResponse<ConsultationBooking>> {
    const allBookings = Array.from(this.consultationBookings.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = allBookings.length;
    const start = (page - 1) * limit;
    const data = allBookings.slice(start, start + limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserConsultationBookings(userId: string): Promise<ConsultationBooking[]> {
    return Array.from(this.consultationBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateBookingPaymentStatus(id: string, status: string, phone?: string): Promise<void> {
    const booking = this.consultationBookings.get(id);
    if (booking) {
      booking.paymentStatus = status as any;
      if (phone) booking.paymentPhone = phone;
      booking.updatedAt = new Date();
    }
  }

  async updateBookingNotes(id: string, notes: string): Promise<void> {
    const booking = this.consultationBookings.get(id);
    if (booking) {
      booking.notes = notes;
      booking.updatedAt = new Date();
    }
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    const booking = this.consultationBookings.get(id);
    if (booking) {
      booking.bookingStatus = status as any;
      booking.updatedAt = new Date();
    }
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllPayments(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Payment>> {
    const allPayments = Array.from(this.payments.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = allPayments.length;
    const start = (page - 1) * limit;
    const data = allPayments.slice(start, start + limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      ...paymentData,
      id: this.generateId(),
      paymentStatus: paymentData.paymentStatus || 'pending',
      notes: paymentData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Payment;
    
    this.payments.set(payment.id, payment);
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<void> {
    const payment = this.payments.get(id);
    if (payment) {
      payment.paymentStatus = status as any;
    }
  }

  async getContractsByUser(userId: string): Promise<Contract[]> {
    return Array.from(this.contracts.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createContract(contractData: InsertContract): Promise<Contract> {
    const contract: Contract = {
      ...contractData,
      id: this.generateId(),
      notes: contractData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contract;
    
    this.contracts.set(contract.id, contract);
    return contract;
  }

  async getCommissionsByDeveloper(developerId: string): Promise<Commission[]> {
    return Array.from(this.commissions.values())
      .filter(c => c.developerId === developerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCommission(commissionData: InsertCommission): Promise<Commission> {
    const commission: Commission = {
      ...commissionData,
      id: this.generateId(),
      notes: commissionData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Commission;
    
    this.commissions.set(commission.id, commission);
    return commission;
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMarketDataByRegion(region: string): Promise<MarketData[]> {
    return Array.from(this.marketData.values())
      .filter(m => m.region === region)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const marketDataRecord: MarketData = {
      ...data,
      id: this.generateId(),
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as MarketData;
    
    this.marketData.set(marketDataRecord.id, marketDataRecord);
    return marketDataRecord;
  }

  async bulkCreateMarketData(dataArray: InsertMarketData[]): Promise<MarketData[]> {
    return Promise.all(dataArray.map(data => this.createMarketData(data)));
  }

  async createBehavioralTracking(trackingData: InsertBehavioralTracking): Promise<BehavioralTracking> {
    const tracking: BehavioralTracking = {
      ...trackingData,
      id: this.generateId(),
      timestamp: new Date(),
    } as BehavioralTracking;
    
    this.behavioralTracking.set(tracking.id, tracking);
    return tracking;
  }

  async getBehavioralTrackingByUser(userId: string): Promise<BehavioralTracking[]> {
    return Array.from(this.behavioralTracking.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAllBehavioralTracking(): Promise<BehavioralTracking[]> {
    return Array.from(this.behavioralTracking.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getReferralByCode(code: string): Promise<Referral | undefined> {
    return Array.from(this.referrals.values()).find(r => r.referralCode === code);
  }

  async getReferralsByReferrer(referrerId: string): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(r => r.referrerId === referrerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const referral: Referral = {
      ...referralData,
      id: this.generateId(),
      createdAt: new Date(),
    } as Referral;
    
    this.referrals.set(referral.id, referral);
    return referral;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: this.generateId(),
      read: notificationData.read || false,
      createdAt: new Date(),
    } as Notification;
    
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
    }
  }

  async getAdminByUsername(username: string): Promise<AdminCredential | undefined> {
    return Array.from(this.adminCredentials.values()).find(a => a.username === username);
  }

  async createAdminCredential(credentialData: InsertAdminCredential): Promise<AdminCredential> {
    const credential: AdminCredential = {
      ...credentialData,
      id: this.generateId(),
      lastPasswordChange: credentialData.lastPasswordChange || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AdminCredential;
    
    this.adminCredentials.set(credential.id, credential);
    return credential;
  }

  async updateAdminPassword(username: string, newPasswordHash: string): Promise<void> {
    const admin = Array.from(this.adminCredentials.values()).find(a => a.username === username);
    if (admin) {
      admin.passwordHash = newPasswordHash;
      admin.mustChangePassword = false;
      admin.lastPasswordChange = new Date();
      admin.updatedAt = new Date();
    }
  }

  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compare(password, admin.passwordHash);
  }

  async getCmsContentByKey(key: string): Promise<CmsContent | undefined> {
    return this.cmsContent.get(key);
  }

  async getAllCmsContent(): Promise<CmsContent[]> {
    return Array.from(this.cmsContent.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async upsertCmsContent(contentData: InsertCmsContent): Promise<CmsContent> {
    const existing = this.cmsContent.get(contentData.key);
    const content: CmsContent = {
      ...(existing || {}),
      ...contentData,
      id: existing?.id || this.generateId(),
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    } as CmsContent;
    
    this.cmsContent.set(content.key, content);
    return content;
  }

  async deleteCmsContent(key: string): Promise<void> {
    this.cmsContent.delete(key);
  }

  async updateUserNotes(id: string, notes: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.notes = notes;
      user.updatedAt = new Date();
    }
  }

  async updateDeveloperNotes(id: string, notes: string): Promise<void> {
    const developer = this.developers.get(id);
    if (developer) {
      developer.notes = notes;
      developer.updatedAt = new Date();
    }
  }

  async updatePropertyNotes(id: string, notes: string): Promise<void> {
    const property = this.properties.get(id);
    if (property) {
      property.notes = notes;
      property.updatedAt = new Date();
    }
  }

  async updateBuyerProfileNotes(userId: string, notes: string): Promise<void> {
    const profile = Array.from(this.buyerProfiles.values()).find(p => p.userId === userId);
    if (profile) {
      profile.notes = notes;
      profile.updatedAt = new Date();
    }
  }

  async updateMarketDataNotes(id: string, notes: string): Promise<void> {
    const data = this.marketData.get(id);
    if (data) {
      data.notes = notes;
    }
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
