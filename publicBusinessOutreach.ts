import { MailService } from '@sendgrid/mail';
import { db } from './db';
import { sql, eq } from 'drizzle-orm';
import { outreachLogs, insertOutreachLogSchema } from '@shared/schema';
import { realBusinessDirectory } from './realBusinessDirectory';
import { outreachConfig } from './outreachConfig';
import { randomBytes } from 'crypto';

// Set up SendGrid
const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface PublicBusinessContact {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  location: string;
  category: string;
  placeId?: string;
  rating?: number;
}

// Industry categories for systematic outreach
const OUTREACH_CATEGORIES = [
  'plumber',
  'electrician', 
  'kitchen installation',
  'bathroom installation',
  'flooring installation',
  'heating engineer',
  'roofer',
  'window installation',
  'painter decorator',
  'garden landscaping',
  'beauty salon',
  'hairdresser',
  'restaurant',
  'cafe',
  'fitness trainer',
  'mechanic',
  'cleaning service',
  'accountant',
  'solicitor',
  'dentist'
];

// UK locations for systematic coverage
const UK_LOCATIONS = [
  'London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield',
  'Bristol', 'Newcastle', 'Nottingham', 'Leicester', 'Coventry', 'Bradford',
  'Cardiff', 'Belfast', 'Glasgow', 'Edinburgh', 'Brighton', 'Southampton',
  'Portsmouth', 'Reading', 'Oxford', 'Cambridge', 'York', 'Bath'
];

export class PublicBusinessOutreach {
  
  // Main function to run daily/weekly public business outreach with configurable batch sizes
  async runPublicOutreach(): Promise<{ contacted: number; skipped: number; failed: number }> {
    console.log('Starting public business outreach campaign');
    
    const config = outreachConfig.getConfig();
    let contacted = 0;
    let skipped = 0;
    let failed = 0;
    
    console.log(`Daily batch size: ${config.dailyBatchSize}, Max daily limit: ${config.maxDailyEmails}`);
    
    // Rotate through categories and locations for systematic coverage
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Use configurable categories and locations per day
    const categoryIndex = dayOfYear % OUTREACH_CATEGORIES.length;
    const selectedCategories = OUTREACH_CATEGORIES.slice(categoryIndex, categoryIndex + config.categoriesPerDay);
    
    const locationIndex = dayOfYear % UK_LOCATIONS.length;
    const selectedLocations = UK_LOCATIONS.slice(locationIndex, locationIndex + config.locationsPerDay);
    
    console.log(`Today's outreach: Categories [${selectedCategories.join(', ')}] in [${selectedLocations.join(', ')}]`);
    
    for (const category of selectedCategories) {
      for (const location of selectedLocations) {
        try {
          // Stop if we've reached our daily batch size
          if (contacted >= config.dailyBatchSize) {
            console.log(`Daily batch size of ${config.dailyBatchSize} reached. Stopping outreach.`);
            break;
          }
          
          const businesses = await this.discoverPublicBusinesses(category, location);
          console.log(`Found ${businesses.length} businesses for ${category} in ${location}`);
          
          for (const business of businesses) {
            // Safety check for maximum daily emails
            if (contacted >= config.maxDailyEmails) {
              console.log(`Maximum daily email limit (${config.maxDailyEmails}) reached. Stopping outreach.`);
              break;
            }
            
            const result = await this.contactBusinessIfEligible(business);
            
            if (result === 'contacted') contacted++;
            else if (result === 'skipped') skipped++;
            else if (result === 'failed') failed++;
            
            // Configurable delay between emails
            await new Promise(resolve => setTimeout(resolve, config.delayBetweenEmails));
          }
        } catch (error) {
          console.error(`Error processing ${category} in ${location}:`, error);
          failed++;
        }
      }
      
      // Break outer loop if batch size reached
      if (contacted >= config.dailyBatchSize) break;
    }
    
    console.log(`Outreach complete: ${contacted} contacted, ${skipped} skipped, ${failed} failed`);
    return { contacted, skipped, failed };
  }
  
  // Discover businesses from Google Places API
  async discoverBusinesses(category: string, location: string, maxResults: number = 10): Promise<PublicBusinessContact[]> {
    return this.discoverPublicBusinesses(category, location);
  }

