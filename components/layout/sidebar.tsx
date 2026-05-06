"use client";

import { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { BriefcaseBusiness, LayoutDashboard, Scale, LogOut, History, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
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

export function Sidebar({
  userRole,
  userName,
}: {
  userRole: "superadmin" | "admin" | "user" | null;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const tSidebar = useTranslations("Sidebar");
  const tDashboard = useTranslations("Dashboard");
  const tClients = useTranslations("Clients");
  const tAdmin = useTranslations("Admin");

  function getLabel(key: string) {
    if (key === "Dashboard.title") return tDashboard("title");
    if (key === "Clients.title") return tClients("title");
    if (key === "Admin.allTransactions") return tAdmin("allTransactions");
    if (key === "Admin.manageUsers") return tAdmin("manageUsers");
    return key;
  }

  async function handleLogout() {
    await signOutAction();
    router.push("/login");
  }

  const displayName = userName.trim() || tSidebar("unnamedUser");

  return (
    <aside className="relative flex w-full flex-col border-ink-100 bg-white/95 dark:border-ink-800 dark:bg-ink-900/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:min-h-0 lg:w-64 lg:border-r">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 px-5 dark:border-ink-800 lg:h-20">
        <div className="flex size-10 items-center justify-center rounded-md bg-ink-900 text-white dark:bg-brass-600">
          <Scale className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass-700 dark:text-brass-400">
            {tSidebar("appName")}
          </p>
          <p className="truncate text-xs text-ink-700 dark:text-ink-300">{tSidebar("subtitle")}</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto overflow-y-hidden px-3 py-2 [-webkit-overflow-scrolling:touch] lg:flex-1 lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden lg:px-4 lg:py-6">
        <div className="flex min-w-0 gap-2 lg:flex-col lg:gap-2">
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
                    "flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition lg:min-w-0",
                    active
                      ? "bg-ink-900 text-white dark:bg-brass-600 dark:text-ink-900"
                      : "text-ink-700 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-white",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{getLabel(item.translationKey)}</span>
                </Link>
              );
            })}
        </div>
      </nav>

      <div className="mt-auto shrink-0 space-y-3 border-t border-ink-100 bg-white/95 p-4 dark:border-ink-800 dark:bg-ink-900/95">
        <div className="rounded-md border border-ink-100 bg-ink-50 px-3 py-2 dark:border-ink-700 dark:bg-ink-800/80">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
            {tSidebar("signedInAs")}
          </p>
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{displayName}</p>
        </div>

        <ThemeToggle />

        <LanguageSwitcher />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-ink-800 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          {tSidebar("logout")}
        </button>
      </div>
    </aside>
  );
}
