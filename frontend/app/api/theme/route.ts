import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { layout, colors, radius } = body;

    // Generate the theme.config.ts content
    const content = `// ==============================================
// THEME CONFIG - Single source of truth
// Edit this file to change your app's layout and theme
// ==============================================

export type LayoutType = "sidebar" | "topnavWithSidebar" | "sidebarWithTopbar";

export const themeConfig = {
  // Layout: "sidebar" | "topnavWithSidebar" | "sidebarWithTopbar"
  layout: "${layout}" as LayoutType,

  // Theme colors (hex values)
  colors: {
    // Core
    primary: "${colors.primary}",
    primaryForeground: "${colors.primaryForeground}",
    secondary: "${colors.secondary}",
    secondaryForeground: "${colors.secondaryForeground}",
    background: "${colors.background}",
    foreground: "${colors.foreground}",
    card: "${colors.card}",
    cardForeground: "${colors.cardForeground}",
    muted: "${colors.muted}",
    mutedForeground: "${colors.mutedForeground}",
    accent: "${colors.accent}",
    accentForeground: "${colors.accentForeground}",
    destructive: "${colors.destructive}",
    destructiveForeground: "${colors.destructiveForeground}",
    border: "${colors.border}",
    input: "${colors.input}",
    ring: "${colors.ring}",
    // Charts
    chart1: "${colors.chart1}",
    chart2: "${colors.chart2}",
    chart3: "${colors.chart3}",
    chart4: "${colors.chart4}",
    chart5: "${colors.chart5}",
    // Sidebar
    sidebar: "${colors.sidebar}",
    sidebarForeground: "${colors.sidebarForeground}",
    sidebarPrimary: "${colors.sidebarPrimary}",
    sidebarPrimaryForeground: "${colors.sidebarPrimaryForeground}",
    sidebarAccent: "${colors.sidebarAccent}",
    sidebarAccentForeground: "${colors.sidebarAccentForeground}",
    sidebarBorder: "${colors.sidebarBorder}",
  },

  // Border radius (in pixels)
  radius: {
    sm: ${radius.sm},
    md: ${radius.md},
    lg: ${radius.lg},
    xl: ${radius.xl},
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
    "--radius-sm": \`\${config.radius.sm / 16}rem\`,
    "--radius-md": \`\${config.radius.md / 16}rem\`,
    "--radius-lg": \`\${config.radius.lg / 16}rem\`,
    "--radius-xl": \`\${config.radius.xl / 16}rem\`,
    // Typography
    "--font-sans": config.typography.fontFamily,
    "--font-mono": config.typography.fontMono,
  } as React.CSSProperties;
}
`;

    // Write to theme.config.ts
    const filePath = path.join(process.cwd(), "theme.config.ts");
    await writeFile(filePath, content, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save theme config:", error);
    return NextResponse.json(
      { error: "Failed to save theme config" },
      { status: 500 }
    );
  }
}

