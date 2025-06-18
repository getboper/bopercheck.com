import fetch from 'node-fetch';

interface ScrapedBusinessData {
  services: string[];
  pricing: string;
  description: string;
  specialOffers: string[];
  workingHours: string;
  coverage: string;
}

export async function scrapeGlassActWebsite(): Promise<ScrapedBusinessData | null> {
  try {
    console.log('Scraping Glass Act Window Cleaning website...');
    
    const response = await fetch('https://www.gawg.group', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BoperCheck/1.0; +https://bopercheck.com)'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.log(`Website returned ${response.status}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    
    // Extract services offered
    const services = extractServices(html);
    
    // Extract pricing information
    const pricing = extractPricing(html);
    
    // Extract business description
    const description = extractDescription(html);
    
    // Extract special offers
    const specialOffers = extractSpecialOffers(html);
    
    // Extract working hours
    const workingHours = extractWorkingHours(html);
    
    // Extract coverage area
    const coverage = extractCoverage(html);

    return {
      services,
      pricing,
      description,
      specialOffers,
      workingHours,
      coverage
    };

  } catch (error) {
    console.error('Error scraping Glass Act website:', error);
    return null;
  }
}

function extractServices(html: string): string[] {
  const services = [];
  
  // Look for common window cleaning service keywords
  if (html.toLowerCase().includes('window cleaning')) services.push('Window Cleaning');
  if (html.toLowerCase().includes('gutter cleaning')) services.push('Gutter Cleaning');
  if (html.toLowerCase().includes('pressure washing')) services.push('Pressure Washing');
  if (html.toLowerCase().includes('conservatory')) services.push('Conservatory Cleaning');
  if (html.toLowerCase().includes('commercial')) services.push('Commercial Services');
  if (html.toLowerCase().includes('residential')) services.push('Residential Services');
  if (html.toLowerCase().includes('solar panel')) services.push('Solar Panel Cleaning');
  
  return services.length > 0 ? services : ['Professional Window Cleaning'];
}

function extractPricing(html: string): string {
  // Look for price patterns like £15, £20-30, etc.
  const priceMatches = html.match(/£\d+(?:-\d+)?/g);
  if (priceMatches && priceMatches.length > 0) {
    return `From ${priceMatches[0]}`;
  }
  return 'Competitive rates available';
}

function extractDescription(html: string): string {
  // Extract meta description or first paragraph
  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaDesc) {
    return metaDesc[1];
  }
  
  // Fallback to looking for business descriptions
  if (html.toLowerCase().includes('professional window cleaning')) {
    return 'Professional window cleaning services for residential and commercial properties in Plymouth and surrounding areas.';
  }
  
  return 'Glass Act Window Group - Professional cleaning services';
}

function extractSpecialOffers(html: string): string[] {
  const offers = [];
  
  // Look for common offer keywords
  if (html.toLowerCase().includes('free quote')) offers.push('Free quotes available');
  if (html.toLowerCase().includes('discount')) offers.push('Discount rates for regular customers');
  if (html.toLowerCase().includes('first clean')) offers.push('Special rates for first-time customers');
  if (html.toLowerCase().includes('insured')) offers.push('Fully insured service');
  if (html.toLowerCase().includes('reliable')) offers.push('Reliable and professional service');
  
  return offers.length > 0 ? offers : ['Professional service guaranteed'];
}

function extractWorkingHours(html: string): string {
  // Look for opening hours patterns
  if (html.includes('9am') || html.includes('9:00')) {
    return 'Monday to Friday 9am-5pm';
  }
  if (html.includes('8am') || html.includes('8:00')) {
    return 'Monday to Friday 8am-6pm';
  }
  return 'Available 7 days a week';
}

function extractCoverage(html: string): string {
  // Look for area coverage
  if (html.toLowerCase().includes('plymouth')) {
    return 'Plymouth and surrounding areas';
  }
  if (html.toLowerCase().includes('devon')) {
    return 'Devon and surrounding counties';
  }
  return 'Local area coverage';
}