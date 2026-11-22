/** Keyboard users can jump past the header straight to the page content. */
export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:right-3"
    >
      تخطّى للمحتوى
    </a>
  );
}
