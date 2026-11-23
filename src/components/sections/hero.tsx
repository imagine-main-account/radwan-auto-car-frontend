import { MapPin, Star } from "lucide-react";

import { PhoneButton, WhatsAppButton } from "@/components/shared/contact-buttons";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/hooks/use-site-content";
import { linkProps } from "@/lib/links";

export function Hero() {
  const { siteInfo, hero } = useSiteContent();

  return (
    <section id="top" className="relative overflow-hidden bg-black">
      {/* Photo: a banner above the text on phones, full-bleed on the left (the RTL end) on desktop */}
      <div className="relative aspect-16/10 w-full sm:aspect-2/1 lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[64%]">
        <img
          src={hero.image}
          alt={hero.imageAlt}
          width={1600}
          height={1070}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[24%_62%]"
        />
        {/* Fades the photo into the page: downwards on phones, towards the text on desktop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black lg:bg-linear-to-l lg:from-black lg:via-black/40 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-40 bg-linear-to-t from-black to-transparent lg:block"
        />
      </div>

      {/* Phones / tablets: pulled up over the photo's faded bottom, so the title and buttons sit higher. */}
      <Container className="relative -mt-14 flex pb-12 sm:-mt-20 lg:mt-0 lg:min-h-[620px] lg:items-center lg:py-24">
        <div className="flex max-w-2xl flex-col gap-7">
          <Badge variant="outline" className="border-input text-muted-foreground">
            <MapPin aria-hidden="true" className="text-signal" />
            {siteInfo.area}
          </Badge>

          <h1 className="font-display text-[2.6rem] leading-[1.15] font-extrabold sm:text-6xl lg:text-[4.1rem]">
            {siteInfo.name}
          </h1>

          <p className="max-w-136 text-lg leading-8 text-muted-foreground">{hero.description}</p>

          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <WhatsAppButton size="lg">ابعت العطل على واتساب</WhatsAppButton>
            <PhoneButton size="lg" variant="outline" />
          </div>

          <a
            {...linkProps(siteInfo.facebook.reviews)}
            className="group flex items-center gap-3 self-start rounded-md text-sm"
          >
            <span className="flex gap-0.5 text-primary" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="text-muted-foreground group-hover:text-foreground">
              <strong className="font-semibold text-foreground">{siteInfo.rating.percent}%</strong> من{" "}
              {siteInfo.rating.count} تقييم على فيسبوك بيرشحونا
            </span>
          </a>
        </div>
      </Container>

      <div aria-hidden="true" className="h-3 tread opacity-60" />
    </section>
  );
}
