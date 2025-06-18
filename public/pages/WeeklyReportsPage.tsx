import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3, TrendingUp, Mail, Target, Users, Award } from "lucide-react";

const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  businessName: z.string().min(1, "Business name is required"),
  website: z.string().optional(),
  businessType: z.string().min(1, "Please select your business type"),
  location: z.string().min(1, "Location is required"),
  mainProducts: z.string().min(10, "Please describe your main products/services (minimum 10 characters)"),
  targetMarket: z.string().optional()
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export default function WeeklyReportsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
      businessName: "",
      website: "",
      businessType: "",
      location: "",
      mainProducts: "",
      targetMarket: ""
    }
  });

  const onSubmit = async (data: SubscriptionForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/reports/subscribe", data);
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive your first weekly report on Monday.",
      });
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Welcome to BoperCheck Weekly Reports. Your first report will arrive next Monday morning.
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  What to expect in your reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Search Visibility Metrics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How often your business appears in relevant searches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Geographic Breakdown</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">National vs local search performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">User Engagement</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download rates and customer interest levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Want to boost your visibility even more?
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/business/signup">Explore Advertising Options</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Free Weekly Business Reports
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get insights into how your business appears in BoperCheck searches
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
              <Award className="w-4 h-4" />
              Completely free • No spam • Unsubscribe anytime
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  What you'll discover each week
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Search Visibility
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        How many times your business appeared in relevant price searches across the UK
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Geographic Reach
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Breakdown of national vs local searches mentioning your business type
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Customer Interest
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Percentage of users who downloaded results related to your services
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                <p className="text-blue-100 mb-4">
                  Want detailed analytics, competitor insights, and lead generation data? 
                  Our advertising customers get enhanced reports with actionable insights.
                </p>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/business/signup">Learn More</a>
                </Button>
              </div>
            </div>

            {/* Subscription Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center">Get Your Free Weekly Report</CardTitle>
                  <CardDescription className="text-center">
                    Enter your details below to start receiving insights about your business visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Smith Plumbing Services" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your@email.com" 
                                {...field} 
                              />
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
                              <Input 
                                placeholder="https://yourwebsite.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your business category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="home-improvement">Home Improvement & Renovation</SelectItem>
                                <SelectItem value="plumbing">Plumbing Services</SelectItem>
                                <SelectItem value="electrical">Electrical Services</SelectItem>
                                <SelectItem value="garden-landscaping">Garden & Landscaping</SelectItem>
                                <SelectItem value="cleaning">Cleaning Services</SelectItem>
                                <SelectItem value="automotive">Automotive Services</SelectItem>
                                <SelectItem value="retail">Retail & Sales</SelectItem>
                                <SelectItem value="professional-services">Professional Services</SelectItem>
                                <SelectItem value="food-hospitality">Food & Hospitality</SelectItem>
                                <SelectItem value="fitness-health">Fitness & Health</SelectItem>
                                <SelectItem value="technology">Technology Services</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Service Area</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Manchester, Birmingham, London" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mainProducts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Products/Services</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your main products or services (e.g. emergency plumbing repairs, bathroom installations, boiler servicing)"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetMarket"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Market (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. homeowners, landlords, commercial properties" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Subscribing..." : "Start Receiving Weekly Reports"}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By subscribing, you agree to receive weekly emails from BoperCheck. 
                      You can unsubscribe at any time. We respect your privacy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}