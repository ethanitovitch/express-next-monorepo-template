/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, LogOut, ChevronDown, Plus, Shield } from "lucide-react";
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
];

export default function Sidebar({
  onLogout,
  onOpenCreateOrg,
}: { 
  onLogout?: () => void;
  onOpenCreateOrg?: () => void;
}) {
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
    href, label, icon: Icon, active, onClick,
  }: { href: string; label: string; icon: any; active?: boolean; onClick?: () => void }) => (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-[var(--color-primary)] text-white"
          : "text-gray-800 hover:bg-gray-100",
      ].join(" ")}
    >
      <Icon className="h-5 w-5 opacity-90" />
      <span className="truncate">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-gray-900 hover:opacity-80 transition">
            Update Me
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={[
                "block w-6 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "rotate-45 translate-y-2" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "opacity-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out",
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
          <nav className="px-4 py-4 space-y-2 border-t border-gray-100">
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
              
            <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
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
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
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
                      text-gray-800
                      ${org.id === activeOrganization?.data?.id ? 'bg-gray-100' : 'hover:bg-gray-50'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 min-w-0 text-left text-gray-800">{org.name}</span>
                    {org.id === activeOrganization?.data?.id && (
                      <span className="flex-shrink-0 text-[var(--color-primary)]">✓</span>
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
                    text-[var(--color-primary)] hover:bg-gray-50 transition
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
                  text-red-600 hover:bg-red-50 transition
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
        className="
          fixed inset-y-0 left-0 z-20
          w-60 md:w-64
          border-r border-gray-200 bg-white/90 backdrop-blur
          px-3 py-4 md:px-4 md:py-6
          hidden sm:flex
          flex-col
        "
      >
        {/* Top: logo / app name */}
        <div className="mb-5 px-2">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-gray-900 hover:opacity-80 transition">
            Update Me
          </Link>
        </div>
        
        <div className="border-b border-gray-200 mb-6" />

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
            <div className="rounded-xl bg-gradient-to-b from-gray-100 to-white p-6 py-8 flex flex-col items-center justify-center w-full">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Make it happen
              </h3>
              <p className="text-xs text-gray-600 mb-3 text-center">
                Subscribe to get full access to Update Me
              </p>
              <Link 
                href="/dashboard/settings"
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition text-center"
              >
                Subscribe
              </Link>
            </div>
          </div>
        )}

        {/* Bottom actions pinned */}
        <div className="mt-auto space-y-2 pt-6 border-t border-gray-200">
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
                text-gray-800 hover:bg-gray-100 transition border border-gray-200
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {activeOrganization?.data?.name?.charAt(0).toUpperCase() || "O"}
                  </span>
                </div>
                <span className="truncate text-gray-800">{activeOrganization?.data?.name || "Organization"}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${orgDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {orgDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {organizations?.data?.map((org) => (
                    <button 
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      disabled={setActiveMutation.isPending}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm
                        hover:bg-gray-50 transition text-left
                        ${org.id === activeOrganization?.data?.id ? 'bg-gray-50' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate text-gray-800">{org.name}</span>
                      {org.id === activeOrganization?.data?.id && (
                        <span className="ml-auto text-xs text-[var(--color-primary)]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      setOrgDropdownOpen(false);
                      onOpenCreateOrg?.();
                    }}
                    className="
                      w-full flex items-center gap-3 px-3 py-2 text-sm font-medium
                      text-[var(--color-primary)] hover:bg-gray-50 transition
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
              text-red-600 hover:bg-red-50 transition
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

