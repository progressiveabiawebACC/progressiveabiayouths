import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Portfolio from "./pages/Portfolio";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminLgaCoordinators from "./pages/admin/AdminLgaCoordinators";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public routes */}
                <Route path="/"           element={<Index />} />
                <Route path="/about"      element={<About />} />
                <Route path="/events"     element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/portfolio"  element={<Portfolio />} />
                <Route path="/register"   element={<Register />} />
                <Route path="/contact"    element={<Contact />} />
                <Route path="/blog"       element={<Blog />} />
                <Route path="/blog/:id"   element={<BlogPost />} />

                {/* Admin routes */}
                <Route path="/admin/login"            element={<AdminLogin />} />
                <Route path="/admin"                  element={<AdminDashboard />} />
                <Route path="/admin/hero-slides"      element={<AdminHeroSlides />} />
                <Route path="/admin/events"           element={<AdminEvents />} />
                <Route path="/admin/blog-posts"       element={<AdminBlogPosts />} />
                <Route path="/admin/portfolio"        element={<AdminPortfolio />} />
                <Route path="/admin/partners"         element={<AdminPartners />} />
                <Route path="/admin/team"             element={<AdminTeam />} />
                <Route path="/admin/lga-coordinators" element={<AdminLgaCoordinators />} />
                <Route path="/admin/stats"            element={<AdminStats />} />
                <Route path="/admin/settings"         element={<AdminSettings />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
