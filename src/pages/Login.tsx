
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Google } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login, loginWithGoogle, authState } = useAuth();
  const navigate = useNavigate();
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values.email, values.password);
  };

  const handleDemoLogin = async (email: string) => {
    form.setValue("email", email);
    form.setValue("password", "password");
    await login(email, "password");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const demoAccounts = [
    { role: "Student", email: "john.doe@university.edu" },
    { role: "Faculty", email: "jane.smith@university.edu" },
    { role: "Admin", email: "admin@university.edu" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-campus-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-md bg-campus-blue p-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22L3 17V7L12 2L21 7V17L12 22Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22L12 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 7.5L7 7.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-campus-gray-900">Campus Connect</h2>
          <p className="mt-2 text-sm text-campus-gray-600">
            Connect, collaborate, and share resources with your college community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={authState.isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Google className="h-4 w-4" />
              )}
              Sign in with Google
            </Button>
            
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-campus-gray-500">OR</span>
              <Separator className="flex-1" />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@university.edu"
                          {...field}
                          disabled={authState.isLoading}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={authState.isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={authState.isLoading}
                >
                  {authState.isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              <button
                type="button"
                className="text-campus-blue hover:underline font-medium"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              >
                {showDemoAccounts ? "Hide demo accounts" : "Use demo account"}
              </button>
            </div>

            {showDemoAccounts && (
              <div className="w-full space-y-2">
                <p className="text-xs text-center text-campus-gray-500">
                  Click to auto-fill a demo account (password will be "password")
                </p>
                <div className="grid gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDemoLogin(account.email)}
                      disabled={authState.isLoading}
                    >
                      Login as {account.role}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
