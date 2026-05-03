"use client";

import { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { BriefcaseBusiness, LayoutDashboard, Scale, LogOut, History, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { signOutAction } from "@/app/[locale]/(auth)/login/actions";

type NavItem = {
  href: string;
  translationKey: string;
  icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", translationKey: "Dashboard.title", icon: LayoutDashboard },
  { href: "/clients", translationKey: "Clients.title", icon: BriefcaseBusiness },
  { href: "/admin/transactions", translationKey: "Admin.allTransactions", icon: History, adminOnly: true },
  { href: "/admin/users", translationKey: "Admin.manageUsers", icon: Users, adminOnly: true },
];

export function Sidebar({ userRole }: { userRole: "superadmin" | "admin" | "user" | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const tSidebar = useTranslations("Sidebar");
  const tDashboard = useTranslations("Dashboard");
  const tClients = useTranslations("Clients");

  function getLabel(key: string) {
    if (key === "Dashboard.title") return tDashboard("title");
    if (key === "Clients.title") return tClients("title");
    if (key === "Admin.allTransactions") return "All Transactions Log";
    if (key === "Admin.manageUsers") return "Manage Users";
    return key;
  }

  async function handleLogout() {
    await signOutAction();
    router.push("/login");
  }

  return (
    <aside className="border-ink-100 bg-white/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:border-r">
      <div className="flex h-16 items-center gap-3 border-b border-ink-100 px-5 lg:h-20">
        <div className="flex size-10 items-center justify-center rounded-md bg-ink-900 text-white">
          <Scale className="size-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-700">
            {tSidebar("appName")}
          </p>
          <p className="text-xs text-ink-700">{tSidebar("subtitle")}</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:py-6">
        {navItems
          .filter((item) => !item.adminOnly || userRole === "admin" || userRole === "superadmin")
          .map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {getLabel(item.translationKey)}
              </Link>
            );
          })}
        
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          <LogOut className="size-4" aria-hidden />
          {tSidebar("logout")}
        </button>
      </nav>
      
      <div className="absolute bottom-0 left-0 w-full border-t border-ink-100 p-4 lg:fixed lg:w-64">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}
