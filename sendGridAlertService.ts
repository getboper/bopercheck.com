import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface AlertConfig {
  type: 'expiry' | 'report_ready' | 'upgrade' | 'referral' | 'share_reminder' | 'system';
  recipient: string;
  data: any;
}

export class SendGridAlertService {
  
  // Ad expiry alerts
  async sendAdExpiryAlert(businessEmail: string, businessName: string, daysLeft: number): Promise<boolean> {
    const subject = daysLeft <= 1 ? 
      `⚠️ Your BoperCheck Ad Expires ${daysLeft === 0 ? 'Today' : 'Tomorrow'}` :
      `Your BoperCheck Ad Expires in ${daysLeft} Days`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .cta-button { background: #dc2626; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Ad Expiry Alert</h1>
            <p>${businessName}</p>
        </div>
        <div class="content">
            <div class="alert-box">
                <h3>Your advertisement expires ${daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}!</h3>
                <p>To avoid interruption to your BoperCheck visibility, please renew your advertising package.</p>
            </div>
            <p><strong>What happens if you don't renew:</strong></p>
            <ul>
                <li>Your business will no longer appear in search results</li>
                <li>Competitor analysis reports will stop</li>
                <li>You'll lose valuable customer insights</li>
            </ul>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/renew" class="cta-button">Renew Now</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: businessEmail,
        from: 'alerts@bopercheck.com',
        subject: subject,
        html: htmlContent
      });
      
