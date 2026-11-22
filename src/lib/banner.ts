import type { Banner } from "@/schemas/content";

/** Today's date as YYYY-MM-DD in the visitor's timezone. */
export const today = () => new Date().toLocaleDateString("en-CA");

export function isBannerActive(banner: Banner) {
  return banner.enabled && banner.text.length > 0 && (!banner.endsAt || banner.endsAt >= today());
}
