"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthCard from "@/components/AuthCard";
import Button from "@/components/ui/Button";

export default function AcceptInvitationPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const invitationId = params.id as string;
  const email = searchParams.get("email") as string;
  const [isAccepting, setIsAccepting] = useState(false);
  const [invitationAccepted, setInvitationAccepted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If still loading, do nothing
    if (isPending) return;

    // If not logged in, redirect to login with invitation token
    if (!session) {
      setRedirecting(true);
      const loginUrl = `/signup?inviteId=${invitationId}&email=${email}&redirect=${encodeURIComponent(`/accept-invitation/${invitationId}`)}`;
      router.push(loginUrl);
    }
  }, [session, isPending, invitationId, router]);

  const handleAcceptInvitation = async () => {
    if (!invitationId) {
      toast.error("Invalid invitation link");
      return;
    }

    setIsAccepting(true);

    try {
      // Call the better-auth organization accept invitation endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/organization/accept-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            invitationId,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        toast.error(result.error.message || "Failed to accept invitation");
      } else {
        setInvitationAccepted(true);
        toast.success("Invitation accepted successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show redirecting state
  if (!session || redirecting) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  // Show success state
  if (invitationAccepted) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <AuthCard title="Success!">
          <div className="text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <p className="text-muted-foreground">
              You&apos;ve successfully joined the organization!
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </div>
        </AuthCard>
      </div>
    );
  }

  // Show accept invitation UI
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <AuthCard title="Accept Invitation">
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            You&apos;ve been invited to join an organization on Update Me.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={isAccepting}
              className="w-full"
            >
              Accept Invitation
            </Button>
            
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              disabled={isAccepting}
              className="w-full"
            >
              Decline
            </Button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}

