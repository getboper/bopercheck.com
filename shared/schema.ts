import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, uuid, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(1).notNull(),
  referrals: text("referrals").array().default([]),
  referralCode: varchar("referral_code", { length: 8 }).notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  lastLogin: timestamp("last_login").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Security and tracking enhancements
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  loginCount: integer("login_count").default(0),
  accountStatus: text("account_status").default("active"), // active, suspended, deleted
  // Business profile fields
  isBusiness: boolean("is_business").default(false),
  companyName: text("company_name"),
  businessType: text("business_type"),
  businessCategories: text("business_categories").array().default([]),
  verificationStatus: text("verification_status").default("pending"),
});

// User Reviews system
export const userReviews = pgTable("user_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  userName: text("user_name").notNull(),
  location: text("location").notNull(),
  rating: integer("rating").notNull(),
  status: text("status").default("pending"),
  approved: boolean("approved").default(false),
  rewardClaimed: boolean("reward_claimed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  moderatorId: integer("moderator_id").references(() => users.id),
});

// Business Notification Tracking - Critical monitoring table
export const businessNotifications = pgTable("business_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessEmail: text("business_email").notNull(),
  notificationType: text("notification_type").notNull(), // 'signup', 'voucher', 'alert', etc.
  status: text("status").notNull(), // 'sent', 'failed', 'pending'
  response: text("response"), // Raw SendGrid response
  searchQuery: text("search_query"),
  location: text("location"),
  emailSent: boolean("email_sent").default(false),
  emailDelivered: boolean("email_delivered").default(false),
  sendgridMessageId: text("sendgrid_message_id"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),
  lastRetryAt: timestamp("last_retry_at"),
  successfulAt: timestamp("successful_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessNotificationSchema = createInsertSchema(businessNotifications).omit({
  id: true,
  createdAt: true,
});

export type BusinessNotification = typeof businessNotifications.$inferSelect;
export type InsertBusinessNotification = z.infer<typeof insertBusinessNotificationSchema>;

