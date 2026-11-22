/** Anchor props for `href`: links that leave the site (WhatsApp, Maps, Facebook) open in a new tab. */
export function linkProps(href: string) {
  return /^https?:\/\//.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
}
