/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useForgotPassword, useResetPassword } from "@/hooks/api/useAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Get invitation params from URL
  const inviteId = searchParams.get("inviteId");

  // If token exists, show reset form, otherwise show request form
  const isResetting = !!token;

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    
    // Build redirectTo URL with invitation params if they exist
    let redirectTo = `${window.location.origin}/reset-password`;
    if (inviteId) {
      redirectTo += `?inviteId=${inviteId}`;
    }
    
    forgotPasswordMutation.mutate(
      {
        email,
        redirectTo,
      },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error?.message || "Failed to send reset email");
          } else {
            setEmailSent(true);
            toast.success("Password reset link sent to your email!");
          }
        },
        onError: () => {
          toast.error("An error occurred. Please try again.");
        },
      }
    );
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (!token) {
      toast.error("Invalid reset token.");
      return;
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword,
      },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error?.message || "Failed to reset password");
          } else {
            toast.success("Password reset successfully!");
            
            // Redirect to invitation if params exist, otherwise to login
            const targetUrl = inviteId ? `/accept-invitation/${inviteId}` : "/login";
            setTimeout(() => router.push(targetUrl), 2000);
          }
        },
        onError: () => {
          toast.error("An error occurred. Please try again.");
        },
      }
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <AuthCard title="Check your email">
          <div className="space-y-4 py-4">
            <div className="text-center text-muted-foreground space-y-3">
              <svg
                className="mx-auto h-16 w-16 text-[var(--color-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-base">
                We&apos;ve sent a password reset link to your email.
              </p>
              <p className="text-sm">
                Click the link in the email to reset your password.
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={() => router.push(
                  inviteId 
                    ? `/login?inviteId=${inviteId}&redirect=${encodeURIComponent(`/accept-invitation/${inviteId}`)}` 
                    : "/login"
                )} 
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </AuthCard>
      </div>
    );
  }

  if (isResetting) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <AuthCard title="Reset your password">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" disabled={resetPasswordMutation.isPending} className="w-full">
              Reset Password
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <a 
                className="text-[var(--color-primary)] underline" 
                href={inviteId 
                  ? `/login?inviteId=${inviteId}&redirect=${encodeURIComponent(`/accept-invitation/${inviteId}`)}` 
                  : "/login"}
              >
                Sign in
              </a>
            </p>
          </form>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <AuthCard title="Forgot password?">
        <form onSubmit={handleRequestReset} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full">
            Send Reset Link
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <a 
              className="text-[var(--color-primary)] underline" 
              href={inviteId 
                ? `/login?inviteId=${inviteId}&redirect=${encodeURIComponent(`/accept-invitation/${inviteId}`)}` 
                : "/login"}
            >
              Sign in
            </a>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}

