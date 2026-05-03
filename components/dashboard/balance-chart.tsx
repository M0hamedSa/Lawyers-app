"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

export function BalanceChart({
  data,
}: {
  data: { month: string; payments: number; expenses: number }[];
}) {
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-ink-100 text-sm text-ink-700">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="h-80 w-full px-2 pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 20, left: isRtl ? 20 : 0, bottom: 20 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
            reversed={isRtl}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            orientation={isRtl ? "right" : "left"}
            tickFormatter={(value) => formatCurrency(value, locale, true)}
          />
          <Tooltip
            cursor={{ fill: "#F9FAFB", opacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-ink-100 bg-white/95 p-3 shadow-2xl backdrop-blur-sm">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
                    <div className="space-y-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {payload.map((entry: any) => (
                        <div key={entry.name} className="flex items-center justify-between gap-8 text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="size-2.5 rounded-sm" 
                              style={{ backgroundColor: entry.fill }} 
                            />
                            <span className="text-ink-600 font-medium">{entry.name}</span>
                          </div>
                          <span className="font-bold text-ink-900">
                            {formatCurrency(entry.value, locale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={40}
            iconType="square"
            iconSize={10}
            formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-wider text-ink-700 ml-2">{value}</span>}
          />
          <Bar 
            dataKey="payments" 
            name="Payments" 
            fill="#10B981" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          />
          <Bar 
            dataKey="expenses" 
            name="Expenses" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
