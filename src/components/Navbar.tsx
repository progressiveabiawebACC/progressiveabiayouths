import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Users, Calendar, Briefcase, FileText, Mail, UserPlus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { contactInfo } from "@/data/siteData";

const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "About", path: "/about", icon: Users },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Portfolio", path: "/portfolio", icon: Briefcase },
  { label: "Blog", path: "/blog", icon: FileText },
  { label: "Contact", path: "/contact", icon: Mail },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85 transition-colors duration-200">
      <div className="container flex h-16 items-center justify-between gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 min-w-0">
          <img
            src="/progressive-logo.png"
            alt="Progressive Abia Youths logo"
            className="h-8 sm:h-9 md:h-10 w-auto transition-transform group-hover:scale-105 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-display text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-primary leading-tight whitespace-nowrap">
              Progressive Abia Youths
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hidden sm:block whitespace-nowrap">
              Civic Engagement & Development
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "text-primary bg-primary/10 dark:bg-primary/20 dark:text-primary-foreground font-bold shadow-xs"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mx-2 h-5 w-px bg-border/80" aria-hidden="true" />

          <ThemeToggle />

          <Button asChild size="sm" className="ml-2 font-bold shadow-sm transition-transform active:scale-95">
            <Link to="/register">
              <UserPlus className="mr-1.5 h-4 w-4" />
              Join Us
            </Link>
          </Button>
        </nav>

        {/* Mobile nav trigger & theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Toggle Navigation Menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs flex flex-col p-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              {/* Mobile Drawer Header */}
              <div className="flex items-center gap-2.5 pb-6 border-b border-border">
                <img
                  src="/progressive-logo.png"
                  alt="PAY logo"
                  className="h-8 w-auto shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-display text-sm sm:text-base font-extrabold text-primary whitespace-nowrap block">
                    Progressive Abia Youths
                  </span>
                  <p className="text-[11px] text-muted-foreground font-medium">Empowering Abia Youths</p>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1.5 py-6 flex-1 overflow-y-auto" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Drawer Footer CTA */}
              <div className="pt-4 border-t border-border space-y-3">
                <Button asChild className="w-full font-bold shadow-md" onClick={() => setOpen(false)}>
                  <Link to="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Us Today
                  </Link>
                </Button>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {contactInfo.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
