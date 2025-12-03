// app/dashboard/layout.tsx
"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrganizations } from "@/hooks/api/useOrganization";
import CreateOrganizationModal from "@/components/organization/CreateOrganizationModal";
import { themeConfig } from "@/theme.config";
import {
  SidebarLayout,
  TopnavWithSidebarLayout,
  SidebarWithTopbarLayout,
} from "@/components/layouts";

const layoutMap = {
  sidebar: SidebarLayout,
  topnavWithSidebar: TopnavWithSidebarLayout,
  sidebarWithTopbar: SidebarWithTopbarLayout,
} as const;

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
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
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
    setManualShowCreateModal(false);
  };

  const handleOpenCreateOrg = () => {
    setModalAllowClose(true);
    setManualShowCreateModal(true);
  };

  // Select layout from config
  const LayoutComponent = layoutMap[themeConfig.layout] ?? layoutMap.sidebar;

  return (
    <>
      <LayoutComponent
        onLogout={handleLogout}
        onOpenCreateOrg={handleOpenCreateOrg}
      >
        {children}
      </LayoutComponent>

      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={hasNoOrgs ? () => {} : () => setManualShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        allowClose={modalAllowClose || !hasNoOrgs}
      />
    </>
  );
}
