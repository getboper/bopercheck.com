import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const USALaunchPage = () => {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit USA launch interest
      const response = await fetch('/api/usa-launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, businessName, description })
      });

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "We'll contact you when BoperCheck launches in the USA.",
        });
        setEmail("");
        setBusinessName("");
        setDescription("");
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <Helmet>
        <title>USA Launch - Register Interest | BoperCheck</title>
        <meta name="description" content="Be first to know when BoperCheck launches in the USA. Register your business interest for early access and advertising opportunities." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section with Authentic USA Flag */}
        <div 
          className="text-center mb-12 p-8 rounded-lg border-4 border-blue-600 relative overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1235 650'%3E%3Cpath fill='%23B22234' d='M0 0h1235v50H0zM0 100h1235v50H0zM0 200h1235v50H0zM0 300h1235v50H0zM0 400h1235v50H0zM0 500h1235v50H0zM0 600h1235v50H0z'/%3E%3Cpath fill='white' d='M0 50h1235v50H0zM0 150h1235v50H0zM0 250h1235v50H0zM0 350h1235v50H0zM0 450h1235v50H0zM0 550h1235v50H0z'/%3E%3Cpath fill='%23002868' d='M0 0h494v350H0z'/%3E%3Cg fill='white'%3E%3Cg id='s18'%3E%3Cg id='s9'%3E%3Cg id='s5'%3E%3Cg id='s4'%3E%3Cpath id='s' d='m247,90 0,0-5.5,16.87L254.33,100l-16.87,5.5L247,90 254.33,100 237.46,106.87 254.33,100z'/%3E%3Cuse href='%23s' y='140'/%3E%3Cuse href='%23s' y='280'/%3E%3C/g%3E%3Cuse href='%23s4' x='-123.5' y='70'/%3E%3C/g%3E%3Cuse href='%23s5' x='-247' y='140'/%3E%3C/g%3E%3Cuse href='%23s9' x='123.5'/%3E%3C/g%3E%3Cuse href='%23s18' x='-494'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="bg-black bg-opacity-50 px-6 py-4 rounded-lg backdrop-blur-sm inline-block relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 animate-pulse">
              USA LAUNCH COMING SOON!
            </h1>
            <p className="text-xl md:text-2xl text-white drop-shadow-lg font-semibold">
              Be the first to access BoperCheck in America
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Register Your Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Tell us about your business</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What products/services do you offer? How could BoperCheck help your customers?"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Interest"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Early Access Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>First to list your business when we launch</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Priority advertising placement opportunities</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Exclusive launch pricing and discounts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Direct feedback channel to shape USA features</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why BoperCheck?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>🔍 <strong>AI-Powered:</strong> Smart price comparison technology</p>
                <p>🏪 <strong>Local Focus:</strong> Connect customers with nearby suppliers</p>
                <p>💳 <strong>Discount Codes:</strong> Integrated voucher validation</p>
                <p>📱 <strong>Mobile First:</strong> Optimized for all devices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USALaunchPage;