"use client";

import { useMemo, useState } from "react";
import { Role } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/components/providers/auth-provider";
import type { AppUser } from "@/types";

interface AdminUser extends AppUser {
  isActive: boolean;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [sortMode, setSortMode] = useState<"alpha" | "teachers" | "students">("alpha");

  const { data, isLoading, isError } = useQuery<{ users: AdminUser[] }>({
    queryKey: ["admin-users"],
    queryFn: () => api.get<{ users: AdminUser[] }>("/api/admin/users"),
    enabled: user?.role === "ADMIN",
  });

  const updateUser = async (id: string, updates: Partial<{ role: string; isActive: boolean }>) => {
    await api.patch(`/api/admin/users/${id}`, updates);
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    const filtered =
      roleFilter === "ALL" ? data.users : data.users.filter((item) => item.role === roleFilter);
    const prioritized = [...filtered];
    if (sortMode === "teachers" || sortMode === "students") {
      const targetRole = sortMode === "teachers" ? "TEACHER" : "STUDENT";
      const priority = (role: Role) => (role === targetRole ? 0 : 1);
      prioritized.sort((a, b) => {
        const diff = priority(a.role) - priority(b.role);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
      });
      return prioritized;
    }
    return prioritized.sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.users, roleFilter, sortMode]);

  if (user?.role !== "ADMIN") {
    return <p className="text-sm text-muted-foreground">You do not have access to this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User management</h1>
        <p className="text-muted-foreground">Monitor platform access and assign roles.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Unable to load users.</p>
      ) : (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Click to toggle status or promote users.</CardDescription>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="role-filter" className="text-muted-foreground">
                  Role filter
                </label>
                <select
                  id="role-filter"
                  className="h-9 rounded-lg border border-border bg-background px-3"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
                >
                  <option value="ALL">All</option>
                  <option value="STUDENT">Students</option>
                  <option value="TEACHER">Teachers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="user-sort" className="text-muted-foreground">
                  Sort
                </label>
                <select
                  id="user-sort"
                  className="h-9 rounded-lg border border-border bg-background px-3"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as typeof sortMode)}
                >
                  <option value="alpha">A → Z</option>
                  <option value="teachers">Teachers first</option>
                  <option value="students">Students first</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredUsers.length ? (
              filteredUsers.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.email}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-1 font-semibold uppercase">{item.role}</span>
                    <span>{item.isActive ? "Active" : "Blocked"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => updateUser(item.id, { isActive: !item.isActive })}
                    >
                      {item.isActive ? "Disable" : "Activate"}
                    </Button>
                    {item.role !== "ADMIN" && (
                      <Button
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                        onClick={() => updateUser(item.id, { role: item.role === "TEACHER" ? "STUDENT" : "TEACHER" })}
                      >
                        Make {item.role === "TEACHER" ? "Student" : "Teacher"}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No users match the filter.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
