// ============================================================
// Local site types — replaces src/integrations/supabase/types.ts
// ============================================================

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta1_label: string;
  cta1_link: string;
  cta2_label: string;
  cta2_link: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image_url: string;
  read_time: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  bio: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LgaCoordinator {
  id: string;
  lga: string;
  name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type TableName =
  | "hero_slides"
  | "events"
  | "blog_posts"
  | "portfolio_items"
  | "partners"
  | "team_members"
  | "lga_coordinators"
  | "site_stats";

export type TableTypeMap = {
  hero_slides: HeroSlide;
  events: SiteEvent;
  blog_posts: BlogPost;
  portfolio_items: PortfolioItem;
  partners: Partner;
  team_members: TeamMember;
  lga_coordinators: LgaCoordinator;
  site_stats: SiteStat;
};
