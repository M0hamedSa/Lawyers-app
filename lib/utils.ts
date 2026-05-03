import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale: string = "en-US", compact: boolean = false) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string, locale: string = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
