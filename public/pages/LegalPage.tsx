import React from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";

export default function LegalPage() {
  const [location] = useLocation();
  const pageName = location.includes("terms") 
    ? "Terms of Service" 
    : location.includes("privacy") 
      ? "Privacy Policy" 
      : "Cookie Policy";

  return (
    <>
      <Helmet>
        <title>{pageName} | BoperCheck</title>
        <meta name="description" content={`BoperCheck ${pageName}: Learn about how we handle your data and the terms of using our AI-powered price checking service.`} />
      </Helmet>
      
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">{pageName}</h1>
        
        {pageName === "Terms of Service" && (
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: May 23, 2025
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to BoperCheck ("we," "our," or "us"). These Terms of Service govern your use of the BoperCheck 
              website, mobile applications, and services (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part 
              of the terms, you may not access the Service.
            </p>
            
            <h2>2. Use of Service</h2>
            <p>
              BoperCheck provides an AI-powered price checking service for various products and services. You may use 
              our Service to:
            </p>
            <ul>
              <li>Submit product or service descriptions for price analysis</li>
              <li>Upload images of products for identification and price analysis</li>
              <li>Receive comparative price information from various sources</li>
              <li>Save and share price check results</li>
              <li>If you are a business, advertise your products or services to users</li>
            </ul>
            
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are responsible 
              for safeguarding the password you use to access the Service and for any activities under your account.
            </p>
            <p>
              We reserve the right to disable any user account if, in our opinion, you have violated any provision of these Terms.
            </p>
            
            <h2>4. Credits and Payments</h2>
            <p>
              Our Service operates on a credit-based system. New users receive one free credit upon registration. Additional 
              credits may be purchased through our platform.
            </p>
            <p>
              All payments are processed through our secure payment processor, Stripe. By making a purchase, you agree to 
              Stripe's terms of service and privacy policy.
            </p>
            <p>
              All sales are final. We do not offer refunds for purchased credits, except where required by applicable law.
            </p>
            
            <h2>5. User Content</h2>
            <p>
              You retain ownership of any content you submit to our Service, including product descriptions and images. 
              By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
              and display such content for the purpose of providing and improving our Service.
            </p>
            <p>
              You agree not to submit content that violates any third-party rights or any applicable laws.
            </p>
            
            <h2>6. Business Listings</h2>
            <p>
              Businesses may create listings and advertise on our platform. By creating a business listing, you represent 
              that you have the authority to act on behalf of that business and that all information provided is accurate 
              and not misleading.
            </p>
            <p>
              We reserve the right to remove any business listing at our sole discretion.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, BoperCheck shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to use the Service.
            </p>
            <p>
              The price information provided by our Service is for informational purposes only. We do not guarantee the 
              accuracy of prices, and users should verify all information before making purchasing decisions.
            </p>
            
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by 
              posting the updated Terms on this page. Your continued use of the Service after any changes indicates 
              your acceptance of the modified Terms.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@bopercheck.com.
            </p>
          </div>
        )}
        
        {pageName === "Privacy Policy" && (
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: May 23, 2025
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              At BoperCheck, we take your privacy seriously. This Privacy Policy explains how we collect, use, and 
              share information about you when you use our website, mobile applications, and services (collectively, the "Service").
            </p>
            
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <p>We collect information you provide when you:</p>
            <ul>
              <li>Create an account (email, username, password)</li>
              <li>Complete your profile (name, location)</li>
              <li>Submit price check requests (product descriptions, images)</li>
              <li>Make purchases (billing information)</li>
              <li>Create business listings (company details, contact information)</li>
              <li>Communicate with us (support requests, feedback)</li>
            </ul>
            
            <h3>2.2 Automatically Collected Information</h3>
            <p>When you use our Service, we automatically collect:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Location information (city and region, with your consent)</li>
              <li>Cookies and similar technologies (as explained in our Cookie Policy)</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and manage your account</li>
              <li>Generate price analyses and recommendations</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our Service</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against fraudulent or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who help us operate our business</li>
              <li>Business partners, with your consent</li>
              <li>Legal authorities, when required by law</li>
              <li>Other parties in connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2>5. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@bopercheck.com.
            </p>
            
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.
            </p>
            
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide you with our Service and 
              comply with legal obligations. When we no longer need your data, we will securely delete or anonymize it.
            </p>
            
            <h2>8. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure adequate safeguards are in place to protect your information when transferred internationally.
            </p>
            
            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 16. We do not knowingly collect information from children 
              under 16. If you believe a child has provided us with personal information, please contact us.
            </p>
            
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              updated policy on our website with a new effective date.
            </p>
            
            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@bopercheck.com.
            </p>
          </div>
        )}
        
        {pageName === "Cookie Policy" && (
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: May 23, 2025
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              This Cookie Policy explains how BoperCheck ("we," "our," or "us") uses cookies and similar technologies 
              on our website and mobile applications (collectively, the "Service").
            </p>
            
            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They are widely 
              used to make websites work more efficiently and provide information to website owners.
            </p>
            
            <h2>3. Types of Cookies We Use</h2>
            
            <h3>3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the Service to function properly. They enable core functionality such 
              as security, network management, and account authentication. You cannot opt out of these cookies.
            </p>
            
            <h3>3.2 Performance Cookies</h3>
            <p>
              These cookies collect information about how you use our Service, such as which pages you visit most often 
              and if you encounter any errors. This data helps us improve our Service's performance.
            </p>
            
            <h3>3.3 Functionality Cookies</h3>
            <p>
              These cookies allow our Service to remember choices you make (such as your preferred language or region) 
              and provide enhanced, personalized features.
            </p>
            
            <h3>3.4 Targeting/Advertising Cookies</h3>
            <p>
              These cookies help us deliver relevant advertisements to you based on your interests and browsing activity.
            </p>
            
            <h2>4. Third-Party Cookies</h2>
            <p>
              We use third-party services that may set cookies on your device when you use our Service. These include:
            </p>
            <ul>
              <li>Google Analytics (for website analytics)</li>
              <li>Stripe (for payment processing)</li>
              <li>Firebase (for authentication and data storage)</li>
            </ul>
            
            <h2>5. Managing Cookies</h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies 
              or delete certain cookies. However, if you disable cookies, you may not be able to use all the features of our Service.
            </p>
            <p>
              Here are links to instructions for managing cookies in common browsers:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            
            <h2>6. Do Not Track</h2>
            <p>
              Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your 
              online activities tracked. Our Service does not currently respond to "Do Not Track" signals.
            </p>
            
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the 
              updated policy on our website with a new effective date.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this Cookie Policy, please contact us at support@bopercheck.com.
            </p>
          </div>
        )}
      </div>
    </>
  );
}