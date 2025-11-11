"use client";

import type { Role } from "@prisma/client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { getCommonTranslations } from "@/lib/common-translations";

const roleDefaultRoute: Record<Role, string> = {
  STUDENT: "/app/dashboard",
  TEACHER: "/app/teacher/dashboard",
  ADMIN: "/app/admin/users",
} as const;

const routeGuards: Array<{ match: (path: string) => boolean; allowed: Role[] }> = [
  { match: (path) => path.startsWith("/app/dashboard"), allowed: ["STUDENT"] },
  { match: (path) => path.startsWith("/app/teacher"), allowed: ["TEACHER", "ADMIN"] },
  { match: (path) => path.startsWith("/app/admin"), allowed: ["ADMIN"] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const common = getCommonTranslations(language);

  useEffect(() => {
    if (!loading && !user) {
      const redirect = encodeURIComponent(pathname || "/app/dashboard");
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, user, router, pathname]);

  useEffect(() => {
    if (loading || !user) return;
    const guard = routeGuards.find((rule) => rule.match(pathname));
    if (guard && !guard.allowed.includes(user.role)) {
      const fallback = roleDefaultRoute[user.role] ?? "/app/dashboard";
      if (pathname !== fallback) {
        router.replace(fallback);
      }
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <p className="text-sm text-muted-foreground">{common.appShell.loading}</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
