import { cn } from "@/lib/utils";

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function ActionButton({
  className,
  variant = "primary",
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-ink-900 text-white hover:bg-ink-700 dark:bg-brass-600 dark:text-ink-900 dark:hover:bg-brass-500",
        variant === "secondary" &&
          "border border-ink-100 bg-white text-ink-900 hover:bg-ink-50 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50 dark:hover:bg-ink-700",
        variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
        className,
      )}
      {...props}
    />
  );
}
