import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

import { ErrorState } from "@/admin/components/query-state";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import { useMe } from "@/services/auth";
import { AppSidebar } from "./app-sidebar";

/** Protects every /admin page: no token -> login, then loads the current user before rendering. */
export default function AdminLayout() {
  const location = useLocation();
  const me = useMe();
  useAdminDocument();

  if (!authToken.get()) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (me.isPending) return <PageLoader />;
  if (me.isError) {
    return (
      <div className="p-6">
        <ErrorState message={getErrorMessage(me.error)} onRetry={() => me.refetch()} />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:px-8">
            <SidebarTrigger aria-label="القائمة" />
            <span className="font-semibold">لوحة التحكم</span>
            <Button variant="ghost" size="sm" className="ms-auto" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                عرض الموقع
              </a>
            </Button>
          </header>
          <main className="flex-1 px-4 pt-6 md:px-8 md:pt-8">
            <div className="mx-auto max-w-3xl pb-10">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-center" />
    </TooltipProvider>
  );
}

/** Admin tab title, and keep the admin out of search engines. */
function useAdminDocument() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "لوحة التحكم | الرضوان";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.append(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);
}
