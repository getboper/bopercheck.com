import { db } from "./db";
import { sql } from "drizzle-orm";

// Enhanced traffic analytics to track legitimate users vs bots
export interface TrafficEntry {
  timestamp: Date;
  ip: string;
  userAgent: string;
  path: string;
  method: string;
  referer?: string;
  isBot: boolean;
  isLegitimate: boolean;
  country?: string;
  sessionId?: string;
}

// Bot detection patterns
const BOT_PATTERNS = [
  'bot', 'crawler', 'spider', 'scraper', 'parser', 'checker',
  'monitor', 'wget', 'curl', 'python', 'go-http', 'okhttp',
  'apache-httpclient', 'java/', 'perl/', 'ruby/', 'node-fetch'
];

const LEGITIMATE_BOTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'
];

export function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern));
}

export function isLegitimateBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return LEGITIMATE_BOTS.some(pattern => ua.includes(pattern));
}

export function isLegitimateTraffic(userAgent: string, path: string, referer?: string): boolean {
  // WordPress attack attempts
  if (path.includes('wp-admin') || path.includes('wordpress')) {
    return false;
  }

  // Other common attack paths
  const attackPaths = ['phpmyadmin', 'admin', 'config', '.env', 'backup'];
  if (attackPaths.some(attack => path.toLowerCase().includes(attack))) {
    return false;
  }

  // Malicious bots
  if (isBot(userAgent) && !isLegitimateBot(userAgent)) {
    return false;
  }

  // Legitimate traffic patterns
  return true;
}

// Create analytics summary for dashboard
export function createAnalyticsSummary(entries: TrafficEntry[]) {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recent = entries.filter(e => e.timestamp > last24h);
  const weekly = entries.filter(e => e.timestamp > last7d);

  const legitimateRecent = recent.filter(e => e.isLegitimate);
  const legitimateWeekly = weekly.filter(e => e.isLegitimate);

  const uniqueIPs24h = new Set(legitimateRecent.map(e => e.ip)).size;
  const uniqueIPsWeekly = new Set(legitimateWeekly.map(e => e.ip)).size;

  // Top pages (legitimate traffic only)
  const pageViews = {};
  legitimateWeekly.forEach(entry => {
    if (entry.path !== '/favicon.ico') {
      pageViews[entry.path] = (pageViews[entry.path] || 0) + 1;
    }
  });

  const topPages = Object.entries(pageViews)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Traffic sources
  const sources = {};
  legitimateWeekly.forEach(entry => {
    if (entry.referer && !entry.referer.includes(process.env.DOMAIN || 'bopercheck.com')) {
      const domain = new URL(entry.referer).hostname;
      sources[domain] = (sources[domain] || 0) + 1;
    }
  });

  const topSources = Object.entries(sources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return {
    summary: {
      totalRequests24h: recent.length,
      legitimateRequests24h: legitimateRecent.length,
      uniqueVisitors24h: uniqueIPs24h,
      totalRequestsWeekly: weekly.length,
      legitimateRequestsWeekly: legitimateWeekly.length,
      uniqueVisitorsWeekly: uniqueIPsWeekly,
      botTraffic24h: recent.filter(e => e.isBot).length,
      attackAttempts24h: recent.filter(e => !e.isLegitimate).length
    },
    topPages,
    topSources,
    hourlyTraffic: getHourlyBreakdown(legitimateRecent),
    securityEvents: recent.filter(e => !e.isLegitimate).length
  };
}

function getHourlyBreakdown(entries: TrafficEntry[]) {
  const hourly = {};
  entries.forEach(entry => {
    const hour = entry.timestamp.getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
  });

  return Array.from({length: 24}, (_, i) => ({
    hour: i,
    requests: hourly[i] || 0
  }));
}

// Store analytics data efficiently
export async function logTrafficEntry(entry: TrafficEntry) {
  try {
    // Only store legitimate traffic in your analytics
    if (entry.isLegitimate) {
      await db.execute(sql`
        INSERT INTO traffic_analytics 
        (timestamp, ip_hash, user_agent, path, method, referer, is_bot, country, session_id)
        VALUES (
          ${entry.timestamp},
          ${hashIP(entry.ip)},
          ${entry.userAgent.substring(0, 255)},
          ${entry.path},
          ${entry.method},
          ${entry.referer?.substring(0, 255)},
          ${entry.isBot},
          ${entry.country},
          ${entry.sessionId}
        )
      `);
    }
  } catch (error) {
    console.error('Failed to log traffic entry:', error);
  }
}

// Hash IP addresses for privacy compliance
function hashIP(ip: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex').substring(0, 16);
}

// Export function to get dashboard data
export async function getDashboardAnalytics() {
  try {
    const result = await db.execute(sql`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(DISTINCT ip_hash) as unique_visitors,
        COUNT(CASE WHEN timestamp > NOW() - INTERVAL '24 hours' THEN 1 END) as requests_24h,
        COUNT(DISTINCT CASE WHEN timestamp > NOW() - INTERVAL '24 hours' THEN ip_hash END) as visitors_24h,
        COUNT(CASE WHEN is_bot = true THEN 1 END) as bot_requests
      FROM traffic_analytics 
      WHERE timestamp > NOW() - INTERVAL '7 days'
    `);

    return result[0];
  } catch (error) {
    console.error('Failed to get dashboard analytics:', error);
    return {
      total_requests: 0,
      unique_visitors: 0,
      requests_24h: 0,
      visitors_24h: 0,
      bot_requests: 0
    };
  }
}