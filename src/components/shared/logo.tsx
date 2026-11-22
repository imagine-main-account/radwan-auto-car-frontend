import { brand } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "#top" }: { className?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex shrink-0 rounded-md">
      <img
        src={brand.logo}
        alt={brand.name}
        width={600}
        height={320}
        className={cn("h-14 w-auto sm:h-16", className)}
      />
    </a>
  );
}
