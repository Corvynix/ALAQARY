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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;
