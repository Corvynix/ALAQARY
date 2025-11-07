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
  users,
  properties,
  marketTrends,
  leads,
  content,
  roiCalculatorUsage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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
}

export const storage = new DbStorage();
