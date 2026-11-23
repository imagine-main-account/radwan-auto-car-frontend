import { queryOptions, useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { Review, ReviewInput } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const ReviewsApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Review[]>>("/reviews");
    return res.data.data;
  },

  create: async (data: ReviewInput) => {
    const res = await api.post<ApiResponse<Review>>("/reviews", data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<ReviewInput>) => {
    const res = await api.put<ApiResponse<Review>>(`/reviews/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/reviews/${id}`);
    return res.data;
  },

  reorder: async (ids: string[]) => {
    const res = await api.put<ApiResponse<Review[]>>("/reviews/reorder", { ids });
    return res.data.data;
  },
};

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: ReviewsApi.getAll,
});

export const useGetAllReviews = () => {
  return useQuery(reviewsQuery);
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createReview"],
    mutationFn: (data: ReviewInput) => ReviewsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
      toast.success("اتضاف الرأي");
    },
  });
};

export const useUpdateReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateReview", id],
    mutationFn: (data: Partial<ReviewInput>) => ReviewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
      toast.success("اتحفظ الرأي");
    },
  });
};

export const useDeleteReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReview", id],
    mutationFn: () => ReviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
      toast.success("اتمسح الرأي");
    },
  });
};

const reorderMutationKey = ["reorderReviews"];

/** Moves items instantly in the UI, then rolls back if the server rejects the new order. */
export const useReorderReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: reorderMutationKey,
    mutationFn: (ids: string[]) => ReviewsApi.reorder(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: reviewsQuery.queryKey });
      const previous = queryClient.getQueryData(reviewsQuery.queryKey);
      queryClient.setQueryData(reviewsQuery.queryKey, (items = []) =>
        ids.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined),
      );
      return { previous };
    },
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(reviewsQuery.queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
    },
  });
};

/** True while any reorder request is in flight, so the list can lock its move buttons. */
export const useIsReorderingReviews = () => {
  return useIsMutating({ mutationKey: reorderMutationKey }) > 0;
};
