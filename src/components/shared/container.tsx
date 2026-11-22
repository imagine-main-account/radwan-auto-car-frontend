import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Page-width wrapper shared by every section. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-360 px-5 lg:px-10", className)} {...props} />;
}
