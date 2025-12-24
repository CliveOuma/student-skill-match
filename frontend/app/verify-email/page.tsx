"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";  

const REDIRECT_DELAY = 2000; // 2 seconds delay before redirect
const CODE_EXPIRY_SECONDS = 60; // code expires in 60 seconds

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("Enter the 6-digit code sent to your email.");
  const [verified, setVerified] = useState(false);
  const [codeTimer, setCodeTimer] = useState(CODE_EXPIRY_SECONDS);

  // Countdown timer for code expiry
  useEffect(() => {
    if (codeTimer <= 0) return;
    const timer = setInterval(() => {
      setCodeTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [codeTimer]);

  const handleVerify = useCallback(async () => {
    if (!email) {
      setStatus("error");
      setMessage("Email is missing.");
      toast.error("Email is missing.");
      return;
    }

    if (codeTimer <= 0) {
      toast.error("Please request a new code.");
      return;
    }

    if (!code || code.trim().length !== 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }

    try {
      setStatus("loading");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
        email,
        code: code.trim(),
      });

      const responseMessage = res.data?.message || "Email verified successfully";
      setStatus("success");
      setVerified(true);
      setMessage(responseMessage);
      toast.success("Email verified");

      setTimeout(() => {
        router.push("/login");
      }, REDIRECT_DELAY);
    } catch (error: unknown) {
      let errorMessage = "Failed to verify email.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Verification failed:", error);
      setStatus("error");
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }, [code, codeTimer, email, router]);

  const handleResendEmail = async () => {
    if (!email) {
      setMessage("Email is missing.");
      setStatus("error");
      toast.error("Email is missing.");
      return;
    }

    if (isResending || status === "loading") return;

    try {
      setIsResending(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification-email`,
        { email }
      );

      setMessage(res.data.message);
      setStatus("success");
      toast.success("Verification code resent!");
      setCodeTimer(CODE_EXPIRY_SECONDS); // restart 60s expiry for new code
    } catch (error: unknown) {
      let errorMessage = "Failed to resend code.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Resend failed:", error);
      setMessage(errorMessage);
      setStatus("error");
      toast.error("Resend failed.");
    } finally {
      setIsResending(false);
    }
  };

  // Check if already verified
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!email) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-verification-status?email=${email}`
        );

        if (res.status === 200 && res.data?.isVerified) {
          setVerified(true);
          setMessage("Email already verified.");
          toast.success("Email is already verified!");
          setTimeout(() => router.push("/login"), REDIRECT_DELAY);
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    checkVerificationStatus();
  }, [email, router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Enter the Verification Code</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Verification code sent to your email address{email ? `: ${email}` : ""}.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {`If you don't see the code in your inbox, please check Spam`}.
          </p>
        </div>

        {!verified ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter the 6-digit code</p>
            </div>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              maxLength={6}
              //placeholder="******"
              className="text-center text-2xl tracking-[0.6em] font-medium dark:bg-gray-700 dark:text-white"
            />

            {status === "error" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{message}</p>
              </div>
            )}

            <Button
              onClick={handleVerify}
              disabled={(status === "loading" && !isResending) || code.trim().length !== 6 || codeTimer <= 0}
              className="w-full bg-orange-500 text-white dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(status === "loading" && !isResending) ? "Verifying..." : "Verify"}
            </Button>

            <div className={`flex items-center text-sm text-gray-600 dark:text-gray-300 ${codeTimer > 0 ? 'justify-between' : 'justify-center'}`}>
              {codeTimer > 0 && (
                <span>Code expires in {codeTimer}s.</span>
              )}
              {codeTimer <= 0 && (
                <Button
                  variant="outline"
                  disabled={isResending || status === "loading"}
                  onClick={handleResendEmail}
                  className="text-orange-500 border-orange-200 hover:bg-orange-50 dark:hover:bg-gray-700"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <svg
                  className="w-12 h-12 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-green-600 dark:text-green-400 text-lg font-medium">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login...</p>
          </div>
        )}

        <div className="pt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <button className="hover:underline" onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
