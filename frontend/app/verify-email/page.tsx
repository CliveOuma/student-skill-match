"use client"
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";  

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // Get email from URL
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Click the button below to confirm your email.");
  const [verified, setVerified] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false); 

  const handleResendEmail = async () => {
    if (!email) {
      setMessage("Email is missing.");
      setStatus("error");
      toast.error("Email is missing.");
      return;
    }

    try {
      setStatus("loading");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification-email`,
        { email }
      );

      setMessage(res.data.message);
      setStatus("success");
      toast.success("Verification email resent!");

      // Disable the resend button after sending the confirmation link
      setIsResendDisabled(true);
    } catch (error: unknown) {
      let errorMessage = "Failed to resend email.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Resend failed:", error);
      setMessage(errorMessage);
      setStatus("error");
      toast.error("Resend failed.");
    }
  };

  const handleVerify = useCallback(async () => {
    if (!token) {
      setMessage("Invalid verification link.");
      setStatus("error");
      toast.error("Invalid verification link.");
      return;
    }

    try {
      setStatus("loading");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`
      );
      setMessage(res.data.message);
      setStatus("success");
      setVerified(true);

      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      let errorMessage = "Failed to verify email.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Verification failed:", error);
      setMessage(errorMessage);
      setStatus("error");
      toast.error("Verification failed.");
    }
  }, [token, router]);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!email) return;
  
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-verification-status?email=${email}`
        );
  
        if (res.data.isVerified) {
          setVerified(true);
          setMessage("Email already verified.");
          toast.success("Email is already verified!");
          router.push("/login");
        } else {
          // Email not verified
          setVerified(false);
          setMessage("Email not verified yet.");
          setIsResendDisabled(false);
          toast.error("Email not verified.");
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };
  
    checkVerificationStatus();
  }, [email, router]);  

  // Automatically verify on mount if token is present
  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token, handleVerify]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Confirm Your Email</h1>

        {!verified ? (
          <>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;ve sent a confirmation email to:
              <br />
              <span className="font-medium text-gray-800 dark:text-white">
                {email ?? "your email"}
              </span>
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the button in the email to finish creating your account. If you don&apos;t see it, check your spam folder.
            </p>

            {status === "error" && <p className="text-red-500 text-sm">{message}</p>}
          </>
        ) : (
          <>
            <p className="text-green-600 text-sm font-medium">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login...</p>
          </>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-x-4">
          <Button onClick={handleResendEmail} disabled={isResendDisabled || status === "loading"}>
            {status === "loading" ? "Sending..." : "Resend Email"}
          </Button>

          <p
            className="mt-4 hover:underline cursor-pointer"
            onClick={() => router.push("/")}>
            Back to Home
          </p>
        </div>
      </div>
    </div>
  );
}
