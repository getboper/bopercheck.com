import { 
  users, 
  type User, 
  type InsertUser, 
  priceChecks, 
  type PriceCheck, 
  type InsertPriceCheck,
  guestUsers,
  type GuestUser,
  type InsertGuestUser,
  referrals,
  type Referral,
  type InsertReferral,
  businessProfiles,
  type BusinessProfile,
  type InsertBusinessProfile,
  businessRatings,
  type BusinessRating,
  type InsertBusinessRating,
  socialShares,
  type SocialShare,
  type InsertSocialShare,
  reportSubscriptions,
  type ReportSubscription,
  type InsertReportSubscription,
  weeklyReports,
  type WeeklyReport,
  type InsertWeeklyReport,
  reportEmailLogs,
  type ReportEmailLog,
  type InsertReportEmailLog,
  userReviews,
  type UserReview,
  type InsertUserReview,
  businessCampaigns,
  type BusinessCampaign,
  type InsertBusinessCampaign,
  businessSessions,
  type BusinessSession,
  type InsertBusinessSession,
  visitorAnalytics,
  type VisitorAnalytics,
  type InsertVisitorAnalytics,
  advertiserPackages,
  type AdvertiserPackage,
  type InsertAdvertiserPackage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { generateReferralCode } from "./utils";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addUserCredits(userId: number, credits: number): Promise<User>;
  deductUserCredits(userId: number, amount: number): Promise<User>;
  updateUserReferrals(userId: number, referredUserId: number): Promise<void>;
  updateUserLoginInfo(userId: number, ipAddress?: string, userAgent?: string): Promise<User>;
  getBusinessUsers(limit?: number): Promise<User[]>;
  
  // Social sharing operations
  trackSocialShare(share: InsertSocialShare): Promise<SocialShare>;
  getUserSocialShares(userId: number): Promise<SocialShare[]>;
  awardCreditForSocialShare(shareId: number): Promise<SocialShare>;
  
  // Guest user operations
  getGuestById(guestId: string): Promise<GuestUser | undefined>;
  createGuestUser(ipAddress?: string, userAgent?: string): Promise<GuestUser>;
  markGuestCreditUsed(guestId: string): Promise<GuestUser>;
  
  // Price check operations
  savePriceCheck(priceCheck: Partial<InsertPriceCheck>): Promise<PriceCheck>;
  getUserPriceChecks(userId: number): Promise<PriceCheck[]>;
  getGuestPriceChecks(guestId: string): Promise<PriceCheck[]>;
  
  // Referral operations
  createReferral(referral: Partial<InsertReferral>): Promise<Referral>;
  getReferralByCode(code: string): Promise<Referral | undefined>;
  markReferralCredited(referralId: number): Promise<Referral>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  
  // Business profile operations
  getBusinessProfile(userId: number): Promise<BusinessProfile | undefined>;
  createBusinessProfile(profile: Partial<InsertBusinessProfile>): Promise<BusinessProfile>;
  updateBusinessProfile(profileId: number, updates: Partial<InsertBusinessProfile>): Promise<BusinessProfile>;
  getFeaturedBusinesses(limit?: number): Promise<BusinessProfile[]>;
  getLocalBusinesses(location?: string, category?: string): Promise<BusinessProfile[]>;
  
  // Business rating operations
  getBusinessRatings(businessUserId: number): Promise<BusinessRating[]>;
  getBusinessRatingsSummary(businessUserId: number): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<number, number>; // e.g. {5: 10, 4: 5, 3: 2, 2: 1, 1: 0}
    reviewHighlights: string[];
  }>;
  createBusinessRating(rating: Partial<InsertBusinessRating>): Promise<BusinessRating>;
  updateBusinessRating(ratingId: number, updates: Partial<InsertBusinessRating>): Promise<BusinessRating>;
  hideBusinessRating(ratingId: number): Promise<BusinessRating>;
  
  // Analytics operations
  getTotalSearchCount(): Promise<number>;
  getRecentSearches(days: number): Promise<PriceCheck[]>;
  getPopularCategories(): Promise<Array<{category: string; count: number}>>;
  getLocationStats(): Promise<Array<{location: string; count: number}>>;
  
  // Weekly reports operations
  createReportSubscription(subscription: InsertReportSubscription): Promise<ReportSubscription>;
  getReportSubscription(email: string): Promise<ReportSubscription | undefined>;
  getAllActiveSubscriptions(): Promise<ReportSubscription[]>;
  updateSubscriptionAdvertiserStatus(id: number, isAdvertiser: boolean): Promise<ReportSubscription>;
  deactivateSubscription(id: number): Promise<ReportSubscription>;
  
  createWeeklyReport(report: InsertWeeklyReport): Promise<WeeklyReport>;
  getWeeklyReport(subscriptionId: number, weekStart: Date): Promise<WeeklyReport | undefined>;
  getSubscriptionReports(subscriptionId: number, limit?: number): Promise<WeeklyReport[]>;
  markReportEmailSent(reportId: number): Promise<WeeklyReport>;
  
  logReportEmail(log: InsertReportEmailLog): Promise<ReportEmailLog>;
  getReportEmailLogs(subscriptionId: number): Promise<ReportEmailLog[]>;
  
  // User Reviews operations
  createUserReview(review: Partial<InsertUserReview>): Promise<UserReview>;
  getApprovedReviews(): Promise<UserReview[]>;
  approveReview(reviewId: number): Promise<UserReview>;
  updateVoucherPot(amount: number): Promise<void>;
  
  // Platform statistics operations
  getPlatformStats(): Promise<{
    userCount: number;
    totalSavings: number;
    searchesToday: number;
    averageRating: number;
    businessCount: number;
    activeVouchers: number;
    failedSearches: number;
  }>;
  logFailedSearch(query: string, location: string, error: string): Promise<void>;
  incrementSearchCount(): Promise<void>;

  // Business campaign operations
  createBusinessCampaign(campaign: Partial<InsertBusinessCampaign>): Promise<BusinessCampaign>;
  getBusinessCampaignByEmail(email: string): Promise<BusinessCampaign | undefined>;
  getAllActiveCampaigns(): Promise<BusinessCampaign[]>;
  updateCampaignStats(campaignId: number, views: number, clicks: number, enquiries: number): Promise<BusinessCampaign>;
  
  // Business session operations
  createBusinessSession(session: Partial<InsertBusinessSession>): Promise<BusinessSession>;
  
  // Business notification tracking operations
  logBusinessNotification(notification: any): Promise<any>;
  getBusinessNotificationCount(dateFilter: Date, status?: 'sent' | 'failed'): Promise<number>;
  getRecentBusinessNotifications(limit: number): Promise<any[]>;
  getFailedBusinessNotifications(): Promise<any[]>;
  searchBusinessNotifications(query: string, location: string): Promise<any[]>;
  getBusinessNotification(id: string): Promise<any | undefined>;
  updateBusinessNotificationRetry(id: string, successful: boolean, errorMessage?: string | null): Promise<void>;
  validateBusinessSession(token: string): Promise<BusinessSession | undefined>;
  expireBusinessSession(token: string): Promise<void>;
  
  // Search data operations for stats
  getAllSearches(): Promise<PriceCheck[]>;
  
  // Visitor analytics operations
  trackVisitor(analytics: Partial<InsertVisitorAnalytics>): Promise<VisitorAnalytics>;
  updateVisitorActivity(sessionId: string, updates: { conversionType?: string; pageViews?: number; lastActivity?: Date }): Promise<void>;
  getVisitorStats(dateRange?: { start: Date; end: Date }): Promise<{
    totalVisitors: number;
    registeredVisitors: number;
    conversionRate: number;
    topReferrers: Array<{ referrer: string; count: number }>;
    deviceBreakdown: Array<{ deviceType: string; count: number }>;
    dailyVisitors: Array<{ date: string; visitors: number; conversions: number }>;
  }>;

  // Manual advertiser operations
  createManualAdvertiser(advertiser: Partial<InsertAdvertiserPackage>): Promise<AdvertiserPackage>;
  
  // Business report requests operations
  getBusinessReportRequests(options: { status?: string; limit?: number }): Promise<any[]>;
}

// Export the storage implementation directly
export { storage } from './storage.implementation';
