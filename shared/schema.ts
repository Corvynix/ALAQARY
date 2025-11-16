import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("buyer"), // buyer | developer | admin
  credits: integer("credits").default(0),
  referralCode: varchar("referral_code").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  buyerProfile: one(buyerProfiles, {
    fields: [users.id],
    references: [buyerProfiles.userId],
  }),
  developer: one(developers, {
    fields: [users.id],
    references: [developers.userId],
  }),
  behavioralEvents: many(behavioralEvents),
  aiCloserSessions: many(aiCloserSessions),
  referrals: many(referralProgram),
}));

// Developers table
export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  companyName: varchar("company_name").notNull(),
  trustScore: real("trust_score").default(50), // 0-100
  totalContracts: integer("total_contracts").default(0),
  completedContracts: integer("completed_contracts").default(0),
  complaints: integer("complaints").default(0),
  averageRating: real("average_rating").default(0),
  yearsInBusiness: integer("years_in_business").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const developersRelations = relations(developers, ({ one, many }) => ({
  user: one(users, {
    fields: [developers.userId],
    references: [users.id],
  }),
  properties: many(properties),
  contracts: many(contracts),
}));

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").references(() => developers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  city: varchar("city").notNull(),
  type: varchar("type").notNull(), // villa | apartment | office | commercial | land
  price: integer("price").notNull(),
  size: integer("size").notNull(), // in square meters
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  status: varchar("status").default("available"), // available | sold | reserved
  riskIndicators: text("risk_indicators").array().default(sql`ARRAY[]::text[]`),
  location: jsonb("location"), // { lat, lng, address }
  amenities: text("amenities").array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  developer: one(developers, {
    fields: [properties.developerId],
    references: [developers.id],
  }),
  matches: many(propertyMatches),
  contracts: many(contracts),
}));

// Contracts table
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "cascade" }),
  developerId: varchar("developer_id").references(() => developers.id, { onDelete: "cascade" }),
  buyerId: varchar("buyer_id").references(() => users.id, { onDelete: "set null" }),
  filePath: text("file_path"),
  riskScore: real("risk_score").default(0), // 0-100
  parsedClauses: jsonb("parsed_clauses"), // Array of extracted clauses
  status: varchar("status").default("pending"), // pending | active | completed | disputed
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  property: one(properties, {
    fields: [contracts.propertyId],
    references: [properties.id],
  }),
  developer: one(developers, {
    fields: [contracts.developerId],
    references: [developers.id],
  }),
  buyer: one(users, {
    fields: [contracts.buyerId],
    references: [users.id],
  }),
}));

// Buyer Profiles table
export const buyerProfiles = pgTable("buyer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
  riskTolerance: varchar("risk_tolerance").default("medium"), // low | medium | high
  decisionType: varchar("decision_type").default("analytical"), // analytical | emotional | balanced
  urgency: varchar("urgency").default("medium"), // low | medium | high
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredCities: text("preferred_cities").array().default(sql`ARRAY[]::text[]`),
  preferredTypes: text("preferred_types").array().default(sql`ARRAY[]::text[]`),
  interestHeatmap: jsonb("interest_heatmap"), // { propertyId: interestScore }
  objectionHistory: jsonb("objection_history"), // Array of common objections
  psychologicalTags: text("psychological_tags").array().default(sql`ARRAY[]::text[]`),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buyerProfilesRelations = relations(buyerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [buyerProfiles.userId],
    references: [users.id],
  }),
  matches: many(propertyMatches),
}));

// Property Matches table
export const propertyMatches = pgTable("property_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerProfileId: varchar("buyer_profile_id").references(() => buyerProfiles.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "cascade" }),
  matchScore: real("match_score").notNull(), // 0-100
  scoreBreakdown: jsonb("score_breakdown"), // Detailed scoring components
  explanation: text("explanation"),
  viewed: boolean("viewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyMatchesRelations = relations(propertyMatches, ({ one }) => ({
  buyerProfile: one(buyerProfiles, {
    fields: [propertyMatches.buyerProfileId],
    references: [buyerProfiles.id],
  }),
  property: one(properties, {
    fields: [propertyMatches.propertyId],
    references: [properties.id],
  }),
}));

