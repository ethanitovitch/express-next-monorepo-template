"use client";

import Sidebar from "@/components/dashboard/Sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onOpenCreateOrg: () => void;
}

export function SidebarLayout({ children, onLogout, onOpenCreateOrg }: SidebarLayoutProps) {
  return (
    <div className="h-screen bg-muted/40 p-2 sm:p-3 md:p-4 flex gap-2 sm:gap-3 md:gap-4 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:flex w-56 md:w-60 bg-card rounded-2xl border shadow-sm flex-col flex-shrink-0">
        <Sidebar 
          onLogout={onLogout} 
          onOpenCreateOrg={onOpenCreateOrg} 
          variant="embedded"
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-0 pt-16 sm:pt-0">
        <div className="h-full bg-card rounded-2xl border shadow-sm p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar (uses built-in mobile nav) */}
      <div className="sm:hidden">
        <Sidebar onLogout={onLogout} onOpenCreateOrg={onOpenCreateOrg} />
      </div>
    </div>
  );
}
