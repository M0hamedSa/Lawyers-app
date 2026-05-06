import { getAllUsers, getAdminClients, getCurrentUser } from "@/lib/supabase/queries";
import { UsersManagement } from "@/components/admin/users-management";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;
  
  if (role !== "admin" && role !== "superadmin") {
    redirect("/dashboard");
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
        currentRole={role} 
        currentUserId={currentUser?.id || ""} 
      />
    </div>
  );
}
