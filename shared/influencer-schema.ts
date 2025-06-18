import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Influencer profiles table
export const influencers = pgTable("influencers", {
  id: varchar("id").primaryKey().notNull(),
  tiktokHandle: varchar("tiktok_handle").notNull(),
  displayName: varchar("display_name").notNull(),
  followerCount: integer("follower_count").notNull(),
  engagementRate: varchar("engagement_rate"), // Store as percentage string
  bio: text("bio"),
  email: varchar("email"),
  instagramHandle: varchar("instagram_handle"),
  youtubeChannel: varchar("youtube_channel"),
  website: varchar("website"),
  location: varchar("location"),
  categories: jsonb("categories").$type<string[]>().default([]),
  averageViews: integer("average_views"),
  recentPosts: jsonb("recent_posts").$type<any[]>().default([]),
  contactAttempts: integer("contact_attempts").default(0),
  lastContactDate: timestamp("last_contact_date"),
  partnershipStatus: varchar("partnership_status").default("not_contacted"), // not_contacted, contacted, responded, partnered, declined
  notes: text("notes"),
  featuredOnApp: boolean("featured_on_app").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Outreach campaigns table
export const outreachCampaigns = pgTable("outreach_campaigns", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  targetFollowerMin: integer("target_follower_min").default(10000),
  targetCategories: jsonb("target_categories").$type<string[]>().default([]),
  messageTemplate: text("message_template").notNull(),
  status: varchar("status").default("active"), // active, paused, completed
  totalContacts: integer("total_contacts").default(0),
  responses: integer("responses").default(0),
  partnerships: integer("partnerships").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Outreach messages table
export const outreachMessages = pgTable("outreach_messages", {
  id: varchar("id").primaryKey().notNull(),
  campaignId: varchar("campaign_id").references(() => outreachCampaigns.id).notNull(),
  influencerId: varchar("influencer_id").references(() => influencers.id).notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  sentVia: varchar("sent_via").notNull(), // email, instagram, tiktok
  status: varchar("status").default("sent"), // sent, opened, responded, declined
  responseText: text("response_text"),
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export type Influencer = typeof influencers.$inferSelect;
export type UpsertInfluencer = typeof influencers.$inferInsert;
export type OutreachCampaign = typeof outreachCampaigns.$inferSelect;
export type UpsertOutreachCampaign = typeof outreachCampaigns.$inferInsert;
export type OutreachMessage = typeof outreachMessages.$inferSelect;
export type UpsertOutreachMessage = typeof outreachMessages.$inferInsert;

export const insertInfluencerSchema = createInsertSchema(influencers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = createInsertSchema(outreachCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(outreachMessages).omit({
  id: true,
  sentAt: true,
});

export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;