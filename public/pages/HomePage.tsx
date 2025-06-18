import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import SimplePriceCheckForm from "@/components/price-checker/SimplePriceCheckForm";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import { FeaturedBusiness } from "@/components/home/FeaturedBusiness";
import SocialProof from "@/components/SocialProof";
import ViralFeatures from "@/components/ViralFeatures";
import { useEffect } from "react";
import { trackPageView } from "@/lib/tiktokPixel";

const HomePage = () => {
  useEffect(() => {
    // Track homepage view in TikTok Pixel
    trackPageView('homepage');
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>BoperCheck | Free AI Price Comparison - Find Best Local Deals Instantly</title>
        <meta name="description" content="Free unlimited price checks with AI. Compare prices from local suppliers instantly. Get the best deals on home improvement, retail & services. No signup required." />
        <link rel="canonical" href="https://bopercheck.com" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="price comparison, local suppliers, AI price check, best prices, home improvement, free price search" />
      </Helmet>

      <Hero />
      <SimplePriceCheckForm />
      
      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Thousands of Smart Savers
            </h2>
            <p className="text-xl text-gray-600">
              Real people, real savings, real results
            </p>
          </div>
          <SocialProof />
        </div>
      </section>

      <HowItWorks />
      <FeaturedBusiness />
      
      {/* Viral Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Earn While You Save
            </h2>
            <p className="text-xl text-gray-600">
              Join our rewards program and turn saving into earning
            </p>
          </div>
          <ViralFeatures />
        </div>
      </section>
      
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
};

export default HomePage;