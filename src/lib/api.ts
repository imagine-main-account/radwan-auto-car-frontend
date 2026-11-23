import axios, { isAxiosError } from "axios";

import { authToken } from "@/lib/auth-token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  // Expired / invalid session: drop the token and send the admin back to the login page.
  if (isAxiosError(error) && error.response?.status === 401 && authToken.get()) {
    authToken.clear();
    const { pathname } = window.location;
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") window.location.assign("/admin/login");
  }
  return Promise.reject(error);
});

/** A human-readable (Arabic) message for any error thrown by an API call. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (!error.response) return "مفيش اتصال بالسيرفر. اتأكد من النت وجرّب تاني.";
  }
  return "حصلت مشكلة. جرّب تاني.";
}

export default api;
