import { Suspense } from "react";

import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { Hero } from "@/components/sections/hero";
import { Reviews } from "@/components/sections/reviews";
import { Services } from "@/components/sections/services";
import { Workshop } from "@/components/sections/workshop";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { SiteContentContext } from "@/hooks/use-site-content";
import { isBannerActive } from "@/lib/banner";
import { useLandingContent } from "@/services/landing";

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Landing />
    </Suspense>
  );
}

function Landing() {
  const content = useLandingContent();
  useDocumentMeta(content.seo);

  return (
    <SiteContentContext value={content}>
      <div className="min-h-screen pb-20 md:pb-0">
        <SkipLink />
        {isBannerActive(content.banner) && <AnnouncementBanner banner={content.banner} />}
        <SiteHeader />
        <main id="main">
          <Hero />
          <Services />
          <Workshop />
          <Reviews />
        </main>
        <SiteFooter />
        <MobileActionBar />
      </div>
    </SiteContentContext>
  );
}
