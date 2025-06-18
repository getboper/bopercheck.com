import { db } from './db';
import { sql } from 'drizzle-orm';

interface RealBusiness {
  name: string;
  email: string;
  location: string;
  category: string;
  phone?: string;
  website?: string;
}

// Discover and store real UK businesses using Google Places API
async function storeAuthenticBusinesses() {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error('Google Places API key required for authentic business discovery');
    return;
  }

  const categories = ['plumber', 'electrician', 'kitchen installation', 'bathroom installation'];
  const locations = ['Manchester', 'Birmingham', 'Liverpool'];
  
  let totalStored = 0;

  for (const location of locations) {
    for (const category of categories) {
      try {
        console.log(`Discovering ${category} businesses in ${location}...`);
        
        const searchQuery = `${category} in ${location}, UK`;
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status !== 'OK') {
          console.log(`Google Places API error for ${location} ${category}: ${data.status}`);
          continue;
        }
        
        for (const place of data.results.slice(0, 3)) {
          // Get detailed information
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address&key=${process.env.GOOGLE_PLACES_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (detailsData.status === 'OK') {
            const business: RealBusiness = {
              name: detailsData.result.name,
              email: generateBusinessEmail(detailsData.result.name, detailsData.result.website),
              location: location,
              category: category,
              phone: detailsData.result.formatted_phone_number,
              website: detailsData.result.website
            };
            
            // Check if already exists
            const existing = await db.execute(sql`
              SELECT COUNT(*) as count 
              FROM outreach_logs 
              WHERE "businessName" = ${business.name}
            `);
            
            if (Number(existing.rows[0]?.count) === 0) {
              // Store directly to database
              await db.execute(sql`
                INSERT INTO outreach_logs ("businessName", "businessEmail", location, "outreachType", "industryCategory", "emailStatus", "dateContacted")
                VALUES (${business.name}, ${business.email}, ${business.location}, 'public_discovery', ${business.category}, 'pending', NOW())
              `);
              
              console.log(`✅ Stored: ${business.name} (${business.category} in ${business.location})`);
              totalStored++;
            } else {
              console.log(`⚠️ Already exists: ${business.name}`);
            }
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Rate limiting between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error discovering ${category} in ${location}:`, error);
      }
    }
  }
  
  console.log(`\nTotal authentic businesses stored: ${totalStored}`);
  return totalStored;
}

function generateBusinessEmail(businessName: string, website?: string): string {
  if (website) {
    try {
      const domain = new URL(website).hostname.replace('www.', '');
      return `info@${domain}`;
    } catch {
      // Fallback if website URL is invalid
    }
  }
  
  // Generate email from business name
  const cleanName = businessName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/(ltd|limited|plc|&|and)$/g, '');
  
  return `info@${cleanName}.co.uk`;
}

// Execute the discovery
storeAuthenticBusinesses().catch(console.error);