import { lazy, Suspense, useState } from "react";
import { PenLine } from "lucide-react";

import { FacebookButton } from "@/components/shared/contact-buttons";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSiteContent } from "@/hooks/use-site-content";
import { RatingGauge } from "./rating-gauge";

const ReviewSubmitDialog = lazy(() => import("./review-submit-dialog"));

export function Reviews() {
  const { siteInfo, reviews } = useSiteContent();
  const [writing, setWriting] = useState(false);
  /** 0 until the first open (so the dialog code isn't downloaded before). A new key per open gives a fresh form. */
  const [dialogKey, setDialogKey] = useState(0);

  return (
    <Section id="reviews" className="border-b">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <RatingGauge percent={siteInfo.rating.percent} count={siteInfo.rating.count} />
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setDialogKey((key) => key + 1);
              setWriting(true);
            }}
          >
            <PenLine aria-hidden="true" />
            اكتب رأيك
          </Button>
          <FacebookButton href={siteInfo.facebook.reviews} variant="outline">
            اقرا كل التقييمات
          </FacebookButton>
        </div>
      </div>

      {dialogKey > 0 && (
        <Suspense>
          <ReviewSubmitDialog key={dialogKey} open={writing} onOpenChange={setWriting} />
        </Suspense>
      )}

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
