"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Calendar, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { inputClassName } from "@/components/ui/field";

export function TransactionSearch() {
  const t = useTranslations("Transaction");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }
    
    if (date) {
      params.set("date", date);
    } else {
      params.delete("date");
    }

    // Only push if the search string actually changed
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    
    if (newSearch !== currentSearch) {
      router.push(`${pathname}?${newSearch}` as Route);
    }
  }, [debouncedQuery, date, pathname, router, searchParams]);

  const clearFilters = () => {
    setQuery("");
    setDate("");
    router.push(pathname as Route);
  };

  const hasFilters = query || date;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400 rtl:left-auto rtl:right-3">
          <Search className="size-4" />
        </div>
        <input
          type="text"
          placeholder={t("search")}
          className={`${inputClassName} pl-10 rtl:pl-3 rtl:pr-10`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="relative w-full sm:w-48">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400 rtl:left-auto rtl:right-3">
          <Calendar className="size-4" />
        </div>
        <input
          type="date"
          className={`${inputClassName} pl-10 rtl:pl-3 rtl:pr-10`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-2 text-sm font-medium text-brass-700 hover:text-brass-800"
        >
          <X className="size-4" />
          <span>{t("allDates")}</span>
        </button>
      )}
    </div>
  );
}
