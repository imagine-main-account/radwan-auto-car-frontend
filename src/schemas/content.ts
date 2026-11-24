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

/** The image is not part of the form: it is uploaded on its own (PUT /hero/image). */
export const heroInputSchema = z.object({
  description: text(300),
  imageAlt: text(150),
});
export type HeroInput = z.infer<typeof heroInputSchema>;
export type Hero = HeroInput & { image: string };

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

/** The image is not part of the form: it is uploaded on its own (PUT /seo/image). */
export const seoInputSchema = z.object({
  title: text(70),
  description: text(170),
});
export type SeoInput = z.infer<typeof seoInputSchema>;
export type Seo = SeoInput & { image: string };

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

const galleryPhotoFieldsSchema = z.object({
  caption: text(80),
  visible: z.boolean(),
});
export type GalleryPhoto = z.infer<typeof galleryPhotoFieldsSchema> & { id: string; image: string };

const imageFile = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File, "اختار صورة");

export const galleryPhotoInputSchema = galleryPhotoFieldsSchema.extend({ file: imageFile });
export type GalleryPhotoInput = z.infer<typeof galleryPhotoInputSchema>;

/** Editing a photo: a new `file` replaces the image, leaving it out keeps the current one. */
export const galleryPhotoPatchSchema = galleryPhotoFieldsSchema.extend({ file: imageFile.optional() });
export type GalleryPhotoPatch = z.infer<typeof galleryPhotoPatchSchema>;

/* ---------- Review submissions (sent by visitors from the landing page) ---------- */

export const reviewSubmissionInputSchema = z.object({
  name: text(60),
  text: text(400),
});
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionInputSchema>;
export type ReviewSubmission = ReviewSubmissionInput & { id: string; createdAt: string };

/** A blocked sender, with the review that got them blocked. */
export type BlockedSender = ReviewSubmission;

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
