import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import type { ChangePasswordInput, LoginInput, User } from "@/schemas/content";
import type { ApiResponse } from "@/types/api";

const AuthApi = {
  login: async (data: LoginInput) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>("/auth/login", data);
    return res.data.data;
  },

  me: async () => {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword }: ChangePasswordInput) => {
    const res = await api.put<ApiResponse<null>>("/auth/password", { currentPassword, newPassword });
    return res.data;
  },
};

export const meQuery = queryOptions({
  queryKey: ["me"],
  queryFn: AuthApi.me,
  retry: false,
  staleTime: Infinity,
});

export const useMe = () => {
  return useQuery({ ...meQuery, enabled: !!authToken.get() });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginInput) => AuthApi.login(data),
    onSuccess: ({ token, user }) => {
      authToken.set(token);
      queryClient.setQueryData(meQuery.queryKey, user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AuthApi.logout(),
    onSettled: () => {
      // Log out locally even if the server call fails.
      authToken.clear();
      queryClient.clear();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (data: ChangePasswordInput) => AuthApi.changePassword(data),
    onSuccess: () => {
      toast.success("اتغيرت كلمة السر");
    },
  });
};
