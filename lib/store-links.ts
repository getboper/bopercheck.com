// Store URL utilities for authentic retailer links

export const STORE_LINKS = {
  'Amazon UK': 'https://amazon.co.uk',
  'Currys PC World': 'https://currys.co.uk',
  'Argos': 'https://argos.co.uk',
  'B&Q': 'https://diy.com',
  'Wickes': 'https://wickes.co.uk',
  'Homebase': 'https://homebase.co.uk',
  'IKEA': 'https://ikea.com/gb',
  'Wayfair': 'https://wayfair.co.uk',
  'John Lewis': 'https://johnlewis.com'
} as const;

export function getStoreLink(storeName: string, productQuery?: string): string {
  const baseUrl = STORE_LINKS[storeName as keyof typeof STORE_LINKS];
  
  if (!baseUrl) {
    // For local stores, generate Google search
    if (storeName.includes('Local')) {
      const searchQuery = encodeURIComponent(`${storeName} ${productQuery || ''}`);
      return `https://google.com/search?q=${searchQuery}`;
    }
    return '#';
  }
  
  return baseUrl;
}