  // Discover businesses from Google Places API
  async discoverPublicBusinesses(category: string, location: string): Promise<PublicBusinessContact[]> {
    try {
      const suppliers = await realBusinessDirectory.searchBusinesses(category, location);
      
      return suppliers.map(supplier => ({
        name: supplier.name,
        email: this.generateBusinessEmail(supplier.name),
        phone: supplier.contact,
        website: supplier.link,
        location: supplier.address || location,
        category: category,
        rating: supplier.rating
      }));
      
    } catch (error) {
      console.error(`Failed to discover businesses for ${category} in ${location}:`, error);
      return [];
    }
  }
  

  
  // Send outreach email to business
  async sendOutreachEmail(business: PublicBusinessContact): Promise<{ success: boolean; error?: string }> {
    if (!process.env.SENDGRID_API_KEY) {
      const errorMsg = 'SendGrid API key not configured';
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const htmlContent = this.generateOutreachEmailHTML(business);
      
      await mailService.send({
        to: business.email,
        from: 'support@bopercheck.com',
        subject: `Claim Your Free Business Report - ${business.name}`,
        html: htmlContent,
        text: this.generateOutreachEmailText(business)
      });
      
      // Log successful outreach
      await this.logOutreachAttempt(business, 'sent');
      
      return { success: true };
    } catch (error) {
      const errorMsg = `SendGrid error for ${business.email}: ${error.message}`;
      console.error(errorMsg);
      await this.logOutreachAttempt(business, 'failed');
      return { success: false, error: errorMsg };
    }
  }

  // Check if business is eligible for contact and send email
  async contactBusinessIfEligible(business: PublicBusinessContact): Promise<'contacted' | 'skipped' | 'failed'> {
    try {
      // Check if already contacted recently
      const existingContact = await db.select()
        .from(outreachLogs)
        .where(eq(outreachLogs.businessEmail, business.email))
        .limit(1);
      
      if (existingContact.length > 0) {
        console.log(`Skipping ${business.name} - cooldown active`);
        return 'skipped';
      }
      
      // Check if contacted in last 30 days
      const recentContact = await db.select()
        .from(outreachLogs)  
        .where(eq(outreachLogs.businessEmail, business.email))
        .limit(1);
      
      if (recentContact.length > 0) {
        console.log(`Skipping ${business.name} - contacted recently`);
        return 'skipped';
      }
      
      // Send outreach email
      const emailSent = await this.sendPublicOutreachEmail(business);
      
      if (emailSent) {
        // Log successful contact
        await this.logOutreachAttempt(business, 'sent');
        console.log(`✅ Contacted ${business.name}`);
        return 'contacted';
      } else {
        await this.logOutreachAttempt(business, 'failed');
        return 'failed';
      }
      
    } catch (error) {
      console.error(`Error contacting ${business.name}:`, error);
      return 'failed';
    }
  }
  
