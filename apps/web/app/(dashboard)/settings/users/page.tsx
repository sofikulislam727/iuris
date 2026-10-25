import { headers } from "next/headers";
import { ProvisionUserForm } from "@/components/admin/provision-user-form";
import { UsersTable, type UserRow } from "@/components/admin/users-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/auth-helpers";

export const metadata = { title: "Users · IURIS" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Dhaka",
});

async function UsersContent() {
  const session = await requireSession();
  const { users } = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: await headers(),
  });

  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "",
    banned: Boolean(u.banned),
    created: dateFormat.format(new Date(u.createdAt)),
  }));

  return (
    <div className="space-y-8">
      <section aria-labelledby="provision-heading" className="space-y-3">
        <h2 id="provision-heading" className="text-lg font-medium">
          Create an account
        </h2>
        <p className="text-sm text-muted-foreground">
          The new user receives an email to set their own password. You never see or share it.
        </p>
        <ProvisionUserForm />
      </section>

      <section aria-labelledby="users-heading" className="space-y-3">
        <h2 id="users-heading" className="text-lg font-medium">
          Accounts ({rows.length})
        </h2>
        <UsersTable users={rows} currentUserId={session.user.id} />
      </section>
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedPage roles={["admin"]}>
      <PageHeader title="Users" description="Manage who can access IURIS." />
      <UsersContent />
    </ProtectedPage>
  );
}