import { Ban, Check, Inbox, ShieldCheck, X } from "lucide-react";

import { ConfirmDialog } from "@/admin/components/confirm-dialog";
import { EmptyState } from "@/admin/components/empty-state";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BlockedSender, ReviewSubmission } from "@/schemas/content";
import { useDeleteBlockedSender, useGetAllBlockedSenders } from "@/services/blocked-senders";
import {
  useAcceptReviewSubmission,
  useBlockReviewSubmission,
  useGetAllReviewSubmissions,
  useRejectReviewSubmission,
} from "@/services/review-submissions";

const dateFormat = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" });

export default function ReviewSubmissionsPage() {
  const submissions = useGetAllReviewSubmissions();
  const blocked = useGetAllBlockedSenders();

  return (
    <>
      <PageHeader
        title="آراء جديدة"
        description="آراء بعتها الزوار من الموقع. مفيش حاجة بتظهر في الصفحة غير لما تقبلها."
      />

      <QueryState query={submissions}>
        {(items) =>
          items.length === 0 ? (
            <EmptyState icon={Inbox} title="مفيش آراء جديدة مستنية مراجعة" />
          ) : (
            <ul className="grid gap-3">
              {items.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} />
              ))}
            </ul>
          )
        }
      </QueryState>

      <h2 className="mt-10 mb-1 text-lg font-semibold">المحظورين</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        أي رأي جديد من نفس الجهاز أو نفس النت بيتمسح لوحده من غير ما يوصلك.
      </p>
      <QueryState query={blocked}>
        {(items) =>
          items.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="مفيش حد محظور" />
          ) : (
            <ul className="grid gap-3">
              {items.map((sender) => (
                <BlockedRow key={sender.id} sender={sender} />
              ))}
            </ul>
          )
        }
      </QueryState>
    </>
  );
}

function ReviewText({ name, text, createdAt }: Pick<ReviewSubmission, "name" | "text" | "createdAt">) {
  return (
    <div className="min-w-0 p-4">
      <p className="leading-7 break-words">«{text}»</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {name} · <time dateTime={createdAt}>{dateFormat.format(new Date(createdAt))}</time>
      </p>
    </div>
  );
}

function SubmissionRow({ submission }: { submission: ReviewSubmission }) {
  const accept = useAcceptReviewSubmission(submission.id);
  const reject = useRejectReviewSubmission(submission.id);
  const block = useBlockReviewSubmission(submission.id);
  const busy = accept.isPending || reject.isPending || block.isPending;

  return (
    <li>
      <Card className="gap-0 py-0">
        <ReviewText {...submission} />
        <div className="flex flex-wrap items-center gap-1 border-t px-4 py-2">
          <Button size="sm" disabled={busy} onClick={() => accept.mutate()}>
            <Check />
            قبول ونشر
          </Button>
          <ConfirmDialog
            title={`ترفض رأي ${submission.name}؟`}
            description="الرأي هيتمسح ومش هيظهر في الصفحة."
            confirmLabel="ارفض"
            onConfirm={() => reject.mutate()}
            trigger={
              <Button variant="ghost" size="sm" disabled={busy}>
                <X />
                رفض
              </Button>
            }
          />
          <ConfirmDialog
            title={`تحظر ${submission.name}؟`}
            description="الرأي ده وأي آراء تانية مستنية من نفس الراسل هتتمسح، وأي رأي يبعته بعد كده مش هيوصلك. تقدر تشيل الحظر بعدين."
            confirmLabel="احظر"
            onConfirm={() => block.mutate()}
            trigger={
              <Button variant="ghost" size="sm" className="ms-auto text-signal hover:text-signal" disabled={busy}>
                <Ban />
                حظر الراسل
              </Button>
            }
          />
        </div>
      </Card>
    </li>
  );
}

function BlockedRow({ sender }: { sender: BlockedSender }) {
  const unblock = useDeleteBlockedSender(sender.id);

  return (
    <li>
      <Card className="gap-0 py-0">
        <ReviewText {...sender} />
        <div className="flex items-center border-t px-4 py-2">
          <ConfirmDialog
            title={`تشيل الحظر عن ${sender.name}؟`}
            description="الآراء اللي هيبعتها بعد كده هتوصلك تاني للمراجعة."
            confirmLabel="شيل الحظر"
            onConfirm={() => unblock.mutate()}
            trigger={
              <Button variant="ghost" size="sm" disabled={unblock.isPending}>
                <ShieldCheck />
                شيل الحظر
              </Button>
            }
          />
        </div>
      </Card>
    </li>
  );
}
