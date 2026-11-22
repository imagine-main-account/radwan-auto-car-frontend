import { createContext, use } from "react";

import type { LandingContent } from "@/services/landing";

export const SiteContentContext = createContext<LandingContent | null>(null);

/** Landing-page content loaded from the API. Only usable inside the landing page. */
export function useSiteContent() {
  const content = use(SiteContentContext);
  if (!content) throw new Error("useSiteContent must be used inside <SiteContentContext>");
  return content;
}
