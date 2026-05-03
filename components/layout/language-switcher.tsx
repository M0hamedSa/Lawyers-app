"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-ink-900 dark:border-ink-600 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-white"
    >
      <Globe className="size-4" aria-hidden />
      {locale === "en" ? "عربي" : "English"}
    </button>
  );
}
