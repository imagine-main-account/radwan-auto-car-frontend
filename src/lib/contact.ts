import type { SiteInfo } from "@/schemas/content";

export type ContactLink = { label: string; href: string };

/** "01141592426" -> "011 4159 2426" */
export function formatMobile(number: string) {
  return `${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`;
}

/** Egyptian mobile numbers stored as "01xxxxxxxxx" -> international "201xxxxxxxxx". */
const international = (number: string) => `2${number}`;

export function toContactLinks(info: SiteInfo) {
  return {
    phone: { label: formatMobile(info.phone), href: `tel:+${international(info.phone)}` },
    whatsapp: { label: formatMobile(info.whatsapp), href: `https://wa.me/${international(info.whatsapp)}` },
    email: { label: info.email, href: `mailto:${info.email}` },
  } satisfies Record<string, ContactLink>;
}
