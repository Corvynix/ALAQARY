import { 
  type User, 
  type InsertUser,
  type Property,
  type InsertProperty,
  type MarketTrend,
  type InsertMarketTrend,
  type Lead,
  type InsertLead,
  type Content,
  type InsertContent,
  type Agent,
  type InsertAgent,
  type UserBehavior,
  type InsertUserBehavior,
  type Transaction,
  type InsertTransaction,
  type CreditTransaction,
  type InsertCreditTransaction,
  users,
  properties,
  marketTrends,
  leads,
  content,
  roiCalculatorUsage,
  agents,
  userBehaviors,
  transactions,
  creditTransactions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;

  // Market Trend methods
  getAllMarketTrends(): Promise<MarketTrend[]>;
  getMarketTrendById(id: string): Promise<MarketTrend | undefined>;
  getMarketTrendByCity(city: string): Promise<MarketTrend | undefined>;
  createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend>;
  updateMarketTrend(id: string, trend: Partial<InsertMarketTrend>): Promise<MarketTrend | undefined>;
  deleteMarketTrend(id: string): Promise<boolean>;

  // Lead methods
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;

  // Content methods
  getAllContent(): Promise<Content[]>;
  getContentById(id: string): Promise<Content | undefined>;
  getContentByCategory(category: string): Promise<Content[]>;
  createContent(contentItem: InsertContent): Promise<Content>;
  updateContent(id: string, contentItem: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;

  // View tracking methods
  incrementPropertyViews(id: string): Promise<void>;
  incrementContentViews(id: string): Promise<void>;
  incrementMarketTrendViews(id: string): Promise<void>;
  
  // ROI Calculator usage tracking
  getRoiCalculatorUsage(): Promise<number>;
  incrementRoiCalculatorUsage(): Promise<number>;

  // Lead enhancement methods
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  getLeadBySessionId(sessionId: string): Promise<Lead | undefined>;
  getLeadByPhone(phone: string): Promise<Lead | undefined>;

  // Agent methods
  getAllAgents(): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // User Behavior methods
  createUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior>;
  getUserBehaviorsBySessionId(sessionId: string): Promise<UserBehavior[]>;
  getUserBehaviorsByLeadId(leadId: string): Promise<UserBehavior[]>;
  getBehaviorsByType(behaviorType: string, limit?: number): Promise<UserBehavior[]>;
  getAllUserBehaviors(): Promise<UserBehavior[]>;

  // Transaction methods
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  getTransactionsByLeadId(leadId: string): Promise<Transaction[]>;
  getTransactionsByAgentId(agentId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;

  // Convenience aliases for intelligence module
  listProperties(): Promise<Property[]>;
  listMarketTrends(): Promise<MarketTrend[]>;
  listLeads(): Promise<Lead[]>;
  listAgents(): Promise<Agent[]>;
  listUserBehaviors(): Promise<UserBehavior[]>;

  // Credit transaction methods
  getCreditTransactions(userId: string): Promise<CreditTransaction[]>;
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCredits(userId: string): Promise<number>;
  updateUserCredits(userId: string, amount: number): Promise<User | undefined>;
  getAllCreditTransactions(): Promise<CreditTransaction[]>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    return result[0];
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values(property).returning();
    return result[0];
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const result = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return result[0];
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id)).returning();
    return result.length > 0;
  }

  // Market Trend methods
  async getAllMarketTrends(): Promise<MarketTrend[]> {
    return await db.select().from(marketTrends).orderBy(desc(marketTrends.updatedAt));
  }

  async getMarketTrendById(id: string): Promise<MarketTrend | undefined> {
    const result = await db.select().from(marketTrends).where(eq(marketTrends.id, id)).limit(1);
    return result[0];
  }

  async getMarketTrendByCity(city: string): Promise<MarketTrend | undefined> {
    const result = await db.select().from(marketTrends).where(eq(marketTrends.city, city)).limit(1);
    return result[0];
  }

  async createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend> {
    const result = await db.insert(marketTrends).values(trend).returning();
    return result[0];
  }

  async updateMarketTrend(id: string, trend: Partial<InsertMarketTrend>): Promise<MarketTrend | undefined> {
    const result = await db.update(marketTrends).set({ ...trend, updatedAt: new Date() }).where(eq(marketTrends.id, id)).returning();
    return result[0];
  }

  async deleteMarketTrend(id: string): Promise<boolean> {
    const result = await db.delete(marketTrends).where(eq(marketTrends.id, id)).returning();
    return result.length > 0;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  // Content methods
  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content).orderBy(desc(content.createdAt));
  }

  async getContentById(id: string): Promise<Content | undefined> {
    const result = await db.select().from(content).where(eq(content.id, id)).limit(1);
    return result[0];
  }

  async getContentByCategory(category: string): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.category, category)).orderBy(desc(content.createdAt));
  }

  async createContent(contentItem: InsertContent): Promise<Content> {
    const result = await db.insert(content).values(contentItem).returning();
    return result[0];
  }

  async updateContent(id: string, contentItem: Partial<InsertContent>): Promise<Content | undefined> {
    const result = await db.update(content).set(contentItem).where(eq(content.id, id)).returning();
    return result[0];
  }

  async deleteContent(id: string): Promise<boolean> {
    const result = await db.delete(content).where(eq(content.id, id)).returning();
    return result.length > 0;
  }

  async incrementPropertyViews(id: string): Promise<void> {
    await db.update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }

  async incrementContentViews(id: string): Promise<void> {
    await db.update(content)
      .set({ views: sql`${content.views} + 1` })
      .where(eq(content.id, id));
  }

  async incrementMarketTrendViews(id: string): Promise<void> {
    await db.update(marketTrends)
      .set({ views: sql`${marketTrends.views} + 1` })
      .where(eq(marketTrends.id, id));
  }

  async getRoiCalculatorUsage(): Promise<number> {
    const result = await db.select().from(roiCalculatorUsage).limit(1);
    if (result.length === 0) {
      const newRecord = await db.insert(roiCalculatorUsage).values({ totalUsage: "0" }).returning();
      return parseInt(newRecord[0].totalUsage);
    }
    return parseInt(result[0].totalUsage);
  }

  async incrementRoiCalculatorUsage(): Promise<number> {
    const result = await db.select().from(roiCalculatorUsage).limit(1);
    if (result.length === 0) {
      const newRecord = await db.insert(roiCalculatorUsage).values({ totalUsage: "1" }).returning();
      return parseInt(newRecord[0].totalUsage);
    }
    const updated = await db.update(roiCalculatorUsage)
      .set({ 
        totalUsage: sql`${roiCalculatorUsage.totalUsage} + 1`,
        lastUsed: new Date()
      })
      .where(eq(roiCalculatorUsage.id, result[0].id))
      .returning();
    return parseInt(updated[0].totalUsage);
  }

  // Lead enhancement methods
  async updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const result = await db.update(leads).set(lead).where(eq(leads.id, id)).returning();
    return result[0];
  }

  async getLeadBySessionId(sessionId: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.sessionId, sessionId)).limit(1);
    return result[0];
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.phone, phone)).orderBy(desc(leads.createdAt)).limit(1);
    return result[0];
  }

  // Agent methods
  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents).orderBy(desc(agents.createdAt));
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    return result[0];
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const result = await db.insert(agents).values(agent).returning();
    return result[0];
  }

  async updateAgent(id: string, agent: Partial<InsertAgent>): Promise<Agent | undefined> {
    const result = await db.update(agents).set({ ...agent, updatedAt: new Date() }).where(eq(agents.id, id)).returning();
    return result[0];
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id)).returning();
    return result.length > 0;
  }

  // User Behavior methods
  async createUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior> {
    const result = await db.insert(userBehaviors).values(behavior).returning();
    return result[0];
  }

  async getUserBehaviorsBySessionId(sessionId: string): Promise<UserBehavior[]> {
    return await db.select().from(userBehaviors).where(eq(userBehaviors.sessionId, sessionId)).orderBy(desc(userBehaviors.createdAt));
  }

  async getUserBehaviorsByLeadId(leadId: string): Promise<UserBehavior[]> {
    return await db.select().from(userBehaviors).where(eq(userBehaviors.leadId, leadId)).orderBy(desc(userBehaviors.createdAt));
  }

  async getBehaviorsByType(behaviorType: string, limit: number = 100): Promise<UserBehavior[]> {
    return await db.select().from(userBehaviors).where(eq(userBehaviors.behaviorType, behaviorType)).orderBy(desc(userBehaviors.createdAt)).limit(limit);
  }

  async getAllUserBehaviors(): Promise<UserBehavior[]> {
    return await db.select().from(userBehaviors).orderBy(desc(userBehaviors.createdAt));
  }

  // Transaction methods
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return result[0];
  }

  async getTransactionsByLeadId(leadId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.leadId, leadId)).orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByAgentId(agentId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.agentId, agentId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set(transaction).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id)).returning();
    return result.length > 0;
  }

  // Convenience aliases for intelligence module
  async listProperties(): Promise<Property[]> {
    return this.getAllProperties();
  }

  async listMarketTrends(): Promise<MarketTrend[]> {
    return this.getAllMarketTrends();
  }

  async listLeads(): Promise<Lead[]> {
    return this.getAllLeads();
  }

  async listAgents(): Promise<Agent[]> {
    return this.getAllAgents();
  }

  async listUserBehaviors(): Promise<UserBehavior[]> {
    return this.getAllUserBehaviors();
  }

  // Credit transaction methods
  async getCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    return await db.select().from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const result = await db.insert(creditTransactions).values(transaction).returning();
    return result[0];
  }

  async getUserCredits(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user || !user.credits) {
      return 0;
    }
    return parseFloat(user.credits);
  }

  async updateUserCredits(userId: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) {
      return undefined;
    }
    const currentCredits = parseFloat(user.credits || "0");
    const newCredits = Math.max(0, currentCredits + amount); // Prevent negative credits
    
    const result = await db.update(users)
      .set({ credits: newCredits.toString() })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getAllCreditTransactions(): Promise<CreditTransaction[]> {
    return await db.select().from(creditTransactions)
      .orderBy(desc(creditTransactions.createdAt));
  }
}

export const storage = new DbStorage();
