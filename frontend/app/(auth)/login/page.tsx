"use client";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignInEmail, useSignInSocial } from "@/hooks/api/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  
  const signInMutation = useSignInEmail();
  const socialSignInMutation = useSignInSocial();

  // Get invitation ID and redirect URL from query params
  const inviteId = searchParams.get("inviteId");
  const redirectUrl = searchParams.get("redirect");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pw) return toast.error("Please fill in all fields.");
    
    signInMutation.mutate(
      { email, password: pw },
      {
        onSuccess: (result) => {
          if (result.error) {
            toast.error(result.error.message || "Failed to sign in");
          } else {
            toast.success("Signed in successfully!");
            // Redirect to invitation page if invite token exists, otherwise dashboard
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              router.push("/dashboard");
            }
          }
        },
        onError: () => {
          toast.error("An error occurred. Please try again.");
        },
      }
    );
  }

  async function handleGoogleSignIn() {
    // Build callback URL with redirect param if it exists
    let callbackURL = `${window.location.origin}/dashboard`;
    if (redirectUrl) {
      callbackURL = `${window.location.origin}${redirectUrl}`;
    }

    socialSignInMutation.mutate(
      {
        provider: "google",
        callbackURL,
      },
      {
        onError: () => {
          toast.error("Failed to sign in with Google");
        },
      }
    );
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <AuthCard title="Welcome back">
        {inviteId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Please sign in before accepting the invitation.
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <div className="space-y-2">
            <Input label="Password" type={"password"} value={pw} onChange={e=>setPw(e.target.value)} required />
            <div className="text-right">
              <a href="/reset-password" className="text-sm text-[var(--color-primary)] hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <Button type="submit" disabled={signInMutation.isPending} className="w-full">Sign in</Button>
          
          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg hover:bg-muted transition-colors duration-200 font-medium text-foreground"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <a 
              className="text-primary underline" 
              href={inviteId ? `/signup?inviteId=${inviteId}&redirect=${encodeURIComponent(redirectUrl || "")}` : "/signup"}
            >
              Create an account
            </a>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
