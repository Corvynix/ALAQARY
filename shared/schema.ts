import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'client', 'developer']);
export const paymentMethodEnum = pgEnum('payment_method', ['vodafone_cash', 'cash', 'bank_transfer']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const propertyTypeEnum = pgEnum('property_type', ['apartment', 'villa', 'townhouse', 'penthouse', 'studio', 'duplex', 'land']);
export const propertyStatusEnum = pgEnum('property_status', ['available', 'reserved', 'sold', 'off_market']);
export const riskToleranceEnum = pgEnum('risk_tolerance', ['conservative', 'moderate', 'aggressive']);
export const notificationTypeEnum = pgEnum('notification_type', ['opportunity', 'payment', 'consultation', 'market_update', 'system']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled']);

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerCode: varchar("customer_code").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('client'),
  phone: varchar("phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Developers table
export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar("company_name").notNull(),
  companyDescription: text("company_description"),
  licenseNumber: varchar("license_number"),
  trustScore: decimal("trust_score", { precision: 3, scale: 2 }).default('0').notNull(),
  totalDeals: integer("total_deals").default(0).notNull(),
  successfulDeals: integer("successful_deals").default(0).notNull(),
  complaints: integer("complaints").default(0).notNull(),
  verified: boolean("verified").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_developers_user_id").on(table.userId),
  index("idx_developers_trust_score").on(table.trustScore),
]);

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  developerId: varchar("developer_id").notNull().references(() => developers.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  propertyType: propertyTypeEnum("property_type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  location: varchar("location", { length: 255 }).notNull(),
  locationAr: varchar("location_ar", { length: 255 }),
  region: varchar("region", { length: 100 }).notNull(),
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  amenities: text("amenities").array().default(sql`ARRAY[]::text[]`),
  status: propertyStatusEnum("status").default('available').notNull(),
  featured: boolean("featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_properties_developer").on(table.developerId),
  index("idx_properties_region").on(table.region),
  index("idx_properties_status").on(table.status),
  index("idx_properties_price").on(table.price),
]);

// Buyer Profiles
export const buyerProfiles = pgTable("buyer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  preferredRegions: text("preferred_regions").array().default(sql`ARRAY[]::text[]`),
  preferredPropertyTypes: text("preferred_property_types").array().default(sql`ARRAY[]::text[]`),
  minBedrooms: integer("min_bedrooms"),
  maxBedrooms: integer("max_bedrooms"),
  riskTolerance: riskToleranceEnum("risk_tolerance").default('moderate'),
  investmentGoal: text("investment_goal"),
  timeline: varchar("timeline", { length: 100 }),
  additionalPreferences: jsonb("additional_preferences"),
  profileCompletion: integer("profile_completion").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_buyer_profiles_user").on(table.userId),
]);

// Consultations/AI Sessions
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionData: jsonb("session_data"),
  questionsAsked: text("questions_asked").array().default(sql`ARRAY[]::text[]`),
  recommendationsGiven: jsonb("recommendations_given"),
  status: varchar("status", { length: 50 }).default('active').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_consultations_user").on(table.userId),
  index("idx_consultations_status").on(table.status),
]);

// Consultation Bookings (for scheduling calls/meetings)
export const consultationBookings = pgTable("consultation_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  preferredDate: timestamp("preferred_date").notNull(),
  preferredTime: varchar("preferred_time", { length: 10 }).notNull(),
  message: text("message"),
  paymentStatus: paymentStatusEnum("payment_status").default('pending').notNull(),
  paymentPhone: varchar("payment_phone", { length: 50 }),
  bookingStatus: bookingStatusEnum("booking_status").default('pending').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_consultation_bookings_user").on(table.userId),
  index("idx_consultation_bookings_date").on(table.preferredDate),
  index("idx_consultation_bookings_payment_status").on(table.paymentStatus),
  index("idx_consultation_bookings_booking_status").on(table.bookingStatus),
]);

// Payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  consultationId: varchar("consultation_id").references(() => consultations.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('EGP').notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default('pending').notNull(),
  referenceNumber: varchar("reference_number"),
  notes: text("notes"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_payments_user").on(table.userId),
  index("idx_payments_status").on(table.paymentStatus),
  index("idx_payments_consultation").on(table.consultationId),
]);

// Contracts
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  propertyId: varchar("property_id").references(() => properties.id),
  developerId: varchar("developer_id").references(() => developers.id),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  analysisResults: jsonb("analysis_results"),
  riskLevel: varchar("risk_level", { length: 50 }),
  status: varchar("status", { length: 50 }).default('pending_review').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_contracts_user").on(table.userId),
  index("idx_contracts_property").on(table.propertyId),
  index("idx_contracts_status").on(table.status),
]);

