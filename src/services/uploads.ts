import { useMutation } from "@tanstack/react-query";

import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

const UploadsApi = {
  image: async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await api.post<ApiResponse<{ url: string }>>("/uploads", body);
    return res.data.data;
  },
};

export const useUploadImage = () => {
  return useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: (file: File) => UploadsApi.image(file),
  });
};
