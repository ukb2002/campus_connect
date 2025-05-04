
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Check, AlertCircle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Login = () => {
  const { login, authState, signup } = useAuth();
  const navigate = useNavigate();
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values.email, values.password);
  };

  const handleSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      await signup(values.name, values.email, values.password);
      setVerificationSent(true);
      setActiveTab("login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleDemoLogin = async (email: string) => {
    loginForm.setValue("email", email);
    loginForm.setValue("password", "password");
    await login(email, "password");
  };

  const demoAccounts = [
    { role: "Student", email: "krishna.bhardwaj@university.edu" },
    { role: "Faculty", email: "great.guruji@university.edu" },
    { role: "Admin", email: "admin@university.edu" },
  ];

  return (
    <div className="min-h-screen flex flex-row">
      {/* Left side - Introduction */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-campus-blue/90 to-campus-purple/80 flex-col items-center justify-center text-white p-8">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-white p-3 shadow-lg">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22L3 17V7L12 2L21 7V17L12 22Z"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22L12 11"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 7.5L7 7.5"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Campus Connect</h1>
          <p className="text-xl mb-8">
            Connect, collaborate, and share resources with your campus community
          </p>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-left">Access campus resources and materials</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-left">Communicate securely with peers and faculty</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-left">Stay updated with campus announcements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login/Signup Forms */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-campus-gray-50 to-blue-50 p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
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
            <h2 className="text-3xl font-bold text-campus-gray-900">Campus Connect</h2>
            <p className="mt-2 text-campus-gray-600">
              Connect with your campus community
            </p>
          </div>

          {verificationSent && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Verification Email Sent!</AlertTitle>
              <AlertDescription>
                Please check your email to verify your account before logging in.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Access your campus account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
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
                        control={loginForm.control}
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
                      
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm font-medium text-campus-blue hover:underline"
                          onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                        >
                          {showDemoAccounts ? "Hide demo accounts" : "Use a demo account"}
                        </button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your Name"
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
                        control={signupForm.control}
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
                        control={signupForm.control}
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

                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                            <span>Signing up...</span>
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            {showDemoAccounts && activeTab === "login" && (
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
    </div>
  );
};

export default Login;
