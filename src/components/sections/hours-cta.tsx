import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { useSiteContent } from "@/hooks/use-site-content";
import { cn } from "@/lib/utils";

const screwPositions = ["top-5 right-5", "top-5 left-5", "right-5 bottom-5", "bottom-5 left-5"];

const outlineOnRed =
  "h-auto min-h-13 flex-wrap gap-x-2 gap-y-0 whitespace-normal border-white/60 py-2 text-white hover:bg-white/10 hover:text-white";

/** Red "sign plate" with opening hours, address and every way to get in touch. */
export function HoursCta() {
  const { siteInfo, contact, hours } = useSiteContent();

  return (
    <div
      id="visit"
      className="relative mt-16 scroll-mt-28 overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-14 lg:px-20 lg:py-16"
    >
      {screwPositions.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={cn("absolute size-2.5 rounded-full bg-black/35", position)}
        />
      ))}

      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-black sm:text-3xl">{hours.title}</h2>
          <p className="mt-4 font-display text-[2.75rem] leading-[1.2] font-black sm:text-6xl xl:text-7xl">
            {hours.from}
            <br />
            {hours.to}
          </p>
          <p className="mt-5 text-lg text-primary-foreground">{hours.note}</p>
        </div>

        <div className="min-w-0 lg:justify-self-end">
          <h3 className="font-display text-xl font-extrabold">العنوان</h3>
          <p className="mt-3 text-lg">{siteInfo.address}</p>
          <p className="mt-2 flex items-center gap-2 text-primary-foreground">
            <Mail aria-hidden="true" className="size-4 shrink-0" />
            <a
              href={contact.email.href}
              dir="ltr"
              className="min-w-0 rounded-sm break-all underline-offset-4 hover:underline"
            >
              {contact.email.label}
            </a>
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <LinkButton
              href={siteInfo.mapUrl}
              icon={MapPin}
              size="lg"
              className="bg-black text-white hover:bg-black/80"
            >
              افتح الخريطة
            </LinkButton>
            <LinkButton href={contact.phone.href} icon={Phone} size="lg" variant="outline" className={outlineOnRed}>
              اتصل بينا
              <span dir="ltr" className="font-normal text-white">
                {contact.phone.label}
              </span>
            </LinkButton>
            <LinkButton
              href={contact.whatsapp.href}
              icon={MessageCircle}
              size="lg"
              variant="outline"
              className={cn(outlineOnRed, "sm:col-span-2 lg:col-span-1 xl:col-span-2")}
            >
              راسلنا على واتساب
              <span dir="ltr" className="font-normal text-white">
                {contact.whatsapp.label}
              </span>
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
