import { Helmet } from "react-helmet";

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - BoperCheck</title>
        <meta name="description" content="Terms and conditions for using BoperCheck's AI price analysis service. Read our legal terms, refund policy, and usage guidelines." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Terms and Conditions</h1>
          <p className="text-muted-foreground text-center mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="gradient-bg h-3"></div>
            <div className="p-8">
              <div className="prose prose-slate max-w-none">
                <h2 id="agreement">1. Agreement to Terms</h2>
                <p>
                  These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and BoperCheck ("we," "us" or "our"), concerning your access to and use of the BoperCheck website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>
                <p>
                  You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                </p>
                
                <h2 id="service">2. Description of Service</h2>
                <p>
                  BoperCheck is an AI-powered price analysis service that provides users with price comparisons and market analysis for products and services. The service requires the purchase of credits, which are consumed when performing price checks.
                </p>
                
                <h2 id="accounts">3. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                </p>
                
                <h2 id="credits">4. Credits and Payments</h2>
                <p>
                  BoperCheck operates on a credit-based system. Users purchase credits which can be used to perform price checks.
                </p>
                <p>
                  Credits are valid for the period specified at the time of purchase (6 months for 5-credit packs and 12 months for 10 and 25-credit packs). Unused credits expire after this period and are not refundable.
                </p>
                <p>
                  All payments are processed securely through our payment processor. By making a purchase, you agree to provide current, complete and accurate purchase and account information.
                </p>
                
                <h2 id="refunds" className="scroll-mt-20">5. Refund Policy</h2>
                <p>
                  We offer refunds for unused credits within 30 days of purchase. To request a refund, please contact our support team with your order information.
                </p>
                <p>
                  Refunds are processed to the original payment method used for the purchase. Processing times may vary depending on your payment provider.
                </p>
                
                <h2 id="content">6. User Content</h2>
                <p>
                  By submitting queries and information to the service, you grant us the right to use this information to improve our AI models and service quality. We will not sell your personal search data to third parties.
                </p>
                
                <h2 id="limitations">7. Limitations of Liability</h2>
                <p>
                  BoperCheck strives to provide accurate price information, but we cannot guarantee 100% accuracy as market prices can change rapidly. We are not liable for any decisions made based on the information provided by our service.
                </p>
                <p>
                  In no event shall BoperCheck, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
                
                <h2 id="cookies" className="scroll-mt-20">8. Cookie Policy</h2>
                <p>
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By using BoperCheck, you consent to our use of cookies in accordance with our Privacy Policy.
                </p>
                <p>
                  You can control cookies through your browser settings and other tools. However, if you block certain cookies, you may not be able to use all the features of our service.
                </p>
                
                <h2 id="changes">9. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                
                <h2 id="contact">10. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <ul>
                  <li>Email: support@bopercheck.com</li>
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

export default TermsPage;
