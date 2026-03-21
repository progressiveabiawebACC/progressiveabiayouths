import { CalendarDays, FileText, Briefcase, Users, Handshake, Image, MapPin, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTable } from "@/hooks/useAdminData";

const cards = [
  { label: "Hero Slides", icon: Image, path: "/admin/hero-slides", table: "hero_slides" as const },
  { label: "Events", icon: CalendarDays, path: "/admin/events", table: "events" as const },
  { label: "Blog Posts", icon: FileText, path: "/admin/blog-posts", table: "blog_posts" as const },
  { label: "Portfolio", icon: Briefcase, path: "/admin/portfolio", table: "portfolio_items" as const },
  { label: "Partners", icon: Handshake, path: "/admin/partners", table: "partners" as const },
  { label: "Team", icon: Users, path: "/admin/team", table: "team_members" as const },
  { label: "LGA Coordinators", icon: MapPin, path: "/admin/lga-coordinators", table: "lga_coordinators" as const },
  { label: "Stats", icon: BarChart3, path: "/admin/stats", table: "site_stats" as const },
];

const DashboardCard = ({ label, icon: Icon, path, table }: typeof cards[0]) => {
  const { data } = useAdminTable(table);
  return (
    <Link to={path}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{data.length}</p>
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const AdminDashboard = () => (
  <AdminLayout>
    <div className="mb-8">
      <h1 className="font-display text-2xl font-extrabold text-foreground">Dashboard</h1>
      <p className="text-sm font-medium text-muted-foreground">Manage your website content</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => <DashboardCard key={card.table} {...card} />)}
    </div>
  </AdminLayout>
);

export default AdminDashboard;
