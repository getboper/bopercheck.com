import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Building2, CreditCard } from "lucide-react";
import { Helmet } from "react-helmet";
import { SEOHead, seoConfigs } from "@/components/SEOHead";

const businessSignupSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  website: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    // Accept URLs with or without protocol, with or without www
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    return urlPattern.test(val);
  }, {
    message: "Please enter a valid website (e.g. example.com, www.example.com, or https://example.com)"
  }),
  serviceCategory: z.string().min(1, "Please enter your service category"),
  customCategory: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  businessDescription: z.string().min(10, "Please provide a brief description"),
  adHeadline: z.string().min(5, "Ad headline is required").max(60, "Headline must be under 60 characters"),
  logo: z.any().optional(),
  planType: z.enum(["basic", "pro", "featured"])
});

type BusinessSignupForm = z.infer<typeof businessSignupSchema>;

// Popular UK service categories for BoperCheck advertisers
const serviceCategories = [
  { value: "home-services", label: "Home Services" },
  { value: "construction", label: "Construction & Building" },
  { value: "automotive", label: "Automotive Services" },
  { value: "beauty-wellness", label: "Beauty & Wellness" },
  { value: "professional-services", label: "Professional Services" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "technology", label: "Technology & Electronics" },
  { value: "health-medical", label: "Health & Medical" },
  { value: "education-training", label: "Education & Training" },
  { value: "entertainment", label: "Entertainment & Events" },
  { value: "financial", label: "Financial Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "legal", label: "Legal Services" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "gardening", label: "Gardening & Landscaping" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "pet-services", label: "Pet Services" },
  { value: "other", label: "Other" }
];

const ukLocations = [
  { value: "london", label: "London" },
  { value: "manchester", label: "Manchester" },
  { value: "birmingham", label: "Birmingham" },
  { value: "leeds", label: "Leeds" },
  { value: "liverpool", label: "Liverpool" },
  { value: "bristol", label: "Bristol" },
  { value: "sheffield", label: "Sheffield" },
  { value: "newcastle", label: "Newcastle" },
  { value: "glasgow", label: "Glasgow" },
  { value: "edinburgh", label: "Edinburgh" },
  { value: "nottingham", label: "Nottingham" },
  { value: "cardiff", label: "Cardiff" },
  { value: "leicester", label: "Leicester" },
  { value: "coventry", label: "Coventry" },
  { value: "belfast", label: "Belfast" },
  { value: "other-uk", label: "Other UK Location" }
];

const pricingPlans = {
  basic: { name: "Basic Plan", price: 35, features: ["1 service category", "Basic listing", "Contact button", "Analytics dashboard"] },
  pro: { name: "Pro Plan", price: 85, features: ["Up to 5 categories", "Priority listing", "Full business profile", "Enhanced analytics", "AI-suggested categories"] },
  featured: { name: "Featured Partner Plan", price: 175, features: ["Unlimited categories", "Premium placement", "Advanced analytics", "Dedicated support", "Custom integrations"] }
};

export default function BusinessSignupPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BusinessSignupForm>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      businessName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      serviceCategory: "",
      customCategory: "",
      location: "",
      businessDescription: "",
      adHeadline: "",
      planType: "pro"
    }
  });

  const selectedPlan = form.watch("planType");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive"
        });
        return;
      }

      form.setValue("logo", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BusinessSignupForm) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would:
      // 1. Upload the logo to cloud storage
      // 2. Create the business profile in database
      // 3. Set up Stripe subscription
      // 4. Send confirmation email
      
      toast({
        title: "Success!",
        description: "Your business listing is being processed. You'll receive a confirmation email shortly.",
      });
      
      // Redirect to payment/success page
      setTimeout(() => {
        window.location.href = `/business/checkout?plan=${data.planType}&business=${encodeURIComponent(data.businessName)}`;
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error processing your signup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead {...seoConfigs.advertiserSignup} />

      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
            Start Advertising Your Business
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Get featured when customers search for your products and services
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-800 font-medium">
              🎯 No algorithm guesswork. Your business appears exactly when customers are looking for what you offer.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Signup Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Business Information */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-green-600" />
                    Business Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Business Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@yourbus business.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="01234 567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Service & Location */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-green-600" />
                    Service & Location
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="serviceCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Service Category *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Restaurant, Plumber, Hair Salon, Accountant, etc." 
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500 mt-1">Enter your main business category - any industry welcome</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Location *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. London, Manchester, Birmingham, or any UK location" 
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500 mt-1">Enter your main business location - all UK areas welcome</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your business and services (this will appear in your listing)"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ad Content */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Ad Content
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="adHeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Headline * (60 characters max)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Expert Plumbing Services - 24/7 Emergency Calls"
                            maxLength={60}
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-sm text-gray-500 mt-1">
                          {field.value?.length || 0}/60 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <Label>Business Logo (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {logoPreview ? (
                          <div className="flex flex-col items-center">
                            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded mb-2" />
                            <p className="text-sm text-green-600">Click to change logo</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-600">Upload your business logo</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                    Choose Your Plan
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="planType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid gap-4">
                            {Object.entries(pricingPlans).map(([key, plan]) => (
                              <label
                                key={key}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                                  field.value === key 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={key}
                                  checked={field.value === key}
                                  onChange={field.onChange}
                                  className="sr-only"
                                />
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                      {plan.features.map((feature, idx) => (
                                        <li key={idx}>• {feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">£{plan.price}</div>
                                    <div className="text-sm text-gray-500">/month</div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Continue to Payment - £${pricingPlans[selectedPlan].price}/month`}
                </Button>
              </form>
            </Form>
          </div>

          {/* Sidebar with benefits */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-lg mb-4">Why Advertise with BoperCheck?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span>Customers actively searching for your service</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span>Location-based targeting for local customers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span>No algorithm guesswork - pure intent-based advertising</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                  <span>Setup takes less than 5 minutes</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team can help you write compelling ad copy and optimize your listing for maximum impact.
              </p>
              <Button variant="outline" className="w-full">
                Get Setup Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}