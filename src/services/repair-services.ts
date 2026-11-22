import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { RepairService, RepairServiceInput } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const RepairServicesApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<RepairService[]>>("/services");
    return res.data.data;
  },

  create: async (data: RepairServiceInput) => {
    const res = await api.post<ApiResponse<RepairService>>("/services", data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<RepairServiceInput>) => {
    const res = await api.put<ApiResponse<RepairService>>(`/services/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/services/${id}`);
    return res.data;
  },

  reorder: async (ids: string[]) => {
    const res = await api.put<ApiResponse<RepairService[]>>("/services/reorder", { ids });
    return res.data.data;
  },
};

export const repairServicesQuery = queryOptions({
  queryKey: ["repairServices"],
  queryFn: RepairServicesApi.getAll,
});

export const useGetAllRepairServices = () => {
  return useQuery(repairServicesQuery);
};

export const useCreateRepairService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createRepairService"],
    mutationFn: (data: RepairServiceInput) => RepairServicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairServicesQuery.queryKey });
      toast.success("اتضافت الخدمة");
    },
  });
};

export const useUpdateRepairService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateRepairService", id],
    mutationFn: (data: Partial<RepairServiceInput>) => RepairServicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairServicesQuery.queryKey });
      toast.success("اتحفظت الخدمة");
    },
  });
};

export const useDeleteRepairService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRepairService", id],
    mutationFn: () => RepairServicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairServicesQuery.queryKey });
      toast.success("اتمسحت الخدمة");
    },
  });
};

/** Moves items instantly in the UI, then rolls back if the server rejects the new order. */
export const useReorderRepairServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reorderRepairServices"],
    mutationFn: (ids: string[]) => RepairServicesApi.reorder(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: repairServicesQuery.queryKey });
      const previous = queryClient.getQueryData(repairServicesQuery.queryKey);
      queryClient.setQueryData(repairServicesQuery.queryKey, (items = []) =>
        ids.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined),
      );
      return { previous };
    },
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(repairServicesQuery.queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: repairServicesQuery.queryKey });
    },
  });
};
