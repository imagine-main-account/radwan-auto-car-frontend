import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { SiteInfo } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const SiteInfoApi = {
  get: async () => {
    const res = await api.get<ApiResponse<SiteInfo>>("/site-info");
    return res.data.data;
  },

  update: async (data: SiteInfo) => {
    const res = await api.put<ApiResponse<SiteInfo>>("/site-info", data);
    return res.data.data;
  },
};

export const siteInfoQuery = queryOptions({
  queryKey: ["site-info"],
  queryFn: SiteInfoApi.get,
});

export const useGetSiteInfo = () => {
  return useQuery(siteInfoQuery);
};

export const useUpdateSiteInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSiteInfo"],
    mutationFn: (data: SiteInfo) => SiteInfoApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(siteInfoQuery.queryKey, saved);
      toast.success("اتحفظت بيانات التواصل");
    },
  });
};
