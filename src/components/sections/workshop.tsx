import { FacebookButton } from "@/components/shared/contact-buttons";
import { Section, SectionTitle } from "@/components/shared/section";
import { useSiteContent } from "@/hooks/use-site-content";
import type { GalleryPhoto } from "@/schemas/content";
import { cn } from "@/lib/utils";
import { HoursCta } from "./hours-cta";

const layoutClass: Record<GalleryPhoto["layout"], string> = {
  feature: "col-span-2 row-span-2 aspect-4/3 lg:aspect-auto",
  tile: "aspect-4/3 lg:aspect-auto",
  wide: "col-span-2 aspect-2/1 lg:aspect-auto",
};

export function Workshop() {
  const { siteInfo, gallery } = useSiteContent();

  return (
    <Section id="workshop" className="bg-black">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionTitle>شغلنا بيتكلم</SectionTitle>
          <p className="mt-3 text-muted-foreground">صور حقيقية من جوه الورشة في اللبيني.</p>
        </div>
        <FacebookButton href={siteInfo.facebook.photos} variant="outline">
          صور أكتر على فيسبوك
        </FacebookButton>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-[17rem_17rem]">
        {gallery.map(({ id, image, caption, layout }) => (
          <li key={id} className={cn("relative overflow-hidden rounded-lg bg-card", layoutClass[layout])}>
            <figure>
              <img
                src={image}
                alt=""
                width={800}
                height={621}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/85 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs leading-5 font-semibold text-white sm:p-4 sm:text-sm">
                {caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <HoursCta />
    </Section>
  );
}
