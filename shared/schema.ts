import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role").notNull().default("client"),
  fullName: text("full_name"),
  companyName: text("company_name"),
  credits: numeric("credits").default("0"),
  accuracyScore: numeric("accuracy_score").default("0"),
  profileComplete: text("profile_complete").default("false"),
  preferences: text("preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
  role: true,
  fullName: true,
  companyName: true,
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
  // New Property Layer fields
  paymentPlan: text("payment_plan"), // نظام السداد
  cashPercentage: numeric("cash_percentage"), // نسبة الكاش
  deliveryTime: text("delivery_time"), // وقت الاستلام
  services: text("services").array().default(sql`ARRAY[]::text[]`), // الخدمات
  developer: text("developer"), // المطور
  projectName: text("project_name"), // اسم المشروع
  unitNumber: text("unit_number"), // رقم الشقة
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
  monthlyDemand: numeric("monthly_demand"),
  supply: numeric("supply"), // العرض لكل منطقة
  newProjectIndicator: text("new_project_indicator"),
  salesVelocity: numeric("sales_velocity"),
  brokerPerformance: text("broker_performance"), // JSON: { topBrokers: [{ name, deals, area }] }
  // Market Layer enhancements
  realTimePriceAvg: numeric("real_time_price_avg"), // Real-time price average
  supplyMetrics: text("supply_metrics"), // JSON: { available, underConstruction, planned }
  topPerformingBrokers: text("top_performing_brokers"), // JSON: { brokers: [] }
  pricePrediction: numeric("price_prediction"), // Predicted price change
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
  decisionType: text("decision_type"), // fast/hesitant/research-heavy
  behavioralTriggers: text("behavioral_triggers"),
  lastInteractionAt: timestamp("last_interaction_at"),
  sessionId: text("session_id"),
  // Client Layer (Golden Layer) enhancements
  interestLevel: numeric("interest_level"), // 0-100
  regionPreferences: text("region_preferences").array().default(sql`ARRAY[]::text[]`),
  pitchResponses: text("pitch_responses"), // JSON: { pitchId: response }
  objectionPatterns: text("objection_patterns"), // JSON: { objections: [] }
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
  interestedClients: numeric("interested_clients").default("0"), // عدد العملاء المهتمين
  closingRate: numeric("closing_rate").default("0"),
  responseSpeed: numeric("response_speed"), // سرعة الرد (بالدقائق)
  totalDeals: numeric("total_deals").default("0"),
  totalRevenue: numeric("total_revenue").default("0"),
  activeProjects: text("active_projects").array().default(sql`ARRAY[]::text[]`),
  scripts: text("scripts"), // JSON: { commonObjections: [], bestResponses: [], pitchTemplates: [] }
  pitchEffectiveness: text("pitch_effectiveness"), // JSON: { bestPitches: [{ pitch, conversionRate }] }
  objections: text("objections"), // JSON: { common: [{ objection, frequency }], responses: [] }
  averageDealPrice: numeric("average_deal_price"), // الأسعار اللي بيقفل بيها
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
  // Behavior Layer (Most Critical) enhancements
  triggerType: text("trigger_type"), // What triggered this behavior
  trustSignals: text("trust_signals"), // JSON: { signals: [] }
  decisionDriver: text("decision_driver"), // What drove the decision
  pitchStyle: text("pitch_style"), // Style of pitch that worked
  agentClientCompatibility: numeric("agent_client_compatibility"), // Compatibility score
  peakTimeIndicator: text("peak_time_indicator"), // Peak purchase time
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

export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  amount: numeric("amount").notNull(),
  type: text("type").notNull(),
  reason: text("reason"),
  relatedEntityId: text("related_entity_id"),
  relatedEntityType: text("related_entity_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;

export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  propertyId: text("property_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

export const expertSessions = pgTable("expert_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  agentId: text("agent_id"),
  sessionDate: timestamp("session_date").notNull(),
  sessionType: text("session_type").notNull(),
  status: text("status").default("pending"),
  notes: text("notes"),
  meetingLink: text("meeting_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExpertSessionSchema = createInsertSchema(expertSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertExpertSession = z.infer<typeof insertExpertSessionSchema>;
export type ExpertSession = typeof expertSessions.$inferSelect;

// Credit Score Tables
export const creditScores = pgTable("credit_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull(), // User ID, Property ID, or Agent ID
  entityType: text("entity_type").notNull(), // "buyer", "project", "agent"
  score: numeric("score").notNull().default("0"), // 0-1000
  factors: text("factors"), // JSON: { factor: score }
  lastCalculated: timestamp("last_calculated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCreditScoreSchema = createInsertSchema(creditScores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastCalculated: true,
});

export type InsertCreditScore = z.infer<typeof insertCreditScoreSchema>;
export type CreditScore = typeof creditScores.$inferSelect;

// Data Contributions Table
export const dataContributions = pgTable("data_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contributorId: text("contributor_id").notNull(),
  dataType: text("data_type").notNull(), // property_info, pricing, market_trends, sales_data
  region: text("region"),
  data: text("data").notNull(), // JSON data
  accuracyScore: numeric("accuracy_score").default("0"),
  creditsEarned: numeric("credits_earned").default("0"),
  isAnonymous: text("is_anonymous").default("true"),
  verified: text("verified").default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDataContributionSchema = createInsertSchema(dataContributions).omit({
  id: true,
  createdAt: true,
});

export type InsertDataContribution = z.infer<typeof insertDataContributionSchema>;
export type DataContribution = typeof dataContributions.$inferSelect;
