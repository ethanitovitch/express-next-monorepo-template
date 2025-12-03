"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is on a page that allows logged-in users
  const isAcceptInvitationPage = pathname?.startsWith("/accept-invitation");
  const isVerifyWithInvitation = pathname?.startsWith("/verify") && 
    typeof window !== "undefined" && window.location.search.includes("inviteId");

  useEffect(() => {
    // Redirect logged-in users to dashboard unless they're on specific pages
    if (!isPending && session && !isAcceptInvitationPage && !isVerifyWithInvitation) {
      router.push("/dashboard");
    }
  }, [session, isPending, router, isAcceptInvitationPage, isVerifyWithInvitation]);

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Only return null if logged in AND being redirected (not on special pages)
  if (session && !isAcceptInvitationPage && !isVerifyWithInvitation) {
    return null; // Will redirect, so return nothing
  }

  return <>{children}</>;
}
