import { Sidebar } from "@/components/layout/sidebar";
import { getUserRole } from "@/lib/supabase/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();
  
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900">
      <Sidebar userRole={role} />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
