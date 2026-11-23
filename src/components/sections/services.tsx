import { useRef } from "react";

import { WhatsAppButton } from "@/components/shared/contact-buttons";
import { Section, SectionTitle } from "@/components/shared/section";
import { useSiteContent } from "@/hooks/use-site-content";
import { useStepsPassed } from "@/hooks/use-steps-passed";
import { getServiceLamp } from "@/lib/service-lamps";
import { ServiceLight, ServiceLights } from "./service-lights";

/** Each service is a warning light; scrolling past a service "fixes" it and turns its light off. */
export function Services() {
  const { services } = useSiteContent();
  const listRef = useRef<HTMLDListElement>(null);
  const fixed = useStepsPassed(listRef);
  const lamps = services.map((service) => getServiceLamp(service.symptom));

  return (
    <Section id="services" className="bg-concrete text-concrete-ink">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle>قول لنا العربية فيها إيه</SectionTitle>
          <p className="mt-4 max-w-sm text-base leading-7 text-concrete-muted">
            من أول مشكلة بسيطة لحد عَمرة المحرك. دي أكتر حاجات بتيجي لنا الورشة عشانها.
          </p>
          <WhatsAppButton className="mt-8">اسأل عن عربيتك</WhatsAppButton>
          {/* Desktop: stays next to the list while it scrolls. */}
          <div className="mt-10 hidden lg:block">
            <ServiceLights lamps={lamps} fixed={fixed} />
          </div>
        </div>

        <dl ref={listRef} className="border-t border-concrete-ink/15">
          {services.map(({ id, symptom, solution }, index) => (
            <div
              key={id}
              data-step
              className="grid gap-2 border-b border-concrete-ink/15 py-7 md:grid-cols-[1fr_1.25fr] md:gap-10"
            >
              <dt className="flex items-start gap-3 font-display text-2xl leading-snug font-semibold">
                <ServiceLight icon={lamps[index].icon} on={index >= fixed} className="mt-1.5" />
                <span>{symptom}</span>
              </dt>
              <dd className="text-base leading-7 text-concrete-muted">{solution}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
