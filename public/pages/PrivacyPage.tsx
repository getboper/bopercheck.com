import { Helmet } from "react-helmet";

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - BoperCheck</title>
        <meta name="description" content="BoperCheck's privacy policy explains how we collect, use, and protect your personal information when using our AI price analysis service." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
          <p className="text-muted-foreground text-center mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="gradient-bg h-3"></div>
            <div className="p-8">
              <div className="prose prose-slate max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  At BoperCheck, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, and tell you about your privacy rights and how the law protects you.
                </p>
                <p>
                  Please read this privacy policy carefully before using our services.
                </p>
                
                <h2>2. The Data We Collect</h2>
                <p>
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul>
                  <li>
                    <strong>Identity Data</strong> includes username, email address, and any other information you provide when creating an account.
                  </li>
                  <li>
                    <strong>Financial Data</strong> includes payment information. Note that we do not store your full credit card details; these are processed securely by our payment processors.
                  </li>
                  <li>
                    <strong>Transaction Data</strong> includes details about payments to and from you and details of services you have purchased from us.
                  </li>
                  <li>
                    <strong>Usage Data</strong> includes information about how you use our website and services, including price check queries and results.
                  </li>
                  <li>
                    <strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, device information, and other technology identifiers from the devices you use to access this website.
                  </li>
                </ul>
                
                <h2>3. How We Use Your Data</h2>
                <p>
                  We use your data for the following purposes:
                </p>
                <ul>
                  <li>To create and manage your account</li>
                  <li>To provide the price check service</li>
                  <li>To process payments and manage credits</li>
                  <li>To improve our AI models and service quality</li>
                  <li>To communicate with you about your account and service updates</li>
                  <li>To provide customer support</li>
                </ul>
                
                <h2>4. Data Security</h2>
                <p>
                  We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. These measures include:
                </p>
                <ul>
                  <li>Encryption of sensitive data</li>
                  <li>Secure user authentication</li>
                  <li>Regular security assessments</li>
                  <li>Limited access to personal information</li>
                </ul>
                
                <h2>5. Data Retention</h2>
                <p>
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
                <p>
                  For user accounts, we retain your data as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we need to retain certain information for legal or legitimate business purposes.
                </p>
                
                <h2>6. Your Legal Rights</h2>
                <p>
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul>
                  <li>The right to access your personal data</li>
                  <li>The right to correction of your personal data</li>
                  <li>The right to erasure of your personal data</li>
                  <li>The right to restrict processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal data</li>
                </ul>
                <p>
                  If you wish to exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
                </p>
                
                <h2>7. Third-Party Services</h2>
                <p>
                  We use the following third-party services to process your data:
                </p>
                <ul>
                  <li>Firebase (Authentication and Database)</li>
                  <li>Stripe (Payment Processing)</li>
                  <li>Claude AI (Price Analysis)</li>
                </ul>
                <p>
                  Each of these services has their own privacy policies which we encourage you to review.
                </p>
                
                <h2>8. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
                
                <h2>9. Children's Privacy</h2>
                <p>
                  Our service is not intended for individuals under the age of 16. We do not knowingly collect personal data from children under 16. If we become aware that we have collected personal data from a child under 16 without verification of parental consent, we will take steps to remove that information from our servers.
                </p>
                
                <h2>10. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
                
                <h2>11. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                  <li>Email: privacy@bopercheck.com</li>
                  <li>Phone: +44 800 123 4567</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
