import { apiRequest } from "./queryClient";

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025

// Function to analyze price using the Anthropic Claude API via our backend
export async function analyzePriceWithAI(
  item: string, 
  description?: string, 
  category?: string, 
  budget?: number,
  imageBase64?: string,
  includeInstallation?: boolean,
  location?: string,
  additionalImages?: string[]
): Promise<PriceAnalysisResult> {
  try {
    // Get or generate guest ID for tracking
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guestId', guestId);
    }

    // Add cache-busting timestamp to prevent stale results
    const cacheBuster = Date.now();
    
    const response = await fetch(`/api/analyze-price?v=${cacheBuster}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Guest-ID": guestId || crypto.randomUUID(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      body: JSON.stringify({
        item: item || "",
        description: description || "",
        category: category || "",
        budget: budget || 0,
        imageBase64: imageBase64 || null,
        includeInstallation: includeInstallation || false,
        location: location || "",
        additionalImages: additionalImages || [],
        timestamp: cacheBuster
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: Server error`);
    }
    
    const data = await response.json();
    
    if (!data || data.error) {
      throw new Error(data.message || data.error || 'No data received');
    }
    
    return data;
  } catch (error) {
    console.error("Error analyzing price:", error);
    throw error;
  }
}

// Type for the price analysis result
export interface PriceAnalysisResult {
  marketValue: number;
  averagePrice: number;
  lowestPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  dealRating: number | string; // 1-5 stars or "Good"/"Fair"/"Poor"
  stores: Array<{
    name: string;
    price: number;
    notes: string;
    link: string;
    discountCode?: string;
    originalPrice?: number;
  }>;
  analysis: string;
  currency: string;
  
  // Product images and visual information
  productImages?: Array<{
    url: string;
    description: string;
    source: string;
  }>;
  
  // Second-hand and marketplace options
  secondHandOptions?: Array<{
    platform: string;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    condition: string;
    notes: string;
    link: string;
  }>;
  
  // Active discount codes and promotions
  discounts?: Array<{
    store: string;
    code: string;
    description: string;
    discount: string;
    expiryDate?: string;
    minSpend?: number;
  }>;

  // Voucher codes from API response
  vouchers?: Array<{
    code: string;
    discount: string;
    description: string;
    expiryDate: string;
    minSpend?: number;
    store?: string;
  }>;
  
  // Installation data if requested
  installation?: {
    averageCost: number;
    costRange: {
      min: number;
      max: number;
    };
    timeEstimate: string;
    difficultyLevel: string; // "Easy", "Moderate", "Difficult", "Professional Only"
    notes: string;
  };
  
  // Local business recommendations if location provided
  localBusinesses?: Array<{
    name: string;
    location: string;
    distance?: string;
    serviceType: string; // "Supplier", "Installer", "Both"
    rating?: number;
    contactInfo: string | {
      phone?: string;
      website?: string;
    };
    notes: string;
    installationPrice?: number; // Specific installation cost for this business
    installationPriceRange?: {
      min: number;
      max: number;
    };
    suppliesIncluded?: boolean; // Whether materials/supplies are included in installation price
  }>;
}
