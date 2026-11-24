import { queryOptions, useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { GalleryPhoto, GalleryPhotoInput, GalleryPhotoPatch } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const GalleryApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<GalleryPhoto[]>>("/gallery");
    return res.data.data;
  },

  /** The photo is uploaded with its caption in one multipart request. */
  create: async ({ file, caption, visible }: GalleryPhotoInput) => {
    const body = new FormData();
    body.append("file", file);
    body.append("caption", caption);
    body.append("visible", String(visible));
    const res = await api.post<ApiResponse<GalleryPhoto>>("/gallery", body);
    return res.data.data;
  },

  /** JSON when only the caption or visibility change, multipart when a new image is sent too. */
  update: async (id: string, { file, ...fields }: Partial<GalleryPhotoPatch>) => {
    let body: Partial<GalleryPhotoPatch> | FormData = fields;
    if (file) {
      body = new FormData();
      body.append("file", file);
      if (fields.caption !== undefined) body.append("caption", fields.caption);
      if (fields.visible !== undefined) body.append("visible", String(fields.visible));
    }
    const res = await api.put<ApiResponse<GalleryPhoto>>(`/gallery/${id}`, body);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/gallery/${id}`);
    return res.data;
  },

  reorder: async (ids: string[]) => {
    const res = await api.put<ApiResponse<GalleryPhoto[]>>("/gallery/reorder", { ids });
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

export const useCreateGalleryPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createGalleryPhoto"],
    mutationFn: (data: GalleryPhotoInput) => GalleryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQuery.queryKey });
      toast.success("اتضافت الصورة");
    },
  });
};

export const useUpdateGalleryPhoto = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateGalleryPhoto", id],
    mutationFn: (data: Partial<GalleryPhotoPatch>) => GalleryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQuery.queryKey });
      toast.success("اتحفظت الصورة");
    },
  });
};

export const useDeleteGalleryPhoto = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteGalleryPhoto", id],
    mutationFn: () => GalleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQuery.queryKey });
      toast.success("اتمسحت الصورة");
    },
  });
};

const reorderMutationKey = ["reorderGallery"];

/** Moves items instantly in the UI, then rolls back if the server rejects the new order. */
export const useReorderGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: reorderMutationKey,
    mutationFn: (ids: string[]) => GalleryApi.reorder(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: galleryQuery.queryKey });
      const previous = queryClient.getQueryData(galleryQuery.queryKey);
      queryClient.setQueryData(galleryQuery.queryKey, (items = []) =>
        ids.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined),
      );
      return { previous };
    },
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(galleryQuery.queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: galleryQuery.queryKey });
    },
  });
};

/** True while any reorder request is in flight, so the list can lock its move buttons. */
export const useIsReorderingGallery = () => {
  return useIsMutating({ mutationKey: reorderMutationKey }) > 0;
};
