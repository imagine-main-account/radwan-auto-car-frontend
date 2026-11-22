import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Seo } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const SeoApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Seo>>("/seo");
    return res.data.data;
  },

  update: async (data: Seo) => {
    const res = await api.put<ApiResponse<Seo>>("/seo", data);
    return res.data.data;
  },
};

export const seoQuery = queryOptions({
  queryKey: ["seo"],
  queryFn: SeoApi.get,
});

export const useGetSeo = () => {
  return useQuery(seoQuery);
};

export const useUpdateSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSeo"],
    mutationFn: (data: Seo) => SeoApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(seoQuery.queryKey, saved);
      toast.success("اتحفظت إعدادات جوجل والمشاركة");
    },
  });
};