// Visitor Analytics Tracking
export const visitorAnalytics = pgTable("visitor_analytics", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  guestId: text("guest_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referer: text("referer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  deviceType: text("device_type"),
  browserName: text("browser_name"),
  osName: text("os_name"),
  pageViews: integer("page_views").default(1),
  sessionDuration: integer("session_duration"),
  bounced: boolean("bounced").default(false),
  converted: boolean("converted").default(false),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social Engagement Tracking
export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // facebook, twitter, instagram, etc.
  url: text("url").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
  creditAwarded: boolean("credit_awarded").default(false).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertSocialShareSchema = createInsertSchema(socialShares).pick({
  userId: true,
  platform: true,
  url: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  ipAddress: true,
  userAgent: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  credits: true,
  referralCode: true,
  isBusiness: true,
  companyName: true,
  businessType: true,
  ipAddress: true,
  userAgent: true,
  accountStatus: true,
  createdAt: true,
});

// Guest user model
export const guestUsers = pgTable("guest_users", {
  id: serial("id").primaryKey(),
  guestId: text("guest_id").notNull().unique(),
  searchCount: integer("search_count").default(0).notNull(),
  usedFreeCredit: boolean("used_free_credit").default(false).notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Security tracking
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertGuestUserSchema = createInsertSchema(guestUsers).pick({
  guestId: true,
  usedFreeCredit: true,
  ipAddress: true,
  userAgent: true,
});

// Admin monitoring and alerts
export const adminAlerts = pgTable("admin_alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // payment, error, broken_link, failed_search, failed_login
  severity: text("severity").default("medium"), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  details: json("details"),
  isRead: boolean("is_read").default(false),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertAdminAlertSchema = createInsertSchema(adminAlerts).omit({
  id: true,
  createdAt: true,
});

// System monitoring
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // searches, users, revenue, errors
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  metadata: json("metadata"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  date: text("date").notNull(), // YYYY-MM-DD for daily aggregation
});

export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  recordedAt: true,
});

// Advertising clicks tracking
export const advertisingClicks = pgTable("advertising_clicks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestId: text("guest_id").references(() => guestUsers.guestId),
  advertiserId: text("advertiser_id").notNull(),
  adType: text("ad_type").notNull(), // banner, sponsored_result, popup
  clickedUrl: text("clicked_url").notNull(),
  sourceSearch: text("source_search"),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
});

export const insertAdvertisingClickSchema = createInsertSchema(advertisingClicks).omit({
  id: true,
  clickedAt: true,
});

// Service packages for advertisers
export const advertiserPackages = pgTable("advertiser_packages", {
  id: serial("id").primaryKey(),
  advertiserId: text("advertiser_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  packageType: text("package_type").notNull(), // basic, premium, enterprise
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).notNull(),
  clickRate: decimal("click_rate", { precision: 5, scale: 4 }).notNull(), // per click cost
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  totalClicks: integer("total_clicks").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  // Location-based service coverage
  serviceLocations: text("service_locations").array().notNull(), // ["Plymouth", "Devon", "Cornwall"]
  primaryLocation: text("primary_location").notNull(), // Main service area
  locationPackageLevel: text("location_package_level").default("single"), // single, regional, national
  maxLocations: integer("max_locations").default(1), // Based on package type
});

export const insertAdvertiserPackageSchema = createInsertSchema(advertiserPackages).omit({
  id: true,
  startDate: true,
  totalClicks: true,
  totalRevenue: true,
});

export type AdvertiserPackage = typeof advertiserPackages.$inferSelect;
export type InsertAdvertiserPackage = z.infer<typeof insertAdvertiserPackageSchema>;

// Weekly report requests tracking
export const weeklyReportRequests = pgTable("weekly_report_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  businessName: text("business_name"),
  location: text("location"),
  reportType: text("report_type").default("standard"), // standard, premium, business
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  status: text("status").default("pending"), // pending, sent, failed
  reportData: json("report_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertWeeklyReportRequestSchema = createInsertSchema(weeklyReportRequests).omit({
  id: true,
  requestedAt: true,
});

// Enhanced payment transactions for admin monitoring
export const adminPaymentTransactions = pgTable("admin_payment_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  transactionId: text("transaction_id").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("GBP"),
  status: text("status").notNull(), // pending, completed, failed, refunded
  paymentMethod: text("payment_method"), // stripe, paypal, bank_transfer
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  ipAddress: text("ip_address"),
});

export const insertAdminPaymentTransactionSchema = createInsertSchema(adminPaymentTransactions).omit({
  id: true,
  createdAt: true,
});

