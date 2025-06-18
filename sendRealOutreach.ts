import { MailService } from '@sendgrid/mail';
import { db } from './db';
import { sql } from 'drizzle-orm';

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendOutreachToRealBusinesses() {
  console.log('Sending outreach emails to authentic UK businesses...');
  
  try {
    // Get businesses from today
    const businesses = await db.execute(sql`
      SELECT "businessName", "businessEmail", "industryCategory", location
      FROM outreach_logs 
      WHERE DATE("dateContacted") = CURRENT_DATE
      AND "outreachType" = 'public_discovery'
    `);
    
    console.log(`Found ${businesses.rows.length} authentic businesses to contact`);
    
    let emailsSent = 0;
    let emailsFailed = 0;
    
    for (const business of businesses.rows) {
      try {
        const emailContent = {
          to: business.businessEmail,
          from: 'support@bopercheck.com',
          subject: `${business.businessName} - You're showing up in local searches`,
          html: generateBusinessHTML(business),
          text: generateBusinessText(business)
        };
        
        await mailService.send(emailContent);
        console.log(`✅ Email sent to ${business.businessName}`);
        emailsSent++;
        
        // Update status to delivered
        await db.execute(sql`
          UPDATE outreach_logs 
          SET "emailStatus" = 'delivered'
          WHERE "businessName" = ${business.businessName}
        `);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to send email to ${business.businessName}:`, error);
        emailsFailed++;
        
        // Update status to failed
        await db.execute(sql`
          UPDATE outreach_logs 
          SET "emailStatus" = 'failed'
          WHERE "businessName" = ${business.businessName}
        `);
      }
    }
    
    console.log(`\nOutreach complete: ${emailsSent} emails sent, ${emailsFailed} failed`);
    return { sent: emailsSent, failed: emailsFailed };
    
  } catch (error) {
    console.error('Error sending outreach emails:', error);
    return { sent: 0, failed: 0 };
  }
}

function generateBusinessHTML(business: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're showing up in search results</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f8fafc; color: #334155; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { padding: 30px; }
    .highlight-box { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BoperCheck</div>
      <p>Local Business Discovery Platform</p>
    </div>
    
    <div class="content">
      <h2>Hi ${business.businessName},</h2>
      
      <p>We just thought we'd introduce ourselves — your business has been popping up in search results on BoperCheck.com.</p>
      
      <div class="highlight-box">
        <h3>Smart Local Exposure</h3>
        <p>Each week, hundreds of local users in ${business.location} search for ${business.industryCategory} services. We'd love to offer you a <strong>10% discount on your first month</strong> of featured visibility.</p>
        
        <p>Our system only shows your services to local people already searching for it — no wasted views, just smart, local exposure.</p>
      </div>
      
      <p>Grab your free weekly insight report or see how it works at:</p>
      
      <a href="https://www.bopercheck.com/reports" class="cta-button">Get Free Weekly Report</a>
      
      <p>Hope to see you on the inside!</p>
      
      <p>– The BoperCheck Team</p>
    </div>
    
    <div class="footer">
      <p>BoperCheck - Connecting local customers with local businesses</p>
      <p>If you'd prefer not to receive these emails, please reply with "unsubscribe"</p>
    </div>
  </div>
</body>
</html>`;
}

function generateBusinessText(business: any): string {
  return `
Hi ${business.businessName},

We just thought we'd introduce ourselves — your business has been popping up in search results on BoperCheck.com.

Each week, hundreds of local users in ${business.location} search for ${business.industryCategory} services. We'd love to offer you a 10% discount on your first month of featured visibility.

Our system only shows your services to local people already searching for it — no wasted views, just smart, local exposure.

Grab your free weekly insight report or see how it works at:
https://www.bopercheck.com/reports

Hope to see you on the inside!

– The BoperCheck Team

---
BoperCheck - Connecting local customers with local businesses
If you'd prefer not to receive these emails, please reply with "unsubscribe"
  `;
}

sendOutreachToRealBusinesses();