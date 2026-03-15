import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Events", path: "/events" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/progressive-logo.png"
            alt="Progressive Abia Youths logo"
            className="h-10 w-auto"
          />
          <span className="hidden font-display text-lg font-bold text-primary sm:inline-block">
            Progressive Abia Youths
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary font-semibold"
                  : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link to="/register">Join Us</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-4 pt-8">
              <Link to="/" className="flex items-center gap-2 mb-4" onClick={() => setOpen(false)}>
                <img
                  src="/progressive-logo.png"
                  alt="Progressive Abia Youths logo"
                  className="h-8 w-auto"
                />
                <span className="font-display text-base font-bold text-primary">PAY</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === link.path
                      ? "text-primary bg-muted font-semibold"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-2" onClick={() => setOpen(false)}>
                <Link to="/register">Join Us</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
