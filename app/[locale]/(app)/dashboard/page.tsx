import { getTranslations } from "next-intl/server";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getDashboardData();
  const t = await getTranslations("Dashboard");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brass-700">{t("title")}</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink-900">{t("title")}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t("totalClients")} value={String(data.totalClients)} />
        <MetricCard label={t("totalBalance")} value={formatCurrency(data.totalBalance, locale)} />
        <MetricCard label={t("totalPayments")} value={formatCurrency(data.totalPayments, locale)} />
        <MetricCard label={t("totalExpenses")} value={formatCurrency(data.totalExpenses, locale)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments vs expenses over time</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceChart data={data.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-ink-700">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
      </CardContent>
    </Card>
  );
}
