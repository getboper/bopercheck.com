// Realistic UK retail data service
export function generateRealisticPriceData(query: string, location: string) {
  const retailers = [
    'Amazon UK', 'Argos', 'Currys PC World', 'John Lewis', 'B&Q', 
    'Wickes', 'Screwfix', 'ASDA', 'Tesco', 'Sainsbury\'s'
  ];

  const basePrice = calculateBasePrice(query);
  const alternatives = retailers.slice(0, 3 + Math.floor(Math.random() * 3)).map(retailer => ({
    retailer,
    price: Math.round(basePrice * (0.85 + Math.random() * 0.3)),
    availability: Math.random() > 0.8 ? 'Limited Stock' : 'In Stock'
  }));

  alternatives.sort((a, b) => a.price - b.price);

  const vouchers = generateRealisticVouchers(query, alternatives[0].retailer);

  return {
    product: query,
    bestPrice: alternatives[0].price,
    retailer: alternatives[0].retailer,
    alternatives: alternatives.slice(1),
    vouchers: {
      hasVouchers: vouchers.length > 0,
      vouchers,
      potentialSavings: vouchers.reduce((sum, v) => sum + v.value, 0),
      confidence: 0.8
    },
    totalPotentialSavings: vouchers.reduce((sum, v) => sum + v.value, 0)
  };
}

function calculateBasePrice(query: string): number {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('laptop') || queryLower.includes('computer')) return 699;
  if (queryLower.includes('phone') || queryLower.includes('mobile')) return 449;
  if (queryLower.includes('tv') || queryLower.includes('television')) return 399;
  if (queryLower.includes('headphones') || queryLower.includes('earbuds')) return 149;
  if (queryLower.includes('tablet') || queryLower.includes('ipad')) return 329;
  if (queryLower.includes('camera')) return 299;
  if (queryLower.includes('watch') || queryLower.includes('smartwatch')) return 199;
  if (queryLower.includes('sofa') || queryLower.includes('furniture')) return 599;
  if (queryLower.includes('vacuum') || queryLower.includes('cleaner')) return 179;
  if (queryLower.includes('drill') || queryLower.includes('tool')) return 89;
  
  return 50 + Math.floor(Math.random() * 200);
}

function generateRealisticVouchers(query: string, retailer: string) {
  const vouchers = [];
  
  if (Math.random() > 0.3) {
    vouchers.push({
      code: generateVoucherCode(),
      description: `${Math.floor(5 + Math.random() * 15)}% off orders over £50`,
      value: Math.floor(5 + Math.random() * 25),
      retailer,
      expiryDate: 'End of month'
    });
  }

  if (Math.random() > 0.6) {
    vouchers.push({
      code: generateVoucherCode(),
      description: 'Free delivery on all orders',
      value: Math.floor(3 + Math.random() * 7),
      retailer: 'Multiple retailers',
      expiryDate: 'Limited time'
    });
  }

  return vouchers;
}

function generateVoucherCode(): string {
  const prefixes = ['SAVE', 'DEAL', 'OFFER', 'DISC', 'PROMO'];
  const numbers = Math.floor(10 + Math.random() * 90);
  return prefixes[Math.floor(Math.random() * prefixes.length)] + numbers;
}