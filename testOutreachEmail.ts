import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

async function testBusinessOutreachEmail() {
  console.log('Testing SendGrid business outreach email delivery...');
  
  try {
    const testEmail = {
      to: 'njpards1@gmail.com', // Send test to admin
      from: 'support@bopercheck.com',
      subject: 'Test: BoperCheck Business Outreach System - Live UK Business Discovery',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BoperCheck Outreach Test</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f8fafc; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; }
            .business-list { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BoperCheck</div>
              <p>Business Outreach System Test</p>
            </div>
            
            <div class="content">
              <h2>Outreach System Test Results</h2>
              
              <p>This is a test email to verify the business outreach system is working correctly.</p>
              
              <div class="business-list">
                <h3>Authentic UK Businesses Discovered Today:</h3>
                <ul>
                  <li><strong>MCR Heating and Plumbing ltd</strong> - Manchester Plumber</li>
                  <li><strong>AH Electrical Services</strong> - Manchester Electrician</li>
                  <li><strong>Renovatik kitchen fitter and joinery</strong> - Manchester Kitchen Installer</li>
                  <li><strong>Refine Bathrooms Ltd</strong> - Manchester Bathroom Installer</li>
                </ul>
                <p><em>+ 7 more authentic businesses discovered via Google Places API</em></p>
              </div>
              
              <p>Total: <strong>11 real UK businesses</strong> contacted through automated outreach system.</p>
              
              <p>System Status: <strong>OPERATIONAL</strong></p>
            </div>
            
            <div class="footer">
              <p>BoperCheck - Authentic Business Discovery & Outreach</p>
              <p>Test sent from support@bopercheck.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        BoperCheck Outreach System Test
        
        This is a test email to verify the business outreach system is working correctly.
        
        Authentic UK Businesses Discovered Today:
        - MCR Heating and Plumbing ltd (Manchester Plumber)
        - AH Electrical Services (Manchester Electrician)
        - Renovatik kitchen fitter and joinery (Manchester Kitchen Installer)
        - Refine Bathrooms Ltd (Manchester Bathroom Installer)
        + 7 more authentic businesses discovered via Google Places API
        
        Total: 11 real UK businesses contacted through automated outreach system.
        
        System Status: OPERATIONAL
        
        Test sent from support@bopercheck.com
      `
    };

    await mailService.send(testEmail);
    console.log('✅ Test outreach email sent successfully to admin');
    
    // Test delivery to one of the real businesses (simulation)
    const businessTestEmail = {
      to: 'njpards1@gmail.com', // Simulate business email
      from: 'support@bopercheck.com',
      subject: 'MCR Heating and Plumbing ltd - You\'re showing up in local searches',
      html: `
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
              <h2>Hi MCR Heating and Plumbing ltd,</h2>
              
              <p>We just thought we'd introduce ourselves — your business has been popping up in search results on BoperCheck.com.</p>
              
              <div class="highlight-box">
                <h3>Smart Local Exposure</h3>
                <p>Each week, hundreds of local users search for exactly what you offer. We'd love to offer you a <strong>10% discount on your first month</strong> of featured visibility.</p>
                
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
        </html>
      `,
      text: `
        Hi MCR Heating and Plumbing ltd,
        
        We just thought we'd introduce ourselves — your business has been popping up in search results on BoperCheck.com.
        
        Each week, hundreds of local users search for exactly what you offer. We'd love to offer you a 10% discount on your first month of featured visibility.
        
        Our system only shows your services to local people already searching for it — no wasted views, just smart, local exposure.
        
        Grab your free weekly insight report or see how it works at:
        https://www.bopercheck.com/reports
        
        Hope to see you on the inside!
        
        – The BoperCheck Team
        
        ---
        BoperCheck - Connecting local customers with local businesses
        If you'd prefer not to receive these emails, please reply with "unsubscribe"
      `
    };

    await mailService.send(businessTestEmail);
    console.log('✅ Sample business outreach email sent successfully');
    
    return true;
  } catch (error) {
    console.error('❌ SendGrid email test failed:', error);
    return false;
  }
}

testBusinessOutreachEmail();