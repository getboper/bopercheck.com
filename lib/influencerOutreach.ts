import { PerplexityClient } from './perplexityClient';
import { sendEmail } from './sendgrid';

interface InfluencerData {
  tiktokHandle: string;
  displayName: string;
  followerCount: number;
  engagementRate?: string;
  email?: string;
  instagramHandle?: string;
  bio?: string;
  location?: string;
}

interface OutreachTemplate {
  subject: string;
  message: string;
  variables: Record<string, string>;
}

class InfluencerOutreachService {
  private perplexity: PerplexityClient | null = null;
  private fromEmail = 'partnerships@bopercheck.com';

  constructor() {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (apiKey) {
      this.perplexity = new PerplexityClient(apiKey);
    }
  }

  async searchInfluencers(keywords: string[], minFollowers: number = 10000): Promise<InfluencerData[]> {
    if (!this.perplexity) {
      throw new Error('Perplexity API key not configured');
    }

    const searchQuery = `UK TikTok influencers ${keywords.join(' OR ')} money saving budgeting frugal financial tips at least ${minFollowers} followers contact email`;
    
    try {
      const result = await this.perplexity.searchInfluencers(searchQuery, minFollowers);
      return this.parseInfluencerData(result.content);
    } catch (error) {
      console.error('Influencer search failed:', error);
      throw error;
    }
  }

  private parseInfluencerData(content: string): InfluencerData[] {
    // Parse the AI response to extract structured influencer data
    const influencers: InfluencerData[] = [];
    const lines = content.split('\n');
    
    let currentInfluencer: Partial<InfluencerData> = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for TikTok handles
      const handleMatch = trimmed.match(/@([a-zA-Z0-9_.]+)/);
      if (handleMatch && trimmed.toLowerCase().includes('tiktok')) {
        if (currentInfluencer.tiktokHandle) {
          influencers.push(currentInfluencer as InfluencerData);
        }
        currentInfluencer = {
          tiktokHandle: handleMatch[1],
          displayName: '',
          followerCount: 0,
        };
      }
      
      // Look for follower counts
      const followerMatch = trimmed.match(/(\d+(?:,\d+)*)\s*(?:k|K|thousand|million|M)/i);
      if (followerMatch && currentInfluencer.tiktokHandle) {
        let count = parseInt(followerMatch[1].replace(/,/g, ''));
        if (trimmed.toLowerCase().includes('k') || trimmed.toLowerCase().includes('thousand')) {
          count *= 1000;
        } else if (trimmed.toLowerCase().includes('m') || trimmed.toLowerCase().includes('million')) {
          count *= 1000000;
        }
        currentInfluencer.followerCount = count;
      }
      
      // Look for email addresses
      const emailMatch = trimmed.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch && currentInfluencer.tiktokHandle) {
        currentInfluencer.email = emailMatch[1];
      }
      
      // Look for Instagram handles
      const instaMatch = trimmed.match(/instagram.*@([a-zA-Z0-9_.]+)/i);
      if (instaMatch && currentInfluencer.tiktokHandle) {
        currentInfluencer.instagramHandle = instaMatch[1];
      }
    }
    
    if (currentInfluencer.tiktokHandle) {
      influencers.push(currentInfluencer as InfluencerData);
    }
    
    return influencers.filter(inf => inf.followerCount >= 10000);
  }

  generateOutreachMessage(influencer: InfluencerData, template: OutreachTemplate): { subject: string; message: string } {
    let subject = template.subject;
    let message = template.message;
    
    const variables = {
      influencerName: influencer.displayName || influencer.tiktokHandle,
      tiktokHandle: influencer.tiktokHandle,
      followerCount: influencer.followerCount.toLocaleString(),
      ...template.variables,
    };
    
    // Replace variables in both subject and message
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      message = message.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return { subject, message };
  }

  async sendOutreachEmail(
    influencer: InfluencerData,
    subject: string,
    message: string
  ): Promise<boolean> {
    if (!influencer.email) {
      throw new Error('No email address available for influencer');
    }

    try {
      return await sendEmail(process.env.SENDGRID_API_KEY!, {
        to: influencer.email,
        from: this.fromEmail,
        subject,
        html: this.formatEmailHTML(message),
        text: message,
      });
    } catch (error) {
      console.error('Failed to send outreach email:', error);
      return false;
    }
  }

  private formatEmailHTML(message: string): string {
    const htmlMessage = message
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10b981; margin: 0;">BoperCheck</h1>
              <p style="color: #666; margin: 5px 0;">AI-Powered Price Comparison Platform</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <p>${htmlMessage}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>BoperCheck | AI Price Analysis & Comparison Platform</p>
              <p>Helping UK consumers save money through intelligent price comparison</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getDefaultTemplate(): OutreachTemplate {
    return {
      subject: 'Partnership Opportunity with BoperCheck - Feature Your Money-Saving Content',
      message: `Hi {{influencerName}},

I hope this email finds you well! I'm reaching out from BoperCheck, an AI-powered price comparison platform that's helping thousands of UK consumers save money on their purchases.

I've been following your fantastic content on TikTok (@{{tiktokHandle}}) and I'm impressed by your practical money-saving tips and the engaged community you've built with {{followerCount}} followers. Your authentic approach to helping people with their finances aligns perfectly with our mission.

We'd love to feature you as one of our highlighted money-saving experts on the BoperCheck platform. Here's what we're offering:

🌟 Featured Profile: Your own dedicated section on our app showcasing your best money-saving tips
💰 Revenue Share: Earn commission on every user who saves money using your featured recommendations  
📱 Cross-Platform Promotion: We'll promote your content across our social channels to drive followers to your TikTok
🎯 Exclusive Content: Early access to our price alerts and deals to share with your audience
📊 Analytics Dashboard: Track how much money you're helping people save through our platform

The partnership is completely free to join, and we handle all the technical aspects. You simply continue creating the amazing content you already do, and we amplify your impact while helping you monetize your expertise.

Would you be interested in a quick 15-minute call this week to discuss how we can work together? I'd love to show you exactly how the platform works and answer any questions you might have.

You can reach me directly at this email or we can connect on other platforms if preferred.

Looking forward to potentially working together to help more people save money!

Best regards,
Partnership Team
BoperCheck

P.S. If you know other money-saving creators who might be interested, we'd be happy to extend similar partnership opportunities to them as well.`,
      variables: {
        platformName: 'BoperCheck',
        partnershipType: 'Featured Expert Program',
      },
    };
  }
}

export { InfluencerOutreachService, type InfluencerData, type OutreachTemplate };