/**
 * Shapes of everything the API returns, plus the validation rules the admin forms use.
 * Types are inferred from the schemas, so the two can never drift apart.
 */
import { z } from "zod";

const text = (max: number) => z.string().trim().min(1, "الحقل ده مطلوب").max(max, `أقصى عدد حروف ${max}`);

const optionalText = (max: number) => z.string().trim().max(max, `أقصى عدد حروف ${max}`);

const mobile = z
  .string()
  .trim()
  .regex(/^01[0125]\d{8}$/, "اكتب رقم موبايل مصري من 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015");

const url = z.url("اكتب رابط صحيح يبدأ بـ https://");

const image = z.string().min(1, "اختار صورة");

const count = z.number("اكتب رقم").int("اكتب رقم صحيح").min(0, "الرقم لازم يكون 0 أو أكتر");

/* ---------- Singletons ---------- */

export const siteInfoSchema = z.object({
  name: text(120),
  area: text(80),
  address: text(200),
  footerArea: text(80),
  phone: mobile,
  whatsapp: mobile,
  email: z.email("اكتب إيميل صحيح"),
  mapUrl: url,
  facebook: z.object({ page: url, reviews: url, photos: url }),
  rating: z.object({ percent: count.max(100, "أقصى نسبة 100"), count }),
});
export type SiteInfo = z.infer<typeof siteInfoSchema>;

export const hoursSchema = z.object({
  title: text(60),
  from: text(40),
  to: text(40),
  note: optionalText(120),
});
export type Hours = z.infer<typeof hoursSchema>;

export const heroSchema = z.object({
  description: text(300),
  image,
  imageAlt: text(150),
});
export type Hero = z.infer<typeof heroSchema>;

export const bannerVariants = ["info", "warning"] as const;

export const bannerSchema = z
  .object({
    enabled: z.boolean(),
    text: optionalText(160),
    variant: z.enum(bannerVariants),
    /** Last day the banner shows, as YYYY-MM-DD. `null` = no end date. */
    endsAt: z.string().nullable(),
  })
  .refine((banner) => !banner.enabled || banner.text.length > 0, {
    message: "اكتب نص الإعلان قبل ما تفعّله",
    path: ["text"],
  });
export type Banner = z.infer<typeof bannerSchema>;

export const seoSchema = z.object({
  title: text(70),
  description: text(170),
  image,
});
export type Seo = z.infer<typeof seoSchema>;

/* ---------- Collections ---------- */

export const repairServiceInputSchema = z.object({
  symptom: text(100),
  solution: text(300),
  visible: z.boolean(),
});
export type RepairServiceInput = z.infer<typeof repairServiceInputSchema>;
export type RepairService = RepairServiceInput & { id: string };

export const reviewInputSchema = z.object({
  name: text(60),
  text: text(400),
  visible: z.boolean(),
});
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type Review = ReviewInput & { id: string };

export const galleryLayouts = ["feature", "tile", "wide"] as const;

export const galleryPhotoSchema = z.object({
  id: z.string(),
  layout: z.enum(galleryLayouts),
  image,
  caption: text(80),
});
export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>;

export const gallerySchema = z.object({ photos: z.array(galleryPhotoSchema) });

/* ---------- Auth ---------- */

export type User = { id: string; name: string; email: string };

export const loginSchema = z.object({
  email: z.email("اكتب إيميل صحيح"),
  password: z.string().min(1, "اكتب كلمة السر"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "اكتب كلمة السر الحالية"),
    newPassword: z.string().min(8, "كلمة السر لازم تكون 8 حروف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "كلمتين السر مش زي بعض",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
