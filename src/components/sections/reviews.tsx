import { FacebookButton } from "@/components/shared/contact-buttons";
import { Section, SectionTitle } from "@/components/shared/section";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSiteContent } from "@/hooks/use-site-content";

export function Reviews() {
  const { siteInfo, reviews } = useSiteContent();

  return (
    <Section id="reviews" className="border-b">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="font-display text-7xl leading-none font-black text-primary sm:text-8xl">
            {siteInfo.rating.percent}%
          </p>
          <div>
            <SectionTitle className="text-3xl sm:text-4xl">من عملائنا بيرشحونا</SectionTitle>
            <p className="mt-2 text-muted-foreground">من {siteInfo.rating.count} تقييم على صفحتنا في فيسبوك</p>
          </div>
        </div>
        <FacebookButton href={siteInfo.facebook.reviews} variant="outline">
          اقرا كل التقييمات
        </FacebookButton>
      </div>

      <Separator className="my-12" />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map(({ id, name, text }) => (
          <li key={id}>
            <Card className="h-full gap-4.5 shadow-none">
              <CardContent>
                <blockquote className="text-base leading-7">«{text}»</blockquote>
              </CardContent>
              <CardFooter>
                <p className="text-sm leading-snug font-medium text-muted-foreground">{name}</p>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
