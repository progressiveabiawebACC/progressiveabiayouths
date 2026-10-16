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
  Settings,
  Plus,
  Mail,
  History,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
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
  { label: "Inbox Messages",   icon: Mail,         path: "/admin/submissions",      table: "submissions"      as const, desc: "Public inquiries from contact form" },
  { label: "Hero Slides",      icon: Image,        path: "/admin/hero-slides",      table: "hero_slides"      as const, desc: "Homepage rotating banners" },
  { label: "Events",           icon: CalendarDays, path: "/admin/events",           table: "events"           as const, desc: "Youth rallies, summits & campaigns" },
  { label: "Blog Posts",       icon: FileText,     path: "/admin/blog-posts",       table: "blog_posts"       as const, desc: "Press statements, news & op-eds" },
  { label: "Portfolio",        icon: Briefcase,    path: "/admin/portfolio",        table: "portfolio_items"  as const, desc: "Community projects & impact gallery" },
  { label: "Partners",         icon: Handshake,    path: "/admin/partners",         table: "partners"         as const, desc: "Affiliated NGOs & institutions" },
  { label: "Team",             icon: Users,        path: "/admin/team",             table: "team_members"     as const, desc: "Executive council & leadership" },
  { label: "LGA Coordinators", icon: MapPin,       path: "/admin/lga-coordinators", table: "lga_coordinators" as const, desc: "17-LGA grassroots leadership" },
  { label: "Site Stats",       icon: BarChart3,    path: "/admin/stats",            table: "site_stats"       as const, desc: "Key numerical indicators" },
];

// Senatorial zones for Abia's 17 LGAs
const SENATORIAL_ZONES: Record<string, string[]> = {
  "Abia North": ["Arochukwu", "Bende", "Isuikwuato", "Ohafia", "Umu Nneochi"],
  "Abia Central": ["Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Osisioma", "Umuahia North", "Umuahia South"],
  "Abia South": ["Aba North", "Aba South", "Obi Ngwa", "Ugwunagbo", "Ukwa East", "Ukwa West"],
};

