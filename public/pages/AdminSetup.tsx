import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createAdminUser = async () => {
    setIsCreating(true);
    
    try {
      // Create the admin user with the specified credentials
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        "njpards1@gmail.com", 
        "BoperAdmin2025!"
      );

      console.log("Admin user created:", userCredential.user.uid);
      
      setIsCreated(true);
      toast({
        title: "Admin user created successfully",
        description: "You can now log in with your credentials"
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation("/admin/login");
      }, 3000);
      
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      
      if (error.code === "auth/email-already-in-use") {
        toast({
          title: "User already exists",
          description: "Admin user is already set up. You can log in now.",
          variant: "default"
        });
        setTimeout(() => {
          setLocation("/admin/login");
        }, 2000);
      } else {
        toast({
          title: "Setup failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const resetPassword = async () => {
    setIsResetting(true);
    
    try {
      await sendPasswordResetEmail(auth, "njpards1@gmail.com");
      
      toast({
        title: "Password reset email sent",
        description: "Check your email to reset your password",
        variant: "default"
      });
      
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Setup | BoperCheck</title>
        <meta name="description" content="One-time admin user setup for BoperCheck" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Admin Setup
          </CardTitle>
          <p className="text-gray-600 text-sm">
            One-time setup for BoperCheck administration
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isCreated ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Admin User Setup</p>
                    <p>This will create the admin user account:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Email: njpards1@gmail.com</li>
                      <li>Password: BoperAdmin2025!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={createAdminUser}
                  disabled={isCreating}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg shadow-lg"
                >
                  {isCreating ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Admin User...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Create Admin User
                    </div>
                  )}
                </Button>

                <div className="text-center text-gray-600 text-sm">or</div>

                <Button
                  onClick={resetPassword}
                  disabled={isResetting}
                  variant="outline"
                  className="w-full h-12 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold"
                >
                  {isResetting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending Reset Email...
                    </div>
                  ) : (
                    "Reset Admin Password"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Admin User Created Successfully!
                </h3>
                <p className="text-gray-600 text-sm">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          )}

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

export default AdminSetup;