import { LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";

import { adminNavGroups } from "@/admin/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { brand } from "@/config/site";
import { useLogout, useMe } from "@/services/auth";
import { useGetAllReviewSubmissions } from "@/services/review-submissions";

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { data: user } = useMe();
  const logout = useLogout();
  const { data: submissions } = useGetAllReviewSubmissions();
  /** Count shown next to a nav item, e.g. reviews waiting for approval. */
  const badges: Record<string, number | undefined> = { "/admin/review-submissions": submissions?.length };
  const navigate = useNavigate();

  const handleLogout = () => logout.mutate(undefined, { onSettled: () => navigate("/admin/login", { replace: true }) });

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <Link to="/admin" className="rounded-md p-2">
          <img src={brand.logo} alt={brand.name} width={600} height={320} className="h-12 w-auto" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {adminNavGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <NavLink to={item.url} end onClick={() => setOpenMobile(false)}>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive} asChild>
                          <span>
                            <item.icon />
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                    {!!badges[item.url] && (
                      <SidebarMenuBadge aria-label={`${badges[item.url]} مستنيين مراجعة`}>
                        {badges[item.url]}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <div className="px-2 text-sm">
            <p className="font-semibold">{user.name}</p>
            <p dir="ltr" className="truncate text-end text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={logout.isPending}>
              <LogOut />
              تسجيل خروج
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
