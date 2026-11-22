import type { ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Direction } from "radix-ui";

/** Providers shared by the browser app and the build-time prerender, so both render the same tree. */
export function AppProviders({ queryClient, children }: { queryClient: QueryClient; children: ReactNode }) {
  return (
    <Direction.Provider dir="rtl">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Direction.Provider>
  );
}
