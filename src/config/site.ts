/**
 * Static parts of the site that are not editable from the admin.
 * Everything else (contact info, hours, services, reviews, photos...) comes from the API.
 */
import logo from "@/assets/logo.webp";

export const brand = {
  name: "مركز الرضوان لصيانة السيارات الحديثة",
  logo,
};

export const navLinks = [
  { label: "الخدمات", href: "#services" },
  { label: "شغلنا", href: "#workshop" },
  { label: "آراء العملاء", href: "#reviews" },
  { label: "العنوان", href: "#visit" },
];
