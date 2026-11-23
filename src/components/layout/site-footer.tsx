import { FacebookButton } from "@/components/shared/contact-buttons";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { useSiteContent } from "@/hooks/use-site-content";

export function SiteFooter() {
  const { siteInfo } = useSiteContent();

  return (
    <footer className="border-t">
      {/* Phones: stacked and centered. Larger screens: logo + area on one side, Facebook on the other. */}
      <Container className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-start">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
          <Logo className="h-14 sm:h-20" />
          <p>{siteInfo.footerArea}</p>
        </div>
        <FacebookButton variant="ghost" size="sm">
          صفحتنا على فيسبوك
        </FacebookButton>
      </Container>
    </footer>
  );
}
