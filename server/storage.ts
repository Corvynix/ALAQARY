import {
  users,
  developers,
  properties,
  contracts,
  buyerProfiles,
  propertyMatches,
  aiCloserSessions,
  objectionResponses,
  behavioralEvents,
  referralProgram,
  type User,
  type UpsertUser,
  type Developer,
  type InsertDeveloper,
  type Property,
  type InsertProperty,
  type Contract,
  type InsertContract,
  type BuyerProfile,
  type InsertBuyerProfile,
  type PropertyMatch,
  type InsertPropertyMatch,
  type AICloserSession,
  type InsertAICloserSession,
  type ObjectionResponse,
  type InsertObjectionResponse,
  type BehavioralEvent,
  type InsertBehavioralEvent,
  type Referral,
  type InsertReferral,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (Replit Auth required)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Developer operations
  getDeveloper(id: string): Promise<Developer | undefined>;
  getDeveloperByUserId(userId: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloper(id: string, developer: Partial<InsertDeveloper>): Promise<Developer>;
  getAllDevelopers(): Promise<Developer[]>;
  
  // Property operations
  getProperty(id: string): Promise<Property | undefined>;
  getPropertyWithDeveloper(id: string): Promise<(Property & { developer?: Developer }) | undefined>;
  getProperties(filters?: { city?: string; type?: string; search?: string }): Promise<(Property & { developer?: Developer })[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  
  // Contract operations
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByDeveloperId(developerId: string): Promise<Contract[]>;
  getContractsByBuyerId(buyerId: string): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, contract: Partial<InsertContract>): Promise<Contract>;
  
  // Buyer Profile operations
  getBuyerProfile(id: string): Promise<BuyerProfile | undefined>;
  getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined>;
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  updateBuyerProfile(id: string, profile: Partial<InsertBuyerProfile>): Promise<BuyerProfile>;
  
  // Property Match operations
  getPropertyMatch(id: string): Promise<PropertyMatch | undefined>;
  getMatchesByBuyerProfileId(buyerProfileId: string): Promise<(PropertyMatch & { property?: Property & { developer?: Developer } })[]>;
  createPropertyMatch(match: InsertPropertyMatch): Promise<PropertyMatch>;
  updatePropertyMatch(id: string, match: Partial<InsertPropertyMatch>): Promise<PropertyMatch>;
  
  // AI Closer Session operations
  getAICloserSession(id: string): Promise<AICloserSession | undefined>;
  getSessionsByBuyerId(buyerId: string): Promise<AICloserSession[]>;
  createAICloserSession(session: InsertAICloserSession): Promise<AICloserSession>;
  updateAICloserSession(id: string, session: Partial<InsertAICloserSession>): Promise<AICloserSession>;
  
  // Objection Response operations
  createObjectionResponse(response: InsertObjectionResponse): Promise<ObjectionResponse>;
  getObjectionResponsesBySessionId(sessionId: string): Promise<ObjectionResponse[]>;
  
  // Behavioral Event operations
  createBehavioralEvent(event: InsertBehavioralEvent): Promise<BehavioralEvent>;
  getBehavioralEventsByUserId(userId: string): Promise<BehavioralEvent[]>;
  
  // Referral Program operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getReferralsByUserId(userId: string): Promise<Referral[]>;
  
  // Admin stats
  getAdminStats(): Promise<{
    totalUsers: number;
    totalDevelopers: number;
    totalProperties: number;
    totalSessions: number;
    avgPurchaseProbability: number;
    highRiskProperties: number;
  }>;
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

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Developer operations
  async getDeveloper(id: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.id, id));
    return developer;
  }

  async getDeveloperByUserId(userId: string): Promise<Developer | undefined> {
    const [developer] = await db.select().from(developers).where(eq(developers.userId, userId));
    return developer;
  }

  async createDeveloper(developerData: InsertDeveloper): Promise<Developer> {
    const [developer] = await db.insert(developers).values(developerData).returning();
    return developer;
  }

  async updateDeveloper(id: string, developerData: Partial<InsertDeveloper>): Promise<Developer> {
    const [developer] = await db
      .update(developers)
      .set({ ...developerData, updatedAt: new Date() })
      .where(eq(developers.id, id))
      .returning();
    return developer;
  }

  async getAllDevelopers(): Promise<Developer[]> {
    return await db.select().from(developers);
  }

  // Property operations
  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertyWithDeveloper(id: string): Promise<(Property & { developer?: Developer }) | undefined> {
    const [result] = await db
      .select()
      .from(properties)
      .leftJoin(developers, eq(properties.developerId, developers.id))
      .where(eq(properties.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.properties,
      developer: result.developers || undefined,
    };
  }

  async getProperties(filters?: { city?: string; type?: string; search?: string }): Promise<(Property & { developer?: Developer })[]> {
    let query = db.select().from(properties).leftJoin(developers, eq(properties.developerId, developers.id));
    
    const conditions = [];
    if (filters?.city && filters.city !== 'all') {
      conditions.push(eq(properties.city, filters.city));
    }
    if (filters?.type && filters.type !== 'all') {
      conditions.push(eq(properties.type, filters.type));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const results = await query;
    
    return results.map(result => ({
      ...result.properties,
      developer: result.developers || undefined,
    }));
  }

  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(propertyData).returning();
    return property;
  }

  async updateProperty(id: string, propertyData: Partial<InsertProperty>): Promise<Property> {
    const [property] = await db
      .update(properties)
      .set({ ...propertyData, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  // Contract operations
  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }

  async getContractsByDeveloperId(developerId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.developerId, developerId));
  }

  async getContractsByBuyerId(buyerId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.buyerId, buyerId));
  }

  async createContract(contractData: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(contractData).returning();
    return contract;
  }

  async updateContract(id: string, contractData: Partial<InsertContract>): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({ ...contractData, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }

  // Buyer Profile operations
  async getBuyerProfile(id: string): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.id, id));
    return profile;
  }

  async getBuyerProfileByUserId(userId: string): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
    return profile;
  }

  async createBuyerProfile(profileData: InsertBuyerProfile): Promise<BuyerProfile> {
    const [profile] = await db.insert(buyerProfiles).values(profileData).returning();
    return profile;
  }

  async updateBuyerProfile(id: string, profileData: Partial<InsertBuyerProfile>): Promise<BuyerProfile> {
    const [profile] = await db
      .update(buyerProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(buyerProfiles.id, id))
      .returning();
    return profile;
  }

  // Property Match operations
  async getPropertyMatch(id: string): Promise<PropertyMatch | undefined> {
    const [match] = await db.select().from(propertyMatches).where(eq(propertyMatches.id, id));
    return match;
  }

  async getMatchesByBuyerProfileId(buyerProfileId: string): Promise<(PropertyMatch & { property?: Property & { developer?: Developer } })[]> {
    const results = await db
      .select()
      .from(propertyMatches)
      .leftJoin(properties, eq(propertyMatches.propertyId, properties.id))
      .leftJoin(developers, eq(properties.developerId, developers.id))
      .where(eq(propertyMatches.buyerProfileId, buyerProfileId))
      .orderBy(desc(propertyMatches.matchScore));
    
    return results.map(result => ({
      ...result.property_matches,
      property: result.properties ? {
        ...result.properties,
        developer: result.developers || undefined,
      } : undefined,
    }));
  }

  async createPropertyMatch(matchData: InsertPropertyMatch): Promise<PropertyMatch> {
    const [match] = await db.insert(propertyMatches).values(matchData).returning();
    return match;
  }

  async updatePropertyMatch(id: string, matchData: Partial<InsertPropertyMatch>): Promise<PropertyMatch> {
    const [match] = await db
      .update(propertyMatches)
      .set(matchData)
      .where(eq(propertyMatches.id, id))
      .returning();
    return match;
  }

  // AI Closer Session operations
  async getAICloserSession(id: string): Promise<AICloserSession | undefined> {
    const [session] = await db.select().from(aiCloserSessions).where(eq(aiCloserSessions.id, id));
    return session;
  }

  async getSessionsByBuyerId(buyerId: string): Promise<AICloserSession[]> {
    return await db.select().from(aiCloserSessions).where(eq(aiCloserSessions.buyerId, buyerId));
  }

  async createAICloserSession(sessionData: InsertAICloserSession): Promise<AICloserSession> {
    const [session] = await db.insert(aiCloserSessions).values(sessionData).returning();
    return session;
  }

  async updateAICloserSession(id: string, sessionData: Partial<InsertAICloserSession>): Promise<AICloserSession> {
    const [session] = await db
      .update(aiCloserSessions)
      .set({ ...sessionData, updatedAt: new Date() })
      .where(eq(aiCloserSessions.id, id))
      .returning();
    return session;
  }

  // Objection Response operations
  async createObjectionResponse(responseData: InsertObjectionResponse): Promise<ObjectionResponse> {
    const [response] = await db.insert(objectionResponses).values(responseData).returning();
    return response;
  }

  async getObjectionResponsesBySessionId(sessionId: string): Promise<ObjectionResponse[]> {
    return await db.select().from(objectionResponses).where(eq(objectionResponses.sessionId, sessionId));
  }

  // Behavioral Event operations
  async createBehavioralEvent(eventData: InsertBehavioralEvent): Promise<BehavioralEvent> {
    const [event] = await db.insert(behavioralEvents).values(eventData).returning();
    return event;
  }

  async getBehavioralEventsByUserId(userId: string): Promise<BehavioralEvent[]> {
    return await db.select().from(behavioralEvents).where(eq(behavioralEvents.userId, userId));
  }

  // Referral Program operations
  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referralProgram).values(referralData).returning();
    return referral;
  }

  async getReferralsByUserId(userId: string): Promise<Referral[]> {
    return await db.select().from(referralProgram).where(eq(referralProgram.userId, userId));
  }

  // Admin stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalDevelopers: number;
    totalProperties: number;
    totalSessions: number;
    avgPurchaseProbability: number;
    highRiskProperties: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [developerCount] = await db.select({ count: sql<number>`count(*)` }).from(developers);
    const [propertyCount] = await db.select({ count: sql<number>`count(*)` }).from(properties);
    const [sessionCount] = await db.select({ count: sql<number>`count(*)` }).from(aiCloserSessions);
    const [avgProb] = await db.select({ avg: sql<number>`avg(purchase_probability)` }).from(aiCloserSessions);
    const highRisk = await db.select().from(properties).where(sql`cardinality(risk_indicators) > 0`);

    return {
      totalUsers: Number(userCount.count) || 0,
      totalDevelopers: Number(developerCount.count) || 0,
      totalProperties: Number(propertyCount.count) || 0,
      totalSessions: Number(sessionCount.count) || 0,
      avgPurchaseProbability: Number(avgProb.avg) || 0,
      highRiskProperties: highRisk.length,
    };
  }
}

export const storage = new DatabaseStorage();
