// ============================================================
// Public data hooks — replaces Supabase usePublicData
// Reads directly from siteData.ts (static, no network calls).
// localStorage is intentionally NOT used here — public visitors
// always see the published siteData.ts. Admins use the Export
// feature to publish their localStorage edits.
// ============================================================

import {
  heroSlides as rawHero,
  events as rawEvents,
  blogPosts as rawBlog,
  portfolioItems as rawPortfolio,
  partners as rawPartners,
  teamMembers as rawTeam,
  lgaCoordinators as rawLgas,
  stats as rawStats,
} from "@/data/siteData";

import type {
  HeroSlide,
  SiteEvent,
  BlogPost,
  PortfolioItem,
  Partner,
  TeamMember,
  LgaCoordinator,
  SiteStat,
} from "@/types/siteTypes";

const now = () => new Date().toISOString();

// ── Mapped data (siteData shape → storage shape) ────────────

const heroSlides: HeroSlide[] = rawHero.map((s, i) => ({
  id: String(s.id),
  title: s.title,
  subtitle: s.subtitle,
  cta1_label: s.cta1.label,
  cta1_link: s.cta1.link,
  cta2_label: s.cta2.label,
  cta2_link: s.cta2.link,
  image_url: s.image,
  sort_order: i + 1,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const events: SiteEvent[] = rawEvents.map((e) => ({
  id: String(e.id),
  title: e.title,
  description: e.description,
  date: e.date,
  time: e.time,
  location: e.location,
  category: e.category,
  image_url: e.image,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const blogPosts: BlogPost[] = rawBlog.map((p) => ({
  id: String(p.id),
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  author: p.author,
  date: p.date,
  category: p.category,
  tags: p.tags,
  image_url: p.image,
  read_time: p.readTime,
  is_published: true,
  created_at: now(),
  updated_at: now(),
}));

const portfolioItems: PortfolioItem[] = rawPortfolio.map((item, i) => ({
  id: String(item.id),
  title: item.title,
  description: item.description,
  category: item.category,
  image_url: item.image,
  sort_order: i + 1,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const partners: Partner[] = rawPartners.map((p, i) => ({
  id: String(i + 1),
  name: p.name,
  logo_url: p.logo,
  website_url: null,
  sort_order: i + 1,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const teamMembers: TeamMember[] = rawTeam.map((m, i) => ({
  id: String(i + 1),
  name: m.name,
  role: m.role,
  image_url: m.image,
  bio: null,
  sort_order: i + 1,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const lgaCoordinators: LgaCoordinator[] = rawLgas.map((l, i) => ({
  id: String(i + 1),
  lga: l.lga,
  name: l.name,
  phone: l.phone || null,
  is_active: true,
  created_at: now(),
  updated_at: now(),
}));

const siteStats: SiteStat[] = rawStats.map((s, i) => ({
  id: String(i + 1),
  label: s.label,
  value: s.value,
  suffix: s.suffix,
  sort_order: i + 1,
  created_at: now(),
  updated_at: now(),
}));

// ── Public hooks ─────────────────────────────────────────────
// These are synchronous (no loading state needed) since data is static.

export const useHeroSlides = () => ({
  data: heroSlides.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
  isLoading: false,
});

export const useEvents = () => ({
  data: events.filter((e) => e.is_active).sort((a, b) => (a.date > b.date ? -1 : 1)),
  isLoading: false,
});

export const useBlogPosts = () => ({
  data: blogPosts.filter((p) => p.is_published).sort((a, b) => (a.date > b.date ? -1 : 1)),
  isLoading: false,
});

export const usePortfolioItems = () => ({
  data: portfolioItems.filter((i) => i.is_active).sort((a, b) => a.sort_order - b.sort_order),
  isLoading: false,
});

export const usePartners = () => ({
  data: partners.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order),
  isLoading: false,
});

export const useTeamMembers = () => ({
  data: teamMembers.filter((m) => m.is_active).sort((a, b) => a.sort_order - b.sort_order),
  isLoading: false,
});

export const useLgaCoordinators = () => ({
  data: lgaCoordinators.filter((l) => l.is_active).sort((a, b) => a.lga.localeCompare(b.lga)),
  isLoading: false,
});

export const useSiteStats = () => ({
  data: siteStats.sort((a, b) => a.sort_order - b.sort_order),
  isLoading: false,
});
