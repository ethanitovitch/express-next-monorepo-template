"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onOpenCreateOrg: () => void;
}

export function SidebarLayout({ children, onLogout, onOpenCreateOrg }: SidebarLayoutProps) {
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

      {/* Main Content */}
      <main className="flex-1 min-h-0 pt-16 sm:pt-0">
        <div className="h-full bg-card rounded-2xl border shadow-sm p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar (uses built-in mobile nav) - absolute to not affect flex layout */}
      <div className="sm:hidden absolute">
        <Sidebar onLogout={onLogout} onOpenCreateOrg={onOpenCreateOrg} />
      </div>
    </div>
  );
}