// AI Closer Sessions table
export const aiCloserSessions = pgTable("ai_closer_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").references(() => users.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "set null" }),
  sessionHistory: jsonb("session_history").notNull(), // Array of messages
  purchaseProbability: real("purchase_probability").default(0), // 0-100
  status: varchar("status").default("active"), // active | completed | abandoned
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiCloserSessionsRelations = relations(aiCloserSessions, ({ one, many }) => ({
  buyer: one(users, {
    fields: [aiCloserSessions.buyerId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [aiCloserSessions.propertyId],
    references: [properties.id],
  }),
  objectionResponses: many(objectionResponses),
}));

// Objection Responses table
export const objectionResponses = pgTable("objection_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => aiCloserSessions.id, { onDelete: "cascade" }),
  objection: text("objection").notNull(),
  aiResponse: text("ai_response").notNull(),
  effectivenessScore: real("effectiveness_score"), // 0-100, based on user reaction
  createdAt: timestamp("created_at").defaultNow(),
});

export const objectionResponsesRelations = relations(objectionResponses, ({ one }) => ({
  session: one(aiCloserSessions, {
    fields: [objectionResponses.sessionId],
    references: [aiCloserSessions.id],
  }),
}));

// Behavioral Tracking table
export const behavioralEvents = pgTable("behavioral_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  eventType: varchar("event_type").notNull(), // page_view | property_view | property_interest | scroll_depth | time_spent | click
  element: varchar("element"),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "set null" }),
  metadata: jsonb("metadata"), // Additional event data
  timestamp: timestamp("timestamp").defaultNow(),
});

export const behavioralEventsRelations = relations(behavioralEvents, ({ one }) => ({
  user: one(users, {
    fields: [behavioralEvents.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [behavioralEvents.propertyId],
    references: [properties.id],
  }),
}));

// Referral Program table
export const referralProgram = pgTable("referral_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  referredUserId: varchar("referred_user_id").references(() => users.id, { onDelete: "set null" }),
  rewardAmount: integer("reward_amount").default(0),
  status: varchar("status").default("pending"), // pending | completed | expired
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralProgramRelations = relations(referralProgram, ({ one }) => ({
  user: one(users, {
    fields: [referralProgram.userId],
    references: [users.id],
  }),
  referredUser: one(users, {
    fields: [referralProgram.referredUserId],
    references: [users.id],
  }),
}));

// Zod schemas and types
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyMatchSchema = createInsertSchema(propertyMatches).omit({
  id: true,
  createdAt: true,
});

export const insertAICloserSessionSchema = createInsertSchema(aiCloserSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertObjectionResponseSchema = createInsertSchema(objectionResponses).omit({
  id: true,
  createdAt: true,
});

export const insertBehavioralEventSchema = createInsertSchema(behavioralEvents).omit({
  id: true,
  timestamp: true,
});

export const insertReferralSchema = createInsertSchema(referralProgram).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;
export type InsertPropertyMatch = z.infer<typeof insertPropertyMatchSchema>;
export type PropertyMatch = typeof propertyMatches.$inferSelect;
export type InsertAICloserSession = z.infer<typeof insertAICloserSessionSchema>;
export type AICloserSession = typeof aiCloserSessions.$inferSelect;
export type InsertObjectionResponse = z.infer<typeof insertObjectionResponseSchema>;
export type ObjectionResponse = typeof objectionResponses.$inferSelect;
export type InsertBehavioralEvent = z.infer<typeof insertBehavioralEventSchema>;
export type BehavioralEvent = typeof behavioralEvents.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referralProgram.$inferSelect;