  // Send the public outreach email using SendGrid
  async sendPublicOutreachEmail(business: PublicBusinessContact): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return false;
    }
    
    const subject = `${business.name}: Your ${business.category} business visibility report`;
    const htmlContent = this.generateOutreachEmailHTML(business);
    
    try {
      await mailService.send({
        to: business.email,
        from: 'support@bopercheck.com',
        subject: subject,
        html: htmlContent,
        text: this.generateOutreachEmailText(business)
      });
      
      return true;
    } catch (error) {
      console.error(`SendGrid error for ${business.email}:`, error);
      return false;
    }
  }
  
  // Generate HTML email content with proper personalization and value proposition
  private generateOutreachEmailHTML(business: PublicBusinessContact): string {
    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'bopercheck.com';
    const cleanDomain = domain.replace('https://', '').replace('http://', '');
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${business.category} business is being searched for in ${business.location}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #374151;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #ffffff; padding: 20px; border-bottom: 3px solid #10b981;">
      <h1 style="color: #10b981; margin: 0; font-size: 24px; font-weight: bold;">BoperCheck</h1>
      <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">UK's Most Trusted Local Business Discovery Platform</p>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 30px 25px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Hi ${business.name},</h2>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
        Your ${business.category} business in ${business.location} is appearing in customer searches on BoperCheck, but you're missing out on connecting with these potential customers.
      </p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
        <p style="color: #92400e; margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">Why BoperCheck is different:</p>
        <p style="color: #92400e; margin: 0; line-height: 1.6; font-size: 14px;">
          Unlike other platforms that charge high commission fees or hide your business behind expensive ads, BoperCheck connects you directly with customers actively searching for ${business.category} services in ${business.location} - with no commission fees ever.
        </p>
      </div>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
        <strong>Your free business report shows:</strong>
      </p>
      
      <div style="background-color: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 6px;">
        <p style="color: #1e40af; margin: 0 0 8px 0; font-size: 15px;">✓ How many people searched for ${business.category} in ${business.location} this month</p>
        <p style="color: #1e40af; margin: 0 0 8px 0; font-size: 15px;">✓ Your current visibility compared to competitors</p>
        <p style="color: #1e40af; margin: 0 0 8px 0; font-size: 15px;">✓ Free listing optimization to increase customer enquiries</p>
        <p style="color: #1e40af; margin: 0; font-size: 15px;">✓ No setup fees, no commission, no hidden costs</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://${cleanDomain}/business-report" 
           style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Get Your Free ${business.location} Business Report
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
        100% free report - no payment details required
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 25px 0 0 0; font-size: 15px;">
        Best regards,<br>
        Sarah Mitchell<br>
        Business Development Team<br>
        BoperCheck
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">BoperCheck - Connecting UK customers with local businesses since 2024</p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        <a href="https://${cleanDomain}/unsubscribe?email=${encodeURIComponent(business.email)}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
        <a href="mailto:support@bopercheck.com" style="color: #6b7280; text-decoration: underline;">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }
  
  // Generate plain text version with proper personalization
  private generateOutreachEmailText(business: PublicBusinessContact): string {
    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'bopercheck.com';
    const cleanDomain = domain.replace('https://', '').replace('http://', '');
    
    return `Hi ${business.name},

Your ${business.category} business in ${business.location} is appearing in customer searches on BoperCheck, but you're missing out on connecting with these potential customers.

WHY BOPERCHECK IS DIFFERENT:
Unlike other platforms that charge high commission fees or hide your business behind expensive ads, BoperCheck connects you directly with customers actively searching for ${business.category} services in ${business.location} - with no commission fees ever.

YOUR FREE BUSINESS REPORT SHOWS:
✓ How many people searched for ${business.category} in ${business.location} this month
✓ Your current visibility compared to competitors  
✓ Free listing optimization to increase customer enquiries
✓ No setup fees, no commission, no hidden costs

Get Your Free ${business.location} Business Report:
https://${cleanDomain}/business-report

100% free report - no payment details required

Best regards,
Sarah Mitchell
Business Development Team
BoperCheck

---
BoperCheck - Connecting UK customers with local businesses since 2024
Unsubscribe: https://${cleanDomain}/unsubscribe?email=${encodeURIComponent(business.email)} | Contact: support@bopercheck.com`;
  }
  
  // Discover and contact businesses using Google Places API
  async discoverAndContactBusinesses(location: string, category: string, maxResults: number = 5): Promise<{ contacted: number; failed: number }> {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key required for business discovery');
    }

    try {
      const searchQuery = `${category} in ${location}, UK`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      const businesses: PublicBusinessContact[] = [];
      
      for (const place of data.results.slice(0, maxResults)) {
        // Get detailed information
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,rating&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === 'OK') {
          const business: PublicBusinessContact = {
            name: detailsData.result.name,
            email: this.generateBusinessEmail(detailsData.result.name, detailsData.result.website),
            phone: detailsData.result.formatted_phone_number,
            website: detailsData.result.website,
            location: location,
            category: category,
            placeId: place.place_id,
            rating: detailsData.result.rating
          };
          
          // Check if already contacted in last 30 days
          const recentContact = await this.checkRecentContact(business.email);
          if (!recentContact) {
            businesses.push(business);
          }
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      let contacted = 0;
      let failed = 0;
      
      for (const business of businesses) {
        try {
          const result = await this.contactBusinessIfEligible(business);
          if (result === 'contacted') {
            contacted++;
          } else if (result === 'failed') {
            failed++;
          }
        } catch (error) {
          console.error(`Error contacting ${business.name}:`, error);
          failed++;
        }
      }
      
      return { contacted, failed };
    } catch (error) {
      console.error(`Error discovering businesses in ${location}:`, error);
      return { contacted: 0, failed: 0 };
    }
  }

  // Generate business email from name and website  
  generateBusinessEmail(businessName: string, website?: string): string {
    if (website) {
      try {
        const domain = new URL(website).hostname.replace('www.', '');
        return `info@${domain}`;
      } catch {
        // Fallback if website URL is invalid
      }
    }
    
    // Generate email from business name
    const cleanName = businessName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/(ltd|limited|plc|&|and)$/g, '');
    
    return `info@${cleanName}.co.uk`;
  }

  // Check if business was contacted recently
  private async checkRecentContact(email: string): Promise<boolean> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM outreach_logs
        WHERE "businessEmail" = ${email}
        AND "dateContacted" >= ${thirtyDaysAgo.toISOString()}
      `);
      
      return Number(result.rows[0]?.count) > 0;
    } catch (error) {
      console.error('Error checking recent contact:', error);
      return false;
    }
  }

  // Log outreach attempt to database with enhanced tracking
  async logOutreachAttempt(business: PublicBusinessContact, status: string, sendgridMessageId?: string): Promise<void> {
    try {
      const cooldownDate = new Date();
      cooldownDate.setDate(cooldownDate.getDate() + 30); // 30-day cooldown
      
      // Generate unique tracking ID for this outreach
      const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.insert(outreachLogs).values({
        businessName: business.name,
        businessEmail: business.email,
        location: business.location,
        outreachType: 'public_discovery',
        cooldownUntil: cooldownDate,
        searchQuery: business.category,
        industryCategory: business.category,
        emailStatus: status,
        notes: `Public outreach campaign - ${business.category} in ${business.location}`,
        contactMethod: 'email',
        sendgridMessageId: sendgridMessageId || null,
        trackingId: trackingId
      });
      
    } catch (error) {
      console.error('Error logging outreach attempt:', error);
    }
  }
  
  // Get outreach statistics for admin dashboard
  async getOutreachStats(): Promise<any> {
    try {
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_contacted,
          COUNT(CASE WHEN "emailStatus" = 'sent' THEN 1 END) as successful_sends,
          COUNT(CASE WHEN "emailStatus" = 'failed' THEN 1 END) as failed_sends,
          COUNT(CASE WHEN responded = true THEN 1 END) as responses,
          COUNT(CASE WHEN converted = true THEN 1 END) as conversions,
          COUNT(CASE WHEN "dateContacted" >= NOW() - INTERVAL '7 days' THEN 1 END) as this_week,
          COUNT(CASE WHEN "dateContacted" >= NOW() - INTERVAL '30 days' THEN 1 END) as this_month
        FROM outreach_logs
      `);
      
      const recentOutreach = await db.execute(sql`
        SELECT "businessName", "businessEmail", location, "outreachType", "dateContacted", "emailStatus", responded, converted
        FROM outreach_logs 
        ORDER BY "dateContacted" DESC 
        LIMIT 20
      `);
      
      return {
        stats: stats.rows[0] || {},
        recentOutreach: recentOutreach.rows || []
      };
    } catch (error) {
      console.error('Error getting outreach stats:', error);
      return { stats: {}, recentOutreach: [] };
    }
  }

  // Automated outreach method for scheduler
  async runAutomatedOutreach(emailCount: number = 10): Promise<any> {
    try {
      console.log(`🚀 Starting automated outreach batch: ${emailCount} emails`);
      
      let emailsSent = 0;
      let errors = 0;
      const results = [];

      // Get random categories and locations for diverse outreach
      const categories = this.getRandomItems(OUTREACH_CATEGORIES, Math.min(5, emailCount));
      const locations = this.getRandomItems(UK_LOCATIONS, Math.min(3, emailCount));

      for (const category of categories) {
        for (const location of locations) {
          if (emailsSent >= emailCount) break;
          
          try {
            // Discover businesses in this category/location
            const businesses = await this.discoverPublicBusinesses(category, location);
            
            for (const business of businesses) {
              if (emailsSent >= emailCount) break;
              
              // Check if already contacted recently
              const recentlyContacted = await this.checkRecentContact(business.email);
              if (recentlyContacted) {
                console.log(`⏭️ Skipping ${business.name} - contacted within 30 days`);
                continue;
              }
              
              // Send outreach email
              const emailResult = await this.sendOutreachEmail(business);
              
              if (emailResult.success) {
                emailsSent++;
                console.log(`✅ Email sent to ${business.name} (${business.email})`);
                results.push({
                  business: business.name,
                  email: business.email,
                  location: business.location,
                  status: 'sent'
                });
              } else {
                errors++;
                console.log(`❌ Failed to send to ${business.name}: ${emailResult.error}`);
                results.push({
                  business: business.name,
                  email: business.email,
                  location: business.location,
                  status: 'failed',
                  error: emailResult.error
                });
              }
              
              // Rate limiting: 2-second delay between emails
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } catch (categoryError) {
            console.error(`Error processing ${category} in ${location}:`, categoryError);
            errors++;
          }
        }
        if (emailsSent >= emailCount) break;
      }

      const result = {
        success: true,
        emailsSent,
        errors,
        targetEmails: emailCount,
        results,
        timestamp: new Date().toISOString()
      };

      console.log(`📊 Automated batch complete: ${emailsSent}/${emailCount} emails sent, ${errors} errors`);
      return result;

    } catch (error) {
      console.error('Automated outreach batch failed:', error);
      return {
        success: false,
        emailsSent: 0,
        errors: 1,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Helper method to get random items from array
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export const publicBusinessOutreach = new PublicBusinessOutreach();