import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { getBrowserFingerprint } from "@/lib/fingerprint";
import type { Review, ReviewSubmission, ReviewSubmissionInput } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";
import { blockedSendersQuery } from "./blocked-senders";
import { reviewsQuery } from "./reviews";

/** Reviews sent by visitors from the landing page, waiting for the owner to accept them. */
const ReviewSubmissionsApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<ReviewSubmission[]>>("/review-submissions");
    return res.data.data;
  },

  /** Public. A blocked sender also gets a success response, but nothing is saved. */
  create: async (data: ReviewSubmissionInput) => {
    const fingerprint = await getBrowserFingerprint();
    const res = await api.post<ApiResponse<null>>("/review-submissions", { ...data, fingerprint });
    return res.data;
  },

  accept: async (id: string) => {
    const res = await api.post<ApiResponse<Review>>(`/review-submissions/${id}/accept`);
    return res.data.data;
  },

  reject: async (id: string) => {
    const res = await api.post<ApiResponse<null>>(`/review-submissions/${id}/reject`);
    return res.data;
  },

  block: async (id: string) => {
    const res = await api.post<ApiResponse<null>>(`/review-submissions/${id}/block`);
    return res.data;
  },
};

export const reviewSubmissionsQuery = queryOptions({
  queryKey: ["reviewSubmissions"],
  queryFn: ReviewSubmissionsApi.getAll,
});

export const useGetAllReviewSubmissions = () => {
  return useQuery(reviewSubmissionsQuery);
};

/** Used by the landing page: the visitor sees the result in the form, so there is no toast here. */
export const useCreateReviewSubmission = () => {
  return useMutation({
    mutationKey: ["createReviewSubmission"],
    mutationFn: (data: ReviewSubmissionInput) => ReviewSubmissionsApi.create(data),
  });
};

export const useAcceptReviewSubmission = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["acceptReviewSubmission", id],
    mutationFn: () => ReviewSubmissionsApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewSubmissionsQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: reviewsQuery.queryKey });
      toast.success("اتنشر الرأي في الصفحة");
    },
  });
};

export const useRejectReviewSubmission = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rejectReviewSubmission", id],
    mutationFn: () => ReviewSubmissionsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewSubmissionsQuery.queryKey });
      toast.success("اترفض الرأي");
    },
  });
};

export const useBlockReviewSubmission = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["blockReviewSubmission", id],
    mutationFn: () => ReviewSubmissionsApi.block(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewSubmissionsQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: blockedSendersQuery.queryKey });
      toast.success("اتحظر الراسل");
    },
  });
};