// Error logs and broken links tracking
export const systemErrors = pgTable("system_errors", {
  id: serial("id").primaryKey(),
  errorType: text("error_type").notNull(), // broken_link, api_failure, search_failure, login_failure
  errorCode: text("error_code"),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  url: text("url"),
  userId: integer("user_id").references(() => users.id),
  guestId: text("guest_id").references(() => guestUsers.guestId),
  severity: text("severity").default("medium"), // low, medium, high, critical
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertSystemErrorSchema = createInsertSchema(systemErrors).omit({
  id: true,
  createdAt: true,
});

// Enhanced outreach logs table with comprehensive SendGrid tracking and click analytics
export const outreachLogs = pgTable("outreach_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("businessName").notNull(),
  businessEmail: text("businessEmail").notNull(),
  location: text("location"),
  outreachType: text("outreachType").default("search_based"), // search_based, public_discovery
  dateContacted: timestamp("dateContacted").defaultNow().notNull(),
  responded: boolean("responded").default(false),
  converted: boolean("converted").default(false),
  cooldownUntil: timestamp("cooldownUntil"),
  searchQuery: text("searchQuery"), // for search_based outreach
  industryCategory: text("industryCategory"), // for public_discovery outreach
  contactMethod: text("contactMethod").default("email"),
  campaignId: text("campaignId"),
  responseDate: timestamp("responseDate"),
  conversionDate: timestamp("conversionDate"),
  emailStatus: text("emailStatus").default("sent"), // sent, delivered, bounced, failed
  notes: text("notes"),
  
  // SendGrid delivery tracking
  sendgridMessageId: text("sendgridMessageId"), // From SendGrid API response
  deliveryStatus: text("deliveryStatus").default("sent"), // sent, delivered, bounced, dropped, deferred
  deliveredAt: timestamp("deliveredAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  bounceReason: text("bounceReason"),
  
  // Click tracking and visit analytics
  trackingId: text("trackingId"), // Unique tracking ID for this email
  clickCount: integer("clickCount").default(0),
  visitedSite: boolean("visitedSite").default(false),
  lastClickedAt: timestamp("lastClickedAt"),
  userAgent: text("userAgent"), // Browser/device info from clicks
  ipAddress: text("ipAddress"), // IP address from clicks
  
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const insertOutreachLogSchema = createInsertSchema(outreachLogs).omit({
  id: true,
  dateContacted: true,
});

// User Reviews schema
export const insertUserReviewSchema = createInsertSchema(userReviews).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
});

export type UserReview = typeof userReviews.$inferSelect;
export type InsertUserReview = z.infer<typeof insertUserReviewSchema>;
export type OutreachLog = typeof outreachLogs.$inferSelect;
export type InsertOutreachLog = z.infer<typeof insertOutreachLogSchema>;



// Price check model
export const priceChecks = pgTable("price_checks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestId: text("guest_id").references(() => guestUsers.guestId),
  item: text("item").notNull(),
  description: text("description"),
  category: text("category"),
  budget: integer("budget"),
  location: text("location"), // User's location for search
  hasImage: boolean("has_image").default(false),
  imageUrl: text("image_url"),
  result: json("result").notNull(),
  pdfGenerated: boolean("pdf_generated").default(false),
  priorityProcessing: boolean("priority_processing").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User reviews and ratings for search results
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  priceCheckId: integer("price_check_id").references(() => priceChecks.id),
  userId: integer("user_id").references(() => users.id),
  guestId: text("guest_id"),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false),
  searchItem: text("search_item").notNull(),
  ipAddress: text("ip_address"),
});

export const insertPriceCheckSchema = createInsertSchema(priceChecks).pick({
  userId: true,
  guestId: true,
  item: true,
  description: true,
  category: true,
  budget: true,
  hasImage: true,
  imageUrl: true,
  result: true,
  pdfGenerated: true,
  priorityProcessing: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof insertReviewSchema._type;

// Payment history model
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  credits: integer("credits").notNull(),
  stripePaymentId: text("stripe_payment_id").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  amount: true,
  credits: true,
  stripePaymentId: true,
  status: true,
});

// Referral tracking model
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").notNull().references(() => users.id),
  code: varchar("code", { length: 8 }).notNull(),
  credited: boolean("credited").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  referrerId: true,
  referredId: true,
  code: true,
  credited: true,
});

