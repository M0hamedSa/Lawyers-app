import { ClientsPageClient } from "@/components/clients/clients-page-client";
import { getClients, getUserRole } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [clients, role] = await Promise.all([getClients(), getUserRole()]);
  return <ClientsPageClient initialClients={clients} userRole={role} />;
}
