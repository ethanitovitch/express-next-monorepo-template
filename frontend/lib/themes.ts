// ==============================================
// THEME PRESETS - For the Theme Builder only
// These are saved presets you can load in the builder
// ==============================================

export interface ThemeConfig {
  name: string;
  colors: {
    // Core colors
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    // Chart colors
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    // Sidebar colors
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
  };
  typography: {
    fontFamily: string;
    fontSizeBase: number;
    fontSizeSm: number;
    fontSizeLg: number;
    fontSizeXl: number;
    fontSizeXxl: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  spacing: {
    radiusSm: number;
    radiusMd: number;
    radiusLg: number;
    radiusXl: number;
    paddingSm: number;
    paddingMd: number;
    paddingLg: number;
  };
  borders: {
    width: number;
  };
}

// Helper to create a theme with defaults
function createTheme(partial: {
  name: string;
  colors: ThemeConfig["colors"];
  typography?: Partial<ThemeConfig["typography"]>;
  spacing?: Partial<ThemeConfig["spacing"]>;
  borders?: Partial<ThemeConfig["borders"]>;
}): ThemeConfig {
  return {
    name: partial.name,
    colors: partial.colors,
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSizeBase: 14,
      fontSizeSm: 12,
      fontSizeLg: 16,
      fontSizeXl: 20,
      fontSizeXxl: 24,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
      ...(partial.typography || {}),
    },
    spacing: {
      radiusSm: 6,
      radiusMd: 8,
      radiusLg: 10,
      radiusXl: 14,
      paddingSm: 8,
      paddingMd: 16,
      paddingLg: 24,
      ...(partial.spacing || {}),
    },
    borders: {
      width: 1,
      ...(partial.borders || {}),
    },
  };
}

