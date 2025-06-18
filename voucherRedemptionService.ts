import { db } from "./db";
import { storage } from "./storage.implementation";

interface VoucherRedemption {
  voucherCode: string;
  businessName: string;
  customerEmail?: string;
  redeemedAt: Date;
  redemptionValue: number;
  businessId: string;
  verified: boolean;
}

class VoucherRedemptionService {
  async trackVoucherRedemption(redemption: VoucherRedemption): Promise<boolean> {
    try {
      // Log voucher redemption for business accountability
      await storage.logVoucherRedemption({
        voucherCode: redemption.voucherCode,
        businessName: redemption.businessName,
        customerEmail: redemption.customerEmail,
        redeemedAt: redemption.redeemedAt,
        redemptionValue: redemption.redemptionValue,
        businessId: redemption.businessId,
        verified: redemption.verified
      });

      // Update business metrics for tracking advertising ROI
      await this.updateBusinessMetrics(redemption.businessId, redemption.redemptionValue);
      
      console.log(`Voucher redemption tracked: ${redemption.voucherCode} for ${redemption.businessName}`);
      return true;
    } catch (error) {
      console.error('Error tracking voucher redemption:', error);
      return false;
    }
  }

  async validateVoucherCode(code: string, businessName: string): Promise<boolean> {
    try {
      // Validate against active advertiser vouchers
      const activeAdvertisers = await storage.getActiveAdvertisers();
      const advertiser = activeAdvertisers.find(a => 
        a.companyName.toLowerCase() === businessName.toLowerCase()
      );
      
      if (!advertiser) return false;
      
      // Check if voucher code matches expected pattern
      const expectedCode = `SAVE5${advertiser.companyName.replace(/[^A-Z]/g, '').substring(0, 4)}`;
      return code.toUpperCase() === expectedCode.toUpperCase();
    } catch (error) {
      console.error('Error validating voucher code:', error);
      return false;
    }
  }

  async getBusinessVoucherStats(businessId: string): Promise<{
    totalRedemptions: number;
    totalValue: number;
    lastRedemption?: Date;
  }> {
    try {
      const stats = await storage.getVoucherRedemptionStats(businessId);
      return stats;
    } catch (error) {
      console.error('Error getting voucher stats:', error);
      return { totalRedemptions: 0, totalValue: 0 };
    }
  }

  private async updateBusinessMetrics(businessId: string, redemptionValue: number): Promise<void> {
    try {
      // Update advertiser performance metrics
      await storage.updateAdvertiserMetrics(businessId, {
        voucherRedemptions: 1,
        voucherValue: redemptionValue,
        lastActivity: new Date()
      });
    } catch (error) {
      console.error('Error updating business metrics:', error);
    }
  }

  async generateBusinessVoucherReport(businessId: string): Promise<{
    businessName: string;
    totalRedemptions: number;
    totalValue: number;
    averageRedemption: number;
    conversionRate: number;
    recentRedemptions: VoucherRedemption[];
  }> {
    try {
      const business = await storage.getAdvertiserById(businessId);
      const stats = await this.getBusinessVoucherStats(businessId);
      const recentRedemptions = await storage.getRecentVoucherRedemptions(businessId, 10);
      
      return {
        businessName: business?.companyName || 'Unknown',
        totalRedemptions: stats.totalRedemptions,
        totalValue: stats.totalValue,
        averageRedemption: stats.totalRedemptions > 0 ? stats.totalValue / stats.totalRedemptions : 0,
        conversionRate: 0, // Would need to track impressions vs redemptions
        recentRedemptions: recentRedemptions
      };
    } catch (error) {
      console.error('Error generating voucher report:', error);
      return {
        businessName: 'Unknown',
        totalRedemptions: 0,
        totalValue: 0,
        averageRedemption: 0,
        conversionRate: 0,
        recentRedemptions: []
      };
    }
  }
}

export const voucherRedemptionService = new VoucherRedemptionService();
export type { VoucherRedemption };