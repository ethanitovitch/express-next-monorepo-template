"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/landing/CardSwap";
import LogoLoop from "@/components/landing/LogoLoop";
import GradualBlur from "@/components/landing/GradualBlur";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiPrisma, 
  SiPostgresql,
  SiExpress,
  SiZod,
  SiDocker,
  SiBetterstack,
  SiVercel,
  SiHetzner,
  SiCloudflare,
  SiNx,
  SiEslint,
  SiPrettier,
  SiStripe,
  SiRedis
} from "react-icons/si";
import { Shield, Zap, Users, Palette, Database, Lock, Terminal, Server, Layers, ArrowRight } from "lucide-react";

// Helper to get CSS color as hex using canvas for accurate conversion
function getCssColorAsHex(varName: string): string {
  if (typeof window === 'undefined') return '#ff6b35';
  
  try {
    // Get the computed color value
    const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!computed) return '#ff6b35';
    
    // Use canvas to convert any color format to RGB
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#ff6b35';
    
    ctx.fillStyle = computed;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    
    return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
  } catch {
    return '#ff6b35';
  }
}

// Hook to get theme colors as hex for WebGL
function useThemeColors() {
  // Warm fallback colors (orange/red - no green)
  const [colors, setColors] = useState<string[]>(['#ff6b35', '#f7931e', '#dc2626', '#fbbf24']);
  
  useEffect(() => {
    const loadColors = () => {
      const primary = getCssColorAsHex('--color-primary');
      const accent = getCssColorAsHex('--color-accent');
      const chart1 = getCssColorAsHex('--color-chart-1');
      const chart5 = getCssColorAsHex('--color-chart-5');
      
      setColors([primary, accent, chart1, chart5]);
    };
    
    // Load after CSS is ready
    if (document.readyState === 'complete') {
      loadColors();
    } else {
      window.addEventListener('load', loadColors);
    }
    
    // Also try on next frame
    requestAnimationFrame(loadColors);
    
    return () => window.removeEventListener('load', loadColors);
  }, []);
  
  return { colors, ready: true };
}

// Dynamic import for PrismaticBurst (WebGL heavy)
const PrismaticBurst = dynamic(() => import("@/components/landing/PrismaticBurst"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-background" />
});

// Dynamic import for CardSwap (GSAP)
const CardSwap = dynamic(() => import("@/components/landing/CardSwap"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />
});

const techLogos = [
  { node: <SiNextdotjs className="text-foreground" />, title: "Next.js" },
  { node: <SiReact className="text-primary" />, title: "React" },
  { node: <SiTypescript className="text-chart-2" />, title: "TypeScript" },
  { node: <SiTailwindcss className="text-primary" />, title: "Tailwind" },
  { node: <SiExpress className="text-foreground" />, title: "Express" },
  { node: <SiPrisma className="text-muted-foreground" />, title: "Prisma" },
  { node: <SiPostgresql className="text-chart-2" />, title: "PostgreSQL" },
  { node: <SiZod className="text-chart-5" />, title: "Zod" },
  { node: <SiDocker className="text-foreground" />, title: "Docker" },
  { node: <SiBetterstack className="text-foreground" />, title: "BetterStack" },
  { node: <SiVercel className="text-foreground" />, title: "Vercel" },
  { node: <SiHetzner className="text-foreground" />, title: "Hetzner" },
  { node: <SiCloudflare className="text-foreground" />, title: "Cloudflare" },
  { node: <SiNx className="text-foreground" />, title: "Nx" },
  { node: <SiEslint className="text-foreground" />, title: "Eslint" },
  { node: <SiPrettier className="text-foreground" />, title: "Prettier" },
  { node: <SiStripe className="text-foreground" />, title: "Stripe" },
  { node: <SiRedis className="text-foreground" />, title: "Redis" },
];

