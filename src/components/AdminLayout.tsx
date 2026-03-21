import { Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Image, CalendarDays, FileText, Briefcase, Users, MapPin, BarChart3, Handshake, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const sidebarLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Hero Slides", path: "/admin/hero-slides", icon: Image },
  { label: "Events", path: "/admin/events", icon: CalendarDays },
  { label: "Blog Posts", path: "/admin/blog-posts", icon: FileText },
  { label: "Portfolio", path: "/admin/portfolio", icon: Briefcase },
  { label: "Partners", path: "/admin/partners", icon: Handshake },
  { label: "Team", path: "/admin/team", icon: Users },
  { label: "LGA Coordinators", path: "/admin/lga-coordinators", icon: MapPin },
  { label: "Stats", path: "/admin/stats", icon: BarChart3 },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex h-screen items-center justify-center"><p className="text-muted-foreground font-medium">Loading...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <img src="/progressive-logo.png" alt="PAY" className="h-8 w-auto" />
          <span className="font-display text-sm font-bold text-primary">Admin Panel</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3 space-y-1">
          <Link to="/" className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground">
            <Home className="h-4 w-4" /> View Site
          </Link>
          <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-6 bg-muted/20 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
