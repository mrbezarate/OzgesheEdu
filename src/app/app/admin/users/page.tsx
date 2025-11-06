"use client";

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

  const { data, isLoading, isError } = useQuery<{ users: AdminUser[] }>({
    queryKey: ["admin-users"],
    queryFn: () => api.get<{ users: AdminUser[] }>("/api/admin/users"),
    enabled: user?.role === "ADMIN",
  });

  const updateUser = async (id: string, updates: Partial<{ role: string; isActive: boolean }>) => {
    await api.patch(`/api/admin/users/${id}`, updates);
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

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
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.users.map((item) => (
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
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
