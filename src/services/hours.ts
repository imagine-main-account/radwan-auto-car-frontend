import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Hours } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const HoursApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Hours>>("/hours");
    return res.data.data;
  },

  update: async (data: Hours) => {
    const res = await api.put<ApiResponse<Hours>>("/hours", data);
    return res.data.data;
  },
};

export const hoursQuery = queryOptions({
  queryKey: ["hours"],
  queryFn: HoursApi.get,
});

export const useGetHours = () => {
  return useQuery(hoursQuery);
};

export const useUpdateHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateHours"],
    mutationFn: (data: Hours) => HoursApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(hoursQuery.queryKey, saved);
      toast.success("اتحفظت المواعيد");
    },
  });
};
