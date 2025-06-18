import { db } from './db';
import { sql } from 'drizzle-orm';

// Track page visits and engagement
export async function trackPageVisit(page: string, userAgent?: string, ipAddress?: string) {
  try {
    await db.execute(sql`
      INSERT INTO page_visits (page, user_agent, ip_address, visited_at)
      VALUES (${page}, ${userAgent || null}, ${ipAddress || null}, NOW())
    `);
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
}

// Get analytics for business pages
export async function getBusinessPageAnalytics() {
  try {
    const weeklyReportsVisits = await db.execute(sql`
      SELECT COUNT(*) as visits
      FROM page_visits 
      WHERE page = '/reports' AND visited_at >= NOW() - INTERVAL '7 days'
    `);

    const businessPageVisits = await db.execute(sql`
      SELECT COUNT(*) as visits  
      FROM page_visits
      WHERE page = '/business' AND visited_at >= NOW() - INTERVAL '7 days'
    `);

    const advertisingClicks = await db.execute(sql`
      SELECT COUNT(*) as clicks
      FROM page_visits
      WHERE page LIKE '/business%' OR page LIKE '/advertise%'
      AND visited_at >= NOW() - INTERVAL '7 days'  
    `);

    return {
      weeklyReportsPageVisits: Number(weeklyReportsVisits.rows[0]?.visits) || 0,
      businessPageVisits: Number(businessPageVisits.rows[0]?.visits) || 0,
      advertisingClicks: Number(advertisingClicks.rows[0]?.clicks) || 0,
      analysisDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting business page analytics:', error);
    return {
      weeklyReportsPageVisits: 0,
      businessPageVisits: 0, 
      advertisingClicks: 0,
      analysisDate: new Date().toISOString(),
      error: 'Analytics data unavailable'
    };
  }
}

// Create the page_visits table if it doesn't exist
export async function initializePageTracking() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        visited_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Page tracking initialized');
  } catch (error) {
    console.error('Error initializing page tracking:', error);
  }
}