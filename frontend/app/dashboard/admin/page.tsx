"use client";

import { useState } from "react";
import { Page } from "@/components/dashboard/Page";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  useAdminStats,
  useAdminUsers,
  useAdminOrganizations,
  useImpersonateUser,
  useAddOrganizationCredits,
} from "@/hooks/api/useAdmin";
import { useSession } from "@/lib/auth-client";
import { Users, Building2, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import type { AdminUser, AdminOrganization } from "@shared/types/src";

type Tab = "users" | "organizations";

function Pagination({ 
  page, 
  totalPages, 
  onPageChange,
  total,
  limit,
}: { 
  page: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
}) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
        <span className="text-sm text-foreground px-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}

function SearchBar({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
}) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
      />
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const { data: session } = useSession();
  
  // Search states
  const [usersSearch, setUsersSearch] = useState("");
  const [orgsSearch, setOrgsSearch] = useState("");

  // Add Credits Modal
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string } | null>(null);
  const [creditsAmount, setCreditsAmount] = useState("");
  const [creditsReason, setCreditsReason] = useState("");

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [orgsPage, setOrgsPage] = useState(1);
  
  const LIMIT = 20;

  // Reset page when search changes
  const handleUsersSearchChange = (search: string) => {
    setUsersSearch(search);
    setUsersPage(1);
  };
  
  const handleOrgsSearchChange = (search: string) => {
    setOrgsSearch(search);
    setOrgsPage(1);
  };

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ 
    page: usersPage, 
    limit: LIMIT, 
    search: usersSearch || undefined 
  });
  const { data: orgsData, isLoading: orgsLoading } = useAdminOrganizations({ 
    page: orgsPage, 
    limit: LIMIT, 
    search: orgsSearch || undefined 
  });
  
  const impersonateMutation = useImpersonateUser();
  const addCreditsMutation = useAddOrganizationCredits();

  const handleOpenAddCreditsModal = (org: AdminOrganization) => {
    setSelectedOrg({ id: org.id, name: org.name });
    setCreditsAmount("");
    setCreditsReason("");
    setIsAddCreditsModalOpen(true);
  };

  const handleAddCredits = () => {
    if (!selectedOrg) return;
    const amount = parseInt(creditsAmount, 10);
    if (isNaN(amount) || amount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }

    addCreditsMutation.mutate(
      { organizationId: selectedOrg.id, amount, reason: creditsReason || undefined },
      {
        onSuccess: (result) => {
          toast.success(`Added ${amount} credits to ${selectedOrg.name}. New balance: ${result.newBalance}`);
          setIsAddCreditsModalOpen(false);
          setSelectedOrg(null);
        },
        onError: () => {
          toast.error("Failed to add credits");
        },
      }
    );
  };

  const handleImpersonate = (userId: string, userName: string) => {
    impersonateMutation.mutate(userId, {
      onSuccess: (result) => {
        if (result.error) {
          toast.error(result.error.message || "Failed to impersonate user");
        } else {
          toast.success(`Now impersonating ${userName}`);
          window.location.href = "/dashboard";
        }
      },
      onError: () => {
        toast.error("Failed to impersonate user");
      },
    });
  };

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "users", label: "Users", icon: Users },
    { id: "organizations", label: "Organizations", icon: Building2 },
  ];

  return (
    <Page title="Admin" subtitle="Manage users, organizations, and interviews">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-semibold text-foreground">
                {statsLoading ? "..." : stats?.users ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organizations</p>
              <p className="text-2xl font-semibold text-foreground">
                {statsLoading ? "..." : stats?.organizations ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition
                ${activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <Card title="Users">
          <SearchBar 
            value={usersSearch} 
            onChange={handleUsersSearchChange} 
            placeholder="Search by email, name, or organization..."
          />
          {usersLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Organizations</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Verified</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.data?.map((user: AdminUser) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted">
                        <td className="py-3 px-4 text-foreground">{user.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.name || "-"}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user.organizations.length > 0 
                            ? user.organizations.join(", ") 
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                            user.emailVerified 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {user.emailVerified ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {user.id !== session?.user?.id && (
                            <button
                              onClick={() => handleImpersonate(user.id, user.name || user.email)}
                              disabled={impersonateMutation.isPending}
                              className="text-xs text-[var(--color-primary)] hover:underline disabled:opacity-50"
                            >
                              Impersonate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {usersData?.pagination && usersData.pagination.totalPages > 1 && (
                <Pagination
                  page={usersData.pagination.page}
                  totalPages={usersData.pagination.totalPages}
                  total={usersData.pagination.total}
                  limit={usersData.pagination.limit}
                  onPageChange={setUsersPage}
                />
              )}
            </>
          )}
        </Card>
      )}

      {activeTab === "organizations" && (
        <Card title="Organizations">
          <SearchBar 
            value={orgsSearch} 
            onChange={handleOrgsSearchChange} 
            placeholder="Search by name or slug..."
          />
          {orgsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading organizations...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Slug</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Members</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Credits</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgsData?.data?.map((org: AdminOrganization) => (
                      <tr key={org.id} className="border-b border-border/50 hover:bg-muted">
                        <td className="py-3 px-4 text-foreground font-medium">{org.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{org.slug}</td>
                        <td className="py-3 px-4 text-muted-foreground">{org.memberCount}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            org.creditBalance > 0 
                              ? "bg-green-100 text-green-700" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {org.creditBalance}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenAddCreditsModal(org)}
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                          >
                            <Plus className="h-3 w-3" />
                            Add Credits
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orgsData?.pagination && orgsData.pagination.totalPages > 1 && (
                <Pagination
                  page={orgsData.pagination.page}
                  totalPages={orgsData.pagination.totalPages}
                  total={orgsData.pagination.total}
                  limit={orgsData.pagination.limit}
                  onPageChange={setOrgsPage}
                />
              )}
            </>
          )}
        </Card>
      )}

      {/* Add Credits Modal */}
      <Modal
        isOpen={isAddCreditsModalOpen}
        onClose={() => {
          setIsAddCreditsModalOpen(false);
          setSelectedOrg(null);
        }}
        title="Add Credits"
        subtitle={selectedOrg ? `Add interview credits to ${selectedOrg.name}` : undefined}
      >
        <div className="space-y-4">
          <Input
            label="Number of Credits"
            type="number"
            min={1}
            value={creditsAmount}
            onChange={(e) => setCreditsAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">
              Reason (optional)
            </label>
            <textarea
              value={creditsReason}
              onChange={(e) => setCreditsReason(e.target.value)}
              placeholder="e.g., Promotional credits, Customer support adjustment..."
              className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none placeholder:text-muted-foreground"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCreditsModalOpen(false);
                setSelectedOrg(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCredits}
              disabled={addCreditsMutation.isPending || !creditsAmount}
            >
              Add Credits
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
