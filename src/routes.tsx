import type { ComponentType } from "react";
import type { RouteObject } from "react-router";

import { PageLoader } from "@/components/shared/page-loader";
import { RouteError } from "@/components/shared/route-error";
import LandingPage from "@/pages/landing-page";

/** Admin pages are code-split: visitors of the landing page never download them. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default });

/** Shared by the browser router (main.tsx) and the build-time prerender (entry-server.tsx). */
export const routes: RouteObject[] = [
  {
    errorElement: <RouteError />,
    HydrateFallback: PageLoader,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/admin/login", lazy: page(() => import("@/admin/pages/login-page")) },
      {
        path: "/admin",
        lazy: page(() => import("@/admin/layout/admin-layout")),
        children: [
          { index: true, lazy: page(() => import("@/admin/pages/dashboard-page")) },
          { path: "site-info", lazy: page(() => import("@/admin/pages/site-info-page")) },
          { path: "hours", lazy: page(() => import("@/admin/pages/hours-page")) },
          { path: "hero", lazy: page(() => import("@/admin/pages/hero-page")) },
          { path: "banner", lazy: page(() => import("@/admin/pages/banner-page")) },
          { path: "services", lazy: page(() => import("@/admin/pages/services-page")) },
          { path: "reviews", lazy: page(() => import("@/admin/pages/reviews-page")) },
          { path: "gallery", lazy: page(() => import("@/admin/pages/gallery-page")) },
          { path: "seo", lazy: page(() => import("@/admin/pages/seo-page")) },
          { path: "settings", lazy: page(() => import("@/admin/pages/settings-page")) },
        ],
      },
    ],
  },
];
