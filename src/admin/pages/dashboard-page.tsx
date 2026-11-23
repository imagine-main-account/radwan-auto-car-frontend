import { Link } from "react-router";

import { PageHeader } from "@/admin/components/page-header";
import { adminNavGroups } from "@/admin/nav";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isBannerActive } from "@/lib/banner";
import { useMe } from "@/services/auth";
import { useGetBanner } from "@/services/banner";
import { useGetAllRepairServices } from "@/services/repair-services";
import { useGetAllReviewSubmissions } from "@/services/review-submissions";
import { useGetAllReviews } from "@/services/reviews";

const visibleCount = (items?: { visible: boolean }[]) =>
  items ? `${items.filter((item) => item.visible).length} من ${items.length}` : "…";

export default function DashboardPage() {
  const { data: user } = useMe();
  const services = useGetAllRepairServices();
  const reviews = useGetAllReviews();
  const banner = useGetBanner();
  const submissions = useGetAllReviewSubmissions();

  const stats = [
    { label: "الخدمات الظاهرة", value: visibleCount(services.data), url: "/admin/services" },
    { label: "الآراء الظاهرة", value: visibleCount(reviews.data), url: "/admin/reviews" },
    {
      label: "آراء جديدة مستنية مراجعة",
      value: submissions.data ? String(submissions.data.length) : "…",
      url: "/admin/review-submissions",
    },
    {
      label: "شريط الإعلان",
      value: banner.data ? (isBannerActive(banner.data) ? "ظاهر" : "مقفول") : "…",
      url: "/admin/banner",
    },
  ];
  const pages = adminNavGroups.flatMap((group) => group.items).filter((item) => item.url !== "/admin");

  return (
    <>
      {/* "Open the site" is already in the admin header on every page. */}
      <PageHeader title={`أهلاً ${user?.name ?? ""}`} description="من هنا تقدر تعدّل كل حاجة في صفحة الورشة." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.url} className="rounded-xl">
            <Card className="h-full py-4 transition-colors hover:bg-accent sm:py-6">
              <CardHeader className="px-4 sm:px-6">
                <CardDescription className="text-xs sm:text-sm">{stat.label}</CardDescription>
                <CardTitle className="text-xl sm:text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold sm:mt-10">عدّل محتوى الصفحة</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((item) => (
          <Link key={item.url} to={item.url} className="rounded-xl">
            <Card className="h-full flex-row items-center gap-4 px-4 py-4 transition-colors hover:bg-accent sm:px-5 sm:py-6">
              <item.icon aria-hidden="true" className="size-6 shrink-0 text-signal" />
              <div className="grid gap-1">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
