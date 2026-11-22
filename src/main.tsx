import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { hydrate, type DehydratedState } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

import { AppProviders } from "@/app-providers";
import { queryClient } from "@/lib/query-client";
import { routes } from "@/routes";
import "@/index.css";

declare global {
  interface Window {
    /** Content embedded by scripts/prerender.js into the prerendered landing page. */
    __QUERY_STATE__?: DehydratedState;
  }
}

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </AppProviders>
  </StrictMode>
);

const prerenderedState = window.location.pathname === "/" ? window.__QUERY_STATE__ : undefined;

if (prerenderedState) {
  // "/" was rendered at build time: reuse that HTML and data, then refetch in the background.
  hydrate(queryClient, prerenderedState);
  // The embedded content is from build time: mark it stale so the page revalidates against the API right away.
  void queryClient.invalidateQueries({ refetchType: "none" });
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
