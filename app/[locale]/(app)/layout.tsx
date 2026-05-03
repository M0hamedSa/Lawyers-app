import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/supabase/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 transition-colors dark:bg-[#121210] dark:text-ink-50">
      <Sidebar userRole={user?.role ?? null} userName={user?.full_name ?? ""} />
      <main className="min-h-0 min-h-screen px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-6 lg:pl-72 lg:pr-8 lg:pb-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
