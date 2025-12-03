/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, LogOut, ChevronDown, Plus, Shield, Palette, PanelLeftClose, PanelLeft } from "lucide-react";
import { useOrganizations, useSetActiveOrganizationMutation } from "@/hooks/api/useOrganization";
import { toast } from "sonner";
import { useActiveOrganization } from "@/lib/auth-client";
import { useOrganizationSubscription } from "@/hooks/api/useStripe";
import { useSession } from "@/lib/auth-client";

const nav = [
  { href: "/dashboard",  label: "Home",  icon: Home },
];

const bottom = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Admin", icon: Shield },
  { href: "/dashboard/theme-builder", label: "Theme Builder", icon: Palette },
];

export default function Sidebar({
  onLogout,
  onOpenCreateOrg,
  variant = "fixed",
  collapsed = false,
  onToggleCollapse,
}: { 
  onLogout?: () => void;
  onOpenCreateOrg?: () => void;
  variant?: "fixed" | "embedded";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const isEmbedded = variant === "embedded";
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeOrganization = useActiveOrganization();
  const { data: organizations } = useOrganizations();
  const setActiveMutation = useSetActiveOrganizationMutation();
  const { data: subscription } = useOrganizationSubscription(activeOrganization?.data?.id);
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchOrg = (orgId: string) => {
    setActiveMutation.mutate(
      { organizationId: orgId },
      {
        onSuccess: () => {
          toast.success("Organization switched successfully");
          setOrgDropdownOpen(false);
        },
        onError: () => {
          toast.error("Failed to switch organization");
        },
      }
    );
  };

  const Item = ({
    href, label, icon: Icon, active, onClick, isCollapsed,
  }: { href: string; label: string; icon: any; active?: boolean; onClick?: () => void; isCollapsed?: boolean }) => (
    <Link
      href={href}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted",
        isCollapsed ? "justify-center" : "",
      ].join(" ")}
    >
      <Icon className="h-5 w-5 opacity-90 flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  // Don't render mobile nav in embedded mode (parent handles it)
  if (isEmbedded) {
    return (
      <aside
        className="w-full h-full px-2 py-4 md:px-3 md:py-6 flex flex-col"
      >
        {/* Top: logo / app name + collapse toggle */}
        <div className={`mt-2 mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!collapsed && (
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight text-foreground hover:opacity-80 transition">
            Update Me
          </Link>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
          )}
        </div>
        
        <div className="border-b border-border mb-6" />

        {/* Primary nav */}
        <nav className="space-y-2">
          {nav.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={n.href === "/dashboard" ? pathname === n.href : pathname?.startsWith(n.href)}
              isCollapsed={collapsed}
            />
          ))}
          {isAdmin && adminNav.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname?.startsWith(n.href)}
              isCollapsed={collapsed}
            />
          ))}
        </nav>

        {/* Subscription Card - Only show if not subscribed and not collapsed */}
        {!subscription && !collapsed && (
          <div className="flex-1 flex items-center justify-center px-2">
            <div className="rounded-xl bg-gradient-to-b from-muted to-card p-6 py-8 flex flex-col items-center justify-center w-full border border-border">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Make it happen
              </h3>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Subscribe to get full access to Update Me
              </p>
              <Link 
                href="/dashboard/settings"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition text-center"
              >
                Subscribe
              </Link>
            </div>
          </div>
        )}

        {/* Bottom actions pinned */}
        <div className="mt-auto space-y-2 pt-6 border-t border-border">
          {bottom.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname?.startsWith(n.href)}
              isCollapsed={collapsed}
            />
          ))}

          {/* Organization Switcher */}
          <div className={`relative ${collapsed ? 'flex justify-center' : ''}`} ref={dropdownRef}>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              title={collapsed ? (activeOrganization?.data?.name || "Organization") : undefined}
              className={`
                group flex items-center rounded-xl text-sm font-medium
                text-foreground hover:bg-muted transition
                ${collapsed ? 'p-1.5' : 'w-full justify-between pl-1 pr-3 py-2 gap-3 border border-border'}
              `}
            >
              {collapsed ? (
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {activeOrganization?.data?.name?.charAt(0).toUpperCase() || "O"}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {activeOrganization?.data?.name?.charAt(0).toUpperCase() || "O"}
                  </span>
                </div>
                <span className="truncate text-foreground">{activeOrganization?.data?.name || "Organization"}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${orgDropdownOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Dropdown */}
            {orgDropdownOpen && (
              <div className={`absolute bottom-full mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 ${collapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'}`}>
                <div className="max-h-64 overflow-y-auto">
                  {organizations?.data?.map((org) => (
                    <button 
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      disabled={setActiveMutation.isPending}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm
                        hover:bg-muted/50 transition text-left
                        ${org.id === activeOrganization?.data?.id ? 'bg-muted' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate text-foreground">{org.name}</span>
                      {org.id === activeOrganization?.data?.id && (
                        <span className="ml-auto text-xs text-primary">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      setOrgDropdownOpen(false);
                      onOpenCreateOrg?.();
                    }}
                    className="
                      w-full flex items-center gap-3 px-3 py-2 text-sm font-medium
                      text-primary hover:bg-muted/50 transition
                    "
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              group flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium
              text-destructive hover:bg-destructive/10 transition
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="sm:hidden fixed top-2 left-2 right-2 z-30 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-foreground hover:opacity-80 transition">
            Update Me
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={[
                "block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "rotate-45 translate-y-2" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "opacity-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-foreground transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : "",
              ].join(" ")}
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <nav className="px-4 py-4 space-y-2 border-t border-border rounded-b-2xl">
            {nav.map((n) => (
              <Item
                key={n.href}
                href={n.href}
                label={n.label}
                icon={n.icon}
                active={n.href === "/dashboard" ? pathname === n.href : pathname?.startsWith(n.href)}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}

            {isAdmin && adminNav.map((n) => (
              <Item
                key={n.href}
                href={n.href}
                label={n.label}
                icon={n.icon}
                active={pathname?.startsWith(n.href)}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
              
            <div className="pt-2 mt-2 border-t border-border space-y-2">
              {bottom.map((n) => (
                <Item
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  icon={n.icon}
                  active={pathname?.startsWith(n.href)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}

              {/* Mobile Organization Switcher */}
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Organizations
                </div>
                {organizations?.data?.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      handleSwitchOrg(org.id);
                      setMobileMenuOpen(false);
                    }}
                    disabled={setActiveMutation.isPending}
                    className={`
                      w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
                      text-foreground
                      ${org.id === activeOrganization?.data?.id ? 'bg-muted' : 'hover:bg-muted/50'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 min-w-0 text-left text-foreground">{org.name}</span>
                    {org.id === activeOrganization?.data?.id && (
                      <span className="flex-shrink-0 text-primary">✓</span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCreateOrg?.();
                  }}
                  className="
                    w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium
                    text-primary hover:bg-muted/50 transition
                  "
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Organization</span>
                </button>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="
                  group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium
                  text-destructive hover:bg-destructive/10 transition
                "
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`
          ${isEmbedded 
            ? "w-full h-full" 
            : "fixed top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bottom-2 sm:bottom-3 md:bottom-4 z-20 w-56 md:w-60 border border-border bg-card rounded-2xl shadow-sm"
          }
          px-3 py-4 md:px-4 md:py-6
          hidden sm:flex
          flex-col
        `}
      >
        {/* Top: logo / app name */}
        <div className="mt-2 mb-5 px-2">
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight text-foreground hover:opacity-80 transition">
            Update Me
          </Link>
        </div>
        
        <div className="border-b border-border mb-6" />

        {/* Primary nav */}
        <nav className="space-y-2">
          {nav.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={n.href === "/dashboard" ? pathname === n.href : pathname?.startsWith(n.href)}
            />
          ))}
          {isAdmin && adminNav.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname?.startsWith(n.href)}
            />
          ))}
        </nav>

        {/* Subscription Card - Only show if not subscribed */}
        {!subscription && (
          <div className="flex-1 flex items-center justify-center px-2">
            <div className="rounded-xl bg-gradient-to-b from-muted to-card p-6 py-8 flex flex-col items-center justify-center w-full border border-border">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Make it happen
              </h3>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Subscribe to get full access to Update Me
              </p>
              <Link 
                href="/dashboard/settings"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition text-center"
              >
                Subscribe
              </Link>
            </div>
          </div>
        )}

        {/* Bottom actions pinned */}
        <div className="mt-auto space-y-2 pt-6 border-t border-border">
          {bottom.map((n) => (
            <Item
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname?.startsWith(n.href)}
            />
          ))}

          {/* Organization Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="
                group flex w-full items-center justify-between gap-3 rounded-xl pl-1 pr-3 py-2 text-sm font-medium
                text-foreground hover:bg-muted transition border border-border
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {activeOrganization?.data?.name?.charAt(0).toUpperCase() || "O"}
                  </span>
                </div>
                <span className="truncate text-foreground">{activeOrganization?.data?.name || "Organization"}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${orgDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {orgDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {organizations?.data?.map((org) => (
                    <button 
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      disabled={setActiveMutation.isPending}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm
                        hover:bg-muted/50 transition text-left
                        ${org.id === activeOrganization?.data?.id ? 'bg-muted' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate text-foreground">{org.name}</span>
                      {org.id === activeOrganization?.data?.id && (
                        <span className="ml-auto text-xs text-primary">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      setOrgDropdownOpen(false);
                      onOpenCreateOrg?.();
                    }}
                    className="
                      w-full flex items-center gap-3 px-3 py-2 text-sm font-medium
                      text-primary hover:bg-muted/50 transition
                    "
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="
              group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium
              text-destructive hover:bg-destructive/10 transition
            "
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