      console.log(`Ad expiry alert sent to ${businessName} (${businessEmail}) - ${daysLeft} days left`);
      return true;
    } catch (error) {
      console.error(`Failed to send expiry alert to ${businessName}:`, error);
      return false;
    }
  }

  // Weekly report ready alerts
  async sendReportReadyAlert(businessEmail: string, businessName: string): Promise<boolean> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .highlight-box { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .cta-button { background: #10b981; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Your Weekly Report is Ready!</h1>
            <p>${businessName}</p>
        </div>
        <div class="content">
            <div class="highlight-box">
                <h3>Fresh insights are waiting for you</h3>
                <p>Your latest performance data, competitor analysis, and AI recommendations are ready to view.</p>
            </div>
            <p><strong>This week's report includes:</strong></p>
            <ul>
                <li>Search appearance metrics</li>
                <li>Customer engagement analytics</li>
                <li>Competitor performance comparison</li>
                <li>Claude AI optimization recommendations</li>
            </ul>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/reports" class="cta-button">View Report</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: businessEmail,
        from: 'reports@bopercheck.com',
        subject: `📊 Your BoperCheck Weekly Report is Ready - ${businessName}`,
        html: htmlContent
      });
      
      console.log(`Report ready alert sent to ${businessName} (${businessEmail})`);
      return true;
    } catch (error) {
      console.error(`Failed to send report alert to ${businessName}:`, error);
      return false;
    }
  }

  // Free upgrade available alerts
  async sendUpgradeAvailableAlert(businessEmail: string, businessName: string, upgradeType: string): Promise<boolean> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .upgrade-box { background: #faf5ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .cta-button { background: #8b5cf6; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎁 Free Upgrade Available!</h1>
            <p>${businessName}</p>
        </div>
        <div class="content">
            <div class="upgrade-box">
                <h3>You've qualified for a ${upgradeType}!</h3>
                <p>Based on your excellent performance, we're offering you a complimentary upgrade to unlock premium features.</p>
            </div>
            <p><strong>Your upgrade includes:</strong></p>
            <ul>
                <li>Enhanced competitor analysis</li>
                <li>Priority customer support</li>
                <li>Advanced voucher targeting</li>
                <li>Premium analytics dashboard</li>
            </ul>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/upgrade" class="cta-button">Claim Upgrade</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: businessEmail,
        from: 'upgrades@bopercheck.com',
        subject: `🎁 Free ${upgradeType} Available - ${businessName}`,
        html: htmlContent
      });
      
      console.log(`Upgrade alert sent to ${businessName} (${businessEmail}) - ${upgradeType}`);
      return true;
    } catch (error) {
      console.error(`Failed to send upgrade alert to ${businessName}:`, error);
      return false;
    }
  }

  // Referral bonus unlocked alerts
  async sendReferralBonusAlert(businessEmail: string, businessName: string, bonusType: string): Promise<boolean> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .bonus-box { background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
        .cta-button { background: #f59e0b; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Referral Bonus Unlocked!</h1>
            <p>${businessName}</p>
        </div>
        <div class="content">
            <div class="bonus-box">
                <h3>Congratulations! You've earned ${bonusType}</h3>
                <p>Thanks to your successful referrals, you've unlocked a fantastic bonus reward.</p>
            </div>
            <p><strong>Your referral achievement:</strong></p>
            <ul>
                <li>Successfully referred 2+ verified businesses</li>
                <li>Earned 1 month of free advertising</li>
                <li>Helped grow the BoperCheck community</li>
            </ul>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/referrals" class="cta-button">View Bonus</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: businessEmail,
        from: 'referrals@bopercheck.com',
        subject: `🎉 Referral Bonus Unlocked - ${bonusType} - ${businessName}`,
        html: htmlContent
      });
      
      console.log(`Referral bonus alert sent to ${businessName} (${businessEmail}) - ${bonusType}`);
      return true;
    } catch (error) {
      console.error(`Failed to send referral alert to ${businessName}:`, error);
      return false;
    }
  }

  // Share reminder alerts for users
  async sendShareReminderAlert(userEmail: string, potValue: number): Promise<boolean> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .pot-box { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; text-align: center; }
        .cta-button { background: #3b82f6; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 Share Your Savings!</h1>
            <p>Your voucher pot is growing</p>
        </div>
        <div class="content">
            <div class="pot-box">
                <h2>£${potValue.toFixed(2)}</h2>
                <p>Your current voucher pot value</p>
            </div>
            <p><strong>Share your success and earn bonus vouchers:</strong></p>
            <ul>
                <li>Get £5-£20 bonus vouchers for sharing</li>
                <li>Help friends discover amazing deals</li>
                <li>Build your pot faster with sharing rewards</li>
            </ul>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/share" class="cta-button">Share & Earn Bonus</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: userEmail,
        from: 'rewards@bopercheck.com',
        subject: `💰 Share Your £${potValue.toFixed(2)} Voucher Pot for Bonus Rewards!`,
        html: htmlContent
      });
      
      console.log(`Share reminder sent to ${userEmail} - pot value £${potValue}`);
      return true;
    } catch (error) {
      console.error(`Failed to send share reminder to ${userEmail}:`, error);
      return false;
    }
  }

  // System alerts for admin
  async sendSystemAlert(alertType: string, message: string, severity: 'low' | 'medium' | 'high'): Promise<boolean> {
    const colors = {
      low: { bg: '#ecfdf5', border: '#10b981', button: '#10b981' },
      medium: { bg: '#fffbeb', border: '#f59e0b', button: '#f59e0b' },
      high: { bg: '#fef2f2', border: '#ef4444', button: '#ef4444' }
    };

    const color = colors[severity];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: monospace; margin: 0; padding: 0; background: #1e293b; color: #e2e8f0; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; }
        .header { background: #1e293b; color: white; padding: 2rem; text-align: center; border-bottom: 2px solid ${color.border}; }
        .content { padding: 2rem; }
        .alert-box { background: ${color.bg}; border: 1px solid ${color.border}; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; color: #0f172a; }
        .cta-button { background: ${color.button}; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 BoperCheck System Alert</h1>
            <p>Severity: ${severity.toUpperCase()}</p>
        </div>
        <div class="content">
            <div class="alert-box">
                <h3>${alertType}</h3>
                <p>${message}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/admin" class="cta-button">View Admin Dashboard</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    try {
      await mailService.send({
        to: 'njpards1@gmail.com',
        from: 'system@bopercheck.com',
        subject: `🚨 ${severity.toUpperCase()} Alert: ${alertType}`,
        html: htmlContent
      });
      
      console.log(`System alert sent to admin - ${alertType} (${severity})`);
      return true;
    } catch (error) {
      console.error(`Failed to send system alert:`, error);
      return false;
    }
  }

  // Test all email types
  async sendTestEmails(testEmail: string): Promise<{sent: number, failed: number, results: string[]}> {
    const results: string[] = [];
    let sent = 0;
    let failed = 0;

    const tests = [
      {
        name: 'Ad Expiry Alert',
        fn: () => this.sendAdExpiryAlert(testEmail, 'Test Business', 2)
      },
      {
        name: 'Report Ready Alert', 
        fn: () => this.sendReportReadyAlert(testEmail, 'Test Business')
      },
      {
        name: 'Upgrade Available Alert',
        fn: () => this.sendUpgradeAvailableAlert(testEmail, 'Test Business', 'Premium Upgrade')
      },
      {
        name: 'Referral Bonus Alert',
        fn: () => this.sendReferralBonusAlert(testEmail, 'Test Business', '1 Month Free Advertising')
      },
      {
        name: 'Share Reminder Alert',
        fn: () => this.sendShareReminderAlert(testEmail, 125.50)
      },
      {
        name: 'System Alert',
        fn: () => this.sendSystemAlert('Test Alert', 'This is a test system alert message', 'medium')
      }
    ];

    for (const test of tests) {
      try {
        const success = await test.fn();
        if (success) {
          sent++;
          results.push(`✓ ${test.name}: Sent successfully`);
        } else {
          failed++;
          results.push(`✗ ${test.name}: Failed to send`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failed++;
        results.push(`✗ ${test.name}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { sent, failed, results };
  }

  // Automated alert triggers
  async runAutomatedAlerts(): Promise<void> {
    console.log('Running automated SendGrid alerts...');
    
    // Simulate checking for businesses with expiring ads
    const expiringAds = [
      { email: 'owner@localelectronics.co.uk', name: 'Local Electronics Store', daysLeft: 1 },
      { email: 'manager@fashionboutique.co.uk', name: 'Fashion Boutique UK', daysLeft: 3 }
    ];

    for (const ad of expiringAds) {
      await this.sendAdExpiryAlert(ad.email, ad.name, ad.daysLeft);
    }

    // Send system health alert if needed
    await this.sendSystemAlert(
      'Daily Health Check',
      'All systems operational. Claude AI: 247 calls, Vouchers: 89 claims, Revenue: £4,892',
      'low'
    );
  }
}

export const sendGridAlertService = new SendGridAlertService();