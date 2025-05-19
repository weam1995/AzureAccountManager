import { useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useLocation } from "wouter";
import { loginRequest } from "../lib/msal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <svg 
                className="w-12 h-12 text-msblue-primary" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.5 12.5V0H0V11.5H11.5V12.5Z" />
                <path d="M24 11.5V0H12.5V11.5H24Z" />
                <path d="M11.5 24V12.5H0V24H11.5Z" />
                <path d="M24 24V12.5H12.5V24H24Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-800 mb-2">Account Portal</h1>
            <p className="text-neutral-600">Sign in to manage accounts</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-msblue-primary hover:bg-msblue-secondary text-white"
              onClick={handleLogin}
            >
              <i className="ri-microsoft-fill mr-2"></i>
              Sign in with Microsoft
            </Button>
            
            <div className="text-xs text-center text-neutral-500 mt-6">
              By signing in, you agree to the terms of service and privacy policy.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
