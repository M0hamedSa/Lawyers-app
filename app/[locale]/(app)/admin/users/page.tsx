import { getAllUsers, getAdminClients, getCurrentUser } from "@/lib/supabase/queries";
import { UsersManagement } from "@/components/admin/users-management";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  
  if (role !== "admin" && role !== "superadmin") {
    redirect({ href: "/dashboard", locale: locale as "en" | "ar" });
  }

  const [users, clients] = await Promise.all([
    getAllUsers(),
    getAdminClients()
  ]);
  
  const tAdmin = await getTranslations("Admin");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brass-700">{tAdmin("title")}</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink-900">{tAdmin("manageUsers")}</h1>
      </div>

      <UsersManagement 
        initialUsers={users} 
        allClients={clients} 
        currentRole={role || null} 
        currentUserId={currentUser?.id || ""} 
      />
    </div>
  );
}
