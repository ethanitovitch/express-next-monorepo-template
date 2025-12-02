// app/dashboard/layout.tsx
"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  useOrganizations,
} from "@/hooks/api/useOrganization";
import CreateOrganizationModal from "@/components/organization/CreateOrganizationModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [manualShowCreateModal, setManualShowCreateModal] = useState(false);
  const [modalAllowClose, setModalAllowClose] = useState(false);
  const { isLoading: isLoadingOrgs } = useOrganizations();
  const { data: organizations } = useOrganizations();

  // Derive whether to show modal from data
  const hasNoOrgs = !isPending && !isLoadingOrgs && session && organizations?.data?.length === 0;
  const showCreateModal = hasNoOrgs || manualShowCreateModal;

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to access the dashboard");
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleCreateSuccess = () => {
    // No need to invalidate - the store is already updated by the mutation
    setManualShowCreateModal(false);
  };

  const handleOpenCreateOrg = () => {
    setModalAllowClose(true); // Allow closing when creating additional orgs
    setManualShowCreateModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar onLogout={handleLogout} onOpenCreateOrg={handleOpenCreateOrg} />
        <main className="pt-16 sm:pt-0 sm:pl-60 md:pl-64 px-4 md:px-6 py-6 md:py-8">
          <div className="mx-auto max-w-[96rem]">
            {children}
          </div>
        </main>
      </div>

      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={hasNoOrgs ? () => {} : () => setManualShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        allowClose={modalAllowClose || !hasNoOrgs}
      />
    </>
  );
}
