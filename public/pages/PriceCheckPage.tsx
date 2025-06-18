import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import SimplePriceCheckForm from "@/components/price-checker/SimplePriceCheckForm";
import { Helmet } from "react-helmet";

const PriceCheckPage = () => {
  const [location] = useLocation();
  const [item, setItem] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.split("?")[1]);
    const itemParam = params.get("item");
    const categoryParam = params.get("category");
    
    if (itemParam) setItem(itemParam);
    if (categoryParam) setCategory(categoryParam);
  }, [location]);

  return (
    <>
      <Helmet>
        <title>AI Price Check Tool | Compare Prices Instantly - BoperCheck</title>
        <meta name="description" content="Use our AI-powered price checker to find the best deals on any item or service. Get instant market analysis and save money on your purchases." />
        <link rel="canonical" href="https://bopercheck.com/price-check" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bopercheck.com/price-check" />
        <meta property="og:title" content="AI Price Check Tool | Compare Prices Instantly - BoperCheck" />
        <meta property="og:description" content="Use our AI-powered price checker to find the best deals on any item or service. Get instant market analysis and save money on your purchases." />
        <meta property="og:image" content="https://bopercheck.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Price Check Tool | Compare Prices Instantly - BoperCheck" />
        <meta name="twitter:description" content="Use our AI-powered price checker to find the best deals on any item or service. Get instant market analysis and save money on your purchases." />
        <meta name="twitter:image" content="https://bopercheck.com/og-image.jpg" />
      </Helmet>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Check Any Price</h1>
            <p className="text-muted-foreground">
              Get instant AI-powered price analysis to help you make informed decisions and save money
            </p>
          </div>
          
          <SimplePriceCheckForm initialItem={item} />
        </div>
      </section>
    </>
  );
};

export default PriceCheckPage;
