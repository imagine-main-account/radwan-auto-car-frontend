import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Hero } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const HeroApi = {
  get: async () => {
    const res = await api.get<ApiResponse<Hero>>("/hero");
    return res.data.data;
  },

  update: async (data: Hero) => {
    const res = await api.put<ApiResponse<Hero>>("/hero", data);
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
    mutationFn: (data: Hero) => HeroApi.update(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(heroQuery.queryKey, saved);
      toast.success("اتحفظت الواجهة");
    },
  });
};
