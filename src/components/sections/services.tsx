import { WhatsAppButton } from "@/components/shared/contact-buttons";
import { Section, SectionTitle } from "@/components/shared/section";
import { useSiteContent } from "@/hooks/use-site-content";

export function Services() {
  const { services } = useSiteContent();

  return (
    <Section id="services" className="bg-concrete text-concrete-ink">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle>قول لنا العربية فيها إيه</SectionTitle>
          <p className="mt-4 max-w-sm text-base leading-7 text-concrete-muted">
            من أول مشكلة بسيطة لحد عَمرة المحرك. دي أكتر حاجات بتيجي لنا الورشة عشانها.
          </p>
          <WhatsAppButton className="mt-8">اسأل عن عربيتك</WhatsAppButton>
        </div>

        <dl className="border-t border-concrete-ink/15">
          {services.map(({ id, symptom, solution }) => (
            <div
              key={id}
              className="grid gap-2 border-b border-concrete-ink/15 py-7 md:grid-cols-[1fr_1.25fr] md:gap-10"
            >
              <dt className="font-display text-2xl leading-snug font-semibold">{symptom}</dt>
              <dd className="text-base leading-7 text-concrete-muted">{solution}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
