import { useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  CalendarDays,
  FileText,
  Briefcase,
  Users,
  MapPin,
  BarChart3,
  Handshake,
  LogOut,
  Home,
  Menu,
  Settings,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { localGetAll } from "@/lib/localStore";
import type { TableName } from "@/types/siteTypes";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  table?: TableName;
}

const sidebarLinks: SidebarItem[] = [
  { label: "Dashboard",        path: "/admin",                  icon: LayoutDashboard },
  { label: "Inbox Messages",   path: "/admin/submissions",      icon: Mail,         table: "submissions" },
  { label: "Hero Slides",      path: "/admin/hero-slides",      icon: Image,        table: "hero_slides" },
  { label: "Events",           path: "/admin/events",           icon: CalendarDays, table: "events" },
  { label: "Blog Posts",       path: "/admin/blog-posts",       icon: FileText,     table: "blog_posts" },
  { label: "Portfolio",        path: "/admin/portfolio",        icon: Briefcase,    table: "portfolio_items" },
  { label: "Partners",         path: "/admin/partners",         icon: Handshake,    table: "partners" },
  { label: "Team",             path: "/admin/team",             icon: Users,        table: "team_members" },
  { label: "LGA Coordinators", path: "/admin/lga-coordinators", icon: MapPin,       table: "lga_coordinators" },
  { label: "Stats",            path: "/admin/stats",            icon: BarChart3,    table: "site_stats" },
  { label: "Settings & Backup",path: "/admin/settings",         icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const tally: Record<string, number> = {};
      for (const item of sidebarLinks) {
        if (item.table) {
          tally[item.table] = localGetAll(item.table).length;
        }
      }
      setCounts(tally);
    } catch {
      // Fallback
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground font-medium text-sm">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const navigationItems = (
    <>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;
          const count = link.table ? counts[link.table] : undefined;

          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-foreground/75 hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {count !== undefined && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Admin Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              <div className="flex items-center gap-2 border-b border-border p-4">
                <img src="/progressive-logo.png" alt="PAY" className="h-8 w-auto" />
                <div>
                  <span className="font-display text-sm font-bold text-primary block leading-none">PAY Admin</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Executive Suite</span>
                </div>
              </div>
              {navigationItems}
            </SheetContent>
          </Sheet>
          <span className="font-display text-sm font-bold text-foreground">Admin Console</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center justify-between border-b border-border p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/progressive-logo.png" alt="PAY" className="h-8 w-auto" />
            <div>
              <span className="font-display text-sm font-bold text-primary block leading-none">PAY Admin</span>
              <span className="text-[10px] text-muted-foreground font-mono">Executive Suite</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        {navigationItems}
      </aside>

      {/* Main Admin Content Container */}
      <main className="w-full p-4 sm:p-6 md:ml-64 md:w-[calc(100%-16rem)] min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
