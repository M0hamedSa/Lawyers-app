"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function ExportTransactionsButton({ clientId }: { clientId?: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("Admin");

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = new URL("/api/export-transactions", window.location.origin);
      
      const query = searchParams.get("query");
      if (query) url.searchParams.set("query", query);
      
      const date = searchParams.get("date");
      if (date) url.searchParams.set("date", date);

      const type = searchParams.get("type");
      if (type) url.searchParams.set("type", type);

      if (clientId) {
        url.searchParams.set("client_id", clientId);
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to export report");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = clientId ? `client_${clientId}_report.pdf` : "transactions_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={isExporting}
      className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 shadow-sm hover:bg-ink-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-ink-800 dark:bg-ink-950 dark:text-ink-50 dark:hover:bg-ink-900"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {t("exportReport")}
    </button>
  );
}
