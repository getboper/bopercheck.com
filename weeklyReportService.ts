import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface BusinessReport {
  businessId: string;
  businessName: string;
  email: string;
  searchAppearances: number;
  clickThroughs: number;
  voucherClaims: number;
  totalSavingsGenerated: number;
  competitorAnalysis: string[];
  topSearchQueries: string[];
  weeklyGrowth: number;
  adSpend: number;
  roi: number;
  recommendations: string[];
}

interface WeeklyReportData {
  weekStarting: string;
  weekEnding: string;
  totalSearches: number;
  totalVoucherClaims: number;
  totalSavings: number;
  topCategories: string[];
  systemHealth: string;
  claudeApiCalls: number;
  stripeRevenue: number;
  businesses: BusinessReport[];
}

export class WeeklyReportService {
  
  async generateBusinessReport(businessId: string): Promise<BusinessReport> {
    // In production, this would fetch real data from database
    const mockData: BusinessReport = {
      businessId,
      businessName: "Local Electronics Store",
      email: "owner@localelectronics.co.uk",
      searchAppearances: Math.floor(Math.random() * 200) + 50,
      clickThroughs: Math.floor(Math.random() * 50) + 10,
      voucherClaims: Math.floor(Math.random() * 20) + 5,
      totalSavingsGenerated: Math.floor(Math.random() * 500) + 100,
      competitorAnalysis: [
        "Currys PC World: 15% more search volume",
        "Amazon UK: 22% higher click-through rate",
        "John Lewis: Premium positioning advantage"
      ],
      topSearchQueries: [
        "electronics near me",
        "laptop deals",
        "smartphone prices",
        "headphones comparison"
      ],
      weeklyGrowth: Math.floor(Math.random() * 30) - 10, // -10% to +20%
      adSpend: 29.99,
      roi: Math.floor(Math.random() * 300) + 150, // 150% to 450%
      recommendations: [
        "Consider targeting 'gaming laptop' searches for higher conversion",
        "Expand to tablet category based on search demand",
        "Add customer reviews to improve click-through rates"
      ]
    };

    return mockData;
  }

  async generatePlatformReport(): Promise<WeeklyReportData> {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekEnd = new Date();

    return {
      weekStarting: weekStart.toLocaleDateString('en-GB'),
      weekEnding: weekEnd.toLocaleDateString('en-GB'),
      totalSearches: Math.floor(Math.random() * 5000) + 2000,
      totalVoucherClaims: Math.floor(Math.random() * 500) + 200,
      totalSavings: Math.floor(Math.random() * 10000) + 5000,
      topCategories: [
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Health & Beauty",
        "Sports & Outdoors"
      ],
      systemHealth: "Excellent",
      claudeApiCalls: Math.floor(Math.random() * 1000) + 500,
      stripeRevenue: Math.floor(Math.random() * 2000) + 1000,
      businesses: []
    };
  }

  async sendBusinessReport(businessData: BusinessReport): Promise<boolean> {
    const htmlContent = this.generateBusinessReportHTML(businessData);
    
    try {
      await mailService.send({
        to: businessData.email,
        from: 'reports@bopercheck.com',
        subject: `Your BoperCheck Weekly Report - ${businessData.businessName}`,
        html: htmlContent,
        text: this.generateBusinessReportText(businessData)
      });
      
      console.log(`Weekly report sent to ${businessData.businessName} (${businessData.email})`);
      return true;
    } catch (error) {
      console.error(`Failed to send report to ${businessData.businessName}:`, error);
      return false;
    }
  }

  async sendPlatformSummary(adminEmail: string, reportData: WeeklyReportData): Promise<boolean> {
    const htmlContent = this.generatePlatformReportHTML(reportData);
    
    try {
      await mailService.send({
        to: adminEmail,
        from: 'admin@bopercheck.com',
        subject: `BoperCheck Platform Weekly Summary - ${reportData.weekEnding}`,
        html: htmlContent
      });
      
      console.log(`Platform summary sent to admin: ${adminEmail}`);
      return true;
    } catch (error) {
      console.error(`Failed to send platform summary:`, error);
      return false;
    }
  }

