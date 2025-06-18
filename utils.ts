/**
 * Server-side utility functions for BoperCheck
 */

/**
 * Generates a random referral code of 8 characters
 * Format: 4 uppercase letters + 4 numbers
 */
export function generateReferralCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  // Add 4 random letters
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10);
  }
  
  return code;
}

/**
 * Format price to display with correct currency symbol and decimals
 */
export function formatPrice(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Calculate deal rating (1-5) based on market price vs lowest found price
 */
export function calculateDealRating(marketPrice: number, lowestPrice: number): number {
  if (marketPrice <= 0 || lowestPrice <= 0) return 3; // Default to average
  
  const savingsPercentage = (marketPrice - lowestPrice) / marketPrice * 100;
  
  if (savingsPercentage >= 30) return 5; // Excellent deal
  if (savingsPercentage >= 20) return 4; // Good deal  
  if (savingsPercentage >= 10) return 3; // Fair deal
  if (savingsPercentage >= 5) return 2; // Not great deal
  return 1; // Poor deal
}

/**
 * Get deal description based on rating
 */
export function getDealDescription(rating: number): string {
  switch(rating) {
    case 5: return "Excellent Deal!";
    case 4: return "Good Deal";
    case 3: return "Fair Price";
    case 2: return "Could Be Better";
    case 1: return "Not A Good Deal";
    default: return "Price Check";
  }
}