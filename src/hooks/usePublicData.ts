import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHeroSlides = () => useQuery({
  queryKey: ["public", "hero_slides"],
  queryFn: async () => {
    const { data, error } = await supabase.from("hero_slides").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const useEvents = () => useQuery({
  queryKey: ["public", "events"],
  queryFn: async () => {
    const { data, error } = await supabase.from("events").select("*").eq("is_active", true).order("date", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const useBlogPosts = () => useQuery({
  queryKey: ["public", "blog_posts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("date", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const usePortfolioItems = () => useQuery({
  queryKey: ["public", "portfolio_items"],
  queryFn: async () => {
    const { data, error } = await supabase.from("portfolio_items").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const usePartners = () => useQuery({
  queryKey: ["public", "partners"],
  queryFn: async () => {
    const { data, error } = await supabase.from("partners").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const useTeamMembers = () => useQuery({
  queryKey: ["public", "team_members"],
  queryFn: async () => {
    const { data, error } = await supabase.from("team_members").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const useLgaCoordinators = () => useQuery({
  queryKey: ["public", "lga_coordinators"],
  queryFn: async () => {
    const { data, error } = await supabase.from("lga_coordinators").select("*").eq("is_active", true).order("lga");
    if (error) throw error;
    return data;
  },
});

export const useSiteStats = () => useQuery({
  queryKey: ["public", "site_stats"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_stats").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});
