// ============================================================
// Admin data hook — replaces Supabase useAdminData
// Uses localStorage via localStore.ts. Same API as before.
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localGetAll, localCreate, localUpdate, localDelete } from "@/lib/localStore";
import type { TableName, TableTypeMap } from "@/types/siteTypes";

export function useAdminTable<T extends TableName>(table: T) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", table],
    queryFn: () => localGetAll(table),
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<TableTypeMap[T], "id" | "created_at" | "updated_at">) => {
      return localCreate(table, item);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TableTypeMap[T]> & { id: string }) => {
      return localUpdate(table, id, updates as Partial<TableTypeMap[T]>);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      localDelete(table, id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  return {
    data: (query.data ?? []) as TableTypeMap[T][],
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
