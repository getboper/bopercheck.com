// Voucher pot system for storing user vouchers
import type { Express } from "express";
import { requireAuth } from "./auth";

// Simple voucher store - in production use proper database
const userVouchers = new Map<string, Array<any>>(); // userId -> vouchers array

export function setupVoucherPot(app: Express) {
  // Add voucher to user's pot
  app.post('/api/voucher-pot/add', requireAuth, async (req: any, res) => {
    try {
      const { voucherId, voucher } = req.body;
      const userId = req.user.id;
      
      // Get user's current vouchers
      let vouchers = userVouchers.get(userId) || [];
      
      // Check if voucher already exists
      const existingVoucher = vouchers.find(v => v.id === voucherId);
      if (existingVoucher) {
        return res.status(400).json({ error: 'Voucher already in pot' });
      }
      
      // Add voucher with metadata
      const voucherWithMetadata = {
        ...voucher,
        addedAt: new Date().toISOString(),
        userId: userId,
        status: 'active'
      };
      
      vouchers.push(voucherWithMetadata);
      userVouchers.set(userId, vouchers);
      
      res.json({ 
        success: true, 
        message: 'Voucher added to pot',
        vouchersCount: vouchers.length
      });
    } catch (error) {
      console.error('Add voucher error:', error);
      res.status(500).json({ error: 'Failed to add voucher' });
    }
  });

  // Get user's voucher pot
  app.get('/api/voucher-pot', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const vouchers = userVouchers.get(userId) || [];
      
      // Filter active vouchers and check expiry
      const activeVouchers = vouchers.filter(voucher => {
        const isExpired = new Date(voucher.validUntil) < new Date();
        return voucher.status === 'active' && !isExpired;
      });
      
      // Calculate total potential savings
      const totalSavings = activeVouchers.reduce((total, voucher) => {
        return total + (voucher.value || 0);
      }, 0);
      
      res.json({
        vouchers: activeVouchers,
        totalVouchers: activeVouchers.length,
        totalSavings: totalSavings,
        categories: [...new Set(activeVouchers.map(v => v.category))]
      });
    } catch (error) {
      console.error('Get voucher pot error:', error);
      res.status(500).json({ error: 'Failed to get voucher pot' });
    }
  });

  // Use/redeem a voucher
  app.post('/api/voucher-pot/use/:voucherId', requireAuth, async (req: any, res) => {
    try {
      const { voucherId } = req.params;
      const userId = req.user.id;
      
      let vouchers = userVouchers.get(userId) || [];
      const voucherIndex = vouchers.findIndex(v => v.id === voucherId);
      
      if (voucherIndex === -1) {
        return res.status(404).json({ error: 'Voucher not found' });
      }
      
      const voucher = vouchers[voucherIndex];
      
      // Check if voucher is expired
      if (new Date(voucher.validUntil) < new Date()) {
        return res.status(400).json({ error: 'Voucher has expired' });
      }
      
      // Mark as used
      vouchers[voucherIndex] = {
        ...voucher,
        status: 'used',
        usedAt: new Date().toISOString()
      };
      
      userVouchers.set(userId, vouchers);
      
      res.json({ 
        success: true, 
        message: 'Voucher marked as used',
        voucher: vouchers[voucherIndex]
      });
    } catch (error) {
      console.error('Use voucher error:', error);
      res.status(500).json({ error: 'Failed to use voucher' });
    }
  });

  // Remove voucher from pot
  app.delete('/api/voucher-pot/:voucherId', requireAuth, async (req: any, res) => {
    try {
      const { voucherId } = req.params;
      const userId = req.user.id;
      
      let vouchers = userVouchers.get(userId) || [];
      const filteredVouchers = vouchers.filter(v => v.id !== voucherId);
      
      if (filteredVouchers.length === vouchers.length) {
        return res.status(404).json({ error: 'Voucher not found' });
      }
      
      userVouchers.set(userId, filteredVouchers);
      
      res.json({ 
        success: true, 
        message: 'Voucher removed from pot',
        vouchersCount: filteredVouchers.length
      });
    } catch (error) {
      console.error('Remove voucher error:', error);
      res.status(500).json({ error: 'Failed to remove voucher' });
    }
  });

  // Get voucher stats
  app.get('/api/voucher-pot/stats', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const vouchers = userVouchers.get(userId) || [];
      
      const activeVouchers = vouchers.filter(v => v.status === 'active' && new Date(v.validUntil) >= new Date());
      const usedVouchers = vouchers.filter(v => v.status === 'used');
      const expiredVouchers = vouchers.filter(v => new Date(v.validUntil) < new Date());
      
      const totalSavings = usedVouchers.reduce((total, voucher) => total + (voucher.value || 0), 0);
      const potentialSavings = activeVouchers.reduce((total, voucher) => total + (voucher.value || 0), 0);
      
      res.json({
        totalVouchers: vouchers.length,
        activeVouchers: activeVouchers.length,
        usedVouchers: usedVouchers.length,
        expiredVouchers: expiredVouchers.length,
        totalSavings: totalSavings,
        potentialSavings: potentialSavings,
        categories: [...new Set(activeVouchers.map(v => v.category))]
      });
    } catch (error) {
      console.error('Get voucher stats error:', error);
      res.status(500).json({ error: 'Failed to get voucher stats' });
    }
  });
}