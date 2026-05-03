"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { LedgerTransaction } from "@/lib/supabase/types";

export function ClientFinanceChart({
  transactions,
}: {
  transactions: LedgerTransaction[];
}) {
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");

  if (transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-ink-100 text-sm text-ink-700">
        No transaction history available.
      </div>
    );
  }

  // Process transactions into monthly balance
  const byMonth = new Map<string, { month: string; balance: number }>();
  
  // Sort transactions by date ascending for cumulative balance
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  
  let cumulativeBalance = 0;
  sorted.forEach((t) => {
    const month = t.date.slice(0, 7); // YYYY-MM
    const amount = Number(t.amount);
    cumulativeBalance += t.type === "payment" ? amount : -amount;
    byMonth.set(month, { month, balance: cumulativeBalance });
  });

  const chartData = Array.from(byMonth.values());

  return (
    <div className="h-72 w-full px-2 pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 10, right: 20, left: isRtl ? 20 : 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b7355" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#8b7355" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={10}
            reversed={isRtl}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            orientation={isRtl ? "right" : "left"}
            tickFormatter={(value) => formatCurrency(value, locale, true)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const balance = payload[0].value as number;
                return (
                  <div className="rounded-lg border border-ink-100 bg-white/95 p-3 shadow-2xl backdrop-blur-sm">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-medium text-ink-600">Account Balance</span>
                      <span className={cn(
                        "text-base font-bold",
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {formatCurrency(balance, locale)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={0} stroke="#E5E7EB" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#8b7355"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorBalance)"
            activeDot={{ r: 6, strokeWidth: 0, fill: "#8b7355" }}
            dot={{ r: 3, fill: "#8b7355", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
