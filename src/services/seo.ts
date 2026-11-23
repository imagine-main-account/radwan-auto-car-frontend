import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Seo, SeoInput } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const SeoApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Seo>>("/seo");
    return res.data.data;
  },

  update: async (data: SeoInput) => {
    const res = await api.put<ApiResponse<Seo>>("/seo", data);
    return res.data.data;
  },

  uploadImage: async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await api.put<ApiResponse<Seo>>("/seo/image", body);
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
    mutationFn: (data: SeoInput) => SeoApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(seoQuery.queryKey, saved);
      toast.success("اتحفظت إعدادات جوجل والمشاركة");
    },
  });
};

export const useUploadSeoImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadSeoImage"],
    mutationFn: (file: File) => SeoApi.uploadImage(file),
    onSuccess: (saved) => {
      queryClient.setQueryData(seoQuery.queryKey, saved);
      toast.success("اتغيرت صورة المشاركة");
    },
  });
};
