import {
  Cog,
  Disc,
  Droplet,
  Flame,
  ScanSearch,
  Snowflake,
  Thermometer,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ServiceLamp = { icon: LucideIcon };

/** First match wins, so the more specific words come first (e.g. "لمبة المحرك" is electrical, not engine). */
const lamps: { words: string[]; lamp: ServiceLamp }[] = [
  { words: ["تسخن", "حرار", "مية", "تبريد", "ردياتير"], lamp: { icon: Thermometer } },
  { words: ["كهربا", "لمبة", "حساس", "ضفيرة", "بطارية"], lamp: { icon: Zap } },
  { words: ["فتيس", "ناقل الحركة"], lamp: { icon: Cog } },
  { words: ["مستعمل", "تشتري", "شراء"], lamp: { icon: ScanSearch } },
  { words: ["فرامل", "فرملة"], lamp: { icon: Disc } },
  { words: ["تكييف", "تكيف"], lamp: { icon: Snowflake } },
  { words: ["محرك", "موتور", "دخان", "عمرة"], lamp: { icon: Flame } },
  { words: ["صيانة", "زيت", "فلاتر", "فلتر"], lamp: { icon: Droplet } },
];

const fallback: ServiceLamp = { icon: Wrench };

/**
 * The dashboard warning light for a service, picked from words in its symptom.
 * (The API has no icon field, so the owner's text decides it. Unknown symptoms get a wrench.)
 */
export function getServiceLamp(symptom: string): ServiceLamp {
  return lamps.find(({ words }) => words.some((word) => symptom.includes(word)))?.lamp ?? fallback;
}
