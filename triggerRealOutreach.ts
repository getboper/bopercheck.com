import { publicBusinessOutreach } from './publicBusinessOutreach';

// Trigger real business discovery using Google Places API
async function discoverRealBusinesses() {
  console.log('Starting real business discovery with Google Places API...');
  
  // High-demand service categories for immediate outreach
  const categories = ['plumber', 'electrician', 'kitchen installation', 'bathroom installation', 'heating engineer'];
  const locations = ['Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Newcastle'];
  
  let totalDiscovered = 0;
  
  for (const location of locations) {
    for (const category of categories) {
      try {
        console.log(`Discovering ${category} businesses in ${location}...`);
        const result = await publicBusinessOutreach.discoverAndContactBusinesses(location, category, 3);
        console.log(`${location} ${category}: ${result.contacted} businesses contacted, ${result.failed} failed`);
        totalDiscovered += result.contacted;
        
        // Rate limiting - wait 2 seconds between API calls
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error discovering ${category} in ${location}:`, error);
      }
    }
  }
  
  console.log(`Total real businesses discovered and contacted: ${totalDiscovered}`);
  return totalDiscovered;
}

// Execute the discovery
discoverRealBusinesses().catch(console.error);