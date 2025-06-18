import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    
    try {
      // Debug Firebase configuration
      console.log("Firebase Config Debug:", {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "Missing",
        appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
        authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
      });

      // Only allow specific admin email
      if (data.email !== "njpards1@gmail.com") {
        throw new Error("Unauthorized access");
      }

      console.log("Attempting Firebase login for:", data.email);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log("Login successful! User ID:", user.uid);

      // Verify this is the authorized admin user
      if (user.email !== "njpards1@gmail.com") {
        await auth.signOut();
        throw new Error("Unauthorized access");
      }

      toast({
        title: "Login successful",
        description: "Welcome to admin dashboard"
      });

      // Redirect to admin analytics
      setLocation("/admin/analytics");
      
    } catch (error: any) {
      console.error("Firebase login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email. Please use the setup page first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password for this account.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid login credentials provided.";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Firebase configuration error. Please check setup.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message === "Unauthorized access") {
        errorMessage = "Access denied. Unauthorized account.";
      }

      toast({
        title: "Login failed",
        description: `${errorMessage} (Code: ${error.code || 'unknown'})`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login | BoperCheck</title>
        <meta name="description" content="Secure admin access to BoperCheck analytics dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Admin Access
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Secure login to BoperCheck administration
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@bopercheck.com"
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setLocation("/")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to BoperCheck
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;