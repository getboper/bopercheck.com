import React from 'react';
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SuccessStories from "@/components/viral/SuccessStories";
import SocialProofWidget from "@/components/viral/SocialProofWidget";
import { SocialFollowButtons } from "@/components/social/TikTokIntegration";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "wouter";

const SuccessStoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Success Stories | BoperCheck - Real Customer Savings</title>
        <meta name="description" content="Read inspiring success stories from BoperCheck users who saved thousands on home improvement, electronics, and more. Join our community of smart savers." />
        <meta property="og:title" content="Success Stories | BoperCheck - Real Customer Savings" />
        <meta property="og:description" content="Discover how BoperCheck users are saving money every day. Real stories, real savings, real results." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Social Proof Widget */}
        <SocialProofWidget />

        {/* Success Stories */}
        <SuccessStories />

        {/* Call to Action */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Success Story?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of smart savers who use BoperCheck to find the best local deals. 
                Your next big saving is just one search away!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Start Saving Now
                  </Button>
                </Link>
                <SocialFollowButtons className="justify-center" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;