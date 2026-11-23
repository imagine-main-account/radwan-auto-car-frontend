import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Hero, HeroInput } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const HeroApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Hero>>("/hero");
    return res.data.data;
  },

  update: async (data: HeroInput) => {
    const res = await api.put<ApiResponse<Hero>>("/hero", data);
    return res.data.data;
  },

  uploadImage: async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await api.put<ApiResponse<Hero>>("/hero/image", body);
    return res.data.data;
  },
};

export const heroQuery = queryOptions({
  queryKey: ["hero"],
  queryFn: HeroApi.get,
});

export const useGetHero = () => {
  return useQuery(heroQuery);
};

export const useUpdateHero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateHero"],
    mutationFn: (data: HeroInput) => HeroApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(heroQuery.queryKey, saved);
      toast.success("اتحفظت الواجهة");
    },
  });
};

export const useUploadHeroImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadHeroImage"],
    mutationFn: (file: File) => HeroApi.uploadImage(file),
    onSuccess: (saved) => {
      queryClient.setQueryData(heroQuery.queryKey, saved);
      toast.success("اتغيرت صورة الواجهة");
    },
  });
};
