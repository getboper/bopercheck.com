import { Helmet } from "react-helmet";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Log In - BoperCheck</title>
        <meta name="description" content="Log in to your BoperCheck account to access your price check history, manage credits, and more." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
