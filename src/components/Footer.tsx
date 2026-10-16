import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";
import { contactInfo } from "@/data/siteData";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 transition-colors">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/progressive-logo.png"
                alt="Progressive Abia Youths logo"
                className="h-10 w-auto rounded bg-white/10 p-1 transition-transform group-hover:scale-105"
              />
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Progressive Abia Youths
              </span>
            </Link>
            <p className="text-base text-slate-300 leading-relaxed max-w-sm">
              Raising unconventional youths for a progressive Abia State. Inspiring democratic engagement, transparency, and grassroots development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-base">
              {[
                { label: "About Us", path: "/about" },
                { label: "Events & Rallies", path: "/events" },
                { label: "Projects & Portfolio", path: "/portfolio" },
                { label: "Articles & Blog", path: "/blog" },
                { label: "Membership Registration", path: "/register" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-300 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-white tracking-wide">State Office</h3>
            <ul className="space-y-4 text-base text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                <span className="leading-snug">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white tracking-wide">Follow Our Movement</h3>
            <p className="text-xs text-slate-400 mb-3">Stay connected with our activities across social media:</p>
            <div className="flex gap-2.5">
              <a
                href={contactInfo.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook page"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-primary hover:scale-105"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={contactInfo.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-primary hover:scale-105"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={contactInfo.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-primary hover:scale-105"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={contactInfo.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube channel"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-primary hover:scale-105"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Progressive Abia Youths (PAY). All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Dedicated to the youth & future of Abia State <Heart className="h-3 w-3 text-red-500 fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
