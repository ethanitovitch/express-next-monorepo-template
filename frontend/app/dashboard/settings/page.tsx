/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Page } from "@/components/dashboard/Page";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useInviteMember, useListOrganizationMembers, useListOrganizationInvitations, useCancelOrganizationInvitation, useRemoveOrganizationMember, useOrganizationCreditBalance } from "@/hooks/api/useOrganization";
import { useHasPasswordAuth } from "@/hooks/api/useUser";
import { useChangePassword } from "@/hooks/api/useAuth";
import { useActiveOrganization } from "@/lib/auth-client";
import { useCreateCheckoutSession, useOrganizationSubscription, useCreatePortalSession } from "@/hooks/api/useStripe";
import { STRIPE_PLANS } from "@shared/types/src";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const user = session?.user;
  
  // Check if user has password authentication (email/password login)
  const hasPasswordAuth = useHasPasswordAuth();

  // Queries
  const { data: membersData, isLoading: membersLoading } = useListOrganizationMembers();
  const members = membersData?.data?.members || [];
  const { data: invitationsData, isLoading: invitationsLoading } = useListOrganizationInvitations();
  const allInvitations = (invitationsData?.data) || [];
  const invitations = allInvitations.filter((inv: any) => inv.status === "pending");

  // Mutations
  const changePasswordMutation = useChangePassword();
  const inviteMemberMutation = useInviteMember();
  const cancelInvitationMutation = useCancelOrganizationInvitation();
  const removeMemberMutation = useRemoveOrganizationMember();
  
  // Stripe
  const createCheckoutSession = useCreateCheckoutSession();
  const createPortalSession = useCreatePortalSession();
  const { data: subscription, isLoading: subscriptionLoading } = useOrganizationSubscription(activeOrganization?.id);
  const { data: creditBalance, isLoading: creditBalanceLoading } = useOrganizationCreditBalance();

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");

  // Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(null);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string; email: string } | null>(null);

  // Check if current user is admin
  const currentUserMember = members.find((m: any) => m.userId === user?.id);
  const isAdmin = currentUserMember?.role === "admin";
  const isOwner = currentUserMember?.role === "owner";

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields");
    }
    
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }
    
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    changePasswordMutation.mutate(
      { currentPassword: oldPassword, newPassword },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error.message || "Failed to change password");
          } else {
            toast.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        },
        onError: () => {
          toast.error("An error occurred. Please try again.");
        },
      }
    );
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail) {
      return toast.error("Please enter an email address");
    }

    if (!activeOrganization) {
      return toast.error("No active organization selected");
    }

    inviteMemberMutation.mutate(
      { email: inviteEmail, role: inviteRole, organizationId: activeOrganization.id },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error.message || "Failed to send invitation");
          } else {
            toast.success(`Invitation sent to ${inviteEmail}!`);
            setInviteEmail("");
            setInviteRole("member");
          }
        },
        onError: () => {
          toast.error("An error occurred. Please try again.");
        },
      }
    );
  };

  const handleRemoveMember = (member: any) => {
    setMemberToRemove({
      id: member.id,
      name: member.user?.name || member.user?.email || "Unknown",
      email: member.user?.email || "",
    });
    setIsRemoveMemberModalOpen(true);
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;

    removeMemberMutation.mutate(
      { memberIdOrEmail: memberToRemove.id },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error.message || "Failed to remove member");
          } else {
            toast.success("Member removed successfully");
          }
          setIsRemoveMemberModalOpen(false);
          setMemberToRemove(null);
        },
        onError: () => {
          toast.error("Failed to remove member");
          setIsRemoveMemberModalOpen(false);
          setMemberToRemove(null);
        },
      }
    );
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setInvitationToCancel(invitationId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelInvitation = () => {
    if (!invitationToCancel) return;

    cancelInvitationMutation.mutate(
      { invitationId: invitationToCancel },
      {
        onSuccess: (result: any) => {
          if (result.error) {
            toast.error(result.error.message || "Failed to cancel invitation");
          } else {
            toast.success("Invitation cancelled successfully");
          }
          setIsCancelModalOpen(false);
          setInvitationToCancel(null);
        },
        onError: () => {
          toast.error("Failed to cancel invitation");
          setIsCancelModalOpen(false);
          setInvitationToCancel(null);
        },
      }
    );
  };

  const handleUpgrade = async () => {
    if (!activeOrganization) {
      toast.error("No active organization");
      return;
    }

    const proPlan = STRIPE_PLANS[0];
    createCheckoutSession.mutate(
      { planName: proPlan.name, organizationId: activeOrganization.id },
      {
        onSuccess: (data: any) => {
          if (data?.error) {
            toast.error(data.error.message || "Failed to create checkout session");
          } else if (data?.data?.url) {
            window.location.href = data.data.url;
          }
        },
        onError: () => {
          toast.error("Failed to start checkout");
        },
      }
    );
  };

  const handleManageBilling = async () => {
    if (!activeOrganization) {
      toast.error("No active organization");
      return;
    }

    createPortalSession.mutate(
      { organizationId: activeOrganization.id },
      {
        onSuccess: (data: any) => {
          if (data?.error) {
            toast.error(data.error.message || "Failed to open billing portal");
          } else if (data?.data?.url) {
            window.location.href = data.data.url;
          }
        },
        onError: () => {
          toast.error("Failed to open billing portal");
        },
      }
    );
  };

  return (
    <Page title="Settings" subtitle="Manage your account and organization settings">
      <div className="space-y-6">
        {/* Account Settings */}
        <Card title="Account">
          <div className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <p className="text-foreground">{user?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <p className="text-foreground">{user?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Change Password - Only for email/password users */}
            {hasPasswordAuth && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="Current Password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={changePasswordMutation.isPending}>
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Billing - Only for admin/owner */}
            {(isAdmin || isOwner) && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Billing</h3>
                  {subscriptionLoading ? (
                    <div className="text-sm text-muted-foreground">Loading subscription...</div>
                  ) : subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</p>
                            <p className="text-sm text-muted-foreground">
                              {subscription.status === "active" ? "Active" : subscription.status}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handleManageBilling}
                          disabled={createPortalSession.isPending}
                        >
                          Manage Billing
                        </Button>
                      </div>

                      {/* Interview Credits */}
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Interview Credits</p>
                              <p className="text-sm text-muted-foreground">Available credits for interviews</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {creditBalanceLoading ? (
                              <p className="text-2xl font-bold text-muted-foreground">...</p>
                            ) : (
                              <p className="text-2xl font-bold text-green-600">{creditBalance ?? 0}</p>
                            )}
                            <p className="text-xs text-muted-foreground">credits remaining</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Currently on: Free Plan</p>
                            <p className="text-sm text-muted-foreground">
                              Upgrade to Pro to unlock premium features
                            </p>
                          </div>
                          <Button 
                            onClick={handleUpgrade}
                            disabled={createCheckoutSession.isPending}
                          >
                            Upgrade to Pro
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Organization Settings */}
        {activeOrganization && (
          <Card title="Organization">
            <div className="space-y-6">
              {/* Organization Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Organization Name
                    </label>
                    <p className="text-foreground">{activeOrganization.name}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Members Section */}
              <div className="space-y-4">
                {/* Invite New Member (Admin Only) */}
                {isAdmin || isOwner && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground">Invite New Member</h3>
                      <form onSubmit={handleInviteMember} className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Input
                              placeholder="Enter email address"
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              required
                            />
                          </div>
                          <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as "member")}
                            className="px-4 py-2 border border-border rounded-lg text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            aria-label="Member role"
                          >
                            <option value="member">Member</option>
                          </select>
                          <Button type="submit" disabled={inviteMemberMutation.isPending}>
                            Invite
                          </Button>
                        </div>
                      </form>
                    </div>
                    <div className="border-t border-border" />
                  </>
                )}

                {/* Members List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Team Members ({members.length})
                  </h3>
                  {membersLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading members...</div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No members yet</div>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member: any) => {
                        const memberName = member.user?.name || "Unknown";
                        const memberEmail = member.user?.email || "";
                        const avatarImage = member.user?.image;
                        const avatarFallback = memberName.charAt(0).toUpperCase();
                        
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center overflow-hidden">
                                {avatarImage ? (
                                  <Image
                                    src={avatarImage}
                                    alt={memberName}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-semibold">
                                    {avatarFallback}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{memberName}</p>
                                <p className="text-sm text-muted-foreground">{memberEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  member.role === "admin" || member.role === "owner"
                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {member.role}
                              </span>
                              {(isAdmin || isOwner) && 
                               member.userId !== user?.id && 
                               member.role !== "admin" && 
                               member.role !== "owner" && (
                                <button
                                  onClick={() => handleRemoveMember(member)}
                                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                                  aria-label="Remove member"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <>
                    <div className="border-t border-border" />
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Pending Invitations ({invitations.length})
                      </h3>
                      {invitationsLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading invitations...</div>
                      ) : (
                        <div className="space-y-2">
                          {invitations.map((invitation: any) => {
                            const inviteeEmail = invitation.email;
                            const avatar = inviteeEmail.charAt(0).toUpperCase();
                            
                            return (
                              <div
                                key={invitation.id}
                                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground font-semibold">
                                      {avatar}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{inviteeEmail}</p>
                                    <p className="text-sm text-muted-foreground">Invited • Pending acceptance</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                    {invitation.role}
                                  </span>
                                  {(isAdmin || isOwner) && (
                                    <button
                                      onClick={() => handleCancelInvitation(invitation.id)}
                                      className="text-sm text-red-600 hover:text-red-700"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Cancel Invitation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setInvitationToCancel(null);
        }}
        title="Cancel Invitation"
        subtitle="Are you sure you want to cancel this invitation?"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The invited user will no longer be able to accept this invitation.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setInvitationToCancel(null);
              }}
            >
              No, Keep It
            </Button>
            <Button
              onClick={confirmCancelInvitation}
              disabled={cancelInvitationMutation.isPending}
            >
              Yes, Cancel Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Member Modal */}
      <Modal
        isOpen={isRemoveMemberModalOpen}
        onClose={() => {
          setIsRemoveMemberModalOpen(false);
          setMemberToRemove(null);
        }}
        title="Remove Member"
        subtitle="Are you sure you want to remove this member?"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {memberToRemove && (
              <>
                <strong>{memberToRemove.name}</strong>
                {memberToRemove.email && ` (${memberToRemove.email})`} will be removed from the organization.
              </>
            )}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsRemoveMemberModalOpen(false);
                setMemberToRemove(null);
              }}
            >
              No, Keep Member
            </Button>
            <Button
              onClick={confirmRemoveMember}
              disabled={removeMemberMutation.isPending}
            >
              Yes, Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
