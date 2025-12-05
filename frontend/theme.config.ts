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
    primary: "#6366f1",
    primaryForeground: "#ffffff",
    secondary: "#1e1b4b",
    secondaryForeground: "#e0e7ff",
    background: "#0f0f23",
    foreground: "#e2e8f0",
    card: "#1a1a2e",
    cardForeground: "#e2e8f0",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    accent: "#312e81",
    accentForeground: "#c7d2fe",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#334155",
    input: "#334155",
    ring: "#6366f1",
    // Charts
    chart1: "#6366f1",
    chart2: "#8b5cf6",
    chart3: "#a78bfa",
    chart4: "#818cf8",
    chart5: "#c084fc",
    // Sidebar
    sidebar: "#1a1a2e",
    sidebarForeground: "#e2e8f0",
    sidebarPrimary: "#6366f1",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#312e81",
    sidebarAccentForeground: "#c7d2fe",
    sidebarBorder: "#334155",
  },

  // Border radius (in pixels)
  radius: {
    sm: 6,
    md: 8,
    lg: 8,
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
