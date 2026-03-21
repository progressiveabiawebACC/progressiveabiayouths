import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type TableName = "hero_slides" | "events" | "blog_posts" | "portfolio_items" | "partners" | "team_members" | "lga_coordinators" | "site_stats";

export function useAdminTable<T extends TableName>(table: T) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<T>[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: TablesInsert<T>) => {
      const { data, error } = await supabase.from(table).insert(item as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<T> & { id: string }) => {
      const { data, error } = await supabase.from(table).update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
