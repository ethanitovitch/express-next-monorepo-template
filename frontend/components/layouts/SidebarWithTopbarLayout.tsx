"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "@/lib/auth-client";
import { useActiveOrganization } from "@/lib/auth-client";
import { Search } from "lucide-react";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";

interface SidebarWithTopbarLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onOpenCreateOrg: () => void;
}

export function SidebarWithTopbarLayout({ children, onLogout, onOpenCreateOrg }: SidebarWithTopbarLayoutProps) {
  const { data: session } = useSession();
  const activeOrganization = useActiveOrganization();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-muted/40 p-2 sm:p-3 md:p-4 flex gap-2 sm:gap-3 md:gap-4 overflow-hidden">
      {/* Sidebar */}
      <aside className={`hidden sm:flex bg-card rounded-2xl border shadow-sm flex-col flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56 md:w-60'}`}>
        <Sidebar 
          onLogout={onLogout} 
          onOpenCreateOrg={onOpenCreateOrg} 
          variant="embedded"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Right side: Topbar + Content stacked */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-4 pt-16 sm:pt-0 min-h-0">
        {/* Mobile nav spacer handled by Sidebar component */}
        
        {/* Top Bar (inside content area) */}
        <header className="hidden sm:flex h-16 md:h-18 flex-shrink-0 bg-card rounded-2xl border shadow-sm px-4 md:px-6 items-center justify-between">
          <div className="relative w-72 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-12 py-2 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
          </div>
          
          <div className="flex items-center gap-3 pr-2">
            <NotificationsDropdown />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">{session?.user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground">{activeOrganization?.data?.name}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-0">
          <div className="h-full bg-card rounded-2xl border shadow-sm p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar (uses built-in mobile nav) - absolute to not affect flex layout */}
      <div className="sm:hidden absolute">
        <Sidebar onLogout={onLogout} onOpenCreateOrg={onOpenCreateOrg} />
      </div>
    </div>
  );
}
