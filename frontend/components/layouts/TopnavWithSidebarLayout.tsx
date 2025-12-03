"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useActiveOrganization } from "@/lib/auth-client";
import { Search } from "lucide-react";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";

interface TopnavWithSidebarLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onOpenCreateOrg: () => void;
}

export function TopnavWithSidebarLayout({ children, onLogout, onOpenCreateOrg }: TopnavWithSidebarLayoutProps) {
  const { data: session } = useSession();
  const activeOrganization = useActiveOrganization();

  return (
    <div className="h-screen bg-muted/40 p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3 md:gap-4 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 md:h-18 flex-shrink-0 bg-card rounded-2xl border shadow-sm px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-foreground hover:opacity-80 transition">
            Update Me
          </Link>
          <div className="hidden md:flex items-center gap-2 w-72 lg:w-96 px-4 py-2 bg-muted rounded-xl text-sm text-muted-foreground">
            <Search className="w-4 h-4 flex-shrink-0" />
            <span>Search...</span>
            <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationsDropdown />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block text-sm">
              <div className="font-medium text-foreground">{session?.user?.name || "User"}</div>
              <div className="text-xs text-muted-foreground">{activeOrganization?.data?.name}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex gap-2 sm:gap-3 md:gap-4 min-h-0">
        {/* Sidebar - Desktop only, no mobile since we have topnav */}
        <aside className="hidden sm:flex w-56 md:w-60 bg-card rounded-2xl border shadow-sm flex-col flex-shrink-0">
          <Sidebar 
            onLogout={onLogout} 
            onOpenCreateOrg={onOpenCreateOrg} 
            variant="embedded"
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="h-full bg-card rounded-2xl border shadow-sm p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