// Commissions
export const commissions = pgTable("commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  developerId: varchar("developer_id").notNull().references(() => developers.id),
  saleAmount: decimal("sale_amount", { precision: 12, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default('2.00').notNull(),
  commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default('pending').notNull(),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_commissions_user").on(table.userId),
  index("idx_commissions_developer").on(table.developerId),
  index("idx_commissions_status").on(table.status),
]);

// Market Data
export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  region: varchar("region", { length: 100 }).notNull(),
  propertyType: varchar("property_type", { length: 50 }),
  averagePrice: decimal("average_price", { precision: 12, scale: 2 }),
  priceChange: decimal("price_change", { precision: 5, scale: 2 }),
  demandLevel: varchar("demand_level", { length: 50 }),
  supplyLevel: varchar("supply_level", { length: 50 }),
  insights: jsonb("insights"),
  dataSource: varchar("data_source", { length: 100 }),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_market_data_region").on(table.region),
  index("idx_market_data_valid").on(table.validFrom, table.validTo),
]);

// Behavioral Tracking
export const behavioralTracking = pgTable("behavioral_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar("session_id").notNull(),
  page: varchar("page", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  scrollDepth: integer("scroll_depth"),
  timeOnPage: integer("time_on_page"),
  clickData: jsonb("click_data"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_behavioral_user").on(table.userId),
  index("idx_behavioral_session").on(table.sessionId),
  index("idx_behavioral_timestamp").on(table.timestamp),
]);

// Referrals
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  referredUserId: varchar("referred_user_id").references(() => users.id),
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default('pending').notNull(),
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }),
  rewardClaimed: boolean("reward_claimed").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_referrals_referrer").on(table.referrerId),
  index("idx_referrals_code").on(table.referralCode),
]);

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }),
  message: text("message").notNull(),
  messageAr: text("message_ar"),
  link: varchar("link"),
  read: boolean("read").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_notifications_user").on(table.userId),
  index("idx_notifications_read").on(table.read),
]);

// Admin Credentials
export const adminCredentials = pgTable("admin_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  mustChangePassword: boolean("must_change_password").default(true).notNull(),
  lastPasswordChange: timestamp("last_password_change"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_admin_username").on(table.username),
]);

// CMS Content
export const cmsContent = pgTable("cms_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  metadata: jsonb("metadata"),
  updatedBy: varchar("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_cms_key").on(table.key),
  index("idx_cms_type").on(table.contentType),
]);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  buyerProfile: one(buyerProfiles, {
    fields: [users.id],
    references: [buyerProfiles.userId],
  }),
  developer: one(developers, {
    fields: [users.id],
    references: [developers.userId],
  }),
  consultations: many(consultations),
  payments: many(payments),
  contracts: many(contracts),
  commissions: many(commissions),
  notifications: many(notifications),
  referralsMade: many(referrals, { relationName: 'referrer' }),
}));

export const developersRelations = relations(developers, ({ one, many }) => ({
  user: one(users, {
    fields: [developers.userId],
    references: [users.id],
  }),
  properties: many(properties),
  commissions: many(commissions),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  developer: one(developers, {
    fields: [properties.developerId],
    references: [developers.id],
  }),
  contracts: many(contracts),
  commissions: many(commissions),
}));

export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  user: one(users, {
    fields: [consultations.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  trustScore: true,
  totalDeals: true,
  successfulDeals: true,
  complaints: true,
  verified: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  profileCompletion: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationBookingSchema = createInsertSchema(consultationBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  createdAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  createdAt: true,
});

export const insertBehavioralTrackingSchema = createInsertSchema(behavioralTracking).omit({
  id: true,
  timestamp: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  rewardClaimed: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true,
});

export const insertAdminCredentialSchema = createInsertSchema(adminCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastPasswordChange: true,
});

export const insertCmsContentSchema = createInsertSchema(cmsContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export type InsertConsultationBooking = z.infer<typeof insertConsultationBookingSchema>;
export type ConsultationBooking = typeof consultationBookings.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Commission = typeof commissions.$inferSelect;

export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;

export type InsertBehavioralTracking = z.infer<typeof insertBehavioralTrackingSchema>;
export type BehavioralTracking = typeof behavioralTracking.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertAdminCredential = z.infer<typeof insertAdminCredentialSchema>;
export type AdminCredential = typeof adminCredentials.$inferSelect;

export type InsertCmsContent = z.infer<typeof insertCmsContentSchema>;
export type CmsContent = typeof cmsContent.$inferSelect;
