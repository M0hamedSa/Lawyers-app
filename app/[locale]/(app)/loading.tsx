import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-ping rounded-full border-4 border-brass-500/20 opacity-20" />
        <Loader2 className="size-10 animate-spin text-brass-500" />
      </div>
      <p className="animate-pulse text-sm font-medium text-ink-700">Loading your data...</p>
    </div>
  );
}