// Business ratings for user feedback
export const businessRatings = pgTable("business_ratings", {
  id: serial("id").primaryKey(),
  businessUserId: integer("business_user_id").references(() => users.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  guestId: uuid("guest_id").references(() => guestUsers.guestId),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(), // 1-5 stars with half-star increments
  comment: text("comment"),
  verified: boolean("verified").default(false), // If verified purchase/interaction
  hidden: boolean("hidden").default(false), // For moderation purposes
  ipAddress: text("ip_address"), // For security/moderation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessRatingSchema = createInsertSchema(businessRatings).pick({
  businessUserId: true,
  userId: true,
  guestId: true,
  rating: true,
  comment: true,
  verified: true,
  ipAddress: true,
});

// Business profile table for expanded business information
export const businessProfiles = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  logo: text("logo"), // URL or Base64
  coverImage: text("cover_image"), // URL or Base64
  description: text("description"),
  address: text("address"),
  city: text("city"),
  region: text("region"),
  postalCode: text("postal_code"),
  country: text("country"),
  phone: text("phone"),
  website: text("website"),
  socialLinks: json("social_links"), // JSON with social media links
  businessHours: json("business_hours"), // JSON with business hours
  featured: boolean("featured").default(false), // Featured business flag
  featuredUntil: timestamp("featured_until"), // When featured status expires
  verificationDocuments: json("verification_documents"), // For business verification
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment transactions table for complete audit trail
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestId: uuid("guest_id").references(() => guestUsers.guestId),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: integer("amount").notNull(), // Amount in pence
  currency: text("currency").default("gbp").notNull(),
  status: text("status").notNull(), // succeeded, failed, canceled, etc.
  type: text("type").notNull(), // business_subscription, credits, etc.
  planId: text("plan_id"), // basic, pro, featured for business plans
  planName: text("plan_name"),
  businessName: text("business_name"),
  customerEmail: text("customer_email"),
  description: text("description"),
  metadata: json("metadata"), // Additional payment data
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).pick({
  userId: true,
  guestId: true,
  stripePaymentIntentId: true,
  stripeCustomerId: true,
  amount: true,
  currency: true,
  status: true,
  type: true,
  planId: true,
  planName: true,
  businessName: true,
  customerEmail: true,
  description: true,
  metadata: true,
});

export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).pick({
  userId: true,
  logo: true,
  coverImage: true,
  description: true,
  address: true,
  city: true,
  region: true,
  postalCode: true,
  country: true,
  phone: true,
  website: true,
  socialLinks: true,
  businessHours: true,
});



