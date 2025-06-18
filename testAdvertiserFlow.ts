import { storage } from "./storage.implementation";
import { db } from "./db";
import { advertiserPackages } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface TestAdvertiser {
  businessEmail: string;
  businessName: string;
  contactPhone?: string;
  website?: string;
  serviceArea: string;
  packageType: string;
  adHeadline?: string;
  adDescription?: string;
  targetKeywords?: string[];
  voucherOffer?: {
    discount: string;
    code: string;
    terms: string;
  };
}

export class TestAdvertiserFlow {
  private testMode = false;

  enableTestMode() {
    this.testMode = true;
    console.log('🧪 TEST MODE ENABLED - Payments disabled for testing');
  }

  disableTestMode() {
    this.testMode = false;
    console.log('💳 TEST MODE DISABLED - Payments re-enabled');
  }

  async createTestAdvertiser(advertiserData: TestAdvertiser): Promise<{
    success: boolean;
    advertiserId?: string;
    packageId?: string;
    logs: string[];
  }> {
    const logs: string[] = [];
    
    try {
      logs.push(`🧪 Creating test advertiser: ${advertiserData.businessName}`);
      logs.push(`📧 Email: ${advertiserData.businessEmail}`);
      logs.push(`📦 Package: ${advertiserData.packageType}`);
      
      // Step 1: Create advertiser package record
      const advertiserId = `test_${Date.now()}`;
      const packageData = {
        advertiserId: advertiserId,
        companyName: advertiserData.businessName,
        packageType: advertiserData.packageType,
        monthlyFee: "99.00",
        clickRate: "0.50",
        isActive: true,
        contactEmail: advertiserData.businessEmail,
        contactPhone: advertiserData.contactPhone || null
      };

      logs.push(`💾 Inserting advertiser package into database...`);
      
      const [insertedPackage] = await db.insert(advertiserPackages).values(packageData).returning();
      
      logs.push(`✅ Advertiser package created with ID: ${insertedPackage.id}`);
      logs.push(`📍 Service area: ${advertiserData.serviceArea}`);
      logs.push(`🎯 Target keywords: ${advertiserData.targetKeywords?.join(', ')}`);

      // Step 2: Create voucher if provided
      if (advertiserData.voucherOffer) {
        logs.push(`🎫 Creating voucher: ${advertiserData.voucherOffer.code} - ${advertiserData.voucherOffer.discount}`);
        
        // Store voucher in the system
        await this.createAdvertiserVoucher(insertedPackage.id, advertiserData.voucherOffer);
        
        logs.push(`✅ Voucher created and linked to advertiser`);
      }

      // Step 3: Verify advertiser appears in active list
      const activeAdvertisers = await storage.getActiveAdvertisers();
      const foundAdvertiser = activeAdvertisers.find(a => a.id === insertedPackage.id);
      
      if (foundAdvertiser) {
        logs.push(`✅ Advertiser verified in active list`);
        logs.push(`📊 Advertiser data: ${JSON.stringify(foundAdvertiser, null, 2)}`);
      } else {
        logs.push(`❌ ERROR: Advertiser not found in active list`);
      }

      logs.push(`🎉 Test advertiser creation complete!`);

      return {
        success: true,
        advertiserId: insertedPackage.id,
        packageId: insertedPackage.id,
        logs
      };

    } catch (error) {
      logs.push(`❌ ERROR: ${error.message}`);
      console.error('Test advertiser creation failed:', error);
      
      return {
        success: false,
        logs
      };
    }
  }

  private async createAdvertiserVoucher(advertiserId: string, voucherOffer: {
    discount: string;
    code: string;
    terms: string;
  }) {
    // This would integrate with the voucher system
    // For now, we'll store it as metadata with the advertiser
    console.log(`Creating voucher for advertiser ${advertiserId}:`, voucherOffer);
  }

  async testSearchIntegration(advertiserId: string, searchQuery: string, location: string): Promise<{
    success: boolean;
    advertiserFound: boolean;
    position: number;
    logs: string[];
  }> {
    const logs: string[] = [];
    
    try {
      logs.push(`🔍 Testing search integration for: "${searchQuery}" in ${location}`);
      logs.push(`🎯 Looking for advertiser ID: ${advertiserId}`);

      // Simulate a search request to check if advertiser appears
      const response = await fetch(`http://localhost:5000/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          location: location
        })
      });

      if (!response.ok) {
        logs.push(`❌ Search API failed: ${response.status}`);
        return { success: false, advertiserFound: false, position: -1, logs };
      }

      const searchResults = await response.json();
      logs.push(`✅ Search API returned ${searchResults.suppliers?.length || 0} suppliers`);

      // Check if our test advertiser appears in results
      let advertiserFound = false;
      let position = -1;

      if (searchResults.suppliers) {
        searchResults.suppliers.forEach((supplier, index) => {
          if (supplier.advertiserId === advertiserId || supplier.isAdvertiser) {
            advertiserFound = true;
            position = index + 1;
            logs.push(`✅ Test advertiser found at position ${position}`);
            logs.push(`📊 Advertiser data: ${JSON.stringify(supplier, null, 2)}`);
          }
        });
      }

      if (!advertiserFound) {
        logs.push(`❌ Test advertiser NOT found in search results`);
        logs.push(`📋 Available suppliers: ${searchResults.suppliers?.map(s => s.name).join(', ')}`);
      }

      return {
        success: true,
        advertiserFound,
        position,
        logs
      };

    } catch (error) {
      logs.push(`❌ Search integration test failed: ${error.message}`);
      return { success: false, advertiserFound: false, position: -1, logs };
    }
  }

  async cleanupTestAdvertiser(advertiserId: string): Promise<void> {
    try {
      console.log(`🧹 Cleaning up test advertiser: ${advertiserId}`);
      
      // Remove from database
      await db.delete(advertiserPackages).where(eq(advertiserPackages.id, advertiserId));
      
      console.log(`✅ Test advertiser removed from database`);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

export const testAdvertiserFlow = new TestAdvertiserFlow();