const AdminDashboard = () => {
  const { data: events } = useAdminTable("events");
  const { data: blogPosts } = useAdminTable("blog_posts");
  const { data: lgas } = useAdminTable("lga_coordinators");
  const { data: partners } = useAdminTable("partners");
  const { data: team } = useAdminTable("team_members");
  const { data: submissions } = useAdminTable("submissions");

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("All");

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const unreadCount = submissions.filter((s: FormSubmission) => !s.is_read).length;

  // Filter LGAs by senatorial zone
  const filteredLgas = lgas.filter((lga: LgaCoordinator) => {
    if (selectedZone === "All") return true;
    const zoneLgas = SENATORIAL_ZONES[selectedZone] || [];
    return zoneLgas.some((name) => name.toLowerCase() === lga.lga.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl pb-16">
        {/* Executive Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Executive Command Center
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                Abia State
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Front-End Sync
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Progressive Abia Youths Portal CMS. Content saved here displays immediately across all public pages.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link to="/admin/submissions">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold h-9 relative"
              >
                <Mail className="h-4 w-4 mr-1.5 text-primary" />
                Inbox
                {unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/admin/events">
              <Button size="sm" variant="outline" className="text-xs font-semibold h-9">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Event
              </Button>
            </Link>

            <Link to="/admin/blog-posts">
              <Button size="sm" className="text-xs font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Post
              </Button>
            </Link>

            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="View Public Website">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Executive KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Community Events */}
          <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Active Events
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-foreground">{events.length}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Scheduled</span>
                </div>
                <Link
                  to="/admin/events"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  Manage Events <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Blog & Press */}
          <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Press &amp; Articles
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-foreground">{blogPosts.length}</span>
                  <span className="text-xs font-semibold text-primary">Published</span>
                </div>
                <Link
                  to="/admin/blog-posts"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  Manage News <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: 17-LGA Grassroots Reach */}
          <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  17-LGA Network
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-foreground">17/17</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% Covered</span>
                </div>
                <Link
                  to="/admin/lga-coordinators"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  View Coordinators <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MapPin className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Inbox Messages */}
          <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Inbox Inquiries
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-foreground">
                    {submissions.length}
                  </span>
                  {unreadCount > 0 ? (
                    <span className="text-xs font-semibold text-primary font-bold">
                      {unreadCount} New
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">All Read</span>
                  )}
                </div>
                <Link
                  to="/admin/submissions"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  Open Inbox <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Mail className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 17-LGA Grassroots Coverage Matrix */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">17-LGA Grassroots Coverage Matrix</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  17 Local Governments
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Field presence across Abia North, Abia Central, and Abia South senatorial districts.
              </CardDescription>
            </div>

            {/* District Filter Pills */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg">
              {["All", "Abia North", "Abia Central", "Abia South"].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    selectedZone === zone
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredLgas.map((lga: LgaCoordinator) => {
                let district = "Abia Central";
                for (const [zone, lgaNames] of Object.entries(SENATORIAL_ZONES)) {
                  if (lgaNames.some((n) => n.toLowerCase() === lga.lga.toLowerCase())) {
                    district = zone;
                    break;
                  }
                }

                return (
                  <div
                    key={lga.id || lga.lga}
                    className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-foreground">{lga.lga}</span>
                        <span className="text-[10px] font-medium font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {district.replace("Abia ", "")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-medium">
                        {lga.name || "Designated Coordinator"}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{lga.phone || "Active In-Field"}</span>
                      </div>
                      <Link
                        to="/admin/lga-coordinators"
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content Quick-Manager */}
        <div className="space-y-4">
          <Tabs defaultValue="inbox" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Content &amp; Inquiries Quick-Manager</h2>
                <p className="text-xs text-muted-foreground">
                  Immediate oversight and quick access to incoming messages and published items.
                </p>
              </div>

              <TabsList className="bg-muted/70 p-1">
                <TabsTrigger value="inbox" className="text-xs font-semibold">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Inbox ({submissions.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs font-semibold">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  Events ({events.length})
                </TabsTrigger>
                <TabsTrigger value="articles" className="text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Articles ({blogPosts.length})
                </TabsTrigger>
                <TabsTrigger value="audit" className="text-xs font-semibold">
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  Audit ({auditLogs.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab: Inbox */}
            <TabsContent value="inbox" className="pt-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Latest Incoming Inquiries</CardTitle>
                    <CardDescription className="text-xs">
                      Messages received from visitors on the public website.
                    </CardDescription>
                  </div>
                  <Link to="/admin/submissions">
                    <Button size="sm" variant="outline" className="text-xs font-semibold h-8">
                      View All Messages <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">
                      No incoming messages yet. Inquiries from the Contact page will appear here.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {submissions.slice(0, 5).map((sub: FormSubmission) => (
                        <div key={sub.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {!sub.is_read && (
                                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                              )}
                              <span className="font-bold text-sm text-foreground">{sub.name}</span>
                              <Badge variant="secondary" className="text-[10px] font-semibold">
                                {sub.source || "Contact Form"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-md">
                              {sub.message}
                            </p>
                          </div>
                          <Link to="/admin/submissions">
                            <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary h-8">
                              Open Message <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Events */}
            <TabsContent value="events" className="pt-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Upcoming &amp; Active Programs</CardTitle>
                    <CardDescription className="text-xs">
                      Community events displayed on public portal.
                    </CardDescription>
                  </div>
                  <Link to="/admin/events">
                    <Button size="sm" variant="outline" className="text-xs font-semibold h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Event
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {events.slice(0, 5).map((e: SiteEvent) => (
                      <div key={e.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{e.title}</span>
                            <Badge variant="secondary" className="text-[10px] font-semibold">
                              {e.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {e.date}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {e.time}
                            </span>
                            <span className="inline-flex items-center gap-1 truncate max-w-xs">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {e.location}
                            </span>
                          </div>
                        </div>
                        <Link to="/admin/events">
                          <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary h-8">
                            Edit in Module <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Articles */}
            <TabsContent value="articles" className="pt-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Press Statements &amp; Publications</CardTitle>
                    <CardDescription className="text-xs">
                      Youth insights and official announcements.
                    </CardDescription>
                  </div>
                  <Link to="/admin/blog-posts">
                    <Button size="sm" variant="outline" className="text-xs font-semibold h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Article
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {blogPosts.slice(0, 5).map((p: BlogPost) => (
                      <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{p.title}</span>
                            <Badge variant="secondary" className="text-[10px] font-semibold">
                              {p.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span>Author: {p.author}</span>
                            <span>Date: {p.date}</span>
                            <span>{p.read_time || "5 min read"}</span>
                          </div>
                        </div>
                        <Link to="/admin/blog-posts">
                          <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary h-8">
                            Edit in Module <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Audit */}
            <TabsContent value="audit" className="pt-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Recent System Activity</CardTitle>
                    <CardDescription className="text-xs">
                      Logged operations across admin sessions on this browser.
                    </CardDescription>
                  </div>
                  <Link to="/admin/settings">
                    <Button size="sm" variant="ghost" className="text-xs font-semibold text-primary h-8">
                      Settings &amp; Backup <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No administrative activity recorded yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {auditLogs.slice(0, 6).map((log) => (
                        <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] uppercase font-bold shrink-0 ${
                                log.action === "create"
                                  ? "bg-primary/15 text-primary"
                                  : log.action === "delete"
                                  ? "bg-destructive/15 text-destructive"
                                  : log.action === "reset"
                                  ? "bg-amber-500/15 text-amber-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {log.action}
                            </Badge>
                            <span className="font-semibold text-foreground shrink-0">{log.module}:</span>
                            <span className="text-muted-foreground truncate">{log.summary}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* All CMS Modules Navigator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Content Modules Navigator</h2>
              <p className="text-xs text-muted-foreground">
                Direct access to individual CMS entities and operational tables.
              </p>
            </div>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm" className="text-xs font-semibold h-8">
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Backup &amp; Reset
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.table} to={m.path} className="group">
                  <Card className="h-full border-border bg-card hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{m.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
