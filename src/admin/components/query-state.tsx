import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api";

/** Renders a skeleton while loading, an error with retry on failure, and `children(data)` on success. */
export function QueryState<T>({ query, children }: { query: UseQueryResult<T>; children: (data: T) => ReactNode }) {
  if (query.isPending) {
    return (
      <div className="grid gap-4" aria-busy="true">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }
  if (query.isError) return <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />;
  return children(query.data);
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
      <TriangleAlert aria-hidden="true" className="size-8 text-signal" />
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw />
        جرّب تاني
      </Button>
    </div>
  );
}
