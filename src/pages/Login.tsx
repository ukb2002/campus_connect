
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User } from "lucide-react";
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
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

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

  const demoAccounts = [
    { role: "Student", email: "krishna.bhardwaj@university.edu" },
    { role: "Faculty", email: "great.guruji@university.edu" },
    { role: "Admin", email: "admin@university.edu" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-campus-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-campus-blue p-3 shadow-lg">
              <svg
                width="40"
                height="40"
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
          <h2 className="text-4xl font-bold text-campus-gray-900">Campus Connect</h2>
          <p className="mt-2 text-campus-gray-600">
            Connect, collaborate, and share resources with your campus community
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="you@university.edu"
                            className="pl-10"
                            {...field}
                            disabled={authState.isLoading}
                          />
                        </div>
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                            disabled={authState.isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full py-6 text-base transition-all duration-200 hover:scale-[1.02]"
                  disabled={authState.isLoading}
                >
                  {authState.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-campus-blue hover:underline"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              >
                {showDemoAccounts ? "Hide demo accounts" : "Use a demo account"}
              </button>
            </div>
          </CardContent>
          
          {showDemoAccounts && (
            <CardFooter className="flex-col space-y-4 border-t pt-6">
              <p className="text-xs text-center text-campus-gray-500">
                Click to auto-fill a demo account (password will be "password")
              </p>
              <div className="grid gap-2 w-full">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2 justify-start"
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={authState.isLoading}
                  >
                    <User className="h-4 w-4" />
                    <span>Login as {account.role}</span>
                  </Button>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-campus-gray-600">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
