import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import type { BlockedSender } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const BlockedSendersApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<BlockedSender[]>>("/blocked-senders");
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/blocked-senders/${id}`);
    return res.data;
  },
};

export const blockedSendersQuery = queryOptions({
  queryKey: ["blockedSenders"],
  queryFn: BlockedSendersApi.getAll,
});

export const useGetAllBlockedSenders = () => {
  return useQuery(blockedSendersQuery);
};

export const useDeleteBlockedSender = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBlockedSender", id],
    mutationFn: () => BlockedSendersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedSendersQuery.queryKey });
      toast.success("اتشال الحظر");
    },
  });
};
