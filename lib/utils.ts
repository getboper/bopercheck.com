import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "GBP"): string {
  // Handle NaN, null, undefined, or invalid numbers
  if (!amount || isNaN(amount) || amount <= 0) {
    return "Price on request";
  }
  
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateStars(rating: number): { full: number; half: number; empty: number } {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;
  
  return { full: fullStars, half: halfStars, empty: emptyStars };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const categoryIcons: Record<string, { icon: string; color: string }> = {
  furniture: { icon: "couch", color: "bg-orange-500" },
  electronics: { icon: "mobile-alt", color: "bg-blue-500" },
  clothing: { icon: "tshirt", color: "bg-green-500" },
  shoes: { icon: "shoe-prints", color: "bg-blue-500" },
  food: { icon: "utensils", color: "bg-yellow-500" },
  cake: { icon: "birthday-cake", color: "bg-pink-500" },
  car: { icon: "car", color: "bg-purple-500" },
  services: { icon: "concierge-bell", color: "bg-teal-500" },
  travel: { icon: "plane", color: "bg-indigo-500" },
  home: { icon: "home", color: "bg-amber-500" },
  other: { icon: "ellipsis-h", color: "bg-gray-500" }
};

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const result = reader.result as string;
        if (!result) {
          reject(new Error("Failed to read file - empty result"));
          return;
        }
        
        // Keep the full base64 string for API compatibility
        resolve(result);
      } catch (error) {
        console.error("Error in convertFileToBase64:", error);
        reject(error);
      }
    };
    reader.onerror = error => {
      console.error("FileReader error:", error);
      reject(error);
    }
  });
}

