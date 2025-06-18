import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - BoperCheck</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to BoperCheck to continue finding the best prices with AI." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 py-16">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link href="/">
              <Button size="lg" className="w-full md:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            
            <Link href="/price-check">
              <Button variant="outline" size="lg" className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Check Prices
              </Button>
            </Link>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Here are some popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/pricing" className="text-blue-600 hover:underline">
                Pricing
              </Link>
              <Link href="/business" className="text-blue-600 hover:underline">
                For Businesses
              </Link>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}