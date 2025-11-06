"use client";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { useAuth } from "@/components/providers/auth-provider";

export function useApi() {
  const { token } = useAuth();

  return {
    get: <T,>(path: string) => apiGet<T>(path, token),
    post: <T,>(path: string, body?: unknown) => apiPost<T>(path, body, token),
    patch: <T,>(path: string, body?: unknown) => apiPatch<T>(path, body, token),
    del: <T,>(path: string) => apiDelete<T>(path, token),
  };
}
