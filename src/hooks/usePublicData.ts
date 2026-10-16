// ============================================================
// Public data hooks — connects directly to localStore.
// Reads live CMS data so any admin updates, posts, or coordinator
// edits appear immediately on the front end!
// ============================================================

import { localGetAll } from "@/lib/localStore";
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

export const useHeroSlides = () => {
  try {
    const slides = localGetAll("hero_slides");
    return {
      data: slides.filter((s: HeroSlide) => s.is_active).sort((a: HeroSlide, b: HeroSlide) => a.sort_order - b.sort_order),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const useEvents = () => {
  try {
    const events = localGetAll("events");
    return {
      data: events.filter((e: SiteEvent) => e.is_active).sort((a: SiteEvent, b: SiteEvent) => (a.date > b.date ? -1 : 1)),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const useBlogPosts = () => {
  try {
    const posts = localGetAll("blog_posts");
    return {
      data: posts.filter((p: BlogPost) => p.is_published).sort((a: BlogPost, b: BlogPost) => (a.date > b.date ? -1 : 1)),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const usePortfolioItems = () => {
  try {
    const items = localGetAll("portfolio_items");
    return {
      data: items.filter((i: PortfolioItem) => i.is_active).sort((a: PortfolioItem, b: PortfolioItem) => a.sort_order - b.sort_order),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const usePartners = () => {
  try {
    const partners = localGetAll("partners");
    return {
      data: partners.filter((p: Partner) => p.is_active).sort((a: Partner, b: Partner) => a.sort_order - b.sort_order),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const useTeamMembers = () => {
  try {
    const team = localGetAll("team_members");
    return {
      data: team.filter((m: TeamMember) => m.is_active).sort((a: TeamMember, b: TeamMember) => a.sort_order - b.sort_order),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const useLgaCoordinators = () => {
  try {
    const lgas = localGetAll("lga_coordinators");
    return {
      data: lgas.filter((l: LgaCoordinator) => l.is_active).sort((a: LgaCoordinator, b: LgaCoordinator) => a.lga.localeCompare(b.lga)),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};

export const useSiteStats = () => {
  try {
    const stats = localGetAll("site_stats");
    return {
      data: stats.sort((a: SiteStat, b: SiteStat) => a.sort_order - b.sort_order),
      isLoading: false,
    };
  } catch {
    return { data: [], isLoading: false };
  }
};
