
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Mail, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [verificationState, setVerificationState] = useState<{
    isLoading: boolean;
    isSuccess: boolean | null;
    message: string;
  }>({
    isLoading: true,
    isSuccess: null,
    message: "Verifying your email address...",
  });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerificationState({
          isLoading: false,
          isSuccess: false,
          message: "Invalid verification link. No token provided.",
        });
        return;
      }

      try {
        const success = await verifyEmail(token);
        setVerificationState({
          isLoading: false,
          isSuccess: success,
          message: success
            ? "Your email has been successfully verified."
            : "Verification failed. The link may be invalid or expired.",
        });
      } catch (error) {
        setVerificationState({
          isLoading: false,
          isSuccess: false,
          message: "An error occurred during verification.",
        });
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-campus-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {verificationState.isLoading ? (
                <div className="rounded-full bg-blue-50 p-4">
                  <Spinner className="h-8 w-8 text-campus-blue" />
                </div>
              ) : verificationState.isSuccess ? (
                <div className="rounded-full bg-green-50 p-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              ) : (
                <div className="rounded-full bg-red-50 p-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl text-center">
              {verificationState.isLoading
                ? "Verifying Email"
                : verificationState.isSuccess
                  ? "Email Verified"
                  : "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {verificationState.message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center pt-4">
            {!verificationState.isLoading && (
              <>
                {verificationState.isSuccess ? (
                  <p className="text-green-600">
                    Your account is now active. You can now log in with your credentials.
                  </p>
                ) : (
                  <p className="text-campus-gray-600">
                    Please check if you clicked the correct link or try to request a new verification email.
                  </p>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center pt-4">
            <Button
              onClick={() => navigate("/login")}
              disabled={verificationState.isLoading}
              className="flex items-center gap-2"
            >
              {verificationState.isSuccess ? (
                <>
                  Proceed to Login <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Back to Login <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
