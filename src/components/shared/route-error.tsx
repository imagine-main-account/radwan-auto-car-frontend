import { TriangleAlert } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api";

/** Shown when a page fails to load (network error, missing chunk, bug). */
export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <TriangleAlert aria-hidden="true" className="size-10 text-signal" />
      <h1 className="text-2xl font-bold">{notFound ? "الصفحة دي مش موجودة" : "حصلت مشكلة في تحميل الصفحة"}</h1>
      {!notFound && <p className="max-w-md text-muted-foreground">{getErrorMessage(error)}</p>}
      <div className="flex gap-2">
        <Button onClick={() => window.location.reload()}>جرّب تاني</Button>
        <Button variant="outline" asChild>
          <a href="/">الصفحة الرئيسية</a>
        </Button>
      </div>
    </div>
  );
}
