import { LoaderCircle } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" aria-busy="true">
      <LoaderCircle aria-label="بيحمّل" className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}