export function generatePDF(data: any): void {
  // Create a styled HTML template for the PDF
  const { itemName, results, date } = data;
  const { marketValue, averagePrice, lowestPrice, priceRange, dealRating, stores, currency, analysis, installation, localBusinesses } = results;
  
  // Format the stars for display
  const stars = generateStars(dealRating);
  const starsHtml = `
    ${Array(stars.full).fill('<span style="color: #FFB800;">★</span>').join('')}
    ${Array(stars.half).fill('<span style="color: #FFB800;">★</span>').join('')}
    ${Array(stars.empty).fill('<span style="color: #D1D5DB;">★</span>').join('')}
  `;
  
  const dealLabel = getDealLabel(dealRating);
  const savingsPercent = Math.round(((marketValue - lowestPrice) / marketValue) * 100);
  
  // Create the stores HTML
  let storesHtml = '';
  let localBusinessCount = 0;
  
  stores.forEach((store: any) => {
    const isLowestPrice = store.price === lowestPrice;
    const isInstallationService = (store.notes || '').toLowerCase().includes('installation') || 
                                  (store.notes || '').toLowerCase().includes('fitting') ||
                                  (store.notes || '').toLowerCase().includes('installer');
    const isLocalBusiness = (store.notes || '').toLowerCase().includes('local');
    
    // Count local businesses for highlighting
    if (isLocalBusiness) localBusinessCount++;
    
    // Add badges for business type and locality
    const badgesHtml = `
      <div style="display: flex; gap: 8px; margin: 4px 0 8px 0;">
        <span style="
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 9999px;
          background-color: ${isInstallationService ? '#DBEAFE' : '#FEF3C7'};
          color: ${isInstallationService ? '#1E40AF' : '#92400E'};
          font-weight: 500;
        ">
          ${isInstallationService ? 'Installation Service' : 'Supplier'}
        </span>
        ${isLocalBusiness ? `
          <span style="
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 9999px;
            background-color: #DCFCE7;
            color: #166534;
            font-weight: 500;
          ">
            Local Business
          </span>
        ` : ''}
      </div>
    `;
    
    // Create the store card with badges
    storesHtml += `
      <div style="
        border: 1px solid #E5E7EB; 
        border-radius: 12px; 
        padding: 16px; 
        margin-bottom: 12px; 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        ${isLowestPrice ? 'border-color: #10B981; border-width: 2px;' : ''}
        ${isLocalBusiness ? 'background-color: #F0FDF4;' : ''}
      ">
        <div>
          <h4 style="font-weight: 700; color: #1F2937; margin: 0 0 4px 0;">${store.name}</h4>
          ${badgesHtml}
          <p style="font-size: 14px; color: #6B7280; margin: 0;">${store.notes}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: 700; font-size: 18px; color: ${isLowestPrice ? '#10B981' : '#1F2937'}; margin: 0 0 4px 0;">${formatCurrency(store.price, currency)}</p>
          <a href="${store.link}" style="font-size: 14px; color: #2563EB; text-decoration: none;">Go to Store →</a>
        </div>
      </div>
    `;
  });
  
  // Create the HTML template with BoperCheck branding
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>BoperCheck Price Analysis: ${itemName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #10B981;
          margin-bottom: 5px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 18px;
          color: #6B7280;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #111827;
        }
        .price-highlight {
          display: flex;
          justify-content: space-between;
          background: linear-gradient(to right, #EFF6FF, #F5F3FF);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .price-box {
          text-align: center;
          padding: 15px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          width: 30%;
        }
        .price-label {
          font-size: 12px;
          color: #6B7280;
        }
        .price-value {
          font-size: 20px;
          font-weight: bold;
          color: #111827;
        }
        .price-value.highlight {
          color: #10B981;
        }
        .deal-badge {
          display: inline-block;
          padding: 5px 10px;
          background-color: #10B981;
          color: white;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: bold;
        }
        .analysis {
          background-color: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #6B7280;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BoperCheck</div>
          <div class="title">Price Analysis Report</div>
          <div class="subtitle">Results for: ${itemName}</div>
          <div>Date: ${date}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Deal Summary</div>
          <div class="price-highlight">
            <div>
              <h3 style="margin: 0 0 10px 0;">Deal Rating</h3>
              <div style="margin-bottom: 10px;">
                ${starsHtml}
              </div>
              <span class="deal-badge">${dealLabel}</span>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 28px; font-weight: bold; color: #10B981;">${formatCurrency(lowestPrice, currency)}</div>
              <div style="font-size: 14px; color: #6B7280;">Lowest price available</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div class="price-box">
              <div style="font-size: 14px; color: #3B82F6; margin-bottom: 5px;">Market Value</div>
              <div class="price-value">${formatCurrency(marketValue, currency)}</div>
            </div>
            
            <div class="price-box">
              <div style="font-size: 14px; color: #8B5CF6; margin-bottom: 5px;">Average Price</div>
              <div class="price-value">${formatCurrency(averagePrice, currency)}</div>
            </div>
            
            <div class="price-box">
              <div style="font-size: 14px; color: #10B981; margin-bottom: 5px;">Potential Savings</div>
              <div class="price-value highlight">Save ${savingsPercent}%</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Price Analysis</div>
          <div class="analysis">
            <p>${analysis}</p>
            <div style="margin-top: 10px;">
              <span style="background-color: #DBEAFE; color: #1E40AF; font-size: 12px; padding: 5px 10px; border-radius: 9999px;">
                Price Range: ${formatCurrency(priceRange.min, currency)} - ${formatCurrency(priceRange.max, currency)}
              </span>
            </div>
          </div>
        </div>
        
        ${installation ? `
        <div class="section">
          <div class="section-title">Installation & Fitting</div>
          <div style="background-color: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1; min-width: 180px; background-color: #EFF6FF; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #1F2937;">${installation.averageCost ? formatCurrency(installation.averageCost, currency) : 'Contact for quote'}</div>
                <div style="font-size: 12px; color: #6B7280;">Average Installation Cost</div>
              </div>
              
              <div style="flex: 1; min-width: 180px; background-color: #F5F3FF; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #1F2937;">${installation.costRange ? `${formatCurrency(installation.costRange.min, currency)} - ${formatCurrency(installation.costRange.max, currency)}` : 'Contact for quote'}</div>
                <div style="font-size: 12px; color: #6B7280;">Price Range</div>
              </div>
              
              <div style="flex: 1; min-width: 180px; background-color: #ECFDF5; padding: 16px; border-radius: 8px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #1F2937;">${installation.timeEstimate || 'TBA'}</div>
                <div style="font-size: 12px; color: #6B7280;">Time Estimate</div>
              </div>
            </div>
            
            <div>
              <div style="margin-bottom: 8px;">
                <span style="font-weight: 600;">Difficulty Level:</span>
                <span style="
                  display: inline-block;
                  margin-left: 8px;
                  padding: 2px 8px;
                  border-radius: 9999px;
                  font-size: 12px;
                  background-color: ${
                    (installation.difficultyLevel || '').toLowerCase().includes('easy') ? '#DCFCE7' : 
                    (installation.difficultyLevel || '').toLowerCase().includes('moderate') ? '#FEF9C3' :
                    (installation.difficultyLevel || '').toLowerCase().includes('difficult') ? '#FFEDD5' :
                    '#FEE2E2'
                  };
                  color: ${
                    (installation.difficultyLevel || '').toLowerCase().includes('easy') ? '#166534' : 
                    (installation.difficultyLevel || '').toLowerCase().includes('moderate') ? '#854D0E' :
                    (installation.difficultyLevel || '').toLowerCase().includes('difficult') ? '#9A3412' :
                    '#B91C1C'
                  };
                ">${installation.difficultyLevel || 'Unknown'}</span>
              </div>
              <p style="color: #4B5563; margin: 0;">${installation.notes || ''}</p>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Where to Buy</div>
          ${localBusinessCount > 0 ? `
            <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
              <p style="color: #065F46; font-weight: 500; margin: 0;">
                <span style="font-weight: 700;">✓ ${localBusinessCount} local ${localBusinessCount === 1 ? 'business' : 'businesses'} found</span> 
                in your area that can help with this project
              </p>
            </div>
          ` : ''}
          ${storesHtml}
        </div>
        
        ${localBusinesses && localBusinesses.length > 0 ? `
        <div class="section">
          <div class="section-title">Local Business Recommendations</div>
          
          <div style="margin-bottom: 16px;">
            ${localBusinesses.map((business: any, index: number) => `
              <div style="
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                background-color: #F9FAFB;
              ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <h4 style="font-weight: 700; color: #1F2937; margin: 0;">${business.name}</h4>
                  <div style="display: flex; gap: 8px;">
                    ${business.rating ? `
                      <span style="
                        display: flex;
                        align-items: center;
                        background-color: #FEF3C7;
                        color: #92400E;
                        font-size: 12px;
                        padding: 2px 8px;
                        border-radius: 9999px;
                        font-weight: 500;
                      ">★ ${business.rating.toFixed(1)}</span>
                    ` : ''}
                    <span style="
                      font-size: 12px;
                      padding: 2px 8px;
                      border-radius: 9999px;
                      background-color: ${
                        (business.serviceType || '').toLowerCase().includes('both') ? '#F3E8FF' :
                        (business.serviceType || '').toLowerCase().includes('installer') ? '#DBEAFE' :
                        '#FEF3C7'
                      };
                      color: ${
                        (business.serviceType || '').toLowerCase().includes('both') ? '#6B21A8' :
                        (business.serviceType || '').toLowerCase().includes('installer') ? '#1E40AF' :
                        '#92400E'
                      };
                      font-weight: 500;
                    ">
                      ${business.serviceType}
                    </span>
                  </div>
                </div>
                
                <div style="margin-bottom: 8px; display: flex; align-items: start;">
                  <span style="color: #6B7280; margin-right: 4px;">📍</span>
                  <span style="font-size: 14px; color: #4B5563;">${business.location} ${business.distance ? `(${business.distance})` : ''}</span>
                </div>
                
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px 0;">${business.notes}</p>
                
                <div style="font-size: 14px; color: #2563EB;">
                  ${business.contactInfo}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="font-style: italic; font-size: 12px; color: #6B7280;">
            Local business data is provided as a convenience only. We recommend contacting businesses directly to confirm availability, pricing, and services.
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title" style="display: flex; align-items: center;">
            <span style="background-color: #FEF3C7; color: #92400E; font-size: 12px; padding: 3px 8px; border-radius: 4px; margin-left: 10px;">
              FEATURED
            </span>
          </div>
          <div style="border: 2px solid #FEF3C7; border-radius: 12px; padding: 16px; margin-top: 8px; background-color: #FFFBEB;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-weight: 700; color: #1F2937; margin: 0 0 8px 0;">Want your business featured here?</h4>
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px 0;">
                  Join our business partner program and get featured when users search for products like this one in your area.
                </p>
                <a href="https://bopercheck.com/business" style="
                  display: inline-block;
                  background-color: #10B981;
                  color: white;
                  padding: 6px 12px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: 500;
                  font-size: 14px;
                ">Learn More →</a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This price analysis was generated by BoperCheck.com</p>
          <p>For more information and to check prices on other items, visit <a href="https://bopercheck.com" style="color: #10B981; text-decoration: none;">bopercheck.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a Blob and generate download link
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create link and download file
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', `bopercheck-price-analysis-${Date.now()}.html`);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

export function getDealBadgeColor(rating: number | string): string {
  // Handle string ratings from API
  if (typeof rating === 'string') {
    const ratingLower = rating.toLowerCase();
    if (ratingLower.includes('excellent')) return "deal-excellent";
    if (ratingLower.includes('good')) return "deal-good";
    if (ratingLower.includes('fair') || ratingLower.includes('average')) return "deal-fair";
    return "deal-poor";
  }
  
  // Handle numeric ratings
  if (rating >= 4.5) return "deal-excellent";
  if (rating >= 3.5) return "deal-good";
  if (rating >= 2.5) return "deal-fair";
  return "deal-poor";
}

export function getDealLabel(rating: number | string): string {
  // Handle string ratings from API
  if (typeof rating === 'string') {
    const ratingLower = rating.toLowerCase();
    if (ratingLower.includes('excellent')) return "Excellent Deal";
    if (ratingLower.includes('good')) return "Good Deal";
    if (ratingLower.includes('fair') || ratingLower.includes('average')) return "Fair Deal";
    return "Poor Deal";
  }
  
  // Handle numeric ratings
  if (rating >= 4.5) return "Excellent Deal";
  if (rating >= 3.5) return "Good Deal";
  if (rating >= 2.5) return "Fair Deal";
  if (rating >= 1.5) return "Below Average";
  return "Poor Deal";
}

export function convertRatingToNumber(rating: string | number): number {
  if (typeof rating === 'number') return rating;
  
  const ratingLower = rating.toLowerCase();
  if (ratingLower.includes('excellent')) return 5.0;
  if (ratingLower.includes('good')) return 4.0;
  if (ratingLower.includes('fair') || ratingLower.includes('average')) return 3.0;
  if (ratingLower.includes('poor') || ratingLower.includes('below')) return 2.0;
  return 2.5; // Default to fair
}
