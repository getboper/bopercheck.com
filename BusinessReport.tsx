import React, { useState } from 'react';
import { CheckCircle, TrendingUp, Users, MapPin, Mail, Phone, Building } from 'lucide-react';

const BusinessReport = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    businessType: '',
    location: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/business/signup-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          businessType: formData.businessType,
          location: formData.location,
          website: formData.website,
          source: 'email_outreach'
        }),
      });

      if (response.ok) {
        setSubmitMessage("Success! We'll email your free business visibility report within 24 hours.");
        
        // Reset form
        setFormData({
          businessName: '',
          contactEmail: '',
          contactPhone: '',
          businessType: '',
          location: '',
          website: ''
        });
      } else {
        throw new Error('Failed to submit report request');
      }
    } catch (error) {
      setSubmitMessage("Submission failed. Please try again or contact support@bopercheck.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">BoperCheck</h1>
              <span className="ml-3 text-sm text-gray-500">Business Discovery Platform</span>
            </div>
            <div className="text-sm text-gray-600">
              Trusted by 1,000+ UK businesses
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Free Business Visibility Report
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how many customers are searching for your services, your local ranking, and get actionable insights to increase your visibility - completely free.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search Volume Analysis</h3>
            <p className="text-gray-600">See exactly how many people search for your services in your area each month</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Ranking Position</h3>
            <p className="text-gray-600">Find out where you rank compared to competitors in local search results</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Customer Reach Insights</h3>
            <p className="text-gray-600">Understand your potential customer reach and missed opportunities</p>
          </div>
        </div>

        {/* Why BoperCheck is Different */}
        <div className="mb-12 border border-yellow-200 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">Why Choose BoperCheck Over Other Platforms?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">No Commission Fees</h4>
              <p className="text-yellow-700">Unlike other platforms that take 10-20% commission on every job, BoperCheck connects you directly with customers at no cost.</p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">No Hidden Costs</h4>
              <p className="text-yellow-700">No setup fees, no lead fees, no monthly charges. Your free report shows exactly what you get with no surprises.</p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Real Customer Data</h4>
              <p className="text-yellow-700">Our reports use authentic search data from real customers actively looking for your services right now.</p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Local Focus</h4>
              <p className="text-yellow-700">Specifically designed for UK businesses to connect with local customers in their service area.</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Get Your Free Report
            </h2>
            <p className="text-gray-600 mt-2">
              Fill in your business details below and we'll email your comprehensive visibility report within 24 hours.
            </p>
          </div>
          <div className="p-6">
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Business Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                  <input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    placeholder="e.g. Plumber, Electrician, Window Cleaner"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address *
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="01234 567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Service Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bristol, Devon, London"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website (if you have one)</label>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.co.uk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">What happens next?</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• We'll analyze your business visibility within 24 hours</li>
                      <li>• You'll receive a detailed report via email</li>
                      <li>• The report includes actionable recommendations</li>
                      <li>• No payment details required - completely free</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 px-6 rounded-md disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Get My Free Business Report'}
              </button>

              <p className="text-center text-sm text-gray-500">
                By submitting this form, you agree to receive your free business report via email. 
                We respect your privacy and will never share your details.
              </p>
            </form>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Trusted by businesses across the UK</p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>✓ 100% Free</span>
            <span>✓ No Spam</span>
            <span>✓ UK Based</span>
            <span>✓ GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReport;