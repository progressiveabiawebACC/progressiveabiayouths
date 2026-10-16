// ============================================================
// Local data store — replaces Supabase tables with localStorage
// Seeds from siteData.ts on first use.
// ============================================================

import {
  heroSlides as seedHero,
  events as seedEvents,
  blogPosts as seedBlog,
  portfolioItems as seedPortfolio,
  partners as seedPartners,
  teamMembers as seedTeam,
  lgaCoordinators as seedLgas,
  stats as seedStats,
} from "@/data/siteData";

import type {
  TableName,
  TableTypeMap,
  HeroSlide,
  SiteEvent,
  BlogPost,
  PortfolioItem,
  Partner,
  TeamMember,
  LgaCoordinator,
  SiteStat,
} from "@/types/siteTypes";

// ── Storage key prefix ──────────────────────────────────────
const KEY = (table: TableName) => `pay_data_${table}`;

// ── Seed helpers (shape siteData into storage schema) ───────
const now = () => new Date().toISOString();

const seedMap: Record<TableName, () => unknown[]> = {
  hero_slides: () =>
    seedHero.map((s, i): HeroSlide => ({
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
    })),
  events: () =>
    seedEvents.map((e): SiteEvent => ({
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
    })),
  blog_posts: () =>
    seedBlog.map((p): BlogPost => ({
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
    })),
  portfolio_items: () =>
    seedPortfolio.map((item, i): PortfolioItem => ({
      id: String(item.id),
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image,
      sort_order: i + 1,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    })),
  partners: () =>
    seedPartners.map((p, i): Partner => ({
      id: String(i + 1),
      name: p.name,
      logo_url: p.logo,
      website_url: null,
      sort_order: i + 1,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    })),
  team_members: () =>
    seedTeam.map((m, i): TeamMember => ({
      id: String(i + 1),
      name: m.name,
      role: m.role,
      image_url: m.image,
      bio: null,
      sort_order: i + 1,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    })),
  lga_coordinators: () =>
    seedLgas.map((l, i): LgaCoordinator => ({
      id: String(i + 1),
      lga: l.lga,
      name: l.name,
      phone: l.phone || null,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    })),
  site_stats: () =>
    seedStats.map((s, i): SiteStat => ({
      id: String(i + 1),
      label: s.label,
      value: s.value,
      suffix: s.suffix,
      sort_order: i + 1,
      created_at: now(),
      updated_at: now(),
    })),
};

// ── Core CRUD ────────────────────────────────────────────────
function getAll<T extends TableName>(table: T): TableTypeMap[T][] {
  try {
    const raw = localStorage.getItem(KEY(table));
    if (raw) return JSON.parse(raw) as TableTypeMap[T][];
  } catch {
    // corrupted — fall through to seed
  }
  const seeded = seedMap[table]() as TableTypeMap[T][];
  localStorage.setItem(KEY(table), JSON.stringify(seeded));
  return seeded;
}

function saveAll<T extends TableName>(table: T, items: TableTypeMap[T][]) {
  localStorage.setItem(KEY(table), JSON.stringify(items));
}

export function localCreate<T extends TableName>(
  table: T,
  item: Omit<TableTypeMap[T], "id" | "created_at" | "updated_at">
): TableTypeMap[T] {
  const items = getAll(table);
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: now(),
    updated_at: now(),
  } as TableTypeMap[T];
  saveAll(table, [newItem, ...items]);
  return newItem;
}

export function localUpdate<T extends TableName>(
  table: T,
  id: string,
  updates: Partial<TableTypeMap[T]>
): TableTypeMap[T] {
  const items = getAll(table);
  const updated = items.map((item) =>
    (item as any).id === id
      ? { ...item, ...updates, updated_at: now() }
      : item
  );
  saveAll(table, updated);
  return updated.find((i) => (i as any).id === id) as TableTypeMap[T];
}

export function localDelete<T extends TableName>(table: T, id: string) {
  const items = getAll(table);
  saveAll(table, items.filter((i) => (i as any).id !== id));
}

export function localGetAll<T extends TableName>(table: T): TableTypeMap[T][] {
  return getAll(table);
}

/** Reset a single table back to its seed data */
export function localReset<T extends TableName>(table: T) {
  const seeded = seedMap[table]() as TableTypeMap[T][];
  saveAll(table, seeded);
  return seeded;
}
