import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { GalleryPhoto } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

/** The gallery has 4 fixed slots, so it is read and saved as a whole. */
const GalleryApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<GalleryPhoto[]>>("/gallery");
    return res.data.data;
  },

  updateAll: async (photos: GalleryPhoto[]) => {
    const res = await api.put<ApiResponse<GalleryPhoto[]>>("/gallery", photos);
    return res.data.data;
  },
};

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: GalleryApi.getAll,
});

export const useGetGallery = () => {
  return useQuery(galleryQuery);
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateGallery"],
    mutationFn: (photos: GalleryPhoto[]) => GalleryApi.updateAll(photos),
    onSuccess: (saved) => {
      queryClient.setQueryData(galleryQuery.queryKey, saved);
      toast.success("اتحفظت صور الورشة");
    },
  });
};
