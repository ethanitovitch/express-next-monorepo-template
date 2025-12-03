"use client";

import { useState, useCallback } from "react";
import { Page } from "@/components/dashboard/Page";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { themePresets, type ThemeConfig } from "@/lib/themes";
import { 
  Palette, 
  Type, 
  Ruler, 
  Save, 
  ChevronDown, 
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Info,
  BarChart3,
  PanelLeft,
  Layers,
  Square,
  Layout,
  Loader2,
} from "lucide-react";
import { themeConfig as currentThemeConfig, type LayoutType } from "@/theme.config";

// ============================================
// TOOLTIP COMPONENT
// ============================================
function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex ml-1">
      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {text}
      </div>
    </div>
  );
}

// ============================================
// COLOR PICKER COMPONENT
// ============================================
function ColorPicker({ 
  label, 
  value, 
  onChange,
  tooltip
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  tooltip?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-border p-0"
          style={{ appearance: "none" }}
          aria-label={`Pick color for ${label}`}
          title={`Pick color for ${label}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-xs font-medium text-foreground truncate">{label}</p>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <button 
          onClick={handleCopy}
          className="text-[10px] text-muted-foreground font-mono hover:text-foreground flex items-center gap-1"
          aria-label={`Copy ${label} color value`}
        >
          {value.toUpperCase()}
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

// ============================================
// SLIDER COMPONENT
// ============================================
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  tooltip?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="py-1.5">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <label htmlFor={id} className="text-xs font-medium text-foreground">{label}</label>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <span className="text-xs text-muted-foreground font-mono">{value}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label={label}
      />
    </div>
  );
}

// ============================================
// COMPONENT SHOWCASE - Now with more components!
// ============================================
function ComponentShowcase({ theme }: { theme: ThemeConfig }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress] = useState(65);
  
  const themeStyles = {
    "--color-primary": theme.colors.primary,
    "--color-primary-foreground": theme.colors.primaryForeground,
    "--color-secondary": theme.colors.secondary,
    "--color-secondary-foreground": theme.colors.secondaryForeground,
    "--color-background": theme.colors.background,
    "--color-foreground": theme.colors.foreground,
    "--color-card": theme.colors.card,
    "--color-card-foreground": theme.colors.cardForeground,
    "--color-muted": theme.colors.muted,
    "--color-muted-foreground": theme.colors.mutedForeground,
    "--color-accent": theme.colors.accent,
    "--color-accent-foreground": theme.colors.accentForeground,
    "--color-destructive": theme.colors.destructive,
    "--color-border": theme.colors.border,
    "--color-input": theme.colors.input,
    "--color-ring": theme.colors.ring,
    "--radius": `${theme.spacing.radiusLg}px`,
    "--font-family": theme.typography.fontFamily,
    fontFamily: theme.typography.fontFamily,
    fontSize: `${theme.typography.fontSizeBase}px`,
    lineHeight: theme.typography.lineHeight,
    letterSpacing: `${theme.typography.letterSpacing}em`,
    background: theme.colors.background,
    color: theme.colors.foreground,
  } as React.CSSProperties;

  const borderStyle = `${theme.borders.width}px solid ${theme.colors.border}`;

  return (
    <div 
      className="p-6 rounded-xl border min-h-[700px] transition-all duration-300 overflow-auto"
      style={{ ...themeStyles, border: borderStyle }}
    >
      <div className="space-y-8">
        {/* Typography Preview */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.colors.foreground }}>
            <Type className="w-4 h-4" style={{ color: theme.colors.primary }} />
            Typography
          </h3>
          <div className="space-y-2">
            <p style={{ fontSize: `${theme.typography.fontSizeXxl}px`, fontWeight: 700, color: theme.colors.foreground }}>
              Display XXL - {theme.typography.fontSizeXxl}px
            </p>
            <p style={{ fontSize: `${theme.typography.fontSizeXl}px`, fontWeight: 600, color: theme.colors.foreground }}>
              Heading XL - {theme.typography.fontSizeXl}px
            </p>
            <p style={{ fontSize: `${theme.typography.fontSizeLg}px`, fontWeight: 500, color: theme.colors.foreground }}>
              Heading LG - {theme.typography.fontSizeLg}px
            </p>
            <p style={{ fontSize: `${theme.typography.fontSizeBase}px`, color: theme.colors.foreground }}>
              Body text - {theme.typography.fontSizeBase}px - The quick brown fox jumps over the lazy dog.
            </p>
            <p style={{ fontSize: `${theme.typography.fontSizeSm}px`, color: theme.colors.mutedForeground }}>
              Small / Caption - {theme.typography.fontSizeSm}px - Secondary information
            </p>
          </div>
        </section>

        {/* Color Swatches */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.colors.foreground }}>
            <Palette className="w-4 h-4" style={{ color: theme.colors.primary }} />
            Core Colors
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: "Primary", bg: theme.colors.primary, fg: theme.colors.primaryForeground },
              { name: "Secondary", bg: theme.colors.secondary, fg: theme.colors.secondaryForeground },
              { name: "Accent", bg: theme.colors.accent, fg: theme.colors.accentForeground },
              { name: "Muted", bg: theme.colors.muted, fg: theme.colors.mutedForeground },
              { name: "Destructive", bg: theme.colors.destructive, fg: theme.colors.destructiveForeground },
              { name: "Card", bg: theme.colors.card, fg: theme.colors.cardForeground },
              { name: "Border", bg: theme.colors.border, fg: theme.colors.foreground },
              { name: "Ring", bg: theme.colors.ring, fg: "#fff" },
            ].map((swatch) => (
              <div 
                key={swatch.name}
                className="rounded-lg p-3 text-center text-xs font-medium"
                style={{ 
                  backgroundColor: swatch.bg, 
                  color: swatch.fg,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                  border: swatch.name === "Card" ? borderStyle : "none",
                }}
              >
                {swatch.name}
              </div>
            ))}
          </div>
        </section>

        {/* Chart Colors */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.colors.foreground }}>
            <BarChart3 className="w-4 h-4" style={{ color: theme.colors.primary }} />
            Chart Colors
          </h3>
          <div className="flex gap-2">
            {[
              { name: "1", bg: theme.colors.chart1 },
              { name: "2", bg: theme.colors.chart2 },
              { name: "3", bg: theme.colors.chart3 },
              { name: "4", bg: theme.colors.chart4 },
              { name: "5", bg: theme.colors.chart5 },
            ].map((swatch) => (
              <div 
                key={swatch.name}
                className="flex-1 h-16 rounded-lg flex items-end justify-center pb-2 text-xs font-medium text-white"
                style={{ 
                  backgroundColor: swatch.bg,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                  height: `${40 + parseInt(swatch.name) * 12}px`
                }}
              >
                {swatch.name}
              </div>
            ))}
          </div>
        </section>

        {/* Tabs Component */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Tabs
          </h3>
          <div 
            className="flex gap-1 p-1"
            style={{ 
              backgroundColor: theme.colors.muted,
              borderRadius: `${theme.spacing.radiusMd}px`,
            }}
          >
            {["overview", "analytics", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 px-3 py-1.5 text-sm font-medium capitalize transition-colors"
                style={{
                  backgroundColor: activeTab === tab ? theme.colors.card : "transparent",
                  color: activeTab === tab ? theme.colors.foreground : theme.colors.mutedForeground,
                  borderRadius: `${theme.spacing.radiusSm}px`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Buttons
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: theme.colors.primary, 
                color: theme.colors.primaryForeground,
                borderRadius: `${theme.spacing.radiusMd}px`,
              }}
            >
              Primary
            </button>
            <button
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: theme.colors.secondary, 
                color: theme.colors.secondaryForeground,
                borderRadius: `${theme.spacing.radiusMd}px`,
              }}
            >
              Secondary
            </button>
            <button
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: "transparent", 
                color: theme.colors.foreground,
                borderRadius: `${theme.spacing.radiusMd}px`,
                border: borderStyle,
              }}
            >
              Outline
            </button>
            <button
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: theme.colors.destructive, 
                color: theme.colors.destructiveForeground,
                borderRadius: `${theme.spacing.radiusMd}px`,
              }}
            >
              Destructive
            </button>
            <button
              className="px-4 py-2 text-sm font-medium transition-colors hover:underline"
              style={{ 
                backgroundColor: "transparent", 
                color: theme.colors.primary,
              }}
            >
              Link
            </button>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            >
              Primary
            </span>
            <span
              className="px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: theme.colors.secondary,
                color: theme.colors.secondaryForeground,
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            >
              Secondary
            </span>
            <span
              className="px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: "transparent",
                color: theme.colors.foreground,
                borderRadius: `${theme.spacing.radiusSm}px`,
                border: borderStyle,
              }}
            >
              Outline
            </span>
            <span
              className="px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: theme.colors.destructive,
                color: theme.colors.destructiveForeground,
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            >
              Error
            </span>
            <span
              className="px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: theme.colors.chart1,
                color: "#fff",
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            >
              Chart 1
            </span>
          </div>
        </section>

        {/* Progress Bar */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Progress
          </h3>
          <div 
            className="h-2 w-full overflow-hidden"
            style={{ 
              backgroundColor: theme.colors.muted,
              borderRadius: `${theme.spacing.radiusSm}px`,
            }}
          >
            <div 
              className="h-full transition-all"
              style={{ 
                backgroundColor: theme.colors.primary,
                width: `${progress}%`,
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: theme.colors.mutedForeground }}>{progress}% complete</p>
        </section>

        {/* Form Elements */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Form Elements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                Text Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none transition-all"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                  border: borderStyle,
                }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="select-preview" className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                Select
              </label>
              <select
                id="select-preview"
                aria-label="Select option"
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                  border: borderStyle,
                }}
              >
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox-preview"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: theme.colors.primary }}
              />
              <label htmlFor="checkbox-preview" className="text-sm" style={{ color: theme.colors.foreground }}>
                Checkbox option
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSwitchChecked(!switchChecked)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ 
                  backgroundColor: switchChecked ? theme.colors.primary : theme.colors.muted,
                }}
                aria-label="Toggle switch"
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ 
                    transform: switchChecked ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
              <span className="text-sm" style={{ color: theme.colors.foreground }}>
                Switch toggle
              </span>
            </div>
          </div>
        </section>

        {/* Avatar & Status */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Avatars
          </h3>
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}
            >
              JD
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.secondaryForeground }}
            >
              AB
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: theme.colors.accent, color: theme.colors.accentForeground }}
            >
              XY
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: theme.colors.muted, borderRadius: `${theme.spacing.radiusMd}px` }}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: theme.colors.chart2, color: "#fff" }}
              >
                US
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.colors.foreground }}>User Name</p>
                <p className="text-xs" style={{ color: theme.colors.mutedForeground }}>user@example.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Cards
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="flex flex-col"
              style={{ 
                backgroundColor: theme.colors.card,
                color: theme.colors.cardForeground,
                borderRadius: `${theme.spacing.radiusLg}px`,
                border: borderStyle,
                padding: `${theme.spacing.paddingMd}px`,
              }}
            >
              <h4 className="font-semibold mb-1">Card Title</h4>
              <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                Card description with some content.
              </p>
              <button
                className="mt-4 px-3 py-1.5 text-xs font-medium self-start"
                style={{ 
                  backgroundColor: theme.colors.primary, 
                  color: theme.colors.primaryForeground,
                  borderRadius: `${theme.spacing.radiusSm}px`,
                }}
              >
                Action
              </button>
            </div>
            <div
              className="flex flex-col"
              style={{ 
                backgroundColor: theme.colors.muted,
                color: theme.colors.foreground,
                borderRadius: `${theme.spacing.radiusLg}px`,
                padding: `${theme.spacing.paddingMd}px`,
              }}
            >
              <h4 className="font-semibold mb-1">Muted Card</h4>
              <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                Alternative card style.
              </p>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Alerts
          </h3>
          <div className="space-y-3">
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ 
                backgroundColor: theme.colors.accent,
                color: theme.colors.accentForeground,
                borderRadius: `${theme.spacing.radiusMd}px`,
              }}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">This is an info alert message.</span>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ 
                backgroundColor: theme.colors.destructive + "20",
                color: theme.colors.destructive,
                borderRadius: `${theme.spacing.radiusMd}px`,
                border: `1px solid ${theme.colors.destructive}40`,
              }}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">This is an error alert message.</span>
            </div>
          </div>
        </section>

        {/* Sidebar Preview */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.colors.foreground }}>
            <PanelLeft className="w-4 h-4" style={{ color: theme.colors.primary }} />
            Sidebar Preview
          </h3>
          <div 
            className="w-56 p-3 space-y-2"
            style={{ 
              backgroundColor: theme.colors.sidebar,
              borderRadius: `${theme.spacing.radiusLg}px`,
              border: `1px solid ${theme.colors.sidebarBorder}`,
            }}
          >
            <div 
              className="px-3 py-2 text-sm font-medium flex items-center gap-2"
              style={{ 
                backgroundColor: theme.colors.sidebarAccent,
                color: theme.colors.sidebarAccentForeground,
                borderRadius: `${theme.spacing.radiusSm}px`,
              }}
            >
              <Layers className="w-4 h-4" />
              Dashboard
            </div>
            <div 
              className="px-3 py-2 text-sm flex items-center gap-2"
              style={{ color: theme.colors.sidebarForeground }}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </div>
            <div 
              className="px-3 py-2 text-sm flex items-center gap-2"
              style={{ color: theme.colors.sidebarForeground }}
            >
              <Palette className="w-4 h-4" />
              Settings
            </div>
          </div>
        </section>

        {/* Border Radius Preview */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.colors.foreground }}>
            <Square className="w-4 h-4" style={{ color: theme.colors.primary }} />
            Border Radius
          </h3>
          <div className="flex gap-4">
            {[
              { name: "SM", value: theme.spacing.radiusSm },
              { name: "MD", value: theme.spacing.radiusMd },
              { name: "LG", value: theme.spacing.radiusLg },
              { name: "XL", value: theme.spacing.radiusXl },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <div 
                  className="w-16 h-16 mb-2"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    borderRadius: `${item.value}px`,
                  }}
                />
                <p className="text-xs font-medium" style={{ color: theme.colors.foreground }}>{item.name}</p>
                <p className="text-xs" style={{ color: theme.colors.mutedForeground }}>{item.value}px</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modal Trigger */}
        <section>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
            Modal
          </h3>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm font-medium"
            style={{ 
              backgroundColor: theme.colors.primary, 
              color: theme.colors.primaryForeground,
              borderRadius: `${theme.spacing.radiusMd}px`,
            }}
          >
            Open Modal Preview
          </button>
        </section>
      </div>

      {/* Modal Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-md p-6"
            style={{ 
              backgroundColor: theme.colors.card,
              color: theme.colors.cardForeground,
              borderRadius: `${theme.spacing.radiusLg}px`,
              fontFamily: theme.typography.fontFamily,
              border: borderStyle,
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Modal Title</h3>
            <p className="text-sm mb-4" style={{ color: theme.colors.mutedForeground }}>
              This is a modal dialog preview with your current theme.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium"
                style={{ 
                  backgroundColor: "transparent",
                  color: theme.colors.foreground,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                  border: borderStyle,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium"
                style={{ 
                  backgroundColor: theme.colors.primary, 
                  color: theme.colors.primaryForeground,
                  borderRadius: `${theme.spacing.radiusMd}px`,
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SIDEBAR SECTION
// ============================================
function SidebarSection({ 
  title, 
  icon: Icon, 
  children,
  defaultOpen = true,
  description,
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  description?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
      >
        <div className="flex flex-col items-start">
          <span className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {title}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground font-normal mt-0.5">{description}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// COLOR GROUP COMPONENT
// ============================================
function ColorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</h4>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function ThemeBuilderPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "admin";
  
  const [theme, setTheme] = useState<ThemeConfig>(themePresets[0]);
  const [layout, setLayout] = useState<LayoutType>(currentThemeConfig.layout);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateColor = useCallback((key: keyof ThemeConfig["colors"], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  }, []);

  const updateTypography = useCallback((key: keyof ThemeConfig["typography"], value: number | string) => {
    setTheme(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  }, []);

  const updateSpacing = useCallback((key: keyof ThemeConfig["spacing"], value: number) => {
    setTheme(prev => ({
      ...prev,
      spacing: { ...prev.spacing, [key]: value }
    }));
  }, []);

  const updateBorders = useCallback((key: keyof ThemeConfig["borders"], value: number) => {
    setTheme(prev => ({
      ...prev,
      borders: { ...prev.borders, [key]: value }
    }));
  }, []);

  const layoutOptions: { value: LayoutType; label: string; description: string }[] = [
    { value: "sidebar", label: "Sidebar Only", description: "Floating sidebar on the left" },
    { value: "topnavWithSidebar", label: "Top Nav + Sidebar", description: "Top navigation bar with sidebar below" },
    { value: "sidebarWithTopbar", label: "Sidebar + Topbar", description: "Sidebar on left, topbar in content area" },
  ];

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout,
          colors: theme.colors,
          radius: {
            sm: theme.spacing.radiusSm,
            md: theme.spacing.radiusMd,
            lg: theme.spacing.radiusLg,
            xl: theme.spacing.radiusXl,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      
      toast.success("Theme saved! Restart the dev server to see changes.");
    } catch {
      toast.error("Failed to save theme config");
    } finally {
      setIsSaving(false);
    }
  };

  // Admin check - must be after all hooks
  if (!isPending && !isAdmin) {
    router.push("/dashboard");
    return null;
  }

  const handleLoadPreset = (preset: ThemeConfig) => {
    setTheme(preset);
    setPresetDropdownOpen(false);
    toast.success(`Loaded "${preset.name}" preset`);
  };

  const handleReset = () => {
    setTheme(themePresets[0]);
    toast.success("Reset to default");
  };

  // Generate code for themes.ts (to save as preset)
  const generatePresetCode = (): string => {
    const name = newThemeName || theme.name;
    return `createTheme({
  name: "${name}",
  colors: {
    primary: "${theme.colors.primary}",
    primaryForeground: "${theme.colors.primaryForeground}",
    secondary: "${theme.colors.secondary}",
    secondaryForeground: "${theme.colors.secondaryForeground}",
    background: "${theme.colors.background}",
    foreground: "${theme.colors.foreground}",
    card: "${theme.colors.card}",
    cardForeground: "${theme.colors.cardForeground}",
    muted: "${theme.colors.muted}",
    mutedForeground: "${theme.colors.mutedForeground}",
    accent: "${theme.colors.accent}",
    accentForeground: "${theme.colors.accentForeground}",
    destructive: "${theme.colors.destructive}",
    destructiveForeground: "${theme.colors.destructiveForeground}",
    border: "${theme.colors.border}",
    input: "${theme.colors.input}",
    ring: "${theme.colors.ring}",
    chart1: "${theme.colors.chart1}",
    chart2: "${theme.colors.chart2}",
    chart3: "${theme.colors.chart3}",
    chart4: "${theme.colors.chart4}",
    chart5: "${theme.colors.chart5}",
    sidebar: "${theme.colors.sidebar}",
    sidebarForeground: "${theme.colors.sidebarForeground}",
    sidebarPrimary: "${theme.colors.sidebarPrimary}",
    sidebarPrimaryForeground: "${theme.colors.sidebarPrimaryForeground}",
    sidebarAccent: "${theme.colors.sidebarAccent}",
    sidebarAccentForeground: "${theme.colors.sidebarAccentForeground}",
    sidebarBorder: "${theme.colors.sidebarBorder}",
  },
  typography: {
    fontFamily: "${theme.typography.fontFamily}",
    fontSizeBase: ${theme.typography.fontSizeBase},
    fontSizeSm: ${theme.typography.fontSizeSm},
    fontSizeLg: ${theme.typography.fontSizeLg},
    fontSizeXl: ${theme.typography.fontSizeXl},
    fontSizeXxl: ${theme.typography.fontSizeXxl},
    fontWeight: ${theme.typography.fontWeight},
    lineHeight: ${theme.typography.lineHeight},
    letterSpacing: ${theme.typography.letterSpacing},
  },
  spacing: {
    radiusSm: ${theme.spacing.radiusSm},
    radiusMd: ${theme.spacing.radiusMd},
    radiusLg: ${theme.spacing.radiusLg},
    radiusXl: ${theme.spacing.radiusXl},
    paddingSm: ${theme.spacing.paddingSm},
    paddingMd: ${theme.spacing.paddingMd},
    paddingLg: ${theme.spacing.paddingLg},
  },
  borders: {
    width: ${theme.borders.width},
  },
}),`;
  };

  const handleCopyPresetCode = () => {
    navigator.clipboard.writeText(generatePresetCode());
    toast.success("Preset code copied! Paste into themes.ts");
    setSaveModalOpen(false);
  };

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Page title="Theme Builder" subtitle="Customize your app's visual design and export to globals.css">
      <div className="flex gap-6">
        {/* Main Preview Area */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          <ComponentShowcase theme={theme} />
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Preset Selector */}
            <div className="p-4 border-b border-border bg-muted">
              <div className="relative">
                <button
                  onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium bg-card border border-border rounded-lg hover:bg-muted transition"
                >
                  <span className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    {theme.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {presetDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-border">
                      <p className="text-xs text-muted-foreground px-2">Select a preset to start from</p>
                    </div>
                    {themePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleLoadPreset(preset)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition text-left"
                      >
                        <div 
                          className="w-5 h-5 rounded border border-border flex-shrink-0"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{preset.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{preset.typography.fontFamily.split(",")[0]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings Panels */}
            <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
              <SidebarSection 
                title="Layout" 
                icon={Layout}
                description="Dashboard layout style"
              >
                <div className="space-y-2">
                  {layoutOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLayout(option.value)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border transition text-left ${
                        layout === option.value 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                        layout === option.value 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`}>
                        {layout === option.value && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection 
                title="Core Colors" 
                icon={Palette}
                description="Main UI element colors"
              >
                <ColorGroup title="Primary">
                  <ColorPicker label="Primary" value={theme.colors.primary} onChange={(v) => updateColor("primary", v)} tooltip="Main brand color - buttons, links, focus rings" />
                  <ColorPicker label="Primary Foreground" value={theme.colors.primaryForeground} onChange={(v) => updateColor("primaryForeground", v)} tooltip="Text on primary backgrounds" />
                </ColorGroup>
                <ColorGroup title="Secondary">
                  <ColorPicker label="Secondary" value={theme.colors.secondary} onChange={(v) => updateColor("secondary", v)} tooltip="Secondary actions, less prominent elements" />
                  <ColorPicker label="Secondary Foreground" value={theme.colors.secondaryForeground} onChange={(v) => updateColor("secondaryForeground", v)} tooltip="Text on secondary backgrounds" />
                </ColorGroup>
                <ColorGroup title="Background & Text">
                  <ColorPicker label="Background" value={theme.colors.background} onChange={(v) => updateColor("background", v)} tooltip="Page background color" />
                  <ColorPicker label="Foreground" value={theme.colors.foreground} onChange={(v) => updateColor("foreground", v)} tooltip="Main text color" />
                </ColorGroup>
                <ColorGroup title="Cards & Containers">
                  <ColorPicker label="Card" value={theme.colors.card} onChange={(v) => updateColor("card", v)} tooltip="Card and container backgrounds" />
                  <ColorPicker label="Card Foreground" value={theme.colors.cardForeground} onChange={(v) => updateColor("cardForeground", v)} tooltip="Text inside cards" />
                </ColorGroup>
                <ColorGroup title="Muted Elements">
                  <ColorPicker label="Muted" value={theme.colors.muted} onChange={(v) => updateColor("muted", v)} tooltip="Subtle backgrounds, disabled states" />
                  <ColorPicker label="Muted Foreground" value={theme.colors.mutedForeground} onChange={(v) => updateColor("mutedForeground", v)} tooltip="Secondary text, placeholders" />
                </ColorGroup>
                <ColorGroup title="Accent">
                  <ColorPicker label="Accent" value={theme.colors.accent} onChange={(v) => updateColor("accent", v)} tooltip="Hover states, highlights" />
                  <ColorPicker label="Accent Foreground" value={theme.colors.accentForeground} onChange={(v) => updateColor("accentForeground", v)} tooltip="Text on accent backgrounds" />
                </ColorGroup>
                <ColorGroup title="State & Borders">
                  <ColorPicker label="Destructive" value={theme.colors.destructive} onChange={(v) => updateColor("destructive", v)} tooltip="Error states, delete buttons" />
                  <ColorPicker label="Destructive Foreground" value={theme.colors.destructiveForeground} onChange={(v) => updateColor("destructiveForeground", v)} tooltip="Text on destructive backgrounds" />
                  <ColorPicker label="Border" value={theme.colors.border} onChange={(v) => updateColor("border", v)} tooltip="All borders and dividers" />
                  <ColorPicker label="Input" value={theme.colors.input} onChange={(v) => updateColor("input", v)} tooltip="Input field borders" />
                  <ColorPicker label="Ring" value={theme.colors.ring} onChange={(v) => updateColor("ring", v)} tooltip="Focus ring color" />
                </ColorGroup>
              </SidebarSection>

              <SidebarSection 
                title="Chart Colors" 
                icon={BarChart3} 
                defaultOpen={false}
                description="Data visualization palette"
              >
                <ColorPicker label="Chart 1" value={theme.colors.chart1} onChange={(v) => updateColor("chart1", v)} tooltip="Primary chart series" />
                <ColorPicker label="Chart 2" value={theme.colors.chart2} onChange={(v) => updateColor("chart2", v)} tooltip="Secondary chart series" />
                <ColorPicker label="Chart 3" value={theme.colors.chart3} onChange={(v) => updateColor("chart3", v)} tooltip="Tertiary chart series" />
                <ColorPicker label="Chart 4" value={theme.colors.chart4} onChange={(v) => updateColor("chart4", v)} tooltip="Fourth chart series" />
                <ColorPicker label="Chart 5" value={theme.colors.chart5} onChange={(v) => updateColor("chart5", v)} tooltip="Fifth chart series" />
              </SidebarSection>

              <SidebarSection 
                title="Sidebar Colors" 
                icon={PanelLeft} 
                defaultOpen={false}
                description="Navigation sidebar palette"
              >
                <ColorPicker label="Sidebar Background" value={theme.colors.sidebar} onChange={(v) => updateColor("sidebar", v)} tooltip="Sidebar background color" />
                <ColorPicker label="Sidebar Text" value={theme.colors.sidebarForeground} onChange={(v) => updateColor("sidebarForeground", v)} tooltip="Default sidebar text" />
                <ColorPicker label="Sidebar Primary" value={theme.colors.sidebarPrimary} onChange={(v) => updateColor("sidebarPrimary", v)} tooltip="Active item background" />
                <ColorPicker label="Sidebar Primary Text" value={theme.colors.sidebarPrimaryForeground} onChange={(v) => updateColor("sidebarPrimaryForeground", v)} tooltip="Active item text" />
                <ColorPicker label="Sidebar Accent" value={theme.colors.sidebarAccent} onChange={(v) => updateColor("sidebarAccent", v)} tooltip="Hover state background" />
                <ColorPicker label="Sidebar Accent Text" value={theme.colors.sidebarAccentForeground} onChange={(v) => updateColor("sidebarAccentForeground", v)} tooltip="Hover state text" />
                <ColorPicker label="Sidebar Border" value={theme.colors.sidebarBorder} onChange={(v) => updateColor("sidebarBorder", v)} tooltip="Sidebar dividers" />
              </SidebarSection>

              <SidebarSection 
                title="Typography" 
                icon={Type} 
                defaultOpen={false}
                description="Font settings"
              >
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <label htmlFor="font-family-select" className="text-xs font-medium text-foreground">Font Family</label>
                      <Tooltip text="Main font for all text" />
                    </div>
                    <select
                      id="font-family-select"
                      aria-label="Font Family"
                      value={theme.typography.fontFamily}
                      onChange={(e) => updateTypography("fontFamily", e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-card text-foreground"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter</option>
                      <option value="DM Sans, sans-serif">DM Sans</option>
                      <option value="Playfair Display, serif">Playfair Display</option>
                      <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                      <option value="Fira Code, monospace">Fira Code</option>
                      <option value="Space Grotesk, sans-serif">Space Grotesk</option>
                      <option value="Nunito, sans-serif">Nunito</option>
                      <option value="Quicksand, sans-serif">Quicksand</option>
                      <option value="system-ui, sans-serif">System UI</option>
                      <option value="Circular, Helvetica, Arial, sans-serif">Circular (Spotify)</option>
                    </select>
                  </div>
                  <Slider label="Base Size" value={theme.typography.fontSizeBase} onChange={(v) => updateTypography("fontSizeBase", v)} min={12} max={18} unit="px" tooltip="Default body text size" />
                  <Slider label="Small Size" value={theme.typography.fontSizeSm} onChange={(v) => updateTypography("fontSizeSm", v)} min={10} max={14} unit="px" tooltip="Captions and small labels" />
                  <Slider label="Large Size" value={theme.typography.fontSizeLg} onChange={(v) => updateTypography("fontSizeLg", v)} min={14} max={20} unit="px" tooltip="Subheadings" />
                  <Slider label="XL Size" value={theme.typography.fontSizeXl} onChange={(v) => updateTypography("fontSizeXl", v)} min={18} max={32} unit="px" tooltip="Section titles" />
                  <Slider label="XXL Size" value={theme.typography.fontSizeXxl} onChange={(v) => updateTypography("fontSizeXxl", v)} min={20} max={40} unit="px" tooltip="Page titles, hero text" />
                  <Slider label="Line Height" value={theme.typography.lineHeight} onChange={(v) => updateTypography("lineHeight", v)} min={1.2} max={2} step={0.1} tooltip="Spacing between lines" />
                  <Slider label="Letter Spacing" value={theme.typography.letterSpacing} onChange={(v) => updateTypography("letterSpacing", v)} min={-0.05} max={0.1} step={0.01} unit="em" tooltip="Space between letters" />
                </div>
              </SidebarSection>

              <SidebarSection 
                title="Border Radius" 
                icon={Square} 
                defaultOpen={false}
                description="Corner roundness"
              >
                <div className="space-y-2">
                  <Slider label="Radius SM" value={theme.spacing.radiusSm} onChange={(v) => updateSpacing("radiusSm", v)} min={0} max={16} unit="px" tooltip="Badges, small elements" />
                  <Slider label="Radius MD" value={theme.spacing.radiusMd} onChange={(v) => updateSpacing("radiusMd", v)} min={0} max={20} unit="px" tooltip="Buttons, inputs" />
                  <Slider label="Radius LG" value={theme.spacing.radiusLg} onChange={(v) => updateSpacing("radiusLg", v)} min={0} max={24} unit="px" tooltip="Cards, containers" />
                  <Slider label="Radius XL" value={theme.spacing.radiusXl} onChange={(v) => updateSpacing("radiusXl", v)} min={0} max={32} unit="px" tooltip="Modals, large elements" />
                </div>
              </SidebarSection>

              <SidebarSection 
                title="Borders & Spacing" 
                icon={Ruler} 
                defaultOpen={false}
                description="Sizes and widths"
              >
                <div className="space-y-2">
                  <Slider label="Border Width" value={theme.borders.width} onChange={(v) => updateBorders("width", v)} min={0} max={4} unit="px" tooltip="Thickness of all borders" />
                  <Slider label="Padding SM" value={theme.spacing.paddingSm} onChange={(v) => updateSpacing("paddingSm", v)} min={4} max={16} unit="px" tooltip="Tight spacing" />
                  <Slider label="Padding MD" value={theme.spacing.paddingMd} onChange={(v) => updateSpacing("paddingMd", v)} min={8} max={32} unit="px" tooltip="Default spacing" />
                  <Slider label="Padding LG" value={theme.spacing.paddingLg} onChange={(v) => updateSpacing("paddingLg", v)} min={16} max={48} unit="px" tooltip="Generous spacing" />
                </div>
              </SidebarSection>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-border bg-muted space-y-2">
              <Button 
                className="w-full" 
                onClick={handleSaveTheme}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save to theme.config.ts"}
              </Button>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => {
                  setNewThemeName("");
                  setSaveModalOpen(true);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Save as Preset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Preset Modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save as Preset"
        subtitle="Add this theme to themes.ts"
      >
        <div className="space-y-4">
          <Input
            label="Preset Name"
            value={newThemeName}
            onChange={(e) => setNewThemeName(e.target.value)}
            placeholder={theme.name}
          />
          <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre">
              {generatePresetCode()}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Copy this code and add it to the <code className="bg-muted px-1 rounded">themePresets</code> array in <code className="bg-muted px-1 rounded">lib/themes.ts</code>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCopyPresetCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </div>
      </Modal>

    </Page>
  );
}
