import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn("grid gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-300", className)}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClassName =
  "h-10 rounded-md border border-ink-100 bg-white px-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-700/60 focus:border-brass-500 focus:ring-2 focus:ring-brass-100 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50 dark:placeholder:text-ink-400/60 dark:focus:border-brass-500 dark:focus:ring-brass-900/40";

export const textareaClassName =
  "min-h-24 rounded-md border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-700/60 focus:border-brass-500 focus:ring-2 focus:ring-brass-100 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50 dark:placeholder:text-ink-400/60 dark:focus:border-brass-500 dark:focus:ring-brass-900/40";