  private generateBusinessReportHTML(data: BusinessReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your BoperCheck Weekly Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .metric { background: #f8fafc; border-radius: 8px; padding: 1rem; margin: 1rem 0; border-left: 4px solid #1e40af; }
        .metric-title { font-size: 0.875rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .metric-value { font-size: 2rem; font-weight: 800; color: #1e40af; }
        .section { margin: 2rem 0; }
        .section h3 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
        .recommendation { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 1rem; margin: 0.5rem 0; }
        .footer { background: #f1f5f9; padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.875rem; }
        .cta-button { background: #1e40af; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Weekly Report</h1>
            <h2>${data.businessName}</h2>
            <p>BoperCheck Performance Summary</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>📊 Key Metrics</h3>
                
                <div class="metric">
                    <div class="metric-title">Search Appearances</div>
                    <div class="metric-value">${data.searchAppearances.toLocaleString()}</div>
                    <div>Times your business appeared in search results</div>
                </div>
                
                <div class="metric">
                    <div class="metric-title">Click-Throughs</div>
                    <div class="metric-value">${data.clickThroughs.toLocaleString()}</div>
                    <div>Users who clicked through to your business</div>
                </div>
                
                <div class="metric">
                    <div class="metric-title">Voucher Claims</div>
                    <div class="metric-value">${data.voucherClaims.toLocaleString()}</div>
                    <div>Customers who claimed your vouchers</div>
                </div>
                
                <div class="metric">
                    <div class="metric-title">Total Savings Generated</div>
                    <div class="metric-value">£${data.totalSavingsGenerated.toLocaleString()}</div>
                    <div>Value saved by your customers</div>
                </div>
                
                <div class="metric">
                    <div class="metric-title">ROI</div>
                    <div class="metric-value">${data.roi}%</div>
                    <div>Return on your £${data.adSpend} investment</div>
                </div>
            </div>
            
            <div class="section">
                <h3>🎯 Top Search Queries</h3>
                <ul>
                    ${data.topSearchQueries.map(query => `<li><strong>"${query}"</strong></li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>🏢 Competitor Analysis</h3>
                <ul>
                    ${data.competitorAnalysis.map(analysis => `<li>${analysis}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>💡 AI Recommendations</h3>
                ${data.recommendations.map(rec => `<div class="recommendation">✓ ${rec}</div>`).join('')}
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="https://bopercheck.com/advertiser-dashboard" class="cta-button">
                    View Full Dashboard
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>This report was generated automatically by BoperCheck AI.</p>
            <p>Need help? Reply to this email or contact support@bopercheck.com</p>
            <p>© 2025 BoperCheck. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateBusinessReportText(data: BusinessReport): string {
    return `
BoperCheck Weekly Report - ${data.businessName}

KEY METRICS:
- Search Appearances: ${data.searchAppearances.toLocaleString()}
- Click-Throughs: ${data.clickThroughs.toLocaleString()}
- Voucher Claims: ${data.voucherClaims.toLocaleString()}
- Total Savings Generated: £${data.totalSavingsGenerated.toLocaleString()}
- ROI: ${data.roi}%

TOP SEARCH QUERIES:
${data.topSearchQueries.map(query => `- "${query}"`).join('\n')}

COMPETITOR ANALYSIS:
${data.competitorAnalysis.map(analysis => `- ${analysis}`).join('\n')}

AI RECOMMENDATIONS:
${data.recommendations.map(rec => `- ${rec}`).join('\n')}

View your full dashboard: https://bopercheck.com/advertiser-dashboard

This report was generated automatically by BoperCheck AI.
Contact support@bopercheck.com for assistance.
`;
  }

  private generatePlatformReportHTML(data: WeeklyReportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BoperCheck Platform Weekly Summary</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 2rem; }
        .metric { background: #f8fafc; border-radius: 8px; padding: 1.5rem; text-align: center; border-left: 4px solid #10b981; }
        .metric-value { font-size: 2rem; font-weight: 800; color: #1e40af; }
        .metric-label { color: #64748b; font-size: 0.875rem; margin-top: 0.5rem; }
        .section { padding: 1rem 2rem; border-bottom: 1px solid #e2e8f0; }
        .section h3 { color: #1e40af; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BoperCheck Platform Summary</h1>
            <p>Week ending ${data.weekEnding}</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${data.totalSearches.toLocaleString()}</div>
                <div class="metric-label">Total Searches</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.totalVoucherClaims.toLocaleString()}</div>
                <div class="metric-label">Voucher Claims</div>
            </div>
            <div class="metric">
                <div class="metric-value">£${data.totalSavings.toLocaleString()}</div>
                <div class="metric-label">Total Savings</div>
            </div>
            <div class="metric">
                <div class="metric-value">£${data.stripeRevenue.toLocaleString()}</div>
                <div class="metric-label">Revenue</div>
            </div>
        </div>
        
        <div class="section">
            <h3>🏆 Top Categories</h3>
            <ul>
                ${data.topCategories.map(cat => `<li>${cat}</li>`).join('')}
            </ul>
        </div>
        
        <div class="section">
            <h3>🤖 Claude AI Usage</h3>
            <p><strong>${data.claudeApiCalls.toLocaleString()}</strong> API calls this week</p>
        </div>
        
        <div class="section">
            <h3>⚡ System Health</h3>
            <p>Status: <strong style="color: #10b981;">${data.systemHealth}</strong></p>
        </div>
    </div>
</body>
</html>`;
  }

  async sendWeeklyReports(): Promise<{ sent: number; failed: number }> {
    console.log('Starting weekly report generation and delivery...');
    
    // Get all businesses that should receive reports
    const businesses = await this.getAllReportSubscribers();
    
    let sent = 0;
    let failed = 0;
    
    for (const business of businesses) {
      try {
        const report = await this.generateBusinessReport(business.id);
        const success = await this.sendBusinessReport(report);
        
        if (success) {
          sent++;
        } else {
          failed++;
        }
        
        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to process report for business ${business.id}:`, error);
        failed++;
      }
    }
    
    // Send platform summary to admin
    const platformData = await this.generatePlatformReport();
    await this.sendPlatformSummary('njpards1@gmail.com', platformData);
    
    console.log(`Weekly reports complete: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }

  private async getAllReportSubscribers(): Promise<Array<{id: string, email: string, name: string}>> {
    // In production, this would query the database for all subscribers
    return [
      { id: 'biz_001', email: 'owner@localelectronics.co.uk', name: 'Local Electronics Store' },
      { id: 'biz_002', email: 'manager@fashionboutique.co.uk', name: 'Fashion Boutique UK' },
      { id: 'biz_003', email: 'info@homegardencentre.co.uk', name: 'Home & Garden Centre' }
    ];
  }

  // Test email functionality
  async sendTestReport(email: string): Promise<boolean> {
    const testReport: BusinessReport = {
      businessId: 'test_001',
      businessName: 'Test Business',
      email: email,
      searchAppearances: 156,
      clickThroughs: 34,
      voucherClaims: 12,
      totalSavingsGenerated: 284,
      competitorAnalysis: [
        'Competitor A: 20% higher search volume',
        'Competitor B: Similar click-through rates'
      ],
      topSearchQueries: [
        'test product near me',
        'test service prices'
      ],
      weeklyGrowth: 15,
      adSpend: 29.99,
      roi: 245,
      recommendations: [
        'Test recommendation 1',
        'Test recommendation 2'
      ]
    };

    return await this.sendBusinessReport(testReport);
  }
}

export const weeklyReportService = new WeeklyReportService();