import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Briefcase,
  Users,
  Handshake,
  Image,
  MapPin,
  BarChart3,
  ArrowRight,
  Plus,
  Mail,
  History,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTable } from "@/hooks/useAdminData";
import { getAuditLogs, type AuditLogEntry } from "@/lib/auditLog";
import type { SiteEvent, BlogPost, LgaCoordinator, FormSubmission } from "@/types/siteTypes";

// Module registry
const modules = [
  { label: "Inbox Messages",   icon: Mail,         path: "/admin/submissions",      table: "submissions"      as const, desc: "Public visitor inquiries" },
  { label: "Events",           icon: CalendarDays, path: "/admin/events",           table: "events"           as const, desc: "Rallies, summits & campaigns" },
  { label: "Blog Posts",       icon: FileText,     path: "/admin/blog-posts",       table: "blog_posts"       as const, desc: "Press statements & news" },
  { label: "Hero Slides",      icon: Image,        path: "/admin/hero-slides",      table: "hero_slides"      as const, desc: "Homepage banners" },
  { label: "Portfolio",        icon: Briefcase,    path: "/admin/portfolio",        table: "portfolio_items"  as const, desc: "Completed projects & gallery" },
  { label: "Partners",         icon: Handshake,    path: "/admin/partners",         table: "partners"         as const, desc: "Partner institutions & NGOs" },
  { label: "Team",             icon: Users,        path: "/admin/team",             table: "team_members"     as const, desc: "Executive council members" },
  { label: "LGA Coordinators", icon: MapPin,       path: "/admin/lga-coordinators", table: "lga_coordinators" as const, desc: "17-LGA grassroots leaders" },
  { label: "Site Stats",       icon: BarChart3,    path: "/admin/stats",            table: "site_stats"       as const, desc: "Key numerical metrics" },
];

// Senatorial zones for Abia's 17 LGAs
const SENATORIAL_ZONES: Record<string, string[]> = {
  "Abia Central": ["Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Osisioma", "Umuahia North", "Umuahia South"],
  "Abia North": ["Arochukwu", "Bende", "Isuikwuato", "Ohafia", "Umu Nneochi"],
  "Abia South": ["Aba North", "Aba South", "Obi Ngwa", "Ugwunagbo", "Ukwa East", "Ukwa West"],
};

const AdminDashboard = () => {
  const { data: events } = useAdminTable("events");
  const { data: blogPosts } = useAdminTable("blog_posts");
  const { data: lgas } = useAdminTable("lga_coordinators");
  const { data: submissions } = useAdminTable("submissions");

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("Abia Central");

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const unreadCount = submissions.filter((s: FormSubmission) => !s.is_read).length;

  // Filter LGAs by selected senatorial zone
  const zoneLgaNames = SENATORIAL_ZONES[selectedZone] || [];
  const displayedLgas = lgas.filter((lga: LgaCoordinator) =>
    zoneLgaNames.some((name) => name.toLowerCase() === lga.lga.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl pb-16">
        {/* Top Header - Clean, Authoritative, No Fluff */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Progressive Abia Youths Secretariat &bull; Content and grassroots coordination portal
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link to="/admin/events">
              <Button size="sm" variant="outline" className="text-xs font-semibold h-9">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Event
              </Button>
            </Link>
            <Link to="/admin/blog-posts">
              <Button size="sm" className="text-xs font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Post
              </Button>
            </Link>
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-9">
                View Site <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Cohesive KPI Strip - Calm, Organized Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Events */}
          <Link to="/admin/events" className="group">
            <Card className="border-border bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Events
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-foreground">
                    {events.length}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Rallies &amp; programs
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 2. Blog Posts */}
          <Link to="/admin/blog-posts" className="group">
            <Card className="border-border bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Press &amp; News
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-foreground">
                    {blogPosts.length}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Published articles
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 3. LGAs */}
          <Link to="/admin/lga-coordinators" className="group">
            <Card className="border-border bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    17-LGA Network
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-foreground">
                    17
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Statewide coverage
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 4. Inbox */}
          <Link to="/admin/submissions" className="group">
            <Card className="border-border bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Inbox Inquiries
                  </span>
                  <div className="p-1.5 rounded-md bg-muted text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-extrabold font-mono text-foreground">
                      {submissions.length}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Messages received
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main 2-Column Balanced Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Primary Management - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Content Modules Navigator */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Portal Content Modules</CardTitle>
                    <CardDescription className="text-xs">
                      Quick access to edit and publish across all sections.
                    </CardDescription>
                  </div>
                  <Link to="/admin/settings">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-8">
                      <Settings className="h-3.5 w-3.5 mr-1" /> Backup &amp; Reset
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {modules.map((m) => {
                    const Icon = m.icon;
                    return (
                      <Link
                        key={m.table}
                        to={m.path}
                        className="p-3 rounded-lg border border-border bg-card/60 hover:bg-muted/40 hover:border-primary/40 transition-all flex flex-col justify-between group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 rounded-md bg-muted text-foreground/75 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                            {m.label}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                            {m.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Section 2: 17-LGA Grassroots Network (Clean Senatorial Tabs) */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      17-LGA Grassroots Coordinators
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Field presence organized by senatorial district.
                    </CardDescription>
                  </div>

                  {/* Clean Senatorial District Switcher */}
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg text-xs font-semibold w-full sm:w-auto">
                    {Object.keys(SENATORIAL_ZONES).map((zone) => (
                      <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`flex-1 sm:flex-initial text-center px-2 py-1 rounded-md transition-colors text-[11px] ${
                          selectedZone === zone
                            ? "bg-card text-foreground font-bold shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {zone.replace("Abia ", "")} ({SENATORIAL_ZONES[zone].length})
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="divide-y divide-border">
                  {displayedLgas.map((lga: LgaCoordinator) => (
                    <div
                      key={lga.id || lga.lga}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-foreground block">{lga.lga}</span>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {lga.name || "Coordinator designated"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {lga.phone || "—"}
                        </span>
                        <Link
                          to="/admin/lga-coordinators"
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Secondary Inquiries & Schedule - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Recent Inquiries */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Incoming Inquiries
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest messages from visitors.
                  </CardDescription>
                </div>
                <Link to="/admin/submissions">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary h-8">
                    Open Inbox <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-3">
                {submissions.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No inquiries received yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {submissions.slice(0, 4).map((sub: FormSubmission) => (
                      <Link
                        key={sub.id}
                        to="/admin/submissions"
                        className="py-2.5 block hover:bg-muted/30 px-1 rounded-md transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs text-foreground truncate">
                            {sub.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {sub.message}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card 2: Upcoming Programs & Articles */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Active Programs
                </CardTitle>
                <CardDescription className="text-xs">
                  Next scheduled community engagements.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="divide-y divide-border">
                  {events.slice(0, 3).map((e: SiteEvent) => (
                    <div key={e.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-bold text-foreground truncate">{e.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{e.location}</p>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                        {e.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Session Audit Log */}
            {auditLogs.length > 0 && (
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-2 border-b border-border/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Recent Admin Activity
                  </CardTitle>
                  <Link to="/admin/settings" className="text-[11px] font-semibold text-primary hover:underline">
                    View
                  </Link>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="divide-y divide-border">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="py-2 flex items-center justify-between text-xs gap-2">
                        <span className="text-muted-foreground truncate font-medium">
                          <strong className="text-foreground">{log.module}:</strong> {log.summary}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
