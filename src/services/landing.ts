import { useSuspenseQueries } from "@tanstack/react-query";

import { toContactLinks } from "@/lib/contact";
import { bannerQuery } from "./banner";
import { galleryQuery } from "./gallery";
import { heroQuery } from "./hero";
import { hoursQuery } from "./hours";
import { repairServicesQuery } from "./repair-services";
import { reviewsQuery } from "./reviews";
import { seoQuery } from "./seo";
import { siteInfoQuery } from "./site-info";

/** API path -> query for everything the landing page reads. The build-time prerender fills these. */
export const landingQueries = {
  "site-info": siteInfoQuery,
  hours: hoursQuery,
  hero: heroQuery,
  banner: bannerQuery,
  seo: seoQuery,
  services: repairServicesQuery,
  reviews: reviewsQuery,
  gallery: galleryQuery,
};

/** Everything the public landing page needs, fetched in parallel (suspends until all are loaded). */
export const useLandingContent = () => {
  const [siteInfo, hours, hero, banner, seo, services, reviews, gallery] = useSuspenseQueries({
    queries: [
      siteInfoQuery,
      hoursQuery,
      heroQuery,
      bannerQuery,
      seoQuery,
      repairServicesQuery,
      reviewsQuery,
      galleryQuery,
    ],
  });

  return {
    siteInfo: siteInfo.data,
    contact: toContactLinks(siteInfo.data),
    hours: hours.data,
    hero: hero.data,
    banner: banner.data,
    seo: seo.data,
    services: services.data.filter((service) => service.visible),
    reviews: reviews.data.filter((review) => review.visible),
    gallery: gallery.data,
  };
};

export type LandingContent = ReturnType<typeof useLandingContent>;
