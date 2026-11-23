import { PhoneButton, WhatsAppButton } from "@/components/shared/contact-buttons";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/shared/link-button";
import { Logo } from "@/components/shared/logo";
import { navLinks } from "@/config/site";
import { ScrollProgressRoad } from "./scroll-progress-road";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <ScrollProgressRoad />
      <Container className="flex items-center justify-between gap-4 py-2">
        <Logo />

        <nav aria-label="أقسام الصفحة" className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ label, href }) => (
            <LinkButton key={href} href={href} variant="ghost" size="sm">
              {label}
            </LinkButton>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <PhoneButton variant="outline" className="hidden sm:inline-flex" />
          <WhatsAppButton />
        </div>
      </Container>
    </header>
  );
}
