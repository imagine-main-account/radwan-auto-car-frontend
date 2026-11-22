import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

import { PageHeader } from "@/admin/components/page-header";
import { adminNavGroups } from "@/admin/nav";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isBannerActive } from "@/lib/banner";
import { useMe } from "@/services/auth";
import { useGetBanner } from "@/services/banner";
import { useGetAllRepairServices } from "@/services/repair-services";
import { useGetAllReviews } from "@/services/reviews";

const visibleCount = (items?: { visible: boolean }[]) =>
  items ? `${items.filter((item) => item.visible).length} من ${items.length}` : "…";

export default function DashboardPage() {
  const { data: user } = useMe();
  const services = useGetAllRepairServices();
  const reviews = useGetAllReviews();
  const banner = useGetBanner();

  const stats = [
    { label: "الخدمات الظاهرة", value: visibleCount(services.data), url: "/admin/services" },
    { label: "الآراء الظاهرة", value: visibleCount(reviews.data), url: "/admin/reviews" },
    {
      label: "شريط الإعلان",
      value: banner.data ? (isBannerActive(banner.data) ? "ظاهر" : "مقفول") : "…",
      url: "/admin/banner",
    },
  ];
  const pages = adminNavGroups.flatMap((group) => group.items).filter((item) => item.url !== "/admin");

  return (
    <>
      <PageHeader
        title={`أهلاً ${user?.name ?? ""}`}
        description="من هنا تقدر تعدّل كل حاجة في صفحة الورشة."
        actions={
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              افتح الموقع
            </a>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.url} className="rounded-xl">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold">عدّل محتوى الصفحة</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((item) => (
          <Link key={item.url} to={item.url} className="rounded-xl">
            <Card className="h-full flex-row items-center gap-4 px-5 transition-colors hover:bg-accent">
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
