"use client";

import { useEffect, useState } from "react";
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
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    function update() {
      setCompact(!mq.matches);
    }
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-md border border-dashed border-ink-100 text-sm text-ink-700 dark:border-ink-600 dark:text-ink-400 sm:h-72">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full min-w-0 px-0 pt-2 sm:h-80 sm:px-2 sm:pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={
            compact
              ? { top: 4, right: 2, left: isRtl ? 0 : 0, bottom: 28 }
              : { top: 12, right: 12, left: isRtl ? 8 : 0, bottom: 12 }
          }
          barGap={compact ? 4 : 8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            fontSize={compact ? 10 : 12}
            tickLine={false}
            axisLine={false}
            dy={8}
            reversed={isRtl}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#9CA3AF"
            width={compact ? 44 : 56}
            fontSize={compact ? 10 : 12}
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
                  <div className="rounded-lg border border-ink-100 bg-white/95 p-3 shadow-2xl backdrop-blur-sm dark:border-ink-700 dark:bg-ink-900/95">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">{label}</p>
                    <div className="space-y-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {payload.map((entry: any) => (
                        <div key={entry.name} className="flex items-center justify-between gap-8 text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="size-2.5 rounded-sm" 
                              style={{ backgroundColor: entry.fill }} 
                            />
                            <span className="text-ink-600 font-medium dark:text-ink-300">{entry.name}</span>
                          </div>
                          <span className="font-bold text-ink-900 dark:text-ink-50">
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
            align="center"
            height={compact ? 28 : 36}
            iconType="square"
            iconSize={compact ? 8 : 10}
            wrapperStyle={{ fontSize: compact ? 9 : 11 }}
            formatter={(value) => (
              <span className="font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="payments"
            name="Payments"
            fill="#10B981"
            radius={[3, 3, 0, 0]}
            barSize={compact ? 14 : 22}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#EF4444"
            radius={[3, 3, 0, 0]}
            barSize={compact ? 14 : 22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
