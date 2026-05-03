"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ActionButton } from "@/components/ui/action-button";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { UserPlus, Users, Mail, Loader2 } from "lucide-react";
import { Field, inputClassName } from "@/components/ui/field";

type UserWithAccess = {
  id: string;
  full_name: string;
  role: UserRole;
  client_access: { client_id: string }[];
};

type ClientMinimal = {
  id: string;
  name: string;
};

export function UsersManagement({ 
  initialUsers, 
  allClients,
  currentRole,
  currentUserId
}: { 
  initialUsers: UserWithAccess[]; 
  allClients: ClientMinimal[];
  currentRole: "superadmin" | "admin" | "user" | null;
  currentUserId: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [users, setUsers] = useState<UserWithAccess[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserWithAccess | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", full_name: "", role: "user" });
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openManage(user: UserWithAccess) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  async function changeRole(newRole: UserRole) {
    if (!selectedUser || currentRole !== "superadmin") return;

    setSubmitting(true);
    setTogglingId(`role-${newRole}`);
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", selectedUser.id);

    if (!error) {
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    setSubmitting(false);
    setTogglingId(null);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setInviteError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const appBase =
        (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
          (typeof window !== "undefined" ? window.location.origin : "")) || "";
      const redirectTo = appBase ? `${appBase}/${locale}/set-password` : undefined;

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ ...inviteForm, redirectTo }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to invite user");
      }

      setInviteModalOpen(false);
      setInviteForm({ email: "", full_name: "", role: "user" });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setInviteError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAccess(clientId: string, hasAccess: boolean) {
    if (!selectedUser) return;

    setSubmitting(true);
    setTogglingId(clientId);
    if (hasAccess) {
      // Remove access
      const { error } = await supabase
        .from("client_access")
        .delete()
        .eq("user_id", selectedUser.id)
        .eq("client_id", clientId);

      if (!error) {
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id 
            ? { ...u, client_access: u.client_access.filter(a => a.client_id !== clientId) }
            : u
        ));
        setSelectedUser(prev => prev ? { 
          ...prev, 
          client_access: prev.client_access.filter(a => a.client_id !== clientId) 
        } : null);
      }
    } else {
      // Grant access
      const { error } = await supabase
        .from("client_access")
        .insert({ user_id: selectedUser.id, client_id: clientId });

      if (!error) {
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id 
            ? { ...u, client_access: [...u.client_access, { client_id: clientId }] }
            : u
        ));
        setSelectedUser(prev => prev ? { 
          ...prev, 
          client_access: [...prev.client_access, { client_id: clientId }] 
        } : null);
      }
    }
    setSubmitting(false);
    setTogglingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-stretch sm:justify-end">
        {currentRole === "superadmin" && (
          <ActionButton className="w-full sm:w-auto" onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="size-4 mr-2" />
            Invite New User
          </ActionButton>
        )}
      </div>
      <Card>
        <CardContent>
          <DataTable
            data={users}
            empty="No users found."
            getRowKey={(u) => u.id}
            columns={[
              {
                key: "full_name",
                header: "Full Name",
                cell: (u) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-ink-100 text-ink-700">
                      <Users className="size-4" />
                    </div>
                    <span className="font-medium text-ink-900">{u.full_name}</span>
                  </div>
                ),
              },
              {
                key: "role",
                header: "Role",
                cell: (u) => (
                  <span className="inline-flex rounded-md bg-ink-100 px-2 py-1 text-xs font-semibold capitalize text-ink-700">
                    {u.role}
                  </span>
                ),
              },
              {
                key: "clients",
                header: "Assigned Clients",
                cell: (u) => (
                  <span className="text-sm text-ink-700">
                    {u.client_access.length} clients
                  </span>
                ),
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                cell: (u) => (
                  <ActionButton variant="secondary" onClick={() => openManage(u)}>
                    Manage Access
                  </ActionButton>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Modal 
        title={`Manage ${selectedUser?.full_name}`} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-6">
          {currentRole === "superadmin" && (
            <div className="space-y-2 border-b border-ink-100 pb-4">
              <label className="text-sm font-semibold text-ink-900">User Role</label>
              {selectedUser?.id === currentUserId && selectedUser?.role === "superadmin" ? (
                <p className="text-xs text-brass-700 font-medium">
                  Superadmins cannot change their own role to prevent accidental lockout.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(["user", "admin", "superadmin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={submitting}
                      onClick={() => changeRole(r)}
                      className={cn(
                        "flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition sm:min-w-0",
                        selectedUser?.role === r
                          ? "border-ink-900 bg-ink-900 text-white dark:border-brass-500 dark:bg-brass-600 dark:text-ink-900"
                          : "border-ink-200 text-ink-700 hover:bg-ink-50 dark:border-ink-600 dark:text-ink-300 dark:hover:bg-ink-800"
                      )}
                    >
                      {togglingId === `role-${r}` && <Loader2 className="size-3 animate-spin" />}
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-semibold text-ink-900">Client Access</label>
            <p className="text-sm text-ink-700">
              Select which clients this user is allowed to access and manage.
            </p>
            <div className="max-h-64 overflow-y-auto rounded-md border border-ink-100">
              <div className="divide-y divide-ink-50">
                {allClients.map((client) => {
                  const hasAccess = selectedUser?.client_access.some(a => a.client_id === client.id);
                  return (
                    <div key={client.id} className="flex items-center justify-between p-3 hover:bg-ink-50">
                      <span className="text-sm font-medium text-ink-900">{client.name}</span>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => toggleAccess(client.id, !!hasAccess)}
                        className={cn(
                          "flex items-center gap-2 rounded px-3 py-1 text-xs font-semibold transition",
                          hasAccess
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        )}
                      >
                        {togglingId === client.id && <Loader2 className="size-3 animate-spin" />}
                        {hasAccess ? "Revoke" : "Grant"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <ActionButton onClick={() => setModalOpen(false)}>
              Done
            </ActionButton>
          </div>
        </div>
      </Modal>

      <Modal
        title="Invite New User"
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <p className="text-sm text-ink-700">
            Send an invitation email to a new team member. They will receive a link to set their password.
          </p>

          {inviteError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {inviteError}
            </div>
          )}

          <Field label="Full Name">
            <input
              required
              className={inputClassName}
              value={inviteForm.full_name}
              onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </Field>

          <Field label="Email Address">
            <input
              required
              type="email"
              className={inputClassName}
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="john@example.com"
            />
          </Field>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink-900">Initial Role</label>
            <div className="flex gap-2">
              {(["user", "admin", "superadmin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setInviteForm({ ...inviteForm, role: r })}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                    inviteForm.role === r
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-ink-200 text-ink-700 hover:bg-ink-50"
                  )}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <ActionButton 
              variant="secondary" 
              type="button" 
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </ActionButton>
            <ActionButton type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="size-4 mr-2" />
                  Send Invitation
                </>
              )}
            </ActionButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
