"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { getCommonTranslations } from "@/lib/common-translations";

export const SiteHeader = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const common = getCommonTranslations(language);

  const navItems = [
    { href: "/", label: common.nav.home },
    { href: "/courses", label: common.nav.courses },
    { href: "/books", label: common.nav.books },
    { href: "/login", label: common.nav.login },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm text-primary-foreground shadow-sm">
            OE
          </span>
          OzgesheEdu
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.href === "/login" && user) {
              return null;
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <>
              <Button variant="ghost" className="hidden md:inline-flex" asChild>
                <Link href={user.role === "STUDENT" ? "/app/dashboard" : `/app/${user.role.toLowerCase()}/dashboard`}>
                  {common.auth.dashboard}
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                {common.auth.logout}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="hidden md:inline-flex" asChild>
                <Link href="/login">{common.auth.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{common.auth.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
