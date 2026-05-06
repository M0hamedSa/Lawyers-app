import { notFound } from "next/navigation";
import { ClientDetailsClient } from "@/components/clients/client-details-client";
import { getClient, getClientTransactions, getUserRole } from "@/lib/supabase/queries";
import { decodeId } from "@/lib/id-utils";

export const dynamic = "force-dynamic";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: hash } = await params;
  const id = decodeId(hash);

  try {
    const [client, transactions, userRole] = await Promise.all([
      getClient(id),
      getClientTransactions(id),
      getUserRole(),
    ]);

    return <ClientDetailsClient client={client} initialTransactions={transactions} userRole={userRole} />;
  } catch {
    notFound();
  }
}
