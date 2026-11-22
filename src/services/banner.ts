import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Banner } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const BannerApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Banner>>("/banner");
    return res.data.data;
  },

  update: async (data: Banner) => {
    const res = await api.put<ApiResponse<Banner>>("/banner", data);
    return res.data.data;
  },
};

export const bannerQuery = queryOptions({
  queryKey: ["banner"],
  queryFn: BannerApi.get,
});

export const useGetBanner = () => {
  return useQuery(bannerQuery);
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBanner"],
    mutationFn: (data: Banner) => BannerApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(bannerQuery.queryKey, saved);
      toast.success("اتحفظ شريط الإعلان");
    },
  });
};