// USA Launch registrations table
export const usaLaunchRegistrations = pgTable("usa_launch_registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  location: text("location").notNull(),
  interestType: text("interest_type").notNull(), // customer, advertiser, both
  customerInterests: text("customer_interests").array().default([]),
  advertisingInterests: text("advertising_interests").array().default([]),
  businessType: text("business_type"),
  budget: text("budget"),
  additionalInfo: text("additional_info"),
  newsletter: boolean("newsletter").default(false),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const insertUsaLaunchRegistrationSchema = createInsertSchema(usaLaunchRegistrations).omit({
  id: true,
  registeredAt: true,
});



export type InsertUsaLaunchRegistration = z.infer<typeof insertUsaLaunchRegistrationSchema>;
export type SelectUsaLaunchRegistration = typeof usaLaunchRegistrations.$inferSelect;

// Types for the models
export type User = typeof users.$inferSelect;

// Re-export influencer schemas
export * from './influencer-schema';
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GuestUser = typeof guestUsers.$inferSelect;
export type InsertGuestUser = z.infer<typeof insertGuestUserSchema>;

export type PriceCheck = typeof priceChecks.$inferSelect;
export type InsertPriceCheck = z.infer<typeof insertPriceCheckSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type SocialShare = typeof socialShares.$inferSelect;
export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;

export type BusinessRating = typeof businessRatings.$inferSelect;
export type InsertBusinessRating = z.infer<typeof insertBusinessRatingSchema>;

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;

// Additional types will be added after schema definitions

// Weekly reports system tables
export const reportSubscriptions = pgTable('report_subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  businessName: text('business_name'),
  website: text('website'),
  businessType: text('business_type'),
  location: text('location'),
  mainProducts: text('main_products'),
  targetMarket: text('target_market'),
  isAdvertiser: boolean('is_advertiser').default(false),
  isActive: boolean('is_active').default(true),
  lastReportSent: timestamp('last_report_sent'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Failed searches tracking for admin management
export const failedSearches = pgTable('failed_searches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  guestId: uuid('guest_id').references(() => guestUsers.guestId),
  searchQuery: text('search_query').notNull(),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  location: text('location'),
  includeInstallation: boolean('include_installation').default(false),
  errorType: text('error_type').notNull(), // 'parsing_error', 'api_error', 'timeout', 'no_results'
  errorMessage: text('error_message'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referer: text('referer'),
  category: text('category'), // inferred category if available
  resolved: boolean('resolved').default(false),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: text('resolved_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Platform load failures and critical system errors
export const platformFailures = pgTable('platform_failures', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  guestId: uuid('guest_id').references(() => guestUsers.guestId),
  sessionId: text('session_id'),
  failureType: text('failure_type').notNull(), // 'site_load', 'api_timeout', 'frontend_error', 'firebase_error', 'critical_js_error'
  errorMessage: text('error_message'),
  errorStack: text('error_stack'),
  url: text('url').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  browserInfo: json('browser_info'), // browser, version, OS details
  networkInfo: json('network_info'), // connection type, speed if available
  pageLoadTime: decimal('page_load_time', { precision: 10, scale: 2 }), // milliseconds with decimal precision
  apiEndpoint: text('api_endpoint'), // for API failures
  httpStatus: integer('http_status'), // for HTTP errors
  resolved: boolean('resolved').default(false),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: text('resolved_by'),
  autoRetryAttempts: integer('auto_retry_attempts').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI training feedback and automated reactions
export const aiTrainingFeedback = pgTable('ai_training_feedback', {
  id: serial('id').primaryKey(),
  failedSearchId: integer('failed_search_id').references(() => failedSearches.id),
  originalQuery: text('original_query').notNull(),
  suggestedImprovement: text('suggested_improvement'),
  trainingDataAdded: boolean('training_data_added').default(false),
  promptUpdated: boolean('prompt_updated').default(false),
  modelRetrained: boolean('model_retrained').default(false),
  automatedResponse: text('automated_response'), // what the system did automatically
  manualActionRequired: boolean('manual_action_required').default(true),
  priority: text('priority').default('medium'), // low, medium, high, critical
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Premium advertiser signups
export const premiumAdvertiserSignups = pgTable('premium_advertiser_signups', {
  id: serial('id').primaryKey(),
  businessName: text('business_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  website: text('website'),
  businessType: text('business_type').notNull(),
  targetLocation: text('target_location').notNull(),
  monthlyBudget: text('monthly_budget').notNull(),
  additionalInfo: text('additional_info'),
  signupDate: timestamp('signup_date').defaultNow(),
  source: text('source').default('direct'),
  status: text('status').default('pending_review'), // pending_review, contacted, approved, rejected
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Business campaigns for active advertisers
export const businessCampaigns = pgTable("business_campaigns", {
  id: serial("id").primaryKey(),
  businessEmail: text("business_email").notNull(),
  businessName: text("business_name").notNull(),
  website: text("website"),
  logo: text("logo"),
  adHeadline: text("ad_headline"),
  serviceArea: text("service_area"),
  planType: text("plan_type").notNull(), // basic, pro, featured
  status: text("status").default("active"), // active, paused, expired
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  campaignStartDate: timestamp("campaign_start_date").defaultNow(),
  campaignEndDate: timestamp("campaign_end_date"),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  enquiries: integer("enquiries").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Business advertiser sessions for dashboard access
export const businessSessions = pgTable("business_sessions", {
  id: serial("id").primaryKey(),
  businessEmail: text("business_email").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  campaignId: integer("campaign_id").references(() => businessCampaigns.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Weekly failure metrics and analytics
export const weeklyFailureMetrics = pgTable('weekly_failure_metrics', {
  id: serial('id').primaryKey(),
  weekStartDate: timestamp('week_start_date').notNull(),
  weekEndDate: timestamp('week_end_date').notNull(),
  totalSearchFailures: integer('total_search_failures').default(0),
  totalPlatformFailures: integer('total_platform_failures').default(0),
  totalVisits: integer('total_visits').default(0),
  failureRate: decimal('failure_rate', { precision: 5, scale: 2 }), // percentage
  topFailureReasons: json('top_failure_reasons'), // array of {reason, count}
  criticalIssuesCount: integer('critical_issues_count').default(0),
  resolvedIssuesCount: integer('resolved_issues_count').default(0),
  avgResolutionTime: integer('avg_resolution_time'), // hours
  automatedFixesApplied: integer('automated_fixes_applied').default(0),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});



// Revenue source tracking for detailed breakdown
export const revenueAnalytics = pgTable('revenue_analytics', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').references(() => paymentTransactions.id),
  source: text('source').notNull(), // 'credit_purchase', 'business_subscription', 'pdf_upgrade', 'priority_upgrade'
  amount: integer('amount').notNull(), // in pence
  currency: text('currency').default('gbp'),
  userId: integer('user_id').references(() => users.id),
  guestId: uuid('guest_id').references(() => guestUsers.guestId),
  planType: text('plan_type'), // basic, pro, featured for subscriptions
  searchCategory: text('search_category'), // what they searched for that led to purchase
  conversionDays: integer('conversion_days'), // days from first visit to purchase
  referer: text('referer'), // where they came from
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const weeklyReports = pgTable('weekly_reports', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => reportSubscriptions.id),
  weekStart: timestamp('week_start').notNull(),
  weekEnd: timestamp('week_end').notNull(),
  searchAppearances: integer('search_appearances').default(0),
  nationalSearches: integer('national_searches').default(0),
  localSearches: integer('local_searches').default(0),
  downloadPercentage: decimal('download_percentage', { precision: 5, scale: 2 }).default('0'),
  impressions: integer('impressions').default(0),
  clickThroughRate: decimal('click_through_rate', { precision: 5, scale: 2 }).default('0'),
  leadGeneration: integer('lead_generation').default(0),
  reportData: json('report_data'), // Store additional metrics
  emailSent: boolean('email_sent').default(false),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reportEmailLogs = pgTable('report_email_logs', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => reportSubscriptions.id),
  reportId: integer('report_id').references(() => weeklyReports.id),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull(), // sent, failed, delivered
  sendgridMessageId: text('sendgrid_message_id'),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at').defaultNow(),
});

// Insert schemas for weekly reports
export const insertReportSubscriptionSchema = createInsertSchema(reportSubscriptions).pick({
  email: true,
  businessName: true,
  website: true,
  businessType: true,
  location: true,
  mainProducts: true,
  targetMarket: true,
  isAdvertiser: true,
  isActive: true,
});

export const insertWeeklyReportSchema = createInsertSchema(weeklyReports).pick({
  subscriptionId: true,
  weekStart: true,
  weekEnd: true,
  searchAppearances: true,
  nationalSearches: true,
  localSearches: true,
  downloadPercentage: true,
  impressions: true,
  clickThroughRate: true,
  leadGeneration: true,
  reportData: true,
});

// Insert schemas for new analytics tables
export const insertFailedSearchSchema = createInsertSchema(failedSearches).pick({
  userId: true,
  guestId: true,
  searchQuery: true,
  budget: true,
  location: true,
  includeInstallation: true,
  errorType: true,
  errorMessage: true,
  ipAddress: true,
  userAgent: true,
  referer: true,
  category: true,
});

export const insertPlatformFailureSchema = createInsertSchema(platformFailures).pick({
  userId: true,
  guestId: true,
  sessionId: true,
  failureType: true,
  errorMessage: true,
  errorStack: true,
  url: true,
  userAgent: true,
  ipAddress: true,
  browserInfo: true,
  networkInfo: true,
  pageLoadTime: true,
  apiEndpoint: true,
  httpStatus: true,
  autoRetryAttempts: true,
});

export const insertAiTrainingFeedbackSchema = createInsertSchema(aiTrainingFeedback).pick({
  failedSearchId: true,
  originalQuery: true,
  suggestedImprovement: true,
  trainingDataAdded: true,
  promptUpdated: true,
  modelRetrained: true,
  automatedResponse: true,
  manualActionRequired: true,
  priority: true,
});

export const insertWeeklyFailureMetricsSchema = createInsertSchema(weeklyFailureMetrics).pick({
  weekStartDate: true,
  weekEndDate: true,
  totalSearchFailures: true,
  totalPlatformFailures: true,
  totalVisits: true,
  failureRate: true,
  topFailureReasons: true,
  criticalIssuesCount: true,
  resolvedIssuesCount: true,
  avgResolutionTime: true,
  automatedFixesApplied: true,
});

export const insertVisitorAnalyticsSchema = createInsertSchema(visitorAnalytics).pick({
  sessionId: true,
  userId: true,
  guestId: true,
  ipAddress: true,
  userAgent: true,
  referer: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  country: true,
  region: true,
  city: true,
  deviceType: true,
  browserName: true,
  osName: true,
  pageViews: true,
  sessionDuration: true,
  bounced: true,
  converted: true,
});

export const insertRevenueAnalyticsSchema = createInsertSchema(revenueAnalytics).pick({
  transactionId: true,
  source: true,
  amount: true,
  currency: true,
  userId: true,
  guestId: true,
  planType: true,
  searchCategory: true,
  conversionDays: true,
  referer: true,
});

export const insertReportEmailLogSchema = createInsertSchema(reportEmailLogs).pick({
  subscriptionId: true,
  reportId: true,
  email: true,
  subject: true,
  status: true,
  sendgridMessageId: true,
  errorMessage: true,
});

export const insertPremiumAdvertiserSignupSchema = createInsertSchema(premiumAdvertiserSignups).pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  businessType: true,
  targetLocation: true,
  monthlyBudget: true,
  additionalInfo: true,
  source: true,
  status: true,
});

export const insertBusinessCampaignSchema = createInsertSchema(businessCampaigns).pick({
  businessEmail: true,
  businessName: true,
  website: true,
  logo: true,
  adHeadline: true,
  serviceArea: true,
  planType: true,
  status: true,
  stripePaymentIntentId: true,
  campaignStartDate: true,
  campaignEndDate: true,
});

export const insertBusinessSessionSchema = createInsertSchema(businessSessions).pick({
  businessEmail: true,
  sessionToken: true,
  campaignId: true,
  expiresAt: true,
});

// Types for weekly reports
export type ReportSubscription = typeof reportSubscriptions.$inferSelect;
export type InsertReportSubscription = z.infer<typeof insertReportSubscriptionSchema>;

export type WeeklyReport = typeof weeklyReports.$inferSelect;
export type InsertWeeklyReport = z.infer<typeof insertWeeklyReportSchema>;

export type ReportEmailLog = typeof reportEmailLogs.$inferSelect;
export type InsertReportEmailLog = z.infer<typeof insertReportEmailLogSchema>;

// Additional types for new analytics tables
export type FailedSearch = typeof failedSearches.$inferSelect;
export type InsertFailedSearch = z.infer<typeof insertFailedSearchSchema>;

export type VisitorAnalytics = typeof visitorAnalytics.$inferSelect;
export type InsertVisitorAnalytics = z.infer<typeof insertVisitorAnalyticsSchema>;

export type RevenueAnalytics = typeof revenueAnalytics.$inferSelect;
export type InsertRevenueAnalytics = z.infer<typeof insertRevenueAnalyticsSchema>;

export type PremiumAdvertiserSignup = typeof premiumAdvertiserSignups.$inferSelect;
export type InsertPremiumAdvertiserSignup = z.infer<typeof insertPremiumAdvertiserSignupSchema>;

export type BusinessCampaign = typeof businessCampaigns.$inferSelect;
export type InsertBusinessCampaign = z.infer<typeof insertBusinessCampaignSchema>;

export type BusinessSession = typeof businessSessions.$inferSelect;
export type InsertBusinessSession = z.infer<typeof insertBusinessSessionSchema>;
