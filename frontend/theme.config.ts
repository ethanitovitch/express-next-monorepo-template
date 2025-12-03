// ==============================================
// THEME CONFIG - Single source of truth
// Edit this file to change your app's layout and theme
// ==============================================

export type LayoutType = "sidebar" | "topnavWithSidebar" | "sidebarWithTopbar";

export const themeConfig = {
  // Layout: "sidebar" | "topnavWithSidebar" | "sidebarWithTopbar"
  layout: "sidebarWithTopbar" as LayoutType,

  // Theme colors (hex values)
  colors: {
    // Core
    primary: "#ff991c",
    primaryForeground: "#ffffff",
    secondary: "#f5f0eb",
    secondaryForeground: "#3d2a14",
    background: "#ffffff",
    foreground: "#0a0a0a",
    card: "#ffffff",
    cardForeground: "#0a0a0a",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    accent: "#f0e8e0",
    accentForeground: "#3d2a14",
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",
    border: "#e5e5e5",
    input: "#e5e5e5",
    ring: "#ff991c",
    // Charts
    chart1: "#ff991c",
    chart2: "#3b82f6",
    chart3: "#22c55e",
    chart4: "#f59e0b",
    chart5: "#ef4444",
    // Sidebar
    sidebar: "#fafafa",
    sidebarForeground: "#0a0a0a",
    sidebarPrimary: "#ff991c",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#f0e8e0",
    sidebarAccentForeground: "#3d2a14",
    sidebarBorder: "#e5e5e5",
  },

  // Border radius (in pixels)
  radius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
  },

  // Typography
  typography: {
    fontFamily: "var(--font-geist-sans)",
    fontMono: "var(--font-geist-mono)",
  },
};

// Helper to generate CSS variables from config
export function generateCSSVariables(config: typeof themeConfig) {
  return {
    // Colors
    "--color-background": config.colors.background,
    "--color-foreground": config.colors.foreground,
    "--color-card": config.colors.card,
    "--color-card-foreground": config.colors.cardForeground,
    "--color-popover": config.colors.card,
    "--color-popover-foreground": config.colors.cardForeground,
    "--color-primary": config.colors.primary,
    "--color-primary-foreground": config.colors.primaryForeground,
    "--color-secondary": config.colors.secondary,
    "--color-secondary-foreground": config.colors.secondaryForeground,
    "--color-muted": config.colors.muted,
    "--color-muted-foreground": config.colors.mutedForeground,
    "--color-accent": config.colors.accent,
    "--color-accent-foreground": config.colors.accentForeground,
    "--color-destructive": config.colors.destructive,
    "--color-destructive-foreground": config.colors.destructiveForeground,
    "--color-border": config.colors.border,
    "--color-input": config.colors.input,
    "--color-ring": config.colors.ring,
    "--color-chart-1": config.colors.chart1,
    "--color-chart-2": config.colors.chart2,
    "--color-chart-3": config.colors.chart3,
    "--color-chart-4": config.colors.chart4,
    "--color-chart-5": config.colors.chart5,
    "--color-sidebar": config.colors.sidebar,
    "--color-sidebar-foreground": config.colors.sidebarForeground,
    "--color-sidebar-primary": config.colors.sidebarPrimary,
    "--color-sidebar-primary-foreground": config.colors.sidebarPrimaryForeground,
    "--color-sidebar-accent": config.colors.sidebarAccent,
    "--color-sidebar-accent-foreground": config.colors.sidebarAccentForeground,
    "--color-sidebar-border": config.colors.sidebarBorder,
    "--color-sidebar-ring": config.colors.ring,
    // Radius
    "--radius-sm": `${config.radius.sm / 16}rem`,
    "--radius-md": `${config.radius.md / 16}rem`,
    "--radius-lg": `${config.radius.lg / 16}rem`,
    "--radius-xl": `${config.radius.xl / 16}rem`,
    // Typography
    "--font-sans": config.typography.fontFamily,
    "--font-mono": config.typography.fontMono,
  } as React.CSSProperties;
}
