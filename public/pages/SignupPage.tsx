import { Helmet } from "react-helmet";
import AuthForm from "@/components/auth/AuthForm";

const SignupPage = () => {
  return (
    <>
      <Helmet>
        <title>Sign Up - BoperCheck</title>
        <meta name="description" content="Create a BoperCheck account to get instant AI price analysis. All price searches are completely free forever!" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <AuthForm type="signup" />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
