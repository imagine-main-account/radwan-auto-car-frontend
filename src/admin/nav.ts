import {
  Clock,
  Contact,
  Images,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquareQuote,
  PanelTop,
  Search,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
};

export const adminNavGroups: { label: string; items: AdminNavItem[] }[] = [
  {
    label: "عام",
    items: [{ title: "نظرة عامة", description: "ملخص الموقع", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "محتوى الصفحة",
    items: [
      {
        title: "بيانات التواصل",
        description: "الاسم والعنوان والتليفون والواتساب ولينكات فيسبوك",
        url: "/admin/site-info",
        icon: Contact,
      },
      { title: "المواعيد", description: "مواعيد الشغل اللي بتظهر في الصفحة", url: "/admin/hours", icon: Clock },
      { title: "الواجهة", description: "أول جزء في الصفحة: الوصف والصورة", url: "/admin/hero", icon: PanelTop },
      {
        title: "شريط الإعلان",
        description: "رسالة مؤقتة فوق الصفحة (أجازات، عروض)",
        url: "/admin/banner",
        icon: Megaphone,
      },
      { title: "الخدمات", description: "المشاكل اللي بتصلحوها وإزاي", url: "/admin/services", icon: Wrench },
      {
        title: "آراء العملاء",
        description: "التقييمات اللي بتظهر في الصفحة",
        url: "/admin/reviews",
        icon: MessageSquareQuote,
      },
      {
        title: "آراء جديدة",
        description: "آراء بعتها الزوار من الموقع، اقبلها أو ارفضها",
        url: "/admin/review-submissions",
        icon: Inbox,
      },
      { title: "صور الورشة", description: "الصور في قسم «شغلنا بيتكلم»", url: "/admin/gallery", icon: Images },
    ],
  },
  {
    label: "الإعدادات",
    items: [
      {
        title: "جوجل والمشاركة",
        description: "العنوان والوصف اللي بيظهروا في جوجل وواتساب",
        url: "/admin/seo",
        icon: Search,
      },
      { title: "الحساب", description: "تغيير كلمة السر", url: "/admin/settings", icon: Settings },
    ],
  },
];
