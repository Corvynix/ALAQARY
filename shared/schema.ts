import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  city: text("city").notNull(),
  propertyType: text("property_type").notNull(),
  price: numeric("price").notNull(),
  sizeSqm: numeric("size_sqm"),
  description: text("description"),
  descriptionEn: text("description_en"),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("available"),
  views: numeric("views").notNull().default("0"),
  realSalesRate: numeric("real_sales_rate"),
  commonObjections: text("common_objections"),
  closingFeatures: text("closing_features"),
  demandIndicator: text("demand_indicator"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export const marketTrends = pgTable("market_trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  city: text("city").notNull(),
  avgPrice: numeric("avg_price"),
  demandLevel: text("demand_level"),
  changePercent: numeric("change_percent"),
  notes: text("notes"),
  notesEn: text("notes_en"),
  views: numeric("views").notNull().default("0"),
  dailyDemand: numeric("daily_demand"),
  weeklyDemand: numeric("weekly_demand"),
  newProjectIndicator: text("new_project_indicator"),
  salesVelocity: numeric("sales_velocity"),
  brokerPerformance: text("broker_performance"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMarketTrendSchema = createInsertSchema(marketTrends).omit({
  id: true,
  updatedAt: true,
});

export type InsertMarketTrend = z.infer<typeof insertMarketTrendSchema>;
export type MarketTrend = typeof marketTrends.$inferSelect;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  purpose: text("purpose"),
  city: text("city"),
  budget: text("budget"),
  message: text("message"),
  funnelStage: text("funnel_stage").default("curiosity"),
  purchaseProbability: numeric("purchase_probability").default("0"),
  decisionType: text("decision_type"),
  behavioralTriggers: text("behavioral_triggers"),
  lastInteractionAt: timestamp("last_interaction_at"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  body: text("body"),
  bodyEn: text("body_en"),
  category: text("category"),
  views: numeric("views").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export const roiCalculatorUsage = pgTable("roi_calculator_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalUsage: numeric("total_usage").notNull().default("0"),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
});

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dailyContacts: numeric("daily_contacts").default("0"),
  closingRate: numeric("closing_rate").default("0"),
  responseSpeed: numeric("response_speed"),
  totalDeals: numeric("total_deals").default("0"),
  totalRevenue: numeric("total_revenue").default("0"),
  activeProjects: text("active_projects").array().default(sql`ARRAY[]::text[]`),
  scripts: text("scripts"),
  pitchEffectiveness: text("pitch_effectiveness"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export const userBehaviors = pgTable("user_behaviors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  leadId: text("lead_id"),
  behaviorType: text("behavior_type").notNull(),
  action: text("action").notNull(),
  target: text("target"),
  targetId: text("target_id"),
  metadata: text("metadata"),
  timeSpent: numeric("time_spent"),
  scrollDepth: numeric("scroll_depth"),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserBehaviorSchema = createInsertSchema(userBehaviors).omit({
  id: true,
  createdAt: true,
});

export type InsertUserBehavior = z.infer<typeof insertUserBehaviorSchema>;
export type UserBehavior = typeof userBehaviors.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: text("lead_id").notNull(),
  propertyId: text("property_id").notNull(),
  agentId: text("agent_id"),
  dealValue: numeric("deal_value").notNull(),
  commission: numeric("commission"),
  status: text("status").default("pending"),
  purchaseDate: timestamp("purchase_date"),
  contractSigned: timestamp("contract_signed"),
  paymentReceived: timestamp("payment_received"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
