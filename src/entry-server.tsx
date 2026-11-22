/**
 * Build-time render of the landing page (see scripts/prerender.js).
 * Visitors get real HTML immediately; the browser then hydrates it and refetches fresh content.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { dehydrate, QueryClient, type QueryKey } from "@tanstack/react-query";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";

import { AppProviders } from "@/app-providers";
import { routes } from "@/routes";
import { landingQueries } from "@/services/landing";

/** API paths to fetch before rendering. */
export const resources = Object.keys(landingQueries);

export async function render(url: string, content: Record<string, unknown>) {
  const queryClient = new QueryClient();
  for (const [resource, query] of Object.entries(landingQueries)) {
    queryClient.setQueryData(query.queryKey as QueryKey, content[resource]);
  }

  const { query, dataRoutes } = createStaticHandler(routes);
  const context = await query(new Request(new URL(url, "http://localhost")));
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${url}`);

  const html = renderToString(
    <StrictMode>
      <AppProviders queryClient={queryClient}>
        <StaticRouterProvider router={createStaticRouter(dataRoutes, context)} context={context} hydrate={false} />
      </AppProviders>
    </StrictMode>,
  );

  return { html, state: dehydrate(queryClient) };
}
