import { FacebookButton } from "@/components/shared/contact-buttons";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { useSiteContent } from "@/hooks/use-site-content";

export function SiteFooter() {
  const { siteInfo } = useSiteContent();

  return (
    <footer className="border-t">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <Logo className="h-20 sm:h-20" />
          <p>{siteInfo.footerArea}</p>
        </div>
        <FacebookButton variant="ghost" size="sm">
          صفحتنا على فيسبوك
        </FacebookButton>
      </Container>
    </footer>
  );
}