// Add your saved presets here
export const themePresets: ThemeConfig[] = [
  // ========== LIGHT THEMES ==========
  createTheme({
    name: "Default",
    colors: {
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
      chart1: "#ff991c",
      chart2: "#3b82f6",
      chart3: "#22c55e",
      chart4: "#f59e0b",
      chart5: "#ef4444",
      sidebar: "#fafafa",
      sidebarForeground: "#0a0a0a",
      sidebarPrimary: "#ff991c",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#f0e8e0",
      sidebarAccentForeground: "#3d2a14",
      sidebarBorder: "#e5e5e5",
    },
  }),

  createTheme({
    name: "Clean Slate",
    colors: {
      primary: "#18181b",
      primaryForeground: "#fafafa",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      background: "#ffffff",
      foreground: "#09090b",
      card: "#ffffff",
      cardForeground: "#09090b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      accent: "#f4f4f5",
      accentForeground: "#18181b",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#18181b",
      chart1: "#18181b",
      chart2: "#71717a",
      chart3: "#a1a1aa",
      chart4: "#d4d4d8",
      chart5: "#52525b",
      sidebar: "#fafafa",
      sidebarForeground: "#09090b",
      sidebarPrimary: "#18181b",
      sidebarPrimaryForeground: "#fafafa",
      sidebarAccent: "#f4f4f5",
      sidebarAccentForeground: "#18181b",
      sidebarBorder: "#e4e4e7",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
    },
  }),

  createTheme({
    name: "Ocean",
    colors: {
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#e0f2fe",
      secondaryForeground: "#0c4a6e",
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      card: "#ffffff",
      cardForeground: "#0c4a6e",
      muted: "#e0f2fe",
      mutedForeground: "#0369a1",
      accent: "#bae6fd",
      accentForeground: "#0c4a6e",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#7dd3fc",
      input: "#bae6fd",
      ring: "#0ea5e9",
      chart1: "#0ea5e9",
      chart2: "#06b6d4",
      chart3: "#14b8a6",
      chart4: "#0891b2",
      chart5: "#0284c7",
      sidebar: "#f0f9ff",
      sidebarForeground: "#0c4a6e",
      sidebarPrimary: "#0ea5e9",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#bae6fd",
      sidebarAccentForeground: "#0c4a6e",
      sidebarBorder: "#7dd3fc",
    },
    typography: {
      fontFamily: "DM Sans, sans-serif",
    },
    spacing: {
      radiusLg: 12,
    },
  }),

  createTheme({
    name: "Forest",
    colors: {
      primary: "#22c55e",
      primaryForeground: "#ffffff",
      secondary: "#dcfce7",
      secondaryForeground: "#166534",
      background: "#f0fdf4",
      foreground: "#14532d",
      card: "#ffffff",
      cardForeground: "#14532d",
      muted: "#ecfdf5",
      mutedForeground: "#16a34a",
      accent: "#bbf7d0",
      accentForeground: "#166534",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#86efac",
      input: "#bbf7d0",
      ring: "#22c55e",
      chart1: "#22c55e",
      chart2: "#10b981",
      chart3: "#14b8a6",
      chart4: "#059669",
      chart5: "#16a34a",
      sidebar: "#f0fdf4",
      sidebarForeground: "#14532d",
      sidebarPrimary: "#22c55e",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#bbf7d0",
      sidebarAccentForeground: "#166534",
      sidebarBorder: "#86efac",
    },
    typography: {
      fontFamily: "DM Sans, sans-serif",
      fontSizeBase: 15,
    },
    spacing: {
      radiusLg: 12,
    },
  }),

  createTheme({
    name: "Rose Garden",
    colors: {
      primary: "#f43f5e",
      primaryForeground: "#ffffff",
      secondary: "#ffe4e6",
      secondaryForeground: "#9f1239",
      background: "#fff1f2",
      foreground: "#881337",
      card: "#ffffff",
      cardForeground: "#881337",
      muted: "#fecdd3",
      mutedForeground: "#be123c",
      accent: "#fda4af",
      accentForeground: "#9f1239",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      border: "#fda4af",
      input: "#fecdd3",
      ring: "#f43f5e",
      chart1: "#f43f5e",
      chart2: "#ec4899",
      chart3: "#d946ef",
      chart4: "#fb7185",
      chart5: "#e11d48",
      sidebar: "#fff1f2",
      sidebarForeground: "#881337",
      sidebarPrimary: "#f43f5e",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#fda4af",
      sidebarAccentForeground: "#9f1239",
      sidebarBorder: "#fda4af",
    },
    typography: {
      fontFamily: "Playfair Display, serif",
    },
  }),

  // ========== DARK THEMES ==========
  createTheme({
    name: "Midnight",
    colors: {
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
      chart1: "#6366f1",
      chart2: "#8b5cf6",
      chart3: "#a78bfa",
      chart4: "#818cf8",
      chart5: "#c084fc",
      sidebar: "#1a1a2e",
      sidebarForeground: "#e2e8f0",
      sidebarPrimary: "#6366f1",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#312e81",
      sidebarAccentForeground: "#c7d2fe",
      sidebarBorder: "#334155",
    },
    typography: {
      fontFamily: "JetBrains Mono, monospace",
      lineHeight: 1.6,
    },
    spacing: {
      radiusLg: 8,
    },
  }),

  createTheme({
    name: "Spotify",
    colors: {
      primary: "#1db954",
      primaryForeground: "#000000",
      secondary: "#282828",
      secondaryForeground: "#b3b3b3",
      background: "#121212",
      foreground: "#ffffff",
      card: "#181818",
      cardForeground: "#ffffff",
      muted: "#282828",
      mutedForeground: "#b3b3b3",
      accent: "#1db954",
      accentForeground: "#000000",
      destructive: "#e91429",
      destructiveForeground: "#ffffff",
      border: "#282828",
      input: "#3e3e3e",
      ring: "#1db954",
      chart1: "#1db954",
      chart2: "#1ed760",
      chart3: "#2ebd59",
      chart4: "#1fdf64",
      chart5: "#169c46",
      sidebar: "#000000",
      sidebarForeground: "#b3b3b3",
      sidebarPrimary: "#1db954",
      sidebarPrimaryForeground: "#000000",
      sidebarAccent: "#282828",
      sidebarAccentForeground: "#ffffff",
      sidebarBorder: "#282828",
    },
    typography: {
      fontFamily: "Circular, Helvetica, Arial, sans-serif",
      fontWeight: 500,
    },
    spacing: {
      radiusLg: 8,
      radiusXl: 12,
    },
  }),

  createTheme({
    name: "Neo Brutalism",
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#ffde59",
      secondaryForeground: "#000000",
      background: "#ffffff",
      foreground: "#000000",
      card: "#ffffff",
      cardForeground: "#000000",
      muted: "#f5f5f5",
      mutedForeground: "#525252",
      accent: "#ff6b6b",
      accentForeground: "#000000",
      destructive: "#ff0000",
      destructiveForeground: "#ffffff",
      border: "#000000",
      input: "#000000",
      ring: "#000000",
      chart1: "#ff6b6b",
      chart2: "#ffde59",
      chart3: "#4ecdc4",
      chart4: "#a78bfa",
      chart5: "#f472b6",
      sidebar: "#ffde59",
      sidebarForeground: "#000000",
      sidebarPrimary: "#000000",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#ffffff",
      sidebarAccentForeground: "#000000",
      sidebarBorder: "#000000",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      fontWeight: 700,
    },
    spacing: {
      radiusSm: 0,
      radiusMd: 0,
      radiusLg: 0,
      radiusXl: 0,
    },
    borders: {
      width: 3,
    },
  }),

  createTheme({
    name: "Dracula",
    colors: {
      primary: "#bd93f9",
      primaryForeground: "#282a36",
      secondary: "#44475a",
      secondaryForeground: "#f8f8f2",
      background: "#282a36",
      foreground: "#f8f8f2",
      card: "#44475a",
      cardForeground: "#f8f8f2",
      muted: "#44475a",
      mutedForeground: "#6272a4",
      accent: "#ff79c6",
      accentForeground: "#282a36",
      destructive: "#ff5555",
      destructiveForeground: "#f8f8f2",
      border: "#6272a4",
      input: "#44475a",
      ring: "#bd93f9",
      chart1: "#bd93f9",
      chart2: "#ff79c6",
      chart3: "#8be9fd",
      chart4: "#50fa7b",
      chart5: "#ffb86c",
      sidebar: "#21222c",
      sidebarForeground: "#f8f8f2",
      sidebarPrimary: "#bd93f9",
      sidebarPrimaryForeground: "#282a36",
      sidebarAccent: "#44475a",
      sidebarAccentForeground: "#f8f8f2",
      sidebarBorder: "#6272a4",
    },
    typography: {
      fontFamily: "Fira Code, monospace",
    },
  }),

  createTheme({
    name: "Sunset",
    colors: {
      primary: "#f97316",
      primaryForeground: "#ffffff",
      secondary: "#fef3c7",
      secondaryForeground: "#92400e",
      background: "#fffbeb",
      foreground: "#78350f",
      card: "#ffffff",
      cardForeground: "#78350f",
      muted: "#fef3c7",
      mutedForeground: "#b45309",
      accent: "#fed7aa",
      accentForeground: "#9a3412",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      border: "#fdba74",
      input: "#fed7aa",
      ring: "#f97316",
      chart1: "#f97316",
      chart2: "#fb923c",
      chart3: "#fbbf24",
      chart4: "#f59e0b",
      chart5: "#ea580c",
      sidebar: "#fffbeb",
      sidebarForeground: "#78350f",
      sidebarPrimary: "#f97316",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#fed7aa",
      sidebarAccentForeground: "#9a3412",
      sidebarBorder: "#fdba74",
    },
    typography: {
      fontFamily: "Nunito, sans-serif",
    },
    spacing: {
      radiusLg: 16,
      radiusXl: 20,
    },
  }),

  createTheme({
    name: "Terminal",
    colors: {
      primary: "#00ff00",
      primaryForeground: "#000000",
      secondary: "#003300",
      secondaryForeground: "#00ff00",
      background: "#000000",
      foreground: "#00ff00",
      card: "#0a0a0a",
      cardForeground: "#00ff00",
      muted: "#1a1a1a",
      mutedForeground: "#00aa00",
      accent: "#003300",
      accentForeground: "#00ff00",
      destructive: "#ff0000",
      destructiveForeground: "#ffffff",
      border: "#00aa00",
      input: "#1a1a1a",
      ring: "#00ff00",
      chart1: "#00ff00",
      chart2: "#00ffff",
      chart3: "#ffff00",
      chart4: "#ff00ff",
      chart5: "#00aaff",
      sidebar: "#0a0a0a",
      sidebarForeground: "#00ff00",
      sidebarPrimary: "#00ff00",
      sidebarPrimaryForeground: "#000000",
      sidebarAccent: "#003300",
      sidebarAccentForeground: "#00ff00",
      sidebarBorder: "#00aa00",
    },
    typography: {
      fontFamily: "JetBrains Mono, Fira Code, monospace",
      fontSizeBase: 13,
      lineHeight: 1.4,
    },
    spacing: {
      radiusSm: 0,
      radiusMd: 0,
      radiusLg: 2,
      radiusXl: 4,
    },
  }),

  createTheme({
    name: "Lavender Dreams",
    colors: {
      primary: "#8b5cf6",
      primaryForeground: "#ffffff",
      secondary: "#ede9fe",
      secondaryForeground: "#5b21b6",
      background: "#faf5ff",
      foreground: "#4c1d95",
      card: "#ffffff",
      cardForeground: "#4c1d95",
      muted: "#f3e8ff",
      mutedForeground: "#7c3aed",
      accent: "#ddd6fe",
      accentForeground: "#5b21b6",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#c4b5fd",
      input: "#ddd6fe",
      ring: "#8b5cf6",
      chart1: "#8b5cf6",
      chart2: "#a78bfa",
      chart3: "#c084fc",
      chart4: "#d946ef",
      chart5: "#7c3aed",
      sidebar: "#faf5ff",
      sidebarForeground: "#4c1d95",
      sidebarPrimary: "#8b5cf6",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#ddd6fe",
      sidebarAccentForeground: "#5b21b6",
      sidebarBorder: "#c4b5fd",
    },
    typography: {
      fontFamily: "Quicksand, sans-serif",
    },
    spacing: {
      radiusLg: 16,
    },
  }),
];