const features = [
  {
    icon: Shield,
    title: "Authentication",
    description: "Complete auth system with better-auth. Email verification, password reset, OAuth ready.",
    gradient: "from-primary to-chart-2"
  },
  {
    icon: Users,
    title: "Organizations",
    description: "Multi-tenant architecture. Invite members, manage roles, handle permissions.",
    gradient: "from-chart-2 to-chart-5"
  },
  {
    icon: Database,
    title: "Prisma + PostgreSQL",
    description: "Type-safe database queries. Migrations, seeding, and a clean schema out of the box.",
    gradient: "from-chart-5 to-chart-2"
  },
  {
    icon: Palette,
    title: "Theme Builder",
    description: "Visual theme customization. Export to Tailwind v4 CSS. 12 presets included.",
    gradient: "from-chart-2 to-primary"
  },
  {
    icon: Zap,
    title: "Monorepo Ready",
    description: "Shared types between frontend and backend. pnpm workspaces. Clean architecture.",
    gradient: "from-primary to-chart-2"
  },
  {
    icon: Lock,
    title: "Admin Dashboard",
    description: "Pre-built admin panel. User management, organization oversight, role controls.",
    gradient: "from-chart-2 to-chart-2"
  }
];

export default function Home() {
  const { colors: themeColors } = useThemeColors();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-primary">Template</span>
              <span className="text-muted-foreground">.io</span>
            </div>
            <div className="flex items-center gap-4">
            <Link
              href="/login"
                className="px-5 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section with PrismaticBurst */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* WebGL Background */}
          <div className="absolute inset-0 z-0">
            <PrismaticBurst
              key={themeColors.join(',')}
              animationType="rotate3d"
              intensity={1.8}
              speed={0.4}
              distort={1.2}
              paused={false}
              offset={{ x: 0, y: 0 }}
              hoverDampness={0.3}
              rayCount={18}
              mixBlendMode="screen"
              colors={themeColors}
            />
          </div>
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background z-10" />
          
          {/* Hero Content */}
          <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                Full-Stack TypeScript Monorepo
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
              <span className="block text-foreground">THE TEMPLATE</span>
              <span className="block bg-gradient-to-r from-primary via-chart-2 to-chart-5 bg-clip-text text-transparent">
                BEGINS HERE
              </span>
              </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop rebuilding auth, organizations, and dashboards. 
              Start with a production-ready foundation that scales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/signup"
                className="px-8 py-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                Start Building Now
                  </Link>
                  <Link
                href="#features"
                className="px-8 py-4 text-base font-semibold rounded-xl border-2 border-border text-foreground hover:bg-muted transition-all"
                  >
                Explore Features
                  </Link>
                </div>
              </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
            </div>
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="py-16 border-y border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Built with modern tools you already love
            </p>
          </div>
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={80}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--color-background)"
            ariaLabel="Technology stack"
          />
        </section>

        {/* Features with Card Swap */}
        <section id="features" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/30 text-accent-foreground mb-4">
                    EVERYTHING INCLUDED
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Ship faster with{" "}
                    <span className="text-primary">batteries included</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Authentication, organizations, admin panels, theme customization —
                    everything you need to launch your SaaS, internal tool, or side project.
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {features.slice(0, 3).map((feature, i) => (
                    <div 
                      key={i}
                      className="group p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all cursor-default"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                          <feature.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Card Swap Animation */}
              <div className="relative h-[500px] hidden lg:block">
                <CardSwap
                  cardDistance={50}
                  verticalDistance={60}
                  delay={4000}
                  pauseOnHover={true}
                  width={380}
                  height={280}
                  skewAmount={4}
                  easing="elastic"
                >
                  <Card className="p-6 bg-gradient-to-br from-card to-muted shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">Authentication</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secure login, signup, password reset, and email verification built-in.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary">better-auth</span>
                      <span className="px-2 py-1 text-xs rounded bg-accent/20 text-accent-foreground">OAuth Ready</span>
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-card to-muted shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <Users className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <h3 className="font-bold text-lg">Organizations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Multi-tenant system with invitations, roles, and member management.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary">Invites</span>
                      <span className="px-2 py-1 text-xs rounded bg-accent/20 text-accent-foreground">Roles</span>
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-card to-muted shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-chart-2/20">
                        <Palette className="w-5 h-5 text-chart-2" />
                      </div>
                      <h3 className="font-bold text-lg">Theme Builder</h3>
                  </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize colors, typography, and spacing. Export to Tailwind CSS.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary">12 Presets</span>
                      <span className="px-2 py-1 text-xs rounded bg-accent/20 text-accent-foreground">OKLCH</span>
                  </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </section>

        {/* More Features Grid */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                More than just a <span className="text-primary">boilerplate</span>
                </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A complete foundation with thoughtful architecture decisions already made for you.
                </p>
              </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div 
                  key={i}
                  className="group p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section with GradualBlur */}
        <section className="relative py-32 overflow-hidden">
          {/* Decorative blurrable background pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-2/5" />
            {/* Decorative circles that will be blurred at edges */}
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-chart-2/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-chart-2/5 blur-3xl" />
          </div>
          
          {/* Top GradualBlur - fades content from top */}
          <GradualBlur 
            position="top" 
            strength={4} 
            height="10rem" 
            curve="bezier"
            divCount={8}
            exponential
          />
          
          {/* Bottom GradualBlur - fades content from bottom */}
          <GradualBlur 
            position="bottom" 
            strength={4} 
            height="10rem" 
            curve="bezier"
            divCount={8}
            exponential
          />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-chart-2/20 text-chart-2 mb-4">
                CLEAN ARCHITECTURE
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Backend that <span className="text-primary">scales</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven architecture pattern that keeps your codebase organized as your project grows.
                Separate concerns, test easily, ship faster.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Entry Points */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Entry Points</h3>
                </div>
                
                {[
                  { name: "API Routes", desc: "Request → Controller → Service", icon: "🌐" },
                  { name: "CLI Commands", desc: "One-off scripts calling services", icon: "⌨️" },
                  { name: "Queue Jobs", desc: "Background processing via BullMQ", icon: "📬" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Services */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Server className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold text-lg">Business Logic</h3>
                </div>
                
                <div className="p-6 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2 text-primary">Services</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pure business logic. Services don&apos;t care where data comes from or goes to.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded bg-background/50">AuthService</span>
                    <span className="px-2 py-1 text-xs rounded bg-background/50">OrgService</span>
                    <span className="px-2 py-1 text-xs rounded bg-background/50">PaymentService</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 lg:rotate-0" />
                </div>
              </div>

              {/* Data Layer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-chart-2/20">
                    <Layers className="w-5 h-5 text-chart-2" />
                  </div>
                  <h3 className="font-bold text-lg">Data Layer</h3>
                </div>
                
                {[
                  { name: "Repositories", desc: "Database queries with Prisma-Kysely", color: "border-chart-2" },
                  { name: "Clients", desc: "Third-party API integrations", color: "border-chart-5" },
                  { name: "Utils", desc: "Shared helpers and formatters", color: "border-chart-2" },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 ${item.color} bg-card/50 backdrop-blur-sm`}>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "Type-Safe", desc: "End-to-end TypeScript with Zod validation" },
                { title: "Testable", desc: "Each layer can be tested in isolation" },
                { title: "Scalable", desc: "Add features without touching existing code" },
                { title: "Deployable", desc: "Coolify + Hetzner guide included" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4">
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to build{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-5 bg-clip-text text-transparent">
                something amazing?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Clone the repo, customize your theme, and start shipping features — not infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              >
                Create Your Account
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-base font-semibold rounded-xl border-2 border-border text-foreground hover:bg-muted transition-all"
              >
                View on GitHub
              </a>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Template.io — Built with the template itself.
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link>
                <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
