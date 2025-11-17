import {
  users,
  developers,
  properties,
  buyerProfiles,
  consultations,
  payments,
  contracts,
  commissions,
  marketData,
  behavioralTracking,
  referrals,
  notifications,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Developer operations
  getDeveloperByUserId(userId: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloperTrustScore(id: string, score: number): Promise<void>;
  getAllDevelopers(): Promise<Developer[]>;
  
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
  
  // Payment operations
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
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

  async getAllDevelopers(): Promise<Developer[]> {
    return db.select().from(developers).orderBy(desc(developers.createdAt));
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

  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
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
}

export const storage = new DatabaseStorage();
