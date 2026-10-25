"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  setUserBanAction,
  setUserRoleAction,
  type ActionResult,
} from "@/app/(dashboard)/settings/users/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  created: string;
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function run(id: string, task: () => Promise<ActionResult>, success: string) {
    setBusyId(id);
    startTransition(async () => {
      const result = await task();
      setBusyId(null);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(success);
      router.refresh();
    });
  }

  function changeRole(u: UserRow, role: "admin" | "security_officer") {
    if (role === u.role) return;
    if (!window.confirm(`Change ${u.name}'s role? They will be signed out.`)) return;
    run(u.id, () => setUserRoleAction({ userId: u.id, role }), "Role updated.");
  }

  function toggleBan(u: UserRow) {
    const message = u.banned
      ? `Re-enable ${u.name}?`
      : `Disable ${u.name}? They will be signed out and unable to sign in.`;
    if (!window.confirm(message)) return;
    run(
      u.id,
      () => setUserBanAction({ userId: u.id, banned: !u.banned }),
      u.banned ? "Account re-enabled." : "Account disabled.",
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            const busy = busyId === u.id;
            return (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.name}
                  {isSelf ? <span className="ml-2 text-xs text-muted-foreground">(you)</span> : null}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <select
                    aria-label={`Role for ${u.name}`}
                    value={u.role}
                    disabled={isSelf || busy}
                    onChange={(e) =>
                      changeRole(u, e.target.value as "admin" | "security_officer")
                    }
                    className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {u.role !== "admin" && u.role !== "security_officer" ? (
                      <option value={u.role}>{u.role || "No role"}</option>
                    ) : null}
                    <option value="security_officer">Security officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Badge variant={u.banned ? "destructive" : "secondary"}>
                    {u.banned ? "Disabled" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>{u.created}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={u.banned ? "outline" : "destructive"}
                    disabled={isSelf || busy}
                    onClick={() => toggleBan(u)}
                  >
                    {u.banned ? "Re-enable" : "Disable"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}